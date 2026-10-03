"""Bellacore Lead Engine - Motor híbrido de extracción de leads.

Combina la API de Google Places (búsqueda de negocios por texto) con scraping
ligero de emails desde los sitios web de cada resultado.

Configuración vía variables de entorno (ver .env.example):
- GOOGLE_PLACES_KEY    : clave de API de Google Places (opcional; sin clave se
                         ejecuta en modo DEMO).
- PLACES_TIMEOUT       : timeout por petición a Places (segundos, default 10).
- SCRAPE_TIMEOUT       : timeout por página scrapeada (segundos, default 6).
- MAX_CONCURRENT_SCRAPES : límite de peticiones web simultáneas (default 5).

Endpoints:
- GET  /health                  → estado del servicio.
- POST /api/v1/search           → busca leads (Google Places + scraping de emails).
- GET  /api/v1/export/csv       → exporta leads a CSV (utf-8-sig, compatible Excel).
- POST /api/v1/export/csv       → igual pero acepta el cuerpo JSON.
"""

from __future__ import annotations

import asyncio
import csv
import io
import json
import logging
import os
import re
import urllib.parse
from typing import Any, Optional

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

logger = logging.getLogger("omniscraper")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

load_dotenv()

# ---------------------------------------------------------------------------
# Constantes y configuración
# ---------------------------------------------------------------------------

GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PLACES_API_KEY: str = os.getenv("GOOGLE_PLACES_KEY", "").strip()

PLACES_TIMEOUT: float = float(os.getenv("PLACES_TIMEOUT", "10"))
SCRAPE_TIMEOUT: float = float(os.getenv("SCRAPE_TIMEOUT", "6"))
MAX_CONCURRENT_SCRAPES: int = int(os.getenv("MAX_CONCURRENT_SCRAPES", "5"))

SEARCH_LIMIT_MAX: int = 60
DEFAULT_LIMIT: int = 20
DEMO_ROWS: int = 5
MAX_HTML_SIZE_BYTES: int = 5_000_000
CORS_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

# Se usan en el filtrado de emails falsos/obsoletos.
_BLOCKED_FRAGMENTS: tuple[str, ...] = (
    "example",
    "noreply",
    "no-reply",
    "no_reply",
    "nobody",
    "test@",
    "prueba",
    "@2x",
    "@3x",
    "sentry",
    "schema.org",
    "w3.org",
    "example.com",
    "placeholder",
)
_BLOCKED_SUFFIXES: tuple[str, ...] = (
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".css",
    ".js",
    ".pdf",
)

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
# Sustituciones para emails ofuscados tipo "info[at]dominio.es".
_OBFUSCATIONS: tuple[tuple[str, str], ...] = (
    ("[at]", "@"),
    ("(at)", "@"),
    ("{at}", "@"),
    ("[dot]", "."),
    ("(dot)", "."),
    (" AT ", "@"),
)

# ---------------------------------------------------------------------------
# Modelos Pydantic (validación de entrada)
# ---------------------------------------------------------------------------


class SearchRequest(BaseModel):
    """Cuerpo de una petición de búsqueda de leads."""

    query: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="Término de negocio a buscar (p. ej. 'abogados').",
    )
    location: str = Field(
        default="",
        max_length=200,
        description="Ubicación opcional (p. ej. 'Barcelona').",
    )
    limit: int = Field(
        default=DEFAULT_LIMIT,
        ge=1,
        le=SEARCH_LIMIT_MAX,
        description=f"Límite de resultados (1-{SEARCH_LIMIT_MAX}).",
    )


class Lead(BaseModel):
    """Lead normalizado devuelto por la API."""

    name: str = ""
    address: str = ""
    rating: float = 0.0
    phone: str = ""
    email: str = ""
    website: str = ""
    source: str = ""


# ---------------------------------------------------------------------------
# Utilidades de validación y deduplicación
# ---------------------------------------------------------------------------


def _is_clean_email(email: str) -> bool:
    """Devuelve True si el email parece real (no es de ejemplo ni un asset)."""
    lower = email.lower()
    if not EMAIL_RE.fullmatch(lower):
        return False
    if any(fragment in lower for fragment in _BLOCKED_FRAGMENTS):
        return False
    if lower.endswith(_BLOCKED_SUFFIXES):
        return False
    return True


def _normalize_email(raw: str) -> str:
    """Aplica desofuscación básica y normaliza minúsculas/espacios."""
    candidate = raw.strip()
    for src, dst in _OBFUSCATIONS:
        candidate = candidate.replace(src, dst)
    # Elimina espacios que quedan alrededor de @ y . tras desofuscar.
    candidate = re.sub(r"\s*@\s*", "@", candidate)
    candidate = re.sub(r"\s*\.\s*", ".", candidate)
    return candidate.lower()


def _lead_dedupe_key(lead: dict[str, Any]) -> str:
    """Clave de deduplicación: email > teléfono > nombre+address."""
    email = _normalize_email(lead.get("email") or "")
    phone = re.sub(r"\D", "", lead.get("phone") or "")
    if email:
        return f"email:{email}"
    if phone:
        return f"phone:{phone}"
    return f"name:{lead.get('name', '')}|{lead.get('address', '')}".lower()


def _dedupe_leads(leads: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Elimina leads duplicados conservando el primer resultado de cada clave."""
    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for lead in leads:
        key = _lead_dedupe_key(lead)
        if key in seen:
            continue
        seen.add(key)
        unique.append(lead)
    return unique


def _build_lead(place: dict[str, Any], emails: list[str], source: str) -> dict[str, Any]:
    """Convierte un place de Google Places en un Lead normalizado."""
    website = place.get("website") or ""
    return {
        "name": place.get("name") or "",
        "address": place.get("formatted_address") or "",
        "rating": place.get("rating") or 0.0,
        "phone": place.get("formatted_phone_number") or "",
        "email": emails[0] if emails else "",
        "website": website,
        "source": source,
    }


def _demo_lead(query: str, location: str, index: int) -> dict[str, Any]:
    """Genera un lead de demostración determinista (modo sin API key)."""
    suffix = index + 1
    return {
        "name": f"Negocio {query.title()} #{suffix} en {location or 'la zona'}",
        "address": f"Calle Ejemplo {suffix * 10}, {location or 'España'}",
        "rating": round(4.0 + (index * 0.1), 1),
        "phone": f"+34 6{10000000 + index}",
        "email": f"info@negocio{suffix}.es",
        "website": f"https://negocio{suffix}.es",
        "source": "DEMO_MODE",
    }


# ---------------------------------------------------------------------------
# Cliente HTTP y scraping
# ---------------------------------------------------------------------------


def _default_headers() -> dict[str, str]:
    return {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
        ),
        "Accept-Language": "es-ES,es;q=0.9",
    }


def _build_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        follow_redirects=True,
        timeout=httpx.Timeout(SCRAPE_TIMEOUT),
        headers=_default_headers(),
        limits=httpx.Limits(max_connections=MAX_CONCURRENT_SCRAPES),
    )


async def extract_emails_from_website(client: httpx.AsyncClient, url: str) -> list[str]:
    """Scrapea un sitio web y devuelve los emails válidos encontrados.

    Maneja timeouts, respuestas no-HTML y HTML no parseable sin romper la
    búsqueda. También extrae emails de enlaces ``mailto:`` y desofuscación
    básica (``info[at]dominio.es``).
    """
    if not url or not url.startswith(("http://", "https://")):
        return []
    try:
        resp = await client.get(url, timeout=SCRAPE_TIMEOUT)
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        logger.debug("Scrape fallido para %s: %s", url, exc)
        return []

    # Protección anti HTML gigante.
    content = resp.content
    if len(content) > MAX_HTML_SIZE_BYTES:
        content = content[:MAX_HTML_SIZE_BYTES]

    ctype = (resp.headers.get("content-type") or "").lower()
    is_html = "html" in ctype or "xhtml" in ctype or not ctype
    if not is_html and ctype.startswith(("image/", "application/pdf", "application/zip", "audio/", "video/")):
        return []

    # Decodificación tolerante a errores.
    text = content.decode("utf-8", errors="ignore")

    emails: set[str] = set()

    # 1) Enlaces mailto: con BeautifulSoup.
    try:
        soup = BeautifulSoup(text, "html.parser")
        for anchor in soup.find_all("a", href=True):
            href = (anchor.get("href") or "").strip()
            if href.lower().startswith("mailto:"):
                raw = urllib.parse.unquote(href[len("mailto:"):].split("?")[0])
                email = _normalize_email(raw)
                if _is_clean_email(email):
                    emails.add(email)
    except Exception as exc:  # HTML malformado: no detiene la búsqueda.
        logger.debug("HTML no parseable en %s: %s", url, exc)

    # 2) Patrón email en el texto, con desofuscación básica.
    deobfuscated = text
    for src, dst in _OBFUSCATIONS:
        deobfuscated = deobfuscated.replace(src, dst)
    for match in EMAIL_RE.findall(deobfuscated):
        email = _normalize_email(match)
        if _is_clean_email(email):
            emails.add(email)

    return sorted(emails)


# ---------------------------------------------------------------------------
# Google Places (petición, reintentos y paginación)
# ---------------------------------------------------------------------------


class PlacesAPIError(RuntimeError):
    """Error controlado de la API de Google Places."""


async def _places_request(client: httpx.AsyncClient, params: dict[str, Any]) -> dict[str, Any]:
    """GET a Places con reintentos ante timeout y límite de peticiones."""
    attempts = 3
    for attempt in range(1, attempts + 1):
        try:
            resp = await client.get(
                GOOGLE_PLACES_URL, params=params, timeout=PLACES_TIMEOUT
            )
            if resp.status_code == 429:
                await asyncio.sleep(attempt * 3)  # rate limit: espera progresiva
                continue
            resp.raise_for_status()
            return resp.json()
        except httpx.TimeoutException:
            if attempt == attempts:
                raise
            await asyncio.sleep(attempt * 2)
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code >= 500 and attempt < attempts:
                await asyncio.sleep(attempt * 2)
                continue
            raise PlacesAPIError(f"Google Places devolvió HTTP {exc.response.status_code}") from exc
    raise PlacesAPIError("Google Places no respondió tras reintentos")


async def fetch_places(
    client: httpx.AsyncClient,
    query: str,
    location: str,
    limit: int,
) -> list[dict[str, Any]]:
    """Consulta Google Places con paginación vía next_page_token.

    Lanza :class:`PlacesAPIError` para errores permanentes de la API.
    """
    if not PLACES_API_KEY:
        return []

    full_query = f"{query} en {location}" if location else query
    params: dict[str, Any] = {
        "query": full_query,
        "key": PLACES_API_KEY,
        "language": "es",
    }

    results: list[dict[str, Any]] = []
    seen_tokens: set[str] = set()

    while True:
        data = await _places_request(client, params)

        status = data.get("status", "")
        if status == "OVER_QUERY_LIMIT":
            raise PlacesAPIError("Cuota de Google Places agotada (OVER_QUERY_LIMIT). Revisa la API key.")
        if status == "REQUEST_DENIED":
            raise PlacesAPIError("Google Places rechazó la petición (REQUEST_DENIED). Revisa la API key.")
        if status == "INVALID_REQUEST":
            raise PlacesAPIError("Petición inválida a Google Places (INVALID_REQUEST).")
        if status not in ("OK", "ZERO_RESULTS"):
            raise PlacesAPIError(f"Google Places devolvió estado inesperado: {status!r}")
        if status == "ZERO_RESULTS":
            break

        results.extend(data.get("results", []))
        if len(results) >= limit:
            break

        next_token = data.get("next_page_token")
        if not next_token:
            break
        if next_token in seen_tokens:
            # Google devolvió el mismo token: no hay progreso, detener.
            logger.warning("Google Places repitió next_page_token; paginación detenida.")
            break
        seen_tokens.add(next_token)
        params = {"pagetoken": next_token, "key": PLACES_API_KEY}
        # Google recomienda un pequeño retardo antes de usar el token.
        await asyncio.sleep(2)

    return results[:limit]


# ---------------------------------------------------------------------------
# Lógica principal de búsqueda
# ---------------------------------------------------------------------------


async def _run_search(payload: SearchRequest) -> dict[str, Any]:
    """Ejecuta la búsqueda híbrida completa (Places + scraping)."""
    query = payload.query.strip()
    location = payload.location.strip()
    limit = payload.limit

    async with _build_client() as client:
        try:
            places = await fetch_places(client, query, location, limit)
        except PlacesAPIError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        if places:
            # Limitar el scraping a la página actual (el limite ya aplicó en Places).
            semaphore = asyncio.Semaphore(MAX_CONCURRENT_SCRAPES)

            async def _scrape(place: dict[str, Any]) -> dict[str, Any]:
                async with semaphore:
                    emails = await extract_emails_from_website(client, place.get("website") or "")
                    return _build_lead(place, emails, "LIVE_HYBRID")

            leads: list[dict[str, Any]] = await asyncio.gather(*(_scrape(p) for p in places))
        else:
            # Modo demo: sin API key configurada.
            n_demo = min(DEMO_ROWS, limit)
            leads = [_demo_lead(query, location, i) for i in range(n_demo)]
    leads = _dedupe_leads(leads)
    return {
        "leads": leads,
        "total": len(leads),
        "query": query,
        "location": location,
        "mode": "LIVE_HYBRID" if places else "DEMO_MODE",
    }


# ---------------------------------------------------------------------------
# Aplicación FastAPI
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Universal Web Intelligence Engine",
    description="Motor universal de inteligencia web basado en activos Bellacore verificados.",
    version="2.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    """Comprueba que el servicio está vivo."""
    return {
        "status": "ok",
        "service": "omniscraper",
        "mode": "LIVE_HYBRID" if PLACES_API_KEY else "DEMO_MODE",
    }


@app.post("/api/v1/search", tags=["leads"])
async def search_leads(payload: SearchRequest) -> dict[str, Any]:
    """Busca leads por término de negocio y ubicación."""
    return await _run_search(payload)


def _build_csv(leads: list[dict[str, Any]]) -> bytes:
    """Serializa los leads a CSV con BOM UTF-8 (utf-8-sig) para Excel."""
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\r\n")
    writer.writerow(["Name", "Address", "Rating", "Phone", "Email", "Website", "Source"])
    for lead in leads:
        writer.writerow(
            [
                lead.get("name", ""),
                lead.get("address", ""),
                lead.get("rating", ""),
                lead.get("phone", ""),
                lead.get("email", ""),
                lead.get("website", ""),
                lead.get("source", ""),
            ]
        )
    return buffer.getvalue().encode("utf-8-sig")


@app.get("/api/v1/export/csv", tags=["leads"])
async def export_csv(leads_json: str = Query(..., description="Lista de leads como JSON URL-encoded")) -> Response:
    """Exporta una lista de leads (pasada como query param) a CSV con encoding utf-8-sig."""
    try:
        leads = json.loads(leads_json)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="leads_json no es JSON válido.") from exc
    if not isinstance(leads, list):
        raise HTTPException(status_code=400, detail="leads_json debe ser una lista de objetos.")
    return _csv_response(_build_csv(leads))


@app.post("/api/v1/export/csv", tags=["leads"])
async def export_csv_post(payload: dict[str, Any]) -> Response:
    """Exporta una lista de leads (cuerpo JSON ``{"leads": [...]}``) a CSV."""
    leads = payload.get("leads")
    if not isinstance(leads, list):
        raise HTTPException(status_code=400, detail="El cuerpo debe incluir una lista 'leads'.")
    return _csv_response(_build_csv(leads))


def _csv_response(content: bytes) -> Response:
    """Envoltorio de Response con headers correctos de descarga."""
    return Response(
        content=content,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="bellacore_leads.csv"'},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8002)

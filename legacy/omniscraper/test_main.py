"""Tests de Bellacore Lead Engine.

Se ejecutan sin red: los endpoints se prueban con ASGITransport (modo DEMO) y
las funciones de scraping/paginación con un cliente HTTP simulado (MockTransport).
"""

from __future__ import annotations

import asyncio
import json

import httpx
import pytest
import main
from fastapi.testclient import TestClient

from main import (
    DEMO_ROWS,
    _build_csv,
    _dedupe_leads,
    _is_clean_email,
    _normalize_email,
    app,
    extract_emails_from_website,
    fetch_places,
)

# ---------------------------------------------------------------------------
# Utilidades async sin pytest-asyncio (asyncio.run)
# ---------------------------------------------------------------------------


def run(coro):
    """Ejecuta una corutina en un loop síncrono (evita dependencia extra)."""
    return asyncio.run(coro)


# ---------------------------------------------------------------------------
# Endpoints básicos (modo DEMO, sin red)
# ---------------------------------------------------------------------------

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["service"] == "omniscraper"
    assert body["mode"] in ("LIVE_HYBRID", "DEMO_MODE")


def test_search_demo_mode():
    resp = client.post(
        "/api/v1/search",
        json={"query": "abogados", "location": "Barcelona", "limit": 5},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["mode"] == "DEMO_MODE"
    assert body["total"] == DEMO_ROWS
    assert len(body["leads"]) == DEMO_ROWS
    for lead in body["leads"]:
        assert lead["source"] == "DEMO_MODE"
        assert lead["name"]
        assert lead["email"]


def test_search_validation_query_too_short():
    resp = client.post("/api/v1/search", json={"query": "a"})
    assert resp.status_code == 422


def test_search_validation_limit_out_of_range():
    resp = client.post("/api/v1/search", json={"query": "abogados", "limit": 999})
    assert resp.status_code == 422
    resp = client.post("/api/v1/search", json={"query": "abogados", "limit": 0})
    assert resp.status_code == 422


def test_search_validation_missing_query():
    resp = client.post("/api/v1/search", json={})
    assert resp.status_code == 422


# ---------------------------------------------------------------------------
# Export CSV (utf-8-sig)
# ---------------------------------------------------------------------------


def test_export_csv_get_bom_and_header():
    leads = [{"name": "Café El Sol", "email": "hola@cafesol.es"}]
    resp = client.get("/api/v1/export/csv", params={"leads_json": json.dumps(leads)})
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/csv")
    raw = resp.content
    assert raw.startswith(b"\xef\xbb\xbf"), "El CSV debe llevar BOM UTF-8 (utf-8-sig)"
    text = raw.decode("utf-8-sig")
    assert "Name,Address" in text
    assert "Café El Sol" in text


def test_export_csv_post():
    leads = [{"name": "Panadería", "phone": "+34 600000001"}]
    resp = client.post("/api/v1/export/csv", json={"leads": leads})
    assert resp.status_code == 200
    assert resp.content.startswith(b"\xef\xbb\xbf")


def test_export_csv_invalid_json():
    resp = client.get("/api/v1/export/csv", params={"leads_json": "no-json"})
    assert resp.status_code == 400


def test_export_csv_not_a_list():
    resp = client.get("/api/v1/export/csv", params={"leads_json": json.dumps({"name": "x"})})
    assert resp.status_code == 400


def test_build_csv_special_chars():
    data = _build_csv([{"name": "Ñoño & Co.", "email": "a@b.es"}])
    assert data.startswith(b"\xef\xbb\xbf")
    assert "Ñoño" in data.decode("utf-8-sig")


# ---------------------------------------------------------------------------
# Deduplicación
# ---------------------------------------------------------------------------


def test_dedupe_by_email():
    leads = [
        {"name": "A", "email": "info@x.es", "phone": "1", "address": ""},
        {"name": "B", "email": "INFO@x.es", "phone": "2", "address": ""},
        {"name": "C", "email": "", "phone": "1", "address": ""},
    ]
    deduped = _dedupe_leads(leads)
    assert len(deduped) == 2  # B se descarta por email duplicado (case-insensitive)


def test_dedupe_by_phone_fallback():
    leads = [
        {"name": "A", "email": "", "phone": "+34 600 000 001", "address": "x"},
        {"name": "B", "email": "", "phone": "+34600000001", "address": "y"},
    ]
    assert len(_dedupe_leads(leads)) == 1


# ---------------------------------------------------------------------------
# Validación de emails
# ---------------------------------------------------------------------------


def test_is_clean_email():
    assert _is_clean_email("hola@empresa.es")
    assert not _is_clean_email("info@example.com")
    assert not _is_clean_email("noreply@empresa.es")
    assert not _is_clean_email("test@empresa.es")
    assert not _is_clean_email("logo@empresa.png")
    assert not _is_clean_email("hola@empresa")  # sin TLD válido


def test_normalize_email_obfuscation():
    assert _normalize_email("info[at]dominio.es") == "info@dominio.es"
    assert _normalize_email("  INFO (at) DOMINIO.ES ") == "info@dominio.es"


# ---------------------------------------------------------------------------
# Scraping con HTML simulado (sin red)
# ---------------------------------------------------------------------------


def _mock_html(url: str) -> httpx.AsyncClient:
    body = """<!DOCTYPE html><html><body>
        <a href="mailto:contacto@empresa.es">Email</a>
        <a href="mailto:ventas@empresa.es?subject=Hola">Ventas</a>
        <p>Escríbenos a info[at]empresa.es o a soporte[dot]x[at]empresa.es</p>
        <script>var fake="test@example.com";</script>
        <img src="team@empresa.jpg">
    </body></html>"""
    transport = httpx.MockTransport(handler=lambda request: httpx.Response(200, text=body))
    return httpx.AsyncClient(transport=transport)


def test_extract_emails_from_website():
    client_ = _mock_html("https://empresa.es")
    emails = run(extract_emails_from_website(client_, "https://empresa.es"))
    assert "contacto@empresa.es" in emails
    assert "ventas@empresa.es" in emails
    assert "info@empresa.es" in emails          # desofuscado [at]
    assert "soporte.x@empresa.es" in emails     # desofuscado [dot]
    assert "test@example.com" not in emails     # bloqueado (example)
    assert "team@empresa.jpg" not in emails     # bloqueado (.jpg)


def test_extract_emails_empty_on_errors():
    transport = httpx.MockTransport(
        handler=lambda request: httpx.Response(500, text="boom")
    )
    client_ = httpx.AsyncClient(transport=transport)
    assert run(extract_emails_from_website(client_, "https://roto.es")) == []


def test_extract_emails_rejects_invalid_url():
    client_ = httpx.AsyncClient()
    assert run(extract_emails_from_website(client_, "")) == []
    assert run(extract_emails_from_website(client_, "not-a-url")) == []


def test_extract_emails_non_html_content():
    transport = httpx.MockTransport(
        handler=lambda request: httpx.Response(200, content=b"\x89PNG\r\n\x1a\n...")
    )
    client_ = httpx.AsyncClient(transport=transport)
    assert run(extract_emails_from_website(client_, "https://img.es/foto.png")) == []


# ---------------------------------------------------------------------------
# Paginación de Google Places (mock sin red)
# ---------------------------------------------------------------------------


def _places_chain(batches: list[dict]) -> httpx.AsyncClient:
    """Devuelve un cliente que responde a cada llamada con el batch siguiente."""
    iterator = iter(batches)
    tokens: dict[str, bool] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal tokens
        try:
            batch = next(iterator)
        except StopIteration:
            return httpx.Response(500, text="no more")
        return httpx.Response(200, json=batch)

    transport = httpx.MockTransport(handler=handler)
    return httpx.AsyncClient(transport=transport)


def _mock_places_env(monkeypatch):
    monkeypatch.setattr("main.PLACES_API_KEY", "test-key")


def test_fetch_places_pagination(monkeypatch):
    _mock_places_env(monkeypatch)
    page1 = {
        "status": "OK",
        "results": [{"name": f"Negocio {i}", "formatted_address": f"Calle {i}"} for i in range(3)],
        "next_page_token": "token-2",
    }
    page2 = {
        "status": "OK",
        "results": [{"name": f"Negocio {i}", "formatted_address": f"Calle {i}"} for i in range(3, 6)],
    }
    client_ = _places_chain([page1, page2])
    results = run(fetch_places(client_, "abogados", "Madrid", limit=6))
    assert len(results) == 6


def test_fetch_places_zero_results(monkeypatch):
    _mock_places_env(monkeypatch)
    client_ = _places_chain([{"status": "ZERO_RESULTS", "results": []}])
    assert run(fetch_places(client_, "nada", "Madrid", limit=10)) == []


def test_fetch_places_handles_error_status(monkeypatch):
    _mock_places_env(monkeypatch)
    client_ = _places_chain([{"status": "REQUEST_DENIED", "results": []}])
    with pytest.raises(Exception, match="REQUEST_DENIED"):
        run(fetch_places(client_, "abogados", "Madrid", limit=10))


def test_fetch_places_without_key_returns_empty(monkeypatch):
    monkeypatch.setattr("main.PLACES_API_KEY", "")
    client_ = httpx.AsyncClient()
    assert run(fetch_places(client_, "abogados", "Madrid", limit=10)) == []


# ---------------------------------------------------------------------------
# Flujo híbrido LIVE sin sobrescritura DEMO
# ---------------------------------------------------------------------------


def test_live_search_preserves_places_results(monkeypatch):
    async def fake_fetch_places(client_, query, location, limit):
        return [{
            "name": "Empresa real",
            "formatted_address": "Calle Real 1",
            "website": "https://empresa.es",
        }]

    async def fake_extract_emails(client_, url):
        return ["contacto@empresa.es"]

    monkeypatch.setattr("main.fetch_places", fake_fetch_places)
    monkeypatch.setattr("main.extract_emails_from_website", fake_extract_emails)

    body = run(main._run_search(main.SearchRequest(query="abogados", location="Madrid", limit=1)))

    assert body["mode"] == "LIVE_HYBRID"
    assert body["total"] == 1
    assert body["leads"][0]["name"] == "Empresa real"
    assert body["leads"][0]["source"] == "LIVE_HYBRID"


# ---------------------------------------------------------------------------
# Seguridad de configuración
# ---------------------------------------------------------------------------


def test_cors_does_not_allow_wildcard_origin():
    assert "*" not in main.CORS_ORIGINS
    middleware = next(item for item in app.user_middleware if item.cls.__name__ == "CORSMiddleware")
    assert middleware.kwargs["allow_origins"] == main.CORS_ORIGINS
    assert middleware.kwargs["allow_methods"] == ["GET", "POST"]

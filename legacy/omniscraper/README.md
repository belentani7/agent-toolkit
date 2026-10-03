# Universal Web Intelligence Engine (Module 07)

Motor híbrido de extracción de leads: **Google Places API** (búsqueda de negocios)
+ **scraping de emails** desde el sitio web de cada negocio.

## Funcionalidades

- Búsqueda por término + ubicación con la **Text Search API** de Google Places.
- Paginación automática (`next_page_token`) hasta el límite solicitado.
- Scraping concurrente de emails por negocio con:
  - Timeouts y reintentos ante rate limits (429 / `OVER_QUERY_LIMIT`).
  - Protección contra HTML no parseable, binarios y páginas gigantes.
  - Extracción de enlaces `mailto:` y desofuscación básica (`info[at]dominio.es`).
  - Filtrado de emails falsos (`@example.`, `noreply`, `test@`, imágenes, etc.).
- **Deduplicación** de leads por email/teléfono/nombre.
- **Exportación CSV** con encoding `utf-8-sig` (BOM) para abrir en Excel.
- **Modo DEMO** integrado cuando no hay API key configurada.

## Requisitos

- Python 3.10+

## Instalación

```bash
cd omniscraper
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Configuración

Copia `.env.example` a `.env` y añade tu clave de Google Places:

```bash
copy .env.example .env
```

| Variable | Descripción | Default |
|---|---|---|
| `GOOGLE_PLACES_KEY` | API key de Google Places (Text Search) | vacía → modo DEMO |
| `PLACES_TIMEOUT` | Timeout por petición a Places (s) | `10` |
| `SCRAPE_TIMEOUT` | Timeout por sitio web scrapeado (s) | `6` |
| `MAX_CONCURRENT_SCRAPES` | Peticiones web simultáneas | `5` |
| `CORS_ORIGINS` | Orígenes de navegador permitidos, separados por comas | vacío |

Obtención de la clave: [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).

## Ejecución

```bash
uvicorn main:app --reload --port 8002
```

Docs interactivas en `http://127.0.0.1:8002/docs`.

## API

### `GET /health`
Estado del servicio.

### `POST /api/v1/search`
Cuerpo:
```json
{
  "query": "abogados",
  "location": "Barcelona",
  "limit": 20
}
```
`limit` entre 1 y 60. Respuesta:
```json
{
  "leads": [
    {
      "name": "Bufete García",
      "address": "Av. Diagonal 100, Barcelona",
      "rating": 4.7,
      "phone": "+34 93 000 00 00",
      "email": "info@bufete.es",
      "website": "https://bufete.es",
      "source": "LIVE_HYBRID"
    }
  ],
  "total": 1,
  "query": "abogados",
  "location": "Barcelona",
  "mode": "LIVE_HYBRID"
}
```

### `GET /api/v1/export/csv?leads_json=<json>`
Exporta una lista de leads (JSON URL-encoded) a CSV.

### `POST /api/v1/export/csv`
Igual pero con cuerpo `{"leads": [...]}`.

## Tests

```bash
python -m pytest -v
```

Los tests no usan red: simulan Google Places y el scraping con `MockTransport`.

## Stack

- FastAPI + Uvicorn (backend)
- Google Places API (búsqueda de negocios)
- httpx + BeautifulSoup (scraping de emails)
- CSV `utf-8-sig` (compatibilidad Excel)


## Provenance

El núcleo inicial procede del paquete Bellacore Lead Engine descargado desde Google Drive conectado. No se han añadido proveedores ni scraping no presentes en el activo de origen.

# Manus Core Engine

Motor local-first de misiones web. La interfaz web es opcional: la máquina funciona por CLI y API REST, extrae evidencia de fuentes públicas y persiste los resultados localmente.

## Ejecutar

Instala dependencias y lanza una misión desde un archivo declarativo:

```bash
pnpm install
pnpm manus -- mission run-file examples/mission.example.yaml
```

También puedes proporcionar URLs directamente:

```bash
pnpm manus -- mission run https://example.com https://github.com
```

Las ejecuciones se guardan en `artifacts/missions/<mission-id>/` junto con su resultado, eventos NDJSON y memoria de estrategias por dominio. Este directorio está excluido de Git para no publicar datos extraídos accidentalmente.

## Consultar y exportar

```bash
pnpm manus -- mission status <mission-id>
pnpm manus -- mission results <mission-id> json
pnpm manus -- mission results <mission-id> csv > resultado.csv
```

## API REST

Inicia el servidor con `pnpm dev`. La API no depende del frontend:

```bash
curl -X POST http://localhost:3000/api/missions/run \
  -H 'Content-Type: application/json' \
  --data '{"name":"Auditoría","objective":"Extraer evidencia pública","urls":["https://example.com"]}'
```

Las rutas disponibles son `POST /api/missions`, `POST /api/missions/run`, `GET /api/missions/:id`, `GET /api/missions/:id/status` y `GET /api/missions/:id/results?format=csv`.

## Protecciones y control operativo

El engine deduplica URLs, limita concurrencia y frecuencia, reintenta errores transitorios, registra eventos, calcula métricas deterministas y bloquea destinos de localhost, metadata y redes privadas para impedir SSRF. No inventa resultados: cada campo proviene de la respuesta HTTP obtenida o queda vacío con el error documentado.

## Stack local opcional

El motor puede inspeccionar de forma honesta qué herramientas locales están realmente instaladas; no declara conexiones simuladas:

```bash
pnpm manus -- stack inspect
```

El comando detecta Odysseus, OpenCode, Goose, Cline, Roo, Aider, OpenHands, Ollama, llama.cpp, LM Studio y n8n cuando están presentes en el sistema. La ejecución básica de misiones no depende de ellas.

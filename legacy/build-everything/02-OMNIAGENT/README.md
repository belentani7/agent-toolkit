# OmniAgent CLI

Orquestador multi-agente que enruta tareas al mejor modelo IA gratuito de forma automática.

## Providers (All Free Tiers)

| Provider | Models | RPM |
|----------|--------|-----|
| Groq | Llama 3.3 70B, Mixtral 8x7B | 30 |
| Google Gemini | Gemini 2.0 Flash | 60 |
| OpenRouter | Llama 3.3, Gemini Flash, DeepSeek | 20 |
| NVIDIA NIM | Llama 3.1 70B, Nemotron 70B | 20 |
| Cerebras | Llama 3.1 70B/8B | 30 |
| DeepSeek | DeepSeek Chat/Coder | 20 |

## Setup

```bash
# Al menos una key vía variables de entorno o el .env local
export GROQ_API_KEY="gsk_..."
export GOOGLE_API_KEY="AI..."
export OPENROUTER_API_KEY="sk-or-..."

# Ejecutar
python omniagent.py
```

## Commands

```bash
python omniagent.py                          # Modo interactivo
python omniagent.py chat "explain X"         # Prompt directo
python omniagent.py providers                # Estado de proveedores
python omniagent.py stats                    # Estadísticas de uso
python omniagent.py "prompt" --json          # Salida JSON
python omniagent.py chat "X" --system "..."  # Mensaje de sistema
python omniagent.py chat "X" --max-tokens 4096 --timeout 120
python omniagent.py chat "X" --no-cache      # Desactiva la caché
```

## Features

- Clasificación automática de tareas (code/research/creative/chat/heavy)
- Enrutado al proveedor + modelo óptimo por tarea
- Fallback automático entre proveedores
- Retries con backoff exponencial ante 429 / 5xx (respeta `Retry-After`)
- Builders de petición específicos por proveedor (Gemini usa su API nativa)
- Caché de respuestas (TTL 1 hora)
- Rate limiting por proveedor (ventana deslizante 60s)
- Timeout y max_tokens configurables
- Estadísticas de uso

## Notas

- No se incluyen API keys reales. El `.env` local (no versionado) se carga si existe.
- Requiere `httpx` (se instala automáticamente si falta).

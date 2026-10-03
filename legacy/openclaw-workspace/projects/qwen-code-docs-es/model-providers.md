# Proveedores de modelos

Qwen Code puede conectarse a muchos proveedores de modelos: los planes oficiales de Alibaba Cloud ModelStudio (Coding Plan, **Token Plan**, Standard API Key), proveedores de terceros y servidores locales. Esta guía explica cómo configurarlos y cuándo elegir cada uno.

> 🧭 El comando `/auth` lista tres opciones principales: **Alibaba ModelStudio**, **Third-party Providers** y **Custom Provider**. Dentro de una sesión, `/model` permite cambiar entre todos los modelos configurados.

## ¿Qué plan elegir?

| Necesidad | Opción recomendada |
|---|---|
| Desarrollo individual, coste mensual predecible | **Coding Plan** |
| Equipos o empresas, facturación por uso con endpoint dedicado | **Token Plan** ⭐ |
| Ya tienes una API key de ModelStudio | **Standard API Key** |
| Usas OpenRouter, DeepSeek, Anthropic, Gemini… | **Third-party Providers** |
| Modelo local (Ollama, vLLM, LM Studio) o proxy propio | **Custom Provider** |

> ⚠️ **Qwen OAuth fue descontinuado el 15 de abril de 2026.** Si lo usabas, ejecuta `/auth` y elige uno de los métodos anteriores.

---

## 🚀 Token Plan (para equipos y empresas)

El **Token Plan** es la opción de Alibaba Cloud ModelStudio pensada para equipos y empresas:

- **Facturación por uso** (pay-as-you-go): pagas por los tokens consumidos, sin cuotas fijas.
- **Endpoint dedicado**: las peticiones van por una ruta separada, lo que mejora la estabilidad y facilita la gobernanza del tráfico de tu organización.
- **Gestión centralizada**: se integra con el workspace `.qwen`, que centraliza el seguimiento de costes de todo el uso de Qwen Code en tu organización.
- **Ideal para CI/CD y entornos headless**: al basarse en API key, se configura fácilmente con variables de entorno sin flujos de login interactivos.

### Cómo activarlo

1. Ejecuta `qwen` y, dentro de la sesión, el comando `/auth`.
2. Selecciona **Alibaba ModelStudio**.
3. En el submenú, elige **Token Plan**.
4. Sigue las instrucciones para conectar tu cuenta/API key.

### Configuración headless (CI, contenedores, scripts)

Para automatización, el Token Plan se configura con la **API key** y el **endpoint dedicado** que te proporciona la consola de ModelStudio al activarlo. El patrón es el mismo que el de cualquier proveedor OpenAI-compatible: defines una variable de entorno para la clave, apuntas `OPENAI_BASE_URL` al endpoint dedicado y eliges el modelo.

```bash
# Valores ilustrativos: sustituye la API key y el endpoint por los que te dé tu consola
export TU_API_KEY_TOKEN_PLAN="***"
export OPENAI_BASE_URL="https://TU-ENDPOINT-DEDICADO/v1"
export OPENAI_MODEL="qwen3-coder-plus"
```

> 💡 El endpoint dedicado y la API key exactos del Token Plan se obtienen en la consola de ModelStudio al activar el plan ([consola Beijing](https://bailian.console.aliyun.com/) / [consola internacional](https://modelstudio.console.alibabacloud.com/)).

### Ejemplo con settings.json

> Los valores de `baseUrl` y el nombre de la variable de entorno son **ilustrativos**: usa los que te proporcione tu consola de ModelStudio.

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3-coder-plus",
        "name": "qwen3-coder-plus (Token Plan)",
        "baseUrl": "https://TU-ENDPOINT-DEDICADO/v1",
        "description": "Qwen3-Coder vía Token Plan (facturación por uso)",
        "envKey": "TU_API_KEY_TOKEN_PLAN"
      }
    ]
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "qwen3-coder-plus"
  }
}
```

Y la clave en `~/.qwen/.env` (fuera de git):

```bash
TU_API_KEY_TOKEN_PLAN=***
```

### ¿Coding Plan o Token Plan?

| | Coding Plan | Token Plan |
|---|---|---|
| Público | Desarrolladores individuales | Equipos y empresas |
| Facturación | Cuota mensual fija con cuota semanal incluida | Por uso (tokens) |
| Endpoint | `https://coding.dashscope.aliyuncs.com/v1` (o `coding-intl.`) | Endpoint dedicado |
| Modelos | Qwen, GLM, Kimi, MiniMax y más | Modelos Qwen según tu plan |
| Headless/CI | Sí | Sí (recomendado) |

---

## 💳 Coding Plan (desarrolladores individuales)

Suscripción mensual con cuota incluida y una amplia selección de modelos.

**Setup interactivo:**

1. Ejecuta `qwen` → `/auth` → **Alibaba ModelStudio** → **Coding Plan**
2. Elige tu región (Beijing o internacional)
3. Introduce tu clave `sk-sp-xxxxxxxxx`

Tras autenticarte, `/model` mostrará todos los modelos del plan (p. ej. `qwen3.5-plus`, `qwen3.6-plus`, `qwen3.7-plus`, `qwen3-coder-plus`, `qwen3-coder-next`, `qwen3-max-2026-01-23`, `glm-5`, `glm-4.7`, `kimi-k2.5`, `MiniMax-M2.5`).

**Regiones:**

| Región | Endpoint |
|---|---|
| China | `https://coding.dashscope.aliyuncs.com/v1` |
| Internacional | `https://coding-intl.dashscope.aliyuncs.com/v1` |

**Setup headless:**

```bash
export BAILIAN_CODING_PLAN_API_KEY="***"
export OPENAI_BASE_URL="https://coding.dashscope.aliyuncs.com/v1"
export OPENAI_MODEL="qwen3-coder-plus"
```

> 🔒 La clave del Coding Plan se guarda en la variable reservada `BAILIAN_CODING_PLAN_API_KEY`. Por seguridad, muévela de `settings.json` a `~/.qwen/.env`.

> 🔄 **Actualizaciones automáticas**: las configuraciones del Coding Plan tienen versión. Cuando Qwen Code detecta una plantilla más nueva te pedirá actualizar; tus modelos personalizados añadidos manualmente se conservan.

---

## 🌐 Proveedores de terceros

Puedes conectar proveedores compatibles con el protocolo OpenAI (OpenRouter, Requesty, ModelScope…), además de Anthropic, Gemini y Vertex AI.

### Protocolos soportados

| Protocolo | Clave en `modelProviders` | Variables de entorno |
|---|---|---|
| OpenAI-compatible | `openai` | `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` |
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL` |
| Google GenAI | `gemini` | `GEMINI_API_KEY`, `GEMINI_MODEL` |
| Vertex AI | `vertex-ai` | `GOOGLE_API_KEY` o `GOOGLE_CLOUD_PROJECT` |

### Ejemplo multi-proveedor

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3-coder-plus",
        "name": "Qwen3-Coder (DashScope)",
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "envKey": "DASHSCOPE_API_KEY"
      },
      {
        "id": "openai/gpt-4o",
        "name": "GPT-4o (vía OpenRouter)",
        "envKey": "OPENROUTER_API_KEY",
        "baseUrl": "https://openrouter.ai/api/v1"
      }
    ],
    "anthropic": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "envKey": "ANTHROPIC_API_KEY"
      }
    ],
    "gemini": [
      {
        "id": "gemini-2.5-pro",
        "name": "Gemini 2.5 Pro",
        "envKey": "GEMINI_API_KEY"
      }
    ]
  },
  "security": { "auth": { "selectedType": "openai" } },
  "model": { "name": "qwen3-coder-plus" }
}
```

### Campos de ModelConfig

| Campo | Requerido | Descripción |
|---|---|---|
| `id` | Sí | ID del modelo enviado a la API |
| `name` | No | Nombre mostrado en el selector `/model` |
| `envKey` | No (recomendado) | Nombre de la variable de entorno con la API key |
| `baseUrl` | No | Endpoint (para proxies o servidores propios) |
| `generationConfig` | No | `timeout`, `maxRetries`, `samplingParams`, `contextWindowSize`… |

> 📌 **Unicidad de modelos**: dentro del mismo protocolo, un modelo se identifica por la combinación `id` + `baseUrl`. Puedes tener el mismo ID apuntando a endpoints distintos.

### IDs de proveedor personalizados

Para agrupar varios endpoints OpenAI-compatible bajo un nombre propio, declara el proveedor y mapea su protocolo con `providerProtocol`:

```json
{
  "modelProviders": {
    "idealab": [
      {
        "id": "my-model",
        "envKey": "IDEALAB_API_KEY",
        "baseUrl": "https://idealab.example.com/v1"
      }
    ]
  },
  "providerProtocol": {
    "idealab": "openai"
  }
}
```

---

## 🏠 Modelos locales (Ollama, vLLM, LM Studio)

La mayoría de servidores de inferencia locales exponen una API compatible con OpenAI:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen2.5-7b",
        "name": "Qwen2.5 7B (Ollama)",
        "envKey": "OLLAMA_API_KEY",
        "baseUrl": "http://localhost:11434/v1",
        "generationConfig": {
          "timeout": 300000,
          "streamIdleTimeoutMs": 600000,
          "contextWindowSize": 32768
        }
      }
    ]
  }
}
```

Si el servidor no requiere autenticación, usa cualquier valor de relleno:

```bash
export OLLAMA_API_KEY="ollama"       # Ollama
export VLLM_API_KEY="not-needed"     # vLLM sin auth
```

> 💡 `streamIdleTimeoutMs` controla cuánto tiempo puede estar el modelo en silencio entre fragmentos del stream — útil para servidores locales lentos o con cola.

---

## Prioridad de las credenciales

Las API keys se resuelven en este orden (de mayor a menor prioridad):

| Prioridad | Fuente |
|---|---|
| 1 (máxima) | Flags del CLI (`--openai-api-key`) |
| 2 | Variables de entorno del sistema (`export`) |
| 3 | Archivos `.env` (primero `.qwen/.env`, luego `.env`, subiendo hacia la raíz; si no existen, `~/.qwen/.env` y `~/.env`) |
| 4 (mínima) | Campo `env` de `settings.json` |

## Notas de seguridad

- ❌ No subas API keys al control de versiones.
- ✅ Prefiere `.qwen/.env` para secretos del proyecto (y añádelo a `.gitignore`).
- ✅ Usa variables de entorno en CI (GitHub Actions secrets, etc.).
- ⚠️ Trata la salida de tu terminal como sensible si imprime credenciales.
- ✅ Comprueba tu configuración con `/doctor` tras cualquier cambio.

---

← [Configuración](configuration.md) · [Flujos de trabajo →](workflows.md)

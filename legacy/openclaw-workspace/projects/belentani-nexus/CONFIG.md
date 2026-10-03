# BELENTANI NEXUS // CONFIG.md

Guía de configuración de APIs para `index.html` v2.0.

**Cómo se introducen las claves:** en la interfaz, botón **⚙️ (engranaje)** arriba a la derecha → pega las claves → **GUARDAR**. Se guardan en `localStorage` del navegador (nunca salen de tu máquina). También puedes dejarlas vacías y usar solo las APIs gratuitas.

---

## 1. Pollinations AI 🆓 — SIN CONFIGURACIÓN

- **Qué ofrece:** imágenes ilimitadas (Flux/Turbo) y texto (OpenAI/Mistral) **gratis y sin API key**.
- **Configuración:** ninguna. Funciona de inmediato.
- **Endpoints usados:**
  - Texto: `https://text.pollinations.ai/openai` (fallback GET `https://text.pollinations.ai/{prompt}`)
  - Imagen: `https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&nologo=true&model=flux`
  - TTS: `https://text.pollinations.ai/{texto}?model=openai-audio&voice=nova`
- **Límites:** uso razonable; si haces muchas peticiones seguidas puede haber rate-limit temporal.
- **Docs:** https://pollinations.ai

> 💡 Ideal para probar la plataforma sin registrar nada.

---

## 2. Groq ⚡ — Free tier generoso, ultra rápido

- **Qué ofrece:** inferencia ultra rápida de Llama 3.3 70B, Llama 3.1 8B, etc.
- **Pasos:**
  1. Ve a https://console.groq.com y crea una cuenta (gratis).
  2. En **API Keys** → **Create API Key** → copia la clave (empieza por `gsk_...`).
  3. En NEXUS: ⚙️ → pega en **GROQ API KEY** → GUARDAR.
- **Modelos disponibles en el selector:**
  - `llama-3.3-70b-versatile` (1 crédito)
  - `llama-3.1-8b-instant` (1 crédito)
- **Endpoint usado:** `https://api.groq.com/openai/v1/chat/completions` (formato OpenAI).
- **Límites free tier (orientativos):** ~30 req/min y cuota diaria por modelo; se reinicia cada día. Si recibes HTTP 429, espera unos segundos.
- **Docs:** https://console.groq.com/docs

---

## 3. DeepSeek 🇨🇳 — Free tier

- **Qué ofrece:** DeepSeek-V3 (chat general) y DeepSeek-R1 (razonamiento).
- **Pasos:**
  1. Ve a https://platform.deepseek.com y crea cuenta.
  2. **API Keys → Create new API key** → copia la clave (`sk-...`).
  3. En NEXUS: ⚙️ → pega en **DEEPSEEK API KEY** → GUARDAR.
- **Modelos disponibles en el selector:**
  - `deepseek-chat` (V3, 2 créditos)
  - `deepseek-reasoner` (R1, 3 créditos)
- **Endpoint usado:** `https://api.deepseek.com/chat/completions` (formato OpenAI).
- **Nota:** DeepSeek suele dar crédito inicial gratis (~5 USD) y sus precios son muy bajos; verifica tu saldo en el panel.
- **Docs:** https://api-docs.deepseek.com

---

## 4. HuggingFace Inference API 🤗 — Modelos open source

- **Qué ofrece:** acceso a miles de modelos open source vía Router/Inference Providers.
- **Pasos:**
  1. Crea cuenta en https://huggingface.co (gratis).
  2. Ve a https://huggingface.co/settings/tokens → **New token** → tipo **Read** → copia (`hf_...`).
  3. En NEXUS: ⚙️ → pega en **HUGGINGFACE TOKEN** → GUARDAR.
- **Modelos disponibles en el selector:**
  - `Qwen/Qwen2.5-72B-Instruct`
  - `meta-llama/Llama-3.3-70B-Instruct` (requiere aceptar la licencia del modelo en su página de HF la primera vez)
  - `mistralai/Mistral-Small-24B-Instruct-2501`
- **Endpoint usado:** `https://router.huggingface.co/v1/chat/completions` (formato OpenAI).
- **Límites:** el tier gratuito tiene límites de uso variables por proveedor; si un modelo devuelve error, puede estar "cold" o fuera de cuota — prueba otro modelo o en unos minutos.
- **Docs:** https://huggingface.co/docs/inference-providers

---

## 5. (Opcional) Qwen / DashScope — Token plan

- **Qué ofrece:** Qwen 3.8 Max (1M de contexto) vía el plan de tokens de Alibaba.
- **Pasos:**
  1. Crea cuenta en https://www.alibabacloud.com → activa **Model Studio / DashScope**.
  2. Genera una API key en la consola de DashScope.
  3. En NEXUS: ⚙️ → pega en **QWEN / DASHSCOPE API KEY** → GUARDAR.
- **Endpoint usado:** `https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions` con modelo `qwen3.8-max`.
- **Docs:** https://www.alibabacloud.com/help/en/model-studio

---

## 6. (Opcional) Ollama 🏠 — Local, gratis ilimitado

- **Qué ofrece:** modelos locales sin coste ni límites.
- **Pasos:**
  1. Instala Ollama: https://ollama.com/download
  2. Descarga un modelo: `ollama pull llama3.2`
  3. En NEXUS: ⚙️ → deja la URL por defecto `http://localhost:11434` (o pon la de tu servidor) → GUARDAR.
- **Nota CORS:** el navegador puede bloquear peticiones a Ollama desde un HTML abierto por CORS. Solución: arranca Ollama con variables de entorno:
  - Windows (PowerShell): `$env:OLLAMA_ORIGINS="*"; ollama serve`
  - Linux/macOS: `OLLAMA_ORIGINS="*" ollama serve`
- **Docs:** https://github.com/ollama/ollama

---

## Sistema de créditos (resumen)

| Acción | Coste |
|---|---|
| Modelos Pollinations (texto/imagen/TTS) | 🆓 GRATIS |
| Ollama local | 🆓 GRATIS |
| Groq (Llama 3.3/3.1) | 1 crédito/mensaje |
| HuggingFace | 1 crédito/mensaje |
| Qwen 3.8 Max | 2 créditos/mensaje |
| DeepSeek V3 | 2 créditos/mensaje |
| DeepSeek R1 | 3 créditos/mensaje |
| Comparación lado a lado | suma de los modelos elegidos |

- **Inicio:** 100 créditos.
- **🎁 Recompensa diaria:** +25 créditos base, +5 extra por día de racha consecutiva (máximo +50). Botón 🎁 en la cabecera.
- Si una llamada falla, **se reembolsan los créditos** automáticamente.
- Todo se persiste en `localStorage` (`belentani_nexus_state_v2`).

---

## Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| `Falta la API key de X` | Clave no guardada | ⚙️ → pega la clave → GUARDAR |
| HTTP 401 | Clave inválida/expirada | Regenera la clave en el proveedor |
| HTTP 429 | Límite de tasa del free tier | Espera y reintenta; Groq se reinicia a diario |
| Ollama no responde | Servicio caído o CORS | Arranca con `OLLAMA_ORIGINS="*"` |
| Imagen Pollinations tarda | Generación en frío | Normal ~10–60 s la primera vez |
| Modelo HF no responde | Modelo cold / sin licencia aceptada | Acepta la licencia en huggingface.co o usa otro modelo |

## Export / Import de chats

- **⬇ EXPORT:** descarga un JSON con todos los chats y la galería.
- **⬆ IMPORT:** selecciona un JSON exportado; los chats/galería se fusionan sin duplicados.

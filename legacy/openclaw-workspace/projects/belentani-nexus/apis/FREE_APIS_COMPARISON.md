# 🆓 FREE APIS COMPARISON — APIs gratuitas de IA 2026

> **Proyecto:** belentani-nexus
> **Última verificación:** 31 de agosto de 2026
> **Fuentes:** docs oficiales de cada proveedor, openrouter.ai, mnfst/awesome-free-llm-apis (actualizado mar-abr 2026), cheahjs/free-llm-api-resources.
> ⚠️ Los límites de los free tiers cambian con frecuencia. Verifica en el dashboard del proveedor antes de comprometerte con uno.

---

## 📑 Índice

1. [Resumen ejecutivo](#resumen-ejecutivo)
2. [TEXTO / CÓDIGO (LLM)](#1-texto--código-llm)
3. [IMAGEN](#2-imagen)
4. [VIDEO](#3-video)
5. [AUDIO / TTS / Música](#4-audio--tts)
6. [EMBEDDINGS](#5-embeddings)
7. [APIs CHINAS (endpoints internacionales)](#6-apis-chinas-con-endpoint-internacional)
8. [Rankings por categoría](#7-rankings-por-categoría)
9. [Recomendaciones de uso](#8-recomendaciones-de-uso)
10. [Leyenda y glosario](#9-leyenda)

---

## Resumen ejecutivo

| Lo que quieras | Mejor opción gratuita (2026) |
|---|---|
| LLM rápido (chat/agentes) | **Groq** (LPU ~300+ tok/s) o **Google Gemini Flash** (1M contexto, 1.500 req/día) |
| LLM razonador barato | **DeepSeek** (créditos de regalo + precios ínfimos) vía directa u OpenRouter |
| Muchos modelos, una sola key | **OpenRouter** (20+ modelos `:free`, 50 req/día; 1.000 si recargas $10 una vez) |
| Imagen sin registro | **Pollinations** (Flux gratis e ilimitado, sin API key) |
| Imagen calidad pro con free tier | **Together AI** (FLUX.1-schnell-Free) / **fal.ai** (créditos de prueba) |
| Video gratis | **Hailuo (MiniMax)** en web (refresh diario) — API casi siempre de pago; alternativa open: **Wan** auto-hospedado |
| TTS gratis e ilimitado (fair use) | **Fish Audio** `s2.1-pro-free` |
| TTS premium poca cantidad | **ElevenLabs** (10.000 créditos/mes gratis) |
| Embeddings | **Sentence-Transformers** local (gratis total) / **Cohere trial** / **NVIDIA NIM** |
| Modelos chinos | Z.AI (GLM free permanente), Alibaba (cuota 90 días), SiliconFlow, Tencent Hunyuan (1M tokens free) |

**Reglas de oro de los free tiers:**
1. Casi todos exigen que el uso sea de **desarrollo/pruebas**, no producción con usuarios reales.
2. Varios **usan tus prompts para entrenar** (Google fuera de UE, Mistral salvo opt-out, proveedores free de OpenRouter, NVIDIA NIM). Revisa términos si hay datos sensibles.
3. Los límites se expresan en RPM (req/min), RPD (req/día), TPM (tokens/min). Respeta el backoff ante 429.

---

## 1. TEXTO / CÓDIGO (LLM)

| Proveedor | Endpoint (base URL) | Free tier | Límites | Modelos free destacados | Tras el free tier | Key |
|---|---|---|---|---|---|---|
| **OpenRouter** 🇺🇸 | `https://openrouter.ai/api/v1` | Permanente | 20 RPM, 50 RPD (→1.000 RPD con recarga única de $10) | DeepSeek R1/V3 `:free`, Llama 3.3 70B, Qwen3 Coder (262K ctx), Gemma 4, `openrouter/free` router | Pay-as-you-go por token + 5,5% fee | openrouter.ai/keys (sin tarjeta) |
| **Groq** 🇺🇸 | `https://api.groq.com/openai/v1` | Permanente | 30 RPM; ~1.000 RPD (250 RPD compound) | `openai/gpt-oss-120b`, `qwen/qwen3.6-27b`, groq/compound. ⚠️ Llama 3.3 70B retirado 16-ago-2026 | Pay-as-you-go | console.groq.com/keys (sin tarjeta) |
| **Google AI Studio (Gemini)** 🇺🇸 | `https://generativelanguage.googleapis.com/v1beta` | Permanente | Gemini 3 Flash: 10 RPM / 1.500 RPD; Flash-Lite: 15-30 RPM; 2.5 Pro: 5 RPM/50 RPD; contexto 1M | Gemini 3.x Flash, Flash-Lite, Gemma 4 | Pago por tokens (tier 1+) | aistudio.google.com/app/apikey |
| **DeepSeek** 🇨🇳 | `https://api.deepseek.com/v1` | Créditos de bienvenida (reportado ~5M tokens; algunas cuentas sin crédito) | Sin free tier permanente | DeepSeek V4 Flash/Pro, R1 | V4 Flash ~$0,14/$0,28 por M tokens (de los más baratos del mercado) | platform.deepseek.com |
| **Z.AI / Zhipu (GLM)** 🇨🇳 | `https://api.z.ai/api/paas/v4` (intl) · `https://open.bigmodel.cn/api/paas/v4` (CN) | **Permanente** | 1 petición concurrente | GLM-4.7-Flash (200K ctx), GLM-4.6V-Flash (multimodal), GLM-4.5-Flash (retirándose) | GLM-5.x de pago | z.ai / open.bigmodel.cn (admite teléfono extranjero, sin real-name para chat API) |
| **Cerebras** 🇺🇸 | `https://api.cerebras.ai/v1` | Permanente (tier Experiment) | Alto throughput | Llama 3.3 70B (~1M tok/día) | Tier Production de pago | cloud.cerebras.ai |
| **NVIDIA NIM** 🇺🇸 | `https://integrate.api.nvidia.com/v1` | Permanente (NVIDIA Developer) | ~40 RPM, ~10.000 RPD (varía por modelo) | Nemotron 3 (hasta 550B), Llama 3.3 70B, GPT-OSS, MiniMax-M3, Gemma 4; también imagen/video/embeddings | Pago por token | build.nvidia.com |
| **Cohere** 🇨🇦 | `https://api.cohere.com/v2` | Trial key | 1.000 llamadas/mes, 20 RPM; solo no comercial | Command A+/R+, Aya, embed-v4 | Pago | dashboard.cohere.com/api-keys |
| **Mistral** 🇫🇷 | `https://api.mistral.ai/v1` | Free mode por defecto | ~1 RPS, 500K TPM | ~$10/mes de crédito API, Mistral Medium/Small/Large 3, Codestral | Pago; prompts pueden entrenar salvo opt-out | console.mistral.ai |
| **Cloudflare Workers AI** 🇺🇸 | `https://api.cloudflare.com/client/v4/accounts/{id}/ai/run` | Permanente | 10.000 Neurons/día (compartido) | 75+ modelos: Llama 4 Scout, GPT-OSS, GLM-4.7-flash, DeepSeek R1-distill, embeddings, imagen | Pago (Workers Paid) | dash.cloudflare.com |
| **Hugging Face Inference** 🇺🇸 | `https://router.huggingface.co/v1` | Créditos mensuales (~$0,10) | Medido por créditos | Miles de modelos open vía providers (Fireworks, Together…) | PRO $9/mes → 2M créditos | huggingface.co/settings/tokens |
| **Ollama Cloud** 🇺🇸 | `https://ollama.com/v1` | Permanente | Límites por sesión (reset 5h) y semanales | deepseek-v4, kimi-k3, minimax-m3, qwen3.5, gpt-oss | Pago por tokens | ollama.com/settings/keys |
| **SiliconFlow** 🇨🇳 | `https://api.siliconflow.cn/v1` (CN) · `https://api.siliconflow.com/v1` (intl) | Modelos permanentemente gratis | Qwen3-8B: 1.000 RPM / 50K TPM | 100+ modelos; free: Qwen3-8B y similares | Pago | ⚠️ Requiere verificación de identidad (docs CN); intl: contactar soporte |
| **ModelScope** 🇨🇳 | `https://api-inference.modelscope.cn/v1` | Gratis registrado | 2.000 RPD total, ≤500 RPD por modelo | Qwen3.5-35B-A3B, Qwen3.5-27B | — | ⚠️ Requiere cuenta Alibaba Cloud + real-name |
| **Kilo Code** 🇺🇸 | `https://api.kilo.ai/api/gateway` | Gratis **sin API key** | 200 req/hora por IP | Nemotron 3 Ultra 550B (1M ctx), step-3.7-flash, poolside, `tencent/hy3:free`, router `kilo-auto/free` | — | Ninguna (anónimo) |
| **OVHcloud AI Endpoints** 🇫🇷 | `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1` | Anónimo sin registro | 2 RPM por IP por modelo | Qwen3.5-397B, GPT-OSS, Llama 3.3 70B, Mistral; datacenters UE | 400 RPM con key + pago | Ninguna |
| **LLM7.io** 🇬🇧 | `https://api.llm7.io/v1` | Anónimo / token free | Anónimo: 10 RPM, 60 req/h; token: 40 RPM, 100 req/h, 1M tok/24h | gpt-oss:20b, minimax-m2.7 | Pro $12/mes | token.llm7.io (free) |
| **Aion Labs** 🇮🇱 | `https://api.aionlabs.ai/v1` | Permanente | 15 RPM, 20K tokens/día | aion-3.0, roleplay/storytelling | Pago | aionlabs.ai |
| **Microsoft Foundry / GitHub Models** 🇺🇸 | Azure OpenAI-compatible | Gratis con cuenta GitHub | Limitado, tied a GitHub | GPT-4o, Claude 3.5 Sonnet, Llama, Phi vía endpoint compatible | Pago Azure | github.com/settings/tokens |

---

## 2. IMAGEN

| Proveedor | Endpoint | Free tier | Límites | Modelos | Tras free | Key |
|---|---|---|---|---|---|---|
| **Pollinations** 🇩🇪 | `https://image.pollinations.ai/prompt/{prompt}` (GET) · `https://gen.pollinations.ai/v1` (OpenAI-compat) | **Gratis, sin registro**; Flux ilimitado | ~1 req/15s anónimo; tier Spore: 1,5 Pollen/semana | Flux (default free), Turbo, Kontext, GPT Image, Seedream, Nanobanana | Sistema Pollen (tu app gana cuando se usa) | Opcional (pk_/sk_) |
| **Together AI** 🇺🇸 | `https://api.together.xyz/v1` | `FLUX.1-schnell-Free` (promo 3 meses ilimitada) + $1-50 créditos nuevos | — | FLUX.1 schnell/dev, SD Turbo, Wan 2.6 Image | ~$0,053/imagen (schnell paid) | api.together.ai |
| **Pixazo** | `https://gateway.pixazo.ai/flux/text-to-image` | Free preview | 60 RPM fair-use por modelo | Flux Schnell, Stable Diffusion 3.5, SDXL (1024²) | Pago por uso | Ocp-Apim-Subscription-Key |
| **fal.ai** 🇺🇸 | `https://fal.run/{model}` | Créditos de prueba al registrarse | — | Flux 2, SDXL, Hunyuan Video, MiniMax, Kling… | Pago por segundo de GPU | fal.ai dashboard |
| **Ideogram** 🇺🇸 | `https://api.ideogram.ai` | Web: 10 slow-credits/semana (uso comercial OK) | **API sin free tier** | Ideogram V4 | $0,03 (Turbo) / $0,06 (Default) / $0,10 (Quality) por imagen | ideogram.ai |
| **Black Forest Labs (FLUX oficial)** 🇩🇪 | `https://api.bfl.ai/v1` | schnell/dev auto-hospedables gratis (schnell Apache 2.0) | — | FLUX 2 Pro ($0,02/img), Kontext | Pago por imagen | bfl.ai |
| **Replicate** 🇺🇸 | `https://api.replicate.com/v1` | Créditos para startups ($1K-$10K); uso normal de pago | — | Miles de modelos open (FLUX, SDXL, Wan…) | Pago por ejecución | replicate.com |
| **Cloudflare Workers AI** | (ver LLM) | Dentro de 10K Neurons/día | — | FLUX.1-schnell, SDXL | — | — |
| **Auto-hospedado** | ComfyUI / Stable Diffusion WebUI / Diffusers | Gratis total (tu GPU) | — | SD 3.5 Large, FLUX.1 schnell/dev, Wan-Image | $0 | — |

---

## 3. VIDEO

| Proveedor | Endpoint | Free tier | Límites | Modelos | Tras free | Key |
|---|---|---|---|---|---|---|
| **Hailuo / MiniMax** 🇨🇳 | Web: hailuoai.video · API: `https://api.minimax.io/v1` (intl) / `api.minimaxi.com` (CN) | **Web: generación gratis con refresh diario** (mejor free tier de video 2026) | API casi siempre de pago; watermark en free | Hailuo 2.3 / MiniMax H3, T2V e I2V, hasta 10s | ~$0,10-$0,30/vídeo; M-series $0,30 flat | platform.minimax.io |
| **Luma Dream Machine** 🇺🇸 | `https://api.lumalabs.ai` | ~5 generaciones/mes (web) | Borradores con watermark | Ray 2 / Dream Machine 2.0 | Desde $29,99/mes (10K créditos) | lumalabs.ai/api |
| **PixVerse** 🇨🇳 | vía agregadores (crazyrouter, fal) | Free tier web según región/cuenta | — | PixVerse V6 (1-15s, multi-shot) | Desde ~$12,99/mes | pixverse.ai |
| **Alibaba Wan** 🇨🇳 | DashScope (ver APIs chinas) | Cuota free 90 días en Model Studio (p. ej. vídeos Wan2.x) | — | Wan 2.6/2.7 T2V, 2.2 S2V (speech-to-video) | ~$0,10-0,25/vídeo; sitio oficial: 720p 5s gratis | alibabacloud.com |
| **fal.ai** | `https://fal.run/fal-ai/...` | Créditos de prueba | — | Veo 3, MiniMax, Hunyuan Video, Kling, Luma, Mochi, PixVerse | Pago | fal.ai |
| **Replicate** | `https://api.replicate.com/v1` | Créditos startup | — | Wan 2.x, Hunyuan, Mochi, Kling | Pago | replicate.com |
| **Auto-hospedado** | Wan2.1/2.2, Hunyuan Video, Mochi (open weights) | Gratis (tu GPU, ≥24GB VRAM) | — | Wan 2.1 14B, Hunyuan Video 13B | $0 | — |

> ⚠️ Los free tiers de video (Kling, Luma, Hailuo web) suelen **prohibir uso comercial** y añaden watermark.

---

## 4. AUDIO / TTS

| Proveedor | Endpoint | Free tier | Límites | Modelos | Tras free | Key |
|---|---|---|---|---|---|---|
| **Fish Audio** 🇨🇳/🌍 | `https://api.fish.audio/v1/tts` | **`s2.1-pro-free` ilimitado bajo Fair Use** (desde jun 2026) | Restricciones comerciales en free | S2.1 Pro (mismo modelo que el de pago), voces comunitarias | Pago por carácter | fish.audio/app/api-keys |
| **ElevenLabs** 🇺🇸 | `https://api.elevenlabs.io/v1` | Free | 10.000 créditos/mes (~10 min audio); atribución requerida | Eleven v3, Turbo v2.5, clonación instantánea limitada | Desde $5/mes (Starter) | elevenlabs.io |
| **Alibaba CosyVoice / Qwen-TTS** 🇨🇳 | DashScope intl: `https://dashscope-intl.aliyuncs.com/api/v1` | Cuota 90 días: 10.000 caracteres (CosyVoice), 110.000 (Qwen-TTS) | — | cosyvoice-v3-plus/flash, qwen3-tts-flash, realtime | $0,13-$0,26 / 10K caracteres | alibabacloud.com |
| **Pollinations audio** | `https://text.pollinations.ai/openai` (TTS) | Gratis sin registro | Tier Spore | OpenAI TTS-like, voces nova etc. | Pollen | Opcional |
| **Edge TTS (Microsoft)** | librería `edge-tts` (usa servicio Edge) | Gratis no oficial | Sin límites publicados; no garantizado | Voces Azure neuronales (incl. español) | — | Ninguna |
| **Open-source local** | Piper, Kokoro-82M, XTTS-v2, F5-TTS, IndexTTS-2 | Gratis total | Tu GPU/CPU | — | $0 | — |
| **Música: MiniMax Music** | `https://api.minimax.io/v1` | Créditos de prueba | — | Music-1.5 | Pago | MiniMax |

---

## 5. EMBEDDINGS

| Proveedor | Endpoint | Free tier | Límites | Modelos | Tras free |
|---|---|---|---|---|---|
| **Sentence-Transformers (local)** | `pip install sentence-transformers` | Gratis total | Tu hardware | all-MiniLM-L6-v2 (384d), BGE-M3 (multilingüe), Jina v4, Snowflake Arctic | $0 |
| **OpenAI** | `https://api.openai.com/v1/embeddings` | **Sin free tier permanente** | — | text-embedding-3-small ($0,02/M), 3-large ($0,13/M) | Pago (muy barato) |
| **Cohere** | `https://api.cohere.com/v2/embed` | Dentro de 1.000 llamadas/mes trial | — | embed-v4 (multimodal, docs largos) | Pago |
| **NVIDIA NIM** | `https://integrate.api.nvidia.com/v1` | Dentro del free tier (~40 RPM) | — | NV-Embed, BGE, E5 | Pago |
| **Google Gemini** | `.../v1beta/models/gemini-embedding-...:embedContent` | Dentro del free tier de Gemini | — | gemini-embedding | Pago |
| **Ollama (local)** | `http://localhost:11434/api/embed` | Gratis | Local | nomic-embed-text, bge-m3, snowflake-arctic | $0 |
| **Cloudflare Workers AI** | Workers AI endpoint | Dentro de 10K Neurons | — | bge-base-en-v1.5, bge-m3 | Pago |
| **Pollinations** | `https://gen.pollinations.ai/v1/embeddings` | Gratis con cuenta | Pollen | openai-3-small | — |

---

## 6. APIs CHINAS (con endpoint internacional)

| Empresa | Producto | Endpoint internacional | Free | Notas de acceso |
|---|---|---|---|---|
| **Alibaba Cloud** | Qwen3.5 (texto), Wan 2.x (video), CosyVoice/Qwen-TTS (voz), Qwen-VL | `https://dashscope-intl.aliyuncs.com/api/v1` (Singapur) · `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/api/v1` (MaaS) | Cuota gratis **90 días** por modelo (p. ej. 1M tokens Qwen, 110K caracteres TTS, cuotas de imagen/video Wanx) | Cuenta internacional alibabacloud.com; free quota solo región Singapur |
| **Alibaba (China)** | Igual + ModelScope | `https://dashscope.aliyuncs.com/api/v1` | ModelScope: 2.000 RPD gratis | Requiere real-name verification |
| **Baidu** | ERNIE 3.5/Speed/4.x/5.x (Qianfan) | `https://qianfan.baidubce.com/v2` (OpenAI-compatible) | ERNIE-3.5-8K y ERNIE-Speed-8K permanentemente gratis (CN); trial credits a veces en intl | intl.cloud.baidu.com; API v2 compatible con OpenAI SDK |
| **Tencent** | Hunyuan (Hy3), Hunyuan 3D | `https://api.hunyuan.cloud.tencent.com/v1` (OpenAI-compat) | Reportado **1M tokens gratis** al registrarse; 200 créditos free en API enterprise; Hunyuan 3D global con 20 gen/día gratis | console.cloud.tencent.com/hunyuan/api-key |
| **Zhipu AI / Z.AI** | GLM-4.7-Flash, GLM-5.x, GLM-4.6V | **`https://api.z.ai/api/paas/v4`** (internacional) · `https://open.bigmodel.cn/api/paas/v4` (CN) | **Flash models gratis permanentes** (1 concurrente) | Registro acepta teléfono extranjero; sin real-name para chat API |
| **Moonshot AI** | Kimi K3 (2.8T params, 1M ctx), K2.6/K2.7-code | `https://api.moonshot.ai/v1` · platform.kimi.ai | Voucher de **¥15 al registrarse** (cientos de requests) | Tras voucher: pago; kimi disponible free vía OpenRouter (`moonshotai/kimi-k2.6:free`) y Ollama Cloud |
| **MiniMax** | Hailuo 2.3 (video), MiniMax-M3 (texto), Music | **`https://api.minimax.io/v1`** (intl) · `api.minimaxi.com` (CN) | Video free diario en web; API con trial limitado | M-series texto ~$0,30 flat/M |
| **DeepSeek** | V4 Flash/Pro, R1 | `https://api.deepseek.com/v1` | Créditos de bienvenida variables | El más barato del mercado |
| **SiliconFlow** | 100+ modelos (Qwen, DeepSeek, GLM, MiniMax, IndexTTS-2…) | **`https://api.siliconflow.com/v1`** (intl) · `api.siliconflow.cn/v1` (CN) | Qwen3-8B y otros permanentemente gratis | Verificación de identidad (CN); intl contactar soporte |

---

## 7. Rankings por categoría

### 🥇 Texto/Código (free tier permanente + calidad)
1. **Google Gemini 3 Flash** — 1M contexto, 1.500 req/día, multimodal. El más generoso "serio".
2. **Groq** — velocidad LPU (300+ tok/s), 1.000 req/día; pocos modelos.
3. **Z.AI GLM-4.7-Flash** — gratis permanente, 200K ctx, razonamiento; límite: 1 concurrente.
4. **OpenRouter** — variedad (20+ free) + failover; 50/día corto sin recarga.
5. **DeepSeek** — créditos iniciales + precio casi gratis después.
6. **NVIDIA NIM** — 100+ modelos, 10.000 req/día (trial use only, logs).
7. Menciones: Cloudflare Workers AI, Cerebras, Mistral free mode, Kilo Code (sin key), OVH (sin key).

### 🥇 Imagen
1. **Pollinations** — Flux gratis/ilimitado, sin key, cero fricción (prototipado).
2. **Together AI FLUX.1-schnell-Free** — ilimitado por tiempo limitado; calidad schnell.
3. **Pixazo / fal.ai (preview credits)** — 3-5 modelos free con calidad pro.
4. **Ideogram web** — mejor render de texto, pero solo 10 créditos lentos/semana.
5. **Self-hosted FLUX.1 schnell / SD 3.5** — control total si tienes GPU.

### 🥇 Video
1. **Hailuo web (MiniMax)** — único free diario real de calidad.
2. **Luma** — 5 gen/mes gratis, calidad cinematográfica.
3. **Wan (Alibaba)** — cuota free 90 días + open weights para self-host.
4. **fal.ai / Replicate** — créditos de prueba para evaluar Kling, Veo, PixVerse.

### 🥇 Audio/TTS
1. **Fish Audio s2.1-pro-free** — gratis ilimitado fair-use, calidad top, multilingüe.
2. **Alibaba CosyVoice/Qwen-TTS** — 110K caracteres free, clonación, realtime.
3. **ElevenLabs** — mejor calidad del mercado pero solo ~10 min/mes gratis.
4. **Edge TTS / Piper / Kokoro** — gratis total local/no oficial.

### 🥇 Embeddings
1. **Sentence-Transformers / BGE-M3 local** — gratis, privado, multilingüe.
2. **Cohere embed-v4 trial** — mejor hosted gratis (1K llamadas/mes).
3. **NVIDIA NIM / Gemini embeddings** — incluidos en sus free tiers.
4. **OpenAI text-embedding-3-small** — sin free tier pero $0,02/M tokens (casi gratis).

---

## 8. Recomendaciones de uso

### Stack recomendado $0 para un proyecto completo (belentani-nexus)
```
LLM principal:      Gemini 3 Flash (free) + fallback Groq gpt-oss-120b
LLM razonamiento:   DeepSeek R1 vía OpenRouter (:free) o GLM-4.7-Flash
LLM backup sin key: Kilo Code gateway / OVH (2 RPM)
Imagen:             Pollinations (Flux) para producción ligera;
                    Together FLUX-schnell-Free para calidad
Video:              Hailuo web para pruebas; Wan self-host para volumen
TTS:                Fish Audio s2.1-pro-free; ElevenLabs para ocasiones premium
Embeddings:         BGE-M3 local (sentence-transformers) o Cohere trial
```

### Patrón de failover (importante)
Encadena proveedores en orden de prioridad. Ver `integration_examples.py` / `apis_config.json`.

### Buenas prácticas
- **429 handling:** backoff exponencial + rotación de proveedor.
- **Privacidad:** no envíes datos sensibles a tiers que entrenan con tus prompts (Google free fuera de UE, Mistral, NVIDIA trial, OpenRouter free).
- **Comercial:** verifica licencia de salida (Pollinations/Ideogram web permiten comercial; Hailuo/Luma/Kling free NO).
- **Chips de región:** los endpoints chinos internacionales (`*.io`, `z.ai`, `minimax.io`, `dashscope-intl`) funcionan sin VPN; los `.cn` pueden pedir real-name.

---

## 9. Leyenda

- **RPM** = requests por minuto · **RPD** = requests por día · **TPM** = tokens por minuto · **TPD** = tokens por día
- **ctx** = ventana de contexto
- Los precios/límites reflejan fuentes públicas de 2026 y pueden variar.

---
*Generado para belentani-nexus. Ver también: `README.md`, `apis_config.json`, `CHINESE_APIS.md`, `integration_examples.py`*

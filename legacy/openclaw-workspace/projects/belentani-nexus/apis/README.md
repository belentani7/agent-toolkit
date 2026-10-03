# 📡 APIs de IA gratuitas 2026 — belentani-nexus

Investigación y documentación completa de APIs gratuitas de IA (texto, imagen, video, audio, embeddings), con foco en proveedores chinos con endpoints internacionales.

**Fecha:** 31 de agosto de 2026

## Archivos

| Archivo | Contenido |
|---|---|
| `FREE_APIS_COMPARISON.md` | Tabla comparativa de TODAS las APIs, rankings por categoría y recomendaciones |
| `CHINESE_APIS.md` | Guía detallada: Alibaba (Qwen/Wan/CosyVoice), Baidu (ERNIE), Tencent (Hunyuan), Zhipu (GLM), Moonshot (Kimi), MiniMax (Hailuo), DeepSeek, SiliconFlow — con endpoints internacionales |
| `apis_config.json` | Configuración lista para usar: URLs, modelos, env vars, límites de todas las APIs |
| `integration_examples.py` | Ejemplos Python + curl para cada categoría con failover automático |

## Resumen rápido (top picks $0)

| Categoría | Ganador | Por qué |
|---|---|---|
| LLM volumen | Google Gemini 3 Flash | 1M ctx, 1.500 req/día |
| LLM velocidad | Groq | 300+ tok/s, 1.000 req/día |
| LLM gratis permanente | Z.AI GLM-4.7-Flash | Sin tarjeta, para siempre |
| LLM variedad | OpenRouter | 20+ modelos `:free`, una key |
| Imagen sin registro | Pollinations | Flux ilimitado, sin key |
| Imagen calidad | Together AI | FLUX.1-schnell-Free ilimitado (promo) |
| Video | Hailuo (MiniMax) web | Único free diario de calidad |
| TTS | Fish Audio `s2.1-pro-free` | Gratis ilimitado fair-use |
| TTS premium | ElevenLabs | 10K créditos/mes |
| Embeddings | BGE-M3 local / Cohere trial | Gratis total / hosted 1K llamadas/mes |

## Endpoints chinos internacionales (sin VPN)

```
Z.AI (GLM):       https://api.z.ai/api/paas/v4          ← gratis permanente
Moonshot (Kimi):  https://api.moonshot.ai/v1            ← ¥15 voucher
MiniMax:          https://api.minimax.io/v1             ← Hailuo web free diario
Alibaba:          https://dashscope-intl.aliyuncs.com   ← cuota 90 días
DeepSeek:         https://api.deepseek.com/v1           ← precios ínfimos
SiliconFlow:      https://api.siliconflow.com/v1        ← modelos free selectos
Tencent:          https://api.hunyuan.cloud.tencent.com/v1
Baidu:            https://qianfan.baidubce.com/v2
```

## Fuentes principales
- openrouter.ai (blog + pricing), awesome-free-llm-apis (mnfst, verificado mar-abr 2026), cheahjs/free-llm-api-resources
- Docs oficiales: ai.google.dev, console.groq.com, z.ai, platform.minimax.io, alibabacloud.com/help/model-studio, fish.audio, pollinations.ai
- Notas: los límites cambian con frecuencia; verificar dashboard del proveedor antes de producción.

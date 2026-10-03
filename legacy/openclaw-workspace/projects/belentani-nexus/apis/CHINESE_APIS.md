# 🇨🇳 APIs de IA CHINAS — Guía completa 2026

> Documento dedicado a los proveedores chinos solicitados: **Alibaba (Qwen/Wan/CosyVoice), Baidu (ERNIE), Tencent (Hunyuan), Zhipu/Z.AI (GLM), Moonshot (Kimi), MiniMax (Hailuo), DeepSeek y SiliconFlow.**
> Se priorizan **endpoints internacionales** (accesibles sin VPN ni real-name cuando es posible).
> Última revisión: 31-08-2026.

---

## Índice
1. [Alibaba Cloud — Qwen / Wan / CosyVoice](#1-alibaba-cloud)
2. [Baidu — ERNIE / Qianfan](#2-baidu--ernie)
3. [Tencent — Hunyuan](#3-tencent--hunyuan)
4. [Zhipu AI / Z.AI — GLM](#4-zhipu-ai--zai--glm)
5. [Moonshot AI — Kimi](#5-moonshot-ai--kimi)
6. [MiniMax — Hailuo / MiniMax-M](#6-minimax--hailuo)
7. [DeepSeek](#7-deepseek)
8. [SiliconFlow (agregador chino)](#8-siliconflow)
9. [Tabla resumen internacional](#9-tabla-resumen)
10. [Notas de cumplimiento](#10-notas-de-cumplimiento)

---

## 1. Alibaba Cloud

### Productos
| Familia | Uso | Modelos actuales |
|---|---|---|
| **Qwen3.5** | Texto/código | Qwen3.5-397B-A17B, Qwen3.5-35B-A3B, Qwen3.5-27B, Qwen3-Coder, QwQ/QVQ razonamiento |
| **Wan (万)** | Video | wan2.6-t2v, wan2.7-t2v, wan2.2-s2v (speech→video), wan-image |
| **Qwen-TTS / CosyVoice** | Voz | qwen3-tts-flash, cosyvoice-v3-plus/flash, realtime variants |
| **Qwen-VL** | Visión | qwen-vl-max/plus |

### Endpoints
| Región | Base URL |
|---|---|
| **Internacional (Singapur)** | `https://dashscope-intl.aliyuncs.com/api/v1` (OpenAI-compat) |
| MaaS workspace (Singapur) | `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/api/v1` |
| China | `https://dashscope.aliyuncs.com/api/v1` |

### Obtener API key (internacional)
1. Crear cuenta en [alibabacloud.com](https://www.alibabacloud.com) (no exige documento chino).
2. Activar **Model Studio** en consola región **Singapur** (`modelstudio.console.alibabacloud.com/ap-southeast-1`) — la activación otorga automáticamente la **free quota**.
3. Crear API key en la consola Model Studio (empieza por `sk-`).

### Free quota (90 días desde activación)
| Modelo | Cuota gratis | Precio después |
|---|---|---|
| qwq-plus / qvq-max | 1M tokens | $0,8-1,2 in / $2,4-4,8 out por M |
| Qwen-TTS (qwen3-tts-flash) | 110.000 caracteres | $0,10 / 10K |
| CosyVoice v3 flash/plus | 10.000 caracteres | $0,13-$0,26 / 10K |
| Qwen-Audio realtime | 1M tokens | $0,45-0,8 in |
| Wan (video) | Cuotas por modelo (p. ej. videos wan2.x) | ~$0,10-0,30 por vídeo |
| Wanx/imagen | Cuotas por modelo | ~$0,02-0,06 por imagen |

### Ejemplo (Qwen vía endpoint internacional)
```bash
curl https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen-plus","messages":[{"role":"user","content":"Hola"}]}'
```

---

## 2. Baidu — ERNIE

### Endpoints
| Variante | Base URL |
|---|---|
| **Qianfan v2 (OpenAI-compat)** | `https://qianfan.baidubce.com/v2` |
| Clásico (wenxinworkshop) | `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop` |
| Consola internacional | [intl.cloud.baidu.com](https://intl.cloud.baidu.com/en/product/qianfan.html) |

### Free tier
- **China:** `ernie-3.5-8k` y `ernie-speed-8k` **permanentemente gratis** (tokens ilimitados, límites RPM); `ernie-lite-8k` gratis/prueba.
- **Internacional:** no hay free tier permanente garantizado; cuentas nuevas pueden recibir trial credits.
- ERNIE 4.x/5.x son de pago.

### Obtener key
1. Cuenta Baidu Cloud (internacional vía intl.cloud.baidu.com).
2. Activar Qianfan → crear API key (`bce-v3/ALTAK-...`).

### Ejemplo
```bash
curl https://qianfan.baidubce.com/v2/chat/completions \
  -H "Authorization: Bearer $QIANFAN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"ernie-3.5-8k","messages":[{"role":"user","content":"Hola"}]}'
```

> 💡 Alternativa sin registro: modelos ERNIE accesibles gratis vía **Puter.js** (user-pays) — útil para demos web.

---

## 3. Tencent — Hunyuan

### Endpoints
| Variante | Base URL |
|---|---|
| **OpenAI-compatible** | `https://api.hunyuan.cloud.tencent.com/v1` |
| Consola | `console.cloud.tencent.com/hunyuan/api-key` |
| Internacional | tencentcloud.com (Hunyuan 3D Engine global desde 2026) |

### Free tier (2026)
- Reportado **1.000.000 tokens gratis** al registrarse en el endpoint OpenAI-compat.
- **Hunyuan 3D Engine global:** 20 generaciones gratis/día para nuevos creadores; 200 créditos free para API enterprise.
- Modelo `tencent/hy3` disponible **gratis en Kilo Code** (`200 req/hr`) y en OpenRouter.

### Modelos
- **Hy3 / Hunyuan-T1** (texto, razonamiento), **Hunyuan Video 13B** (open-source, en fal/Replicate), **Hunyuan 3D** (3D desde imagen/texto).

### Ejemplo
```bash
curl https://api.hunyuan.cloud.tencent.com/v1/chat/completions \
  -H "Authorization: Bearer $TENCENT_HUNYUAN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"hunyuan-t1","messages":[{"role":"user","content":"Hola"}]}'
```

---

## 4. Zhipu AI / Z.AI — GLM

### Endpoints
| Variante | Base URL |
|---|---|
| **Internacional (recomendada)** | `https://api.z.ai/api/paas/v4` |
| China | `https://open.bigmodel.cn/api/paas/v4` |

### Free tier ⭐ (el mejor free chino)
**Permanente, sin tarjeta:**
| Modelo | Contexto | Precio |
|---|---|---|
| GLM-4.7-Flash | 200K | **Gratis** (1 concurrente) |
| GLM-4.6V-Flash (multimodal) | 128K | **Gratis** (1 concurrente) |
| GLM-4.5-Flash | 128K | Gratis pero retirándose (auto-ruta a 4.7-Flash) |

GLM-5.x / GLM-4.7 de pago también existen (más caros).

### Obtener key
- [z.ai](https://z.ai) → registro con email/teléfono extranjero aceptado → API keys.
- El chat API **no exige real-name verification** (la Batch API sí).

### Ejemplo
```bash
curl https://api.z.ai/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $ZAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"glm-4.7-flash","messages":[{"role":"user","content":"Hola"}]}'
```

---

## 5. Moonshot AI — Kimi

### Endpoints
| Variante | Base URL |
|---|---|
| **Internacional** | `https://api.moonshot.ai/v1` (OpenAI-compat) |
| Plataforma | platform.kimi.ai / kimi.com |

### Free tier
- **Voucher de ¥15 (≈ cientos de requests)** al registrarse — se descuenta automáticamente.
- Sin voucher, los modelos Kimi pueden usarse gratis vía:
  - **OpenRouter:** `moonshotai/kimi-k2.6:free` (262K ctx)
  - **Ollama Cloud:** `kimi-k3` (1M ctx)
  - **Kilo Code / SiliconFlow:** modelos kimi disponibles

### Modelos
- **Kimi K3** — 2,8T parámetros, 1M contexto, tool calling, agentic (flagship).
- **Kimi K2.6 / K2.7-code** — open weights, agentic/código.

### Precios tras voucher
~$0,60-$0,95 por M tokens de entrada según modelo.

### Ejemplo
```bash
curl https://api.moonshot.ai/v1/chat/completions \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"kimi-k3","messages":[{"role":"user","content":"Hola"}]}'
```

---

## 6. MiniMax — Hailuo

### Endpoints
| Variante | Base URL |
|---|---|
| **Internacional** | `https://api.minimax.io/v1` |
| China | `https://api.minimaxi.com/v1` |
| Docs | platform.minimax.io/docs |

### Free tier
- **Hailuo web (hailuoai.video):** generaciones de vídeo **gratis con refresh diario** — el mejor free tier de vídeo de 2026 (uso personal, watermark).
- **API:** trial limitado al registrarse; después pago.

### Modelos
- **Hailuo 2.3 / MiniMax H3** — T2V e I2V, 6-10s, alta calidad humana.
- **MiniMax-M3 / M2.5** — texto (M3 en NVIDIA NIM gratis, 1M ctx).
- **Music-1.5** — generación musical.
- **Speech** — TTS/voice clone HD.

### Precios
- Texto M-series: ~$0,30 flat/M.
- Vídeo: ~$0,10-$0,30 por clip (paquetes disponibles).

### Ejemplo (vídeo, asíncrono)
```bash
curl https://api.minimax.io/v1/video_generation \
  -H "Authorization: Bearer $MINIMAX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"Hailuo-2.3","prompt":"Un zorro corriendo por la nieve al atardecer"}'
# → devuelve task_id; luego GET /v1/video_generation/{task_id}
```

---

## 7. DeepSeek

### Endpoint
`https://api.deepseek.com/v1` (OpenAI-compat) — platform.deepseek.com

### Free tier
- Créditos de bienvenida para cuentas nuevas (reportado hasta 5M tokens; puede ser 0 según cuenta/región).
- Sin free tier permanente, pero **es la API frontier más barata**:
  - V4 Flash: ~$0,14 in / $0,28 out por M
  - V4 Pro: ~$0,435 / $0,87 por M
  - Cache hits: hasta 90% de descuento.

### Modelos
- **DeepSeek V4 Flash / V4 Pro** (chat/código, 1M ctx)
- **DeepSeek R1** (razonamiento)
- Disponibles gratis vía OpenRouter (`deepseek/deepseek-r1:free`), Cloudflare, Ollama Cloud.

---

## 8. SiliconFlow

Agregador chino con los modelos chinos más importantes.

### Endpoints
| Variante | Base URL |
|---|---|
| **Internacional** | `https://api.siliconflow.com/v1` |
| China | `https://api.siliconflow.cn/v1` |

### Free tier
- Modelos **permanentemente gratis** (p. ej. `Qwen/Qwen3-8B` a 1.000 RPM / 50K TPM).
- Catálogo 100+ modelos: DeepSeek V4, GLM-5.x, MiniMax-M3, Qwen, IndexTTS-2 (voz), FLUX/Kolors (imagen).
- ⚠️ Requiere verificación de identidad (CN); usuarios internacionales deben contactar soporte.

---

## 9. Tabla resumen

| Proveedor | Endpoint internacional | Gratis permanente | Trial/cuota | Real-name |
|---|---|---|---|---|
| Alibaba | dashscope-intl.aliyuncs.com | No | 90 días por modelo | No (intl) |
| Baidu | qianfan.baidubce.com/v2 | ERNIE-3.5/Speed (CN) | A veces intl | Sí (CN) |
| Tencent | api.hunyuan.cloud.tencent.com/v1 | Vía Kilo/OpenRouter | 1M tokens reportados | Varía |
| Zhipu Z.AI | api.z.ai/api/paas/v4 | ✅ GLM Flash | — | No (chat API) |
| Moonshot | api.moonshot.ai/v1 | Vía OpenRouter/Ollama | ¥15 | No |
| MiniMax | api.minimax.io/v1 | Hailuo web diario | Trial API | No |
| DeepSeek | api.deepseek.com/v1 | Vía OpenRouter | 0-5M tokens | No |
| SiliconFlow | api.siliconflow.com/v1 | ✅ modelos selectos | — | Sí (CN) |

## 10. Notas de cumplimiento
- Los endpoints `.cn` pueden requerir **real-name verification (实名认证)** con documento chino; usa los internacionales (`z.ai`, `minimax.io`, `moonshot.ai`, `dashscope-intl`).
- Verifica términos de uso comercial de cada salida generada en free tier.
- Para producción en Europa, revisa dónde se procesan los datos (Alibaba Singapur es la opción china con región más cercana).

---
*Ver también: FREE_APIS_COMPARISON.md, apis_config.json, integration_examples.py*

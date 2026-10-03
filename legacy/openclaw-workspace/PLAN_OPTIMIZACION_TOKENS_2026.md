# 🎯 PLAN DE OPTIMIZACIÓN TOKEN PLAN QWEN - 2026-09-01

## Estado Actual Token Plan
- **Restante**: 48.6% (4,860 de 10,000 tokens)
- **Días restantes**: 358 días (expira 2027-08-25)
- **Auto-renovación**: Activada
- **Reset semanal**: 2026-09-01 09:25:00

## 🚨 PROBLEMA CRÍTICO
Estás quemando tokens en pay-as-you-go porque el sistema no está optimizado.

## ✅ SOLUCIÓN: ESTRATEGIA DE USO INTELIGENTE

### 1. PRIORIZACIÓN DE MODELOS GRATUITOS

**Para tareas DIARIAS (90% del trabajo):**
```yaml
Texto/Chat:
  - Groq (1000 req/día) → Tareas rápidas, código
  - Gemini 3 Flash (1500 req/día) → Contexto largo 1M tokens
  - Kilo Code (200 req/hora) → Sin API key, ilimitado
  - OpenRouter free (50 req/día) → Modelos variados

Imágenes:
  - Pollinations Flux (ilimitado) → Sin API key
  - Together FLUX.1-schnell (ilimitado promo) → Sin API key

Video:
  - Hailuo AI web (100 créditos/día) → 2-3 videos/día gratis
  - Alibaba Wan (cuota free 90 días) → Via DashScope

Audio/TTS:
  - Fish Audio s2.1-pro-free (ilimitado) → Sin API key
  - Edge TTS (local, ilimitado) → pip install edge-tts
```

**Para tareas CRÍTICAS (10% del trabajo):**
```yaml
Token Plan Pro (solo cuando sea necesario):
  - qwen3.8-max → Análisis complejos, arquitectura
  - qwen3.7-plus → Tareas generales de alta calidad
  - qwq-plus → Razonamiento avanzado

Uso recomendado: <500 req/semana = ~2,000 tokens/día
```

### 2. CONFIGURACIÓN CLI TOOLS

**Qwen Code:**
```json
{
  "provider": "qwen-token-plan",
  "model": "qwen3.6-flash",  // Más barato que 3.8-max
  "maxTokens": 4096,  // Limitar output
  "temperature": 0.3  // Menos creatividad = menos tokens
}
```

**OpenCode:**
```json
{
  "provider": "qwen",
  "model": "qwen3.6-flash",
  "contextWindow": 8192  // No 32k
}
```

**Kilo Code:**
```json
{
  "provider": "kilo",
  "model": "kilo-auto/free",  // Sin API key
  "apiBase": "https://api.kilo.ai/api/gateway"
}
```

### 3. RUTAS DE FALLBACK AUTOMÁTICO

```javascript
// Configurar en mcp-server.js
const fallbackChain = {
  chat: ['groq', 'gemini', 'kilo', 'openrouter', 'qwen-token-plan'],
  image: ['pollinations', 'together', 'qwen-token-plan'],
  video: ['hailuo-web', 'alibaba-wan', 'fal-ai'],
  tts: ['fish-audio-free', 'edge-tts', 'cosyvoice']
};
```

### 4. CACHE AGRESIVO

```yaml
# litellm_config.yaml
litellm_settings:
  cache: true
  cache_params:
    type: redis
    ttl: 86400  # 24 horas
    max_size: 10000  # 10K respuestas cacheadas
```

### 5. BATCH PROCESSING

En lugar de 100 llamadas pequeñas:
```python
# MAL: 100 llamadas de 1 token cada una
for item in items:
    response = api.call(item)

# BIEN: 1 llamada de 100 tokens
response = api.call(batch_items)
```

## 📊 META DE AHORRO

**Antes**: ~5,000 tokens/día (pay-as-you-go)
**Después**: ~500 tokens/día (Token Plan) + ilimitado free tier

**Ahorro estimado**: €50-100/mes

## 🔧 ACCIONES INMEDIATAS

1. ✅ Configurar `.env` con todas las API keys gratuitas
2. ✅ Actualizar `mcp-server.js` con fallback chain
3. ✅ Configurar cache Redis
4. ✅ Cambiar modelos default a `qwen3.6-flash`
5. ✅ Crear script de monitoreo de uso
6. ✅ Documentar en `TOOLS.md` qué usar para cada caso

## 📈 MONITOREO

```bash
# Ver uso actual
curl https://dashscope-intl.aliyuncs.com/compatible-mode/v1/usage \
  -H "Authorization: Bearer $QWEN_API_KEY"

# Ver uso Token Plan
# https://bailian.console.alibabacloud.com → Token Plan → Usage
```

---

**Próximo reset**: 2026-09-01 09:25:00 (hoy)
**Tokens disponibles después del reset**: 10,000

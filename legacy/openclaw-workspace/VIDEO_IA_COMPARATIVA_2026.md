# 🎬 VIDEO IA - COMPARATIVA Y RECOMENDACIONES 2026

## 🏆 MEJOR OPCIÓN GRATUITA: HAILUO AI (MiniMax)

### Características
- **Free tier**: ~100 créditos/día (2-3 videos/día gratis)
- **Director Mode**: Control de cámara en lenguaje natural
  - Push, tilt, track, circle, zoom
  - Sin necesidad de conocimiento técnico
- **Calidad**: 768p en free tier
- **Modelos**: Hailuo-2.3, Hailuo-02, T2V-01-Director

### API
- **Base URL**: https://api.minimax.io/v1
- **Pricing**: Desde $0.10-$0.30 por clip
- **Patrón**: Async (POST → task_id → GET status)
- **Paquetes**: $1,000 / $2,500 / $4,500 / $6,000 (1 mes)

### Cómo usar gratis
1. Web: https://hailuoai.video/
2. Generar 2-3 videos/día con refresh diario
3. Watermark en free tier (uso personal)

---

## 🥈 ALTERNATIVAS

### 1. Alibaba Wan (DashScope)
- **Endpoint**: DashScope video synthesis
- **Base URL**: https://dashscope-intl.aliyuncs.com/api/v1
- **Modelos**: wan2.6-t2v, wan2.7-t2v, wan2.2-s2v
- **Free quota**: 90 días por modelo
- **Costo**: ~$0.10-$0.30 por vídeo
- **API Key**: Tu Qwen Token Plan (sk-sp-…b9c0)

### 2. Kling AI
- **Web**: https://klingai.com/
- **Free tier**: ~66 créditos/día
- **Costo**: Desde $6.99/mes
- **Ventaja**: Mejor movimiento corporal/acción

### 3. Fal.ai (agregador)
- **Base URL**: https://fal.run
- **Modelos**: minimax/video-01-live, hunyuan-video, luma-dream-machine, kling-video, pixverse, veo3
- **Free trial**: Créditos de prueba
- **API Key**: FAL_KEY

### 4. Luma Dream Machine
- **Base URL**: https://api.lumalabs.ai
- **Modelos**: ray-2, dream-machine
- **Free tier**: ~5 generaciones/mes
- **Costo**: Desde $29.99/mes

---

## 🎯 RECOMENDACIÓN PARA BELENTANI

### Para Judas Experience (videos musicales cyberpunk)
```yaml
Estrategia:
  1. Hailuo AI web (gratis) → Prototipos diarios
  2. Alibaba Wan (Token Plan) → Videos finales con API
  3. Fal.ai → Modelos especializados (kling, veo3)
```

### Para contenido social (corto, rápido)
```yaml
Estrategia:
  - Hailuo AI web → 2-3 videos/día gratis
  - Pollinations Flux → Imágenes ilimitadas
  - Combinar: imagen → video (image-to-video)
```

### Para producción profesional
```yaml
Estrategia:
  - MiniMax API ($1,000 paquete) → 1 mes de producción
  - Kling AI Pro ($29.99/mes) → Acción/movimiento
  - Luma Ray-2 → Calidad máxima
```

---

## 🔧 INTEGRACIÓN TÉCNICA

### Ejemplo: Hailuo API
```python
import requests
import time

# POST para generar video
response = requests.post(
    "https://api.minimax.io/v1/video_generation",
    headers={"Authorization": "Bearer $MINIMAX_API_KEY"},
    json={
        "model": "T2V-01-Director",
        "prompt": "Cyberpunk city at night, neon lights, rain, cinematic",
        "camera_control": "slow zoom in, tilt up"
    }
)
task_id = response.json()["task_id"]

# GET para verificar estado
while True:
    status = requests.get(
        f"https://api.minimax.io/v1/video_generation/{task_id}",
        headers={"Authorization": "Bearer $MINIMAX_API_KEY"}
    )
    result = status.json()
    if result["status"] == "completed":
        video_url = result["video_url"]
        break
    time.sleep(10)
```

### Ejemplo: Alibaba Wan (DashScope)
```python
from dashscope import VideoSynthesis
from dashscope import MediaConst

rsp = VideoSynthesis.async_call(
    model='wan2.6-t2v',
    input={'prompt': 'Cyberpunk galactic music experience'},
    output={'video_path': 'output.mp4'}
)

# Esperar resultado
VideoSynthesis.wait(rsp)
print(rsp.output.video_path)
```

---

## 💡 MINIMAX DESIGN (IA DIRECTOR)

### Qué es
- **Director Mode**: Control de cámara en lenguaje natural
- **Comandos**: "push in", "tilt down", "track left", "circle around", "zoom out"
- **Ventaja**: No necesitas saber terminología técnica de cámara

### Cómo usar
```python
{
    "model": "T2V-01-Director",
    "prompt": "A lone figure walking through neon-lit streets",
    "camera_control": "slow dolly forward, slight tilt up, cinematic"
}
```

### Alternativas con Director Mode
- **Kling AI**: También tiene control de cámara
- **Luma Ray-2**: Camera control avanzado
- **Runway Gen-3**: Camera motion presets

---

## 📊 COMPARATIVA DE PRECIOS

| Servicio | Free Tier | Pago | Calidad |
|----------|-----------|------|---------|
| **Hailuo AI** | 100 créditos/día (2-3 videos) | $7.99-$54.99/mes | 768p-1080p |
| **Kling AI** | 66 créditos/día | $6.99-$29.99/mes | 1080p |
| **Alibaba Wan** | 90 días free | $0.10-$0.30/video | 720p-1080p |
| **Luma** | 5 videos/mes | $29.99-$99.99/mes | 1080p-4K |
| **Fal.ai** | Créditos trial | Por GPU-second | Variable |

---

## 🎯 PLAN DE ACCIÓN BELENTANI

### Fase 1: Prototipado (gratis)
1. Usar Hailuo AI web para generar 2-3 videos/día
2. Experimentar con Director Mode
3. Crear biblioteca de clips para Judas Experience

### Fase 2: Producción (bajo costo)
1. Configurar API de Alibaba Wan (ya tienes Token Plan)
2. Generar videos programáticamente
3. Integrar con pipeline de música (ACE-Step + Demucs)

### Fase 3: Escalado (si hay presupuesto)
1. Comprar paquete MiniMax $1,000 (1 mes)
2. Producción masiva de contenido
3. Distribución en redes sociales

---

## 🔗 ENLACES ÚTILES

- **Hailuo AI Web**: https://hailuoai.video/
- **MiniMax API Docs**: https://platform.minimax.io/docs
- **Alibaba Wan**: https://dashscope-intl.aliyuncs.com
- **Fal.ai Video**: https://fal.ai/models/video
- **Kling AI**: https://klingai.com/

---

**Recomendación final**: Empieza con Hailuo AI web (gratis, Director Mode). Si necesitas automatización, usa Alibaba Wan con tu Token Plan. Para producción profesional, considera MiniMax API.

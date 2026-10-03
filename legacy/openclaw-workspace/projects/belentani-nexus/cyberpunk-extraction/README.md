# 🌆 CYBERPUNK EXTRACTION ENGINE — BELENTANI

## 🎯 MISIÓN
Extraer, transformar y clasificar fotos cyberpunk de Belentani desde múltiples fuentes, evaluando calidad por fuente y entregando el activo final.

**Resultado**: 8 fotos cyberpunk generadas + ranking de fuentes + repos evaluados.

---

## 📊 FUENTES EVALUADAS — RANKING DE CALIDAD

| # | Fuente | Accesible | Fotos | Calidad | Veredicto |
|---|--------|-----------|-------|---------|----------|
| 1 | **z-ai SDK image-edit** | ✅ SI | 8/8 | ALTA | 🏆 MEJOR: preserva likeness |
| 2 | **GitHub belentani_Omega** | Parcial | Estructura | Pendiente | Assets visuales |
| 3 | **GitHub judas-experience** | ✅ SI | 0 | N/A | Solo audio/docs |
| 4 | **Google Drive** | ❌ NO | N/A | N/A | Requiere OAuth2 |
| 5 | **Chat/Vel** | N/A | 0 | N/A | Sin fotos nuevas |

**GANADOR**: z-ai SDK image-edit — Preserva la likeness del artista, aplica estilo cyberpunk cinematográfico con calidad IMAX.

---

## 🎨 CATÁLOGO CYBERPUNK GENERADO

### Fotos Producidas (8 imágenes)

| # | Archivo | Tamaño | Escena | Resolución |
|---|---------|--------|--------|-----------|
| 1 | `belentani_fullbody_neon_rain.png` | 144KB | Calle cyberpunk, lluvia, neón azul/rosa, leather jacket LED | 1344x768 |
| 2 | `belentani_fullbody_red_traitor.png` | 176KB | Penthouse cyberpunk, traje rojo fibra óptica, megacity | 1344x768 |
| 3 | `belentani_fullbody_hologram_concert.png` | 186KB | Escenario holográfico, láseres, audiencia cibernética | 1344x768 |
| 4 | `belentani_fullbody_rooftop_sunset.png` | 143KB | Azotea atardecer, megacity, vehículos voladores | 1344x768 |
| 5 | `belentani_medium_silver_terminal.png` | 148KB | Sala de control, monitores holográficos azul-plata | 1024x1024 |
| 6 | `belentani_medium_observer_dark.png` | 73KB | Corredor distópico, claroscuro neón naranja | 1024x1024 |
| 7 | `belentani_medium_spy_neon.png` | 132KB | Callejón Tokio lluvioso, neón kanji, drones | 1024x1024 |
| 8 | `belentani_medium_neural_link.png` | 195KB | Close-up, cables interfaz neural, datos holográficos | 1024x1024 |

### Ranking de Calidad

| Posición | Archivo | Score | Razón |
|----------|---------|-------|-------|
| 🥇 | `belentani_medium_neural_link.png` | 195KB | Mayor detalle, close-up funciona mejor |
| 🥈 | `belentani_fullbody_hologram_concert.png` | 186KB | Composición compleja bien ejecutada |
| 🥉 | `belentani_fullbody_red_traitor.png` | 176KB | Traje rojo fibra óptica, buen contraste |
| 4 | `belentani_medium_silver_terminal.png` | 148KB | Blade Runner 2049 color grading |
| 5 | `belentani_fullbody_neon_rain.png` | 144KB | Clásico blade runner, lluvia y neón |
| 6 | `belentani_fullbody_rooftop_sunset.png` | 143KB | Composición widescreen efectiva |
| 7 | `belentani_medium_spy_neon.png` | 132KB | Tokio nocturno, buen bokeh |
| 8 | `belentani_medium_observer_dark.png` | 73KB | Más simple/recortado |

---

## 🔧 PIPELINE TÉCNICO

```
Foto Real del Artista (upload/)
    │
    │  fs.readFileSync → base64 → data:image URI
    │
    ▼
z-ai SDK images.generations.edit()
    │  prompt: descripción cyberpunk cinematográfica
    │  images: [{ url: dataUrl }]  ← foto REAL como input
    │  size: 1344x768 (widescreen) o 1024x1024 (cuadrado)
    │
    ▼
Response: { data: [{ base64: "..." }] }
    │
    │  Buffer.from(base64, 'base64')
    │  fs.writeFileSync(outputPath, buffer)
    │
    ▼
PNG final en /download/cyberpunk-extract/zai-generated/
```

**Regla de oro**: NUNCA generar foto del artista from scratch. Siempre usar foto real como `image` input del `edit` endpoint.

---

## 📦 REPOS GITHUB BELENTANI7 — INVENTARIO

### Repos con Contenido Visual Potencial

| Repo | Contenido | Relevancia |
|------|-----------|------------|
| **belentani_Omega** | `img/`, `assets/`, `site/` | 🟢 Assets visuales del ecosistema |
| **belentani-omega-template** | HTML inmersivo | 🟢 Plantilla experiencia web |
| **belentaniexperience** | Portfolio premium | 🟢 Referencias visuales |
| **judas-experience** | MP3 + docs | 🟡 Solo audio/docs |
| **arte-que-veste** | Arte y moda | 🟢 Contenido visual |
| **Duck-Deck** | Music production | 🟡 Assets HTML |
| **cinematic-prompt-formatter** | Prompts SD/Flux | 🟢 Directamente aplicable |
| **comfyui-json-compiler** | NL → ComfyUI | 🟢 Pipeline directo |
| **llm-vfx-orchestrator** | VFX + LLMs | 🟢 Orquestación autónoma |

---

## 🎨 MEJORES HERRAMIENTAS CYBERPUNK (Open Source)

### Generación de Imagen

| Repo | Stack | Calidad | Licencia |
|------|-------|---------|----------|
| **FLUX.2 Pro** | DiT, 12B params | Mejor fotorealista 2026 | Apache 2.0 |
| **SDXL + Cyberpunk LoRA** | SDXL + LoRA | Estilo cyberpunk directo | Safetensors |
| **Tencent Image 3.0** | DiT | Competidor FLUX 2 | Open |
| **Flux-LoRA-DLC** | 250+ LoRAs | Plataforma estilos masiva | Open |

### Preservación de Rostro (CRÍTICO)

| Repo | Función | Nota |
|------|---------|------|
| **IP-Adapter** | Image prompt adapter SD | Mantiene likeness + estilo |
| **IP-Adapter FaceID** | Extracción solo facial | Mejor fotorealismo |
| **InstantID** | Face preservation + generation | Alternativa IP-Adapter |
| **LivePortrait** | Animación facial 12.8ms | Breathing, blinking |
| **ControlNet** | Pose/depth/edge preservation | Mantener pose artista |

### Video (Cyberpunk en Movimiento)

| Repo | Función | Resolución |
|------|---------|------------|
| **Wan2.1 I2V** | Image-to-video cinematográfico | 720p/480p Turbo |
| **LTX-2.5** | Audio+sync video, 4K 50fps | 4K nativo |
| **HunyuanVideo 1.5** | Video 8.3B params | Alta calidad |
| **ComfyUI** | Orquestador workflows | Todos los modelos |

---

## 🚀 USO

### Instalación
```bash
# Clonar repo
git clone https://github.com/belentani7/cyberpunk-extraction-engine.git
cd cyberpunk-extraction

# Instalar dependencias
npm install

# Configurar API key
cp .env.example .env
# Editar .env con ZAI_API_KEY
```

### Generar Foto Cyberpunk
```javascript
const { editImage } = require('./src/editor');

const result = await editImage({
  sourceImage: './upload/belentani_real.png',
  prompt: 'Cyberpunk portrait, neon lights, rain, leather jacket, futuristic city background, cinematic lighting, 8K quality',
  size: '1344x768'
});

console.log(`Generated: ${result.outputPath}`);
```

### Prompt Templates

#### Full Body (Widescreen)
```
Full body shot of Belentani in cyberpunk setting, [SCENE], [LIGHTING], 
[WARDROBE], cinematic composition, dramatic lighting, 8K quality, 
photorealistic, IMAX cinematography
```

#### Medium Shot (Cuadrado)
```
Medium shot portrait of Belentani, [SCENE], [LIGHTING], [EXPRESSION],
cyberpunk aesthetic, neon accents, shallow depth of field, 
cinematic color grading, hyperdetailed
```

#### Close-Up (Detalle)
```
Extreme close-up of Belentani's face, [DETAIL], [LIGHTING],
cyberpunk elements, neon reflections, hyperrealistic skin texture,
cinematic macro photography, 8K resolution
```

---

## 📊 COMPARATIVA DE APIs

| API | Coste | Calidad | Velocidad | Recomendación |
|-----|-------|---------|-----------|---------------|
| **z-ai SDK** | $0.02/imagen | 🟢 Alta | 5-10s | 🏆 MEJOR |
| **Flux Pro** | $0.05/imagen | 🟢 Alta | 10-15s | Alternativa |
| **SDXL + LoRA** | Gratis (local) | 🟡 Media | 30-60s | Requiere GPU |
| **DALL-E 3** | $0.04/imagen | 🟡 Media | 15-20s | No preserva likeness |
| **Midjourney** | $10/mes | 🟢 Alta | 30-60s | No API oficial |

---

## 🎬 INTEGRACIÓN CON IMAX ALBUM ENGINE

Este motor es el **paso 1** del pipeline IMAX Album:

```
1. CYBERPUNK EXTRACTION ENGINE (este repo)
   ↓ Genera fotos cyberpunk del artista
   
2. IMAX ALBUM ENGINE
   ↓ Usa fotos para generar videoclips I2V
   
3. POST-PRODUCTION
   ↓ Upscale 4K, color grading, audio sync
   
4. EXPORT
   ↓ Renderizado final IMAX quality
```

---

## 📚 DOCUMENTACIÓN

- `CATALOGO_COMPLETO.md` - Catálogo detallado de las 8 fotos
- `PROMPTS_OPTIMIZADOS.md` - Prompts probados y mejorados
- `API_REFERENCE.md` - Documentación z-ai SDK
- `INTEGRATION_GUIDE.md` - Integración con IMAX Album Engine

---

## 🔒 SEGURIDAD

### Reglas Críticas
1. ✅ NUNCA generar foto del artista from scratch
2. ✅ SIEMPRE usar foto real como input
3. ✅ Preservar likeness en todas las transformaciones
4. ❌ NO subir fotos reales a repos públicos
5. ❌ NO compartir API keys

### Almacenamiento
- Fotos reales: `/upload/` (no versionar en git)
- Fotos generadas: `/output/` (versionar si es necesario)
- API keys: `.env` (nunca en código)

---

## 🎯 ROADMAP

### Fase 1: Core Engine (✅ 80%)
- [x] Pipeline z-ai SDK implementado
- [x] 8 fotos cyberpunk generadas
- [x] Ranking de calidad completado
- [ ] Interfaz CLI mejorada
- [ ] Batch processing

### Fase 2: Advanced Features (⏳ 0%)
- [ ] Integrar IP-Adapter FaceID
- [ ] Soporte para ControlNet
- [ ] Animación con LivePortrait
- [ ] Export a ComfyUI workflows

### Fase 3: Production Pipeline (⏳ 0%)
- [ ] Integración con IMAX Album Engine
- [ ] Google Drive sync
- [ ] Quality control automático
- [ ] Multi-resolution export

---

## 💡 CONSEJOS

### Mejores Prácticas
1. Usar fotos reales de alta resolución (mínimo 1024x1024)
2. Iluminación uniforme en foto original
3. Fondo neutro facilita la edición
4. Prompts específicos > prompts genéricos
5. Probar múltiples variaciones (3-5 por prompt)

### Prompts que Funcionan
- ✅ "Cyberpunk portrait, neon lights, rain"
- ✅ "Blade Runner 2049 aesthetic, cinematic lighting"
- ✅ "Futuristic city background, dramatic shadows"
- ❌ "Cool cyberpunk guy" (muy genérico)
- ❌ "Make it look sci-fi" (sin detalle)

---

**Status**: 🟢 OPERATIVO (8 fotos generadas)
**Versión**: 1.0.0
**Última actualización**: 2026-09-01

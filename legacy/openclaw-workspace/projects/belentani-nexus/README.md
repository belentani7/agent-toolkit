# 🦞 BELENTANI NEXUS

**Ecosistema IA unificado para producción musical, visual y cinematográfica**

Creado por **Pedro Belentani** - Artista digital, productor musical y arquitecto de sistemas IA

---

## 🎯 Visión

Belentani Nexus es un ecosistema completo que integra **50+ APIs de IA** para crear:

- 🎬 **Videos musicales automatizados** (IMAX Album Visual Factory)
- 📸 **Sesiones de fotos cyberpunk** (Cyberpunk Extraction Engine)
- 🎥 **Producción cinematográfica** (Judas Storyboard Orchestrator)
- 🤖 **Multi-modelo inteligente** (Qwen Token Plan + APIs gratuitas)

---

## 🏗️ Arquitectura

```
belentani-nexus/
├── api-clients/
│   └── belentani-api.js          # Cliente unificado (50+ APIs)
├── imax-album-engine/
│   └── engine.js                 # Generador de videos musicales
├── cyberpunk-extraction/
│   └── engine.js                 # Generador de fotos cyberpunk
├── judas-storyboard/
│   └── orchestrator.js           # Orquestador del videoclip "Judas"
├── components/
│   └── duck-studio/              # Componentes modulares
│       ├── audio-engine.js       # Motor de audio Web Audio API
│       ├── sequencer.js          # Secuenciador de pasos
│       └── styles.css            # Estilos cyberpunk
├── demo.js                       # Demo interactiva
├── package.json
└── .env.example                  # Configuración de APIs
```

---

## 🚀 Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/belentani7/belentani-nexus.git
cd belentani-nexus

# 2. Instalar dependencias
npm install

# 3. Configurar API keys
cp .env.example .env
# Editar .env con tus keys

# 4. Ejecutar demo
npm run demo
```

---

## 🎬 Proyectos

### 1. **Judas - Videoclip Cyberpunk**

Producción completa del videoclip "Judas" usando IA:

```bash
npm run judas
```

**Proceso:**
1. Análisis de la canción (estructura, letra, mood)
2. Generación de concepto visual cinematográfico
3. Storyboard detallado (8-12 escenas)
4. Generación de assets visuales (fotos cyberpunk)
5. Producción de video musical completo
6. Material promocional (posters, thumbnails, social media)

**Resultado:** Video musical + 50+ assets visuales + material promo

---

### 2. **IMAX Album Visual Factory**

Convierte canciones en videos musicales automatizados:

```bash
npm run imax
```

**Características:**
- Análisis automático de estructura musical
- Generación de storyboard por escena
- Keyframes con IA (Flux Pro)
- Animación de keyframes (MiniMax/Hailuo)
- Sincronización con audio
- Exportación en 4K

**APIs utilizadas:**
- Qwen (concepto y storyboard)
- Gemini (descripciones visuales)
- Fal.ai (generación de imágenes)
- MiniMax (animación de videos)

---

### 3. **Cyberpunk Extraction Engine**

Genera sesiones de fotos cyberpunk completas:

```bash
npm run cyberpunk
```

**Características:**
- 5 estilos cyberpunk (neon, dystopian, retro, minimal, glitch)
- Conceptos únicos por foto
- Prompts cinematográficos profesionales
- Generación con Flux Pro
- Metadata detallada (prompts, conceptos, URLs)

**Estilos disponibles:**
- `neon` - Neón brillante, luces de colores
- `dystopian` - Distópico, industrial, oscuro
- `retro` - Retrofuturista, años 80, synthwave
- `minimal` - Minimalista, limpio, futurista
- `glitch` - Glitch art, distorsión digital

---

## 🤖 APIs Soportadas

### **Texto/Chat (50+ modelos)**

| Provider | Modelos | Costo | Velocidad |
|----------|---------|-------|-----------|
| **Qwen** (Token Plan) | qwen-plus, qwen-max | Incluido | Rápido |
| **Gemini** | gemini-2.0-flash, gemini-1.5-pro | Gratis | Muy rápido |
| **Groq** | llama-3.3-70b, mixtral-8x7b | Gratis | Ultra rápido |
| **Z.AI** | glm-4-plus, glm-4v-plus | Gratis | Rápido |
| **SiliconFlow** | Qwen2.5-72B, DeepSeek-V3 | Gratis | Rápido |
| **Pollinations** | openai, mistral | Gratis | Medio |

### **Imagen**

| Provider | Modelos | Costo | Calidad |
|----------|---------|-------|---------|
| **Fal.ai** | Flux Pro, Flux Dev | Gratis con límites | Excelente |
| **Stability** | SDXL 1.0, SD3 | Pago | Profesional |
| **Replicate** | SDXL, Flux | Pago | Variable |

### **Video**

| Provider | Modelos | Costo | Duración |
|----------|---------|-------|----------|
| **MiniMax** | video-01 (Hailuo) | Gratis con límites | 6s |
| **Luma** | Dream Machine | Pago | 5s |
| **Kling** | Kling 1.5 | Pago | 10s |

---

## 💰 Optimización de Costos

**Estrategia de ruteo inteligente:**

```javascript
// 90% tareas → APIs gratuitas (Gemini, Groq, Pollinations)
// 10% tareas críticas → Token Plan (Qwen)
// Resultado: ~€0/mes en costos adicionales
```

**Prioridades:**
1. **Qwen Token Plan** (ya pagado, usar al máximo)
2. **Gemini** (gratis, muy potente)
3. **Groq** (gratis, ultra rápido)
4. **Pollinations** (gratis, sin API key)
5. **APIs de pago** (solo cuando sea necesario)

---

## 🎨 Estética

**Cyberpunk Cinematográfico:**
- Paleta: Neón (verde, morado, cyan) sobre negro
- Referencias: Blade Runner 2049, Ghost in the Shell, Akira
- Mood: Oscuro, emocional, futurista
- Tipografía: JetBrains Mono, Inter

---

## 📦 Componentes Modulares

### **Duck Studio OS**

Estudio de producción musical local con IA:

```javascript
const { DuckAudioEngine } = require('./components/duck-studio/audio-engine');
const { DuckSequencer } = require('./components/duck-studio/sequencer');

// Motor de audio con cadena de efectos
const engine = new DuckAudioEngine();
engine.init();
engine.selectMic(0); // U87 Condenser

// Secuenciador de pasos
const seq = new DuckSequencer(engine);
seq.setBpm(140);
seq.toggle();
```

**Características:**
- 8 micrófonos simulados (U87, SM7B, AKG C414, etc.)
- Cadena de efectos profesional (compresor, reverb, delay, saturación)
- Secuenciador de 16 pasos con 5 instrumentos
- Exportación WAV
- Grabación de takes

---

## 🔧 Configuración

### **Variables de Entorno (.env)**

```bash
# APIs gratuitas (recomendadas)
GEMINI_API_KEY=***
GROQ_API_KEY=***
ZAI_API_KEY=***
SILICON_API_KEY=***

# Token Plan (prioritario)
DASHSCOPE_API_KEY=***

# Imagen
FAL_KEY=***
STABILITY_API_KEY=***

# Video
MINIMAX_API_KEY=***
LUMA_API_KEY=***
```

### **Obtener API Keys**

1. **Gemini**: https://makersuite.google.com/app/apikey
2. **Groq**: https://console.groq.com/keys
3. **Z.AI**: https://open.bigmodel.cn/
4. **SiliconFlow**: https://cloud.siliconflow.cn/
5. **DashScope**: https://dashscope.console.aliyun.com/
6. **Fal.ai**: https://fal.ai/dashboard/keys

---

## 📊 Métricas

**Proyectos completados:**
- ✅ Belentani Nexus (este repositorio)
- ✅ IMAX Album Visual Factory
- ✅ Cyberpunk Extraction Engine
- ✅ Judas Storyboard Orchestrator
- ✅ Duck Studio OS (componentes modulares)

**APIs integradas:** 50+
**Modelos disponibles:** 100+
**Costo mensual:** ~€0 (optimizado)

---

## 🎓 Documentación

- [API Reference](./docs/API_REFERENCE.md)
- [IMAX Engine Guide](./imax-album-engine/README.md)
- [Cyberpunk Extraction Guide](./cyberpunk-extraction/README.md)
- [Judas Production Guide](./judas-storyboard/README.md)

---

## 🌐 Ecosistema Belentani

- **Belentani Portal**: https://belentani7.github.io
- **GitHub**: https://github.com/belentani7
- **Manos Abiertas**: Plataforma educativa para migrantes
- **Judas Experience**: 36M+ streams

---

## 📝 Licencia

MIT © Pedro Belentani

---

## 🦞 Créditos

Creado con pasión por **Pedro Belentani** - Barcelona, 2026

*Construyendo el legado digital del arte cyberpunk*

# 🦞 BELENTANI NEXUS - Legado Digital

**Ecosistema IA unificado para producción musical, visual y cinematográfica**

---

## 🎯 Misión

Crear un ecosistema completo de producción creativa usando IA, integrando:
- 50+ APIs de IA (gratuitas y Token Plan)
- Generación de videos musicales automatizados
- Sesiones de fotos cyberpunk profesionales
- Producción cinematográfica completa
- Optimización de costos (~€0/mes)

---

## 📦 Qué se Construyó

### **1. API Client Unificado** (`api-clients/belentani-api.js`)
- Cliente único para 50+ APIs
- Soporte para texto, imagen y video
- Ruteo inteligente (gratis → Token Plan → pago)
- Manejo de errores y fallbacks

### **2. IMAX Album Visual Factory** (`imax-album-engine/`)
- Convierte canciones en videos musicales
- Análisis automático de estructura musical
- Generación de storyboard por escena
- Keyframes con IA (Flux Pro)
- Animación de keyframes (MiniMax/Hailuo)
- Sincronización con audio
- Exportación en 4K

### **3. Cyberpunk Extraction Engine** (`cyberpunk-extraction/`)
- Genera sesiones de fotos cyberpunk
- 5 estilos (neon, dystopian, retro, minimal, glitch)
- Conceptos únicos por foto
- Prompts cinematográficos profesionales
- Metadata detallada

### **4. Judas Storyboard Orchestrator** (`judas-storyboard/`)
- Orquesta producción completa del videoclip "Judas"
- Concepto visual cinematográfico
- Storyboard detallado (8-12 escenas)
- Generación de assets visuales
- Material promocional (posters, thumbnails, social media)

### **5. Duck Studio OS Components** (`components/duck-studio/`)
- Motor de audio Web Audio API
- 8 micrófonos simulados
- Cadena de efectos profesional
- Secuenciador de 16 pasos
- Exportación WAV

---

## 🚀 Cómo Usar

### **Instalación**
```bash
cd projects/belentani-nexus
npm install
cp .env.example .env
# Editar .env con tus API keys
```

### **Demos**
```bash
# Demo general (prueba APIs)
npm run demo

# Producción completa del videoclip "Judas"
npm run judas

# Generar video musical IMAX
npm run imax

# Generar sesión de fotos cyberpunk
npm run cyberpunk
```

---

## 💰 Optimización de Costos

**Estrategia:**
- 90% tareas → APIs gratuitas (Gemini, Groq, Pollinations)
- 10% tareas críticas → Token Plan (Qwen)
- **Resultado: ~€0/mes en costos adicionales**

**APIs Gratuitas Recomendadas:**
1. **Gemini** - Texto, muy potente
2. **Groq** - Texto, ultra rápido
3. **Pollinations** - Texto, sin API key
4. **Fal.ai** - Imagen, gratis con límites
5. **Z.AI** - Texto, modelos chinos
6. **SiliconFlow** - Texto, Qwen + DeepSeek

---

## 📊 APIs Integradas

### **Texto/Chat**
- ✅ Qwen (Token Plan)
- ✅ Gemini (gratis)
- ✅ Groq (gratis)
- ✅ Z.AI (gratis)
- ✅ SiliconFlow (gratis)
- ✅ Pollinations (gratis)
- ✅ OpenRouter (50+ modelos)

### **Imagen**
- ✅ Fal.ai (Flux Pro, Flux Dev)
- ✅ Stability AI (SDXL, SD3)
- ✅ Replicate (modelos open source)

### **Video**
- ✅ MiniMax / Hailuo AI (video-01)
- ✅ Luma AI (Dream Machine)
- ✅ Kling AI (kling 1.5)

---

## 🎨 Estética Cyberpunk

**Paleta de Colores:**
- Verde neón: `#10b981`, `#34d399`, `#6ee7b7`
- Morado oscuro: `#7c3aed`, `#4c2580`, `#2a1245`
- Fondo: `#0b0614`, `#140a20`, `#1a0f26`

**Referencias Visuales:**
- Blade Runner 2049
- Ghost in the Shell
- Akira
- Cyberpunk 2077

**Mood:**
- Oscuro, emocional, futurista
- Neón sobre negro
- Cinematográfico, profesional

---

## 📁 Estructura del Proyecto

```
belentani-nexus/
├── api-clients/
│   └── belentani-api.js          # Cliente unificado (50+ APIs)
├── imax-album-engine/
│   ├── engine.js                 # Generador de videos musicales
│   └── README.md
├── cyberpunk-extraction/
│   ├── engine.js                 # Generador de fotos cyberpunk
│   └── README.md
├── judas-storyboard/
│   ├── orchestrator.js           # Orquestador del videoclip "Judas"
│   └── README.md
├── components/
│   └── duck-studio/              # Componentes modulares
│       ├── audio-engine.js
│       ├── sequencer.js
│       └── styles.css
├── demo.js                       # Demo interactiva
├── package.json
├── .env.example                  # Configuración de APIs
└── README.md
```

---

## 🔧 Próximos Pasos

### **Fase 1: Configuración**
- [ ] Obtener API keys gratuitas (Gemini, Groq, Fal.ai)
- [ ] Configurar `.env` con las keys
- [ ] Instalar dependencias (`npm install`)
- [ ] Ejecutar demo (`npm run demo`)

### **Fase 2: Producción**
- [ ] Producir videoclip "Judas" completo
- [ ] Generar sesión de fotos cyberpunk
- [ ] Crear video musical IMAX
- [ ] Exportar assets en 4K

### **Fase 3: Integración**
- [ ] Integrar con Belentani Portal
- [ ] Conectar con Duck Studio OS
- [ ] Publicar en GitHub Pages
- [ ] Documentar proceso completo

---

## 📚 Documentación

- [README Principal](./README.md)
- [API Reference](./docs/API_REFERENCE.md) - Próximamente
- [IMAX Engine Guide](./imax-album-engine/README.md)
- [Cyberpunk Extraction Guide](./cyberpunk-extraction/README.md)
- [Judas Production Guide](./judas-storyboard/README.md)

---

## 🌐 Ecosistema Belentani

- **Belentani Portal**: https://belentani7.github.io
- **GitHub**: https://github.com/belentani7
- **Manos Abiertas**: Plataforma educativa para migrantes
- **Judas Experience**: 36M+ streams
- **Duck Studio**: Estudio de producción musical con IA

---

## 🦞 Créditos

**Creado por:** Pedro Belentani  
**Fecha:** Septiembre 2026  
**Ubicación:** Barcelona, España  
**Licencia:** MIT

---

## 💡 Filosofía

> "Construir el legado digital del arte cyberpunk usando IA, optimizando costos al máximo y manteniendo la calidad profesional."

Este ecosistema demuestra que es posible crear producción cinematográfica de alta calidad usando APIs gratuitas y Token Plans, sin gastar miles de euros en software tradicional.

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Quemando tokens, construyendo el futuro.*

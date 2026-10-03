# 🦞 BELENTANI NEXUS - Guía de Producción

## 🎬 Producción de Videoclips con IA

### **Flujo de Trabajo Completo**

```
1. Concepto → 2. Storyboard → 3. Assets → 4. Video → 5. Promo
```

---

## 📋 Paso 1: Concepto Visual

### **Input**
- Nombre de la canción
- Duración
- Género musical
- Mood/emoción principal

### **Output**
- Título del concepto
- Sinopsis visual
- Personajes principales
- Escenario principal
- Paleta de colores
- Referencias visuales

### **Ejemplo: "Judas"**
```javascript
const concept = {
  title: "Redemption in Neon",
  synopsis: "Un protagonista andrógino navega por una ciudad cyberpunk distópica, buscando redención en un mundo de neón y sombras.",
  protagonist: {
    appearance: "Andrógino, ropa futurista cyberpunk, implantes cybernéticos",
    motivation: "Buscar redención en un mundo corrupto"
  },
  setting: "Ciudad distópica nocturna, calles iluminadas por neón, lluvia constante",
  colorPalette: ["cyan", "magenta", "purple", "black"],
  references: ["Blade Runner 2049", "Ghost in the Shell", "Cyberpunk 2077"]
};
```

---

## 📝 Paso 2: Storyboard

### **Estructura Típica (3 minutos)**
- **Intro** (0:00-0:20) - Establecer atmósfera
- **Verse 1** (0:20-0:50) - Introducir protagonista
- **Chorus 1** (0:50-1:15) - Acción principal
- **Verse 2** (1:15-1:45) - Desarrollo narrativo
- **Chorus 2** (1:45-2:10) - Clímax visual
- **Bridge** (2:10-2:30) - Momento emocional
- **Final Chorus** (2:30-2:50) - Clímax épico
- **Outro** (2:50-3:00) - Resolución

### **Por Escena**
```javascript
const scene = {
  number: 1,
  timestamp: "0:00-0:20",
  section: "intro",
  description: "Vista aérea de ciudad cyberpunk nocturna",
  visualElements: {
    setting: "Ciudad distópica, rascacielos con hologramas",
    characters: "Ninguno (establecimiento)",
    action: "Cámara se mueve entre edificios",
    camera: "Drone shot, movimiento suave",
    lighting: "Neón, lluvia, reflejos",
    mood: "Misterioso, atmosférico"
  },
  duration: 20,
  emotion: "mysterious",
  intensity: 3
};
```

---

## 🎨 Paso 3: Generación de Assets

### **Keyframes (Imágenes)**
```javascript
const keyframe = {
  scene: 1,
  prompt: "Aerial view of cyberpunk city at night, neon lights, rain, holographic billboards, volumetric fog, cinematic, 8k, ultra detailed",
  style: "cyberpunk-cinematic",
  resolution: "1920x1080",
  aspectRatio: "16:9"
};
```

### **Animación (Video)**
```javascript
const animation = {
  keyframe: "path/to/keyframe.png",
  prompt: "Camera slowly moving forward through cyberpunk city, neon lights flickering, rain falling, cinematic movement",
  duration: 5,
  fps: 30,
  model: "video-01" // MiniMax/Hailuo
};
```

---

## 🎥 Paso 4: Compilación de Video

### **Opciones de Exportación**
- **Calidad**: 1080p, 4K
- **FPS**: 24, 30, 60
- **Formato**: MP4, MOV
- **Codec**: H.264, H.265

### **Sincronización con Audio**
```javascript
const sync = {
  audioFile: "path/to/song.mp3",
  beats: [0, 20, 50, 75, 105, 130, 150, 170],
  transitions: "on-beat",
  effects: ["flash", "glitch", "zoom"]
};
```

---

## 📢 Paso 5: Material Promocional

### **Poster Principal**
- Formato: Vertical (2:3)
- Elementos: Título, artista, visual principal
- Estilo: Consistente con videoclip

### **Thumbnails**
- YouTube: 1280x720 (16:9)
- Spotify: 640x640 (1:1)
- Instagram: 1080x1080 (1:1)

### **Social Media Kit**
- Instagram Story (9:16)
- Twitter Header (3:1)
- Facebook Cover (16:9)
- TikTok/Reels (9:16, 15-60s)

---

## 🛠️ Herramientas del Ecosistema

### **1. IMAX Album Engine**
```bash
npm run imax
```
- Analiza estructura musical
- Genera storyboard automático
- Crea keyframes con IA
- Anima con video IA
- Compila video final

### **2. Judas Orchestrator**
```bash
npm run judas
```
- Producción completa de videoclip
- Concepto visual cinematográfico
- Storyboard detallado
- Assets visuales
- Material promocional

### **3. Cyberpunk Extraction**
```bash
npm run cyberpunk
```
- Sesión de fotos cyberpunk
- 5 estilos: neon, dystopian, retro, minimal, glitch
- 10 conceptos únicos
- Prompts profesionales
- Metadata detallada

---

## 💡 Mejores Prácticas

### **Prompts para Imágenes**
✅ **Buen prompt:**
```
Portrait of mysterious hacker in cyberpunk city, neon lights reflecting on wet streets, volumetric fog, cyan and magenta color palette, 85mm lens, f/1.8, ultra detailed, 8k, cinematic lighting, Blade Runner 2049 style
```

❌ **Mal prompt:**
```
hacker in city
```

### **Prompts para Video**
✅ **Buen prompt:**
```
Camera slowly tracking forward through neon-lit alley, rain falling, reflections on wet ground, volumetric fog, cinematic movement, smooth motion
```

❌ **Mal prompt:**
```
moving camera
```

### **Optimización de Costos**
- Usar APIs gratuitas para prototipado
- Reservar Token Plan para producción final
- Cachear prompts repetidos
- Usar batch processing para múltiples assets

---

## 📊 Métricas de Calidad

### **Imágenes**
- Resolución: 4K (3840x2160)
- Detalle: Ultra detailed
- Iluminación: Cinematic
- Composición: Rule of thirds

### **Videos**
- Resolución: 4K
- FPS: 30 (cinematic) o 60 (smooth)
- Duración: 3-5 minutos
- Transiciones: Suaves, on-beat

### **Audio**
- Calidad: 320kbps mínimo
- Sincronización: Frame-perfect
- Efectos: Reverb, delay, distortion

---

## 🎯 Checklist de Producción

### **Pre-Producción**
- [ ] Concepto visual definido
- [ ] Storyboard completo
- [ ] Referencias visuales recopiladas
- [ ] Paleta de colores seleccionada

### **Producción**
- [ ] Keyframes generados
- [ ] Videos animados
- [ ] Transiciones creadas
- [ ] Efectos aplicados

### **Post-Producción**
- [ ] Video compilado
- [ ] Audio sincronizado
- [ ] Color grading aplicado
- [ ] Exportación en múltiples formatos

### **Distribución**
- [ ] Material promocional creado
- [ ] Thumbnails optimizados
- [ ] Metadata completa
- [ ] Publicado en plataformas

---

## 🔗 Recursos Adicionales

- [Documentación API](./API_REFERENCE.md)
- [Templates](./api-clients/project-templates.js)
- [Prompt Generator](./api-clients/prompt-generator.js)
- [Asset Manager](./api-clients/asset-manager.js)

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Producción cinematográfica profesional con IA*

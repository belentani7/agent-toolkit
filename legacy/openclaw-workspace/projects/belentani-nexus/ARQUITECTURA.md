# 🦞 BELENTANI NEXUS - Arquitectura Técnica

## 🏗️ Vista General

```
┌─────────────────────────────────────────────────────────────┐
│                    BELENTANI NEXUS                          │
│              Ecosistema IA Unificado                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │  Core   │          │Production│         │  Tools  │
   │ Systems │          │ Engines │          │ & Utils │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Providers   │
                    │   (50+ APIs)      │
                    └───────────────────┘
```

---

## 📦 Módulos Core

### **1. API Client v2** (`belentani-api-v2.js`)
**Responsabilidad:** Cliente unificado para todas las APIs de IA

**Características:**
- Soporte para 50+ APIs
- Ruteo inteligente (gratis → Token Plan → pago)
- Caché de requests (ahorra tokens)
- Retry automático con backoff exponencial
- Logging y monitoreo
- Métricas de rendimiento y costos

**Dependencias:**
- `cache.js` - Caché de requests
- `logger.js` - Logging
- `performance-monitor.js` - Métricas

---

### **2. Smart Router** (`smart-router.js`)
**Responsabilidad:** Ruteo inteligente de requests

**Lógica:**
1. Intentar APIs gratuitas primero
2. Si falla o no disponible → Token Plan
3. Si Token Plan no disponible → APIs de pago
4. Si todo falla → Error con sugerencias

**Providers por prioridad:**
```javascript
const priorities = [
  'qwen',        // Token Plan (ya pagado)
  'gemini',      // Gratis
  'groq',        // Gratis
  'pollinations',// Gratis
  'zai',         // Gratis
  'silicon',     // Gratis
  'fal',         // Pago (imagen)
  'stability',   // Pago (imagen)
  'minimax',     // Pago (video)
  'luma'         // Pago (video)
];
```

---

### **3. Batch Processor** (`batch-processor.js`)
**Responsabilidad:** Procesamiento por lotes

**Características:**
- Procesamiento paralelo con límite de concurrencia
- Retry automático para items fallidos
- Progreso en tiempo real
- Métricas de rendimiento

**Ejemplo:**
```javascript
const batch = new BatchProcessor();
batch.generateProjectBatch('cyberpunk-session', {
  count: 10,
  style: 'neon'
});
await batch.processAll();
```

---

### **4. Request Cache** (`cache.js`)
**Responsabilidad:** Caché de requests para ahorrar tokens

**Características:**
- Caché en disco (persistente)
- TTL configurable (default: 24h)
- Evicción automática (LRU)
- Estadísticas de hit/miss

**Algoritmo:**
```javascript
// Generar hash único para cada request
const key = md5(JSON.stringify({ type, prompt, options }));

// Buscar en caché
const cached = cache.get(key);
if (cached) return cached;

// Ejecutar request y guardar en caché
const result = await api.call(prompt);
cache.set(key, result);
return result;
```

---

### **5. Logger** (`logger.js`)
**Responsabilidad:** Logging y monitoreo

**Niveles:**
- `debug` - Información detallada
- `info` - Información general
- `warn` - Advertencias
- `error` - Errores

**Características:**
- Logs por día (archivo separado)
- Rotación automática
- Estadísticas de sesión
- Exportación de métricas

---

### **6. Performance Monitor** (`performance-monitor.js`)
**Responsabilidad:** Métricas en tiempo real

**Métricas:**
- Requests totales/successful/failed
- Latencia promedio
- Hit rate de caché
- Costos estimados
- Errores recientes

**Ejemplo:**
```javascript
const monitor = new PerformanceMonitor();
monitor.recordRequest('qwen', 'text', 1500, true);
monitor.printReport();
```

---

## 🎬 Production Engines

### **1. IMAX Album Engine** (`imax-album-engine/engine.js`)
**Responsabilidad:** Generación automatizada de videos musicales

**Flujo:**
```
Canción → Análisis → Storyboard → Keyframes → Animación → Video Final
```

**Componentes:**
- Analizador de estructura musical
- Generador de storyboard
- Generador de keyframes (Flux Pro)
- Animador de keyframes (MiniMax/Hailuo)
- Compilador de video final

---

### **2. Cyberpunk Extraction** (`cyberpunk-extraction/engine.js`)
**Responsabilidad:** Sesiones de fotos cyberpunk

**Flujo:**
```
Concepto → Prompt → Imagen → Metadata → Asset
```

**Estilos:**
- Neon (brillante, colorido)
- Dystopian (oscuro, industrial)
- Retro (80s, synthwave)
- Minimal (limpio, moderno)
- Glitch (digital, caótico)

---

### **3. Judas Orchestrator** (`judas-storyboard/orchestrator.js`)
**Responsabilidad:** Producción completa del videoclip "Judas"

**Flujo:**
```
Concepto → Storyboard → Assets → Video → Promo
```

**Entregables:**
- Video musical completo (4K)
- 20+ fotos cyberpunk
- Material promocional (poster, thumbnail, social media)

---

## 🔧 Tools & Utils

### **1. Prompt Generator** (`prompt-generator.js`)
**Responsabilidad:** Generación avanzada de prompts

**Tipos:**
- Cyberpunk (imágenes)
- Cinematic (videos)
- Storyboard (escenas)
- Promo (material promocional)
- Photoshoot (sesiones de fotos)

---

### **2. Asset Manager** (`asset-manager.js`)
**Responsabilidad:** Gestión de assets generados

**Características:**
- Almacenamiento organizado
- Metadata detallada
- Búsqueda y filtrado
- Exportación (JSON, CSV, Markdown)
- Limpieza automática

---

### **3. Project Templates** (`project-templates.js`)
**Responsabilidad:** Templates predefinidos

**Templates:**
- `judas` - Videoclip completo
- `cyberpunkAlbum` - Álbum visual
- `musicVideo` - Video musical genérico
- `photoshoot` - Sesión de fotos
- `promo` - Material promocional

---

## 🌐 API Providers

### **Texto/Chat**
| Provider | Costo | Velocidad | Calidad |
|----------|-------|-----------|---------|
| Qwen | Token Plan | Media | Alta |
| Gemini | Gratis | Rápida | Alta |
| Groq | Gratis | Muy rápida | Alta |
| Z.AI | Gratis | Media | Media |
| SiliconFlow | Gratis | Media | Alta |
| Pollinations | Gratis | Rápida | Media |

### **Imagen**
| Provider | Costo | Velocidad | Calidad |
|----------|-------|-----------|---------|
| Fal.ai (Flux) | €0.05/imagen | Rápida | Muy alta |
| Stability AI | €0.06/imagen | Media | Alta |
| Replicate | Variable | Media | Alta |

### **Video**
| Provider | Costo | Velocidad | Calidad |
|----------|-------|-----------|---------|
| MiniMax/Hailuo | €0.10/video | Lenta | Alta |
| Luma AI | €0.15/video | Media | Alta |
| Kling AI | €0.20/video | Media | Muy alta |

---

## 💾 Estructura de Datos

### **Asset**
```javascript
{
  id: "abc123",
  type: "image",
  filename: "image-abc123-1234567890.png",
  filepath: "/output/images/image-abc123-1234567890.png",
  timestamp: 1234567890,
  size: 1024000,
  prompt: "cyberpunk city at night",
  provider: "fal",
  model: "flux-pro",
  url: "https://..."
}
```

### **Scene**
```javascript
{
  number: 1,
  timestamp: "0:00-0:20",
  section: "intro",
  description: "Vista aérea de ciudad cyberpunk",
  visualElements: {
    setting: "Ciudad distópica",
    characters: "Ninguno",
    action: "Cámara se mueve",
    camera: "Drone shot",
    lighting: "Neón, lluvia",
    mood: "Misterioso"
  },
  duration: 20,
  emotion: "mysterious",
  intensity: 3
}
```

### **Project**
```javascript
{
  id: 1234567890,
  name: "Judas - Videoclip Cyberpunk",
  description: "Producción completa del videoclip",
  duration: 180,
  scenes: 10,
  style: "cyberpunk-cinematic",
  createdAt: "2026-09-01T12:00:00Z",
  deliverables: {
    video: { format: "mp4", resolution: "4K" },
    photos: { count: 20 },
    promo: ["poster", "thumbnail"]
  }
}
```

---

## 🔐 Seguridad

### **API Keys**
- Almacenadas en `.env` (no en código)
- Nunca expuestas en logs
- Rotación recomendada cada 90 días

### **Caché**
- Datos sensibles no se cachean
- TTL máximo: 24 horas
- Limpieza automática

### **Logs**
- No contienen API keys
- Rotación automática (7 días)
- Acceso restringido

---

## 📊 Métricas de Rendimiento

### **Objetivos**
- Latencia promedio: < 2000ms
- Hit rate de caché: > 50%
- Tasa de error: < 5%
- Costo mensual: ~€0

### **Monitoreo**
- Requests por provider
- Errores por tipo
- Costos estimados
- Uso de caché

---

## 🚀 Escalabilidad

### **Horizontal**
- Múltiples instancias con caché compartido
- Load balancing entre providers
- Failover automático

### **Vertical**
- Procesamiento por lotes
- Paralelización de requests
- Optimización de prompts

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Arquitectura técnica del ecosistema Belentani Nexus*

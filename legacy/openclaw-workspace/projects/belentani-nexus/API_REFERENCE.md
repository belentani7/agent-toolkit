# 🦞 BELENTANI NEXUS - API Reference

## 📡 BelentaniAPI v2

### **Inicialización**
```javascript
const BelentaniAPI = require('./api-clients/belentani-api-v2');
const api = new BelentaniAPI({
  defaultProvider: 'qwen',
  maxRetries: 3,
  retryDelay: 1000
});
```

---

## 💬 Chat / Texto

### **chat(prompt, options)**
Genera texto con IA.

**Parámetros:**
- `prompt` (string): Texto o pregunta
- `options` (object):
  - `provider` (string): 'qwen' | 'gemini' | 'groq' | 'zai' | 'silicon' | 'pollinations'
  - `model` (string): Modelo específico
  - `cache` (boolean): Usar caché (default: true)

**Ejemplo:**
```javascript
const response = await api.chat('Escribe un poema cyberpunk', {
  provider: 'qwen',
  model: 'qwen-plus'
});
console.log(response);
```

---

## 🖼️ Imagen

### **generateImage(prompt, options)**
Genera imágenes con IA.

**Parámetros:**
- `prompt` (string): Descripción de la imagen
- `options` (object):
  - `provider` (string): 'fal' | 'stability'
  - `model` (string): Modelo específico
  - `size` (string): 'landscape_16_9' | 'portrait_9_16' | 'square_1_1'
  - `count` (number): Número de imágenes (1-4)

**Ejemplo:**
```javascript
const urls = await api.generateImage('Cyberpunk city at night', {
  provider: 'fal',
  model: 'fal-ai/flux/dev',
  size: 'landscape_16_9',
  count: 2
});
console.log(urls); // ['https://...', 'https://...']
```

---

## 🎥 Video

### **generateVideo(prompt, imageUrl, options)**
Genera video desde imagen + prompt.

**Parámetros:**
- `prompt` (string): Descripción del movimiento
- `imageUrl` (string): URL de imagen inicial
- `options` (object):
  - `provider` (string): 'minimax' | 'luma'
  - `duration` (number): Duración en segundos

**Ejemplo:**
```javascript
const taskId = await api.generateVideo(
  'Camera slowly moving forward through neon city',
  'https://example.com/image.png',
  { provider: 'minimax', duration: 5 }
);
console.log(taskId);
```

---

## 📊 Estadísticas

### **getStats()**
Obtiene estadísticas del sistema.

**Ejemplo:**
```javascript
const stats = api.getStats();
console.log(stats);
// {
//   cache: { total: 100, valid: 95, expired: 5 },
//   session: { requests: 50, errors: 2, ... }
// }
```

---

## 🗑️ Caché

### **clearCache()**
Limpia todo el caché.

**Ejemplo:**
```javascript
api.clearCache();
```

---

## 📈 Reporte

### **generateReport()**
Genera reporte completo en consola.

**Ejemplo:**
```javascript
api.generateReport();
```

---

## 🎨 PromptGenerator

### **Inicialización**
```javascript
const PromptGenerator = require('./api-clients/prompt-generator');
const prompts = new PromptGenerator();
```

### **generateCyberpunk(subject, options)**
Genera prompt para imagen cyberpunk.

**Parámetros:**
- `subject` (string): Sujeto principal
- `options` (object):
  - `quality` (string): Calidad (default: 'ultra detailed, 8k')
  - `camera` (string): Tipo de cámara
  - `location` (string): Ubicación
  - `mood` (string): Estado de ánimo

**Ejemplo:**
```javascript
const prompt = prompts.generateCyberpunk('mysterious hacker', {
  location: 'neon-lit alley',
  mood: 'intense',
  camera: '85mm lens, f/1.8'
});
console.log(prompt);
```

### **generateCinematic(scene, options)**
Genera prompt para video cinematográfico.

**Ejemplo:**
```javascript
const prompt = prompts.generateCinematic('protagonist walking through city', {
  camera_movement: 'slow tracking shot',
  duration: 5
});
```

### **generateStoryboard(sceneNumber, description, options)**
Genera prompt para storyboard.

**Ejemplo:**
```javascript
const prompt = prompts.generateStoryboard(1, 'Opening scene', {
  setting: 'cyberpunk city at night',
  characters: 'mysterious protagonist',
  action: 'walking through neon streets',
  camera: 'wide establishing shot',
  lighting: 'neon signs, volumetric fog',
  mood: 'atmospheric',
  palette: 'cyan, magenta, purple'
});
```

### **generatePromo(type, title, artist, options)**
Genera prompt para material promocional.

**Tipos:** 'poster' | 'thumbnail' | 'instagram_story'

**Ejemplo:**
```javascript
const prompt = prompts.generatePromo('poster', 'Judas', 'Belentani', {
  visual: 'protagonist in neon city',
  background: 'dystopian cityscape',
  colors: 'neon cyan, magenta',
  mood: 'dark, mysterious'
});
```

### **generatePhotoshootPrompt(concept, style)**
Genera prompt para sesión de fotos.

**Estilos:** 'neon' | 'dystopian' | 'retro' | 'minimal' | 'glitch'

**Ejemplo:**
```javascript
const prompt = prompts.generatePhotoshootPrompt('cyberpunk warrior', 'neon');
```

---

## 📦 AssetManager

### **Inicialización**
```javascript
const AssetManager = require('./api-clients/asset-manager');
const assets = new AssetManager({
  baseDir: './output'
});
await assets.init();
```

### **saveAsset(type, data, metadata)**
Guarda un asset.

**Parámetros:**
- `type` (string): 'image' | 'video' | 'audio' | 'metadata' | 'prompt'
- `data` (Buffer|string): Contenido del asset
- `metadata` (object): Metadata adicional

**Ejemplo:**
```javascript
const asset = await assets.saveAsset('image', buffer, {
  prompt: 'cyberpunk city',
  provider: 'fal',
  model: 'flux-pro'
});
console.log(asset.id);
```

### **getAsset(id)**
Obtiene un asset por ID.

**Ejemplo:**
```javascript
const asset = await assets.getAsset('abc123');
```

### **listAssets(type, options)**
Lista assets.

**Parámetros:**
- `type` (string): Filtrar por tipo (opcional)
- `options` (object):
  - `limit` (number): Máximo de resultados
  - `sortBy` (string): 'timestamp'

**Ejemplo:**
```javascript
const images = await assets.listAssets('image', {
  limit: 10,
  sortBy: 'timestamp'
});
```

### **deleteAsset(id)**
Elimina un asset.

**Ejemplo:**
```javascript
await assets.deleteAsset('abc123');
```

### **searchAssets(query)**
Busca assets por metadata.

**Ejemplo:**
```javascript
const results = await assets.searchAssets('cyberpunk');
```

### **exportAssets(format, options)**
Exporta assets.

**Formatos:** 'json' | 'csv' | 'markdown'

**Ejemplo:**
```javascript
const filepath = await assets.exportAssets('json', {
  type: 'image'
});
```

### **getStats()**
Obtiene estadísticas de assets.

**Ejemplo:**
```javascript
const stats = await assets.getStats();
console.log(stats);
// {
//   total: 100,
//   byType: { image: 80, video: 20 },
//   totalSize: '1.5 GB'
// }
```

### **cleanup(daysToKeep)**
Limpia assets antiguos.

**Ejemplo:**
```javascript
await assets.cleanup(30); // Elimina assets de más de 30 días
```

---

## 📋 ProjectTemplates

### **Inicialización**
```javascript
const ProjectTemplates = require('./api-clients/project-templates');
const templates = new ProjectTemplates();
```

### **getTemplate(name)**
Obtiene un template.

**Templates:** 'judas' | 'cyberpunkAlbum' | 'musicVideo' | 'photoshoot' | 'promo'

**Ejemplo:**
```javascript
const judasTemplate = templates.getTemplate('judas');
```

### **listTemplates()**
Lista todos los templates.

**Ejemplo:**
```javascript
const list = templates.listTemplates();
console.log(list);
// [
//   { name: 'judas', description: '...' },
//   { name: 'cyberpunkAlbum', description: '...' }
// ]
```

### **createProject(templateName, overrides)**
Crea un proyecto desde template.

**Ejemplo:**
```javascript
const project = await templates.createProject('judas', {
  duration: 200,
  scenes: 12
});
```

---

## 🎬 IMAXAlbumEngine

### **Inicialización**
```javascript
const IMAXAlbumEngine = require('./imax-album-engine/engine');
const engine = new IMAXAlbumEngine(api);
```

### **analyzeSongStructure()**
Analiza estructura de canción.

**Ejemplo:**
```javascript
const analysis = await engine.analyzeSongStructure();
console.log(analysis.sections);
```

### **generateStoryboard(analysis)**
Genera storyboard desde análisis.

**Ejemplo:**
```javascript
const storyboard = await engine.generateStoryboard(analysis);
```

### **generateKeyframes(storyboard)**
Genera keyframes desde storyboard.

**Ejemplo:**
```javascript
const keyframes = await engine.generateKeyframes(storyboard);
```

### **animateKeyframes(keyframes)**
Anima keyframes con video IA.

**Ejemplo:**
```javascript
const videos = await engine.animateKeyframes(keyframes);
```

### **compileFinalVideo(videos)**
Compila video final.

**Ejemplo:**
```javascript
const finalVideo = await engine.compileFinalVideo(videos);
```

---

## 📸 CyberpunkExtraction

### **Inicialización**
```javascript
const CyberpunkExtraction = require('./cyberpunk-extraction/engine');
const engine = new CyberpunkExtraction(api);
```

### **generateConcepts(count)**
Genera conceptos únicos.

**Ejemplo:**
```javascript
const concepts = await engine.generateConcepts(10);
```

### **generatePrompts(concepts, style)**
Genera prompts desde conceptos.

**Estilos:** 'neon' | 'dystopian' | 'retro' | 'minimal' | 'glitch'

**Ejemplo:**
```javascript
const prompts = await engine.generatePrompts(concepts, 'neon');
```

### **generatePhotoshoot(concepts, style)**
Genera sesión de fotos completa.

**Ejemplo:**
```javascript
const images = await engine.generatePhotoshoot(concepts, 'neon');
```

---

## 🎬 JudasOrchestrator

### **Inicialización**
```javascript
const JudasOrchestrator = require('./judas-storyboard/orchestrator');
const orchestrator = new JudasOrchestrator(api);
```

### **generateConcept()**
Genera concepto visual.

**Ejemplo:**
```javascript
const concept = await orchestrator.generateConcept();
```

### **generateStoryboard(concept)**
Genera storyboard detallado.

**Ejemplo:**
```javascript
const storyboard = await orchestrator.generateStoryboard(concept);
```

### **generateVisualAssets(storyboard)**
Genera assets visuales.

**Ejemplo:**
```javascript
const assets = await orchestrator.generateVisualAssets(storyboard);
```

### **generatePromotionalMaterial(concept)**
Genera material promocional.

**Ejemplo:**
```javascript
const promo = await orchestrator.generatePromotionalMaterial(concept);
```

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Documentación completa del ecosistema Belentani Nexus*

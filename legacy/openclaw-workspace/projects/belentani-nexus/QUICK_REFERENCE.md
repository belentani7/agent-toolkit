# 🦞 BELENTANI NEXUS - Quick Reference

## 🚀 Comandos Rápidos

### **Setup**
```bash
npm run setup          # Configurar API keys
npm run quick          # Quick start
npm run demo           # Demo completa
```

### **Producción**
```bash
npm run judas          # Videoclip "Judas"
npm run imax           # Video musical IMAX
npm run cyberpunk      # Sesión de fotos
```

### **CLI**
```bash
node cli.js help       # Ayuda
node cli.js stats      # Estadísticas
node cli.js templates  # Listar templates
node cli.js assets     # Listar assets
```

### **Producción CLI**
```bash
node production-cli.js judas
node production-cli.js imax
node production-cli.js cyberpunk 20 neon
```

---

## 📡 API Usage

### **Chat**
```javascript
const response = await api.chat('Escribe un poema', {
  provider: 'qwen'
});
```

### **Imagen**
```javascript
const urls = await api.generateImage('cyberpunk city', {
  provider: 'fal',
  model: 'fal-ai/flux/dev'
});
```

### **Video**
```javascript
const taskId = await api.generateVideo(
  'camera moving',
  'https://image.png',
  { provider: 'minimax' }
);
```

---

## 🎨 Prompts

### **Cyberpunk**
```javascript
const prompt = prompts.generateCyberpunk('mysterious hacker', {
  location: 'neon alley',
  mood: 'intense'
});
```

### **Cinematic**
```javascript
const prompt = prompts.generateCinematic('protagonist walking', {
  camera_movement: 'tracking shot',
  duration: 5
});
```

### **Storyboard**
```javascript
const prompt = prompts.generateStoryboard(1, 'Opening scene', {
  setting: 'cyberpunk city',
  mood: 'atmospheric'
});
```

---

## 📦 Assets

### **Guardar**
```javascript
const asset = await assets.saveAsset('image', buffer, {
  prompt: 'cyberpunk city',
  provider: 'fal'
});
```

### **Listar**
```javascript
const images = await assets.listAssets('image', {
  limit: 10
});
```

### **Exportar**
```javascript
await assets.exportAssets('json');
```

---

## 🔗 Links

- **Portal**: https://belentani7.github.io
- **GitHub**: https://github.com/belentani7/belentani-nexus
- **Email**: belentani7pedro@gmail.com

---

**🔥 MODO LEGADO ACTIVADO 🔥**

# 🦞 BELENTANI NEXUS - Guía de Inicio Rápido

## ⚡ Instalación en 3 Pasos

### 1. Instalar Dependencias
```bash
cd projects/belentani-nexus
npm install
```

### 2. Configurar API Keys
```bash
# Opción A: Setup automático (recomendado)
npm run setup

# Opción B: Manual
cp .env.example .env
# Editar .env con tus keys
```

### 3. Ejecutar Demo
```bash
npm run demo
```

---

## 🎬 Proyectos Disponibles

### **Judas - Videoclip Completo**
```bash
npm run judas
```
Genera:
- Concepto visual cinematográfico
- Storyboard de 8-12 escenas
- Assets visuales (fotos cyberpunk)
- Video musical completo
- Material promocional

### **IMAX Album Visual Factory**
```bash
npm run imax
```
Convierte canciones en videos musicales automatizados

### **Cyberpunk Extraction**
```bash
npm run cyberpunk
```
Genera sesiones de fotos cyberpunk profesionales

---

## 🔑 API Keys Necesarias

### **Mínimas (Gratis)**
1. **Gemini** → https://makersuite.google.com/app/apikey
2. **Groq** → https://console.groq.com/keys

### **Recomendadas (Gratis)**
3. **Z.AI** → https://open.bigmodel.cn/
4. **SiliconFlow** → https://cloud.siliconflow.cn/
5. **Fal.ai** → https://fal.ai/dashboard/keys

### **Token Plan (Ya Pagado)**
6. **DashScope** → https://dashscope.console.aliyun.com/

---

## 📊 Arquitectura

```
belentani-nexus/
├── api-clients/
│   ├── belentani-api.js          # Cliente v1
│   ├── belentani-api-v2.js       # Cliente v2 (con caché)
│   ├── smart-router.js           # Ruteo inteligente
│   ├── batch-processor.js        # Procesamiento por lotes
│   ├── cache.js                  # Caché de requests
│   └── logger.js                 # Logging y monitoreo
├── imax-album-engine/
│   └── engine.js                 # Videos musicales
├── cyberpunk-extraction/
│   └── engine.js                 # Fotos cyberpunk
├── judas-storyboard/
│   └── orchestrator.js           # Videoclip "Judas"
├── components/
│   └── duck-studio/              # Audio/Secuenciador
├── index.js                      # Entry point
├── demo.js                       # Demo interactiva
├── setup.js                      # Setup wizard
└── package.json
```

---

## 💡 Ejemplos de Uso

### **Chat con IA**
```javascript
const BelentaniAPI = require('./api-clients/belentani-api-v2');
const api = new BelentaniAPI();

const response = await api.chat('Escribe un poema cyberpunk', {
  provider: 'qwen'
});
console.log(response);
```

### **Generar Imagen**
```javascript
const urls = await api.generateImage('Cyberpunk city at night', {
  provider: 'fal',
  size: 'landscape_16_9'
});
console.log(urls);
```

### **Procesamiento por Lotes**
```javascript
const BatchProcessor = require('./api-clients/batch-processor');
const batch = new BatchProcessor();

batch.generateProjectBatch('cyberpunk-session', {
  count: 10,
  style: 'neon'
});

await batch.processAll();
```

---

## 🎯 Optimización de Costos

**Estrategia:**
- 90% tareas → APIs gratuitas
- 10% críticas → Token Plan (Qwen)
- **Resultado: ~€0/mes**

**Prioridades:**
1. Qwen (Token Plan - ya pagado)
2. Gemini (gratis)
3. Groq (gratis)
4. Pollinations (gratis)
5. APIs de pago (solo si es necesario)

---

## 📚 Documentación Completa

- [README Principal](./README.md)
- [LEGADO.md](./LEGADO.md) - Filosofía y visión
- [GUIA_INICIO.md](./GUIA_INICIO.md) - Este archivo
- [API Reference](./docs/API_REFERENCE.md) - Próximamente

---

## 🚀 Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Configurar API keys (mínimo Gemini + Groq)
3. ✅ Ejecutar `npm run demo`
4. ✅ Probar `npm run judas`
5. ✅ Generar tu primer video musical

---

## 🆘 Troubleshooting

### **Error: "API key not found"**
```bash
# Verificar que .env existe
cat .env

# Si no existe, ejecutar setup
npm run setup
```

### **Error: "Module not found"**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error: "All attempts failed"**
```bash
# Verificar que tienes al menos 1 API key configurada
# Ejecutar con verbose
DEBUG=true npm run demo
```

---

## 📞 Soporte

- **GitHub Issues**: https://github.com/belentani7/belentani-nexus/issues
- **Documentación**: https://belentani7.github.io
- **Email**: belentani7pedro@gmail.com

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Construyendo el futuro del arte cyberpunk con IA*

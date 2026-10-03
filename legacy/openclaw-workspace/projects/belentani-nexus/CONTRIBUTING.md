# 🦞 BELENTANI NEXUS - Contribuir

## 🎉 ¡Gracias por tu interés!

Belentani Nexus es un ecosistema de producción cinematográfica con IA que busca democratizar la creación de contenido profesional.

---

## 🚀 Cómo Contribuir

### **1. Reportar Bugs**
- Usa [GitHub Issues](https://github.com/belentani7/belentani-nexus/issues)
- Incluye: pasos para reproducir, esperado vs actual, logs
- Etiqueta: `bug`

### **2. Sugerir Features**
- Abre un issue con etiqueta `enhancement`
- Describe el caso de uso
- Explica el beneficio

### **3. Enviar Pull Requests**
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'Add: nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Abre un Pull Request

---

## 📝 Estilo de Código

### **JavaScript**
- Usar ES6+
- Const/let (no var)
- Async/await (no callbacks)
- JSDoc para funciones públicas

### **Ejemplo**
```javascript
/**
 * Genera una imagen cyberpunk
 * @param {string} prompt - Descripción de la imagen
 * @param {object} options - Opciones de generación
 * @returns {Promise<string[]>} URLs de las imágenes generadas
 */
async function generateCyberpunkImage(prompt, options = {}) {
  const provider = options.provider || 'fal';
  // ...
}
```

---

## 🧪 Testing

### **Ejecutar Tests**
```bash
npm test
```

### **Cobertura**
```bash
npm run test:coverage
```

### **Escribir Tests**
- Usar Jest
- Nombrar: `*.test.js`
- Cubrir casos edge
- Mock APIs externas

---

## 📚 Documentación

### **Actualizar Docs**
- README.md - Información general
- API_REFERENCE.md - Referencia de API
- PRODUCCION.md - Guías de producción
- ARQUITECTURA.md - Arquitectura técnica

### **Escribir Comentarios**
- Funciones públicas: JSDoc
- Lógica compleja: comentarios inline
- TODOs: `// TODO: descripción`

---

## 🎨 Estética

### **Visual**
- Paleta: Neón (verde, morado, cyan) sobre negro
- Tipografía: JetBrains Mono, Inter
- Referencias: Blade Runner 2049, Ghost in the Shell

### **Tono**
- Profesional pero accesible
- Técnico pero claro
- Entusiasta pero realista

---

## 🔄 Proceso de Review

### **Pull Requests**
1. Verificar que pasa tests
2. Revisar código por maintainer
3. Address feedback
4. Merge a `main`

### **Criterios**
- ✅ Código limpio y documentado
- ✅ Tests pasan
- ✅ Cobertura adecuada
- ✅ Documentación actualizada
- ✅ Sigue estilo del proyecto

---

## 💡 Ideas para Contribuir

### **Fáciles**
- [ ] Agregar más templates
- [ ] Mejorar documentación
- [ ] Agregar tests
- [ ] Traducir docs

### **Medias**
- [ ] Integrar nuevas APIs
- [ ] Optimizar prompts
- [ ] Mejorar UI/UX
- [ ] Agregar ejemplos

### **Avanzadas**
- [ ] Implementar nuevas engines
- [ ] Optimizar rendimiento
- [ ] Crear plugins
- [ ] Integrar con DAWs

---

## 🆘 Ayuda

### **Recursos**
- [Documentación](./README.md)
- [API Reference](./API_REFERENCE.md)
- [Guía de Producción](./PRODUCCION.md)
- [Arquitectura](./ARQUITECTURA.md)

### **Contacto**
- Email: belentani7pedro@gmail.com
- GitHub: https://github.com/belentani7
- Portal: https://belentani7.github.io

---

## 📜 Licencia

MIT License - Ver [LICENSE](./LICENSE) para detalles.

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Construyendo el futuro del arte cyberpunk con IA*

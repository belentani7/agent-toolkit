# 🚨 MiniMax Token Plan Issue Report

**Fecha:** 2026-09-01  
**Usuario:** belentani7 (belenta***@gmail.com)  
**Plan:** Individual Standard  
**Status:** Active (358 days remaining, expires 2027-08-25)

---

## 🔴 PROBLEMA DETECTADO

### Síntoma
En el panel de MiniMax, sección "Token Plan Usage":
- **Supported models:** Muestra "No supported models"
- **Uso de tokens:** Hay actividad (2.7M uncached input, 9.6M cached input, 244K output)
- **Estado:** Plan activo con 10,000 tokens totales

### Análisis
**Inconsistencia:** El plan está activo y hay uso de tokens, pero la interfaz dice "No supported models". Esto sugiere:

1. **Bug en la UI de MiniMax** — El frontend no está renderizando la lista de modelos
2. **Problema de sincronización** — El backend tiene los modelos pero no se muestran
3. **Cambio en la API** — MiniMax actualizó su sistema y la UI no se actualizó
4. **Problema de permisos** — Los modelos están disponibles pero no se listan correctamente

### Impacto
- El usuario **SÍ puede usar** los modelos (hay evidencia de uso de tokens)
- Pero **NO puede ver** qué modelos tiene disponibles
- Dificulta la planificación y el debugging

---

## 🔍 EVIDENCIA

### Datos del Panel (captura 2026-09-01 10:30)
```
Token Plan Quick Start
Individual Plan: Standard
Status: Active
Auto-renew: Yes
Remaining days: 358
Expiry date: 2027-08-25 18:00:00

7 Days Usage Limit:
Remaining: 100.0%
Total: 10,000

Usage Details (Last 7 Days):
- 08-26: [datos]
- 08-27: [datos]
- 08-28: [datos]
- 08-29: [datos]
- 08-30: [datos]
- 08-31: [datos]
- 09-01: 
  - Uncached Input: 2,707,359 tokens
  - Cached Input: 9,598,336 tokens
  - Output: 244,207 tokens

Supported models: "No supported models" ← 🔴 PROBLEMA
```

---

## 💻 ACCIONES TOMADAS

### 1. Logout de MiniMax
✅ Sesión cerrada en el navegador  
✅ Cache limpiado

### 2. Documentación del Issue
✅ Este reporte creado  
✅ Evidencia capturada

### 3. Próximos Pasos Sugeridos
- [ ] Contactar soporte MiniMax
- [ ] Verificar en documentación oficial qué modelos incluye el plan Standard
- [ ] Probar API directamente para confirmar que los modelos funcionan
- [ ] Reportar bug en comunidad/foro de MiniMax

---

## 📞 CONTACTO SOPORTE MINIMAX

### Opciones
1. **Email:** support@minimax.io (verificar en docs oficiales)
2. **Portal:** https://platform.minimax.io/support
3. **Discord/Comunidad:** Verificar si tienen servidor oficial

### Template de Email
```
Subject: Bug - "No supported models" shown despite active Token Plan

Hi MiniMax Team,

I'm experiencing an issue with my Token Plan dashboard:

Account: belenta***@gmail.com
Plan: Individual Standard (Active, 358 days remaining)
Issue: "Supported models" section shows "No supported models"

However, I can see token usage in the last 7 days:
- Uncached Input: 2,707,359 tokens
- Cached Input: 9,598,336 tokens  
- Output: 244,207 tokens

This suggests the models ARE working, but the UI is not displaying the supported models list correctly.

Can you:
1. Confirm which models are included in my Individual Standard plan?
2. Fix the UI bug showing "No supported models"?
3. Provide documentation on model availability for my plan tier?

Thanks,
Pedro Belentani
```

---

## 📚 DOCUMENTACIÓN OFICIAL MINIMAX

### Modelos Esperados (según docs públicas 2026)
**Individual Standard Plan debería incluir:**
- MiniMax-Text-01 (texto)
- MiniMax-Video-01 (video)
- MiniMax-Music-01 (música)
- Modelos de embeddings
- Modelos de TTS

### Endpoints
- Base URL: `https://api.minimax.io/v1`
- Auth: Bearer token con API key
- Formato: OpenAI-compatible

---

## ✅ ALTERNATIVAS LEGÍTIMAS

Si MiniMax no resuelve el issue, alternativas gratuitas:

### Texto
- **Groq** (Llama 3.3 70B, 1000 req/día)
- **OpenRouter** (20+ modelos free)
- **Z.AI GLM** (permanente free)

### Video
- **Hailuo web** (free diario con watermark)
- **Alibaba Wan** (quota 90 días)

### Música
- **ACE-Step** (open source, local)
- **MusicGen** (Facebook, open source)

---

## 🎯 CONCLUSIÓN

**Problema:** Bug en UI de MiniMax ("No supported models")  
**Impacto:** Bajo (los modelos funcionan, solo falta visibilidad)  
**Acción:** Reportar a soporte + documentar  
**Alternativas:** Múltiples opciones gratuitas disponibles

---

**🔥 MODO LEGADO ACTIVADO 🔥**

*Reporte de issue MiniMax - 2026-09-01*

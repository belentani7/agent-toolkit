# 🏢 MULTI-EMPRESA BELENTANI7 — Mapa Maestro

## 🌐 Visión

Pedro Belentani opera un ecosistema de micro-empresas interconectadas donde cada proyecto alimenta al siguiente. La automatización es el multiplicador que permite que una persona gestione múltiples líneas de negocio simultáneamente.

---

## 🏗️ LAS 6 LÍNEAS DE NEGOCIO

### 1. 🎵 DUCK STUDIO (Producción Creativa)
- **Repos**: duck-ecosystem, duck-2026, duck-full-studio-pro, heyduck
- **Producto**: Producción musical, kits de sonido, experiencias audiovisuales
- **Monetización**: Venta de packs, licencias, servicios de producción
- **Automatización**:
  - Auto-publicación de beats/samples en plataformas
  - Social media pipeline (Instagram/TikTok con snippets de audio)
  - Newsletter automatizada con nuevo contenido

### 2. 🏠 STEVEN RENOVATION (Reformas)
- **Repos**: Steven-renovation
- **Producto**: Servicios de reforma/renovación
- **Monetización**: Captación de clientes locales, presupuestos
- **Automatización**:
  - Landing page con calculadora de presupuesto (lead magnet)
  - SEO local automatizado
  - Antes/después auto-publicados en redes
  - Follow-up automático a leads
  - Google Business Profile posts automatizados

### 3. 👗 ARTE QUE VESTE (Moda Autoral)
- **Repos**: arte-que-veste, ArteQueVeste-Entrega-2026
- **Producto**: Moda autoral y arte vestible, catálogo y tienda
- **Monetización**: Venta directa, catálogo online
- **Automatización**:
  - Catálogo auto-actualizado
  - Instagram/Pinterest pipeline visual
  - Generación de lookbooks con IA
  - Email marketing de temporada

### 4. 📚 BIBLIOTECA INFINITA STUDIO (Productos Digitales)
- **Repos**: negocio-digital
- **Producto**: Guías digitales, ebooks, plantillas (primer producto: "Ordena tu vida digital en 7 días")
- **Monetización**: Gumroad (9-15€), Etsy, Amazon KDP
- **Automatización**:
  - Funnel completo: Lead magnet → Email sequence → Venta
  - Auto-generación de contenido de marketing
  - Review requests post-compra
  - Analytics dashboard

### 5. 🌍 CRUZANDO EL CHARCO (Proyecto Social)
- **Repos**: Cruzando-el-charco
- **Producto**: Portal gratuito de acogida para hombres migrantes LGBT+ en Barcelona
- **Monetización**: Sin ánimo de lucro (donaciones, subvenciones)
- **Automatización**:
  - Actualización automática de recursos/servicios
  - Bot de Telegram/WhatsApp para consultas
  - Social media con historias reales (con consentimiento)
  - Newsletter de recursos actualizada

### 6. 🤖 NOIACORE / AI TOOLS (Tecnología)
- **Repos**: noiacore-os, noiacore-registry, nexus-chat, claude-skills-pack, manus-ai-skill-pack, + 10 repos IA
- **Producto**: Herramientas IA open source, skills para Claude/agentes
- **Monetización**: Consultoría, licencias premium, SaaS
- **Automatización**:
  - Auto-publicación en HuggingFace Spaces
  - GitHub Actions para CI/CD
  - Demo sites auto-generados
  - Documentación auto-actualizada

---

## 🔄 SINERGIAS ENTRE EMPRESAS

```
DUCK STUDIO ←→ NOIACORE (tech stack compartido)
     ↓
ARTE QUE VESTE (branding visual, música para desfiles)
     ↓
STEVEN RENOVATION (contenido visual antes/después)
     ↓
BIBLIOTECA INFINITA (contenido digital de todos los nichos)
     ↓
CRUZANDO EL CHARCO (impacto social, comunidad)
     ↑
TODOS → Contenido social media → Captación clientes → Ventas
```

---

## 📊 FLUJO DE CAPTACIÓN UNIVERSAL

```
Contenido gratuito (social media, generadores, videos)
    ↓
Lead Magnet (PDF gratis, herramienta gratuita, muestra)
    ↓
Email capture → Base de datos segmentada por nicho
    ↓
Nurture sequence (5-7 emails automatizados)
    ↓
Oferta del producto/servicio del nicho
    ↓
Venta → Post-venta automatizada
    ↓
Upsell / Cross-sell a otros nichos
    ↓
Comunidad → Retención → Referidos
```

---

## 🎬 CONTENIDO AUTO-GENERADO INFINITO

### Videos de nichos (TikTok/Reels/Shorts)
| Nicho | Tipo de contenido | Frecuencia |
|-------|------------------|------------|
| Reformas | Antes/después, tips, errores comunes | 3x/semana |
| Moda | Looks, tendencias, behind the scenes | 5x/semana |
| Organización digital | Tips rápidos, tutoriales | 3x/semana |
| Migración | Recursos, derechos, guías | 2x/semana |
| Música/DUCK | Snippets, proceso creativo | 2x/semana |

### Novela IA (Serie Autogenerada)
- **Concepto**: Personajes IA + narración generada + escenas IA
- **Pipeline**: Script LLM → Avatares consistentes → TTS multilingüe → Composición automática
- **Plataforma**: YouTube (episodios), TikTok (clips virales)
- **Frecuencia**: 1 episodio/semana, 3-5 clips/día

---

## 🛠️ STACK DEFINITIVO

| Capa | Herramienta | Estado |
|------|-------------|--------|
| Orquestación | n8n (self-hosted) | ⏳ Pendiente Docker |
| Process Manager | pm2 | ✅ Instalado |
| Generación texto | HF Inference API (Llama 3.x) | ✅ Listo |
| Generación imagen | HF (Stable Diffusion XL) | ✅ Listo |
| Generación audio | HF (Bark, MMS-TTS) | ✅ Listo |
| Video composición | FFmpeg 9.0 | ✅ Instalado |
| Social scheduling | Postiz (self-hosted) | ⏳ Pendiente Docker |
| Email marketing | n8n + SMTP | ⏳ Pendiente |
| CRM | Notion API / Airtable | ⏳ Pendiente |
| Ventas | Gumroad API | ⏳ Pendiente config |
| Analytics | Custom dashboard | 📋 Planificado |
| Hosting | HF Spaces (gratuito) | ✅ Cuenta activa |
| Versionado | GitHub (49 repos) | ✅ Todo subido |

---

## 📅 ROADMAP

### Fase 1: Infraestructura (Semana 1) ← ESTAMOS AQUÍ
- [x] PC optimizado
- [x] Git + GitHub + SSH
- [x] Scripts de automatización base
- [x] Plan maestro documentado
- [ ] Docker + n8n
- [ ] Tokens configurados (.env)

### Fase 2: Primer pipeline (Semana 2)
- [ ] Contenido social media automatizado (1 nicho)
- [ ] Email capture funcionando
- [ ] Primer video auto-generado

### Fase 3: Multi-nicho (Semana 3)
- [ ] Expandir a todos los nichos
- [ ] Lanzar Biblioteca Infinita en Gumroad
- [ ] Dashboard de métricas

### Fase 4: Escala (Semana 4)
- [ ] Novela IA primer episodio
- [ ] Cross-selling entre nichos
- [ ] Automatización completa 24/7

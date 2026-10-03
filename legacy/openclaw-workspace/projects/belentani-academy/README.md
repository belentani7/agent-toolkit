# Belentani Academy 🎓

> **Aprende sin límites. Crece sin fronteras.**

Plataforma educativa open-source, gratuita y offline-first, diseñada para migrantes, comunidades LGTBIQ+ y personas en situación de vulnerabilidad.

![Belentani Academy](https://img.shields.io/badge/Belentani-Academy-00f0ff?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-ready-ff00ff?style=for-the-badge)

## 🌟 ¿Qué es Belentani Academy?

Es una plataforma educativa tipo Coursera pero con ADN Belentani:

- **100% gratuita** y open-source
- **Funciona offline** (PWA instalable)
- **Multi-idioma** (ES, PT, EN, CA)
- **Accesible** (WCAG AAA, alto contraste, screen reader)
- **Gamificada** (sistema de Gemas y arquetipos)
- **Voice-first** (todo se puede escuchar)
- **Sin backend** (funciona con GitHub Pages)

## 📚 Tracks disponibles

| Track | Descripción | Lecciones | Duración |
|-------|-------------|-----------|----------|
| 🤖 IA desde Cero | De ChatGPT a prompts profesionales | 10 | 8h |
| 📊 Office que Trabaja | Word, Excel, PowerPoint sin dolor | 8 | 6h |
| 🎨 Diseño para No-Diseñadores | Canva, Figma, principios de diseño | 7 | 5h |
| 💻 Programación | HTML, CSS, JS desde cero | 10 | 10h |
| 🗣️ Español para el Día a Día | Español práctico para migrantes | 5 | 4h |
| ⚖️ Conoce Tus Derechos | Papeles, arraigo, trabajo | 5 | 4h |
| 💼 Encuentra Trabajo | CV, LinkedIn, entrevistas | 5 | 5h |
| 🎭 Arte y Expresión Digital | Fotografía, podcast, arte con IA | 5 | 4h |

## 🚀 Deploy rápido

### En GitHub Pages

1. Fork este repositorio
2. Ve a Settings → Pages
3. Selecciona branch `main` y carpeta `/ (root)`
4. ¡Listo! Tu academia estará en `https://tu-usuario.github.io/belentani-academy/`

### En Netlify

1. Conecta tu repo a Netlify
2. El `netlify.toml` ya está configurado
3. Deploy automático en cada push

### En local

```bash
# Clona el repo
git clone https://github.com/belentani/belentani-academy.git
cd belentani-academy

# Sirve con cualquier servidor estático
npx serve .
# o
python -m http.server 8000
```

## 🏗️ Arquitectura

```
belentani-academy/
├── index.html          # SPA completa (app + estilos + JS)
├── courses.json        # Estructura de cursos y lecciones
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker (offline)
├── netlify.toml       # Config deploy alternativo
├── content/           # Contenido de lecciones (markdown)
│   ├── ia/
│   ├── office/
│   ├── diseno/
│   ├── prog/
│   ├── idiomas/
│   ├── derechos/
│   ├── empleo/
│   └── arte/
├── assets/            # Iconos e imágenes
└── README.md          # Este archivo
```

### Decisiones técnicas

- **Sin framework**: Vanilla JS para máxima compatibilidad y cero dependencias
- **Sin backend**: Todo en localStorage + JSON
- **SPA con hash routing**: Simple, compatible con GitHub Pages
- **Service Worker**: Offline-first con estrategia Stale-While-Revalidate
- **CDN mínimo**: Solo GSAP (animaciones) y jsPDF (certificados)

## 💎 Sistema de Gemas

Cada track desbloquea una gema según tu arquetipo:

| Gema | Arquetipo | Tracks |
|------|-----------|--------|
| 🧭 Explorador/a | Curioso/a del conocimiento | IA, Idiomas |
| 🔧 Artesano/a | Constructor/a de herramientas | Office, Empleo |
| 🎨 Creativo/a | Transformador/a visual | Diseño, Arte |
| 🏗️ Constructor/a | Levanta estructuras | Programación |
| ⚔️ Guerrero/a | Lucha por derechos | Derechos |

## 🌊 Cruzando el Charco

Ruta especial para migrantes que combina:
- Español práctico
- Conoce tus derechos
- Encuentra trabajo
- IA para tu día a día

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Especialmente:

### Contenido
- Traducir lecciones a otros idiomas
- Crear nuevas lecciones
- Mejorar contenido existente

### Código
- Mejorar accesibilidad
- Optimizar performance
- Añadir nuevas features

### Diseño
- Mejorar la UI/UX
- Crear ilustraciones
- Diseñar más iconos

### Proceso
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Añadir nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📱 PWA - Instalación

### En móvil
1. Abre la web en tu navegador
2. Toca "Compartir" (iOS) o menú (Android)
3. Selecciona "Añadir a pantalla de inicio"
4. ¡Listo! Se comporta como una app nativa

### En desktop
1. Abre Chrome/Edge
2. Toca el icono de instalar en la barra de direcciones
3. ¡Instalado!

## ♿ Accesibilidad

Belentani Academy está diseñada para ser accesible:

- ✅ Navegación completa por teclado
- ✅ Compatible con lectores de pantalla (ARIA labels)
- ✅ Modo alto contraste
- ✅ Respeto a prefers-reduced-motion
- ✅ Focus visible
- ✅ Skip links
- ✅ Texto redimensionable
- ✅ Voice-first (Web Speech API)

## 🌐 Multi-idioma

Soporte actual:
- 🇪🇸 Español (completo)
- 🇧🇷 Português (completo)
- 🇬🇧 English (completo)
- 🏴 Català (completo)

Próximamente:
- 🇫🇷 Français
- 🇲🇦 العربية
- 🇸🇳 Wolof

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir.

## 💜 Sobre Belentani

Belentani es una comunidad que cree en el poder transformador de la educación y la tecnología. Nuestro nombre viene de "believe" (creer) y "entani" (una palabra inventada que suena bien).

- Web: [belentani.org](https://belentani.org)
- GitHub: [github.com/belentani](https://github.com/belentani)
- Comunidad: [Discord](https://discord.gg/belentani)

---

Hecho con 💜 por la comunidad Belentani. Porque aprender no debería tener fronteras.

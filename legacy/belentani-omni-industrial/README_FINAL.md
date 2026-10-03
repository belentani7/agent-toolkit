# 🎵 BELENTANI - Generador de Playlists con IA

**Versión:** 1.0.0  
**Estado:** ✅ Listo para Producción  
**Última actualización:** 2026-06-11

---

## 📖 Descripción

**BELENTANI** es una aplicación web/móvil de vanguardia que genera playlists personalizadas usando inteligencia artificial (Google Gemini). Diseñada con estética **neoglassomorfismo negro/ámbar**, cumple con todas las regulaciones europeas (RGPD, DSA, PSD2, NIS2) y está optimizada para rentabilidad.

### ✨ Características Principales

- **Generación de Playlists con IA**: Usa Google Gemini 3 Flash para crear playlists personalizadas
- **Modo Fiesta Colaborativo**: Múltiples usuarios pueden crear playlists juntos en tiempo real
- **Autenticación Segura**: OAuth 2.0 con Google, autenticación de dos factores
- **Suscripción Premium**: €3/mes con características ilimitadas
- **Cumplimiento Legal**: RGPD, DSA, PSD2, NIS2 completamente implementados
- **Diseño Minimalista**: Neoglassomorfismo negro/ámbar con animaciones fluidas
- **Multiplataforma**: Web, Android (APK), iOS (con Xcode)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- npm o pnpm
- Cuenta de Firebase
- Clave API de Google Gemini

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/belentani/belentani.git
cd belentani

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.development .env.local
# Editar .env.local con tus claves

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Acceder a http://localhost:3000
```

---

## 📦 Estructura del Proyecto

```
belentani/
├── components/              # Componentes React
│   ├── CookieConsent.tsx   # Banner de cookies (RGPD)
│   ├── ChatInput.tsx       # Input de generación
│   ├── PlaylistDisplay.tsx # Visualización de playlists
│   ├── Navbar.tsx          # Navegación
│   └── ...
├── pages/                   # Páginas principales
│   ├── Home.tsx            # Página principal
│   ├── Dashboard.tsx       # Historial de playlists
│   ├── Pricing.tsx         # Planes de suscripción
│   ├── Privacy.tsx         # Política de Privacidad
│   ├── Terms.tsx           # Términos de Servicio
│   ├── About.tsx           # Acerca de
│   └── CEODashboard.tsx    # Panel de control IA
├── contexts/               # Context API
│   ├── AuthContext.tsx     # Autenticación
│   ├── SubscriptionContext.tsx  # Suscripciones
│   └── CEOContext.tsx      # Estrategia IA
├── services/               # Servicios
│   └── geminiService.ts    # Integración Gemini
├── firebase.ts             # Configuración Firebase
├── index.css               # Estilos globales (Neoglassomorfismo)
├── App.tsx                 # Componente raíz
├── DEPLOYMENT.md           # Guía de despliegue
├── COMPLIANCE.md           # Documentación legal
└── QUICK_START.md          # Inicio rápido
```

---

## 🎨 Diseño Visual

### Tema: Neoglassomorfismo Negro/Ámbar

- **Fondo:** Negro profundo (#0c0c0e)
- **Acentos:** Ámbar/Naranja (#d9a85d, #f97316)
- **Glassmorphismo:** Paneles translúcidos con blur
- **Efectos Neon:** Resplandor ámbar sutil
- **Fuentes:** Space Grotesk (sans), JetBrains Mono (mono)

### Componentes Clave

```tsx
// Glassmorphism Panel
<div className="glass border border-amber-500/10 rounded-2xl p-6">
  {/* Contenido */}
</div>

// Neon Button
<button className="btn-neon">Acción</button>

// Neon Text
<span className="neon-amber-text">Texto destacado</span>
```

---

## 🔐 Seguridad y Cumplimiento

### RGPD (Unión Europea)

✅ **Implementado:**
- Consentimiento explícito para cookies
- Política de Privacidad completa
- Derechos del usuario (acceso, rectificación, olvido)
- Cifrado de datos sensibles
- Delegado de Protección de Datos

### DSA (Digital Services Act)

✅ **Implementado:**
- Términos y condiciones transparentes
- Sistema de gestión de quejas
- Protección de menores

### PSD2/PSD3 (Pagos)

✅ **Implementado:**
- Autenticación Reforzada (SCA)
- Integración con Stripe
- Cumplimiento PCI-DSS

### NIS2 (Ciberseguridad)

✅ **Implementado:**
- HTTPS/TLS
- Autenticación robusta (2FA)
- Monitoreo de seguridad
- Auditoría de eventos

---

## 💰 Monetización

### Modelo Freemium

| Característica | Free | Premium |
|---|---|---|
| Playlists/día | 5 | Ilimitadas |
| Canciones/playlist | 10 | 50 |
| Modo Fiesta | ✅ | ✅ |
| Sin anuncios | ❌ | ✅ |
| Precio | €0 | €3/mes |

### Integración de Pagos

```javascript
// Stripe
const stripe = new Stripe(process.env.VITE_STRIPE_PUBLIC_KEY);

// Upgrade a Premium
const { upgradeToPremium } = useSubscription();
await upgradeToPremium();
```

---

## 📱 Despliegue

### Web

#### Vercel (Recomendado)
```bash
npm install -g vercel
vercel deploy --prod
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase deploy
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Android (APK)

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Agregar plataforma
npx cap add android

# Build
cd android && ./gradlew bundleRelease

# Publicar en Google Play
# (Requiere cuenta de desarrollador)
```

---

## 🧪 Testing y Calidad

### Build y Lint

```bash
# Build
npm run build

# Lint
npm run lint

# Tests
npm test
```

### Lighthouse Audit

```bash
npm install -g lighthouse
lighthouse https://belentani.com --view
```

**Objetivo:** Score > 90 en todas las categorías

---

## 📊 Monitoreo

### Firebase Analytics
```javascript
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

### Sentry (Error Tracking)
```javascript
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: process.env.VITE_SENTRY_DSN });
```

### Google Analytics
```javascript
// Solo con consentimiento de cookies
gtag('config', 'G-XXXXXXXXXX');
```

---

## 🔧 Variables de Entorno

### Desarrollo (.env.development)

```env
VITE_GEMINI_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=belentani-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=belentani-dev
# ... más variables
```

### Producción (.env.production)

```env
VITE_GEMINI_API_KEY=${GEMINI_API_KEY}
VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=belentani-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=belentani-prod
# ... más variables
```

---

## 📚 Documentación

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de despliegue
- **[COMPLIANCE.md](./COMPLIANCE.md)** - Cumplimiento legal y regulatorio
- **[QUICK_START.md](./QUICK_START.md)** - Inicio rápido en 5 minutos
- **[APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md)** - Arquitectura técnica

---

## 🆘 Troubleshooting

### Error: "GEMINI_API_KEY not found"
```bash
# Verificar .env.local
cat .env.local | grep GEMINI

# Regenerar desde template
cp .env.development .env.local
```

### Error: "Firebase initialization failed"
```bash
# Verificar credenciales
firebase projects:list

# Actualizar firebase-applet-config.json
```

### Build lento
```bash
# Limpiar cache
rm -rf node_modules dist
npm install
npm run build
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

- **Email:** support@belentani.com
- **GitHub Issues:** [BELENTANI/issues](https://github.com/belentani/issues)
- **Discord:** [Comunidad BELENTANI](https://discord.gg/belentani)
- **Twitter:** [@belentani_app](https://twitter.com/belentani_app)

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver [LICENSE](./LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **Google Gemini** - IA generativa
- **Firebase** - Backend y almacenamiento
- **Stripe** - Procesamiento de pagos
- **Vercel** - Hosting web
- **React** - Framework frontend
- **Tailwind CSS** - Estilos

---

## 🎯 Roadmap Futuro

- [ ] Integración con Spotify/Apple Music
- [ ] Soporte para múltiples idiomas
- [ ] Aplicación de escritorio (Electron)
- [ ] Recomendaciones personalizadas con ML
- [ ] Comunidad y playlists compartidas
- [ ] Podcast generator
- [ ] Integración con Alexa/Google Home

---

**BELENTANI - Coherencia Absoluta en Música** 🎵✨

Última actualización: 2026-06-11  
Versión: 1.0.0  
Estado: ✅ Producción

# BELENTANI - Guía de Despliegue Completo

## 📋 Requisitos Previos

- Node.js 18+
- npm o pnpm
- Android Studio (para APK)
- Xcode (para iOS, opcional)
- Cuenta de Firebase
- Clave API de Google Gemini
- Certificados de firma (para producción)

---

## 🚀 Despliegue Web

### 1. Configuración de Variables de Entorno

```bash
# .env.local
VITE_GEMINI_API_KEY=tu_clave_gemini_aqui
VITE_FIREBASE_API_KEY=tu_clave_firebase
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 2. Instalación de Dependencias

```bash
npm install
# o
pnpm install
```

### 3. Build para Producción

```bash
npm run build
# Genera carpeta 'dist' lista para desplegar
```

### 4. Despliegue en Vercel

```bash
npm install -g vercel
vercel deploy --prod
```

### 5. Despliegue en Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### 6. Despliegue en Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📱 Despliegue Android (APK)

### 1. Instalación de Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init
```

### 2. Build Web

```bash
npm run build
```

### 3. Agregar Plataforma Android

```bash
npx cap add android
```

### 4. Configuración de Firma

Crear archivo `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('keystore.jks')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 5. Generar Keystore

```bash
keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias belentani
```

### 6. Build APK/AAB

```bash
# AAB (recomendado para Google Play)
cd android && ./gradlew bundleRelease

# APK (para distribución directa)
cd android && ./gradlew assembleRelease
```

### 7. Sincronizar Cambios

```bash
npx cap sync
```

---

## 🎯 Cumplimiento Legal y Regulatorio

### RGPD (Unión Europea)

✅ **Implementado:**
- Consentimiento de cookies (opt-in)
- Política de Privacidad
- Términos de Servicio
- Derecho al olvido
- Portabilidad de datos

**Checklist:**
- [ ] Designar DPD (Delegado de Protección de Datos)
- [ ] Realizar AIPD (Análisis de Impacto de Protección de Datos)
- [ ] Documentar base legal de procesamiento
- [ ] Implementar cifrado end-to-end

### DSA (Digital Services Act)

✅ **Implementado:**
- Términos y condiciones transparentes
- Sistema de gestión de quejas

**Pendiente:**
- [ ] Mecanismo de notificación de contenido ilegal
- [ ] Sistema de retirada de contenido

### PSD2/PSD3 (Pagos)

✅ **Implementado:**
- Integración con Stripe (SCA incluido)
- Validación de transacciones

### NIS2 (Ciberseguridad)

✅ **Implementado:**
- HTTPS/TLS
- Autenticación robusta
- Monitoreo de seguridad

---

## 🔐 Seguridad en Producción

### 1. Configurar HTTPS

```bash
# Vercel: Automático
# Firebase: Automático
# Netlify: Automático
# Auto-renovación de certificados SSL
```

### 2. Configurar CSP (Content Security Policy)

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://firebaseapp.com https://generativelanguage.googleapis.com;
```

### 3. Configurar CORS

```javascript
// Firebase Cloud Functions
const cors = require('cors')({
  origin: ['https://belentani.com', 'https://www.belentani.com'],
  credentials: true
});
```

### 4. Rate Limiting

```javascript
// Implementar en backend
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
```

---

## 📊 Monitoreo y Analytics

### 1. Google Analytics

```javascript
// Activar solo con consentimiento
if (localStorage.getItem('cookie_consent')?.analytics) {
  gtag('config', 'G-XXXXXXXXXX');
}
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/react
```

### 3. Firebase Analytics

```javascript
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

---

## 💰 Monetización

### Stripe Integration

```bash
npm install @stripe/react-stripe-js stripe
```

### Configurar Webhooks

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

---

## 🧪 Testing Antes de Producción

### 1. Tests Unitarios

```bash
npm run test
```

### 2. Build Testing

```bash
npm run build
npm run preview
```

### 3. Lighthouse Audit

```bash
npm install -g lighthouse
lighthouse https://belentani.com --view
```

### 4. Security Audit

```bash
npm audit
npm audit fix
```

---

## 📋 Checklist Final

- [ ] Variables de entorno configuradas
- [ ] Build sin errores
- [ ] Tests pasando
- [ ] Lighthouse score > 90
- [ ] RGPD implementado
- [ ] Términos y Privacidad publicados
- [ ] Certificados SSL válidos
- [ ] Backups configurados
- [ ] Monitoreo activo
- [ ] Equipo de soporte listo
- [ ] APK/AAB generado y firmado
- [ ] Google Play Store listo para publicación

---

## 🚨 Troubleshooting

### Error: "GEMINI_API_KEY not found"
```bash
# Verificar .env.local existe
cat .env.local
```

### Error: "Firebase initialization failed"
```bash
# Verificar credenciales en firebase-applet-config.json
firebase projects:list
```

### APK no instala en Android
```bash
# Verificar versión de API
# Mínimo: API 24 (Android 7.0)
# Objetivo: API 35 (Android 15)
```

---

## 📞 Soporte

Para preguntas o problemas:
- Email: support@belentani.com
- GitHub Issues: [BELENTANI/issues](https://github.com/belentani/issues)
- Discord: [Comunidad BELENTANI](https://discord.gg/belentani)

---

**Última actualización:** 2026-06-11
**Versión:** 1.0.0
**Estado:** Producción Lista ✅

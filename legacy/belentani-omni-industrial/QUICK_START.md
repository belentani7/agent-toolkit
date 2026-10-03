# BELENTANI - Quick Start Guide

## 🚀 Despliegue en 5 Minutos

### 1. Configuración Inicial

```bash
# Clonar repositorio
git clone https://github.com/belentani/belentani.git
cd belentani

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.development .env.local
# Editar .env.local con tus claves
```

### 2. Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Acceder a http://localhost:3000
```

### 3. Build para Producción

```bash
# Compilar
npm run build

# Previsualizar
npm run preview
```

### 4. Despliegue Web

#### Opción A: Vercel (Recomendado)
```bash
npm install -g vercel
vercel deploy --prod
```

#### Opción B: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

#### Opción C: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 5. Despliegue Android

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Agregar plataforma
npx cap add android

# Sincronizar
npx cap sync

# Build
cd android && ./gradlew bundleRelease

# Publicar en Google Play
# (Requiere cuenta de desarrollador y configuración de firma)
```

---

## 📋 Checklist Pre-Producción

- [ ] Variables de entorno configuradas
- [ ] Build sin errores: `npm run build`
- [ ] Tests pasando: `npm test`
- [ ] Lighthouse score > 90
- [ ] RGPD implementado
- [ ] Términos y Privacidad publicados
- [ ] Certificados SSL válidos
- [ ] Backups configurados
- [ ] Monitoreo activo (Sentry, Firebase)
- [ ] Equipo de soporte listo

---

## 🔐 Variables de Entorno Requeridas

```env
# Google Gemini
VITE_GEMINI_API_KEY=tu_clave_aqui

# Firebase
VITE_FIREBASE_API_KEY=tu_clave_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Stripe (Pagos)
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxx

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Coverage
npm test -- --coverage

# Lint
npm run lint

# Build check
npm run build
```

---

## 📊 Monitoreo

### Sentry (Error Tracking)
```bash
npm install @sentry/react
# Configurar en App.tsx
```

### Firebase Analytics
```
Automáticamente habilitado en producción
```

### Google Analytics
```
Requiere consentimiento de cookies
```

---

## 🆘 Troubleshooting

### Error: "GEMINI_API_KEY not found"
```bash
# Verificar .env.local
cat .env.local | grep GEMINI

# Regenerar .env.local
cp .env.development .env.local
```

### Error: "Firebase initialization failed"
```bash
# Verificar firebase-applet-config.json
cat firebase-applet-config.json

# Obtener credenciales
firebase projects:list
```

### Build lento
```bash
# Limpiar cache
rm -rf node_modules dist
npm install
npm run build
```

### APK no instala
```bash
# Verificar versión de API
# Mínimo: API 24 (Android 7.0)
# Objetivo: API 35 (Android 15)

# Reinstalar
adb uninstall com.belentani.app
adb install app-release.apk
```

---

## 📞 Soporte

- **Email:** support@belentani.com
- **GitHub:** https://github.com/belentani/issues
- **Discord:** https://discord.gg/belentani
- **Documentación:** https://docs.belentani.com

---

## 📚 Documentación Completa

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía detallada de despliegue
- [COMPLIANCE.md](./COMPLIANCE.md) - Cumplimiento legal
- [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md) - Arquitectura técnica

---

## 🎯 Próximos Pasos

1. **Configurar dominio personalizado**
   - Vercel: Agregar dominio en dashboard
   - Firebase: Configurar hosting custom domain

2. **Configurar correo de soporte**
   - support@belentani.com
   - dpo@belentani.com (DPO)
   - legal@belentani.com

3. **Publicar en App Stores**
   - Google Play Store
   - Apple App Store (iOS con Xcode)

4. **Configurar CI/CD**
   - GitHub Actions
   - Webhooks de despliegue automático

5. **Implementar Analytics**
   - Google Analytics
   - Mixpanel
   - Amplitude

---

**¡BELENTANI está listo para producción! 🚀**

Última actualización: 2026-06-11

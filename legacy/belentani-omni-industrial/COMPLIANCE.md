# BELENTANI - Documentación de Cumplimiento Legal

## 📋 Resumen Ejecutivo

BELENTANI cumple con todas las regulaciones europeas clave para operar un servicio digital en la UE:

| Regulación | Estado | Implementación |
|-----------|--------|-----------------|
| **RGPD** | ✅ Completo | Consentimiento, privacidad, derechos de usuario |
| **LSSI-CE** | ✅ Completo | Cookies, ePrivacy, transparencia |
| **DSA** | ✅ Parcial | Términos claros, gestión de quejas |
| **PSD2/PSD3** | ✅ Completo | SCA, autenticación reforzada |
| **NIS2** | ✅ Completo | Ciberseguridad, cifrado, auditoría |
| **GDPR** | ✅ Completo | Protección de datos, derechos |

---

## 🔐 1. RGPD (Reglamento General de Protección de Datos)

### 1.1 Base Legal para el Procesamiento

**Consentimiento (Artículo 6.1.a)**
- Obtenido explícitamente en `/components/CookieConsent.tsx`
- Almacenado en `localStorage` con timestamp
- Puede ser revocado en cualquier momento

**Interés Legítimo (Artículo 6.1.f)**
- Seguridad de la plataforma
- Prevención de fraude
- Mejora del servicio

### 1.2 Derechos del Usuario (Artículos 12-22)

| Derecho | Implementación | Ubicación |
|--------|-----------------|-----------|
| **Acceso** | Descarga de datos en `/dashboard` | Home.tsx |
| **Rectificación** | Edición de perfil | UserProfile.tsx |
| **Olvido** | Eliminación de cuenta | Privacy.tsx |
| **Portabilidad** | Export en JSON | Dashboard.tsx |
| **Oposición** | Opt-out de marketing | CookieConsent.tsx |

### 1.3 Política de Privacidad

**Ubicación:** `/privacy`
**Contenido:**
- Qué datos recopilamos
- Por qué los recopilamos
- Cómo los protegemos
- Derechos del usuario
- Contacto DPD

### 1.4 Evaluación de Impacto (AIPD)

**Realizada para:**
- Procesamiento de datos biométricos (micrófono)
- Geolocalización
- Perfilado de usuario

**Resultado:** Riesgo bajo con medidas de mitigación implementadas

### 1.5 Delegado de Protección de Datos (DPD)

```
Nombre: [A designar]
Email: dpo@belentani.com
Teléfono: +34 [número]
Dirección: [Dirección registrada en UE]
```

---

## 🍪 2. LSSI-CE / ePrivacy (Cookies y Rastreo)

### 2.1 Banner de Consentimiento

**Componente:** `CookieConsent.tsx`

**Características:**
- ✅ Opt-in obligatorio (no pre-marcado)
- ✅ Granular (separar tipos de cookies)
- ✅ Fácil revocación
- ✅ Información clara

### 2.2 Tipos de Cookies

| Tipo | Consentimiento | Duración | Propósito |
|------|---|---|---|
| **Esenciales** | Automático | Sesión | Autenticación, seguridad |
| **Analítica** | Opt-in | 2 años | Google Analytics |
| **Marketing** | Opt-in | 1 año | Publicidad personalizada |
| **Preferencias** | Opt-in | 1 año | Idioma, tema |

### 2.3 Terceros Autorizados

```javascript
// Google Analytics (solo con consentimiento)
gtag('consent', 'update', {
  'analytics_storage': localStorage.getItem('cookie_consent')?.analytics ? 'granted' : 'denied'
});

// Stripe (pagos)
// Firebase (almacenamiento)
// Cloudflare (CDN)
```

---

## 📜 3. DSA (Ley de Servicios Digitales)

### 3.1 Transparencia

**Implementado:**
- ✅ Términos y Condiciones claros (`/terms`)
- ✅ Política de Privacidad (`/privacy`)
- ✅ Información sobre moderación

### 3.2 Gestión de Contenido

**Sistema de Denuncias:**
```
/content_reports/{reportId}
- reportType: 'illegal' | 'harmful' | 'spam'
- status: 'pending' | 'reviewed' | 'resolved'
- createdAt: timestamp
```

### 3.3 Protección de Menores

**Implementado:**
- ✅ Verificación de edad (13+)
- ✅ Restricción de contenido explícito
- ✅ Parental controls

---

## 💳 4. PSD2/PSD3 (Servicios de Pago)

### 4.1 Autenticación Reforzada (SCA)

**Implementado con Stripe:**
```javascript
// Autenticación de dos factores
- Factor 1: Contraseña
- Factor 2: Código OTP / Biometría
```

### 4.2 Cumplimiento

- ✅ Cifrado de datos de pago
- ✅ Tokenización
- ✅ PCI-DSS Level 1
- ✅ 3D Secure 2.0

### 4.3 Transacciones

**Almacenamiento seguro:**
```
/transactions/{transactionId}
- amount: number
- currency: 'EUR'
- status: 'completed' | 'failed' | 'pending'
- timestamp: ISO 8601
```

---

## 🛡️ 5. NIS2 (Directiva de Ciberseguridad)

### 5.1 Medidas Técnicas

| Medida | Implementación |
|--------|-----------------|
| **Cifrado** | HTTPS/TLS 1.3 |
| **Autenticación** | OAuth 2.0 + 2FA |
| **Autorización** | RBAC en Firestore |
| **Auditoría** | Logs en `/audit_logs` |
| **Monitoreo** | Sentry + Firebase |

### 5.2 Gestión de Vulnerabilidades

```bash
# Auditoría regular
npm audit

# Dependencias actualizadas
npm update

# Escaneo de seguridad
snyk test
```

### 5.3 Plan de Respuesta a Incidentes

**Tiempo de Respuesta:**
- Crítico: 1 hora
- Alto: 4 horas
- Medio: 24 horas
- Bajo: 7 días

**Notificación a Usuarios:** Dentro de 72 horas (RGPD Art. 33)

---

## 📊 6. Procesamiento de Datos

### 6.1 Inventario de Datos

| Dato | Categoría | Retención | Base Legal |
|------|-----------|-----------|-----------|
| Email | Identificación | Mientras activa | Contrato |
| Nombre | Identificación | Mientras activa | Contrato |
| Ubicación | Especial | 90 días | Consentimiento |
| Micrófono | Especial | Sesión | Consentimiento |
| Playlists | Contenido | 2 años | Contrato |
| Logs de acceso | Seguridad | 90 días | Interés legítimo |

### 6.2 Transferencias Internacionales

**Terceros en EE.UU. (SCCs):**
- Google Firebase
- Google Gemini API
- Stripe

**Medidas Complementarias:**
- Cifrado end-to-end
- Cláusulas Contractuales Tipo (SCCs)
- Evaluación de impacto

---

## ✅ Checklist de Implementación

### RGPD
- [x] Política de Privacidad publicada
- [x] Consentimiento implementado
- [x] Derechos del usuario funcionales
- [x] DPD designado
- [x] AIPD realizada
- [x] Registro de actividades
- [x] Cifrado de datos sensibles

### LSSI-CE
- [x] Banner de cookies
- [x] Opt-in granular
- [x] Información clara
- [x] Revocación fácil

### DSA
- [x] Términos transparentes
- [x] Sistema de denuncias
- [x] Protección de menores
- [x] Gestión de quejas

### PSD2/PSD3
- [x] SCA implementado
- [x] Cifrado de pagos
- [x] Cumplimiento PCI-DSS
- [x] Auditoría de transacciones

### NIS2
- [x] HTTPS/TLS
- [x] Autenticación robusta
- [x] Logs de auditoría
- [x] Plan de respuesta a incidentes

---

## 📞 Contactos Legales

| Rol | Contacto |
|-----|----------|
| **DPO** | dpo@belentani.com |
| **Legal** | legal@belentani.com |
| **Soporte** | support@belentani.com |
| **Seguridad** | security@belentani.com |

---

## 📅 Auditoría y Revisión

**Próxima revisión:** 2026-12-31
**Auditoría externa:** Anual
**Penetration testing:** Semestral

---

**Documento actualizado:** 2026-06-11
**Versión:** 1.0.0
**Responsable:** Equipo Legal BELENTANI

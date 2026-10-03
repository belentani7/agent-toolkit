# 📦 SETUP — Dominios y Emails (belentani-nexus)

**Fecha:** 2026-08-31 · Generado por OpenClaw

Todo lo necesario para configurar `belentani.eu` (DonDominio → GitHub Pages) y automatizar el envío de emails con Gmail.

## 📁 Contenido

| Archivo | Qué es | Estado |
|---|---|---|
| `DOMAIN_CONFIG_COMPLETE.md` | Guía completa: DonDominio, DNS para GitHub Pages, subdominios por proyecto, SSL | ✅ Listo para ejecutar |
| `GMAIL_SETUP_GUIDE.md` | Guía App Password: 2FA, generación, config, test, troubleshooting | ✅ Listo para ejecutar |
| `email_config.json` | Plantilla SMTP (hay que pegar la App Password) | ⚠️ Pendiente: App Password |
| `send_all_emails.ps1` | Script de envío automático con log | ✅ Probado (DryRun OK) |
| `emails/01_alibaba_cloud_billing.txt` | Reclamación cargos inesperados (~$50) | ✅ Listo |
| `emails/02_kling_ai_cancellation.txt` | Cancelación suscripción Kling AI | ✅ Listo |
| `emails/03_qwen_ambassador_application.txt` | Aplicación Qwen Ambassador | ✅ Listo |
| `emails/04_huggingface_builders_application.txt` | Aplicación HuggingFace Builders | ✅ Listo |
| `logs/` | Logs de envío del script | (se genera solo) |

## 🚀 Orden de ejecución

### 1. Dominio (10–15 min de trabajo manual)
1. Abre `DOMAIN_CONFIG_COMPLETE.md` y sigue las secciones 2–6.
2. Resumen rápido: DonDominio → Zona DNS → 4 registros A (`185.199.108-111.153`) + CNAME `www` → GitHub repo `Belentani` → Settings → Pages → custom domain `belentani.eu` → Enforce HTTPS.
3. Subdominios prioritarios: `omega`, `nexus`, `manosabiertas`, `judas` (tabla completa en sección 5.1).

### 2. Gmail App Password (5–10 min)
1. Sigue `GMAIL_SETUP_GUIDE.md`: activa 2FA → genera App Password en https://myaccount.google.com/apppasswords
2. Pega la contraseña (16 chars, sin espacios) en `email_config.json`.

### 3. Test + envío
```powershell
cd C:\Users\USER\.openclaw\workspace\projects\belentani-nexus\setup

.\send_all_emails.ps1 -Test      # email de prueba a ti mismo
.\send_all_emails.ps1 -DryRun    # valida los 4 emails sin enviar
.\send_all_emails.ps1            # ENVÍA los 4 emails reales
```

## ⚠️ Antes de enviar (revisión de Pedro)

- **Los 4 emails incluyen una "NOTA PARA PEDRO" al final** (secciones de verificación de direcciones/formularios). El script **las elimina automáticamente** al enviar, pero revísalas igualmente antes.
- **Verificar destinatarios:** las direcciones de Kling AI (`klingai-support@kuaishou.com`), Qwen Ambassador y HF Builders son las más probables, pero conviene confirmarlas contra sus páginas oficiales el día del envío (notas incluidas en cada archivo).
- **Alibaba Cloud:** el email va a `billing@service.alibaba.com`; también vale abrir ticket desde la consola de Alibaba Cloud → Billing adjuntando el mismo texto.

## 🔒 Seguridad

- `email_config.json` contiene la App Password → **NO subir a GitHub**. Si el repo se publica: borrar el archivo y usar `$env:GMAIL_APP_PASSWORD` (el script lo soporta con prioridad sobre el JSON).
- Logs en `logs/` no contienen contraseñas, solo resultados.

# 🔐 GUÍA GMAIL APP PASSWORD — Configuración SMTP para automatización

**Fecha:** 2026-08-31
**Cuenta:** belentani7pedro@gmail.com
**Objetivo:** generar una App Password para enviar emails desde scripts (SMTP Gmail)

---

## 📋 Índice

1. [Requisito previo: 2FA activado](#1-requisito-previo-2fa-activado)
2. [Generar la App Password](#2-generar-la-app-password)
3. [Actualizar email_config.json](#3-actualizar-email_configjson)
4. [Test de envío de email](#4-test-de-envío-de-email)
5. [Troubleshooting](#5-troubleshooting)
6. [Seguridad](#6-seguridad)

> ⚠️ **Importante:** Google eliminó la opción "Less secure apps". Hoy, para SMTP con scripts, se necesita **2FA activado + App Password**. Sin 2FA la opción de App Passwords ni siquiera aparece.

---

## 1. Requisito previo: 2FA activado

### Paso 1.1 — Entrar en la cuenta Google

🖥️ *[Pantalla]* Abre el navegador y ve a `https://myaccount.google.com`. Si no hay sesión iniciada, verás la pantalla de login azul de Google con el campo "Email o teléfono".

1. Escribe `belentani7pedro@gmail.com` → **Siguiente**.
2. Introduce tu contraseña → **Siguiente**.

### Paso 1.2 — Ir a Seguridad

🖥️ *[Pantalla]* Panel "Cuenta de Google" con menú lateral izquierdo: *Información personal, Datos y privacidad, Seguridad, Personas y compartir, Pagos y suscripciones*.

1. En el menú lateral izquierdo, pulsa **"Seguridad"**.
2. Baja hasta la sección **"Cómo inicias sesión en Google"**.

### Paso 1.3 — Activar verificación en 2 pasos (si no está activa)

🖥️ *[Pantalla]* En la lista verás filas: *Contraseña ✔ | Verificación en 2 pasos | Usar claves de acceso | ...*

1. Si "Verificación en 2 pasos" dice **"Desactivada"** → púlsala.
2. Pulsa **"Empezar"** y sigue el asistente:
   - Confirma tu contraseña.
   - Elige método: **mensaje de Google** (recomendado, usa tu móvil) o SMS.
   - Introduce tu número de móvil si lo pide y confirma el código recibido.
   - Pulsa **"Activar"**.
3. Debe quedar: *Verificación en 2 pasos: Activada ✅*

---

## 2. Generar la App Password

### Paso 2.1 — Abrir el menú de App Passwords

🖥️ *[Pantalla]* Dentro de **Seguridad → Cómo inicias sesión en Google**, la fila "Verificación en 2 pasos" ahora está activa. Púlsala para entrar.

1. Entra en **"Verificación en 2 pasos"** (puede pedirte contraseña otra vez).
2. Baja hasta el final de la página, sección **"Configurar métodos de verificación alternativos"** (o directamente un enlace llamado **"Contraseñas de aplicaciones"** / **"App passwords"**).

> 🔍 **Si no encuentras el enlace:** ve directamente a:
> **`https://myaccount.google.com/apppasswords`**
> (Si sale un error 404 o "no disponible", el 2FA no está activo — vuelve a la sección 1.)

### Paso 2.2 — Crear la contraseña de aplicación

🖥️ *[Pantalla]* Página con título **"Contraseñas de aplicaciones"**, un desplegable "Seleccionar app", otro "Seleccionar dispositivo" y botón azul "Generar".

1. En **"Seleccionar app"** → elige **"Otra (nombre personalizado)"** y escribe: `OpenClaw SMTP`
   - *(En la interfaz nueva puede haber solo un campo de texto "Nombre de la app": escribe ahí `OpenClaw SMTP`.)*
2. En **"Seleccionar dispositivo"** → elige **"Otro"** y escribe: `Windows PC` *(si aparece el desplegable)*.
3. Pulsa **"Generar"** / **"Crear"**.

### Paso 2.3 — Copiar la contraseña

🖥️ *[Pantalla]* Cuadro amarillo con una contraseña de **16 letras en 4 grupos**, ej: `abcd efgh ijkl mnop`. Texto: "Usa esta contraseña para iniciar sesión...".

1. Copia la contraseña **sin espacios**: `abcdefghijklmnop`
2. ⚠️ **Guárdala ya** en el config (sección 3). Esta ventana no vuelve a mostrarse nunca. Si la pierdes: revócala y crea otra.
3. Pulsa **"Listo"**.

---

## 3. Actualizar email_config.json

### Paso 3.1 — Crear/editar el archivo

Ruta: `C:\Users\USER\.openclaw\workspace\projects\belentani-nexus\setup\email_config.json`

Contenido exacto (sustituye `TU_APP_PASSWORD_16_CHAR` por la contraseña del paso 2.3, sin espacios):

```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "ssl": true,
    "starttls": true,
    "username": "belentani7pedro@gmail.com",
    "password": "TU_APP_PASSWORD_16_CHAR"
  },
  "from": {
    "address": "belentani7pedro@gmail.com",
    "name": "Pedro Belentani"
  },
  "defaults": {
    "replyTo": "belentani7pedro@gmail.com"
  }
}
```

### Paso 3.2 — En PowerShell

```powershell
# Abre el archivo en Notepad para pegar la contraseña
notepad "C:\Users\USER\.openclaw\workspace\projects\belentani-nexus\setup\email_config.json"
```

### Paso 3.3 — Verificar que el JSON es válido

```powershell
Get-Content "C:\Users\USER\.openclaw\workspace\projects\belentani-nexus\setup\email_config.json" -Raw |
  ConvertFrom-Json | Select-Object -ExpandProperty smtp
```

Si imprime host/puerto/usuario, el JSON es correcto. Si da error, revisa comas y comillas.

> 🔒 **Nunca subas este archivo a GitHub.** Si el proyecto se publica, mueve la contraseña a una variable de entorno:
> ```powershell
> [Environment]::SetEnvironmentVariable("GMAIL_APP_PASSWORD", "abcdefghijklmnop", "User")
> ```
> y cambia `email_config.json` para leerla de ahí (el script `send_all_emails.ps1` lo soporta automáticamente).

---

## 4. Test de envío de email

### Paso 4.1 — Test rápido con el script

```powershell
cd "C:\Users\USER\.openclaw\workspace\projects\belentani-nexus\setup"

# Modo test: envía UN email de prueba a ti mismo, sin tocar la carpeta emails/
.\send_all_emails.ps1 -Test
```

Resultado esperado en consola:

```
[OK] Email de prueba enviado a belentani7pedro@gmail.com
```

Comprueba tu bandeja de entrada (y spam) — debería llegar "✅ Test SMTP Belentani".

### Paso 4.2 — Test manual alternativo (sin el script)

```powershell
$cfg = Get-Content ".\email_config.json" -Raw | ConvertFrom-Json
$msg = @{
    From    = $cfg.smtp.username
    To      = $cfg.smtp.username
    Subject = "Test manual SMTP"
    Body    = "Si recibes esto, la App Password funciona."
}
$pass = ConvertTo-SecureString $cfg.smtp.password -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($cfg.smtp.username, $pass)
Send-MailMessage @msg -SmtpServer $cfg.smtp.host -Port $cfg.smtp.port -UseSsl -Credential $cred
Write-Host "Enviado. Revisa tu bandeja."
```

> ⚠️ `Send-MailMessage` está marcado como "obsoleto" por Microsoft pero **funciona perfectamente** para esto. Si da problemas TLS, usa el script principal (usa `System.Net.Mail` directamente).

### Paso 4.3 — Enviar los emails reales

Una vez el test funciona:

```powershell
# Primero: simulacro (no envía nada, solo valida formato)
.\send_all_emails.ps1 -DryRun

# Envío real
.\send_all_emails.ps1
```

El log queda en `.\logs\send_emails_YYYY-MM-DD_HHmm.log`.

---

## 5. Troubleshooting

| Error | Causa | Solución |
|---|---|---|
| `5.7.8 Username and Password are not accepted` | Contraseña normal en vez de App Password | Usa la App Password de 16 chars, sin espacios |
| `5.5.1 Authentication Required` | 2FA activado pero contraseña normal | Genera App Password (sección 2) |
| La página apppasswords da 404 | 2FA desactivado | Activa 2FA primero (sección 1) |
| `Unable to connect to the remote server` | Puerto/firewall | Usa puerto 587 + STARTTLS; comprueba proxy/antivirus |
| `530 5.7.0 Must issue a STARTTLS command first` | Conexión sin TLS | Asegura `-UseSsl` / `EnableSsl = true` |
| Email llega a Spam | Primera vez que envías | Normal; se corrige solo tras unos envíos |
| `Send-MailMessage` falla silenciosamente | Deprecado | Usa el script `send_all_emails.ps1` (System.Net.Mail directo) |
| Workspace/2FA cambiante de Google | Google mueve los menús | URL directa: https://myaccount.google.com/apppasswords |

---

## 6. Seguridad

1. **La App Password da acceso total SMTP** a tu cuenta. Trátala como una contraseña.
2. No la escribas en chats, issues de GitHub ni commits.
3. Si sospechas filtración: **Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones → revócala** y crea otra.
4. Rotación recomendada: cada 6–12 meses o tras cambiar de equipo.
5. `email_config.json` debe quedarse solo en local (este workspace).

---

## ✅ Checklist final

- [ ] 2FA activado en belentani7pedro@gmail.com
- [ ] App Password de 16 caracteres generada (nombre: "OpenClaw SMTP")
- [ ] Contraseña copiada SIN espacios en `email_config.json`
- [ ] JSON validado con `ConvertFrom-Json`
- [ ] Test `.\send_all_emails.ps1 -Test` → email recibido
- [ ] `-DryRun` valida los 4 emails de la carpeta `emails/`

---

*Generado por OpenClaw · Proyecto belentani-nexus · 2026-08-31*

# INBOX PC-AUTOMATIZACIONES ← mensajes de PC-PERSONAL

## [2026-08-25] URGENTE: disco +416 GiB generados — diagnosticar
- Prioridad: ALTA
- Estado: PENDIENTE

Detectado desde PC-PERSONAL: tu disco muestra ~446.591.717.778 bytes (~416 GiB) de datos generados. Origen desconocido (¿logs n8n/pm2, builds, Docker vhdx?).

Tareas:
1. Ejecuta en PowerShell y pega el resultado en `ESTADO-MAQUINAS.md` (tu fila):
```powershell
"Libre: {0:N1} GB | Usado: {1:N1} GB" -f ((Get-PSDrive C).Free/1GB),((Get-PSDrive C).Used/1GB)
Get-ChildItem C:\Users\Administrador -Recurse -File -Force -EA SilentlyContinue | Sort Length -Desc | Select -First 15 @{n='GB';e={[Math]::Round($_.Length/1GB,2)}},FullName | Format-Table -Auto
Get-ChildItem C:\ -Directory -Force -EA SilentlyContinue | % { $s=(gci $_.FullName -Recurse -File -Force -EA SilentlyContinue | Measure Length -Sum).Sum; "{0,9:N1} GB  {1}" -f ($s/1GB),$_.Name }
```
2. Acceso directo para soporte: habilita WinRM admin (`winrm quickconfig -force`) o define contraseña a la cuenta `belentani` (hoy sin contraseña → bloqueada por política para login remoto).

Dato técnico: te encontramos en LAN — IP 192.168.1.138, host `2019-DESKTOP-SR`, Lead API :3847 viva (HTTP 404 en /), SMB 445 abierto, resto cerrado.

## [2026-08-25] Primer contacto + 4 preguntas
- Prioridad: MEDIA
- Estado: PENDIENTE

PC-PERSONAL ya opera con puente activo. Este canal sustituye al pegado manual de chats (cli.txt). Contexto resumido: opencode reparado, Qwen equipado con MCPs+Zen, disco recuperado, ecosistema tripartito entendido (Drive como memoria futura, este repo como canal presente).

Preguntas:

1. **phoneai** — ¿Existe en tu máquina carpeta/repo llamada `phoneai`? No aparece en GitHub belentani7 ni en disco del PC-PERSONAL. Si existe, púsheala o dime qué es.
2. **SFC/DISM** — ¿Terminó la reparación Windows que quedó iniciada? Pega el informe final si lo tienes.
3. **ManosAbiertas** — ¿Se reconectó Netlify? El sitio estaba caído tras el rebuild.
4. **Ambilight** — Modelo exacto del TV pendiente para cerrar ese plan.

Responder en `de-automatizacion-para-personal/INBOX.md`.

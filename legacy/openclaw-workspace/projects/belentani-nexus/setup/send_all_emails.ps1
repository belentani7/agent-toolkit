<#
.SYNOPSIS
    send_all_emails.ps1 - Envía los emails preparados en emails/ usando SMTP de Gmail.

.DESCRIPTION
    Lee todos los archivos emails/*.txt con formato:
        To: destinatario
        Cc: (opcional)
        Subject: asunto
        <línea en blanco>
        <cuerpo...>
    y los envía a través de smtp.gmail.com:587 (STARTTLS) usando la App Password
    definida en email_config.json (o la variable de entorno GMAIL_APP_PASSWORD).

.PARAMETER Test
    Envía UN email de prueba a ti mismo y sale. Ideal tras configurar la App Password.

.PARAMETER DryRun
    Valida el config y los archivos de email SIN enviar nada.

.PARAMETER Only
    Envía solo los archivos que coincidan con este patrón (ej. "01_alibaba*").

.PARAMETER ConfigPath
    Ruta al email_config.json. Por defecto: email_config.json junto a este script.

.EXAMPLE
    .\send_all_emails.ps1 -Test
    .\send_all_emails.ps1 -DryRun
    .\send_all_emails.ps1
    .\send_all_emails.ps1 -Only "02_kling*"
#>
[CmdletBinding()]
param(
    [switch]$Test,
    [switch]$DryRun,
    [string]$Only = "",
    [string]$ConfigPath = ""
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EmailsDir = Join-Path $ScriptDir "emails"
$LogsDir   = Join-Path $ScriptDir "logs"
if (-not $ConfigPath) { $ConfigPath = Join-Path $ScriptDir "email_config.json" }
if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null }

$Stamp  = Get-Date -Format "yyyy-MM-dd_HHmm"
$LogPath = Join-Path $LogsDir ("send_emails_{0}.log" -f $Stamp)

function Log([string]$msg) {
    $line = "[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $msg
    Write-Host $line
    Add-Content -Path $LogPath -Value $line -Encoding UTF8
}

function Parse-EmailFile([string]$path) {
    $lines = Get-Content -Path $path -Encoding UTF8
    $to = ""; $cc = ""; $subject = ""; $bodyStart = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $l = $lines[$i]
        if ($bodyStart -eq -1) {
            if ($l -match '^\s*To:\s*(.*)$')       { $to = $Matches[1].Trim(); continue }
            if ($l -match '^\s*Cc:\s*(.*)$')       { $cc = $Matches[1].Trim(); continue }
            if ($l -match '^\s*Subject:\s*(.*)$')  { $subject = $Matches[1].Trim(); continue }
            if ($l.Trim() -eq "" -and $to -and $subject) { $bodyStart = $i + 1; continue }
            if ($l.Trim() -ne "") { break } # formato inválido: texto antes de cabeceras completas
            continue
        } else { break }
    }
    if ($bodyStart -eq -1 -or -not $to -or -not $subject) { return $null }
    $body = ($lines[$bodyStart..($lines.Count - 1)]) -join "`r`n"
    return [pscustomobject]@{ To = $to; Cc = $cc; Subject = $subject; Body = $body }
}

function Get-SmtpConfig() {
    if (-not (Test-Path $ConfigPath)) {
        throw "No existe el config: $ConfigPath — sigue GMAIL_SETUP_GUIDE.md sección 3."
    }
    $cfg = Get-Content $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
    # La variable de entorno tiene prioridad (más seguro que el archivo)
    $envPass = $env:GMAIL_APP_PASSWORD
    if ($envPass) { $cfg.smtp.password = $envPass }
    if (-not $cfg.smtp.password -or $cfg.smtp.password -eq "TU_APP_PASSWORD_16_CHAR") {
        throw "Falta la App Password en $ConfigPath (o define la variable de entorno GMAIL_APP_PASSWORD)."
    }
    return $cfg
}

function Send-Email($cfg, $from, $to, $cc, $subject, $body) {
    $mail = New-Object System.Net.Mail.MailMessage
    $mail.From = $from
    foreach ($t in ($to -split "[,;]" | Where-Object { $_.Trim() })) {
        $mail.To.Add($t.Trim())
    }
    if ($cc) {
        foreach ($c in ($cc -split "[,;]" | Where-Object { $_.Trim() })) {
            $mail.CC.Add($c.Trim())
        }
    }
    $mail.Subject = $subject
    $mail.Body = $body
    $mail.IsBodyHtml = $false
    $mail.HeadersEncoding = [System.Text.Encoding]::UTF8
    $mail.BodyEncoding = [System.Text.Encoding]::UTF8

    $client = New-Object System.Net.Mail.SmtpClient($cfg.smtp.host, [int]$cfg.smtp.port)
    $client.EnableSsl = $true   # STARTTLS en puerto 587
    $client.DeliveryMethod = [System.Net.Mail.SmtpDeliveryMethod]::Network
    $client.Credentials = New-Object System.Net.NetworkCredential($cfg.smtp.username, $cfg.smtp.password)
    $client.Timeout = 60
    try {
        $client.Send($mail)
    } finally {
        $client.Dispose()
        $mail.Dispose()
    }
}

# ============================================================
# MAIN
# ============================================================
Log "=== send_all_emails.ps1 iniciado ==="
Log "Config: $ConfigPath"
Log "Emails dir: $EmailsDir"

try {
    $cfg = Get-SmtpConfig
} catch {
    Log "[ERROR] $($_.Exception.Message)"
    exit 1
}

$fromAddr = $cfg.from.address
if (-not $fromAddr) { $fromAddr = $cfg.smtp.username }

# --- Modo TEST ---
if ($Test) {
    Log "Modo TEST: enviando email de prueba a $fromAddr ..."
    try {
        Send-Email $cfg $fromAddr $fromAddr "" "✅ Test SMTP Belentani" "Si lees esto, la App Password y el SMTP de Gmail funcionan correctamente.`r`n`r`nHora: $(Get-Date)`r`nEquipo: $env:COMPUTERNAME"
        Log "[OK] Email de prueba enviado a $fromAddr. Revisa tu bandeja de entrada."
        exit 0
    } catch {
        Log "[FAIL] Test fallido: $($_.Exception.Message)"
        Log "Consulta GMAIL_SETUP_GUIDE.md sección 5 (Troubleshooting)."
        exit 1
    }
}

# --- Localizar archivos de email ---
if (-not (Test-Path $EmailsDir)) {
    Log "[ERROR] No existe la carpeta $EmailsDir"
    exit 1
}
$files = Get-ChildItem -Path $EmailsDir -Filter "*.txt" | Sort-Object Name
if ($Only) { $files = $files | Where-Object { $_.Name -like $Only } }
if (-not $files -or $files.Count -eq 0) {
    Log "[ERROR] No hay archivos emails/*.txt que enviar."
    exit 1
}

Log "Archivos detectados: $($files.Count)"

# --- Parsear todos primero (fallar rápido si hay formato roto) ---
$parsed = @()
foreach ($f in $files) {
    $e = Parse-EmailFile $f.FullName
    if ($null -eq $e) {
        Log "[ERROR] Formato inválido en $($f.Name). Se requiere: To:, Cc:, Subject:, línea en blanco, cuerpo."
        exit 1
    }
    $parsed += [pscustomobject]@{ File = $f.Name; Email = $e }
    Log "  - $($f.Name) -> $($e.To) | $($e.Subject)"
}

if ($DryRun) {
    Log "[DRY-RUN] Todo válido. No se envió nada."
    Log "SMTP: $($cfg.smtp.host):$($cfg.smtp.port) | From: $fromAddr"
    exit 0
}

# --- Envío real ---
$ok = 0; $fail = 0
foreach ($p in $parsed) {
    $e = $p.Email
    # Las notas internas "NOTA PARA PEDRO" se eliminan del cuerpo al enviar
    $body = $e.Body
    $idx = $body.IndexOf("---`r`nNOTA PARA PEDRO")
    if ($idx -lt 0) { $idx = $body.IndexOf("---`nNOTA PARA PEDRO") }
    if ($idx -ge 0) { $body = $body.Substring(0, $idx).TrimEnd() }

    Log "Enviando $($p.File) -> $($e.To) ..."
    try {
        Send-Email $cfg $fromAddr $e.To $e.Cc $e.Subject $body
        Log "[OK] Enviado: $($p.File)"
        $ok++
        Start-Sleep -Seconds 3  # pausa entre envíos para no disparar rate limits de Gmail
    } catch {
        Log "[FAIL] $($p.File): $($_.Exception.Message)"
        $fail++
    }
}

Log "=== RESUMEN: $ok enviados OK, $fail fallidos ==="
Log "Log completo: $LogPath"

if ($fail -gt 0) { exit 2 } else { exit 0 }

#!/usr/bin/env pwsh
# cleanup-weekly.ps1 — Limpieza semanal automática del sistema
# Uso: .\cleanup-weekly.ps1 o programar como tarea semanal

$ErrorActionPreference = 'SilentlyContinue'
$logFile = "$PSScriptRoot\..\logs\cleanup-$(Get-Date -Format 'yyyy-MM-dd').log"

function Log($msg) {
    $entry = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
    Write-Host $entry
    Add-Content -Path $logFile -Value $entry
}

Log "=== LIMPIEZA SEMANAL - Inicio ==="

# 1. Temp files
Log "🧹 Limpiando archivos temporales..."
$tempBefore = (Get-ChildItem "$env:LOCALAPPDATA\Temp" -Recurse -Force 2>$null | Measure-Object -Property Length -Sum).Sum / 1MB
Get-ChildItem "$env:LOCALAPPDATA\Temp" -Recurse -Force 2>$null | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Recurse -Force 2>$null
$tempAfter = (Get-ChildItem "$env:LOCALAPPDATA\Temp" -Recurse -Force 2>$null | Measure-Object -Property Length -Sum).Sum / 1MB
Log "  Liberado: $([math]::Round($tempBefore - $tempAfter, 2)) MB"

# 2. Downloads antiguos (>60 días)
Log "📥 Limpiando descargas antiguas (>60 días)..."
$dlFiles = Get-ChildItem "$env:USERPROFILE\Downloads" -File -Force 2>$null | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-60) }
$dlSize = ($dlFiles | Measure-Object -Property Length -Sum).Sum / 1MB
$dlFiles | Remove-Item -Force 2>$null
Log "  Liberado: $([math]::Round($dlSize, 2)) MB"

# 3. Browser cache
Log "🌐 Limpiando caché de navegadores..."
$cachePaths = @(
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache",
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
)
foreach ($cp in $cachePaths) {
    if (Test-Path $cp) {
        Get-ChildItem $cp -Recurse -Force 2>$null | Remove-Item -Recurse -Force 2>$null
    }
}
Log "  ✅ Caché navegadores limpiado"

# 4. npm cache
Log "📦 Limpiando npm cache..."
npm cache clean --force 2>$null
Log "  ✅ npm cache limpiado"

# 5. pip cache
Log "🐍 Limpiando pip cache..."
pip cache purge 2>$null
Log "  ✅ pip cache limpiado"

# 6. Logs antiguos propios (>30 días)
Log "📋 Rotando logs propios..."
Get-ChildItem "$PSScriptRoot\..\logs" -File 2>$null | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item -Force 2>$null
Log "  ✅ Logs rotados"

# 7. Papelera
Log "🗑️ Vaciando papelera..."
Clear-RecycleBin -Force 2>$null
Log "  ✅ Papelera vacía"

# 8. DNS flush
Log "🌐 Flush DNS..."
ipconfig /flushdns 2>$null | Out-Null
Log "  ✅ DNS limpio"

# Resumen
$vol = Get-Volume -DriveLetter C
Log "💾 Espacio libre: $([math]::Round($vol.SizeRemaining/1GB, 2)) GB"
Log "=== LIMPIEZA SEMANAL - Completado ==="

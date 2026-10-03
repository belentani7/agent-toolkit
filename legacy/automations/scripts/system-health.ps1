#!/usr/bin/env pwsh
# system-health.ps1 — Diagnóstico rápido del sistema
# Uso: .\system-health.ps1

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "`n🏥 SYSTEM HEALTH CHECK - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "=" * 60

# 1. Disco
$vol = Get-Volume -DriveLetter C
$freeGB = [math]::Round($vol.SizeRemaining / 1GB, 2)
$totalGB = [math]::Round($vol.Size / 1GB, 2)
$pct = [math]::Round(($vol.SizeRemaining / $vol.Size) * 100, 1)
$diskColor = if ($pct -lt 20) { "Red" } elseif ($pct -lt 40) { "Yellow" } else { "Green" }
Write-Host "`n💾 Disco: $freeGB GB / $totalGB GB ($pct% libre)" -ForegroundColor $diskColor

# 2. RAM
$os = Get-CimInstance Win32_OperatingSystem
$totalRAM = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
$freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
$usedRAM = $totalRAM - $freeRAM
$ramPct = [math]::Round(($freeRAM / $totalRAM) * 100, 1)
$ramColor = if ($ramPct -lt 20) { "Red" } elseif ($ramPct -lt 40) { "Yellow" } else { "Green" }
Write-Host "🧠 RAM: $usedRAM GB usado / $totalRAM GB total ($ramPct% libre)" -ForegroundColor $ramColor

# 3. CPU
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
Write-Host "⚡ CPU: $($cpu.Name)"
$cpuLoad = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
$cpuColor = if ($cpuLoad -gt 80) { "Red" } elseif ($cpuLoad -gt 50) { "Yellow" } else { "Green" }
Write-Host "   Carga: $cpuLoad%" -ForegroundColor $cpuColor

# 4. Uptime
$uptime = (Get-Date) - $os.LastBootUpTime
Write-Host "`n⏱️ Uptime: $($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m"

# 5. Red
$net = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object Name, LinkSpeed -First 1
Write-Host "🌐 Red: $($net.Name) @ $($net.LinkSpeed)"

# 6. Top procesos por RAM
Write-Host "`n📊 Top 5 procesos por RAM:"
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 | ForEach-Object {
    Write-Host "   $($_.ProcessName): $([math]::Round($_.WorkingSet64/1MB, 1)) MB"
}

# 7. Git repos status
Write-Host "`n📂 Git repos:"
$repos = Get-ChildItem -Path "$env:USERPROFILE" -Filter ".git" -Directory -Recurse -Hidden -Depth 4 2>$null
foreach ($gitDir in $repos) {
    $repoPath = $gitDir.Parent.FullName
    if ($repoPath -like "*\scoop\*" -or $repoPath -like "*\.codex\*") { continue }
    Push-Location $repoPath
    $dirty = git status --porcelain 2>$null
    $icon = if ($dirty) { "🔴" } else { "🟢" }
    Write-Host "   $icon $($gitDir.Parent.Name)"
    Pop-Location
}

Write-Host "`n✅ Health check completo.`n" -ForegroundColor Green

#!/usr/bin/env pwsh
# git-sync-all.ps1 — Sincroniza todos los repos locales con GitHub
# Uso: .\git-sync-all.ps1

$ErrorActionPreference = 'SilentlyContinue'
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logFile = "$PSScriptRoot\..\logs\git-sync-$(Get-Date -Format 'yyyy-MM-dd').log"

function Log($msg) {
    $entry = "[$timestamp] $msg"
    Write-Host $entry
    Add-Content -Path $logFile -Value $entry
}

Log "=== GIT SYNC ALL - Inicio ==="

# Buscar todos los repos git
$repos = Get-ChildItem -Path "$env:USERPROFILE" -Filter ".git" -Directory -Recurse -Hidden -Depth 4 2>$null

foreach ($gitDir in $repos) {
    $repoPath = $gitDir.Parent.FullName
    $repoName = $gitDir.Parent.Name

    # Saltar repos de herramientas (scoop, codex)
    if ($repoPath -like "*\scoop\*" -or $repoPath -like "*\.codex\*") { continue }

    Push-Location $repoPath
    $remote = git remote -v 2>$null | Select-Object -First 1

    if ($remote) {
        Log "📂 Syncing: $repoName"

        # Fetch
        git fetch --all --prune 2>$null

        # Check for uncommitted changes
        $status = git status --porcelain 2>$null
        if ($status) {
            Log "  ⚠️ Uncommitted changes detected - auto-committing"
            git add -A
            git commit -m "Auto-sync: $timestamp"
        }

        # Pull & Push
        git pull --rebase=false 2>$null
        git push 2>$null

        Log "  ✅ Synced"
    } else {
        Log "⏭️ Skipping (no remote): $repoName"
    }

    Pop-Location
}

Log "=== GIT SYNC ALL - Completado ==="

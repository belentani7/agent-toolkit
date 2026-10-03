# DRIVER DE AUDITORÍA MASIVA - BELENTANI GITHUB
# Orquesta la auditoría de todos los repos con dos pasadas: triage + deep

param(
    [string]$GITHUB_USER = "belentani7",
    [string]$BASE_DIR = "C:\audit-github",
    [string]$QWEN_API_KEY = $env:QWEN_API_KEY,
    [int]$MAX_REPOS = 0,  # 0 = todos
    [switch]$SKIP_TRIAGE,
    [switch]$SKIP_DEEP,
    [switch]$DRY_RUN
)

# Configuración
$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# Crear estructura de directorios
New-Item -ItemType Directory -Force -Path $BASE_DIR | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE_DIR\informes" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE_DIR\st" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE_DIR\logs" | Out-Null
New-Item -ItemType Directory -Force -Path "$BASE_DIR\repos" | Out-Null

# Función para logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] [$Level] $Message"
    Write-Host $logLine
    Add-Content -Path "$BASE_DIR\audit.log" -Value $logLine
}

# Función para obtener lista de repos
function Get-AllRepos {
    Write-Log "Obteniendo lista de repos de $GITHUB_USER..."
    
    $reposFile = "$BASE_DIR\repos.txt"
    
    if (Test-Path $reposFile) {
        Write-Log "Usando lista existente de repos"
        return Get-Content $reposFile
    }
    
    # Usar GitHub API para obtener repos
    $headers = @{
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "OpenClaw-Auditor"
    }
    
    if ($env:GITHUB_TOKEN) {
        $headers["Authorization"] = "token $env:GITHUB_TOKEN"
    }
    
    $page = 1
    $allRepos = @()
    
    do {
        $url = "https://api.github.com/users/$GITHUB_USER/repos?per_page=100&page=$page"
        try {
            $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
            if ($response.Count -eq 0) { break }
            
            $allRepos += $response | Select-Object -ExpandProperty name
            $page++
        } catch {
            Write-Log "Error obteniendo repos: $_" "ERROR"
            break
        }
    } while ($response.Count -eq 100)
    
    # Filtrar repos archivados y forks
    $filteredRepos = $allRepos | Where-Object { $_ -notmatch "^\.|backup|archive|old|test" }
    
    # Guardar lista
    $filteredRepos | Out-File -FilePath $reposFile -Encoding UTF8
    
    Write-Log "Total repos encontrados: $($filteredRepos.Count)"
    return $filteredRepos
}

# Función para ejecutar auditoría en un repo
function Invoke-RepoAudit {
    param(
        [string]$RepoName,
        [string]$Phase  # "triage" o "deep"
    )
    
    $repoDir = "$BASE_DIR\repos\$RepoName"
    $logFile = "$BASE_DIR\logs\$RepoName-$Phase.log"
    $verdictFile = "$BASE_DIR\st\$RepoName.verdict"
    $changesFile = "$BASE_DIR\st\$RepoName.changes"
    
    Write-Log "[$Phase] Iniciando auditoría de $RepoName"
    
    # Verificar si ya fue auditado
    if ($Phase -eq "triage" -and (Test-Path $verdictFile)) {
        Write-Log "[$Phase] $RepoName ya tiene verdicto, saltando"
        return
    }
    
    if ($Phase -eq "deep" -and (Test-Path $changesFile)) {
        Write-Log "[$Phase] $RepoName ya tiene cambios, saltando"
        return
    }
    
    # Clonar repo si no existe
    if (-not (Test-Path $repoDir)) {
        Write-Log "Clonando $RepoName..."
        $cloneUrl = "https://github.com/$GITHUB_USER/$RepoName.git"
        
        if ($DRY_RUN) {
            Write-Log "[DRY RUN] Clonaría: $cloneUrl"
            return
        }
        
        try {
            git clone --depth 1 $cloneUrl $repoDir 2>&1 | Out-File $logFile
            if ($LASTEXITCODE -ne 0) {
                Write-Log "Error clonando $RepoName" "ERROR"
                return
            }
        } catch {
            Write-Log "Excepción clonando $RepoName: $_" "ERROR"
            return
        }
    }
    
    # Preparar prompt
    $promptFile = if ($Phase -eq "triage") { 
        "$PSScriptRoot\PROMPT_TRIAGE.md" 
    } else { 
        "$PSScriptRoot\PROMPT_DEEP.md" 
    }
    
    if (-not (Test-Path $promptFile)) {
        Write-Log "No existe $promptFile" "ERROR"
        return
    }
    
    $prompt = Get-Content $promptFile -Raw
    $prompt = $prompt -replace "\{\{REPO_NAME\}\}", $RepoName
    $prompt = $prompt -replace "\{\{REPO_PATH\}\}", $repoDir
    $prompt = $prompt -replace "\{\{GITHUB_USER\}\}", $GITHUB_USER
    
    # Leer verdicto si es fase deep
    if ($Phase -eq "deep" -and (Test-Path $verdictFile)) {
        $verdict = Get-Content $verdictFile -Raw
        $prompt = $prompt -replace "\{\{VERDICT\}\}", $verdict.Trim()
    }
    
    # Ejecutar con Qwen Code
    Write-Log "Ejecutando $Phase con Qwen Code..."
    
    if ($DRY_RUN) {
        Write-Log "[DRY RUN] Ejecutaría Qwen Code en $repoDir"
        return
    }
    
    # Guardar prompt para debug
    $prompt | Out-File "$BASE_DIR\logs\$RepoName-$Phase.prompt.md"
    
    # Ejecutar Qwen Code
    $env:QWEN_API_KEY = $QWEN_API_KEY
    Push-Location $repoDir
    
    try {
        $output = & qwen -p $prompt 2>&1
        $output | Out-File $logFile -Append
        
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Qwen Code falló en $RepoName" "ERROR"
        } else {
            Write-Log "[$Phase] $RepoName completado exitosamente"
        }
    } catch {
        Write-Log "Excepción ejecutando Qwen Code: $_" "ERROR"
    } finally {
        Pop-Location
    }
    
    # Limpiar repo clonado para ahorrar espacio
    if (Test-Path $repoDir) {
        Remove-Item -Recurse -Force $repoDir
        Write-Log "Repo $RepoName eliminado para liberar espacio"
    }
}

# Función para generar resumen final
function Generate-Summary {
    Write-Log "Generando resumen final..."
    
    $summaryFile = "$BASE_DIR\RESUMEN.md"
    $repos = Get-Content "$BASE_DIR\repos.txt"
    
    $summary = @"
# Resumen de Auditoría - $(Get-Date -Format "yyyy-MM-dd HH:mm")

## Estadísticas
- Total repos: $($repos.Count)
- Auditados: $((Get-ChildItem "$BASE_DIR\st\*.verdict" -ErrorAction SilentlyContinue).Count)
- Con cambios: $((Get-ChildItem "$BASE_DIR\st\*.changes" -ErrorAction SilentlyContinue).Count)

## Veredictos
"@
    
    # Contar veredictos
    $verdicts = @{ "OK" = 0; "WARN" = 0; "CRIT" = 0 }
    
    foreach ($repo in $repos) {
        $verdictFile = "$BASE_DIR\st\$repo.verdict"
        if (Test-Path $verdictFile) {
            $verdict = (Get-Content $verdictFile -Raw).Trim()
            if ($verdicts.ContainsKey($verdict)) {
                $verdicts[$verdict]++
            }
        }
    }
    
    $summary += @"

- ✅ OK: $($verdicts["OK"])
- ⚠️ WARN: $($verdicts["WARN"])
- 🔴 CRIT: $($verdicts["CRIT"])

## Repos Críticos (requieren atención manual)

"@
    
    foreach ($repo in $repos) {
        $verdictFile = "$BASE_DIR\st\$repo.verdict"
        if (Test-Path $verdictFile) {
            $verdict = (Get-Content $verdictFile -Raw).Trim()
            if ($verdict -eq "CRIT") {
                $summary += "- 🔴 $repo`n"
            }
        }
    }
    
    $summary += @"

## Repos con Cambios Automáticos

"@
    
    foreach ($repo in $repos) {
        $changesFile = "$BASE_DIR\st\$repo.changes"
        if (Test-Path $changesFile) {
            $summary += "- ✅ $repo`n"
        }
    }
    
    $summary += @"

## Próximos Pasos

1. Revisar repos CRIT manualmente
2. Revisar PRs creados automáticamente
3. Merge de PRs seguros
4. Rotar secrets expuestos

---
_Generado por OpenClaw Auditor - $(Get-Date)_
"@
    
    $summary | Out-File $summaryFile -Encoding UTF8
    Write-Log "Resumen generado en $summaryFile"
}

# MAIN
Write-Log "========================================="
Write-Log "INICIANDO AUDITORÍA MASIVA BELENTANI"
Write-Log "========================================="
Write-Log "Usuario: $GITHUB_USER"
Write-Log "Directorio: $BASE_DIR"
Write-Log "Dry Run: $DRY_RUN"

# Obtener lista de repos
$repos = Get-AllRepos

if ($MAX_REPOS -gt 0 -and $MAX_REPOS -lt $repos.Count) {
    $repos = $repos | Select-Object -First $MAX_REPOS
    Write-Log "Limitado a $MAX_REPOS repos"
}

# Fase 1: Triage
if (-not $SKIP_TRIAGE) {
    Write-Log "========================================="
    Write-Log "FASE 1: TRIAGE (lectura rápida)"
    Write-Log "========================================="
    
    foreach ($repo in $repos) {
        Invoke-RepoAudit -RepoName $repo -Phase "triage"
    }
}

# Fase 2: Deep (solo repos CRIT)
if (-not $SKIP_DEEP) {
    Write-Log "========================================="
    Write-Log "FASE 2: DEEP (corrección profunda)"
    Write-Log "========================================="
    
    $critRepos = @()
    foreach ($repo in $repos) {
        $verdictFile = "$BASE_DIR\st\$repo.verdict"
        if (Test-Path $verdictFile) {
            $verdict = (Get-Content $verdictFile -Raw).Trim()
            if ($verdict -eq "CRIT") {
                $critRepos += $repo
            }
        }
    }
    
    Write-Log "Repos críticos encontrados: $($critRepos.Count)"
    
    foreach ($repo in $critRepos) {
        Invoke-RepoAudit -RepoName $repo -Phase "deep"
    }
}

# Generar resumen
Generate-Summary

Write-Log "========================================="
Write-Log "AUDITORÍA COMPLETADA"
Write-Log "========================================="
Write-Log "Ver: $BASE_DIR\RESUMEN.md"

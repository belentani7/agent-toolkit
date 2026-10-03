<#
.SYNOPSIS
    Aplica todos los patches de contribuciones preparadas, crea branches y
    commitea localmente. Prepara (sin push) todo lo necesario para abrir PRs.

.DESCRIPTION
    Para cada contribución definida en manifest.json:
      1. Clona el repo destino (si no existe ya en .\repos)
      2. Hace checkout del commit base exacto indicado en el manifest
      3. Crea el branch indicado
      4. Aplica patch.diff con `git apply`
      5. Conmuta con el commit message de COMMIT_MESSAGE.txt
    Las contribuciones con dependsOn se aplican sobre el branch de su
    dependencia (p. ej. 002 y 003 continúan el estado del toctree de 001).

    NO hace push ni crea PRs en GitHub (varios repos destino restringen PRs
    externos; ver README.md). Al final imprime los comandos exactos para
    pushear y crear cada PR si se desea.

.PARAMETER ContributionsDir
    Directorio raíz de las contribuciones. Por defecto, el directorio del script.

.PARAMETER ReposDir
    Directorio donde clonar/reutilizar los repos. Por defecto, <ContributionsDir>\repos.

.PARAMETER Only
    Id opcional (p. ej. "004") para procesar una única contribución.

.EXAMPLE
    .\apply_contributions.ps1
    .\apply_contributions.ps1 -Only 004
#>
[CmdletBinding()]
param(
    [string]$ContributionsDir = "",
    [string]$ReposDir = "",
    [string]$Only = ""
)

$ErrorActionPreference = "Continue"  # git escribe en stderr de forma rutinaria; los fallos se comprueban con $LASTEXITCODE

# Fallbacks robustos para el directorio del script
if (-not $ContributionsDir) {
    if ($PSScriptRoot) {
        $ContributionsDir = $PSScriptRoot
    } else {
        $ContributionsDir = (Get-Location).Path
    }
}
if (-not $ReposDir) { $ReposDir = Join-Path $ContributionsDir "repos" }
$ManifestPath = Join-Path $ContributionsDir "manifest.json"

if (-not (Test-Path $ManifestPath)) {
    throw "No se encuentra manifest.json en $ContributionsDir"
}
$manifest = Get-Content $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json

function Get-LocalRepoName([string]$repoSlug) {
    return ($repoSlug -split '/')[-1]
}

function Ensure-Repo([string]$repoSlug, [string]$baseSha) {
    $name = Get-LocalRepoName $repoSlug
    $path = Join-Path $ReposDir $name
    if (-not (Test-Path (Join-Path $path ".git"))) {
        Write-Host "[clone] $repoSlug -> $path" -ForegroundColor Cyan
        git clone "https://github.com/$repoSlug.git" $path | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "git clone falló para $repoSlug" }
    }
    # Garantizar que el commit base está disponible
    Push-Location $path
    try {
        git cat-file -e "${baseSha}^{commit}" 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[fetch] $repoSlug @ $baseSha" -ForegroundColor Cyan
            git fetch origin $baseSha | Out-Null
            if ($LASTEXITCODE -ne 0) { throw "No se pudo obtener el commit base $baseSha de $repoSlug" }
        }
    } finally {
        Pop-Location
    }
    return $path
}

# Identidad git local (necesaria para commitear; solo se configura por repo)
function Ensure-GitIdentity([string]$repoPath) {
    Push-Location $repoPath
    try {
        $name = git config user.name 2>$null
        $email = git config user.email 2>$null
        if (-not $name)  { git config user.name  "belentani7" }
        if (-not $email) { git config user.email "belentani7@users.noreply.github.com" }
    } finally {
        Pop-Location
    }
}

$contribs = $manifest.contributions
if ($Only) {
    $contribs = $contribs | Where-Object { $_.id -eq $Only }
    if (-not $contribs) { throw "Contribución '$Only' no encontrada en manifest.json" }
}

# Índice de branches ya creados (para dependsOn)
$branchReady = @{}

$results = @()

foreach ($c in $contribs) {
    $id = $c.id
    Write-Host ""
    Write-Host "=== [$id] $($c.title) ===" -ForegroundColor Yellow

    $repoPath = Ensure-Repo $c.repo $manifest.baseCommits.($c.repo)
    $dir = Join-Path $ContributionsDir $c.dir
    $patch = Join-Path $dir "patch.diff"
    $commitMsg = Join-Path $dir "COMMIT_MESSAGE.txt"

    if (-not (Test-Path $patch)) { throw "Falta $patch" }
    if (-not (Test-Path $commitMsg)) { throw "Falta $commitMsg" }

    Ensure-GitIdentity $repoPath

    Push-Location $repoPath
    try {
        # Punto de partida: branch de la dependencia o commit base limpio
        if ($c.dependsOn -and $branchReady.ContainsKey($c.dependsOn)) {
            $startRef = $branchReady[$c.dependsOn].branch
            Write-Host "[base] sobre branch de dependencia: $startRef" -ForegroundColor DarkCyan
            git checkout -q $startRef
        } else {
            $startRef = $manifest.baseCommits.($c.repo)
            # Reset duro por si el repo quedó sucio de una ejecución anterior
            git checkout -q --detach $startRef 2>&1 | Out-Null
            git reset -q --hard $startRef
            git clean -q -fd
        }
        if ($LASTEXITCODE -ne 0) { throw "checkout del punto de partida falló para $id" }

        # Branch de trabajo
        git branch -D $c.branch 2>&1 | Out-Null
        git checkout -q -b $c.branch
        if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el branch $($c.branch)" }

        # Aplicar patch (verificación previa con diagnóstico)
        git apply --check $patch 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[apply] fallo --check, diagnóstico:" -ForegroundColor Red
            git apply --check --verbose $patch 2>&1 | Out-String | Write-Host
            throw "git apply falló para $id"
        }
        git apply $patch
        if ($LASTEXITCODE -ne 0) { throw "git apply falló para $id" }
        Write-Host "[apply] OK" -ForegroundColor Green

        # Commit
        git add -A
        git commit -q -F $commitMsg
        if ($LASTEXITCODE -ne 0) { throw "git commit falló para $id" }
        $sha = git rev-parse --short HEAD
        Write-Host "[commit] $sha en branch $($c.branch)" -ForegroundColor Green

        $branchReady[$id] = @{ branch = $c.branch; repo = $c.repo; repoPath = $repoPath }
        $results += [pscustomobject]@{
            Id      = $id
            Repo    = $c.repo
            Branch  = $c.branch
            Commit  = $sha
            Issue   = if ($c.issue) { $c.issue } else { "-" }
        }
    } finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "================ RESUMEN ================" -ForegroundColor Cyan
$results | Format-Table -AutoSize | Out-String | Write-Host

Write-Host "Preparación completada SIN push. Para enviar un PR (si el repo lo permite):" -ForegroundColor Cyan
foreach ($r in $results) {
    $localDir = (Join-Path $ReposDir (Get-LocalRepoName $r.Repo))
    $contribDir = ($contribs | Where-Object { $_.id -eq $r.Id }).dir
    $prBody = Join-Path (Join-Path $ContributionsDir $contribDir) "PR_DESCRIPTION.md"
    Write-Host ""
    Write-Host "# $($r.Id) ($($r.Repo)) — branch $($r.Branch)" -ForegroundColor White
    Write-Host "  cd '$localDir'"
    Write-Host "  git push -u origin $($r.Branch)"
    Write-Host "  gh pr create --repo $($r.Repo) --title '<ver COMMIT_MESSAGE.txt, primera línea>' --body-file '$prBody'"
}

Write-Host ""
Write-Host "NOTA: openai/codex y anthropics/claude-code restringen actualmente PRs" -ForegroundColor Red
Write-Host "externos (ver README.md). Para esos repos, comparte el patch.diff en el" -ForegroundColor Red
Write-Host "hilo del issue correspondiente." -ForegroundColor Red

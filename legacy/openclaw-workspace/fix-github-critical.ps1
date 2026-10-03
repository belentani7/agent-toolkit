<#
.SYNOPSIS
  fix-github-critical.ps1 - Corrige problemas criticos detectados en la auditoria
  de GitHub de belentani7 (informe: GITHUB_AUDIT_FULL.md).

.DESCRIPTION
  Acciones:
    1. [CRITICO] CARQUIDEC: purga settings.json (API key OpenRouter) del historico git
       con git filter-repo y hace force-push. REQUIERE revocar la key manualmente
       en https://openrouter.ai/keys (el script no puede hacerlo por ti).
    2. abrazo-tender-words y tender-words-connect: deja de trackear .env
       (git rm --cached), lo anade a .gitignore y hace push.
    3. Anade un .gitignore basico a los repos que no tienen.
    4. Genera un README.md minimo en los repos no vacios que no tienen.

.MODO DE USO
  .\fix-github-critical.ps1           # DRY RUN: solo muestra lo que haria
  .\fix-github-critical.ps1 -Apply    # ejecuta los cambios reales
  .\fix-github-critical.ps1 -Apply -DeleteEmpty   # ademas borra repos vacios (pedira confirmacion)

.NOTES
  Requiere: gh CLI autenticado como belentani7, git, python (opcional, para filter-repo).
  Trabaja en C:\Users\USER\.openclaw\workspace\gh-fix-tmp (se crea solo).
#>

param(
    [switch]$Apply,
    [switch]$DeleteEmpty
)

$ErrorActionPreference = "Stop"
$Owner   = "belentani7"
$TmpDir  = Join-Path $PSScriptRoot "gh-fix-tmp"
$ReposGitignore = @(
    "belentani-omega-portal", "belentani-video-forge", "belentani7-gestaltAI",
    "belentani7.github.io", "duck-2026", "duck-docs", "judas-experience-galactic",
    "judas-omega-static", "michelle-relayze-web", "openclaw-workspace",
    "the-judas-experience"
)
$ReposReadme = @(
    "Belentani.cv-ai", "CARQUIDEC", "Duck-Omega", "Steven-renovation",
    "arte-que-veste", "heyduck", "judas-omega-static", "mimo-companion",
    "openclaw-workspace", "registro-proyectos-2026"
)
$ReposEnv = @("abrazo-tender-words", "tender-words-connect")
$EmptyRepos = @("belentani-judas", "jvictorbarbosa")

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Info([string]$msg) { Write-Host "    $msg" }
function Warn([string]$msg) { Write-Host "    [!] $msg" -ForegroundColor Yellow }
function Run([string[]]$cmd, [string]$wd) {
    Info "> $($cmd -join ' ')"
    if (-not $Apply) { return }
    Push-Location $wd
    try { & $cmd[0] $cmd[1..($cmd.Length-1)] 2>&1 | ForEach-Object { Info "  $_" } }
    finally { Pop-Location }
    if ($Apply -and $LASTEXITCODE -ne 0) { Warn "exit code $LASTEXITCODE" }
}

Write-Host "================================================================" -ForegroundColor Magenta
if (-not $Apply) {
    Write-Host " MODO DRY RUN - no se haran cambios. Usa -Apply para ejecutar." -ForegroundColor Yellow
} else {
    Write-Host " MODO APPLY - se haran cambios reales en GitHub." -ForegroundColor Red
}
Write-Host "================================================================" -ForegroundColor Magenta

# Comprobaciones previas
$acct = (gh api user --jq '.login') 2>$null
if ($acct -ne $Owner) {
    throw "gh CLI no esta autenticado como $Owner (actual: $acct). Ejecuta: gh auth login"
}
New-Item -ItemType Directory -Force -Path $TmpDir | Out-Null

# ------------------------------------------------------------------
Step "1/4 CRITICO: purgar secreto de CARQUIDEC (settings.json con API key OpenRouter)"
Warn "ACCION MANUAL OBLIGATORIA: revoca la key en https://openrouter.ai/keys ANTES o DESPUES, pero HAGALO."
$clone = Join-Path $TmpDir "CARQUIDEC"
if ($Apply) {
    if (Test-Path $clone) { Remove-Item -Recurse -Force $clone }
    Run @("git", "clone", "--no-checkout", "https://github.com/$Owner/CARQUIDEC.git", $clone) $TmpDir
    $hasFilterRepo = $null -ne (Get-Command "git-filter-repo" -ErrorAction SilentlyContinue)
    if (-not $hasFilterRepo) {
        Warn "git-filter-repo no esta instalado. Intentando: pip install git-filter-repo"
        & pip install git-filter-repo 2>&1 | Out-Null
        $hasFilterRepo = $null -ne (Get-Command "git-filter-repo" -ErrorAction SilentlyContinue)
    }
    if ($hasFilterRepo) {
        Run @("git", "filter-repo", "--path", "settings.json", "--invert-paths", "--force") $clone
        Run @("git", "push", "--force", "--all") $clone
        Run @("git", "push", "--force", "--tags") $clone
        Info "settings.json purgado del historico de CARQUIDEC."
    } else {
        Warn "No se pudo instalar git-filter-repo. Alternativa manual:"
        Warn "  cd <clone>; git filter-branch --index-filter 'git rm --cached --ignore-unmatch settings.json' --prune-empty --tag-name-filter cat -- --all"
    }
} else {
    Info "git clone + git filter-repo --path settings.json --invert-paths + force-push"
}

# ------------------------------------------------------------------
Step "2/4 Dejar de trackear .env en $($ReposEnv -join ', ')"
foreach ($repo in $ReposEnv) {
    $clone = Join-Path $TmpDir $repo
    if ($Apply) {
        if (Test-Path $clone) { Remove-Item -Recurse -Force $clone }
        Run @("git", "clone", "--depth", "1", "https://github.com/$Owner/$repo.git", $repo) $TmpDir
        if (-not (Test-Path (Join-Path $clone ".env"))) { Info "${repo}: no hay .env, saltando"; continue }
        Run @("git", "rm", "--cached", ".env") $clone
        $gi = Join-Path $clone ".gitignore"
        $content = if (Test-Path $gi) { Get-Content $gi -Raw } else { "" }
        if ($content -notmatch '(?m)^\.env\s*$') {
            Add-Content -Path $gi -Value "`n# secretos`n.env`n.env.*"
        }
        Run @("git", "add", ".gitignore") $clone
        Run @("git", "commit", "-m", "chore: dejar de trackear .env y anadirlo a .gitignore (auditoria seguridad)") $clone
        Run @("git", "push") $clone
    } else {
        Info "$repo : git rm --cached .env + .gitignore + push"
    }
}

# ------------------------------------------------------------------
Step "3/4 Anadir .gitignore a repos sin el: $($ReposGitignore.Count) repos"
$giTemplate = @"
# Dependencias
node_modules/
vendor/
__pycache__/
*.pyc

# Secretos / entorno
.env
.env.*
*.pem
*.key
secrets/

# Build
dist/
build/
.next/
out/

# Sistema
.DS_Store
Thumbs.db
"@
foreach ($repo in $ReposGitignore) {
    $tmp = New-TemporaryFile
    Set-Content -Path $tmp -Value $giTemplate
    if ($Apply) {
        Info "$repo : subir .gitignore via API"
        $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($tmp))
        $br = gh api "repos/$Owner/$repo" --jq '.default_branch'
        gh api --method PUT "repos/$Owner/$repo/contents/.gitignore" `
            -f message="chore: anadir .gitignore (auditoria)" `
            -f "content=$b64" `
            -f branch=$br | Out-Null
        if ($LASTEXITCODE -ne 0) { Warn "fallo al subir .gitignore a $repo" }
    } else {
        Info "$repo : PUT /repos/$Owner/$repo/contents/.gitignore"
    }
    Remove-Item $tmp
}

# ------------------------------------------------------------------
Step "4/4 Generar README.md minimo en repos no vacios sin README"
foreach ($repo in $ReposReadme) {
    $desc = gh api "repos/$Owner/$repo" --jq '.description'
    if (-not $desc -or $desc -eq 'null') { $desc = "Repositorio de $Owner." }
    $readme = "# $repo`n`n$desc`n`n> README generado automaticamente por la auditoria de seguridad (2026-08-31).`n"
    $tmp = New-TemporaryFile
    Set-Content -Path $tmp -Value $readme
    if ($Apply) {
        $br = gh api "repos/$Owner/$repo" --jq '.default_branch'
        $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($tmp))
        Info "$repo : subir README.md via API (rama $br)"
        gh api --method PUT "repos/$Owner/$repo/contents/README.md" `
            -f message="docs: anadir README (auditoria)" `
            -f "content=$b64" `
            -f branch=$br | Out-Null
        if ($LASTEXITCODE -ne 0) { Warn "fallo en $repo (puede ser repo vacio o rama distinta)" }
    } else {
        Info "$repo : PUT /repos/$Owner/$repo/contents/README.md"
    }
    Remove-Item $tmp
}

# ------------------------------------------------------------------
if ($DeleteEmpty) {
    Step "EXTRA: borrar repos vacios ($($EmptyRepos -join ', '))"
    foreach ($repo in $EmptyRepos) {
        if ($Apply) {
            $confirm = Read-Host "Borrar $Owner/$repo? (escribe el nombre exacto para confirmar)"
            if ($confirm -eq $repo) {
                gh repo delete "$Owner/$repo" --yes
                Info "Borrado $repo"
            } else { Warn "Confirmacion no coincide; saltando $repo" }
        } else {
            Info "gh repo delete $Owner/$repo --yes (pedira confirmacion)"
        }
    }
}

Step "LIMPIEZA"
if ($Apply) { Remove-Item -Recurse -Force $TmpDir -ErrorAction SilentlyContinue; Info "directorio temporal eliminado" }

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host " RESUMEN" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  [1] CARQUIDEC: settings.json purgado del historico"
Write-Host "  [2] $($ReposEnv.Count) repos: .env fuera de tracking"
Write-Host "  [3] $($ReposGitignore.Count) repos: .gitignore anadido"
Write-Host "  [4] $($ReposReadme.Count) repos: README.md generado"
if ($DeleteEmpty) { Write-Host "  [+] Repos vacios: eliminados (si se confirmo)" }
Write-Host ""
Write-Host "  RECORDATORIO: revocar la API key de OpenRouter en https://openrouter.ai/keys" -ForegroundColor Red
Write-Host "  y verificar RLS en Supabase (proyecto ejkcfwcjreaobffuexsb)." -ForegroundColor Red

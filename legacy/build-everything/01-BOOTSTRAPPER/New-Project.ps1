#Requires -Version 5.1
<#
.SYNOPSIS
    UNIVERSAL BOOTSTRAPPER - Factory de Software Agéntica
.DESCRIPTION
    Genera la estructura estándar, entorno virtual, agente local y configuración
    para CUALQUIER proyecto nuevo en segundos.

    Comprueba requisitos (git, python, node), crea la arquitectura de carpetas,
    escribe .env / .gitignore / README.md, inyecta archivos del stack elegido y
    opcionalmente inicializa el repositorio Git.
.PARAMETER ProjectName
    Nombre del proyecto (sin espacios ni caracteres reservados).
.PARAMETER Stack
    Stack tecnológico: python, node, fullstack, ai.
.PARAMETER ProjectPath
    Directorio raíz donde crear el proyecto. Por defecto: $HOME\<ProjectName>.
.PARAMETER NoGit
    Omite la inicialización de Git.
.PARAMETER Force
    Sobrescribe el directorio destino si ya existe.
.EXAMPLE
    .\New-Project.ps1 -ProjectName "MiSaaS" -Stack fullstack
.EXAMPLE
    .\New-Project.ps1 -ProjectName "dataApp" -Stack python -NoGit
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string]$ProjectName,

    [ValidateSet("python", "node", "fullstack", "ai")]
    [string]$Stack = "python",

    [string]$ProjectPath,

    [switch]$NoGit,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

# ─── Validación de nombre de proyecto ─────────────────────────────────────────
if ($ProjectName -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_-]*$') {
    Write-Host "ERROR: ProjectName no es valido. Usa solo letras, numeros, guiones o guion bajo (sin espacios)." -ForegroundColor Red
    exit 1
}

if (-not $ProjectPath) {
    $ProjectPath = Join-Path $HOME $ProjectName
}
# Normaliza la ruta (evita duplicar separadores)
$ProjectPath = [System.IO.Path]::GetFullPath($ProjectPath)

function Write-Step([int]$num, [int]$total, [string]$msg) {
    Write-Host "[$num/$total] $msg..." -ForegroundColor Yellow
}

function Test-Command([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

# ─── 0. Chequeo de requisitos ────────────────────────────────────────────────
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " UNIVERSAL BOOTSTRAPPER: $ProjectName" -ForegroundColor Cyan
Write-Host " Stack: $Stack" -ForegroundColor Cyan
Write-Host " Destino: $ProjectPath" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$needGit  = -not $NoGit
$needPy   = $Stack -in @('python', 'fullstack', 'ai')
$needNode = $Stack -in @('node', 'fullstack')

$missing = @()
if ($needGit -and -not (Test-Command 'git'))     { $missing += 'git' }
if ($needPy -and -not (Test-Command 'python'))   { $missing += 'python' }
if ($needNode -and -not (Test-Command 'node'))   { $missing += 'node' }

if ($missing.Count -gt 0) {
    Write-Host "Faltan requisitos: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Instalos antes de continuar (ej: winget install Git.Git Python.Python.3.12 OpenJS.NodeJS.LTS)." -ForegroundColor Yellow
    exit 1
}

try {
    # ─── 0b. Control de directorio destino ───────────────────────────────────
    if (Test-Path -LiteralPath $ProjectPath) {
        if (-not $Force) {
            Write-Host "ERROR: '$ProjectPath' ya existe. Usa -Force para sobrescribirlo o cambia ProjectName." -ForegroundColor Red
            exit 1
        }
        Write-Host "Aviso: sobrescribiendo '$ProjectPath' (Force)." -ForegroundColor Yellow
        Remove-Item -LiteralPath $ProjectPath -Recurse -Force
    }

    # 1. Estructura de directorios
    Write-Step 1 7 "Generando arquitectura"
    $dirs = @("src/core", "src/api", "src/ui", "infra", "scripts", "docs", "tests", "data", ".github/workflows")
    foreach ($d in $dirs) {
        New-Item -ItemType Directory -Path (Join-Path $ProjectPath $d) -Force | Out-Null
    }

    # 2. .env
    Write-Step 2 7 "Configurando entorno"
    @"
# $ProjectName Environment
PROJECT_NAME=$ProjectName
OLLAMA_HOST=http://localhost:11434
ENV=development
LOG_LEVEL=INFO
"@ | Out-File (Join-Path $ProjectPath ".env") -Encoding utf8

    # 3. .gitignore
    @"
__pycache__/
*.pyc
.env
venv/
node_modules/
data/*.csv
data/*.json
*.log
.DS_Store
"@ | Out-File (Join-Path $ProjectPath ".gitignore") -Encoding utf8

    # 4. README.md
    Write-Step 3 7 "Escribiendo README"
    @"
# $ProjectName

## Stack
- PowerShell 5.1+, Python 3.10+, Node.js 20+

## Quick Start
``````powershell
.\scripts\setup.ps1
``````

## Structure
``````
$ProjectName/
|-- src/          # Source code
|-- tests/        # Tests
|-- docs/         # Documentation
|-- infra/        # Infrastructure
|-- scripts/      # Automation scripts
`-- data/         # Data files
``````
"@ | Out-File (Join-Path $ProjectPath "README.md") -Encoding utf8

    # 5. Stack-specific files
    Write-Step 4 7 "Inyectando stack $Stack"

    if ($Stack -in @('python', 'fullstack', 'ai')) {
        @"
fastapi
uvicorn
httpx
python-dotenv
pydantic
pytest
rich
"@ | Out-File (Join-Path $ProjectPath "requirements.txt") -Encoding utf8

        @"
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="$ProjectName", version="0.1.0")

class HealthResponse(BaseModel):
    status: str
    project: str

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", project="$ProjectName")

@app.get("/")
async def root():
    return {"message": "$ProjectName API is running"}
"@ | Out-File (Join-Path $ProjectPath "src/api/main.py") -Encoding utf8
    }

    if ($Stack -in @('node', 'fullstack')) {
        @"
{
  "name": "$($ProjectName.ToLower())",
  "version": "0.1.0",
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js"
  }
}
"@ | Out-File (Join-Path $ProjectPath "package.json") -Encoding utf8

        # Servidor estatico seguro: previene path traversal fuera de src/
        @"
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0] || '/');
    const filePath = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));

    // Seguridad: el archivo resuelto debe vivir dentro de src/
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json'};
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200, {'Content-Type': types[path.extname(filePath)] || 'text/plain'});
            res.end(content);
        }
    });
});

server.listen(PORT, () => console.log(``Server running on http://localhost:`${PORT}``));
"@ | Out-File (Join-Path $ProjectPath "src/server.js") -Encoding utf8

        @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$ProjectName</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui; background: #0a0a0f; color: #e0e0e0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 2rem; text-align: center; max-width: 400px; }
        h1 { font-size: 1.5rem; margin-bottom: .5rem; }
        p { color: #888; font-size: .9rem; }
        .status { color: #00ff88; margin-top: 1rem; font-family: monospace; }
    </style>
</head>
<body>
    <div class="card">
        <h1>$ProjectName</h1>
        <p>Project is running</p>
        <div class="status">STATUS: OK</div>
    </div>
</body>
</html>
"@ | Out-File (Join-Path $ProjectPath "src/index.html") -Encoding utf8
    }

    if ($Stack -eq 'ai') {
        @"
# AI Agent Configuration
from langchain_community.llms import Ollama

def get_agent():
    return Ollama(model="qwen2.5-coder:7b", base_url="http://localhost:11434")

def classify_task(prompt: str) -> str:
    keywords = {
        "code": ["code", "function", "script", "implement", "fix"],
        "research": ["research", "analyze", "find", "compare"],
        "creative": ["create", "design", "write", "generate"],
    }
    prompt_lower = prompt.lower()
    for category, words in keywords.items():
        if any(w in prompt_lower for w in words):
            return category
    return "general"
"@ | Out-File (Join-Path $ProjectPath "src/core/agent.py") -Encoding utf8
    }

    # 6. Setup script
    Write-Step 5 7 "Generando setup script"
    @"
#Requires -Version 5.1
`$ErrorActionPreference = 'Stop'

Write-Host "Setting up $ProjectName..." -ForegroundColor Cyan

if (Test-Path "requirements.txt") {
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: python no encontrado. Instalalo primero." -ForegroundColor Red
        exit 1
    }
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    python -m pip install --upgrade pip -q
    python -m pip install -r requirements.txt
    Write-Host "Python dependencies installed" -ForegroundColor Green
}

if (Test-Path "package.json") {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: npm no encontrado. Instala Node.js primero." -ForegroundColor Red
        exit 1
    }
    npm install
    Write-Host "Node dependencies installed" -ForegroundColor Green
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Run: python src/api/main.py  OR  node src/server.js" -ForegroundColor Yellow
"@ | Out-File (Join-Path $ProjectPath "scripts/setup.ps1") -Encoding utf8

    # 7. Init git
    if (-not $NoGit) {
        Write-Step 6 7 "Inicializando Git"
        Push-Location $ProjectPath
        try {
            git init | Out-Null
            git add . | Out-Null
            if (git config user.email) {
                git commit -m "Initial commit: $ProjectName scaffold" | Out-Null
                Write-Host "Git inicializado y commit creado." -ForegroundColor Green
            } else {
                git commit -m "Initial commit: $ProjectName scaffold" --author "Bootstrapper <bootstrapper@local>" | Out-Null
                Write-Host "Git inicializado (commit creado con identidad local)." -ForegroundColor Green
            }
        } catch {
            Write-Host "Aviso: no se pudo completar el commit inicial ($($_.Exception.Message))." -ForegroundColor Yellow
            Write-Host "Configura git config --global user.name / user.email y commitea manualmente." -ForegroundColor Yellow
        } finally {
            Pop-Location
        }
    } else {
        Write-Step 6 7 "Git omitido (-NoGit)"
    }

    # 8. Summary
    Write-Step 7 7 "Proyecto listo"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host " $ProjectName CREATED SUCCESSFULLY" -ForegroundColor Green
    Write-Host " Location: $ProjectPath" -ForegroundColor Cyan
    Write-Host " Stack: $Stack" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  cd $ProjectPath" -ForegroundColor White
    Write-Host "  .\scripts\setup.ps1" -ForegroundColor White

} catch {
    # Limpieza: si fallamos a mitad, no dejamos directorios parciales.
    if (Test-Path -LiteralPath $ProjectPath) {
        Write-Host "Limpiando archivos parciales..." -ForegroundColor Yellow
        Remove-Item -LiteralPath $ProjectPath -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

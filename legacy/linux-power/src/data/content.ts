/* ============================================================
 * BE.Pilot — contenido del sitio
 * Collab: NOICORE LAB × BELENTANI
 * ============================================================ */

export type RepoNode =
  | { kind: "dir"; name: string; children: RepoNode[] }
  | { kind: "file"; name: string; path: string; lang: string; content: string; blurb: string };

/* ------------------------------------------------------------ */
/*  Contenido real de los archivos del repo                      */
/* ------------------------------------------------------------ */

const WORKFLOW_YML = `name: linux-pwsh-cli-browser

on:
  workflow_dispatch:
  push:
    branches:
      - main
      - master
  schedule:
    - cron: "0 6 * * *"

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  control:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Verificar PowerShell, GitHub CLI, Git y Node
        shell: pwsh
        run: |
          $PSVersionTable
          gh --version
          git --version
          node --version
          npm --version

      - name: Instalar Playwright y Chromium headless
        shell: bash
        run: |
          set -euo pipefail
          npm install --no-save playwright
          npx playwright install --with-deps chromium
          npx playwright --version

      - name: Probar navegador
        shell: bash
        run: |
          set -euo pipefail
          node scripts/browser-screenshot.js https://example.com browser-test.png

      - name: Autenticar GitHub CLI
        shell: pwsh
        env:
          GH_TOKEN: \${{ secrets.GH_TOKEN || github.token }}
        run: |
          gh auth status

      - name: Ejecutar skills de control de repos
        shell: pwsh
        env:
          GH_TOKEN: \${{ secrets.GH_TOKEN || github.token }}
          CREATE_ISSUE: 'false'
        run: |
          pwsh -File ./scripts/Control-Repos.ps1

      - name: Subir evidencias del navegador
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: browser-artifacts
          path: |
            browser-test.png
            screenshot.png
          if-no-files-found: ignore`;

const DEVCONTAINER_JSON = `{
  "name": "linux-pwsh-gh-browser",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/powershell:1": {},
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "postCreateCommand": "bash .devcontainer/setup.sh",
  "remoteUser": "vscode",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.powershell",
        "github.vscode-github-actions",
        "ms-playwright.playwright"
      ]
    }
  }
}`;

const SETUP_SH = `#!/usr/bin/env bash
set -eux

sudo apt-get update

# Si por alguna razón no hay Node, instalar una versión básica.
if ! command -v npm >/dev/null 2>&1; then
  sudo apt-get install -y nodejs npm
fi

# Playwright global + dependencias del sistema + Chromium.
sudo npm install -g playwright
sudo env "PATH=$PATH" npx playwright install-deps chromium
npx playwright install chromium

# Verificación mínima.
pwsh -NoLogo -NoProfile -Command '$PSVersionTable'
gh --version || true
node --version
npm --version`;

const CONTROL_REPOS_PS1 = `$ErrorActionPreference = 'Continue'

function Write-Skill {
    param([string]$Name)
    Write-Host ""
    Write-Host "=== $Name ===" -ForegroundColor Cyan
}

Write-Skill "Skill 1: autenticación GitHub CLI"
gh auth status
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI no está autenticado. Revisa GH_TOKEN o GITHUB_TOKEN."
}

Write-Skill "Skill 2: repo actual"
$repoJson = gh repo view --json nameWithOwner,defaultBranchRef
if ($LASTEXITCODE -ne 0) {
    throw "No se pudo obtener el repo actual."
}

$repoInfo = $repoJson | ConvertFrom-Json
$repo = $repoInfo.nameWithOwner
$branch = $repoInfo.defaultBranchRef.name

Write-Host "Repo actual: $repo"
Write-Host "Rama por defecto: $branch"

Write-Skill "Skill 3: repos accesibles"
gh repo list --limit 10 --json nameWithOwner,visibility,updatedAt
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudieron listar más repos. Puede faltar permiso al token."
}

Write-Skill "Skill 4: detalle del repo actual"
gh api "repos/$repo" --jq '.full_name + " | private=" + (.private | tostring) + " | branch=" + .default_branch'
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudo obtener detalle del repo actual."
}

Write-Skill "Skill 5: issues abiertos"
gh issue list --repo $repo --state open --limit 5 --json number,title,state
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudieron listar issues. Puede que el repo no tenga issues activos."
}

Write-Skill "Skill 6: pull requests abiertos"
gh pr list --repo $repo --state open --limit 5 --json number,title,state
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudieron listar pull requests."
}

Write-Skill "Skill 7: navegador headless"
node "$PSScriptRoot/browser-screenshot.js" https://example.com screenshot.png
if ($LASTEXITCODE -ne 0) {
    throw "El navegador headless falló. Revisa Playwright."
}
Write-Host "Screenshot guardado en screenshot.png"

if ($env:CREATE_ISSUE -eq 'true') {
    Write-Skill "Skill 8: crear issue de control"
    gh issue create --repo $repo --title "Control automático" --body "Ejecutado desde GitHub Actions con PowerShell."
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo crear el issue."
    }
}

Write-Skill "Fin"
Write-Host "Skills ejecutadas correctamente."`;

const BROWSER_SCREENSHOT_JS = `const { chromium } = require('playwright');

const url = process.argv[2] || 'https://example.com';
const out = process.argv[3] || 'screenshot.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.screenshot({ path: out, fullPage: true });
  console.log(\`saved: \${out}\`);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});`;

const LIST_REPOS_PS1 = `param(
    [int]$Limit = 20
)

gh repo list --limit $Limit --json nameWithOwner,visibility,updatedAt`;

const CREATE_ISSUE_PS1 = `param(
    [Parameter(Mandatory)][string]$Repo,
    [Parameter(Mandatory)][string]$Title,
    [string]$Body = 'Issue automático desde skills.'
)

gh issue create --repo $Repo --title $Title --body $Body`;

const SCREENSHOT_PS1 = `param(
    [string]$Url = 'https://example.com',
    [string]$Out = 'screenshot.png'
)

node "$PSScriptRoot/../scripts/browser-screenshot.js" $Url $Out`;

const SKILLS_README = `# Skills

Estos scripts son capacidades ejecutables por PowerShell.

## Listar repos

\`\`\`powershell
pwsh skills/List-Repos.ps1
pwsh skills/List-Repos.ps1 -Limit 50
\`\`\`

## Crear issue

\`\`\`powershell
pwsh skills/Create-Issue.ps1 -Repo USUARIO/REPO -Title "Prueba" -Body "Mensaje automático"
\`\`\`

## Screenshot con navegador

\`\`\`powershell
pwsh skills/Screenshot.ps1 -Url https://github.com -Out github.png
\`\`\`

## Control completo

\`\`\`powershell
pwsh scripts/Control-Repos.ps1
\`\`\``;

const GITIGNORE = `node_modules/
browser-test.png
screenshot.png
*.log`;

export const REPO_TREE: RepoNode[] = [
  {
    kind: "dir",
    name: ".github",
    children: [
      {
        kind: "dir",
        name: "workflows",
        children: [
          {
            kind: "file",
            name: "linux-pwsh-cli-browser.yml",
            path: ".github/workflows/linux-pwsh-cli-browser.yml",
            lang: "yaml",
            content: WORKFLOW_YML,
            blurb: "Job ubuntu-latest con shell pwsh: verifica herramientas, instala Chromium, autentica gh, ejecuta las skills y sube capturas.",
          },
        ],
      },
    ],
  },
  {
    kind: "dir",
    name: ".devcontainer",
    children: [
      {
        kind: "file",
        name: "devcontainer.json",
        path: ".devcontainer/devcontainer.json",
        lang: "json",
        content: DEVCONTAINER_JSON,
        blurb: "Imagen base Ubuntu + features oficiales: common-utils, github-cli, powershell y node 20 para Codespaces.",
      },
      {
        kind: "file",
        name: "setup.sh",
        path: ".devcontainer/setup.sh",
        lang: "bash",
        content: SETUP_SH,
        blurb: "postCreateCommand: instala Playwright global, dependencias del sistema y Chromium, y verifica pwsh, gh y node.",
      },
    ],
  },
  {
    kind: "dir",
    name: "scripts",
    children: [
      {
        kind: "file",
        name: "Control-Repos.ps1",
        path: "scripts/Control-Repos.ps1",
        lang: "powershell",
        content: CONTROL_REPOS_PS1,
        blurb: "Orquestador de 8 skills: auth, repo actual, listado, detalle, issues, PRs, navegador y creación opcional de issue.",
      },
      {
        kind: "file",
        name: "browser-screenshot.js",
        path: "scripts/browser-screenshot.js",
        lang: "javascript",
        content: BROWSER_SCREENSHOT_JS,
        blurb: "Lanza Chromium headless con Playwright y guarda una captura fullPage de la URL que recibe por argumentos.",
      },
    ],
  },
  {
    kind: "dir",
    name: "skills",
    children: [
      {
        kind: "file",
        name: "List-Repos.ps1",
        path: "skills/List-Repos.ps1",
        lang: "powershell",
        content: LIST_REPOS_PS1,
        blurb: "Lista hasta N repos accesibles por el token con nombre, visibilidad y última actualización.",
      },
      {
        kind: "file",
        name: "Create-Issue.ps1",
        path: "skills/Create-Issue.ps1",
        lang: "powershell",
        content: CREATE_ISSUE_PS1,
        blurb: "Crea un issue en cualquier repo que el token permita: -Repo, -Title y -Body.",
      },
      {
        kind: "file",
        name: "Screenshot.ps1",
        path: "skills/Screenshot.ps1",
        lang: "powershell",
        content: SCREENSHOT_PS1,
        blurb: "Envuelve el script de Playwright: -Url y -Out para capturar cualquier página.",
      },
      {
        kind: "file",
        name: "README.md",
        path: "skills/README.md",
        lang: "markdown",
        content: SKILLS_README,
        blurb: "Documentación de uso de cada skill con sus comandos exactos.",
      },
    ],
  },
  {
    kind: "file",
    name: ".gitignore",
    path: ".gitignore",
    lang: "gitignore",
    content: GITIGNORE,
    blurb: "Deja fuera node_modules y las capturas generadas: browser-test.png y screenshot.png.",
  },
];

function flatten(nodes: RepoNode[]): Extract<RepoNode, { kind: "file" }>[] {
  return nodes.flatMap((n) =>
    n.kind === "file" ? [n] : flatten(n.children)
  );
}

export const ALL_FILES = flatten(REPO_TREE);

/* ------------------------------------------------------------ */
/*  Bootstrap completo (un solo bloque, copiable)                */
/* ------------------------------------------------------------ */

export const BOOTSTRAP = `#!/usr/bin/env bash
# ============================================================
#  BE.PILOT v1.0 — montaje oficial
#  Linux mínimo + PowerShell + GitHub CLI + Chromium headless
#  collab: NOICORE LAB × BELENTANI
# ============================================================
set -euo pipefail

mkdir -p .github/workflows .devcontainer scripts skills

# ---------------------------------------------------------
# Workflow de GitHub Actions
# ---------------------------------------------------------
cat > .github/workflows/linux-pwsh-cli-browser.yml <<'WORKFLOW_EOF'
name: linux-pwsh-cli-browser

on:
  workflow_dispatch:
  push:
    branches:
      - main
      - master
  schedule:
    - cron: "0 6 * * *"

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  control:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Verificar PowerShell, GitHub CLI, Git y Node
        shell: pwsh
        run: |
          $PSVersionTable
          gh --version
          git --version
          node --version
          npm --version

      - name: Instalar Playwright y Chromium headless
        shell: bash
        run: |
          set -euo pipefail
          npm install --no-save playwright
          npx playwright install --with-deps chromium
          npx playwright --version

      - name: Probar navegador
        shell: bash
        run: |
          set -euo pipefail
          node scripts/browser-screenshot.js https://example.com browser-test.png

      - name: Autenticar GitHub CLI
        shell: pwsh
        env:
          GH_TOKEN: \${{ secrets.GH_TOKEN || github.token }}
        run: |
          gh auth status

      - name: Ejecutar skills de control de repos
        shell: pwsh
        env:
          GH_TOKEN: \${{ secrets.GH_TOKEN || github.token }}
          CREATE_ISSUE: 'false'
        run: |
          pwsh -File ./scripts/Control-Repos.ps1

      - name: Subir evidencias del navegador
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: browser-artifacts
          path: |
            browser-test.png
            screenshot.png
          if-no-files-found: ignore
WORKFLOW_EOF

# ---------------------------------------------------------
# Dev Container para GitHub Codespaces
# ---------------------------------------------------------
cat > .devcontainer/devcontainer.json <<'DEVCONTAINER_EOF'
{
  "name": "linux-pwsh-gh-browser",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/powershell:1": {},
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "postCreateCommand": "bash .devcontainer/setup.sh",
  "remoteUser": "vscode",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.powershell",
        "github.vscode-github-actions",
        "ms-playwright.playwright"
      ]
    }
  }
}
DEVCONTAINER_EOF

cat > .devcontainer/setup.sh <<'SETUP_EOF'
#!/usr/bin/env bash
set -eux

sudo apt-get update

# Si por alguna razón no hay Node, instalar una versión básica.
if ! command -v npm >/dev/null 2>&1; then
  sudo apt-get install -y nodejs npm
fi

# Playwright global + dependencias del sistema + Chromium.
sudo npm install -g playwright
sudo env "PATH=$PATH" npx playwright install-deps chromium
npx playwright install chromium

# Verificación mínima.
pwsh -NoLogo -NoProfile -Command '$PSVersionTable'
gh --version || true
node --version
npm --version
SETUP_EOF

# ---------------------------------------------------------
# Script principal de skills
# ---------------------------------------------------------
cat > scripts/Control-Repos.ps1 <<'CONTROL_EOF'
$ErrorActionPreference = 'Continue'

function Write-Skill {
    param([string]$Name)
    Write-Host ""
    Write-Host "=== $Name ===" -ForegroundColor Cyan
}

Write-Skill "Skill 1: autenticación GitHub CLI"
gh auth status
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI no está autenticado. Revisa GH_TOKEN o GITHUB_TOKEN."
}

Write-Skill "Skill 2: repo actual"
$repoJson = gh repo view --json nameWithOwner,defaultBranchRef
if ($LASTEXITCODE -ne 0) {
    throw "No se pudo obtener el repo actual."
}

$repoInfo = $repoJson | ConvertFrom-Json
$repo = $repoInfo.nameWithOwner
$branch = $repoInfo.defaultBranchRef.name

Write-Host "Repo actual: $repo"
Write-Host "Rama por defecto: $branch"

Write-Skill "Skill 3: repos accesibles"
gh repo list --limit 10 --json nameWithOwner,visibility,updatedAt
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudieron listar más repos. Puede faltar permiso al token."
}

Write-Skill "Skill 4: detalle del repo actual"
gh api "repos/$repo" --jq '.full_name + " | private=" + (.private | tostring) + " | branch=" + .default_branch'
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudo obtener detalle del repo actual."
}

Write-Skill "Skill 5: issues abiertos"
gh issue list --repo $repo --state open --limit 5 --json number,title,state
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudieron listar issues. Puede que el repo no tenga issues activos."
}

Write-Skill "Skill 6: pull requests abiertos"
gh pr list --repo $repo --state open --limit 5 --json number,title,state
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No se pudieron listar pull requests."
}

Write-Skill "Skill 7: navegador headless"
node "$PSScriptRoot/browser-screenshot.js" https://example.com screenshot.png
if ($LASTEXITCODE -ne 0) {
    throw "El navegador headless falló. Revisa Playwright."
}
Write-Host "Screenshot guardado en screenshot.png"

if ($env:CREATE_ISSUE -eq 'true') {
    Write-Skill "Skill 8: crear issue de control"
    gh issue create --repo $repo --title "Control automático" --body "Ejecutado desde GitHub Actions con PowerShell."
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo crear el issue."
    }
}

Write-Skill "Fin"
Write-Host "Skills ejecutadas correctamente."
CONTROL_EOF

# ---------------------------------------------------------
# Script Node para navegador
# ---------------------------------------------------------
cat > scripts/browser-screenshot.js <<'BROWSER_EOF'
const { chromium } = require('playwright');

const url = process.argv[2] || 'https://example.com';
const out = process.argv[3] || 'screenshot.png';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.screenshot({ path: out, fullPage: true });
  console.log(\`saved: \${out}\`);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
BROWSER_EOF

# ---------------------------------------------------------
# Skills individuales
# ---------------------------------------------------------
cat > skills/List-Repos.ps1 <<'SKILL_LIST_EOF'
param(
    [int]$Limit = 20
)

gh repo list --limit $Limit --json nameWithOwner,visibility,updatedAt
SKILL_LIST_EOF

cat > skills/Create-Issue.ps1 <<'SKILL_ISSUE_EOF'
param(
    [Parameter(Mandatory)][string]$Repo,
    [Parameter(Mandatory)][string]$Title,
    [string]$Body = 'Issue automático desde skills.'
)

gh issue create --repo $Repo --title $Title --body $Body
SKILL_ISSUE_EOF

cat > skills/Screenshot.ps1 <<'SKILL_SHOT_EOF'
param(
    [string]$Url = 'https://example.com',
    [string]$Out = 'screenshot.png'
)

node "$PSScriptRoot/../scripts/browser-screenshot.js" $Url $Out
SKILL_SHOT_EOF

cat > skills/README.md <<'SKILL_README_EOF'
# Skills

Estos scripts son capacidades ejecutables por PowerShell.

## Listar repos

\`\`\`powershell
pwsh skills/List-Repos.ps1
pwsh skills/List-Repos.ps1 -Limit 50
\`\`\`

## Crear issue

\`\`\`powershell
pwsh skills/Create-Issue.ps1 -Repo USUARIO/REPO -Title "Prueba" -Body "Mensaje automático"
\`\`\`

## Screenshot con navegador

\`\`\`powershell
pwsh skills/Screenshot.ps1 -Url https://github.com -Out github.png
\`\`\`

## Control completo

\`\`\`powershell
pwsh scripts/Control-Repos.ps1
\`\`\`
SKILL_README_EOF

# ---------------------------------------------------------
# .gitignore
# ---------------------------------------------------------
cat > .gitignore <<'GIT_EOF'
node_modules/
browser-test.png
screenshot.png
*.log
GIT_EOF

chmod +x .devcontainer/setup.sh || true

# ---------------------------------------------------------
# Git commit + push
# ---------------------------------------------------------
if [ ! -d .git ]; then
  git init
fi

git config user.name  >/dev/null 2>&1 || git config user.name "automation"
git config user.email >/dev/null 2>&1 || git config user.email "automation@example.com"

git add .
git commit -m "Add Linux pwsh GitHub CLI browser control environment" || echo "No changes to commit"

BRANCH="$(git branch --show-current)"

if git remote get-url origin >/dev/null 2>&1; then
  git push -u origin "$BRANCH"
else
  echo ""
  echo "No hay remote 'origin'."
  echo "Añádelo con:"
  echo "  git remote add origin git@github.com:USUARIO/REPO.git"
  echo "Luego ejecuta:"
  echo "  git push -u origin $BRANCH"
fi`;

/* ------------------------------------------------------------ */
/*  Secuencia de arranque (terminal de la apertura)              */
/* ------------------------------------------------------------ */

export type TermKind = "cmd" | "ok" | "out" | "dim" | "info";
export interface TermLine {
  t: TermKind;
  text: string;
}

export const BOOT_LINES: TermLine[] = [
  { t: "info", text: "▚▚ BE.PILOT v1.0 — PILOT CONSOLE ▚▚" },
  { t: "dim", text: "collab: NOICORE LAB × BELENTANI · runner: ubuntu-latest" },
  { t: "dim", text: "módulos: pwsh 7.4 · gh 2.44 · node 20 · chromium headless" },
  { t: "cmd", text: "bash bootstrap.sh" },
  { t: "out", text: "mkdir -p .github/workflows .devcontainer scripts skills" },
  { t: "ok", text: ".github/workflows/linux-pwsh-cli-browser.yml" },
  { t: "ok", text: ".devcontainer/devcontainer.json" },
  { t: "ok", text: ".devcontainer/setup.sh" },
  { t: "ok", text: "scripts/Control-Repos.ps1" },
  { t: "ok", text: "scripts/browser-screenshot.js" },
  { t: "ok", text: "skills/List-Repos.ps1" },
  { t: "ok", text: "skills/Create-Issue.ps1" },
  { t: "ok", text: "skills/Screenshot.ps1" },
  { t: "ok", text: "skills/README.md" },
  { t: "ok", text: ".gitignore" },
  { t: "cmd", text: "git add . && git commit -m \"Add Linux pwsh GitHub CLI browser control environment\"" },
  { t: "out", text: "[main 4f2a9c1] Add Linux pwsh GitHub CLI browser control environment" },
  { t: "out", text: " 10 files changed, 318 insertions(+)" },
  { t: "cmd", text: "git push -u origin main" },
  { t: "out", text: "To github.com:USUARIO/control-linux.git" },
  { t: "out", text: " * [new branch]  main -> main" },
  { t: "ok", text: "bootstrap completado — 10 archivos listos" },
  { t: "info", text: "siguiente: gh workflow run linux-pwsh-cli-browser.yml" },
];

/* ------------------------------------------------------------ */
/*  Guía paso a paso                                             */
/* ------------------------------------------------------------ */

export interface Step {
  id: string;
  num: string;
  title: string;
  lead: string;
  body?: string[];
  code?: { filename: string; lang: string; code: string; tall?: boolean };
  bullets?: string[];
  warn?: { title: string; text: string };
}

export const STEPS: Step[] = [
  {
    id: "crear-repo",
    num: "01",
    title: "Crear el repo desde GitHub CLI",
    lead: "Si todavía no tienes el repo, créalo privado y clonado en un solo movimiento. Si ya existe, entra en él y salta este paso.",
    code: {
      filename: "terminal — bash",
      lang: "bash",
      code: `gh auth login
gh repo create control-linux --private --clone
cd control-linux`,
    },
  },
  {
    id: "bootstrap",
    num: "02",
    title: "El comando bootstrap completo",
    lead: "Pega todo este bloque en una terminal Linux, WSL, GitHub Codespaces o Cloud Shell, dentro del repo. Crea la estructura, escribe los 10 archivos, hace commit y push.",
    code: {
      filename: "bootstrap.sh — bash",
      lang: "bash",
      code: BOOTSTRAP,
      tall: true,
    },
  },
  {
    id: "workflow",
    num: "03",
    title: "Ejecutar el workflow en GitHub Actions",
    lead: "Con el código ya en tu rama principal, dispara el workflow desde la CLI o desde la pestaña Actions → linux-pwsh-cli-browser → Run workflow.",
    code: {
      filename: "terminal — bash",
      lang: "bash",
      code: `gh workflow run linux-pwsh-cli-browser.yml
gh run watch`,
    },
    bullets: [
      "Usa ubuntu-latest con pwsh como shell principal.",
      "Verifica PowerShell, GitHub CLI, Git, Node y npm.",
      "Instala Playwright y Chromium headless con dependencias.",
      "Hace una captura de navegador y autentica gh.",
      "Ejecuta las skills de control de repos.",
      "Sube browser-test.png y screenshot.png como artefactos.",
    ],
  },
  {
    id: "codespaces",
    num: "04",
    title: "Abrir el entorno interactivo en Codespaces",
    lead: "Con .devcontainer/devcontainer.json ya subido, crea el codespace desde GitHub web (Code → Codespaces → Create codespace on main) o con la CLI. Cuando termine, simplemente entra en PowerShell.",
    code: {
      filename: "codespace — bash + pwsh",
      lang: "bash",
      code: `gh codespace create --repo USUARIO/control-linux

# cuando el codespace esté listo:
pwsh

# dentro de PowerShell:
pwsh ./scripts/Control-Repos.ps1
pwsh ./skills/List-Repos.ps1
pwsh ./skills/Screenshot.ps1 -Url https://github.com -Out github.png`,
    },
  },
  {
    id: "token",
    num: "05",
    title: "Token para controlar más repos",
    lead: "El token automático de Actions solo vale, en general, para el repo actual. El workflow usa un fallback inteligente: si existe el secreto GH_TOKEN lo usa; si no, usa el token del workflow.",
    code: {
      filename: "secreto — bash",
      lang: "bash",
      code: `gh secret set GH_TOKEN            # para Actions
gh secret set GH_TOKEN --app codespaces   # para Codespaces`,
    },
    bullets: [
      "Recomendado: fine-grained personal access token limitado a los repos necesarios.",
      "Contents: Read and write.",
      "Issues: Read and write.",
      "Pull requests: Read and write.",
      "Metadata: Read-only.",
    ],
    warn: {
      title: "Nunca en el código",
      text: "No metas el token dentro de archivos del repo. Los tokens van siempre como secretos: GH_TOKEN en el workflow, nunca una cadena en claro.",
    },
  },
  {
    id: "create-issue",
    num: "06",
    title: "Activar la creación automática de issues",
    lead: "El workflow trae CREATE_ISSUE apagado por defecto. Cambia una sola línea para que cada ejecución abra un issue de control en el repo.",
    code: {
      filename: ".github/workflows/linux-pwsh-cli-browser.yml",
      lang: "yaml",
      code: `# apagado (por defecto)
CREATE_ISSUE: 'false'

# para encenderlo
CREATE_ISSUE: 'true'`,
    },
    body: [
      "Con 'true', la Skill 8 de Control-Repos.ps1 ejecuta gh issue create con el título «Control automático» y el cuerpo «Ejecutado desde GitHub Actions con PowerShell.»",
    ],
  },
  {
    id: "mas-skills",
    num: "07",
    title: "Añadir más skills",
    lead: "Cada skill es un script PowerShell en skills/. Por ejemplo, una skill para listar ramas de cualquier repo:",
    code: {
      filename: "skills/Branches.ps1 — powershell",
      lang: "powershell",
      code: `cat > skills/Branches.ps1 <<'EOF'
param(
    [Parameter(Mandatory)][string]$Repo
)

gh api "repos/$Repo/branches" --paginate --jq '.[].name'
EOF`,
    },
    body: ["Y se ejecuta igual en Actions, en Codespaces o en local:"],
    bullets: ["pwsh skills/Branches.ps1 -Repo USUARIO/REPO"],
  },
  {
    id: "limitacion",
    num: "08",
    title: "La limitación que debes tener clara",
    lead: "Si buscas una «máquina de GitHub siempre encendida», Actions no sirve directamente: los runners son efímeros y se destruyen al terminar el job. Para control continuo hay tres opciones reales.",
    bullets: [
      "GitHub Actions con schedule — ejecuta tareas periódicamente, como el cron diario a las 06:00 que ya incluye el workflow.",
      "GitHub Codespaces — terminal interactiva real, pero se detiene por inactividad.",
      "Runner self-hosted — instalas un runner en tu máquina o servidor para disponibilidad continua.",
    ],
    body: [
      "Si el objetivo es «controlar repos desde la propia repo», la mejor base es exactamente esta: un repo central con workflows, scripts, skills y secrets, y desde ahí automatizar con gh, pwsh, node y Playwright.",
    ],
  },
];

/* ------------------------------------------------------------ */
/*  Simulador de skills                                          */
/* ------------------------------------------------------------ */

export interface SkillSim {
  id: string;
  name: string;
  file: string;
  cmd: string;
  blurb: string;
  lines: TermLine[];
  duration: string;
  preview?: "screenshot";
}

export const SKILL_SIMS: SkillSim[] = [
  {
    id: "list",
    name: "List-Repos",
    file: "skills/List-Repos.ps1",
    cmd: "pwsh skills/List-Repos.ps1 -Limit 4",
    blurb: "Lista los repos accesibles por el token con visibilidad y última actualización.",
    duration: "1.2s",
    lines: [
      { t: "cmd", text: "pwsh skills/List-Repos.ps1 -Limit 4" },
      { t: "dim", text: "→ gh repo list --limit 4 --json nameWithOwner,visibility,updatedAt" },
      { t: "out", text: "USUARIO/control-linux        private  2026-02-11T06:00:12Z" },
      { t: "out", text: "USUARIO/api-facturas         private  2026-02-09T18:22:47Z" },
      { t: "out", text: "USUARIO/web-landing          public   2026-02-08T09:15:03Z" },
      { t: "out", text: "USUARIO/dotfiles             public   2026-01-30T11:40:55Z" },
      { t: "ok", text: "4 repos devueltos · token con acceso correcto" },
    ],
  },
  {
    id: "issue",
    name: "Create-Issue",
    file: "skills/Create-Issue.ps1",
    cmd: "pwsh skills/Create-Issue.ps1 -Repo USUARIO/control-linux -Title \"Control nocturno\"",
    blurb: "Crea un issue en el repo indicado. Requiere Issues: Read and write en el token.",
    duration: "0.9s",
    lines: [
      { t: "cmd", text: "pwsh skills/Create-Issue.ps1 -Repo USUARIO/control-linux -Title \"Control nocturno\"" },
      { t: "dim", text: "→ gh issue create --repo USUARIO/control-linux --title \"Control nocturno\"" },
      { t: "out", text: "Creating issue in USUARIO/control-linux" },
      { t: "ok", text: "https://github.com/USUARIO/control-linux/issues/42" },
    ],
  },
  {
    id: "shot",
    name: "Screenshot",
    file: "skills/Screenshot.ps1",
    cmd: "pwsh skills/Screenshot.ps1 -Url https://github.com -Out github.png",
    blurb: "Chromium headless + Playwright: captura fullPage de cualquier URL.",
    duration: "3.4s",
    preview: "screenshot",
    lines: [
      { t: "cmd", text: "pwsh skills/Screenshot.ps1 -Url https://github.com -Out github.png" },
      { t: "dim", text: "→ node scripts/browser-screenshot.js https://github.com github.png" },
      { t: "out", text: "[chromium] launching headless…" },
      { t: "out", text: "goto https://github.com · waitUntil: load" },
      { t: "ok", text: "saved: github.png (fullPage)" },
    ],
  },
  {
    id: "control",
    name: "Control completo",
    file: "scripts/Control-Repos.ps1",
    cmd: "pwsh scripts/Control-Repos.ps1",
    blurb: "Las 8 skills encadenadas: auth, repo, listado, detalle, issues, PRs, navegador e issue opcional.",
    duration: "6.1s",
    lines: [
      { t: "cmd", text: "pwsh scripts/Control-Repos.ps1" },
      { t: "info", text: "=== Skill 1: autenticación GitHub CLI ===" },
      { t: "ok", text: "Logged in to github.com as USUARIO" },
      { t: "info", text: "=== Skill 2: repo actual ===" },
      { t: "out", text: "Repo actual: USUARIO/control-linux · rama: main" },
      { t: "info", text: "=== Skill 3: repos accesibles ===" },
      { t: "out", text: "10 repos · 2 privados · 8 públicos" },
      { t: "info", text: "=== Skill 5: issues abiertos ===" },
      { t: "out", text: "#41 Renovar fine-grained token · #38 Revisar cron diario" },
      { t: "info", text: "=== Skill 6: pull requests abiertos ===" },
      { t: "out", text: "#36 Añadir skill Branches.ps1" },
      { t: "info", text: "=== Skill 7: navegador headless ===" },
      { t: "ok", text: "Screenshot guardado en screenshot.png" },
      { t: "info", text: "=== Fin ===" },
      { t: "ok", text: "Skills ejecutadas correctamente. · exit 0" },
    ],
  },
];

/* ------------------------------------------------------------ */
/*  Escenarios de ejecución                                      */
/* ------------------------------------------------------------ */

export interface Scenario {
  id: string;
  title: string;
  tag: string;
  claim: string;
  pros: string[];
  cons: string[];
  code: string;
  color: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "actions",
    title: "GitHub Actions",
    tag: "tareas + schedule",
    claim:
      "Máquinas efímeras perfectas para ejecutar tareas: dispara el workflow a mano, con cada push o con el cron diario a las 06:00 UTC que ya viene incluido.",
    pros: [
      "Cero infraestructura que mantener",
      "Disparo manual, por push o por cron",
      "Artefactos con las capturas del navegador",
      "GH_TOKEN automático con fallback a tu secreto",
    ],
    cons: ["No sirve como terminal permanente", "El runner se destruye al terminar el job"],
    code: `gh workflow run linux-pwsh-cli-browser.yml
gh run watch`,
    color: "#ff2e4d",
  },
  {
    id: "codespaces",
    title: "GitHub Codespaces",
    tag: "terminal interactiva",
    claim:
      "El devcontainer ya incluye PowerShell, GitHub CLI y Node 20 vía features oficiales. Creas el codespace, escribes pwsh y tienes la cabina de control en el navegador.",
    pros: [
      "Terminal interactiva real con pwsh",
      "devcontainer.json + features oficiales",
      "Playwright y Chromium instalados en el postCreate",
      "Mismas skills que en Actions",
    ],
    cons: ["Se detiene por inactividad", "Consume horas de cuota"],
    code: `gh codespace create --repo USUARIO/control-linux
pwsh
pwsh ./scripts/Control-Repos.ps1`,
    color: "#ff93a6",
  },
  {
    id: "selfhosted",
    title: "Runner self-hosted",
    tag: "24/7 real",
    claim:
      "Si de verdad necesitas una máquina siempre encendida, instala un runner propio y etiqueta el job. Es la única vía para control continuo sin interrupciones.",
    pros: [
      "Disponibilidad continua real",
      "Navegador y herramientas ya instaladas",
      "Control total del hardware y la red",
    ],
    cons: ["Mantienes la máquina tú", "Seguridad: no expongas el runner a repos públicos"],
    code: `# en tu máquina
./config.sh --url https://github.com/USUARIO/control-linux

# en el workflow
runs-on: [self-hosted, linux]`,
    color: "#ffb454",
  },
];

/* ------------------------------------------------------------ */
/*  Avisos                                                       */
/* ------------------------------------------------------------ */

export const WARNINGS = [
  {
    icon: "clock" as const,
    title: "GitHub Actions no es una máquina siempre encendida",
    text: "Los runners son efímeros: sirven para ejecutar tareas, no para dejar una terminal abierta permanentemente. Para periodicidad usa schedule; para interactividad, Codespaces.",
  },
  {
    icon: "key" as const,
    title: "Los tokens van como secretos, nunca en el código",
    text: "El workflow usa GH_TOKEN: ${{ secrets.GH_TOKEN || github.token }} — si existe el secreto lo usa; si no, el token automático. No hay ningún token escrito en los archivos del repo.",
  },
  {
    icon: "scope" as const,
    title: "El token automático solo alcanza el repo actual",
    text: "Para controlar otros repos privados necesitas un fine-grained PAT con Contents, Issues y Pull requests en Read and write, y Metadata en Read-only, solo sobre los repos necesarios.",
  },
];

/* ------------------------------------------------------------ */
/*  Fuentes oficiales                                            */
/* ------------------------------------------------------------ */

export const SOURCES = [
  {
    label: "Workflow syntax for GitHub Actions",
    url: "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions",
    domain: "docs.github.com",
  },
  {
    label: "About GitHub-hosted runners",
    url: "https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners",
    domain: "docs.github.com",
  },
  {
    label: "Automatic token authentication",
    url: "https://docs.github.com/en/actions/security-guides/automatic-token-authentication",
    domain: "docs.github.com",
  },
  {
    label: "Introduction to dev containers",
    url: "https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers",
    domain: "docs.github.com",
  },
  {
    label: "Dev Container Features",
    url: "https://containers.dev/implementors/features/",
    domain: "containers.dev",
  },
  {
    label: "Installing PowerShell on Linux",
    url: "https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux",
    domain: "learn.microsoft.com",
  },
  {
    label: "GitHub CLI manual",
    url: "https://cli.github.com/manual/",
    domain: "cli.github.com",
  },
  {
    label: "Playwright browsers",
    url: "https://playwright.dev/docs/browsers",
    domain: "playwright.dev",
  },
];

/* ------------------------------------------------------------ */
/*  Datos de apoyo de la interfaz                                */
/* ------------------------------------------------------------ */

export const PIPELINE = [
  { title: "Checkout", shell: "actions/checkout@v4", color: "#ff93a6" },
  { title: "Setup Node 20", shell: "actions/setup-node@v4", color: "#ffb454" },
  { title: "Verificar pwsh · gh", shell: "shell: pwsh", color: "#ff2e4d" },
  { title: "Playwright + Chromium", shell: "shell: bash", color: "#ff6b3d" },
  { title: "Probar navegador", shell: "browser-test.png", color: "#ffb454" },
  { title: "Autenticar gh", shell: "GH_TOKEN", color: "#ff2e4d" },
  { title: "Skills de control", shell: "Control-Repos.ps1", color: "#ff93a6" },
  { title: "Artefactos", shell: "upload-artifact@v4", color: "#45d483" },
];

export const STACK_CHIPS = [
  { label: "ubuntu container", color: "#ff6b3d" },
  { label: "pwsh 7", color: "#ff93a6" },
  { label: "gh cli", color: "#ff2e4d" },
  { label: "playwright", color: "#ffb454" },
  { label: "github actions", color: "#ff2e4d" },
  { label: "codespaces", color: "#45d483" },
];

export const TICKER_ITEMS = [
  "BE.Pilot online",
  "noicore lab × belentani",
  "pwsh 7.4 verificado",
  "gh auth status: ok",
  "chromium headless listo",
  "browser-test.png guardado",
  "skills ejecutadas correctamente",
  "secrets: GH_TOKEN",
  "runs-on: ubuntu-latest",
  "exit 0",
];

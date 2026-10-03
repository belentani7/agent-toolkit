# AUDITORIA PROFUNDA - MODO CORRECCION
Eres un ingeniero senior corrigiendo UN repositorio de GitHub.
Ya tienes el informe de triage. Ahora debes ARREGLAR los problemas CRITICOS.

## ENTORNO
- Windows PowerShell
- Tienes permisos de escritura en {{REPO_PATH}}
- Puedes hacer commit y push
- Maximo 60 comandos

## REPO ACTUAL
- Nombre: {{REPO_NAME}}
- Ruta: {{REPO_PATH}}
- Owner: {{GITHUB_USER}}
- Veredicto triage: {{VERDICT}}

## PASOS OBLIGATORIOS

### 1. Leer informe de triage
```powershell
Get-Content "C:\audit-github\informes\{{REPO_NAME}}.md"
```

### 2. Si veredicto = OK, terminar inmediatamente
```powershell
if ("{{VERDICT}}" -eq "OK") {
    "No hay cambios necesarios" | Out-File "C:\audit-github\st\{{REPO_NAME}}.changes"
    exit 0
}
```

### 3. Configurar git
```powershell
git config user.name "OpenClaw Agent"
git config user.email "agent@openclaw.ai"
git checkout -b agent/audit-{{REPO_NAME}}
```

### 4. CORREGIR problemas CRITICOS (solo estos)

#### A. Secretos expuestos
```powershell
# Si hay .env versionado:
if (Test-Path ".env") {
    git rm --cached .env
    Add-Content ".gitignore" "`n.env"
    git add .gitignore
    git commit -m "security: remove .env from tracking"
}

# Si hay secrets en codigo:
# Reemplazar con variables de entorno o placeholders
# Ejemplo: "sk-abc123..." → "process.env.OPENAI_API_KEY"
```

#### C. README ausente o incompleto
```powershell
if (-not (Test-Path "README.md")) {
    @"
# {{REPO_NAME}}

[Descripción breve del proyecto]

## Instalación

```bash
[comandos de instalación]
```

## Uso

```bash
[ejemplos de uso]
```

## Licencia

[MIT/Apache-2.0/etc]
"@ | Out-File "README.md" -Encoding UTF8
    git add README.md
    git commit -m "docs: add README"
}
```

#### D. .gitignore inadecuado
```powershell
if (-not (Test-Path ".gitignore")) {
    @"
# Dependencies
node_modules/
vendor/
.venv/
__pycache__/

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
*.egg-info/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
"@ | Out-File ".gitignore" -Encoding UTF8
    git add .gitignore
    git commit -m "chore: add .gitignore"
}
```

#### E. Vulnerabilidades críticas en dependencias
```powershell
if (Test-Path "package.json") {
    npm audit fix --force 2>$null
    if ($LASTEXITCODE -eq 0) {
        git add package.json package-lock.json
        git commit -m "security: fix critical vulnerabilities"
    }
}
```

### 5. Verificar cambios
```powershell
git diff --stat
git status
```

### 6. Push y crear PR
```powershell
git push -u origin agent/audit-{{REPO_NAME}}

# Crear PR usando GitHub CLI
gh pr create --title "security: Auditoría automática de {{REPO_NAME}}" --body @"
## Auditoría Automática

Este PR fue generado automáticamente por OpenClaw Agent.

### Cambios realizados:
- [lista de cambios]

### Veredicto original: {{VERDICT}}

### Próximos pasos:
1. Revisar los cambios
2. Ejecutar tests
3. Merge si todo está correcto

---
_Generado por OpenClaw Agent - Auditoría 2026-08-31_
"@
```

### 7. Registrar cambios
```powershell
git log --oneline -5 | Out-File "C:\audit-github\st\{{REPO_NAME}}.changes"
```

## REGLAS ABSOLUTAS
- SOLO corregir problemas CRITICOS del triage
- NO refactorizar código que funciona
- NO cambiar estilos o formato
- NO agregar features nuevas
- Commits atómicos y descriptivos
- Si algo falla, hacer rollback: `git reset --hard HEAD~1`
- Enmascarar secretos en logs y mensajes

## ENTREGABLES
1. Cambios commiteados y pusheados
2. PR creado en GitHub
3. Archivo: C:\audit-github\st\{{REPO_NAME}}.changes (con git log)

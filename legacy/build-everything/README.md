# BUILD-EVERYTHING — All Projects from Downloads

Suite "todo-en-uno" con 9 sub-proyectos extraídos de más de 40 archivos de chat
y documentos de la carpeta Downloads de Pedro Belentani.

> **Nota de estructura:** la carpeta duplicada `BUILD-EVERYTHING/` que existía
> dentro del proyecto se eliminó (contenido idéntico a la raíz). Los proyectos
> viven directamente en la raíz como `01-` … `09-`.

## Proyectos

| # | Proyecto | Tipo | Descripción | Estado |
|---|----------|------|-------------|--------|
| 01 | **Bootstrapper** | PowerShell | Scaffolder universal de proyectos. Crea la estructura, venv, agent y git en segundos. | ✅ mejorado |
| 02 | **OmniAgent CLI** | Python | Orquestador multi-agente. Enruta tareas a modelos IA gratuitos (Groq, Gemini, OpenRouter, NVIDIA, Cerebras, DeepSeek) con fallback y retries. | ✅ mejorado |
| 03 | **DUCK Web** | HTML/CSS/JS | Plataforma de producción musical. Discografía, estúdio tools, i18n PT/ES/EN. | ✅ rediseñado |
| 04 | **Bellacore** | HTML/CSS/JS | Plataforma de extracción de leads. Búsqueda, filtros reales, export CSV. | ✅ rediseñado |
| 05 | **Belentani Portal** | HTML/CSS/JS | AI hub con chat, tools, transcriptor, ecosistema y micrófono. | ✅ rediseñado |
| 06 | **Transcriptor** | Python | Transcripción de reels + OCR. yt-dlp + faster-whisper + Tesseract. Output JSON. | ✅ mejorado |
| 07 | **Cost Optimizer** | Python | Análisis de coste real por tarea (cache, tokens de razonamiento, retries). | ✅ mejorado |
| 08 | **AION Workforce** | SQL/Python | Gestión de turnos empresarial. Motor de compliance legal (ES/PT/FI/EU). | ✅ revisado |
| 09 | **Belentani Corp** | HTML/MD/SVG | Brand kit, landing premium, business card, invoice, press kit, templates. | ✅ landing mejorada |

## Requisitos

- **PowerShell 5.1+** (o 7+) para el Bootstrapper y scripts de setup.
- **Python 3.10+** para los proyectos 02, 06, 07, 08.
- **Node.js 20+** (opcional, si se usa el stack node del Bootstrapper).
- **Git** para el Bootstrapper (inicialización del repo).
- **ffmpeg** en el PATH para el Transcriptor (06).
- **Tesseract-OCR** para el OCR del Transcriptor (06).

## Estructura

```
build-everything/
├── 01-BOOTSTRAPPER/     New-Project.ps1
├── 02-OMNIAGENT/        omniagent.py, README.md, .env
├── 03-DUCK-WEB/         index.html
├── 04-BELLACORE/        index.html
├── 05-BELENTANI-PORTAL/ index.html
├── 06-TRANSCRIPTOR/     reel_analyzer.py, .env
├── 07-COST-OPTIMIZER/   cost_optimizer.py, .env
├── 08-AION-WORKFORCE/   agent.py, schema.sql, .env
├── 09-BELENTANI-CORP/   brand/, business/, landing/, press-kit/, templates/
├── .gitignore
└── README.md
```

Los archivos `.env` de los sub-proyectos **no se versionan** (ver `.gitignore`).
Ninguno contiene credenciales reales; copia el patrón y añade tus propias keys.

## Quick Start

### 01 · Bootstrapper
```powershell
cd 01-BOOTSTRAPPER
.\New-Project.ps1 -ProjectName "MiSaaS" -Stack fullstack
.\New-Project.ps1 -ProjectName "dataApp" -Stack python -NoGit -Force
```

### 02 · OmniAgent
```bash
cd 02-OMNIAGENT
python omniagent.py providers                    # estado de los proveedores
python omniagent.py chat "explain quantum computing"
python omniagent.py "prompt directo" --json      # salida JSON
python omniagent.py chat "analiza esto" --system "Eres un analista"
python omniagent.py                              # modo interactivo
```
Keys vía variables de entorno o el `.env` local (`GROQ_API_KEY`, `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`, etc.).

### 03 · DUCK Web
Abre `03-DUCK-WEB/index.html` en el navegador. Cambia idioma (PT/ES/EN) desde la cabecera.

### 04 · Bellacore
Abre `04-BELLACORE/index.html`. Busca, filtra y exporta CSV de leads de demostración.

### 05 · Belentani Portal
Abre `05-BELENTANI-PORTAL/index.html`. Chat con modos, micrófono, tools y ecosistema.

### 06 · Transcriptor
```bash
cd 06-TRANSCRIPTOR
pip install yt-dlp faster-whisper opencv-python pytesseract Pillow
python reel_analyzer.py "https://www.instagram.com/reel/..." --json
python reel_analyzer.py <url> --language en --model small --no-ocr
```

### 07 · Cost Optimizer
```bash
cd 07-COST-OPTIMIZER
python cost_optimizer.py                       # tabla completa
python cost_optimizer.py --task code           # recomendación por tarea
python cost_optimizer.py --json                # reporte JSON
python cost_optimizer.py --input-tokens 5000 --output-tokens 1000 --cache-rate 0.9
```

### 08 · AION Workforce
```bash
cd 08-AION-WORKFORCE
python agent.py                                # demo compliance (ES)
python agent.py --jurisdiction PT              # otra jurisdicción
python agent.py --start "2026-01-05 07:00" --end "2026-01-05 15:00" --json
psql -f schema.sql                             # crea el esquema PostgreSQL
```

### 09 · Belentani Corp
- Landing premium: abre `09-BELENTANI-CORP/landing/index.html`.
- Brand kit: `brand/` (tokens.css, BRAND-GUIDELINES.md, logos).
- Business: `business/` (business-card.html, contract/proposal templates).
- Press kit: `press-kit/PRESS-KIT.md`.
- Templates: `templates/` (emails, invoice.html, social-media).

## Verificación

- `.py`: validados con `py_compile`.
- `.html`: validación estructural + `node --check` sobre el JS inline.
- `.ps1`: validado con el parser de PowerShell (`[System.Management.Automation.Language.Parser]`).

## Source Files

Todo el contenido proviene de `C:\Users\USER\Downloads\`:
- 40+ exportaciones de chat (.txt), 20+ documentos (.docx)
- Proyectos en zip, audio (.mp3), exports HTML, scripts Python e historial JSON

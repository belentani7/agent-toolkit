# 🤖 Automations Workspace — belentani7

PC dedicado a automatizaciones. Estructura organizada para scripts, crons y configuración.

## 📂 Estructura

```
automations/
├── scripts/       # Scripts de automatización (Python, Node, PowerShell)
├── logs/          # Logs de ejecución
├── config/        # Archivos de configuración (.env, tokens, etc.)
├── crons/         # Tareas programadas y schedulers
├── backups/       # Backups automáticos
└── README.md      # Este archivo
```

## 🔧 Herramientas disponibles

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| Python | 3.11.9 | Scripts de automatización |
| Node.js | 24.15.0 | APIs, bots, scrapers |
| Git | 2.54.0 | Control de versiones |
| GitHub CLI | 2.98.0 | Gestión repos |
| PowerShell | 7.6.3 | Scripts de sistema |
| WSL | 2.6.3 | Linux subsystem |

## 🔐 Seguridad

- Credenciales en `config/` (añadido a .gitignore)
- SSH key: `~/.ssh/id_ed25519` (PC-Automatizaciones)
- Git Credential Manager activo
- GitHub auth via `gh` CLI

## 📋 Git aliases disponibles

```bash
git st        # status corto
git lg        # log bonito
git wip       # commit rápido WIP
git undo      # deshacer último commit
git sync      # fetch + pull
git amend     # modificar último commit
git cleanup   # eliminar branches merged
```

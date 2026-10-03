# Contribuciones Open Source — IA

10 contribuciones listas para enviar a proyectos open source de IA, generadas el
2026-08-31. Cada una incluye análisis, solución, código (patch), tests y
documentación, junto con mensaje de commit y descripción de PR.

## Distribución por tipo (según encargo)

| # | Tipo | Contribuciones |
|---|------|----------------|
| 3 | Traducciones al español de documentación | 001, 002, 003 |
| 3 | Fixes de bugs simples | 004, 005, 006 |
| 2 | Mejoras de documentación | 007, 008 |
| 2 | Ejemplos de uso nuevos | 009, 010 |

## Repos destino

| Repo | Commits base | Contribuciones |
|------|--------------|----------------|
| huggingface/transformers | `e2b3550` | 001, 002, 003, 005 |
| QwenLM/qwen-code | `3a0c4c6` | 004 |
| openai/codex | `d58d0e5` | 006, 008 |
| anthropics/claude-code | `f1af9b1` | 007, 009, 010 |

> Nota: ninguno de los cuatro repos tenía issues abiertos etiquetados
> literalmente `"good first issue"`. Se usaron las etiquetas equivalentes de
> bienvenida a PRs (`welcome-pr` en qwen-code) y los issues abiertos etiquetados
> `documentation`/de documentación de cada repo, que son la vía real de entrada
> para contribuciones de bajo riesgo. Todos los issues referenciados existen y
> estaban abiertos en la fecha de generación.

## Estructura

```
contributions/
├── apply_contributions.ps1        # Script de aplicación automática
├── manifest.json                  # Metadatos (repos, branches, dependencias, issues)
├── README.md                      # Este fichero
├── NNN.patch                      # Patch plano de cada contribución (1-10)
├── repos/                         # Clones de trabajo (los usa el script)
│   ├── qwen-code/
│   ├── transformers/
│   ├── codex/
│   └── claude-code/
└── NNN-<slug>/                    # Carpeta por contribución
    ├── patch.diff                 # El patch
    ├── ANALYSIS.md                # Análisis del problema + solución
    ├── COMMIT_MESSAGE.txt         # Mensaje de commit
    └── PR_DESCRIPTION.md          # Descripción del PR
```

## Las 10 contribuciones

### Traducciones (ES)
- **001** transformers — `grad_accumulation.md` → español
- **002** transformers — `cache_explanation.md` → español
- **003** transformers — `assisted_decoding.md` → español

Las tres registran su página en `docs/source/es/_toctree.yml`. Los diffs del
toctree son secuenciales: aplicar 001 → 002 → 003 (el script lo gestiona
mediante `dependsOn` en `manifest.json`).

### Fixes de bugs
- **004** qwen-code — `ask_user_question` devuelve el motivo real de
  cancelación del pipeline en vez de un falso "User declined…" (issue #9011).
- **005** transformers — `pipeline()` valida `device` **antes** de descargar
  los pesos del modelo (issue #47869).
- **006** codex — `readme_toc.py` gestiona correctamente fences de tilde y
  fences de backticks largos (issue #41077).

### Mejoras de documentación
- **007** claude-code — corrige la entrada obsoleta de `security-guidance` en
  `plugins/README.md` (PreToolUse→UserPromptSubmit/PostToolUse/Stop, 9→25
  patrones) (issue #89728).
- **008** codex — actualiza los ids de modelo obsoletos en el esquema del tool
  `codex` del MCP server (issue #40986).

### Ejemplos de uso
- **009** claude-code — ejemplo de settings que recupera tokens de contexto por
  request (`settings-context-cost.json`) + tabla/tips en el README (issue #90065).
- **010** claude-code — ejemplo de hook PostToolUse de auto-formato seguro con
  rutas con espacios y sin bloqueo (issue #88188).

## Cómo usar `apply_contributions.ps1`

```powershell
# Aplicar todas las contribuciones
.\apply_contributions.ps1 -ContributionsDir C:\Users\USER\.openclaw\workspace\projects\belentani-nexus\contributions

# Aplicar solo una
.\apply_contributions.ps1 -ContributionsDir <dir> -Only 004
```

Qué hace:
1. Clona cada repo en `repos/` si no existe.
2. Hace checkout del **commit base exacto** del `manifest.json`.
3. Crea el branch indicado para la contribución.
4. Aplica `patch.diff` con `git apply` (verificando primero con `--check`).
5. Conmuta con el mensaje de `COMMIT_MESSAGE.txt`.
6. Imprime los comandos exactos de `git push` + `gh pr create` (sin ejecutarlos).

**No hace push ni crea PRs automáticamente** (requisito del encargo). Las ramas
quedan locales y listas.

## Política de contribución (importante)

| Repo | Estado | Acción recomendada |
|------|--------|--------------------|
| huggingface/transformers | Acepta PRs | Enviar PR con normalidad |
| QwenLM/qwen-code | Acepta PRs (`welcome-pr`) | Enviar PR con normalidad |
| openai/codex | **No acepta PRs externos** (`docs/contributing.md`) | Pegar el patch en el hilo del issue |
| anthropics/claude-code | **Rechaza `CreatePullRequest` externos** (FORBIDDEN, issue #90065) | Pegar el patch en el hilo del issue |

Para los dos últimos, los ficheros `patch.diff` están listos para adjuntar o
pegar como comentario en el issue correspondiente.

## Verificación realizada

- Los 10 patches aplican limpiamente sobre sus commits base (`git apply --check`).
- El script `apply_contributions.ps1` se ejecutó de extremo a extremo y generó
  los 10 commits locales en sus branches (ver resumen del script).
- Tests de Python (`readme_toc`, validación de `device`) y la lógica de los
  hooks/ejemplos se revisaron sintácticamente.
- Los tests de TS/Python completos requieren el toolchain de cada repo
  (Node 22 / Rust / torch); se indican los comandos en cada `ANALYSIS.md`.

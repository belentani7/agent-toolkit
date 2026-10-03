# 007 — Docs: `plugins/README.md` describe el plugin security-guidance v1 obsoleto

- **Repo:** anthropics/claude-code
- **Tipo:** Mejora de documentación
- **Issue:** https://github.com/anthropics/claude-code/issues/89728
- **Base:** commit `f1af9b1f4b1fd4c776135381606edada82ef638e` (main)

## Análisis del problema

La tabla de `plugins/README.md` describe `security-guidance` como:
"**Hook:** PreToolUse - Monitors 9 security patterns…". Verificado en el código:

- `plugins/security-guidance/hooks/hooks.json` registra hooks
  **UserPromptSubmit, PostToolUse y Stop** (no existe ningún PreToolUse).
- `plugins/security-guidance/hooks/patterns.py` define `SECURITY_PATTERNS` con
  **25 reglas** (`ruleName`), no 9; la propia README del plugin dice "~25
  known-dangerous patterns".
- El plugin además hace revisión LLM de diffs (Stop) y revisión agéntica de
  commits (PostToolUse con matcher Bash).

## Solución propuesta

Actualizar la fila de `security-guidance` en la tabla de `plugins/README.md`:
- Hook → **Hooks:** UserPromptSubmit, PostToolUse, Stop.
- 9 patterns → **25 pattern rules**, con ejemplos fieles (command injection,
  XSS, eval, dangerous HTML, unsafe deserialization, os.system, hardcoded
  secrets).
- Mencionar las capas de revisión LLM de diffs y commits.

## Código de la contribución

`patch.diff`: 1 línea de la tabla en `plugins/README.md` (+1/−1).

## Tests

- Conteo verificado programáticamente: `(Select-String hooks/patterns.py '"ruleName":').Count` = 25.
- Coherencia con `plugins/security-guidance/README.md` ("~25 known-dangerous patterns").

## Documentación actualizada

Sí — este patch es la actualización de documentación.

## Aviso

anthropics/claude-code actualmente restringe PRs externos (`CreatePullRequest`
devuelve FORBIDDEN según el issue #90065). El paquete queda listo para
compartirse como comentario en el issue si persiste la restricción.

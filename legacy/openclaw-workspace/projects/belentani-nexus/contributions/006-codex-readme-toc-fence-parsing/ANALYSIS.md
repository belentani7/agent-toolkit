# 006 — Fix: `readme_toc.py` malinterpreta fences de tilde y fences largos

- **Repo:** openai/codex
- **Tipo:** Fix de bug simple
- **Issue:** https://github.com/openai/codex/issues/41077 (label `documentation`)
- **Base:** commit `d58d0e5841e0de08e251673db2d5af8cf3a1ad51` (main)

## Análisis del problema

El generador de ToC (`scripts/readme_toc.py`, usado en CI por
`.github/workflows/repo-checks.yml`) conmuta un booleano con
`line.strip().startswith("```")`. Consecuencias:

1. Los fences de tilde (`~~~`) no se detectan → los títulos dentro de ellos se
   tratan como títulos reales.
2. Una línea con ``` dentro de un fence más largo (````) lo cierra
   prematuramente.
3. Un opener de backticks cuyo info-string contiene un backtick (inválido según
   CommonMark) se trata como fence.

## Solución propuesta

Reescribir el tracking de fences en `generate_toc_lines()`:

- Recordar el carácter del fence (`` ` `` o `~`) y la longitud del opener.
- Un fence solo se cierra con una línea del **mismo carácter**, compuesta solo
  por ese carácter y de longitud ≥ la del opener.
- Openers de backticks con backtick en el info-string no abren fence.

## Código de la contribución

`patch.diff` modifica:
- `scripts/readme_toc.py` (tracking de fences correcto).
- `scripts/test_readme_toc_fences.py` (nuevo): 3 tests de regresión que
  reproducen exactamente los casos del issue.

## Tests

```
python scripts/test_readme_toc_fences.py   # → all readme_toc fence tests passed
python scripts/readme_toc.py README.md     # → no-op (README sin marcadores de ToC)
```

Verificado localmente sobre el repo (main, d58d0e5): los 3 tests pasan.

## Documentación actualizada

No requiere cambios.

## Aviso de política

openai/codex indica en `docs/contributing.md` que **no acepta PRs externos de
código**; el issue #41077 ya incluye un branch de referencia del propio autor.
Este paquete está preparado por si la política cambia o para compartir el fix
como referencia comentando en el issue.

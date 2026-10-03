# 009 — Ejemplo de uso: settings para reducir coste de contexto por request

- **Repo:** anthropics/claude-code
- **Tipo:** Ejemplo de uso nuevo — 1 de 2
- **Issue:** https://github.com/anthropics/claude-code/issues/90065
- **Base:** commit `f1af9b1f4b1fd4c776135381606edada82ef638e` (main)

## Análisis del problema

`examples/settings/` cubre postura de permisos y sandbox (lax, strict,
bash-sandbox). No hay nada que cubra un coste que paga cada request: los
esquemas de tools built-in cargados eagerly en el contexto. El issue #90065
mide (v2.1.247, opus): denegar `Workflow` recupera ~7.900 tokens de input;
denegar cinco tools opt-in recupera ~10.886 (−47%).

Nada en el README indica que `permissions.deny` sobre un built-in también saca
su esquema del contexto; un admin puede asumir que denegar solo bloquea la
llamada.

## Solución propuesta

Siguiendo la mejora sugerida en el issue:
1. Nuevo `examples/settings/settings-context-cost.json` — ejemplo mínimo que
   deniega `Workflow` (el built-in opt-in más grande del bloque de tools).
2. README: nueva columna en la tabla de comparación + fila "Remove unused tool
   schemas from request context".
3. README: bullet nuevo en **Tips** explicando que `permissions.deny` sobre un
   built-in también elimina su esquema del request context.

## Código de la contribución

`patch.diff`:
- `examples/settings/settings-context-cost.json` (nuevo, 7 líneas)
- `examples/settings/README.md` (tabla +1 columna/+1 fila, Tips +1 bullet)

## Tests

- El JSON es válido (verificado con parseo).
- El ejemplo usa exactamente la misma estructura que los tres ficheros
  existentes del directorio.

## Documentación actualizada

Sí — README de `examples/settings` actualizado.

## Aviso

Este repo restringe PRs externos actualmente (FORBIDDEN en CreatePullRequest,
según el issue); el autor del issue tiene el patch en un branch público y esta
versión alternativa queda lista por si la restricción cambia.

# 010 — Ejemplo de uso: hook PostToolUse de auto-formato seguro con espacios en rutas

- **Repo:** anthropics/claude-code
- **Tipo:** Ejemplo de uso nuevo — 2 de 2
- **Issue relacionado:** https://github.com/anthropics/claude-code/issues/88188
  (el ejemplo de auto-formato de la guía de hooks se rompe con rutas con espacios
  y sale con código 2 en ficheros no soportados)
- **Base:** commit `f1af9b1f4b1fd4c776135381606edada82ef638e` (main)

## Análisis del problema

El issue #88188 documenta que el ejemplo de auto-formato de la guía de hooks:
1. Construye el comando por concatenación de strings → se rompe con rutas que
   contienen espacios.
2. Sale con código 2 cuando el fichero no está soportado → bloquea la llamada
   a la tool y manda stderr a Claude como error de bloqueo.

`examples/hooks/` solo contiene `bash_command_validator_example.py` (PreToolUse);
no hay ningún ejemplo PostToolUse de formateo.

## Solución propuesta

Nuevo ejemplo `examples/hooks/auto_format_hook_example.py` (PostToolUse para
`Edit|Write|MultiEdit`) que corrige ambos modos de fallo:

1. **Rutas con espacios:** el comando se construye como lista argv y se ejecuta
   con `subprocess.run(cmd)` sin shell → sin quoting manual posible de romper.
2. **Ficheros no soportados:** cualquier fallo del formateador (o ausencia del
   formateador, o timeout) se reporta como `systemMessage` JSON con exit 0 →
   nunca bloquea la tool; Claude ve la nota sin error de bloqueo.

Incluye: fallback `black` → `ruff format`, filtro por extensión `.py`, timeout
de 60 s, y el bloque de configuración JSON del hook en el docstring (convención
del ejemplo existente).

## Código de la contribución

`patch.diff`: `examples/hooks/auto_format_hook_example.py` (nuevo, 108 líneas).

## Tests

- Sintaxis Python verificada (`ast.parse`).
- Lógica de selección de formateador y manejo de errores verificada por
  revisión; no se añaden dependencias (solo stdlib).

## Documentación actualizada

El propio ejemplo se autodocumenta (docstring con configuración), siguiendo el
patrón de `bash_command_validator_example.py`.

## Aviso

Este repo restringe PRs externos actualmente; el paquete queda listo para
compartir en el hilo del issue si se prefiere.

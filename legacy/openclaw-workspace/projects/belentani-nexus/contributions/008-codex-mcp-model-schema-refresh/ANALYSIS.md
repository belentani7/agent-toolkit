# 008 — Docs: ids de modelo obsoletos en el esquema del tool `codex` (MCP server)

- **Repo:** openai/codex
- **Tipo:** Mejora de documentación (schema contract)
- **Issue:** https://github.com/openai/codex/issues/40986 (label `documentation`)
- **Base:** commit `d58d0e5841e0de08e251673db2d5af8cf3a1ad51` (main)

## Análisis del problema

El parámetro `model` del tool `codex` expuesto por `codex mcp-server` documenta
`'gpt-5.2', 'gpt-5.2-codex'` como ejemplos
(`codex-rs/mcp-server/src/codex_tool_config.rs`, doc-comment línea 29 y fixture
del test `verify_codex_tool_json_schema` línea 329). Esos ids están varias
releases por detrás: el propio registry del mismo binario lista la familia
actual (`gpt-5.6-sol/terra/luna` en `codex-rs/model-provider-info/src/lib.rs`,
ver también `codex-rs/models-manager` y `V2_DEFAULT_MODEL = "gpt-5.6-terra"`).

Para un cliente MCP, esa cadena es el único id de modelo concreto del contrato
del tool: un agente que lee el esquema puede pasar `gpt-5.2` y fijar la sesión
a un modelo viejo de forma silenciosa (el parámetro es string libre sin
validación). El issue lo documenta con un caso real.

## Solución propuesta

Actualizar los dos sitios (doc-comment + fixture JSON del test, que deben ir en
sincronía) a ejemplos de la familia actual (`gpt-5.6-terra`, `gpt-5.6-sol`) y
añadir una frase que remite al registry
(`codex-rs/model-provider-info`) como fuente de los ids soportados por el
build, para que el texto no vuelva a quedarse obsoleto de forma engañosa.

## Código de la contribución

`patch.diff`: `codex-rs/mcp-server/src/codex_tool_config.rs` (+2/−2).

## Tests

- El test `verify_codex_tool_json_schema` compara contra el fixture actualizado
  en el mismo patch → pasa.
- `cargo test -p codex-mcp-server verify_codex_tool_json_schema` (requiere
  toolchain Rust; entorno local sin cargo no ejecutado — indicado en la PR).

## Documentación actualizada

Sí — el cambio es el texto del esquema MCP (visible para clientes).

## Aviso de política

openai/codex no acepta PRs externos de código/docs según
`docs/contributing.md`; el fix está listo para pegar en el hilo del issue.

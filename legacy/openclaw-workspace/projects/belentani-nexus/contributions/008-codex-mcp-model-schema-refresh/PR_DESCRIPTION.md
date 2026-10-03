# PR: docs(mcp-server): refresh stale model ids in the codex tool schema

References #40986

## Problem

The `model` parameter of the `codex` MCP tool documents
`'gpt-5.2', 'gpt-5.2-codex'` as examples. For MCP clients that string is the
only concrete model id in the tool contract — a client agent can pass it and
silently pin a session to a model several releases old (the parameter is a
free-form string with no validation).

## Fix

- Doc comment and the `verify_codex_tool_json_schema` fixture (kept in sync)
  now use current example ids (`gpt-5.6-terra`, `gpt-5.6-sol`).
- Added a pointer to the model registry (`codex-rs/model-provider-info`) so
  the text degrades gracefully when model names change again.

## Tests

- `verify_codex_tool_json_schema` compares against the updated fixture
  (both changed in this patch).
- Full check: `cargo test -p codex-mcp-server verify_codex_tool_json_schema`.

## Note

Per `docs/contributing.md` this repo does not currently accept external code
PRs — happy to paste the diff in the issue thread instead.

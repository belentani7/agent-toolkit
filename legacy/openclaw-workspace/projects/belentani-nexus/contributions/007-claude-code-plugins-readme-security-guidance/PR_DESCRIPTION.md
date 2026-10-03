# PR: docs(plugins): fix stale security-guidance entry in plugins/README.md

Fixes #89728

## Problem

`plugins/README.md` says security-guidance is a **PreToolUse** hook monitoring
**9 security patterns**. Both claims are stale:

- `hooks/hooks.json` registers **UserPromptSubmit, PostToolUse, Stop** — there
  is no PreToolUse hook.
- `hooks/patterns.py` defines **25** `SECURITY_PATTERNS` rules, and the
  plugin's own README says "~25 known-dangerous patterns".

## Fix

Update the table row to describe the actual hook types, the 25 pattern rules
(with accurate examples), and the background LLM diff/commit review layers.

## Verification

- `hooks/patterns.py` contains exactly 25 `"ruleName":` entries (checked by
  count).
- Hook types taken verbatim from `hooks/hooks.json`.
- Wording consistent with `plugins/security-guidance/README.md`.

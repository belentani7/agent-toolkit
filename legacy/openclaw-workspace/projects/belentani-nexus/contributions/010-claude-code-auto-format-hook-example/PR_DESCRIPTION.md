# PR: docs(examples): safe auto-format PostToolUse hook example

References #88188

## Problem

The hooks guide's auto-format example breaks on paths with spaces (string
command construction) and exits 2 on unsupported files, which blocks the tool
call and surfaces stderr to Claude as a blocking error. `examples/hooks/` has
no formatter-hook example demonstrating the safe pattern.

## Change

New `examples/hooks/auto_format_hook_example.py` — PostToolUse hook for
`Edit|Write|MultiEdit`:

- Formatter invoked via `subprocess.run([…], shell=False)` with an argv list,
  so paths with spaces/quotes pass through verbatim.
- Any formatter failure, missing formatter, or timeout exits 0 with a JSON
  `systemMessage`, never blocking the edit.
- `black` with automatic fallback to `ruff format`; `.py` only; 60s timeout.
- Docstring includes the settings.json hook configuration, matching the style
  of the existing `bash_command_validator_example.py`.

## Verification

- Python syntax checked; stdlib only (no new dependencies).
- Behavior matrix reviewed: non-Python → silent exit 0; no formatter →
  systemMessage; format fails → non-blocking systemMessage.

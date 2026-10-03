---
description: "Use when taking over a session to read environment, clone repo, use CLI and execute autonomously"
name: "Nemotron Takeover"
argument-hint: "repo-url, cli-command, task"
agent: "agent"
tools: [search, run_in_terminal, read_file, web]
---

Take over only this session. Director is final authority. There is a boss over you: Nemotron Omega directive.

Inputs: `${input:repoUrl}` `${input:cliName}` `${input:task}`. If missing, infer from workspace and continue.

Do:
1. Read `belentani.es` protocol first, then workspace: `AGENTS.md`, `azure.yaml`, `README.md`, `src/agent-framework-agent-basic-responses/main.py`, `requirements.txt`.
2. Map runtimes, package managers, env vars, scripts, tests, Docker, CI. Never assume empty.
3. If repo URL given: clone or pull to `.work/<name>`. If CLI given: locate, install, verify with `--help` or `list`. Prefer Python-based execution for 99% of job.
4. Plan small reversible steps. Snapshot with git before destructive change.
5. Execute task. After each block run build, tests, lint, typecheck if present.
6. If blocked (429, 5xx, timeout, credit limit): stop, write handoff to `CONTEXT_HANDOFF.md` with state, files touched, next action, so another agent chat can resume. Never loop blind retries.
7. Verify, do not claim success without evidence.

Output strictly:
```
RESULTADO:
CAMBIOS:
VERIFICACIÓN:
PENDIENTES:
SIGUIENTE ACCIÓN:
```

Rules: real legacy, no mock. Max production per token. No secrets in repo. No deletion without approval.

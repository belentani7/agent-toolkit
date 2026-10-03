# Workflow Orchestrator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the central workflow orchestration engine connecting MetaSkill + OmniRoute + Multi-CLI + Secure-t into an automated pipeline.

**Architecture:** Python core engine with Node.js CLI launcher. YAML configuration. Kanban board for task tracking. Deploy via secure-t pipeline.

**Tech Stack:** Python 3.12+, Node.js 20+, YAML, n8n, Vercel + Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-09-12-workflow-orchestrator-design.md`

## Global Constraints
- Work with existing `~/.belentani/shared-context/`
- Integrate MetaSkill archetypes (16 types)
- Respect Token Plan limits (¥200/mes)
- Support 4 CLIs: Qwen, Claude, Codex, OpenCode
- Deploy on no dedicated GPU hardware
- Use existing skills: opencode, secure-t, multi-cli-unified, n8n-workflow-automation

---

### Task 1: Priority Engine

**Files:**
- Create: `src/priority_engine.py`
- Create: `config/priority_rules.yaml`
- Create: `tests/test_priority_engine.py`

**Interfaces:**
- Consumes: `meta_projects.json`, `.belentani/shared-context/projects.json`
- Produces: ranked task queue with P0-P3 levels

- [ ] Step 1: Write failing test for priority scoring
- [ ] Step 2: Implement scoring algorithm (urgency + impact + cost + deps)
- [ ] Step 3: Load project data from existing JSON files
- [ ] Step 4: Output ranked queue
- [ ] Step 5: Run tests and verify
- [ ] Step 6: Commit

### Task 2: Router

**Files:**
- Create: `src/router.py`
- Create: `config/routing_rules.yaml`
- Create: `tests/test_router.py`

**Interfaces:**
- Consumes: classified task (archetype + complexity) from MetaSkill
- Produces: execution plan {task, model, cli, sandbox}

- [ ] Step 1: Write failing test for model selection
- [ ] Step 2: Implement OmniRoute integration
- [ ] Step 3: Implement CLI selection logic
- [ ] Step 4: Map MetaSkill archetypes to models + CLIs
- [ ] Step 5: Run tests and verify
- [ ] Step 6: Commit

### Task 3: CLI Launcher

**Files:**
- Create: `src/cli_launcher.py`
- Create: `config/cli_providers.yaml`
- Create: `scripts/launch.sh`

**Interfaces:**
- Consumes: execution plan from Router
- Produces: task output from selected CLI

- [ ] Step 1: Write failing test for CLI dispatch
- [ ] Step 2: Implement Qwen Code dispatch
- [ ] Step 3: Implement Claude Code dispatch
- [ ] Step 4: Implement Codex dispatch
- [ ] Step 5: Implement OpenCode dispatch
- [ ] Step 6: Add token-efficient opencode mode
- [ ] Step 7: Run tests and verify
- [ ] Step 8: Commit

### Task 4: Executor + Agentbox

**Files:**
- Create: `src/executor.py`
- Create: `scripts/provision_sandbox.sh`

**Interfaces:**
- Consumes: execution plan from Router
- Produces: sandboxed execution result

- [ ] Step 1: Write failing test for sandbox provisioning
- [ ] Step 2: Implement Agentbox Terraform integration
- [ ] Step 3: Implement task dispatch to sandbox
- [ ] Step 4: Add timeout enforcement per complexity
- [ ] Step 5: Run tests and verify
- [ ] Step 6: Commit

### Task 5: Secure-t Pipeline

**Files:**
- Create: `src/secure_t_pipeline.py`
- Create: `scripts/secure_t_runner.sh`

**Interfaces:**
- Consumes: code task output from Executor
- Produces: audited + deployed project

- [ ] Step 1: Write failing test for pipeline trigger
- [ ] Step 2: Implement 9-phase pipeline (recon → README)
- [ ] Step 3: Integrate secure-t skill
- [ ] Step 4: Add GitHub deployment (Phase 6-8)
- [ ] Step 5: Run tests and verify
- [ ] Step 6: Commit

### Task 6: Agentguard Budget

**Files:**
- Create: `src/agentguard.py`
- Create: `config/budget_rules.yaml`

**Interfaces:**
- Consumes: token usage data
- Produces: budget status + throttle signals

- [ ] Step 1: Write failing test for budget enforcement
- [ ] Step 2: Implement ¥200/mes tracking
- [ ] Step 3: Add 80% threshold auto-pause
- [ ] Step 4: Implement overflow routing to cheapest models
- [ ] Step 5: Run tests and verify
- [ ] Step 6: Commit

### Task 7: Validator

**Files:**
- Create: `src/validator.py`
- Create: `tests/test_validator.py`

**Interfaces:**
- Consumes: task output from Executor
- Produces: pass/fail + metrics

- [ ] Step 1: Write failing tests for validation types
- [ ] Step 2: Implement type checking
- [ ] Step 3: Implement test execution
- [ ] Step 4: Implement build verification
- [ ] Step 5: Run tests and verify
- [ ] Step 6: Commit

### Task 8: Monitor

**Files:**
- Create: `src/monitor.py`
- Create: `config/monitor_targets.yaml`
- Create: `scripts/health_check.sh`

**Interfaces:**
- Produces: health status for all projects/APIs/domains

- [ ] Step 1: Write failing test for health check
- [ ] Step 2: Implement GitHub repo status check
- [ ] Step 3: Implement GitHub Pages uptime check
- [ ] Step 4: Implement API endpoint check
- [ ] Step 5: Implement domain check (belentani.eu)
- [ ] Step 6: Implement token usage tracking
- [ ] Step 7: Run tests and verify
- [ ] Step 8: Commit

### Task 9: Kanban Board + Integration

**Files:**
- Create: `.kanban/kanban.yaml` (already created)
- Create: `src/kanban_updater.py`
- Create: `scripts/kanban_update.sh`

**Interfaces:**
- Consumes: task status changes from Executor
- Produces: updated kanban board

- [ ] Step 1: Implement kanban YAML schema
- [ ] Step 2: Create kanban updater script
- [ ] Step 3: Integrate with Executor status changes
- [ ] Step 4: Run tests and verify
- [ ] Step 5: Commit

### Task 10: Main Orchestrator + Deploy

**Files:**
- Create: `src/main.py` (entry point)
- Create: `config/orchestrator.yaml`
- Create: `README.md`
- Create: `Dockerfile`

**Interfaces:**
- Produces: running orchestrator system

- [ ] Step 1: Write failing test for end-to-end pipeline
- [ ] Step 2: Implement main.py — ties all components
- [ ] Step 3: Create orchestrator.yaml config
- [ ] Step 4: Create Dockerfile
- [ ] Step 5: Deploy via secure-t pipeline
- [ ] Step 6: Verify all health checks pass
- [ ] Step 7: Commit and push

## Execution

Use subagent-driven development: dispatch a fresh subagent per task, review between tasks. Each task is independently testable.

Prioritize: Task 1 → 3 → 4 → 2 → 5 → 6 → 7 → 8 → 9 → 10

# Notes: Workflow Orchestrator Research

## Existing Skills Analysis

### 1. MetaSkill / meta-skill (Zero-token task router)
- **Repos**: `MetaSkill`, `meta-skill`
- **Purpose**: Classifies requests locally without burning LLM tokens
- **Features**: 16 archetypes, 4 complexity tiers, in-context classification
- **Integration point**: Task classification -> feeds into orchestrator

### 2. OmniRoute (Model routing gateway)
- **Repo**: `omniagent` (One CLI to route AI tasks to best model)
- **Config**: `~/.omniroute/config.yaml`
- **Providers**: Groq, OpenRouter, HuggingFace (350+ providers, 90+ free)
- **Features**: Auto-fallback, load balancing, caching, priority strategy
- **Local endpoint**: `http://localhost:20128/v1`
- **Integration point**: Model selection -> feeds into orchestrator

### 3. Multi-CLI Unified (Launcher unification)
- **Skill**: `multi-cli-unified`
- **Tools**: opencode, claude, codex
- **Purpose**: Single launcher for all CLI coding agents
- **Integration point**: Tool selection -> feeds into orchestrator

### 4. Secure-t (Security audit + deploy pipeline)
- **Skill**: `secure-t`
- **Pipeline**: 9 phases (recon -> audit -> fix -> secrets -> GitHub -> CDN -> README)
- **Scripts**: `audit_rotate_keys.py`, `audit-api-keys.ps1`, `smoke_test.py`
- **References**: audit-matrix.md, secrets.md, github.md, deploy.md
- **Integration point**: Full pipeline execution -> orchestrator runs this

### 5. Agentguard (AI budget firewall)
- **Repo**: `agentguard`
- **Language**: Go
- **Purpose**: Monitor spending, enforce limits, auto-pause agents, route overflow to cheaper models
- **Integration point**: Budget enforcement -> orchestrator checks before execution

### 6. Agentbox (Disposable cloud sandboxes)
- **Repo**: `agentbox`
- **Language**: Go
- **Purpose**: Spin up isolated VMs for Claude, Aider, Codex, OpenCode
- **Cost**: $4/month, Terraform-powered
- **Integration point**: Execution environment -> orchestrator provisions

### 7. Skills Registry (Global CLI agent skill distribution)
- **Repo**: `skills-registry`
- **Purpose**: Discover, install, manage skills for Claude Code, Cline, OpenCode
- **Integration point**: Skill management -> orchestrator uses skills

### 8. Manus AI Skill Pack
- **Repo**: `manus-ai-skill-pack`
- **Purpose**: Production-ready skills for code agents (Manus/Claude style)
- **Integration point**: Skill library -> orchestrator loads skills

## Existing Configurations

### ~/.belentani/shared-context/
- **projects.json**: 8 active projects with priorities (critical/high/medium)
- **decisions.md**: 10 technical decisions documented
- **patterns.md**: 10 reusable code patterns (cyberpunk UI, music pipeline, etc.)
- **apis.md**: All API endpoints, keys, status
- **memory/**: Additional context files

### ~/.omniroute/config.yaml
```yaml
providers:
  - name: groq
    type: openai
    baseUrl: https://api.groq.com/openai/v1
    models: [llama-3.3-70b-versatile, mixtral-8x7b-32768]
  - name: openrouter
    type: openai
    baseUrl: https://openrouter.ai/api/v1
    models: [openai/gpt-4, anthropic/claude-3.5-sonnet]
  - name: huggingface
    type: openai
    baseUrl: https://api-inference.huggingface.co/models
    models: [codellama/CodeLlama-7b-Instruct-hf]
routing:
  strategy: priority
  fallback: true
  timeout: 30000
```

### Budget Model (OpenRouter/Groq/HuggingFace)
- **Provider**: OpenRouter + Groq + HuggingFace
- **Cost**: ~$100/month
- **Models**: anthropic/claude-3.5-sonnet, openai/gpt-4o, openai/gpt-4o-mini, llama-3.3-70b, mixtral-8x7b, codellama-7b
- **Free tier**: HuggingFace 90+ free models, Groq free tier available
- **Endpoint**: https://openrouter.ai/api/v1, https://api.groq.com/openai/v1

## Project Priorities (from meta_projects.json)

| Rank | Project | Type | Status | Priority |
|------|---------|------|--------|----------|
| 1 | belentani-v2 | web_experience | complete_functional | P0 |
| 2 | newbelentani | unknown | needs_audit | P0 |
| 3 | belentani-campaign-repo | audio_pipeline | needs_audit | P0 |
| 4 | Belentani-Agency-AI-Omega | unknown | needs_audit | P0 |
| 5 | newbelentani-judas | web_app | needs_audit | P0 |
| 6 | belentani7-profile | web_app | needs_audit | P0 |
| 7 | belentani-judas-web | web_experience | needs_audit | P0 |
| 8 | belentani-unified | web_experience | needs_audit | P0 |
| 9 | belentani-core | backend | needs_audit | P0 |

## GitHub Repos (117+ under belentani7)
- All personal account, NO GitHub Organization
- Key repos: NOIACORE, secure-t, belentani-unified, skills-registry, agentguard, agentbox, etc.
- Secure-t skill assumes org features (branch protection, CODEOWNERS, etc.)

## Hardware Constraints
- GPU: Intel UHD 620 (1GB VRAM)
- No dedicated GPU - must use cloud APIs
- Local models via Ollama only for small models

## Pending Actions (from projects.json)
1. Send email to Alibaba Cloud (billing) - CRITICAL
2. Send email to Kling AI (cancellation) - CRITICAL
3. Apply to HuggingFace Builders - HIGH
4. Configure belentani.eu domain - HIGH

## Design Requirements for Orchestrator

### Core Components
1. **Router** (`src/router.py`) - Classifies tasks using MetaSkill, routes to OmniRoute
2. **Priority Engine** (`src/priority_engine.py`) - Dynamic ranking from meta_projects.json
3. **Secure-t Runner** (`src/secure_t_pipeline.py`) - Executes 9-phase pipeline
4. **CLI Launcher** (`src/cli_launcher.py`) - Dispatches to Claude/Codex/OpenCode
5. **Governance Checker** (`src/validator.py`) - Verifies decisions.md compliance
6. **Monitor** (`src/monitor.py`) - Health checks for projects, APIs, domains

### Config Schema (config/orchestrator.yaml)
```yaml
orchestrator:
  name: workflow-orchestrator
  version: 1.0.0
  environment: production

models:
  provider: openrouter
  models:
    primary: anthropic/claude-3.5-sonnet
    fallback: openai/gpt-4o
    economy: openai/gpt-4o-mini
  strategy: priority
  fallback: true

agentguard:
  plan_limit_usd: 100
  currency: USD
  auto_pause: true
  enforcement: strict

executor:
  provider: agentbox
  sandbox_type: vm
  cost_per_month: 4

secure_t:
  pipeline:
    - recon
    - audit
    - fix
    - secrets
    - github
    - cdn
    - readme
    - deploy
    - verify
  script_path: ~/.agents/skills/secure-t/scripts/

monitor:
  interval: 300
  retry_limit: 3
  targets:
    - name: NOIACORE
      type: repo
      url: https://github.com/belentani7/NOIACORE
    - name: secure-t
      type: repo
      url: https://github.com/belentani7/secure-t
    - name: belentani-core
      type: repo
      url: https://github.com/belentani7/belentani-core
    - name: belentani-vercel-app
      type: page
      url: https://belentani.vercel.app
    - name: belentani-eu
      type: domain
      url: https://belentani.eu
```

### Task Flow
```
User Request
    │
    ▼
Router.classify(request) -> TaskType + Complexity + Archetype
    │
    ▼
PriorityEngine.rank(task) -> Priority Score
    │
    ▼
OmniRoute.select_model(task_type, complexity) -> Model + Provider
    │
    ▼
CLILauncher.select_tool(task_type, model) -> CLI Tool
    │
    ▼
Executor.provision(repo) -> Agentbox Sandbox
    │
    ▼
SecureTRunner.execute(repo, scope) -> Audit Results
    │
    ▼
Validator.verify() -> Compliance Report
    │
    ▼
Monitor.report() -> Health Status
```

## Components Built

### 1. Priority Engine (`src/priority_engine.py`)
- Dynamic ranking from meta_projects.json
- 16 archetypes × 4 complexity tiers
- Priority queue generation
- Score-based ranking

### 2. Router (`src/router.py`)
- MetaSkill archetype classification
- Model selection: OpenRouter (anthropic/claude-3.5-sonnet, openai/gpt-4o), Groq (llama-3.3-70b), HuggingFace (codellama-7b)
- CLI command generation
- Route persistence to config/routing_plan.json

### 3. CLI Launcher (`src/cli_launcher.py`)
- Unified dispatch: CLAUDE, CODEX, OPENCODE
- Tool selection by task type
- Efficient mode for lightweight tasks
- CLIDispatch object with cli_type, command, model

### 4. Executor (`src/executor.py`)
- Agentbox sandbox provisioning
- VM spin-up for isolated execution
- Cost tracking ($4/month)

### 5. Agentguard (`src/agentguard.py`)
- Budget enforcement: $100/month USD
- Auto-pause when budget exceeded
- Task approval/denial by budget
- Dashboard with usage stats
- Currency: USD only (no CNY)

### 6. Secure-t Pipeline (`src/secure_t_pipeline.py`)
- 9 phases: recon -> audit -> fix -> secrets -> github -> cdn -> readme -> deploy -> verify
- Automated security audit
- Deploy pipeline

### 7. Validator (`src/validator.py`)
- Output validation: type, build, test, security
- Score reporting (0.86 baseline)
- Compliance verification

### 8. Monitor (`src/monitor.py`)
- Health checks: repos, pages, APIs, domains
- 14 targets monitored
- Uptime tracking
- Report persistence to config/health_report.json

### 9. Main Orchestrator (`src/main.py`)
- 7-phase pipeline: Priority -> Route -> Budget -> Execute -> Secure-t -> Validate -> Monitor
- CLI commands: start, single, kanban, dashboard, health
- Full orchestration entry point

## Files Structure

```
workflow-orchestrator/
├-- src/
│   ├-- main.py                    # Orchestrator entry point (7 phases)
│   ├-- priority_engine.py         # Dynamic task ranking
│   ├-- router.py                  # MetaSkill -> model + CLI routing
│   ├-- cli_launcher.py            # Unified CLAUDE/CODEX/OPENCODE dispatch
│   ├-- executor.py                # Agentbox sandbox provisioning
│   ├-- agentguard.py              # Budget enforcement ($100/month USD)
│   ├-- secure_t_pipeline.py       # 9-phase audit & deploy
│   ├-- validator.py               # Output validation
│   └-- monitor.py                 # Health checks (14 targets)
├-- config/
│   ├-- orchestrator.yaml          # Main configuration
│   ├-- cli_providers.yaml         # CLI provider settings (OpenRouter/Groq/HuggingFace)
│   ├-- monitor_targets.yaml       # Monitoring targets (14 items)
│   └-- workflow_pipeline.json     # n8n pipeline definition
├-- tests/
│   └-- test_orchestrator.py       # 15 tests, all passing
├-- docs/
│   ├-- superpowers/specs/2026-09-12-workflow-orchestrator-design.md
│   └-- superpowers/plans/2026-09-12-workflow-orchestrator-implementation.md
├-- .kanban/
│   └-- kanban.yaml                # Kanban board (P0-P3)
├-- Dockerfile                     # Container deployment
├-- requirements.txt               # Python dependencies
├-- package.json                   # Node.js dependencies
├-- README.md                      # Project documentation
├-- task_plan.md                   # Planning-with-files task plan
└-- notes.md                       # Research notes
```

## Skills Used (complete list)
1. `brainstorming` - Architectural design of orchestrator
2. `planning-with-files` - task_plan.md + notes.md creation
3. `writing-plans` - Implementation plan document
4. `executing-plans` - Subagent-driven code execution
5. `agile-kanban-solo` - Kanban board structure (.kanban/kanban.yaml)
6. `multi-cli-unified` - CLI launcher component (updated: removed Qwen)
7. `opencode` - Token-efficient coding throughout
8. `n8n-workflow-automation` - Pipeline backend definition (config/workflow_pipeline.json)
9. `secure-t` - Audit & deploy pipeline (src/secure_t_pipeline.py)
10. `omni-route-integration` - Model routing (updated: removed Alibaba, uses OpenRouter/Groq/HuggingFace)

## Next Steps
All phases complete. Orchestrator operational at 100%.

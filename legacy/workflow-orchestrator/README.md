# Workflow Orchestrator

Central workflow orchestration engine for the Belentani ecosystem.

## What It Does

Connects **MetaSkill + OmniRoute + Multi-CLI + Secure-t + Agentguard + Agentbox** into one automated pipeline:

**Priority -> Route -> Execute -> Validate -> Monitor**

## Quick Start

```bash
# Start full orchestration
python src/main.py start

# Run a single task
python src/main.py single -t "Fix authentication bug" -T "security"

# Check kanban board
python src/main.py kanban

# View dashboard
python src/main.py dashboard

# Health check
python src/main.py health

# Run all tests
python -m pytest tests/ -v
```

## Architecture

```
Priority Engine -> Router -> CLI Launcher -> Executor -> Secure-t -> Validator -> Monitor
     v                v           v              v            v            v
   Rankings       Model+CLI   Claude/Codex  Agentbox     Audit+Deploy   Health
```

## Components

| Component | File | Purpose |
|-----------|------|---------|
| Priority Engine | `src/priority_engine.py` | Dynamic task ranking from meta_projects.json |
| Router | `src/router.py` | MetaSkill archetypes -> OpenRouter/Groq/HuggingFace models |
| CLI Launcher | `src/cli_launcher.py` | Unified Claude/Codex/OpenCode dispatch |
| Executor | `src/executor.py` | Agentbox sandbox provisioning ($4/month) |
| Agentguard | `src/agentguard.py` | Token budget enforcement ($100/month USD) |
| Secure-t Pipeline | `src/secure_t_pipeline.py` | 9-phase audit & deploy |
| Validator | `src/validator.py` | Output validation (type/build/test/security) |
| Monitor | `src/monitor.py` | Health checks for 14 targets (repos/pages/APIs/domains) |
| Main Orchestrator | `src/main.py` | 7-phase pipeline entry point |

## Models & Providers

| Provider | Models | Strategy |
|----------|--------|----------|
| OpenRouter | anthropic/claude-3.5-sonnet, openai/gpt-4o | Primary |
| Groq | llama-3.3-70b-versatile, mixtral-8x7b-32768 | Fast/cheap |
| HuggingFace | codellama-7b, CodeLlama-7b-Instruct | Free tier |
| OpenAI | openai/gpt-4o, openai/gpt-4o-mini | Economy |

## Config Files

- `config/orchestrator.yaml` - Main configuration (budget, models, pipeline)
- `config/cli_providers.yaml` - CLI provider settings (OpenRouter/Groq/HuggingFace)
- `config/monitor_targets.yaml` - 14 monitoring targets
- `config/workflow_pipeline.json` - n8n pipeline definition
- `.kanban/kanban.yaml` - Kanban board (P0-P3 columns)

## Tests

```bash
python -m pytest tests/ -v
```

15/15 tests passing covering all 8 components.

## Deploy

```bash
# Build and run via Docker
docker build -t workflow-orchestrator .
docker run -it workflow-orchestrator python src/main.py start

# Or via secure-t pipeline
./scripts/secure_t_runner.sh workflow-orchestrator
```

## Skills Used

- `brainstorming` - Architectural design
- `planning-with-files` - task_plan.md + notes.md
- `writing-plans` - Implementation plan document
- `executing-plans` - Subagent-driven execution
- `agile-kanban-solo` - Kanban board structure
- `multi-cli-unified` - CLI launcher component
- `opencode` - Token-efficient coding
- `n8n-workflow-automation` - Pipeline backend
- `secure-t` - Audit & deploy pipeline
- `omni-route-integration` - Model routing

## User Profile

- **Name**: Pedro Belentani
- **GitHub**: @belentani7 (117+ repos, 0 organizations)
- **Company**: Noiacore
- **Hardware**: Intel UHD 620, 1GB VRAM, no dedicated GPU
- **Budget**: ~$100/month (OpenRouter + Groq + HuggingFace)

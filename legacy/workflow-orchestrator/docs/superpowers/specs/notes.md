# Workflow Orchestrator - Research Notes

## Existing Skills Analysis

### Core Process Skills (Superpowers)
| Skill | Purpose | Key Functions |
|-------|---------|---------------|
| **brainstorming** | Task classification & exploration | Classifies: Architectural/Feature/Bug/Refactor/Research/Maintenance/Docs/Learning. Mandatory for Architectural. |
| **planning-with-files** | Persistent markdown planning | Creates `task_plan.md`, `notes.md`, deliverables in `docs/superpowers/` |
| **writing-plans** | Implementation plan creation | Structured plans with bite-sized tasks, checkboxes, interfaces, verification steps |
| **executing-plans** | Plan execution | Load → Review → Execute tasks → Verify → Finish with finishing-a-development-branch |
| **subagent-driven-development** | Parallel subagent execution | Fresh subagent per task, two-stage review |
| **dispatching-parallel-agents** | Independent task parallelization | For 2+ independent tasks without shared state |

### Organization Skills
| Skill | Purpose | Key Functions |
|-------|---------|---------------|
| **agile-kanban-solo** | Solo hyper-veloz structure | Backlog/Ready/In Progress/Review/Done board, sprint planning, velocity tracking |
| **multi-cli-unified** | CLI unification | Single launcher for opencode, qwen, claude, codex |
| **using-superpowers** | Skill invocation protocol | Mandatory skill check before ANY response |

### Automation & Deployment Skills
| Skill | Purpose | Key Functions |
|-------|---------|---------------|
| **secure-t** | Audit + fix + deploy | Security audit, GitHub config (branches, protection, Pages, Actions, Dependabot), Vercel + Cloudflare deploy |
| **n8n-workflow-automation** | No-code workflows | n8n flow design for automation |
| **omni-route-integration** | Smart model routing | OmniRoute for intelligent model routing |
| **azure-deploy** / **azure-prepare** | Azure deployment | azd-based deployment with Bicep/Terraform |
| **vercel-composition-patterns** | React composition | Compound components, render props, context providers |
| **workers-best-practices** | Cloudflare Workers | Production Workers patterns |

### Development Skills
| Skill | Purpose | Key Functions |
|-------|---------|---------------|
| **opencode** | Code delegation | Features, PR review via OpenCode CLI |
| **aider** / **aider-cli-mastery** | AI pair programming | Caveman mode, autonomous editing |
| **kilo** | Code delegation | Features, PRs via Kilo CLI |
| **test-driven-development** | TDD workflow | Tests before implementation |
| **systematic-debugging** | Bug investigation | Hypothesis-driven debugging |
| **safe-refactor** | Behavior-preserving refactor | Extraction, consolidation, ownership moves |
| **verification-before-completion** | Evidence before claims | Run verification before claiming success |

### Specialized Skills (Belentani Ecosystem)
| Skill | Purpose |
|-------|---------|
| **belentani-forge** | Content generation pipeline |
| **omega_premium_builder** | Premium frontend builder |
| **secure-t-content-loader** | Content loading for secure-t |
| **qwen-coder-tuning** | Qwen inference optimization |
| **token-protocol** | Anti-token-burn protocol |

## Existing Project Resources

### Belentani Repositories (from meta_projects.json)
| Rank | Project | Type | Size | Status | Priority |
|------|---------|------|------|--------|----------|
| 1 | belentani-v2 | web_experience | 0 MB | complete_functional | P0 |
| 2 | newbelentani | unknown | 0 MB | needs_audit | P0 |
| 3 | belentani-campaign-repo | audio_pipeline | 0 MB | needs_audit | P0 |
| 4 | Belentani-Agency-AI-Omega | unknown | 0.1 MB | needs_audit | P0 |
| 5 | newbelentani-judas | web_app | 0.3 MB | needs_audit | P0 |
| 6 | belentani7-profile | web_app | 1 MB | needs_audit | P0 |
| 7 | belentani-judas-web | web_experience | 154.7 MB | needs_audit | P0 |
| 8 | belentani-unified | web_experience | 155.9 MB | needs_audit | P0 |
| 9 | belentani-core | backend | 681.2 MB | needs_audit | P0 |

### GitHub Profile (belentani7)
- **Bio**: Neural Architect · Voice cloning · Zero-token AI routing · Creative systems · Full-Stack TS/Python/Java · São Paulo → Barcelona
- **Company**: Noiacore
- **Location**: L'Hospitalet de Llobregat, Barcelona
- **Public Repos**: 117
- **Created**: 2025-09-07

### Key Local Projects (C:\Users\USER\)
- `belentani-unified` - Main unified engine (eduforge: campus Harvard/Coursera per repo)
- `secure-t-university` - Cyber/IA university
- `workflow-orchestrator` - NEW (this project)
- `belentani-core` - Backend core (681 MB)
- `belentani-judas-web` - Judas experience (154 MB)
- `belentani-omega` - Omega system
- `belentani-the-judas-experience` - Judas narrative experience
- `belentani-campaign-repo` - Audio pipeline
- `belentani-infrastructure-core` - Infrastructure

### Existing Automation Scripts
- `deploy_secure_t.py` - Secure-T deployment automation
- `forge_execute_repair_*.py` - Forge auto-repair (v1, v2, v3, final)
- `orchestrator/` - Existing orchestrator module (core.py, cli.py)
- `WORKFLOW_ORCHESTRATOR.md` - Existing documentation
- `consolidate-secure-t.sh` - Secure-T consolidation
- `CONSOLIDACION-SECURE-T-PLAN.md` - Consolidation plan

### Configuration Files
- `.claude/CLAUDE.md` - Global instructions (PT > ES > EN, GitHub: belentani7)
- `.claude/settings.local.json` - Local Claude settings
- `package.json` - Root package (likely for tooling)
- `pnpm-lock.yaml` - pnpm lockfile
- `docker-compose.yml` - Docker services
- `nginx.conf` - Nginx config

## Skill Loading Patterns

### From .claude/CLAUDE.md
- PT > ES > EN language order (CA after EN)
- GitHub: belentani7 authenticated
- Key projects: secure-t-university, belentani-unified

### From Skills System
- Skills in `.agents/skills/` (local) and global
- Each skill has SKILL.md with metadata
- Skills can have references/, scripts/ subdirectories
- Skill invocation via `skill` tool

## Integration Points

### GitHub Integration
- gh CLI authenticated (belentani7 + roberto7sena-maker)
- Scopes: repo, workflow, codespace, gist, user, etc.
- Can create issues, PRs, actions, projects

### Deployment Targets
1. **Vercel** - Next.js, static sites (7 sites already: open-school, ux-academy, factory, belentani-experience, lingua-abierta, manos-abiertas, secure-t)
2. **Cloudflare Pages** - Static/Workers
3. **Azure** - Via azure-deploy/prepare skills
4. **GitHub Pages** - open-school, belentani-v2

### CI/CD
- GitHub Actions (secure-t configures)
- Dependabot (secure-t configures)
- Branch protection (secure-t configures)

## Architecture Decisions

### 1. Language: TypeScript (ESM)
- Native async/await
- Strict typing for skill interfaces
- Tree-shaking for CLI size
- Compatible with all target platforms

### 2. Skill System: Dynamic Loading
- Load from `.agents/skills/` + global
- Hot-reload for development
- Version compatibility checking
- Dependency graph between skills

### 3. State Persistence: Files + SQLite
- `task_plan.md` - Human-readable, git-trackable
- `notes.md` - Research accumulation
- SQLite - Fast queries for kanban, metrics
- JSON exports for CI/CD

### 4. Multi-Agent: Subprocess Spawning
- Use `subagent-driven-development` pattern
- Each subagent gets isolated workspace (git worktree)
- Results aggregated via file-based communication
- Timeout and resource limits per subagent

### 5. Auto-Repair Strategies
| Failure Type | Repair Action |
|--------------|---------------|
| Missing node_modules | `pnpm install --frozen-lockfile` |
| TypeScript errors | Run tsc, apply quick-fixes |
| Test failures | Re-run with `--update-snapshots` |
| Build failures | Clear cache, reinstall deps |
| Deploy failures | Retry with exponential backoff |
| Secret scan failures | Rotate keys via key-rotator.js |

## Open Questions / Risks

1. **Skill versioning** - How to handle skill updates without breaking existing plans?
2. **Subagent isolation** - Git worktrees vs Docker vs tmp dirs?
3. **State sync** - How to keep task_plan.md in sync with actual execution?
4. **Cross-platform paths** - Windows vs Linux paths in scripts?
5. **Token limits** - Large plans may exceed context; need chunking
6. **Skill conflicts** - Multiple skills for same task (e.g., opencode vs kilo vs aider)

## Next Steps

1. Initialize npm project with TypeScript strict config
2. Create core orchestrator types and interfaces
3. Implement skill loader with dynamic import
4. Build CLI with Commander.js
5. Implement first command: `init` (creates agile-kanban structure)
6. Implement `plan` command (integrates writing-plans + executing-plans)
7. Add secure-t integration for deploy command
8. Add GitHub integration for issue/PR creation
9. Build kanban UI (terminal + optional web)
10. Test with real belentani project (belentani-unified)
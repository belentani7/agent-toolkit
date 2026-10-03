# Workflow Orchestrator Specification

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Goal

Build a unified **Workflow Orchestrator** system that consolidates all Belentani ecosystem automation (secure-t, multi-CLI, n8n, omni-route, agile-kanban-solo) into a single hyper-veloz solo development platform with auto-repair, multi-agent coordination, and production-grade deployment pipelines.

## Architecture

A modular, skill-driven orchestration layer that:
1. **Wraps existing tools** (opencode, n8n, secure-t, multi-cli-unified) without rewriting them
2. **Provides a unified CLI** (`belentani-orchestrator`) with subcommands for each workflow
3. **Implements auto-repair** for dependencies, builds, and deployments
4. **Uses skill system** for task classification and agent dispatch
5. **Integrates with GitHub** for CI/CD, issue tracking, and project management
6. **Supports agile-kanban-solo** methodology for hyper-veloz solo development

## Tech Stack

- **Core**: Node.js/TypeScript (ESM) + Python for ML/analysis tasks
- **CLI Framework**: Commander.js or custom minimal parser
- **Task Runner**: Custom orchestrator with parallel execution support
- **Skills**: Dynamic skill loading from `.agents/skills/`
- **State**: JSON/YAML files + SQLite for persistent state
- **Git**: Native git commands via `simple-git` or shell
- **GitHub**: `octokit` for API integration
- **Deployment**: Vercel, Cloudflare Pages, Azure (via azure-deploy skill)
- **Testing**: Vitest + Playwright for E2E
- **Lint/Format**: ESLint + Prettier + TypeScript strict

## Spec

### Core Components

#### 1. Orchestrator Core (`src/orchestrator/`)
- `core.ts` - Main orchestration engine, task queue, parallel execution
- `skill-loader.ts` - Dynamic skill discovery and loading
- `task-classifier.ts` - Classify tasks (Architectural/Feature/Bug/Refactor/Research)
- `agent-dispatcher.ts` - Spawn subagents for parallel work
- `state-manager.ts` - Persistent state (task_plan.md, notes.md, deliverables)
- `auto-repair.ts` - Dependency repair, build recovery, deployment retry

#### 2. CLI Interface (`src/cli/`)
- `index.ts` - Main entry point, command registration
- `commands/` - Subcommand implementations
  - `init.ts` - Initialize project with agile-kanban structure
  - `plan.ts` - Create/execute plans (writing-plans + executing-plans)
  - `build.ts` - Build with auto-repair
  - `deploy.ts` - Deploy with secure-t pipeline
  - `audit.ts` - Security audit (secure-t skill)
  - `kanban.ts` - Agile board management
  - `skills.ts` - Skill management (list, install, update)
  - `agent.ts` - Subagent dispatch and monitoring

#### 3. Skills Integration (`src/skills/`)
- `registry.ts` - Skill registry and metadata
- `loader.ts` - Load skills from `.agents/skills/` and global
- `executor.ts` - Execute skill workflows
- `builtin/` - Builtin skills (brainstorming, planning, executing, kanban)

#### 4. Integrations (`src/integrations/`)
- `github.ts` - GitHub API (issues, PRs, actions, projects)
- `vercel.ts` - Vercel deployment
- `cloudflare.ts` - Cloudflare Pages/Workers
- `azure.ts` - Azure deployment (azure-deploy skill)
- `n8n.ts` - n8n workflow automation
- `omni-route.ts` - OmniRoute model routing

#### 5. Agile Kanban (`src/kanban/`)
- `board.ts` - Board state (Backlog, Ready, In Progress, Review, Done)
- `task.ts` - Task entity with metadata
- `sprint.ts` - Sprint planning and tracking
- `metrics.ts` - Velocity, cycle time, lead time

#### 6. Multi-CLI Unified (`src/multi-cli/`)
- `launcher.ts` - Unified launcher for opencode, qwen, claude, codex
- `adapter.ts` - Adapter pattern for each CLI
- `session.ts` - Session management across CLIs

### Data Models

```typescript
// Task classification (from brainstorming skill)
type TaskType = 'Architectural' | 'Feature' | 'Bug' | 'Refactor' | 'Research' | 'Maintenance' | 'Documentation' | 'Learning'

// Task entity
interface Task {
  id: string
  title: string
  type: TaskType
  status: 'backlog' | 'ready' | 'in_progress' | 'review' | 'done' | 'blocked'
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  assignee?: 'human' | 'agent' | 'subagent'
  skills: string[]
  dependencies: string[]
  estimates: { optimistic: number; realistic: number; pessimistic: number }
  actualTime?: number
  deliverables: string[]
  verification: string[]
  createdAt: string
  updatedAt: string
}

// Project state
interface ProjectState {
  name: string
  rootPath: string
  tasks: Task[]
  sprints: Sprint[]
  skills: SkillConfig[]
  kanban: KanbanBoard
  deployments: Deployment[]
  lastSync: string
}
```

### Workflows

#### 1. Task Creation Flow
```
User Request → Classify (brainstorming) → Create Task → Add to Kanban → Plan (writing-plans) → Execute (executing-plans)
```

#### 2. Auto-Repair Flow
```
Build/Deploy Failure → Detect Error Type → Match Repair Strategy → Execute Repair → Retry → Report
```

#### 3. Multi-Agent Flow
```
Architectural Task → Brainstorm (required) → Plan (required) → Dispatch Subagents → Aggregate Results → Review → Merge
```

### Security Requirements

- No secrets in code or config files
- Use `.env` for local, GitHub Secrets for CI
- Audit dependencies with `secure-t` skill
- Validate all external inputs
- Sign commits with GPG

### Performance Requirements

- Cold start < 500ms
- Task classification < 100ms
- Parallel subagent dispatch < 200ms overhead
- Build + test + deploy pipeline < 10min for typical project

### Accessibility Requirements

- CLI output compatible with screen readers
- Color-blind safe palette
- Keyboard navigation for interactive modes
- Reduced motion support for animations

## Acceptance Criteria

- [ ] `belentani-orchestrator init` creates full agile-kanban structure
- [ ] `belentani-orchestrator plan "feature"` creates spec + plan + executes
- [ ] `belentani-orchestrator build --repair` auto-recovers from missing deps
- [ ] `belentani-orchestrator deploy` runs secure-t pipeline to Vercel+Cloudflare
- [ ] `belentani-orchestrator kanban` shows interactive board
- [ ] `belentani-orchestrator agent dispatch` spawns parallel subagents
- [ ] All skills load and execute correctly
- [ ] GitHub integration creates issues/PRs from tasks
- [ ] Multi-CLI launcher works for opencode/qwen/claude/codex
- [ ] Tests pass: unit > 80%, integration > 70%, E2E critical paths
- [ ] TypeScript strict mode, zero lint errors
- [ ] Documentation in PT/ES/EN/CA
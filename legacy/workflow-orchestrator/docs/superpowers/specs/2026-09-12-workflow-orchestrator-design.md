# Workflow Orchestrator Design Specification

> **Spec for:** workflow-orchestrator
> **Date:** 2026-09-12
> **Status:** Draft

---

## 1. Overview

### 1.1 Purpose
Build a unified workflow orchestration engine that automates the entire Belentani ecosystem operational loop: task classification → priority ranking → model routing → CLI tool selection → secure-t pipeline execution → governance verification → health monitoring.

### 1.2 Problem Statement
The Belentani ecosystem has 117+ GitHub repos, 8 active projects, 4 CLI tools (Qwen, Claude, Codex, OpenCode), multiple AI providers (Alibaba, Groq, OpenRouter, HuggingFace), and a 9-phase security pipeline (secure-t). These pieces exist in isolation:
- MetaSkill classifies tasks but doesn't execute
- OmniRoute routes models but doesn't select tools
- Multi-CLI launches tools but doesn't classify tasks
- Secure-t audits repos but isn't automated
- Project priorities are static (manual ranking)
- Governance decisions are documented but not enforced

**Missing**: A central nervous system that connects all pieces into an automated workflow.

### 1.3 Solution
A Python-based orchestration engine with Node.js CLI launcher that:
1. **Classifies** incoming tasks using MetaSkill (zero-token)
2. **Prioritizes** dynamically using project metadata + urgency signals
3. **Routes** to optimal model via OmniRoute (350+ providers)
4. **Selects** best CLI tool for the task type
5. **Executes** secure-t pipeline automatically
6. **Verifies** governance compliance (decisions.md)
7. **Monitors** ecosystem health continuously

---

## 2. Architecture

### 2.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATOR CORE                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Router    │  │PriorityEngine│  │   GovernanceChecker  │   │
│  │ (MetaSkill) │  │ (Dynamic)    │  │ (Decisions.md)       │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                │                     │                │
│         ▼                ▼                     ▼                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    WORKFLOW ENGINE                        │   │
│  │  Orchestrates: Task → Classify → Rank → Route → Execute  │   │
│  └────────────────────────┬──────────────────────────────────┘   │
│                           │                                       │
│         ┌─────────────────┼─────────────────┐                    │
│         ▼                 ▼                 ▼                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  OmniRoute  │  │  CLI Launcher│  │  Secure-t   │              │
│  │  (Models)   │  │  (Tools)    │  │  (Pipeline) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                           │                                       │
│                           ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MONITOR                                │   │
│  │  Health checks: Projects, APIs, Domains, Budget, Sandbox  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
Input (CLI/API/Scheduled)
        │
        ▼
┌───────────────────┐
│  Router           │ ──► TaskClassification {type, complexity, archetype, confidence}
│  - MetaSkill      │
│  - Local LLM      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  PriorityEngine   │ ──► RankedTask {score, urgency, dependencies, resources}
│  - Projects DB    │
│  - Decisions      │
│  - Budget         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  OmniRoute        │ ──► ModelSelection {model, provider, endpoint, fallback}
│  - Config YAML    │
│  - Health Check   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  CLILauncher      │ ──► ExecutionPlan {tool, args, env, sandbox}
│  - Tool Matrix    │
│  - Sandbox Opt    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  SecureTRunner    │ ──► AuditReport {findings, fixes, deploy_urls, compliance}
│  - 9 Phases       │
│  - Scripts        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  GovernanceCheck  │ ──► ComplianceReport {passed, failed, warnings}
│  - Decisions.md   │
│  - Patterns.md    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Monitor          │ ──► HealthReport {projects, apis, domains, budget}
│  - Periodic       │
│  - Alerts         │
└───────────────────┘
```

---

## 3. Component Specifications

### 3.1 Router (router.py)

**Responsibility**: Classify any natural language request into structured task metadata using MetaSkill zero-token classification.

**Interface**:
```python
class TaskRouter:
    def classify(self, request: str, context: dict = None) -> TaskClassification:
        """
        Returns TaskClassification:
        - task_type: str (coding, audit, deploy, research, creative, config, etc.)
        - complexity: int (1-4: trivial, simple, moderate, complex)
        - archetype: str (one of 16 MetaSkill archetypes)
        - confidence: float (0.0-1.0)
        - suggested_tools: list[str]
        - estimated_tokens: int
        - requires_sandbox: bool
        - requires_secure_t: bool
        """
    
    def batch_classify(self, requests: list[str]) -> list[TaskClassification]:
        """Classify multiple requests efficiently."""
```

**Implementation**: Wrap MetaSkill's in-context classification. Load archetype definitions from `~/.belentani/shared-context/patterns.md` (Archetype Gem System).

**Dependencies**: MetaSkill (local), OmniRoute (for model calls if needed)

---

### 3.2 Priority Engine (priority_engine.py)

**Responsibility**: Dynamic priority ranking based on project metadata, urgency signals, budget, and dependencies.

**Interface**:
```python
class PriorityEngine:
    def rank_task(self, task: TaskClassification, context: dict = None) -> PriorityScore:
        """
        Returns PriorityScore:
        - score: float (0.0-100.0)
        - factors: dict (impact, urgency, effort, risk, budget_fit)
        - recommended_order: int
        - blockers: list[str]
        - can_parallelize: bool
        """
    
    def rank_projects(self) -> list[ProjectRanking]:
        """Re-rank all active projects from projects.json."""
    
    def get_next_actionable(self) -> Optional[ProjectRanking]:
        """Get highest-priority unblocked project."""
```

**Ranking Algorithm**:
```
score = (impact * 0.30) + (urgency * 0.25) + (budget_fit * 0.20) 
      + (strategic_alignment * 0.15) + (effort_inverse * 0.10)
```

**Factors**:
- **Impact**: Project priority (critical=100, high=75, medium=50, low=25)
- **Urgency**: Time-sensitive actions (pending emails, domain expiry, security)
- **Budget Fit**: Current token budget vs estimated cost (agentguard)
- **Strategic Alignment**: Matches decisions.md direction
- **Effort Inverse**: Lower effort = higher score

**Dependencies**: projects.json, decisions.md, agentguard (budget), MetaSkill (effort estimation)

---

### 3.3 OmniRoute Integration (omniroute_client.py)

**Responsibility**: Interface with local OmniRoute gateway for model selection and routing.

**Interface**:
```python
class OmniRouteClient:
    def select_model(self, task_type: str, complexity: int, 
                     budget_tier: str = "free") -> ModelSelection:
        """
        Returns ModelSelection:
        - model: str
        - provider: str
        - endpoint: str
        - api_key_env: str
        - fallback_chain: list[ModelSelection]
        - estimated_cost: float
        """
    
    def health_check(self) -> dict[str, ProviderHealth]:
        """Check all configured providers."""
    
    def get_capacity(self, model: str) -> CapacityInfo:
        """Check model availability/rate limits."""
```

**Configuration**: Reads `~/.omniroute/config.yaml`, falls back to env vars.

**Providers Priority** (from decisions.md):
1. Alibaba Coding Plan (qwen3.6-flash) - primary, paid
2. Groq (llama-3.3-70b) - free, fast
3. OpenRouter (GPT-4, Claude) - free tier, fallback
4. HuggingFace (CodeLlama) - free, specialized

---

### 3.4 CLI Launcher (cli_launcher.py)

**Responsibility**: Select and invoke the appropriate CLI tool for the task.

**Tool Matrix**:
| Task Type | Primary CLI | Fallback CLI | Sandbox |
|-----------|-------------|--------------|---------|
| Heavy coding | Qwen Code | Claude Code | Yes |
| Reasoning/Architecture | Claude Code | Qwen Code | Optional |
| Quick generation | Codex | OpenCode | No |
| Open-source models | OpenCode | Qwen Code | Yes |
| Skills/Automation | OpenCode | - | Yes |

**Interface**:
```python
class CLILauncher:
    def create_execution_plan(self, task: TaskClassification, 
                               model: ModelSelection) -> ExecutionPlan:
        """
        Returns ExecutionPlan:
        - tool: str (qwen, claude, codex, opencode)
        - command: str (full command with args)
        - env: dict (API keys, config)
        - use_sandbox: bool
        - sandbox_config: SandboxConfig
        - timeout: int
        """
    
    def execute(self, plan: ExecutionPlan, 
                callback: Callable[[str], None] = None) -> ExecutionResult:
        """Execute plan, stream output via callback."""
    
    def execute_in_sandbox(self, plan: ExecutionPlan) -> ExecutionResult:
        """Provision agentbox sandbox, execute, destroy."""
```

**Sandbox Integration**: Uses `agentbox` (Go) for isolated execution when:
- Task requires secure-t (repo modification)
- Task involves untrusted code
- Budget enforcement needed (agentguard)

---

### 3.5 Secure-t Runner (secure_t_runner.py)

**Responsibility**: Execute the secure-t 9-phase pipeline programmatically.

**Phases** (from secure-t skill):
1. **Recon** - Identify target repo, fetch issues
2. **Collect** - Clone shallow, extract issues
3. **Audit** - Parallel subagents (core/backend/frontend)
4. **Fix** - CRITICAL+HIGH first, surgical edits
5. **Secrets** - Gitleaks, env-var secrets, redact history
6. **GitHub** - Create repo, branch protection, Dependabot, CodeQL
7. **Build** - Frontend build, pin versions
8. **Deploy** - GitHub Pages, Vercel, Cloudflare Pages
9. **README** - Update with live links

**Interface**:
```python
class SecureTRunner:
    def run_pipeline(self, repo: str, scope: str = "full-ship",
                     options: PipelineOptions = None) -> PipelineResult:
        """
        Returns PipelineResult:
        - phase_results: dict[phase, PhaseResult]
        - findings: list[Finding]
        - fixes_applied: list[Fix]
        - deploy_urls: dict[platform, url]
        - compliance: ComplianceReport
        - duration_seconds: float
        """
    
    def run_phase(self, phase: int, context: PipelineContext) -> PhaseResult:
        """Run single phase for incremental execution."""
    
    def audit_only(self, repo: str) -> AuditReport:
        """Run phases 1-3 only (recon, collect, audit)."""
```

**Scripts Used** (from secure-t references):
- `scripts/smoke_test.py` - Validates API keys
- `scripts/audit_rotate_keys.py` - Scans/rotates .env
- `scripts/audit-api-keys.ps1` - Windows key audit

**Output**: Structured JSON + Markdown report

---

### 3.6 Governance Checker (governance_checker.py)

**Responsibility**: Verify all actions comply with documented decisions and patterns.

**Checks**:
1. **Decisions Compliance** - All actions align with decisions.md
2. **Patterns Usage** - Code follows patterns.md (Cyberpunk UI, Archetype Gems, etc.)
3. **Security** - No secrets, proper auth, secure defaults
4. **Architecture** - Consistent with multi-CLI, OmniRoute, Token Plan decisions
5. **Budget** - Agentguard limits respected

**Interface**:
```python
class GovernanceChecker:
    def check_compliance(self, action: Action, 
                          context: dict) -> ComplianceReport:
        """
        Returns ComplianceReport:
        - passed: list[Check]
        - failed: list[Check]
        - warnings: list[Check]
        - required_changes: list[str]
        """
    
    def check_project(self, project_name: str) -> ComplianceReport:
        """Full project compliance audit."""
    
    def enforce_decisions(self, plan: ExecutionPlan) -> ExecutionPlan:
        """Modify plan to comply with decisions."""
```

**Decision Rules** (from decisions.md):
- Token Plan only (¥200/mo), NO pay-as-you-go
- All CLIs → coding.dashscope.aliyuncs.com endpoint
- OmniRoute for fallback routing
- Bailian CLI for multimedia
- belentani.eu → JUDAS_OS portal
- GitHub contributions to top projects
- Ambassador programs: Qwen, HF, Alibaba Cloud
- Email automation via Gmail App Password
- Backup: GitHub + HF + IPFS
- Monetization: Digital products + services

---

### 3.7 Monitor (monitor.py)

**Responsibility**: Continuous health monitoring of entire ecosystem.

**Checks**:
| Category | Targets | Frequency |
|----------|---------|-----------|
| Projects | 8 active projects (GitHub Pages, APIs) | 5 min |
| APIs | Alibaba, Groq, OpenRouter, HF, OmniRoute | 1 min |
| Domains | belentani.eu, belentani.es, subdomains | 1 hour |
| Budget | Agentguard spending vs limits | Real-time |
| Sandboxes | Agentbox VM status | On-demand |
| Repos | 117+ repos (issues, builds, deploys) | 15 min |
| Skills | skills-registry, manus-ai-skill-pack | Daily |

**Interface**:
```python
class Monitor:
    def check_all(self) -> HealthReport:
        """Run all health checks."""
    
    def check_projects(self) -> list[ProjectHealth]:
        """Verify GitHub Pages, build status, deploy status."""
    
    def check_apis(self) -> list[APIHealth]:
        """Verify each provider endpoint responds."""
    
    def check_budget(self) -> BudgetHealth:
        """Query agentguard for current spending."""
    
    def check_domains(self) -> list[DomainHealth]:
        """DNS resolution, SSL, redirect status."""
    
    def alert(self, report: HealthReport):
        """Send alerts for degraded/unhealthy items."""
```

**Alert Channels**: Console, GitHub Issues, Email (when configured)

---

## 4. Configuration

### 4.1 config.yaml
```yaml
# workflow-orchestrator/config.yaml

metaskill:
  enabled: true
  model: "qwen3.6-flash"
  endpoint: "http://localhost:20128/v1"
  archetypes_file: "~/.belentani/shared-context/patterns.md"

omniroute:
  config_path: "~/.omniroute/config.yaml"
  local_endpoint: "http://localhost:20128/v1"
  timeout: 30000
  fallback_enabled: true

cli_tools:
  qwen:
    command: "qwen"
    args: ["--model", "qwen3.6-flash"]
    env: {DASHSCOPE_API_KEY: "${DASHSCOPE_API_KEY}"}
    strength: ["heavy-coding", "token-plan"]
  claude:
    command: "claude"
    args: ["--model", "qwen3.6-flash"]
    env: {ANTHROPIC_API_KEY: "${ANTHROPIC_API_KEY}"}
    strength: ["reasoning", "architecture"]
  codex:
    command: "codex"
    args: ["--model", "qwen3.6-flash"]
    strength: ["quick-generation"]
  opencode:
    command: "opencode"
    args: ["--model", "tokenplan/qwen3.6-flash"]
    strength: ["open-source", "skills"]

secure_t:
  script_dir: "~/.agents/skills/secure-t/scripts"
  phases: 9
  auto_fix: true
  auto_deploy: false  # Requires explicit approval
  github_org: "noiacore"  # Target org (to be created)

projects:
  db_path: "~/.belentani/shared-context/projects.json"
  auto_sync: true

governance:
  decisions_file: "~/.belentani/shared-context/decisions.md"
  patterns_file: "~/.belentani/shared-context/patterns.md"
  strict_mode: true

monitor:
  interval_seconds: 300
  alert_threshold: "warning"
  channels: ["console", "github-issues"]

budget:
  agentguard_enabled: true
  monthly_limit_usd: 50
  alert_at_percent: 80

sandbox:
  agentbox_enabled: true
  default_provider: "agentbox"
  cost_limit_usd: 5
```

### 4.2 Environment Variables
```bash
# Required
DASHSCOPE_API_KEY=sk-sp-...          # Alibaba Token Plan
GROQ_API_KEY=gsk_...                 # Groq free tier
OPENROUTER_API_KEY=sk-or-...         # OpenRouter
HF_API_KEY=hf_...                    # HuggingFace
GITHUB_TOKEN=gho_...                 # GitHub (belentani7)
OMNIROUTE_KEY=omniroute              # Local gateway

# Optional
GMAIL_APP_PASSWORD=...               # Email automation
BAILIAN_API_KEY=...                  # Bailian CLI
VERCEL_TOKEN=...                     # Vercel deploy
CLOUDFLARE_API_TOKEN=...             # Cloudflare Pages
```

---

## 5. Storage

### 5.1 State Database (SQLite)
**File**: `./data/orchestrator.db`

**Tables**:
```sql
-- Task execution history
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    request TEXT,
    classification_json TEXT,
    priority_score REAL,
    model_selection_json TEXT,
    execution_plan_json TEXT,
    result_json TEXT,
    status TEXT,  -- pending, running, completed, failed
    created_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Project sync state
CREATE TABLE project_sync (
    project_name TEXT PRIMARY KEY,
    last_sync TIMESTAMP,
    last_ranking_json TEXT,
    git_hash TEXT
);

-- Health check history
CREATE TABLE health_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_type TEXT,  -- project, api, domain, budget
    target_name TEXT,
    status TEXT,  -- healthy, warning, critical
    details_json TEXT,
    checked_at TIMESTAMP
);

-- Governance violations
CREATE TABLE violations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project TEXT,
    decision_id TEXT,
    description TEXT,
    severity TEXT,  -- critical, high, medium, low
    detected_at TIMESTAMP,
    resolved_at TIMESTAMP
);
```

---

## 6. CLI Interface

### 6.1 Commands
```bash
# Main entry point
python -m orchestrator --help

# Single task execution
python -m orchestrator execute "Build a cyberpunk landing page for Judas Experience"

# Batch from file
python -m orchestrator batch tasks.txt

# Project management
python -m orchestrator projects list
python -m orchestrator projects rank
python -m orchestrator projects next

# Secure-t pipeline
python -m orchestrator secure-t belentani/judas-experience --scope full-ship

# Governance
python -m orchestrator governance check belentani-core
python -m orchestrator governance enforce

# Monitoring
python -m orchestrator monitor once
python -m orchestrator monitor daemon

# Configuration
python -m orchestrator config show
python -m orchestrator config validate
```

### 6.2 Interactive Mode
```bash
python -m orchestrator interactive
# Starts REPL with:
# - Task input with auto-classification preview
# - Priority ranking preview
# - Model/CLI selection preview
# - Dry-run option
# - Execution with live streaming
```

---

## 7. Testing Strategy

### 7.1 Unit Tests (per module)
- `tests/test_router.py` - Classification accuracy on known tasks
- `tests/test_priority.py` - Ranking algorithm correctness
- `tests/test_omniroute.py` - Model selection logic
- `tests/test_launcher.py` - Tool selection matrix
- `tests/test_secure_t.py` - Phase execution mocks
- `tests/test_governance.py` - Decision compliance checks
- `tests/test_monitor.py` - Health check mocks

### 7.2 Integration Tests
- `tests/integration/test_full_flow.py` - End-to-end task execution
- `tests/integration/test_secure_t_integration.py` - Real repo audit
- `tests/integration/test_multi_cli.py` - All 4 CLIs launch correctly

### 7.3 Fixtures
- Sample requests for each task type
- Mock OmniRoute responses
- Mock GitHub API responses
- Sample projects.json, decisions.md

---

## 8. Deployment

### 8.1 Local Development
```bash
# Install dependencies
pip install -r requirements.txt
npm install  # For CLI launcher if Node.js

# Run OmniRoute gateway (separate terminal)
omniroute start

# Run orchestrator
python -m orchestrator interactive
```

### 8.2 GitHub Repository
- **Repo**: `belentani7/workflow-orchestrator` (to be migrated to `noiacore/workflow-orchestrator`)
- **Branch Protection**: main + develop
- **CI/CD**: GitHub Actions (test, lint, build)
- **CodeQL**: Enabled
- **Dependabot**: Enabled

### 8.3 Production Deployment
- **Schedule**: Cron job for monitor daemon
- **Webhook**: GitHub webhook triggers on repo events
- **Dashboard**: Optional web UI (future)

---

## 9. Success Criteria

| Metric | Target |
|--------|--------|
| Task classification accuracy | >95% on test set |
| Priority ranking correlation with manual | >0.9 Spearman |
| Model selection cost reduction | >50% vs single provider |
| Secure-t pipeline automation | 100% phases executable |
| Governance compliance detection | 100% of decisions.md rules |
| Monitor coverage | 100% of 6 categories |
| End-to-end latency (classify→execute) | <5 seconds overhead |
| Test coverage | >80% |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OmniRoute unavailable | Medium | High | Fallback to direct provider APIs |
| MetaSkill misclassification | Low | Medium | Confidence threshold + human review |
| CLI tool not installed | Medium | Low | Auto-install via package manager |
| Secure-t phase failure | Medium | High | Phase-level retry, manual override |
| Budget exceeded | Low | High | Agentguard hard limits + alerts |
| GitHub API rate limits | Medium | Medium | Caching, exponential backoff |

---

## 11. Future Extensions

1. **Web Dashboard** - Real-time workflow visualization
2. **GitHub App** - Native integration with repos
3. **Skill Marketplace** - Auto-discover/install skills
4. **Multi-user** - Team collaboration, shared state
5. **ML-based Priority** - Learn from execution history
6. **Voice Interface** - Natural language via Whisper/TTS

---

*End of Specification*
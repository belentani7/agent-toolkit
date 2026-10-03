# ARCHITECTURE — BELENTANI ECOSYSTEM

**Last Updated:** 2026-09-09 (Day Zero)
**Status:** INITIAL DOCUMENTATION

---

## HIGH-LEVEL ARCHITECTURE

```
BELENTANI Ω
│
├── 00_ORCHESTRATOR
│   ├── PROJECT_MAP.md        ← This file
│   ├── DECISIONS.md          ← Decision log
│   ├── TASKS.md              ← Task queue
│   └── CHANGELOG.md          ← History
│
├── 01_CORE
│   ├── design-system         ← Shared tokens, components
│   ├── components            ← Reusable UI primitives
│   ├── utilities             ← Shared functions, helpers
│   └── shared-assets         ← Fonts, icons, images
│
├── 02_WEB
│   ├── belentani             ← Main sites
│   ├── experience            ← Immersive/3D
│   └── public-sites          ← Landing, marketing
│
├── 03_AI
│   ├── agents                ← Specialized agents
│   ├── skills                ← Skill definitions
│   ├── orchestration         ← Multi-agent coordination
│   └── local-models          ← Ollama, local inference
│
├── 04_CREATIVE
│   ├── NOIACORE              ← Lab/experimental
│   ├── JUDAS                 ← Bleeding-crystal aesthetic
│   ├── audiovisual           ← Video/audio pipelines
│   └── prompt-engineering    ← Prompt libraries
│
├── 05_PRODUCTS
│   ├── ManosAbiertas         ← Migrante education (3,686+ resources)
│   ├── CV-AI                 ← AI-powered CV
│   ├── Linguaforge           ← Language tools
│   └── other-products
│
└── 99_ARCHIVE
    └── (frozen references)
```

---

## SECURE-T-APP ARCHITECTURE (Canonical Target)

### Monorepo Structure
```
secure-t-app/
├── client/                    # React 19 + Vite 7 (frontend)
│   ├── src/
│   ├── index.html
│   └── public/
├── server/                    # Express + esbuild (backend)
│   └── index.ts
├── shared/                    # Shared types, schemas (Zod)
├── drizzle/                   # Database schema + migrations
├── api/                       # API routes
├── auth/                      # Authentication
├── components.json            # shadcn/ui config
├── vite.config.ts             # Vite config (root: client, outDir: dist/public)
├── vercel.json                # Vercel config (outputDirectory: dist/public)
├── netlify.toml               # Netlify config (publish: dist/public)
├── wrangler.toml              # Cloudflare Pages (pages_build_output_dir: dist/public)
├── tsconfig.json              # TypeScript config
├── vitest.config.ts           # Vitest config
└── package.json               # pnpm workspace
```

### Data Flow
```
Client (React/Wouter) 
    ↓ API calls
Server (Express) 
    ↓ Drizzle ORM
PostgreSQL Database
```

### Key Architectural Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| **pnpm only** | Lockfile consistency, workspace support | ✅ Enforced |
| **Vite framework** | Not "other" — Biblia §5 compliant | ✅ Verified |
| **Single outDir** | `dist/public` across all 3 platforms | ✅ Verified |
| **Wouter (no RouterProvider)** | Biblia §5: wouter never RouterProvider | ✅ Patched |
| **esbuild for server** | Fast, native ESM, external packages | ✅ Configured |
| **Drizzle ORM** | Type-safe, lightweight, SQL-native | ✅ Configured |
| **Zod schemas** | Runtime validation, shared types | ✅ In shared/ |
| **Tailwind 4 + shadcn** | Modern, composable, accessible | ✅ Configured |
| **Vitest** | Fast, Vite-native testing | ✅ Configured |

### Security Architecture (Biblia §11 - Zero-PII)
- **Client UUID:** `secure-t_<uuid>_<ts>` (365d, localStorage only)
- **Stateless verify-token:** No server-side session
- **Presigned downloads:** 24h expiry + watermark JSON
- **Blind audit:** Counters only, no PII in logs
- **audit-pii.mjs:** Must print NO-PII

---

## CROSS-REPO SHARED LAYER (Target)

### 01_CORE/design-system
- Design tokens (colors, spacing, typography, motion)
- Base components (Button, Input, Card, Dialog, etc.)
- Theme provider (dark/light, brand variants)

### 01_CORE/components
- Composed components built on design-system
- Form components (React Hook Form + Zod)
- Data display (Tables, Charts via Recharts)
- Navigation (Sidebar, Tabs, Breadcrumbs)

### 01_CORE/utilities
- `cn()` / `clsx` + `tailwind-merge`
- Date formatting, validation helpers
- API client (Axios + interceptors)
- Error boundaries, logging

### 01_CORE/shared-assets
- Fonts (variable fonts preferred)
- Icon sets (Lucide + custom)
- Brand assets (logos, illustrations)

---

## AGENT ARCHITECTURE

| Agent | Role | Scope |
|-------|------|-------|
| **ORCHESTRATOR** | Coordinates, plans, delegates | Cross-repo |
| **ARCHITECT** | Architecture decisions, reviews | Strategic |
| **FRONTEND** | React, Vite, Tailwind, shadcn | 02_WEB, 05_PRODUCTS |
| **BACKEND** | Express, Drizzle, APIs, Auth | 03_AI, secure-t |
| **DESIGN** | Visual audit, design tokens, motion | 01_CORE, all |
| **RESEARCH** | Tech eval, model selection, benchmarks | 03_AI |
| **SECURITY** | PII audit, gitleaks, deps, headers | All |
| **TEST** | Vitest, Playwright, coverage | All |
| **DEBUG** | Root cause, reproduction, fix | All |
| **DOCUMENTATION** | PROJECT_MAP, ARCHITECTURE, CHANGELOG | All |
| **RELEASE** | Versioning, deploy, CI/CD | All |

---

## CI/CD ARCHITECTURE

### Standard Pipeline (per repo)
```
Push → CI (install → check → test → build) 
    → Deploy Preview → Manual Approve → Deploy Prod
    → Healthcheck (HTTP 200) → Receipt Commit
```

### Platform Targets
| Platform | Config | Deploy Trigger |
|----------|--------|----------------|
| Vercel | `vercel.json` | Push main |
| Netlify | `netlify.toml` | Push main |
| Cloudflare Pages | `wrangler.toml` | Push main |
| GitHub Pages | `.github/workflows/deploy-pages.yml` | Push main |

### Healthcheck Standard
```bash
# Must return 200, not just "dashboard READY"
Invoke-WebRequest <prod-url> | Select-Object StatusCode
```

---

## DATA ARCHITECTURE

### PostgreSQL (Drizzle)
- Schema in `drizzle/` (versioned migrations)
- Types generated to `shared/` (Zod schemas)
- Connection via `DATABASE_URL` env

### Zero-PII Data Model
- No personal identifiers in DB
- Client-side UUID only
- Server sees only hashed/anonymous counters
- Presigned URLs for file access

---

## ENVIRONMENT ARCHITECTURE

### Required Env Vars (per repo)
```bash
# Runtime
DATABASE_URL=
NODE_ENV=production

# Platform (auto-injected)
VERCEL_URL=
NETLIFY_URL=
CF_PAGES_URL=

# Optional (per feature)
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
```

### Secret Management
- **Never** in repo (gitleaks enforced)
- **Never** in Vercel/Netlify dashboard (audit trail)
- **Only** via platform secret injection at deploy time
- **Local:** `.env` (gitignored) or User env vars

---

## OBSERVABILITY ARCHITECTURE

### Logging
- Structured JSON logs (stdout)
- No PII in logs
- Correlation IDs for request tracing

### Metrics (Target)
- Build time, test duration
- Bundle size (gzipped)
- Core Web Vitals
- Error rates by type

### Alerting (Target)
- Build failure → immediate
- Deploy failure → immediate
- Healthcheck 200 failure → immediate
- PII detection → immediate

---

## MIGRATION STRATEGY

### Framework Migration (e.g., Vite → Next)
1. New repo with target framework
2. Shared components from 01_CORE
3. Parallel deploy → compare → switch
4. Old repo → ARCHIVE

### Database Migration
- Drizzle migrations versioned
- Backward compatible when possible
- Rollback plan documented in DECISIONS.md

### Model Migration (AI providers)
- Provider abstraction layer in 03_AI
- Config-driven model selection
- Fallback chain: primary → secondary → local

---

## SCALABILITY TARGETS

| Metric | Target |
|--------|--------|
| Repos managed | 500+ |
| Concurrent agents | 10+ |
| Build time (median) | < 3 min |
| Deploy frequency | Daily |
| PII incidents | 0 |
| Critical vulns | 0 |
| Test coverage | > 80% |
| Doc coverage | 100% decisions |
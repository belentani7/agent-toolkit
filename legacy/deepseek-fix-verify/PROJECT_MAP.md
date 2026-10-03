# PROJECT MAP — BELENTANI ECOSYSTEM

**Last Updated:** 2026-09-09 (Day Zero)
**Status:** INITIAL SCAN COMPLETE
**Workspace:** `deepseek-fix-verify-1` → Operating on `secure-t-app` (canonical target)

---

## WORKSPACE INVENTORY

### Active Workspace: `deepseek-fix-verify-1`
- **Purpose:** DeepSeek V4 Pro Fix-Verify orchestration
- **Key Files:**
  - `00_SYSTEM_PROMPT.md` — DeepSeek role definition
  - `01_TASKS.json` — 10-target mission queue
  - `02_DIAGNOSIS_TEMPLATE.json` — Diagnosis schema
  - `03_RECEIPT_TEMPLATE.md` — Receipt schema
  - `DEEPSEEK-V4-PRO-FIX-VERIFY-PLAN.md` — Full mission plan

---

## TARGET REPOSITORIES (from 01_TASKS.json)

| ID | Path | Type | Status | Classification |
|----|------|------|--------|----------------|
| T1 | `C:\Users\USER\belentani-v2` | audit-mark-final | PENDING | CORE |
| T2 | `C:\Users\USER\.tmp-duck-check\newbelentani` | classify | PENDING | EXPERIMENTAL |
| T3 | `C:\Users\USER\Documents\Belentani-Agency-AI-Omega` | classify | PENDING | CORE |
| T4 | `C:\Users\USER\.tmp-duck-check\newbelentani-judas` | build-check | PENDING | EXPERIMENTAL |
| T5 | `C:\Users\USER\belentani7-profile` | build-check | PENDING | ACTIVE |
| T6 | `C:\Users\USER\belentani-campaign-repo` | classify-audio-pipeline | PENDING | EXPERIMENTAL |
| T7 | `belentani-judas-web` vs `belentani-unified` | dedupe-keep-one | PENDING | DUPLICATE |
| T8 | `C:\Users\USER\belentani-core` (681MB) | compact-classify-last | PENDING | LEGACY |
| **T9** | `C:\Users\USER\secure-t-app` | **biblia-s2-conformance-plus-audit-pii-plus-200** | **IN PROGRESS** | **CORE (CANONICAL)** |
| T10 | Python sweep (55 errors) | bulk-fix | PENDING | DEPENDENCY |

---

## SECURE-T-APP — CURRENT ANALYSIS (MAP PHASE COMPLETE)

### Stack
- **Runtime:** Node.js 22, pnpm 10.4.1
- **Frontend:** React 19.2.1, Vite 7.1.7, Tailwind 4.1.14, Wouter 3.3.5 (patched)
- **Backend:** Express 4.21.2, esbuild bundling
- **Database:** Drizzle ORM + PostgreSQL (`pg`)
- **Testing:** Vitest 2.1.4
- **TypeScript:** 5.6.3 (strict)

### Build Configuration
| Config | Output Directory | Status |
|--------|------------------|--------|
| `vite.config.ts` | `dist/public` | ✅ Explicit |
| `vercel.json` | `dist/public` | ✅ Matches |
| `netlify.toml` | `dist/public` | ✅ Matches |
| `wrangler.toml` | `dist/public` | ✅ Matches |

**Golden Rule (Biblia §3): PASSED** — Single output dir identical across all 3 platforms.

### Scripts
```json
"dev": "vite --host",
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
"start": "NODE_ENV=production node dist/index.js",
"check": "tsc --noEmit",
"test": "vitest run --config vitest.config.ts",
"db:generate": "drizzle-kit generate"
```

### CI/CD
- **CI (`.github/workflows/ci.yml`):** Node 22, pnpm install --no-frozen-lockfile, check, test, build
- **Deploy Pages (`.github/workflows/deploy-pages.yml`):** Build → Upload `dist/public` → GitHub Pages

### Key Observations
1. **Patched dependency:** `wouter@3.7.1` via `patches/wouter@3.7.1.patch` (Biblia compliant: no RouterProvider)
2. **Framework:** `vite` (correct, not "other")
3. **Root directory:** Implicit `.` (correct)
4. **Zero-PII target:** `audit-pii.mjs` script referenced in Biblia §11
5. **Deploy name:** Must be exactly `secure-t` (Biblia §11 checklist)

---

## ECOSYSTEM REPOS (GitHub `belentani7` - 109 repos)

### Known Core Repos
- `belentani-v2` — Foundation
- `secure-t-app` → `secure-t-platform` (canonical consolidation target)
- `belentani-core` (681MB) — Heavy core
- `belentani7-profile` — Profile site
- `belentani-campaign-repo` — Audio pipeline
- `belentani-judas-web` / `belentani-unified` — Judas era (duplicate pair)
- `Belentani-Agency-AI-Omega` — Agency/Omega
- `newbelentani` / `newbelentani-judas` — Temp/duck-check

### Ecosystems (from README.md)
- NOIACORE LAB
- DUCK (music/apps)
- JUDAS (bleeding-crystal aesthetic)
- OMEGA (artist)
- secure-t (cyber+AI university)
- nexus-os (38+ apps neon-glass OS)
- ManosAbiertas (migrante education)
- CARQUIDEC
- belentani-experience (3D neural core)

---

## CLASSIFICATION SCHEMA

| Tag | Meaning |
|-----|---------|
| `CORE` | Foundational, canonical, production |
| `ACTIVE` | In development, high priority |
| `EXPERIMENTAL` | R&D, prototypes, temp |
| `DEPENDENCY` | Shared libs, internal packages |
| `LEGACY` | Old, large, needs audit/compact |
| `ARCHIVE` | Frozen, reference only |
| `DUPLICATE` | Candidate for merge/quarantine |
| `CANDIDATE_FOR_MERGE` | Ready to consolidate |

---

## NEXT ACTIONS

1. **Complete T9 secure-t-app** — Fix → Verify → 200 → Receipt → Push
2. **Execute T10 Python sweep** — 55 errors: cp1252, relative-import, missing-dep
3. **Process T1-T8** in order per plan
4. **Build PROJECT_MAP.md** for each repo as completed
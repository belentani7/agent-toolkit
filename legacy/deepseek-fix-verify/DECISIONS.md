# DECISIONS LOG — BELENTANI ECOSYSTEM

**Format:** DECISION | WHY | ALTERNATIVES | CONSEQUENCES | DATE | AUTHOR

---

## 2026-09-09 — DAY ZERO

### DECISION: Adopt BELENTANI Ω40 Protocol as governing constitution
**WHY:** User explicitly defined 40-year horizon protocol. Must survive model/framework/provider changes.
**ALTERNATIVES:** Ad-hoc prompting, per-session instructions
**CONSEQUENCES:** All work governed by protocol. Anti-amnesia docs mandatory. Context economy enforced.
**DATE:** 2026-09-09
**AUTHOR:** BELTENTANI (Director) / NEMOTRON (Executor)

### DECISION: Secure-t-app as canonical target (T9) — first victory
**WHY:** Biblia §11 defines secure-t as consolidation target. Smallest canonical repo. Defines pattern for all others.
**ALTERNATIVES:** Start with belentani-v2 (T1) or belentani-core (T8)
**CONSEQUENCES:** Fix-verify cycle proven on secure-t becomes template for T1-T8, T10.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (per protocol Phase 5: First Victory)

### DECISION: pnpm@10.4.1 as sole package manager (enforced via packageManager field)
**WHY:** Biblia §5: pnpm repos never npm install. Lockfile consistency. Workspace support.
**ALTERNATIVES:** npm, yarn, bun
**CONSEQUENCES:** All repos must use pnpm. CI uses `corepack enable && corepack prepare pnpm@10.4.1 --activate`.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (observed in secure-t-app package.json)

### DECISION: Vite as framework (not "other") — Biblia §5 compliant
**WHY:** Biblia §5 playbook F3: static site with vite framework → `"framework": null` (never `"other"`).
**ALTERNATIVES:** Next.js, Astro, Remix, "other"
**CONSEQUENCES:** Vercel/Netlify/Cloudflare detect Vite correctly. No framework misconfiguration.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (verified in vercel.json)

### DECISION: Single output directory `dist/public` across all 3 platforms
**WHY:** Biblia §3 Golden Rule: 1 project = 1 output dir, identical in all 3 platform configs.
**ALTERNATIVES:** Different output dirs per platform
**CONSEQUENCES:** Vercel `outputDirectory`, Netlify `publish`, Wrangler `pages_build_output_dir` all = `dist/public`. Verified in MAP phase.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (verified across vite.config.ts, vercel.json, netlify.toml, wrangler.toml)

### DECISION: Wouter 3.3.5 patched (no RouterProvider) — Biblia §5 compliant
**WHY:** Biblia §5: "wouter never RouterProvider". Patch in `patches/wouter@3.7.1.patch`.
**ALTERNATIVES:** React Router, TanStack Router, unpatched Wouter
**CONSEQUENCES:** Bundle size minimal. No RouterProvider pattern. Patch must be maintained.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (observed in package.json pnpm.patchedDependencies)

### DECISION: esbuild for server bundling (external packages, ESM output)
**WHY:** Fast, native ESM, keeps node_modules external. Matches `type: "module"` in package.json.
**ALTERNATIVES:** tsc, swc, webpack, tsup
**CONSEQUENCES:** Server builds to `dist/` (separate from client `dist/public`). Start script runs `dist/index.js`.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (observed in package.json build script)

### DECISION: Drizzle ORM + PostgreSQL + Zod schemas
**WHY:** Type-safe, SQL-native, lightweight. Zod provides runtime validation + shared types.
**ALTERNATIVES:** Prisma, TypeORM, raw SQL, Knex
**CONSEQUENCES:** Schema in `drizzle/`, migrations versioned. Types generated to `shared/`.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (observed in dependencies)

### DECISION: Tailwind 4 + shadcn/ui + Radix primitives
**WHY:** Modern, composable, accessible. shadcn provides component ownership (copy-paste).
**ALTERNATIVES:** MUI, Chakra, custom CSS, UnoCSS
**CONSEQUENCES:** Components in `client/src/components/ui/`. Tokens in Tailwind config. Dark mode via `next-themes`.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (observed in dependencies, components.json)

### DECISION: Vitest for testing (Vite-native)
**WHY:** Fast, shares Vite config, ESM native. Configured in `vitest.config.ts`.
**ALTERNATIVES:** Jest, Playwright (e2e only), uvu
**CONSEQUENCES:** Unit/integration tests in `tests/` or co-located. CI runs `pnpm test`.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (observed in package.json scripts)

### DECISION: Git as memory — commits as comprehensible units
**WHY:** Protocol §X: Git is historical memory. No giant unrevertable transforms.
**ALTERNATIVES:** Squash-only, no history, monolithic commits
**CONSEQUENCES:** Each fix = one commit with rule code. Receipt committed. Pre-destructive STOP protocol.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (per protocol §X)

### DECISION: Context economy — targeted reads over full scans
**WHY:** Protocol §XI: Maximum production per token. Index → targeted read → execute → verify.
**ALTERNATIVES:** Read entire codebase each session
**CONSEQUENCES:** PROJECT_MAP.md, ARCHITECTURE.md serve as indices. Only relevant files read per task.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (per protocol §XI)

### DECISION: Zero-PII architecture for secure-t (Biblia §11)
**WHY:** User requirement: "consolidate 6 duplicated secure-t* folders → 1 monorepo secure-t-platform". Zero-PII = client UUID, stateless verify-token, presigned 24h downloads, blind audit.
**ALTERNATIVES:** Traditional auth/session, server-side PII storage
**CONSEQUENCES:** `audit-pii.mjs` must print NO-PII. gitleaks clean. No PII in logs, DB, or analytics.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (per Biblia §11, user directive)

### DECISION: Deploy name must be exactly `secure-t`
**WHY:** Biblia §11 checklist: "vercel deploy --prod named exactly `secure-t`".
**ALTERNATIVES:** Any other name
**CONSEQUENCES:** Vercel project name = `secure-t`. Custom domain mapping accordingly.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (per Biblia §11)

### DECISION: Healthcheck = HTTP 200 on prod URL (not dashboard READY)
**WHY:** Protocol Definition of Done: "Invoke-WebRequest prod URL must be 200 (dashboard READY is NOT proof)".
**ALTERNATIVES:** Trust dashboard status
**CONSEQUENCES:** Every deploy verified with `Invoke-WebRequest <url> | Select StatusCode`. Must return 200.
**DATE:** 2026-09-09
**AUTHOR:** NEMOTRON (per protocol Definition of Done)

---

## TEMPLATE FOR FUTURE DECISIONS

```
### DECISION: [Title]
**WHY:** [Rationale]
**ALTERNATIVES:** [What else was considered]
**CONSEQUENCES:** [What this means for the system]
**DATE:** YYYY-MM-DD
**AUTHOR:** [AGENT/DIRECTOR]
```
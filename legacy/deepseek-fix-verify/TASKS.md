# TASKS — BELENTANI ECOSYSTEM

**Format:** ID | PROJECT | PHASE | PRIORITY | STATUS | ASSIGNED | DEPENDS_ON | NOTES

---

## MISSION QUEUE (from 01_TASKS.json + Ω40 Protocol)

| ID | Project | Phase | Priority | Status | Assigned | Depends On | Notes |
|----|---------|-------|----------|--------|----------|------------|-------|
| T9-MAP | secure-t-app | MAP | P0 | ✅ DONE | NEMOTRON | — | Configs read, golden rule verified |
| T9-FIX | secure-t-app | FIX | P0 | 🔄 NEXT | NEMOTRON | T9-MAP | Run install → build → check → test → audit-pii |
| T9-VERIFY | secure-t-app | VERIFY | P0 | ⏳ | NEMOTRON | T9-FIX | HTTP 200 on prod URL |
| T9-COMMIT | secure-t-app | COMMIT | P0 | ⏳ | NEMOTRON | T9-VERIFY | Git add, commit with rule codes, push |
| T9-RECEIPT | secure-t-app | RECEIPT | P0 | ⏳ | NEMOTRON | T9-COMMIT | 03_RECEIPT_TEMPLATE.md filled + committed |

| T1 | belentani-v2 | AUDIT | P1 | ⏳ | NEMOTRON | T9 | Audit + mark final |
| T2 | newbelentani | CLASSIFY | P1 | ⏳ | NEMOTRON | T9 | Classify: docs vs code |
| T3 | Belentani-Agency-AI-Omega | CLASSIFY | P1 | ⏳ | NEMOTRON | T9 | Classify: docs vs code |
| T4 | newbelentani-judas | BUILD-CHECK | P1 | ⏳ | NEMOTRON | T9 | Package.json present → build check |
| T5 | belentani7-profile | BUILD-CHECK | P1 | ⏳ | NEMOTRON | T9 | Package.json present → build check |
| T6 | belentani-campaign-repo | CLASSIFY-AUDIO | P1 | ⏳ | NEMOTRON | T9 | Audio pipeline classify |
| T7 | belentani-judas-web + belentani-unified | DEDUPE | P1 | ⏳ | NEMOTRON | T9 | Keep 1, quarantine 1 |
| T8 | belentani-core (681MB) | CLASSIFY-LAST | P1 | ⏳ | NEMOTRON | T9 | Compact context, classify last |
| T10 | Python sweep (55 errors) | BULK-FIX | P1 | ⏳ | NEMOTRON | T9 | cp1252, relative-import, missing-dep |

---

## DAY ZERO PHASES (Ω40 Protocol §XII)

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 1 | RECONOCIMIENTO — Scan workspace, identify active project, related repos | ✅ DONE | secure-t-app identified as canonical |
| 2 | CARTOGRAFÍA — Create ecosystem map | ✅ DONE | PROJECT_MAP.md created |
| 3 | SALUD — Detect broken builds, obsolete deps, errors, tech debt, junk, duplication, dangerous configs | 🔄 NEXT | Run on secure-t-app first |
| 4 | PRIORIDADES — Assign P0/P1/P2/P3 | ✅ DONE | T9 = P0, T1-T8, T10 = P1 |
| 5 | PRIMERA VICTORIA — ONE priority project: CURRENT → FUNCTIONAL → VERIFIED → POLISHED | 🔄 NEXT | secure-t-app |
| 6 | SISTEMA — Leave mechanism to continue tomorrow without losing context | ⏳ | Anti-amnesia docs created |

---

## SECURE-T-APP FIX-VERIFY CYCLE (Detailed)

### MAP ✅ COMPLETE
- [x] Read package.json
- [x] Read vite.config.ts (outDir: dist/public)
- [x] Read vercel.json (outputDirectory: dist/public)
- [x] Read netlify.toml (publish: dist/public)
- [x] Read wrangler.toml (pages_build_output_dir: dist/public)
- [x] Read .github/workflows/ci.yml
- [x] Read .github/workflows/deploy-pages.yml
- [x] Verify golden rule: single outDir across all 3 platforms
- [x] Verify framework: vite (not "other")
- [x] Verify rootDirectory: implicit "."
- [x] Verify wouter: patched, no RouterProvider
- [x] Environment vars set (User scope)

### FIX 🔄 NEXT
- [ ] `pnpm install --no-frozen-lockfile` — OK
- [ ] `pnpm run build` — green offline, no secrets
- [ ] `pnpm run check` (tsc --noEmit) — 0 errors
- [ ] `pnpm test` — pass or NO-TESTS receipt
- [ ] `pnpm run audit-pii` (if script exists) — clean
- [ ] `gitleaks` — clean

### VERIFY ⏳
- [ ] Deploy to Vercel (named exactly `secure-t`)
- [ ] `Invoke-WebRequest <prod-url>` — StatusCode 200
- [ ] Dashboard READY ≠ done

### COMMIT ⏳
- [ ] `git add -A`
- [ ] `git commit -m "fix(secure-t): <rule> — verified build+check+200"`
- [ ] `git push origin main`

### RECEIPT ⏳
- [ ] Fill 03_RECEIPT_TEMPLATE.md (before/after + rule codes + logs)
- [ ] Commit receipt

---

## TEMPLATE FOR NEW TASKS

| ID | Project | Phase | Priority | Status | Assigned | Depends On | Notes |
|----|---------|-------|----------|--------|----------|------------|-------|
| XXX | [name] | [MAP/FIX/VERIFY/COMMIT/RECEIPT] | [P0/P1/P2/P3] | [⏳/🔄/✅/❌] | NEMOTRON | [IDs] | [notes] |
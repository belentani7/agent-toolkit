# DEEPSEEK V4 PRO — PLAN 01: FIX + VERIFY ONLY (100% finish, GitHub-saved)
Saved: 2026-09-09 | Owner: Pedro Belentani (Barcelona / São Paulo) | Assistant: Muse Spark
Status: PLAN 01 of N. DeepSeek does NOT build new features here. Only fixes + proves correct.

## 0. What we understood you are building (from your docs)

You are solo builder with 309 projects / 29 finished / 109 public repos (`belentani7`).

Ecosystems (README.md):
- NOIACORE LAB, DUCK (music/apps), JUDAS (bleeding-crystal aesthetic), OMEGA (artist), secure-t (cyber+AI university), nexus-os (38+ apps neon-glass OS), ManosAbiertas (migrante education), CARQUIDEC, belentani-experience (3D neural core).

Canonical rules (BELENTANI-BIBLIA.md — written by DeepSeek Pro v4 + Claude 2026-09-08):
- ONE canonical project format: `package.json` (dev/build/check/test) + lockfile + `vercel.json` + `netlify.toml` + `wrangler.toml` + `.github/workflows/deploy-*.yml` + `base:"./"` + ONE explicit `outDir`.
- Golden rule: 1 project = 1 output dir, written IDENTICAL in all 3 platform configs.
- 7 Vercel + 8 Netlify broken sites all broke by violating exactly this. Fixed list in Biblia §1, §5 playbook (10 tricks), §6 protection (N+1 redundancy, CI-only, healthcheck, budget check).
- Approved stack: React 19, Vite 7-8, TS 5.9, Tailwind 4, wouter (no RouterProvider), drizzle, express/esbuild/tsx, vitest.

Secure-T target (SECURE-T-COMPLETO.md / LISTO-IMPLEMENTAR / BIBLIA §11):
- Consolidate 6 duplicated `secure-t*` folders → 1 monorepo `secure-t-platform/` (canonical = `secure-t-app/` today).
- Zero-PII architecture: client UUID `secure-t_<uuid>_<ts>`, 365d, localStorage only; stateless `verify-token`; presigned 24h downloads + watermark JSON; blind audit (counters only).
- Friendly UI: OnboardingFlow 4-step + CoursesGallery + 13 custom animations + PT-BR/ES/EN.
- Checklist: consolidate → copy components → pnpm install → photos → build → `vercel deploy --prod` named exactly `secure-t` → `audit-pii.mjs` → HTTP 200.

Sovereign protocol (PLAN-FINALIZACION-SOBERANA.md): 3-node gate (N1 Technical veto / N2 Product veto / N3 Sovereign final). ManosAbiertas + UX Academy declared COMPLETE; Tracks A/B/C pending.

JSON / Python sessions inventoried:
- `meta_projects.json` (2026-09-08): 9 belentani projects small→large (belentani-v2 → belentani-core 681MB). 1 functional, 8 need audit.
- `.repos-all.txt` / `repos.json` / `all_repos.json`: 109 repos source of truth.
- `.memory/memory.json` → BELENTANI-OS: 309 projects, 60 gitized, 11 pushed+verified, 44 name-dup groups, 111 quarantine candidates.
- `FINAL_EXECUTION_REPORT.json` (2026-09-08): 74 python skill scripts → 19 SUCCESS / 55 ERROR. Top errors: Windows `cp1252` UnicodeEncode on ✅/❌ prints, relative-import `attempted relative import`, missing `defusedxml`, missing CLI args. This is exactly the bulk-fix workload for DeepSeek.
- `secure-t-app/package.json`: real canonical app (React 19.2, Vite 7, drizzle, wouter 3.3.5 patched, framer-motion, zod) — the verification target.

## 1. DeepSeek V4 Pro capacity (GA 0813 2026-08-13, verified live 2026-09-09)

- Spec: 1.6T total / 49B active MoE, 1M context default, 384K max output, MIT weights (`deepseek-ai/DeepSeek-V4-Pro`), FP4 MoE + FP8 rest, CSA+HCA hybrid attention (27% FLOPs + 10% KV vs V3.2 at 1M), mHC, Muon, DSpark speculative decode, |DSML| XML tools, thinking param (non-think/high/max), API `https://api.deepseek.com` model `deepseek-v4-pro`, OpenAI+Anthropic compat.
- Scores (Harness minimal @max, temp 1.0/top_p 0.95): Terminal-Bench 2.1 **87.9**, DeepSWE 62.7, Cybergym 83.3, Toolathlon 74.1, NL2Repo 61.5, HLE 42.7 no-tools / **60.0 with tools**; preview: Terminal-Bench 2.0 67.9 (beats Opus 4.6 65.4), LiveCodeBench 93.5, SWE-Verified 80.6 (vs Opus 80.8), Codeforces 3206.
- Price: ~$0.435/M in / $0.87/M out (Flash $0.14/$0.28 — 12x cheaper, 79.0 SWE vs 80.6 Pro).

Where DeepSeek beats other models (use ONLY here in Plan 01):
1. 1M-context whole-repo audit in 1 pass (others chunk + hallucinate Kafka/Redis).
2. Real terminal agentic execution (87.9 TB-2.1) — bulk `pnpm build / tsc / vitest / healthcheck` loops.
3. Cheap bulk iteration ($0.87/M) — 74-script fix sweep affordable; Claude/GPT too expensive for this.
4. Strict machine verification discipline — JSON IR + receipts, no merge-safety claims, last-good preserved (same philosophy as Archify).
5. Formal/code reasoning (LiveCodeBench 93.5, Codeforces 3206) — lockfile, output-dir, patch, regex fixes.

Where DeepSeek LOSES — explicitly FORBIDDEN in Plan 01 (delegate):
- Open factual Q&A / world knowledge (HLE 37.7-42.7, trails Claude/Gemini) → no product decisions, no copywriting, no legal/pricing.
- Taste/design (frontend polish) → Claude + premium-frontend-design skill.
- Authenticated browser / logins / mobile / sheets / 50+ parallel research → Manus 1.6 Max.
- Final sovereign decision (N3) → human (you).

## 2. PLAN 01 mission: FIX + VERIFY to 100%, nothing else

Goal: every target repo reaches `BUILD GREEN + CHECK CLEAN + TESTS PASS + PII CLEAN + HTTP 200` and is pushed to GitHub with receipt. No new features. No refactors. No design changes.

Targets in order (small→large, from meta_projects.json + Biblia):
1. `belentani-v2` (audit + mark final)
2. `newbelentani`, `Belentani-Agency-AI-Omega` (classify: docs vs code)
3. `newbelentani-judas`, `belentani7-profile` (package.json present → build check)
4. `belentani-campaign-repo` (audio pipeline classify)
5. `belentani-judas-web` vs `belentani-unified` (dedupe: keep 1, quarantine 1)
6. `belentani-core` 681MB (classify last, compact context)
7. CANONICAL: `secure-t-app/` → `secure-t-platform/` (Biblia §2 format + §11 zero-PII + deploy `secure-t`)
8. PYTHON SWEEP: 55 failed skill scripts from FINAL_EXECUTION_REPORT.json (cp1252 + relative-import + missing-dep classes)

Definition of Done per repo (must ALL pass, evidence attached):
- [ ] `pnpm install --no-frozen-lockfile` OK (or lockfile regenerated + committed)
- [ ] `pnpm run build` green offline, no secrets required
- [ ] `pnpm run check` (tsc --noEmit) 0 errors
- [ ] `pnpm test` pass or explicit `NO-TESTS` receipt
- [ ] output dir == vercel.json == netlify.toml == wrangler/pages (Biblia §3 table)
- [ ] `audit-pii.mjs` clean (for secure-t) / gitleaks clean (all)
- [ ] HTTP 200 on deployed URL(s) via Invoke-WebRequest (dashboard READY ≠ done)
- [ ] pushed to GitHub `main`, public if Pages needed, CI workflows present
- [ ] `RECEIPT.md` committed (before/after + rule codes + logs)

## 3. Execution loop (DeepSeek runs this per repo, max effort)

```
MAP (read-only) → FIX (one rule at a time) → VERIFY (machine) → COMMIT → PUSH → RECEIPT
```

Step 0 — MAP (no edits):
- Read `package.json`, `vite.config.ts`, `vercel.json`, `netlify.toml`, `wrangler.toml`, `.github/workflows/*`, last build error log.
- Emit `DIAGNOSIS.json`: {outDir_real, vercel_out, netlify_publish, pages_path, lockfile_state, visibility, failing_command, error_message}.

Step 1 — FIX (apply Biblia §5 playbook in order, ONE change at a time):
- F1 lockfile `ERR_PNPM_OUTDATED_LOCKFILE` → change installCommand to `pnpm install --no-frozen-lockfile`, do NOT hand-edit lockfile.
- F2 wrong output dir (Netlify 404-ready / Vercel No Output Directory) → set all 3 configs to real `outDir`.
- F3 static site with vite framework → `"framework": null` (never `"other"`).
- F4 monorepo rootDirectory wrong → `"."` / null, never language-mismatched subdir.
- F5 private repo + Pages 422 → `gh api ... -X PATCH -f visibility=public` first.
- F6 Python cp1252 class → add `sys.stdout.reconfigure(encoding='utf-8')` + `# -*- coding: utf-8 -*-`, replace bare `print("❌...")` with ascii `[FAIL]` or UTF-8-safe wrapper. Never delete logic.
- F7 relative-import class → run as module (`python -m pkg.cli`) or fix `sys.path` bootstrap; do not flatten packages.
- F8 missing-dep class → add to requirements/skill deps (`defusedxml`), do not vendor.
- Redeploy trigger: `git commit --allow-empty -m "ci: trigger <repo> <rule>" && git push` (CLI redeploy may use stale config).

Step 2 — VERIFY (must run, must paste logs):
- `pnpm run build`, `pnpm run check`, `pnpm test` (or NO-TESTS), `node scripts/healthcheck.mjs` or `Invoke-WebRequest <prod-url> | Select StatusCode`.
- secure-t only: `pnpm scripts/audit-pii.mjs` must print NO-PII.
- Any fail → back to Step 1, same repo, next rule. Max 5 rounds then ESCALATE with logs (do not invent flags, do not re-architect).

Step 3 — SAVE TO GITHUB (per repo):
- `git add -A; git commit -m "fix(repo): <rule-code> <what> — verified build+check+200"; git push -u origin main`
- Ensure `.github/workflows/deploy-pages.yml` + vercel/netlify configs versioned (Biblia §6: config lives with code).
- Append `RECEIPT.md` at repo root: date, model `deepseek-v4-pro-0813 max`, before/after, commands + exit codes, URLs + status codes.

## 4. Routing / guardrails (so DeepSeek stays in its lane)

- DeepSeek ALLOWED: read all files, run builds/tests, edit configs + minimal code to make build green, push fixes, write receipts.
- DeepSeek FORBIDDEN: new features, UI redesign, product copy, pricing/legal, choosing final project names, deleting repos without quarantine list, committing secrets (.env, tokens), `npm install` inside pnpm repos, `wouter RouterProvider`, `sharp` without binaries.
- PowerShell JSON trap: use `-F "key=value"` or temp JSON files, never inline `-d` with nested quotes.
- Secrets: use GitHub Actions secrets + `.env.example` only. If gitleaks hook blocks, STOP and report.
- If Netlify `Account credit usage exceeded` or Cloudflare `9109 IP-restricted` → do NOT retry blindly; mark BLOCKED-HUMAN (credits / `wrangler login`) and move to next repo.
- Temperature: 0.0 for code/math fixes. `reasoning_effort=max`, `max_tokens>=65536` (up to 384K) so JSON receipts never truncate.

## 5. GitHub save plan (how 100% lands on GitHub)

- Per-repo push (8 targets + secure-t): branch `main` only, commit prefix `fix(...)`, receipt committed same push.
- New tracking repo (1): `belentani7/deepseek-fix-verify` containing THIS plan + `deepseek-fix-verify/` prompts + all RECEIPTs mirrored. Create once:
  `gh repo create belentani7/deepseek-fix-verify --public --source=. --push` (from folder with plan files) OR manual upload if gh absent.
- Quarantine (do NOT delete): duplicates list (`belentani-judas-web` vs `belentani-unified`, 6x secure-t, factory/factory) → `QUARANTINE.md` + move to `/Archive/` only after human N3 sign.
- Final gate: `HEALTHCHECK-ALL.md` with every prod URL + 200 + date. N1 (DeepSeek logs) → N2 (Claude review) → N3 (you sign).

## 6. First 3 DeepSeek runs (copy-paste ready, cheapest order)

Run 1 (15 min, proves loop): `belentani-v2` audit + mark final. Expected: 1 DIAGNOSIS + 1 RECEIPT, zero code changes.
Run 2 (1 hr, biggest value): Python 55-error sweep — fix cp1252 class across skill scripts (mechanical, DeepSeek's best lane). Verify with `EXECUTE_ALL_PYTHON_FINAL.py` re-run showing 55→0 in that class.
Run 3 (2 hr, canonical win): `secure-t-app` Biblia-§2 conformance (vercel/netlify/wrangler/pages alignment + `dist/public` check + audit-pii + HTTP 200) WITHOUT consolidation rename yet (rename needs your N3: `secure-t` prod name).

Full finish = all 8 targets + python sweep + secure-t conformance, each with RECEIPT + push. Then Plan 02 (build new) can start with Claude/Manus — not DeepSeek.

## 7. Files in this delivery

- `DEEPSEEK-V4-PRO-FIX-VERIFY-PLAN.md` (this file) — the plan DeepSeek executes.
- `deepseek-fix-verify/00_SYSTEM_PROMPT.md` — paste into DeepSeek chat/Harness system box.
- `deepseek-fix-verify/01_TASKS.json` — machine task list (8 repos + python sweep + gates).
- `deepseek-fix-verify/02_DIAGNOSIS_TEMPLATE.json` + `03_RECEIPT_TEMPLATE.md` — enforced outputs.

---
name: verification-loop
description: Comprehensive verification system. Run after features, before PRs, after refactoring.
origin: adapted from ECC
---

## When to Use

Use this skill when:
- After completing a feature or significant code change
- Before creating a PR
- After refactoring
- When you want to ensure quality gates pass

## Verification Phases

Run each phase in order. STOP and fix if any phase fails.

### Phase 1: Build Verification

```bash
# Detect and run the build command
npm run build 2>&1 | tail -20
# or
pnpm build 2>&1 | tail -20
# or
cargo build 2>&1 | tail -20
# or
go build ./... 2>&1 | tail -20
```

If build fails → STOP and fix before continuing.

### Phase 2: Type Check

```bash
# TypeScript
npx tsc --noEmit 2>&1 | head -30

# Python
pyright . 2>&1 | head -30

# Rust
cargo check 2>&1 | head -30
```

Report all type errors. Fix critical ones before continuing.

### Phase 3: Lint Check

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30

# Go
golangci-lint run 2>&1 | head -30
```

### Phase 4: Test Suite

```bash
# Run tests
npm run test 2>&1 | tail -50

# With coverage
npm run test -- --coverage 2>&1 | tail -50
```

Report:
- Total tests: X
- Passed: X
- Failed: X
- Coverage: X% (if available)

### Phase 5: Security Quick Scan

```bash
# Check for hardcoded secrets
rg "sk-" --include="*.ts" --include="*.js" --include="*.py" . 2>/dev/null | head -10
rg "api_key|password|secret" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Check for debug leftovers
rg "console\.log|print\(" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

### Phase 6: Diff Review

```bash
git diff --stat
git diff --name-only
```

Verify:
- No unintended files changed
- No secrets or credentials in diff
- Changes match the stated goal

## Output

```
VERIFICATION REPORT
════════════════════════════════════════
Build:           PASS | FAIL
Type check:      PASS | FAIL (N errors)
Lint:            PASS | FAIL (N issues)
Tests:           PASS | FAIL (N/N passed)
Security:        CLEAN | ISSUES FOUND
Diff:            CLEAN | CONCERNS
════════════════════════════════════════
Overall:         PASS | FAIL
Action required: [list of fixes needed]
════════════════════════════════════════
```

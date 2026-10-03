---
name: code-review
description: Pre-landing PR review. Analyzes diff against base branch for SQL safety, race conditions, trust boundary violations, and structural issues.
origin: adapted from gstack
---

## When to Use

Use this skill when:
- The user asks to "review this PR", "code review", "check my diff"
- About to merge or land code changes
- Need a systematic review of changes

## Workflow

### Step 1: Detect base branch and get diff

```bash
# Detect base branch
BASE=$(git remote show origin 2>/dev/null | grep 'HEAD branch' | awk '{print $NF}')
[ -z "$BASE" ] && BASE="main"
[ -z "$BASE" ] && BASE="master"

# Get the diff
git diff origin/$BASE...HEAD --stat
git diff origin/$BASE...HEAD
```

### Step 2: Critical Review Categories

Apply these categories against the diff:

| Category | What to check |
|----------|---------------|
| SQL & Data Safety | String interpolation in queries, missing parameterization, N+1 patterns |
| Race Conditions | Concurrent access to shared state, missing locks, TOCTOU |
| Shell Injection | Unsanitized input in shell commands, `exec`, `spawn` |
| Type Coercion | Implicit type conversions, `==` vs `===`, loose comparisons |
| Async/Sync Mixing | Mixing callbacks with promises, missing `await`, fire-and-forget |
| Completeness Gaps | Missing error handling, unhandled edge cases, incomplete implementations |
| Security | Hardcoded secrets, missing auth checks, input validation |

### Step 3: Confidence Calibration

Every finding MUST include a confidence score (1-10):

| Score | Meaning |
|-------|---------|
| 9-10 | Verified by reading specific code. Concrete bug demonstrated. |
| 7-8 | High confidence pattern match. Very likely correct. |
| 5-6 | Moderate. Could be false positive. Mark with caveat. |
| 3-4 | Low confidence. Include in appendix only. |
| 1-2 | Speculation. Only report if severity is critical. |

### Step 4: Output Format

For each finding:
```
[SEVERITY] (confidence: N/10) file:line — description
Fix: recommended fix
```

Severity levels:
- **P0**: Security vulnerability, data loss risk
- **P1**: Bug that will hit production
- **P2**: Likely bug, needs verification
- **P3**: Code quality, maintainability

### Step 5: Summary

Provide:
1. Total findings by severity
2. Top 3 items to fix before merging
3. Overall assessment: safe to merge / needs changes / blocked

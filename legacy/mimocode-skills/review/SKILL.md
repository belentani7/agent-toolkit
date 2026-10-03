---
name: review
description: Pre-landing code review. Analyzes diff against base branch for structural issues, scope drift, and completeness gaps. Adapted from garrytan/gstack.
---

# Code Review

Systematic pre-landing review of code changes. Finds bugs that pass CI but blow up in production.

## When to Use

- User asks "review this PR", "check my diff", "code review"
- About to merge or land code changes
- After implementing a feature and before shipping

## Workflow

### Step 1: Detect platform and base branch

```bash
git remote get-url origin 2>/dev/null
```

- GitHub → `gh pr view --json baseRefName -q .baseRefName`
- GitLab → `glab mr view -F json 2>/dev/null`
- Fallback → `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||'`
- Last fallback → `main`

### Step 2: Check branch

1. `git branch --show-current` — if on base branch, nothing to review
2. `git fetch origin <base> --quiet && DIFF_BASE=$(git merge-base origin/<base> HEAD) && git diff "$DIFF_BASE" --stat` — if no diff, nothing to review

### Step 3: Scope Drift Detection

Before reviewing code quality, check: **did they build what was requested — nothing more, nothing less?**

1. Read PR description, commit messages, TODOS.md if exists
2. Identify stated intent
3. Compare files changed against intent

Check for:
- **SCOPE CREEP**: files changed unrelated to intent, "while I was in there" changes
- **MISSING REQUIREMENTS**: requirements not addressed, partial implementations

Output:
```
Scope Check: [CLEAN / DRIFT DETECTED / REQUIREMENTS MISSING]
Intent: <1-line summary>
Delivered: <1-line summary of diff>
```

### Step 4: Review Checklist

Check each changed file for:

**Structural issues:**
- SQL safety (raw queries, injection vectors)
- LLM trust boundary violations (user input reaching model without sanitization)
- Conditional side effects (code that behaves differently based on hidden state)
- Error handling gaps (swallowed errors, missing try/catch)
- Race conditions (shared mutable state, missing locks)
- Resource leaks (unclosed connections, file handles)

**Completeness:**
- Missing error paths
- Missing edge cases
- Missing tests for new logic
- Missing input validation at system boundaries

**Security:**
- Hardcoded secrets or credentials
- Unsanitized user input
- Missing authentication/authorization checks
- Insecure dependencies

### Step 5: Auto-fix obvious issues

Fix issues that are clearly wrong (typos, missing null checks, obvious bugs). Commit each fix atomically.

### Step 6: Report

```
REVIEW REPORT
═══════════════════════════════════════
Branch: <branch> vs <base>
Files changed: <N>
Issues found: <N>

[AUTO-FIXED] <description> — <file:line>
[ASK] <description> — <file:line> — needs user decision
[INFO] <observation>

Scope: [CLEAN / DRIFT / MISSING]
Status: DONE | DONE_WITH_CONCERNS | BLOCKED
═══════════════════════════════════════
```

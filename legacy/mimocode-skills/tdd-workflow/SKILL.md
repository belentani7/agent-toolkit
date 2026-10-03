---
name: tdd-workflow
description: Test-driven development workflow. Write tests first, then implement. Enforces 80%+ coverage.
origin: adapted from ECC
---

## When to Use

Use this skill when:
- Writing new features or functionality
- Fixing bugs or issues
- Refactoring existing code
- Adding API endpoints
- Creating new components

## Core Principles

1. **Tests BEFORE Code** — always write tests first
2. **Minimum 80% coverage** — unit + integration
3. **All edge cases covered** — error scenarios, boundary conditions
4. **Git checkpoints** — commit after each TDD stage

## TDD Cycle

```
     ┌──────────┐
     │   RED    │ ← Write a failing test
     └────┬─────┘
          │
     ┌────▼─────┐
     │  GREEN   │ ← Write minimal code to pass
     └────┬─────┘
          │
     ┌────▼─────┐
     │ REFACTOR │ ← Improve code, keep tests green
     └────┬─────┘
          │
          ▼
     Next feature...
```

## Workflow

### Step 1: Understand Requirements

Before writing any test:
- What should this code do?
- What are the edge cases?
- What error scenarios exist?

### Step 2: Write Failing Tests (RED)

Write tests that describe the desired behavior. They MUST fail initially.

```typescript
// Example: testing a validation function
describe('validateEmail', () => {
  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
  it('rejects missing @', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })
})
```

Run tests — they should FAIL:
```bash
npm test 2>&1 | tail -20
```

Commit the failing test:
```bash
git add <test-file>
git commit -m "test: add failing tests for [feature]"
```

### Step 3: Write Minimal Code (GREEN)

Write the simplest code that makes tests pass. No more, no less.

```typescript
function validateEmail(email: string): boolean {
  return email.includes('@') && email.length > 0
}
```

Run tests — they should PASS:
```bash
npm test 2>&1 | tail -20
```

Commit the passing implementation:
```bash
git add <source-file>
git commit -m "feat: implement [feature] — tests passing"
```

### Step 4: Refactor (optional)

Improve code quality while keeping tests green.

```bash
npm test 2>&1 | tail -20  # Must still pass
```

Commit if refactored:
```bash
git commit -m "refactor: clean up [feature] implementation"
```

## Test Types

### Unit Tests
- Individual functions and utilities
- Pure functions, helpers
- Fast, isolated

### Integration Tests
- API endpoints
- Database operations
- Service interactions

### When to use which

| Scenario | Test type |
|----------|-----------|
| Pure function | Unit |
| Function with DB | Integration |
| API endpoint | Integration |
| Full user flow | E2E (if available) |

## Coverage Check

```bash
# Check coverage
npm run test -- --coverage 2>&1 | tail -20

# Target: 80% minimum
```

If coverage < 80%:
1. Identify uncovered lines
2. Add tests for critical paths
3. Re-run until threshold met

## Output

```
TDD REPORT
════════════════════════════════════════
Feature:         [name]
Tests written:   [N]
Tests passing:   [N/N]
Coverage:        [N%]
Commits:         [N checkpoint commits]
════════════════════════════════════════
Status:          COMPLETE | IN_PROGRESS
```

---
name: security-review
description: Security review checklist for authentication, input handling, API endpoints, secrets, and sensitive features.
origin: adapted from ECC
---

## When to Use

Use this skill when:
- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data

## Security Checklist

### 1. Secrets Management

**FAIL — NEVER do this:**
```typescript
const apiKey = "sk-proj-xxxxx"  // Hardcoded secret
const dbPassword = "password123" // In source code
```

**PASS — ALWAYS do this:**
```typescript
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

Verify:
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env` in .gitignore
- [ ] No secrets in git history

### 2. Input Validation

Always validate and sanitize user input:

```typescript
import { z } from 'zod'

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

export function process(input: unknown) {
  const validated = Schema.parse(input)
  // ... safe to use validated data
}
```

Verify:
- [ ] All user inputs validated before processing
- [ ] SQL queries parameterized (no string interpolation)
- [ ] File uploads validated (size, type, extension)
- [ ] URL parameters sanitized

### 3. Authentication & Authorization

Verify:
- [ ] Auth checks on all protected routes
- [ ] Session/token expiration enforced
- [ ] Password hashing (bcrypt, argon2 — NEVER MD5/SHA1)
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection on state-changing operations

### 4. API Security

Verify:
- [ ] Input validation on all endpoints
- [ ] Output encoding (prevent XSS)
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Error messages don't leak internals

### 5. Data Protection

Verify:
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced in production
- [ ] PII handled according to requirements
- [ ] Logs don't contain secrets or PII

## Quick Scan Commands

```bash
# Find hardcoded secrets
rg "(sk-|pk-|api_key|password|secret|token)\s*[:=]\s*['\"]" --type ts --type js . 2>/dev/null

# Find potential SQL injection
rg "query.*\$\{|query.*\+" --type ts --type py . 2>/dev/null

# Find debug/test leftovers
rg "console\.log|debugger|TODO.*hack" --type ts --type js src/ 2>/dev/null

# Check .gitignore includes .env
grep -q "\.env" .gitignore 2>/dev/null && echo "OK: .env in gitignore" || echo "WARNING: .env not in gitignore"
```

## Output

```
SECURITY REVIEW
════════════════════════════════════════
Secrets:         CLEAN | ISSUES
Input validation: CLEAN | ISSUES
Auth:            CLEAN | ISSUES
API security:    CLEAN | ISSUES
Data protection: CLEAN | ISSUES
════════════════════════════════════════
Overall:         SECURE | VULNERABILITIES FOUND
Issues:          [list with severity]
════════════════════════════════════════
```

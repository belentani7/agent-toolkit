---
name: cso
description: Chief Security Officer mode. Infrastructure-first security audit with OWASP Top 10 + STRIDE threat modeling. Adapted from garrytan/gstack.
---

# Security Audit (CSO)

Infrastructure-first security audit: secrets archaeology, dependency supply chain, OWASP Top 10, STRIDE threat modeling, and active verification.

## When to Use

- User says "security audit", "check for vulnerabilities", "OWASP review"
- Before shipping to production
- Periodic security review of existing codebase

## Workflow

### Phase 1: Infrastructure-First

**1. Secrets archaeology:**
```bash
grep -rn "sk-\|api_key\|password\|secret\|token\|credentials" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" --include="*.env" . 2>/dev/null | head -20
```
Check for hardcoded secrets, API keys, tokens in source code.

**2. Dependency supply chain:**
```bash
# Go
go list -m all 2>/dev/null | head -20
# Node
npm audit 2>/dev/null | head -20
# Python
pip-audit 2>/dev/null | head -20
```
Check for known vulnerabilities in dependencies.

**3. Configuration security:**
- Check `.env` files not in `.gitignore`
- Check for debug mode in production configs
- Check CORS headers, CSP policies
- Check TLS/SSL configuration

### Phase 2: OWASP Top 10

| # | Category | What to check |
|---|----------|---------------|
| A01 | Broken Access Control | Auth checks on all endpoints, IDOR vulnerabilities |
| A02 | Cryptographic Failures | Weak algorithms, hardcoded keys, plaintext secrets |
| A03 | Injection | SQL injection, NoSQL injection, OS command injection |
| A04 | Insecure Design | Missing threat modeling, insecure architecture |
| A05 | Security Misconfiguration | Default credentials, unnecessary services, verbose errors |
| A06 | Vulnerable Components | Outdated dependencies with known CVEs |
| A07 | Auth Failures | Weak password policies, missing MFA, session management |
| A08 | Data Integrity Failures | Unsigned updates, insecure deserialization |
| A09 | Logging Failures | Missing audit logs, sensitive data in logs |
| A10 | SSRF | Unvalidated URLs in server-side requests |

### Phase 3: STRIDE Threat Model

| Threat | Description | Check for |
|--------|-------------|-----------|
| Spoofing | Identity impersonation | Weak auth, missing verification |
| Tampering | Data modification | Missing integrity checks, unsigned data |
| Repudiation | Denying actions | Missing audit trails/logs |
| Info Disclosure | Data leaks | Verbose errors, unprotected data |
| DoS | Service disruption | Rate limiting, resource limits |
| Elevation of Privilege | Unauthorized access | Missing authorization, injection |

### Phase 4: Active Verification

Run actual security tests:
- Try SQL injection on input fields
- Test authentication bypass
- Check for path traversal
- Verify CORS policies
- Test rate limiting

### Phase 5: Report

```
SECURITY AUDIT REPORT
═══════════════════════════════════════
Scope: <files/directories audited>
Date: <date>

## Critical Findings
- [CRITICAL] <finding> — <file:line> — <remediation>

## High Findings
- [HIGH] <finding> — <file:line> — <remediation>

## Medium Findings
- [MEDIUM] <finding> — <file:line> — <remediation>

## Low Findings
- [LOW] <finding> — <file:line> — <remediation>

## OWASP Coverage
A01: ✓/✗  A02: ✓/✗  A03: ✓/✗  A04: ✓/✗  A05: ✓/✗
A06: ✓/✗  A07: ✓/✗  A08: ✓/✗  A09: ✓/✗  A10: ✓/✗

## STRIDE Summary
Spoofing: ✓/✗  Tampering: ✓/✗  Repudiation: ✓/✗
Info Disclosure: ✓/✗  DoS: ✓/✗  EoP: ✓/✗

Status: CLEAN | ISSUES_FOUND | CRITICAL_ISSUES
═══════════════════════════════════════
```

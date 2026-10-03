---
name: code-audit
description: Security-focused code audit for multiple languages. Static analysis, vulnerability patterns, framework-specific checks.
origin: adapted from CyberSecurity-Skills
---

## When to Use

Use this skill when:
- Reviewing code for security vulnerabilities
- Pre-release security audit
- After discovering a vulnerability in production
- Compliance requirements (SOC 2, PCI-DSS, HIPAA)

## Workflow

### Step 1: Language Detection

```bash
# Detect project language
find . -maxdepth 2 -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.java" -o -name "*.go" -o -name "*.php" -o -name "*.rb" -o -name "*.rs" | head -10

# Check package files
ls package.json requirements.txt go.mod pom.xml Gemfile composer.json Cargo.toml 2>/dev/null
```

### Step 2: Run Static Analysis

```bash
# Python
bandit -r . -f json
semgrep --config=auto .

# JavaScript/TypeScript
npm audit
semgrep --config=auto .
eslint --ext .js,.ts . --rule 'no-eval: error'

# Java
spotbugs -textui .
find-sec-bugs .

# Go
gosec ./...

# Ruby
brakeman .
bundle-audit check

# Rust
cargo audit
cargo clippy -- -W clippy::all
```

### Step 3: Check Vulnerability Patterns

#### Injection Vulnerabilities

| Pattern | Language | Risk |
|---------|----------|------|
| `os.system(f"...")` | Python | Command injection |
| `subprocess.call(..., shell=True)` | Python | Command injection |
| `render_template_string(f"...")` | Flask | SSTI |
| `eval(...)` / `exec(...)` | Any | Code injection |
| `innerHTML = ...` | JavaScript | XSS |
| `dangerouslySetInnerHTML` | React | XSS |
| `{{ }}` in user input | Template engines | SSTI |

#### Authentication & Secrets

| Pattern | Risk |
|---------|------|
| Hardcoded API keys/tokens | Secret exposure |
| `debug=True` in production | Info disclosure |
| `ALLOWED_HOSTS = ['*']` | Host header injection |
| Missing CSRF protection | CSRF attacks |
| Weak password hashing (MD5/SHA1) | Credential theft |

#### Data Handling

| Pattern | Risk |
|---------|------|
| SQL string interpolation | SQL injection |
| `pickle.loads(untrusted)` | Deserialization RCE |
| `yaml.load()` without SafeLoader | YAML deserialization |
| Unvalidated file uploads | Path traversal, RCE |
| Missing rate limiting | Brute force |

### Step 4: Framework-Specific Checks

#### Django/Flask
- [ ] `DEBUG = False` in production
- [ ] `SECRET_KEY` from environment
- [ ] ORM used (no raw SQL with f-strings)
- [ ] `render_template` used (no `render_template_string` with user input)
- [ ] `ALLOWED_HOSTS` restricted

#### Express/Node.js
- [ ] `helmet` middleware enabled
- [ ] `express-validator` on all inputs
- [ ] `cookie-parser` secret configured
- [ ] No `eval()` or `Function()` with user input
- [ ] CORS properly configured

#### Spring Boot
- [ ] `spring.security.enabled=true`
- [ ] SQL injection via `@Query` with string concat
- [ ] Deserialization filters enabled
- [ ] Actuator endpoints secured

#### Go
- [ ] `html/template` used (not `text/template`)
- [ ] SQL parameterized queries
- [ ] No `http.ListenAndServe` without TLS
- [ ] Input validation with `go-playground/validator`

### Step 5: Output Report

```
CODE SECURITY AUDIT
════════════════════════════════════════
Project:        [name]
Language:       [language]
Framework:      [framework]
Files scanned:  [N]
════════════════════════════════════════
Critical:  [N] — [list]
High:      [N] — [list]
Medium:    [N] — [list]
Low:       [N] — [list]
════════════════════════════════════════
Top findings:
1. [file:line] — [vulnerability] — [CVSS]
2. [file:line] — [vulnerability] — [CVSS]
3. [file:line] — [vulnerability] — [CVSS]
════════════════════════════════════════
```

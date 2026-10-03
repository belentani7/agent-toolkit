---
name: design-audit
description: Review and audit UI against design principles. Check hierarchy, spacing, typography, accessibility, and interaction patterns.
origin: adapted from typeui
---

## When to Use

Use this skill when:
- Reviewing a UI implementation against design best practices
- Auditing accessibility compliance
- Checking visual hierarchy and spacing consistency
- Pre-launch design review

## Audit Workflow

### Step 1: Gather Context

```bash
# Find UI files
find . -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" | head -20
find . -name "*.css" -o -name "*.scss" -o -name "*.module.css" | head -10
```

### Step 2: Spacing Audit

Check for:

- [ ] **4-point grid compliance** — all spacing values multiples of 4px
- [ ] **At least 3 spacing tiers** — small, medium, large
- [ ] **Inner < outer gaps** — grouping is visible
- [ ] **Consistent section padding** — 96px+ desktop, 24px+ mobile
- [ ] **No arbitrary values** — no 13px, 17px, 23px etc.

**Common violations:**
```
BAD:  margin: 15px;  /* Not on 4pt grid */
GOOD: margin: 16px;  /* On 4pt grid */

BAD:  padding: 10px 10px;  /* Same inner/outer */
GOOD: padding: 8px 16px;   /* Inner < outer */
```

### Step 3: Typography Audit

Check for:

- [ ] **Font sizes ≥ 16px** for primary copy
- [ ] **Font sizes ≥ 14px** for secondary text
- [ ] **Display headings line-height: 1** for ≥28px
- [ ] **One `<h1>` per page** — only in hero
- [ ] **Sections open with `<h2>`**
- [ ] **No underlined buttons**
- [ ] **32px margin-bottom** on display headings

**Common violations:**
```
BAD:  h1 { font-size: 14px; }  /* Too small */
GOOD: h1 { font-size: 32px; }  /* Display scale */

BAD:  .hero-title { line-height: 1.5; }  /* Too loose */
GOOD: .hero-title { line-height: 1; }    /* Tight for display */
```

### Step 4: Contrast Audit

For every text/background pair:

```bash
# Find color definitions
rg "color:|background-color:|#[0-9a-fA-F]{3,8}" --type css --type tsx --type jsx . | head -20
```

Check:
- [ ] Normal text ≥ 4.5:1 contrast ratio
- [ ] Large text ≥ 3:1 contrast ratio
- [ ] No text on images without scrim/overlay
- [ ] Placeholder text meets contrast requirements

### Step 5: Component Audit

| Component | Check |
|-----------|-------|
| Badges | Not full-width, hug content |
| Inputs | Visible contrast against background |
| Buttons | No underline, proper height matching |
| Nested radius | innerRadius + gap = outerRadius |
| Icons | Balanced inset on inputs |
| Forms | Labels associated, error states clear |

### Step 6: Interaction Audit

- [ ] **Primary action is visually dominant** per surface
- [ ] **≤5 choices** in critical decision paths
- [ ] **Feedback < 100ms** for interactions
- [ ] **Progress shown** for operations > 1s
- [ ] **Focus indicators** on all interactive elements
- [ ] **Keyboard accessible** — tab order logical, no keyboard traps

### Step 7: Accessibility Audit

- [ ] **Color not sole meaning channel** — always paired with icon/text/position
- [ ] **Focus visible** on all interactive elements
- [ ] **Target size ≥ 44×44px** for touch
- [ ] **Alt text** on all meaningful images
- [ ] **Semantic HTML** — proper heading hierarchy, landmarks
- [ ] **ARIA labels** where needed, not overused

---

## Output Format

```
DESIGN AUDIT
════════════════════════════════════════
Spacing:          PASS | ISSUES (N)
Typography:       PASS | ISSUES (N)
Contrast:         PASS | ISSUES (N)
Components:       PASS | ISSUES (N)
Interaction:      PASS | ISSUES (N)
Accessibility:    PASS | ISSUES (N)
════════════════════════════════════════
Overall:          COMPLIANT | ISSUES FOUND

Critical (must fix):
1. [file:line] — description
2. [file:line] — description

Recommended (should fix):
1. [file:line] — description
════════════════════════════════════════
```

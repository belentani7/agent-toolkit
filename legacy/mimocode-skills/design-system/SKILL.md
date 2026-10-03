---
name: design-system
description: Universal UI/UX design principles — hierarchy, spacing, typography, accessibility, interaction laws. Design-system-agnostic foundations for any surface.
origin: adapted from typeui
---

## When to Use

Use this skill when:
- Making design decisions not covered by a specific design system
- Validating principle compliance
- Resolving conflicts between aesthetics and accessibility
- Building or reviewing UI components

## Application Order (Mandatory)

```
1. Design system tokens & component specs  →  ship these first
2. Spacing principles                      →  tier, grouping, inner vs outer gaps
3. UI principles                           →  refine structure, contrast, depth, interaction
4. Typography principles                   →  refine type hierarchy, leading, section headings
```

Never skip step 1. Never let steps 2-4 override a design-system token unless explicitly documented.

---

## 1. Spacing Principles

### 4-Point Grid

Use multiples of 4px for every margin, padding, and gap: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96...

| Role | Typical values | Use case |
|------|---------------|----------|
| Micro | 4px, 8px | Icon↔label inside a control |
| Tight | 8px, 12px | Within a group, list items |
| Default | 16px | Related siblings, button groups |
| Medium | 24px, 32px | Between subgroups, card grid |
| Loose | 48px, 64px | Section header → content |
| Section | 96px+ (desktop), 24px+ (mobile) | Page rhythm |

**Rule:** Use at least 3 distinct spacing tiers in every layout.

### Proximity Creates Grouping

- **Tight spacing** → "these belong together"
- **Loose spacing** → "this is a new group, section, or topic"

**Inner vs outer (non-negotiable):**
- Inner gaps (within a group) MUST be smaller than outer gaps (between groups)
- If inner = outer, the grouping is invisible

---

## 2. UI Principles

### Non-Negotiable Component Rules

- **Badges are never full width** — they hug their label, not the container
- **Inputs on matching backgrounds need visible contrast** — lighten/darken both background AND border
- **Nested border radius:** `innerRadius + distance = outerRadius`
- **Input + button rows must share height** — same total box height
- **Icon inset on inputs must balance both sides**

### Visual Hierarchy

1. **One primary action per surface** — visually dominant and reachable
2. **Group related things; separate unrelated things** — proximity, common region, similarity
3. **Limit choices in critical path** — ≤5 options per decision point
4. **Hide complexity, don't delete it** — progressive disclosure

### Interaction Design

- **Feedback within 100ms**, complete or progress within 400ms
- **Show progress, beginnings, and ends** — every multi-step flow needs a visible map
- **Front-load and end-load delight** — Peak-End Rule
- **Reduce memory load** — recognition over recall
- **Never rely on color alone** — encode meaning with 2+ channels

---

## 3. Typography Principles

### Non-Negotiable Rules

- **Buttons never use underline** — use weight, color, background, border, shadow
- **Big headings use tight line-height** — display-scale ≥28px must use `line-height: 1`
- **Section openers use `<h2>`** — only the hero uses `<h1>`, one per page
- **Big headings need 32px bottom margin** before next element

### Minimum Font Sizes

| Text type | Minimum |
|-----------|---------|
| Primary copy (body, headings, buttons) | 16px |
| Secondary/supporting text | 14px |
| Badges/micro components | 12px (only for non-readable labels) |

### Type Scale

Pick a modular ratio and derive every size from body base:

| Ratio | Name | Use case |
|-------|------|----------|
| 1.125 | Major Second | Conservative, tight interfaces |
| 1.2 | Minor Third | Most web apps |
| 1.25 | Major Third | Marketing, editorial |
| 1.333 | Perfect Fourth | Bold editorial |
| 1.414 | Augmented Fourth | Dramatic, cinematic |
| 1.5 | Perfect Fifth | Poster, headline-heavy |
| 1.618 | Golden Ratio | Rarely needed |

---

## 4. Accessibility (WCAG 2.1/2.2 AA Baseline)

**Accessibility overrides everything.** When a rule conflicts with a visual preference — accessibility wins.

### Text Contrast

| Text type | AA minimum | AAA target |
|-----------|-----------|-----------|
| Normal text (<18pt, <14pt bold) | 4.5:1 | 7:1 |
| Large text (≥18pt / 24px, ≥14pt bold / 18.5px) | 3:1 | 4.5:1 |

### Key Rules

- **Never rely on color alone** — use color + icon, color + text, or color + position
- **Focus visible** — every interactive element must have a visible focus indicator
- **Keyboard navigation** — all functionality accessible via keyboard
- **Target size** — minimum 44×44px for touch targets
- **Motion safety** — respect `prefers-reduced-motion`
- **Text resizing** — content must reflow at 200% zoom

### Contrast Calculation

```
Contrast ratio = (L1 + 0.05) / (L2 + 0.05)
L = 0.2126 × R + 0.7152 × G + 0.0722 × B
```

For every color + background pair, compute contrast before shipping.

---

## 5. UX Laws (Key Subset)

| Law | Rule |
|-----|------|
| Fitts' | Bigger, closer targets are faster to hit |
| Hick's | More choices = slower decisions |
| Miller's | Working memory holds ~7 items |
| Jakob's | Users expect your site to work like others |
| Tesler's | Every system has irreducible complexity — hide it |
| Postel's | Be liberal in input, strict in output |
| Peak-End | Judge experiences by peak and end moments |
| Von Restorff | Distinct items are remembered better |
| Zeigarnik | Incomplete tasks are remembered better |

**Conflict resolution:** When laws conflict, prioritize the one that protects the user's primary goal.

---

## Quick Audit Checklist

- [ ] At least 3 spacing tiers used
- [ ] Inner gaps < outer gaps
- [ ] One primary action per surface
- [ ] Text contrast ≥ 4.5:1 (normal) or ≥ 3:1 (large)
- [ ] All interactive elements keyboard accessible
- [ ] Font sizes ≥ 16px primary, ≥ 14px secondary
- [ ] No color-only meaning encoding
- [ ] Focus indicators visible

---
name: search-first
description: Research-before-coding workflow. Search for existing solutions before writing custom code.
origin: adapted from ECC
---

## When to Use

Use this skill when:
- Starting a new feature that likely has existing solutions
- Adding a dependency or integration
- About to write a utility, helper, or abstraction
- Before creating anything from scratch

## Workflow

```
┌─────────────────────────────────────────────┐
│  1. NEED ANALYSIS                           │
│     Define what functionality is needed      │
│     Identify language/framework constraints  │
├─────────────────────────────────────────────┤
│  2. PARALLEL SEARCH                         │
│     ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│     │  Package  │ │  GitHub  │ │  Web /   │  │
│     │  Registry │ │  Search  │ │  Docs    │  │
│     └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────┤
│  3. EVALUATE                                │
│     Score candidates (functionality, maint, │
│     community, docs, license, deps)         │
├─────────────────────────────────────────────┤
│  4. DECIDE                                  │
│     ┌─────────┐  ┌──────────┐  ┌─────────┐  │
│     │  Adopt  │  │  Extend  │  │  Build   │  │
│     │ as-is   │  │  /Wrap   │  │  Custom  │  │
│     └─────────┘  └──────────┘  └─────────┘  │
├─────────────────────────────────────────────┤
│  5. IMPLEMENT                               │
│     Install package / Write minimal code    │
└─────────────────────────────────────────────┘
```

## Decision Matrix

| Signal | Action |
|--------|--------|
| Exact match, well-maintained, MIT/Apache | **Adopt** — install and use directly |
| Partial match, good foundation | **Extend** — install + write thin wrapper |
| Multiple weak matches | **Compose** — combine 2-3 small packages |
| Nothing suitable found | **Build** — write custom, informed by research |

## Search Channels

| Channel | Tool | What to check |
|---------|------|---------------|
| Package registry | `npm search`, `pip search`, `cargo search` | Existing packages |
| GitHub | `gh search repos`, web search | Open source implementations |
| Official docs | Web fetch | Framework built-in solutions |
| Codebase | Grep, Glob | Existing internal implementations |

## Evaluation Criteria

Score each candidate (1-5):

| Criterion | Weight | What to check |
|-----------|--------|---------------|
| Functionality | 30% | Does it solve the exact problem? |
| Maintenance | 25% | Last commit, open issues, release frequency |
| Community | 15% | Stars, downloads, contributors |
| Documentation | 15% | README, API docs, examples |
| License | 10% | MIT/Apache compatible? |
| Dependencies | 5% | How many? Are they well-known? |

## Output

Present findings as:
```
RESEARCH RESULTS
════════════════════════════════════════
Need:             [what was needed]
Options found:    [N]
Recommendation:   [Adopt/Extend/Build] — [package name or "custom"]
Rationale:        [why this choice]
════════════════════════════════════════
```

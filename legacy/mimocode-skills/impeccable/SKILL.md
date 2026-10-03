---
name: impeccable
description: Production-grade frontend design guidance. Covers UX review, visual hierarchy, typography, color, spacing, layout, motion, accessibility, performance, responsive behavior, anti-patterns, and design systems. Use when designing, redesigning, auditing, polishing, or improving any frontend interface.
origin: adapted from pbakaus/impeccable
---

# Impeccable: Frontend Design Guidance

Production-grade frontend interfaces. Real working code, committed design choices, exceptional craft.

---

## Setup (Required Before Any Design Work)

1. **Read existing code.** Read at least one project file (CSS / tokens / theme / a representative component). Don't reinvent the wheel; use what's there when it works, branch out when the UX wins.
2. **Determine the register.** Is this surface **brand** (marketing, landing, portfolio — design IS the product) or **product** (app UI, dashboard, tool — design SERVES the product)? Pick by: task cue, surface in focus, project type.
3. **If brand-new project (no existing tokens/colors):** Establish a brand seed color and compose the palette around it. Use OKLCH throughout. Skip only if committed brand colors already exist.

---

## General Rules

### Color

- **Verify contrast.** Body text: >=4.5:1 against background; large text (>=18px or bold >=14px): >=3:1. Placeholder text needs the same 4.5:1. Muted gray body text on tinted near-white is the single biggest reason AI designs feel hard to read.
- Gray text on colored backgrounds looks washed out. Use a darker shade of the background's own hue, or a transparency of the text color.

### Typography

- Cap body line length at 65-75ch.
- Don't pair fonts that are similar but not identical (two geometric sans-serifs). Pair on a contrast axis (serif + sans, geometric + humanist) or use one family in multiple weights.
- Hero / display heading ceiling: clamp() max <= 6rem (~96px). Above that the page is shouting, not designing.
- Display heading letter-spacing floor: >= -0.04em. Anything tighter and letters touch.
- Use `text-wrap: balance` on h1-h3 for even line lengths; `text-wrap: pretty` on long prose to reduce orphans.

### Layout

- Vary spacing for rhythm.
- Cards are the lazy answer. Use them only when they're truly the best affordance. Nested cards are always wrong.
- Flexbox for 1D, Grid for 2D. Don't default to Grid when `flex-wrap` would be simpler.
- For responsive grids without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- Build a semantic z-index scale (dropdown -> sticky -> modal-backdrop -> modal -> toast -> tooltip). Never arbitrary values like 999 or 9999.

### Motion

- Motion should be intentional, not an afterthought. Consider it as part of the build.
- Don't animate CSS layout properties unless truly needed.
- Ease out with exponential curves (ease-out-quart / quint / expo). No bounce, no elastic.
- Use libraries for advanced motion (motion, gsap, anime.js, lenis).
- **Reduced motion is not optional.** Every animation needs a `@media (prefers-reduced-motion: reduce)` alternative: typically a crossfade or instant transition.
- Staggering items within one list is legitimate. Each reveal should fit what it reveals.
- Reveal animations must enhance an already-visible default. Don't gate content visibility on a class-triggered transition.
- Premium motion materials: blur, backdrop-filter, clip-path, mask, shadow/glow are part of the palette when they materially improve the effect.

### Interaction

- Dropdowns with `position: absolute` inside `overflow: hidden/auto` will be clipped. Use `<dialog>` / popover API, `position: fixed`, or a portal.

---

## New Projects (No Prior Work)

### Color & Theme

- Use OKLCH.
- **The cream/sand/beige body bg is the saturated AI default of 2026.** The warm-neutral band (OKLCH L 0.84-0.97, C < 0.06, hue 40-100) reads as cream/sand/paper regardless of what you call it. If the brief is "warm, traditional, editorial-restraint", DO NOT translate that into a near-white warm-tinted bg. Pick: (a) a saturated brand color as body, (b) a true off-white at chroma 0, or (c) a darker mid-tone tinted neutral. "Warmth" is carried by accent + typography + imagery, not by body bg.
- Tinted neutrals: add 0.005-0.015 chroma toward the brand's hue. Don't default-tint toward warm or cool.
- Dark vs. light is never a default. Before choosing, write one sentence of physical scene: who uses this, where, under what ambient light, in what mood. If the sentence doesn't force the answer, it's not concrete enough.
- Pick a **color strategy** before picking colors:
  - **Restrained**: tinted neutrals + one accent <=10%. Product default.
  - **Committed**: one saturated color carries 30-60% of surface. Brand default.
  - **Full palette**: 3-4 named roles, each used deliberately. Campaigns; data viz.
  - **Drenched**: the surface IS the color. Brand heroes, campaign pages.

---

## Absolute Bans (Match-and-Refuse)

If you're about to write any of these, rewrite the element with different structure:

- **Side-stripe borders.** `border-left` or `border-right` >1px as colored accent on cards, list items, callouts, or alerts. Never intentional.
- **Gradient text.** `background-clip: text` + gradient background. Decorative, never meaningful. Use single solid color. Emphasis via weight or size.
- **Glassmorphism as default.** Blurs and glass cards used decoratively. Rare and purposeful, or nothing.
- **The hero-metric template.** Big number, small label, supporting stats, gradient accent. SaaS cliche.
- **Identical card grids.** Same-sized cards with icon + heading + text, repeated endlessly.
- **Tiny uppercase tracked eyebrow above every section.** The 2023-era kicker (small all-caps text with wide tracking above each heading) is the saturated AI scaffold. One named kicker as a deliberate brand system is voice; an eyebrow on every section is AI grammar.
- **Numbered section markers as default scaffolding (01 / 02 / 03).** Numbers earn their place when the section actually IS a sequence. One deliberate numbered sequence is voice; numbered eyebrows on every section is AI grammar.
- **Text that overflows its container.** Long heading words plus large clamp scales plus narrow grids cause headline overflow on tablet/mobile. Test at every breakpoint.

---

## Brand Register

Design IS the product. Landing pages, marketing, portfolios, campaigns.

### The Slop Test
If someone could look at this and say "AI made that" without doubt, it's failed.

### Font Selection Procedure
1. Read the brief. Write voice words (e.g., "quiet luxury", "mechanical precision", "warm editorial").
2. List reflex fonts (what the category typically uses). Then reject them.
3. Browse font catalogs with physical-object metaphors (not "what looks modern" but "what material does this feel like").
4. Cross-check: does this font exist in 3+ weights? Is it web-licensed? Does it pair with the body choice?
5. One display font + one body font max. Monospace if the product demands it.

### Reflex-Reject Fonts
Fonts that appear on 55-95% of AI generations regardless of brief. Avoid unless the brief explicitly names them:
Fraunces, Instrument Serif, Inter, DM Sans, Plus Jakarta Sans, Satoshi, General Sans, Clash Display, Space Grotesk, Cabinet Grotesk, Outfit, Lexend, Manrope, Sora, Cal Sans, Geist (for brand), Albert Sans, Geist Mono, JetBrains Mono.

### Banned Aesthetic Lanes
- "Editorial-typographic" (massive serif + muted palette + whitespace) is the AI default for "luxury".
- "Dark-tech-terminal" (monospace + neon accent + dark bg) is the AI default for "developer tool".
- "SaaS-cream" (warm beige + Inter + cards) is the AI default for "startup".

### Color Strategy
- Palette IS voice. Color carries brand personality more than any other token.
- Committed or Full palette for brand surfaces. Restrained feels like product, not brand.
- One photo with strong color grading beats five mediocre ones.

### Layout
- Asymmetric compositions. Break the center-reflex.
- Fluid spacing. Not everything on a 4pt grid; let some values breathe.
- Real imagery required for image-led briefs. One decisive photo beats five mediocre ones.

### Motion
- One orchestrated page-load sequence beats scattered micro-interactions.
- Motion tells the brand story, not just "it moves".

---

## Product Register

Design SERVES the product. App UIs, dashboards, settings, tools.

### The Test
Earned familiarity: would a user fluent in the category's best tools trust this interface?

### Typography
- One family. System fonts or a single workhorse with extensive weight range.
- Fixed rem scale. Ratio 1.125-1.2. No display sizes in UI labels.

### Color
- Restrained default. Tinted neutrals + one accent <=10%.
- Accent for primary actions only. Not decoration.
- Standardized state vocabulary: idle, hover, active, focus, disabled, error, success.

### Layout
- Structural responsive behavior. Fixed at breakpoints, fluid between.
- Sidebar / topnav / content patterns. Don't reinvent navigation.
- Density tiers: compact (data-heavy), comfortable (default), spacious (onboarding).

### Components
- All interaction states required: default, hover, active, focus, disabled, loading, error, empty.
- Skeleton loading matching final layout shape.
- Teach-the-interface empty states. Not "No data found."

### Motion
- 150-250ms for UI transitions.
- State, not decoration. No page-load choreography.
- No decorative motion. No bounce. No elastic.

### Product Bans
- Display fonts in UI labels.
- Reinvented affordances (don't redesign the toggle, the dropdown, the tab).
- Modal as first thought. Inline editing, slide-over, expandable section first.
- Inconsistent components. One button style, one input style, one card style.

---

## Design Health Score

When reviewing, score across dimensions (0-4 each):

### Holistic Design
- Visual hierarchy clarity
- Consistent design language
- Appropriate complexity for context
- Emotional resonance

### Cognitive Load
- Information grouping
- Progressive disclosure
- Clear affordances
- Minimal decision points per view

### Anti-Patterns (AI Slop)
- Side-stripe borders
- Gradient text
- Glassmorphism default
- Hero-metric template
- Identical card grids
- Eyebrow on every section
- Text overflow

### Accessibility
- WCAG contrast
- Keyboard navigation
- Screen reader support
- Focus indicators

### Performance
- Layout thrashing
- Animation cost
- Bundle size
- Lazy loading

---

## Pre-Ship Checklist

- [ ] Body text contrast >= 4.5:1
- [ ] No muted gray on tinted backgrounds
- [ ] Line length capped at 65-75ch
- [ ] Display letter-spacing >= -0.04em
- [ ] No cards where spacing would work
- [ ] No nested cards
- [ ] z-index is semantic, not arbitrary
- [ ] All animations have reduced-motion alternative
- [ ] No bounce or elastic easing
- [ ] No gradient text
- [ ] No side-stripe borders
- [ ] No eyebrow on every section
- [ ] No identical card grids
- [ ] No text overflow at any breakpoint
- [ ] Hero heading <= 6rem (96px)
- [ ] All interactive states covered (hover, active, focus, disabled)
- [ ] Empty states designed
- [ ] Error states designed
- [ ] Loading states designed
- [ ] Dark and light modes both work (if applicable)
- [ ] Touch targets >= 44px
- [ ] Focus indicators visible
- [ ] Semantic HTML used
- [ ] Images have alt text
- [ ] Content reflows at 200% zoom

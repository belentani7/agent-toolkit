---
name: premium-visual-design
description: High-end agency-level UI design. Double-bezel architecture, magnetic hover physics, cinematic motion choreography, liquid glass. For premium consumer, SaaS, and creative portfolio interfaces.
origin: adapted from Leonxlnx/taste-skill
---

# Premium Visual Design

You engineer $150k+ agency-level digital experiences. Your output must exude haptic depth, cinematic spatial rhythm, obsessive micro-interactions, and flawless fluid motion.

**The Variance Mandate:** NEVER generate the exact same layout or aesthetic twice in a row. Dynamically combine different premium layout archetypes while adhering to the elite "Apple-esque / Linear-tier" design language.

---

## 1. THE "ABSOLUTE ZERO" DIRECTIVE (Banned Elements)

If your generated code includes ANY of these, the design instantly fails:

- **Banned Fonts:** Inter, Roboto, Arial, Open Sans, Helvetica. Use `Geist`, `Clash Display`, `PP Editorial New`, `Plus Jakarta Sans`.
- **Banned Icons:** Standard thick-stroked Lucide, FontAwesome, Material Icons. Use ultra-light, precise lines (Phosphor Light, Remix Line).
- **Banned Borders & Shadows:** Generic 1px solid gray borders. Harsh, dark drop shadows.
- **Banned Layouts:** Edge-to-edge sticky navbars. Symmetrical 3-column Bootstrap grids without whitespace.
- **Banned Motion:** Standard `linear` or `ease-in-out` transitions. Instant state changes without interpolation.

---

## 2. THE CREATIVE VARIANCE ENGINE

Before writing code, select ONE combination based on the prompt's context:

### A. Vibe & Texture Archetypes (Pick 1)
1. **Ethereal Glass (SaaS / AI / Tech):** Deepest OLED black (`#050505`), radial mesh gradients, Vantablack cards with `backdrop-blur-2xl` and white/10 hairlines. Wide geometric Grotesk typography.
2. **Editorial Luxury (Lifestyle / Real Estate / Agency):** Warm creams (`#FDFBF7`), muted sage, deep espresso. High-contrast Variable Serif for massive headings. CSS noise overlay (`opacity-[0.03]`).
3. **Soft Structuralism (Consumer / Health / Portfolio):** Silver-grey or white backgrounds. Massive bold Grotesk. Airy, floating components with ultra-soft diffused shadows.

### B. Layout Archetypes (Pick 1)
1. **The Asymmetrical Bento:** Masonry-like CSS Grid of varying card sizes (`col-span-8 row-span-2` next to stacked `col-span-4`). Mobile: single-column with `gap-6`.
2. **The Z-Axis Cascade:** Elements stacked like physical cards, slightly overlapping with varying depths, some with `-2deg` or `3deg` rotation. Mobile: remove rotations and overlaps.
3. **The Editorial Split:** Massive typography on left (`w-1/2`), interactive horizontal pills or staggered cards on right. Mobile: full-width vertical stack.

**Mobile Override (Universal):** Any asymmetric layout above `md:` MUST collapse to `w-full`, `px-4`, `py-8` below `768px`. Never use `h-screen` - always `min-h-[100dvh]`.

---

## 3. HAPTIC MICRO-AESTHETICS

### The "Double-Bezel" (Nested Architecture)
Never place a premium card flatly on the background. Use nested enclosures:
- **Outer Shell:** Subtle background (`bg-black/5` or `bg-white/5`), hairline border (`ring-1 ring-black/5`), padding (`p-1.5`), large radius (`rounded-[2rem]`).
- **Inner Core:** Actual content container with its own background, inner highlight (`shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`), smaller radius (`rounded-[calc(2rem-0.375rem)]`).

### Nested CTA & "Island" Button Architecture
- Primary buttons: fully rounded pills (`rounded-full`), generous padding (`px-6 py-3`).
- **Button-in-Button Trailing Icon:** Arrow (`↗`) sits inside its own circular wrapper (`w-8 h-8 rounded-full bg-black/5 flex items-center justify-center`), flush with the button's right inner padding.

### Spatial Rhythm & Tension
- **Macro-Whitespace:** Double standard padding. Use `py-24` to `py-40` for sections.
- **Eyebrow Tags:** Microscopic pill-shaped badge (`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]`).

---

## 4. MOTION CHOREOGRAPHY

All motion must simulate real-world mass and spring physics. Use custom cubic-beziers (`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]`).

### The "Fluid Island" Nav
- **Closed:** Floating glass pill detached from top (`mt-6`, `mx-auto`, `w-max`, `rounded-full`).
- **Hamburger Morph:** Lines rotate/translate to form 'X' (`rotate-45` / `-rotate-45`), not disappear.
- **Modal Expansion:** Screen-filling overlay with heavy glass effect (`backdrop-blur-3xl bg-black/80`).
- **Staggered Mask Reveal:** Nav links fade in and slide up (`translate-y-12 opacity-0` to `translate-y-0 opacity-100`) with staggered delay.

### Magnetic Button Hover Physics
- Use `group` utility. Scale button on `active:scale-[0.98]`.
- Inner icon circle translates diagonally (`group-hover:translate-x-1 group-hover:-translate-y-[1px]`) and scales (`scale-105`).

### Scroll Interpolation
- Elements execute gentle fade-up (`translate-y-16 blur-md opacity-0` to `translate-y-0 blur-0 opacity-100` over 800ms+).
- Use `IntersectionObserver` or Motion's `whileInView`. NEVER `window.addEventListener('scroll')`.

---

## 5. PERFORMANCE GUARDRAILS

- **GPU-Safe Animation:** Only `transform` and `opacity`. Never `top`, `left`, `width`, `height`.
- **Blur Constraints:** `backdrop-blur` only on fixed/sticky elements. Never on scrolling containers.
- **Grain/Noise Overlays:** Fixed, `pointer-events-only` pseudo-elements only.
- **Z-Index Discipline:** Reserve for systemic layers: sticky nav, modals, overlays, tooltips.

---

## 6. PRE-OUTPUT CHECKLIST

- [ ] No banned fonts, icons, borders, shadows, layouts, or motion from Section 1
- [ ] A Vibe Archetype and Layout Archetype were consciously selected
- [ ] All major cards use Double-Bezel nested architecture
- [ ] CTA buttons use Button-in-Button trailing icon pattern
- [ ] Section padding is at minimum `py-24`
- [ ] All transitions use custom cubic-bezier curves
- [ ] Scroll entry animations are present
- [ ] Layout collapses below `768px` to single-column
- [ ] All animations use only `transform` and `opacity`
- [ ] `backdrop-blur` only on fixed/sticky elements
- [ ] Overall impression reads as "$150k agency build"

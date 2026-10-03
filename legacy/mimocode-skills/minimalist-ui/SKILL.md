---
name: minimalist-ui
description: Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. For Notion/Linear-style product UI.
origin: adapted from Leonxlnx/taste-skill
---

# Minimalist UI: Premium Utilitarian Minimalism

Ultra-minimalist, "document-style" web interfaces analogous to top-tier workspace platforms. High-contrast warm monochrome palette, bespoke typographic hierarchies, meticulous macro-whitespace, bento-grid layouts, ultra-flat component architecture with muted pastel accents.

---

## 1. Banned Elements

- DO NOT use "Inter", "Roboto", or "Open Sans" typefaces.
- DO NOT use generic thin-line icon libraries (Lucide, Feather, standard Heroicons).
- DO NOT use Tailwind's default heavy drop shadows (`shadow-md`, `shadow-lg`). Shadows must be ultra-diffuse and low opacity (< 0.05).
- DO NOT use primary colored backgrounds for large elements.
- DO NOT use gradients, neon colors, or 3D glassmorphism.
- DO NOT use `rounded-full` for large containers, cards, or primary buttons.
- DO NOT use emojis in code, markup, text content, headings, or alt text.
- DO NOT use generic placeholder names ("John Doe", "Acme Corp", "Lorem Ipsum").
- DO NOT use AI copywriting cliches: "Elevate", "Seamless", "Unleash", "Next-Gen", "Delve".

---

## 2. Typographic Architecture

Rely on extreme typographic contrast and premium font selection:

- **Primary Sans-Serif (Body, UI):** `font-family: 'SF Pro Display', 'Geist Sans', 'Helvetica Neue', 'Switzer', sans-serif`.
- **Editorial Serif (Hero Headings & Quotes):** `font-family: 'Lyon Text', 'Newsreader', 'Playfair Display', 'Instrument Serif', serif`. Tight tracking (`-0.02em` to `-0.04em`), tight line-height (`1.1`).
- **Monospace (Code, Meta-data):** `font-family: 'Geist Mono', 'SF Mono', 'JetBrains Mono', monospace`.
- **Text Colors:** Body never absolute black (`#000000`). Use off-black (`#111111` or `#2F3437`) with `line-height: 1.6`. Secondary: muted gray (`#787774`).

---

## 3. Color Palette (Warm Monochrome + Spot Pastels)

- **Canvas / Background:** Pure White `#FFFFFF` or Warm Bone `#F7F6F3` / `#FBFBFA`.
- **Primary Surface (Cards):** `#FFFFFF` or `#F9F9F8`.
- **Structural Borders / Dividers:** Ultra-light gray `#EAEAEA` or `rgba(0,0,0,0.06)`.
- **Accent Colors:** Highly desaturated, washed-out pastels only:
  - Pale Red: `#FDEBEC` (Text: `#9F2F2D`)
  - Pale Blue: `#E1F3FE` (Text: `#1F6C9F`)
  - Pale Green: `#EDF3EC` (Text: `#346538`)
  - Pale Yellow: `#FBF3DB` (Text: `#956400`)

---

## 4. Component Specifications

- **Bento Box Feature Grids:** Asymmetrical CSS Grid. Cards: exactly `border: 1px solid #EAEAEA`. Radius: `8px` or `12px` max. Padding: `24px` to `40px`.
- **Primary CTA:** Solid `#111111`, text `#FFFFFF`. Slight radius (`4px`-`6px`). No box-shadow. Hover: `#333333` or `scale(0.98)`.
- **Tags & Badges:** Pill-shaped (`border-radius: 9999px`), `text-xs`, uppercase, wide tracking (`0.05em`). Muted pastel backgrounds.
- **Accordions (FAQ):** Strip all container boxes. Separate with `border-bottom: 1px solid #EAEAEA`. Clean `+` / `-` toggle icons.
- **Keystroke Micro-UIs:** `<kbd>` tags: `border: 1px solid #EAEAEA`, `border-radius: 4px`, `background: #F7F6F3`, monospace font.

---

## 5. Iconography & Imagery

- **System Icons:** Phosphor Icons (Bold or Fill) or Radix UI Icons. Standardize stroke width.
- **Illustrations:** Monochromatic, rough continuous-line ink sketches with a single offset geometric shape filled with muted pastel.
- **Photography:** High-quality, desaturated with warm tone. Subtle overlays (`opacity: 0.04` warm grain). Use `picsum.photos` when real assets unavailable.
- **Hero & Section Backgrounds:** Subtle full-width imagery at low opacity, soft radial light spots (`opacity: 0.03`), or minimal geometric patterns.

---

## 6. Subtle Motion

Motion should feel invisible - present but never distracting:

- **Scroll Entry:** `translateY(12px)` + `opacity: 0` resolving over `600ms` with `cubic-bezier(0.16, 1, 0.3, 1)`. Use `IntersectionObserver`.
- **Hover States:** Ultra-subtle shadow shift (`box-shadow: 0 2px 8px rgba(0,0,0,0.04)` over `200ms`). Buttons: `scale(0.98)` on `:active`.
- **Staggered Reveals:** `animation-delay: calc(var(--index) * 80ms)`.
- **Background Ambient:** Optional single slow-moving radial gradient blob (`animation-duration: 20s+`, `opacity: 0.02-0.04`). Fixed, `pointer-events: none`.
- **Performance:** Only `transform` and `opacity`.

---

## 7. Execution Protocol

1. Establish macro-whitespace first. `py-24` or `py-32` between sections.
2. Constrain content width to `max-w-4xl` or `max-w-5xl`.
3. Apply custom typographic hierarchy and monochromatic colors immediately.
4. Every card, divider, border: `1px solid #EAEAEA`.
5. Add scroll-entry animations to all major content blocks.
6. Sections need visual depth through imagery, ambient gradients, or textures.
7. Reflect high-end, uncluttered, editorial aesthetic natively.

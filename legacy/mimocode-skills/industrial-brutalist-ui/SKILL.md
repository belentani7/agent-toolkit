---
name: industrial-brutalist-ui
description: Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites.
origin: adapted from Leonxlnx/taste-skill
---

# Industrial Brutalism & Tactical Telemetry UI

Web interfaces that synthesize mid-century Swiss Typographic design, industrial manufacturing manuals, and retro-futuristic aerospace/military terminal interfaces. Rigid modular grids, extreme typographic scale contrast, purely utilitarian color palettes, and simulated analog degradation (halftones, CRT scanlines, bitmap dithering).

---

## 1. Visual Archetypes

**Pick ONE per project and commit. Do not mix both.**

### Swiss Industrial Print
High-contrast light modes (newsprint/off-white). Monolithic heavy sans-serif typography. Visible dividing lines. Aggressive asymmetric negative space. Oversized viewport-bleeding numerals. Primary red as alert/accent.

### Tactical Telemetry & CRT Terminal
Dark mode exclusivity. High-density tabular data. Absolute dominance of monospaced typography. ASCII brackets, crosshairs. Simulated hardware limitations (phosphor glow, scanlines, low bit-depth).

---

## 2. Typographic Architecture

### Macro-Typography (Structural Headers)
- **Classification:** Neo-Grotesque / Heavy Sans-Serif.
- **Fonts:** Neue Haas Grotesk (Black), Archivo Black, Monument Extended.
- **Scale:** Fluid (`clamp(4rem, 10vw, 15rem)`).
- **Tracking:** Extremely tight (`-0.03em` to `-0.06em`).
- **Leading:** Highly compressed (`0.85` to `0.95`).
- **Casing:** Exclusively uppercase for structural impact.

### Micro-Typography (Data & Telemetry)
- **Classification:** Monospace / Technical Sans.
- **Fonts:** JetBrains Mono, IBM Plex Mono, Space Mono, VT323.
- **Scale:** Fixed, small (`10px` to `14px`).
- **Tracking:** Generous (`0.05em` to `0.1em`).
- **Casing:** Exclusively uppercase.

### Textural Contrast
- **Classification:** High-Contrast Serif (Playfair Display, EB Garamond).
- Used exceedingly sparingly. Must be degraded (halftone, 1-bit dithering) for textural juxtaposition.

---

## 3. Color System

**Choose ONE substrate palette per project. Never mix light and dark.**

### Swiss Industrial Print (Light)
- **Background:** `#F4F4F0` or `#EAE8E3` (matte paper).
- **Foreground:** `#050505` to `#111111` (carbon ink).
- **Accent:** `#E61919` or `#FF2A2A` (aviation red). The ONLY accent.

### Tactical Telemetry (Dark)
- **Background:** `#0A0A0A` or `#121212` (deactivated CRT).
- **Foreground:** `#EAEAEA` (white phosphor).
- **Accent:** `#E61919` or `#FF2A2A` (same red).
- **Terminal Green (`#4AF626`):** Optional single element only.

Gradients, soft shadows, and modern translucency are strictly prohibited.

---

## 4. Layout & Spatial Engineering

- **The Blueprint Grid:** Strict CSS Grid. Elements anchored to grid tracks.
- **Visible Compartmentalization:** Solid `1px` or `2px` borders. Horizontal rules spanning full width.
- **Bimodal Density:** Oscillate between extreme data density and vast calculated negative space.
- **Geometry:** Absolute rejection of `border-radius`. All corners 90 degrees.

---

## 5. UI Components & Symbology

- **ASCII Framing:** `[ DELIVERY SYSTEMS ]`, `< RE-IND >`, `>>>`, `///`, `\\\\`
- **Industrial Markers:** `®`, `©`, `™` as structural geometric elements.
- **Technical Assets:** Crosshairs (`+`), repeating vertical lines (barcodes), thick horizontal warning stripes, randomized string data (`REV 2.6`, `UNIT / D-01`).

---

## 6. Textural & Post-Processing Effects

- **Halftone & 1-Bit Dithering:** Dot-matrix patterns via `mix-blend-mode: multiply` + SVG radial dots.
- **CRT Scanlines:** `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`.
- **Mechanical Noise:** Low-opacity SVG static/noise filter on DOM root.

---

## 7. Web Engineering Directives

- **Grid Determinism:** `display: grid; gap: 1px;` with contrasting parent/child backgrounds for razor-thin dividing lines.
- **Semantic Rigidity:** Use `<data>`, `<samp>`, `<kbd>`, `<output>`, `<dl>` for telemetry.
- **Typography Clamping:** `clamp()` exclusively for macro-typography.

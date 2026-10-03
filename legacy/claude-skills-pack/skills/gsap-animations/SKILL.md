---
name: gsap-animations
description: Expert in GSAP (GreenSock Animation Platform) for creating high-performance web animations. Covers ScrollTrigger, Timeline, morphing, text effects, 3D transforms, SVG animations, and complex sequenced animations for landing pages and interactive experiences.
license: MIT
compatibility: opencode
metadata:
  author: community
  version: "1.0.0"
  domain: frontend
  triggers: GSAP, GreenSock, ScrollTrigger, animation, tween, timeline, morphing, SVG animation, scroll animation, parallax, text animation, Lottie, WebGL
  role: specialist
  scope: implementation
  output-format: code
  related-skills: frontend-expert, google-ui-ux
---

# GSAP Animations Expert

Senior animation specialist with deep expertise in GSAP ecosystem for creating buttery-smooth, performant web animations.

## When to Use This Skill

- Creating scroll-triggered animations (ScrollTrigger)
- Building complex animation timelines
- Implementing text reveal and split text effects
- Animating SVG paths and shapes
- Creating parallax scrolling effects
- Building interactive animation experiences
- Implementing page transitions
- Animating with 3D transforms and perspective

## Core Workflow

1. **Analyze requirements** - Identify animation triggers, duration, easing, performance needs
2. **Design timeline** - Plan animation sequence and dependencies
3. **Implement** - Write GSAP code with proper registration
4. **Optimize** - Use will-change, GPU acceleration, batch animations
5. **Test** - Verify performance on mobile, check reduced-motion preferences

## Essential GSAP Patterns

### Basic Tween
```javascript
gsap.to('.box', {
  x: 100,
  rotation: 360,
  duration: 1,
  ease: 'power2.out'
});
```

### ScrollTrigger Pin & Reveal
```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to('.section', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=500',
    pin: true,
    scrub: 1
  },
  opacity: 1,
  y: 0
});
```

### Complex Timeline
```javascript
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.from('.hero-title', { y: 50, opacity: 0, duration: 0.8 })
  .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.hero-cta', { scale: 0.8, opacity: 0, duration: 0.5 }, '-=0.2');
```

### Text Split Animation
```javascript
const split = new SplitText('.text', { type: 'chars,words' });

gsap.from(split.chars, {
  opacity: 0,
  y: 20,
  stagger: 0.02,
  duration: 0.5
});
```

### SVG Path Animation
```javascript
const path = document.querySelector('#path');
const length = path.getTotalLength();

gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

gsap.to(path, {
  strokeDashoffset: 0,
  duration: 2,
  ease: 'power1.inOut',
  scrollTrigger: {
    trigger: '.svg-container',
    start: 'top center'
  }
});
```

### Parallax Effect
```javascript
gsap.to('.parallax-bg', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});
```

### Stagger Animation on Grid
```javascript
gsap.from('.grid-item', {
  opacity: 0,
  y: 40,
  stagger: {
    each: 0.1,
    from: 'start',
    grid: 'auto'
  },
  duration: 0.6,
  ease: 'power2.out'
});
```

## Performance Best Practices

| Technique | When to Use |
|-----------|-------------|
| `will-change: transform` | Animating transform/opacity only |
| `gsap.ticker` batch | Animating many similar elements |
| `ScrollTrigger.batch` | Scroll animations on lists |
| `requestAnimationFrame` | Custom animation loops |
| Avoid layout triggers | Don't animate width/height/top/left |

## GSAP Plugins Reference

| Plugin | Purpose |
|--------|---------|
| ScrollTrigger | Scroll-based animations, pinning, scrub |
| ScrollSmoother | Smooth scrolling (Club) |
| SplitText | Text splitting for character/word anim (Club) |
| MorphSVG | SVG shape morphing (Club) |
| DrawSVG | SVG stroke drawing (Club) |
| MotionPath | Animate along SVG paths |
| Flip | FLIP animation technique |
| Observer | Touch/scroll/wheel input handling |
| TextPlugin | Text replacement animation |

## Constraints

### MUST DO
- Register plugins with `gsap.registerPlugin()`
- Use `will-change` sparingly (remove after animation)
- Respect `prefers-reduced-motion` media query
- Clean up ScrollTriggers on component unmount
- Use `gsap.context()` for React/Vue cleanup
- Test on mobile devices

### MUST NOT DO
- Animate layout properties (width, height, top, left)
- Use CSS transitions alongside GSAP on same properties
- Create infinite animations without pause/kill logic
- Skip mobile performance testing
- Ignore accessibility preferences

## Knowledge Reference

GSAP 3.12+, ScrollTrigger, ScrollSmoother, SplitText, MorphSVG, MotionPath, DrawSVG, Flip, Observer, React/GSAP integration, Vue/GSAP integration, Lottie, Three.js + GSAP

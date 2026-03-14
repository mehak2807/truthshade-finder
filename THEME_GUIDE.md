# 🌌 Cyber Trust Theme Guide

A dark, neon-glass "cyber trust" design system for TrustVault Finder.

## Theme Identity

**Visual Mood:** Dark, modern, security-focused  
**Style Language:** Glassmorphism panels + glowing gradients + subtle grid texture  
**Personality:** Technical, alert, and credibility-oriented

---

## Color Palette

### Primary Colors

- **Cyber Blue:** `#0096ff` (200 100% 50%) - Primary trust indicator
- **Cyber Cyan:** `#00c8ff` (180 100% 45%) - Accent and highlights
- **Cyber Purple:** `#a855f7` (280 70% 50%) - Secondary accent

### Dark Background

- **Dark Navy:** `#0a1420` (220 30% 8%) - Main background
- **Dark Blue:** `#0f1a2e` - Gradient layer 1
- **Dark Teal:** `#0d1825` - Gradient layer 2
- **Almost Black:** `#050a14` - Gradient layer 3

### Trust Indicators

- **Verified (Green):** `#22c55e` (120 80% 45%) - Credible content
- **Questionable (Amber):** `#fbbf24` (45 95% 50%) - Caution required
- **Misinformation (Red):** `#ef4444` (0 95% 55%) - False or misleading

### Neutrals

- **Foreground (Light):** `#f0f4f8` (220 15% 95%) - Text and UI
- **Muted Foreground:** `#b8c5d6` (220 15% 70%) - Tertiary text
- **Muted Background:** `#3d4a5c` (220 20% 30%) - Disabled states
- **Border:** `#1e3f50` (220 25% 25%) - Subtle dividers

---

## Typography

### Fonts

- **Headings:** Space Grotesk (400, 500, 600, 700)
  - Geometric, technical personality
  - Excellent for bold hierarchy
- **Body & UI:** Sora (300, 400, 500, 600, 700)
  - Clean, modern sans-serif
  - Optimal readability at all sizes

### Sizes

- **H1:** 2.25rem (36px), line-height 2.5rem
- **H2:** 1.875rem (30px), line-height 2.25rem
- **H3:** 1.5rem (24px), line-height 2rem
- **Body:** 1rem (16px)
- **Small:** 0.875rem (14px)
- **Tiny:** 0.75rem (12px)

---

## Glassmorphism Panels

### Standard Glass Panel

```css
.glass-panel {
  background: rgba(30, 60, 110, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 200, 255, 0.2);
  box-shadow:
    0 0 20px rgba(0, 200, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

- 40% opacity with 8px blur
- Subtle cyan border and glow

### Enhanced Glass Panel (Alt)

```css
.glass-panel-alt {
  background: rgba(40, 80, 140, 0.35);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.25);
  box-shadow:
    0 0 25px rgba(168, 85, 247, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

- 35% opacity with 12px blur
- Purple accent for alternative UI sections

---

## Luminous Borders

### Cyan Border

```css
.border-luminous {
  border: 1px solid rgba(0, 200, 255, 0.4);
  box-shadow: 0 0 12px rgba(0, 200, 255, 0.25);
}
```

### Purple Border

```css
.border-luminous-purple {
  border: 1px solid rgba(168, 85, 247, 0.4);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
}
```

### Enhanced Cyan Border

```css
.border-luminous-cyan {
  border: 1px solid rgba(0, 200, 255, 0.5);
  box-shadow: 0 0 16px rgba(0, 200, 255, 0.35);
}
```

---

## Glow Effects

Available glow utilities:

- `.glow-cyan` - 0 0 30px rgba(0, 200, 255, 0.5)
- `.glow-blue` - 0 0 25px rgba(0, 100, 255, 0.4)
- `.glow-purple` - 0 0 25px rgba(168, 85, 247, 0.4)
- `.glow-green` - 0 0 25px rgba(34, 197, 94, 0.4)
- `.glow-red` - 0 0 25px rgba(239, 68, 68, 0.4)
- `.glow-amber` - 0 0 25px rgba(245, 158, 11, 0.4)

---

## Animations

### Rise (Entrance Animation)

```css
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: rise 0.6s ease-out;
}
```

### Drift (Ambient Glow Animation)

```css
@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(2px, -2px);
  }
  50% {
    transform: translate(0, 2px);
  }
  75% {
    transform: translate(-2px, 0);
  }
}

.ambient-drift {
  animation: drift 6s ease-in-out infinite;
}
```

Apply `.ambient-drift` to interactive elements for subtle floating effect.

---

## Status Indicators

### Verified (Green)

```css
.status-verified {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #22c55e;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
}
```

### Questionable (Amber)

```css
.status-questionable {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
}
```

### Misinformation (Red)

```css
.status-misinformation {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}
```

---

## Component Examples

### Trust Badge

```html
<div class="trust-badge">✓ Verified Source</div>
```

- Cyan background with glow
- Inline-flex layout
- 0.75rem font size

### Neon Button

```css
.neon-button {
  background: linear-gradient(
    135deg,
    rgba(0, 150, 255, 0.2) 0%,
    rgba(168, 85, 247, 0.2) 100%
  );
  border: 1px solid rgba(0, 200, 255, 0.5);
  color: #00c8ff;
  box-shadow:
    0 0 20px rgba(0, 200, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.neon-button:hover {
  background: linear-gradient(
    135deg,
    rgba(0, 200, 255, 0.3) 0%,
    rgba(168, 85, 247, 0.3) 100%
  );
  box-shadow:
    0 0 30px rgba(0, 200, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(0, 200, 255, 0.7);
}
```

### Gradient Text

```html
<div class="text-gradient-cyber">Critical Analysis</div>
```

- Linear gradient from cyan → purple → cyan
- Clip to text for effect

---

## Background Layers

### Page Gradient

```css
.page-gradient {
  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(0, 150, 255, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(168, 85, 247, 0.1) 0%,
      transparent 50%
    ),
    linear-gradient(
      135deg,
      #0a1420 0%,
      #0f1a2e 25%,
      #0d1825 50%,
      #0a1420 75%,
      #050a14 100%
    );
  min-height: 100vh;
  position: relative;
}
```

### Grid Texture

```css
.grid-texture {
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(0, 200, 255, 0.02) 25%, ...),
    linear-gradient(90deg, transparent 24%, rgba(0, 200, 255, 0.02) 25%, ...);
  background-size: 40px 40px;
}
```

---

## Utility Classes

### Shadows

- `.shadow-card` - Soft card shadow
- `.shadow-elevated` - Elevated shadow with more glow
- `.shadow-glow-md` - Medium glow effect
- `.shadow-glow-lg` - Large glow effect

### Interactions

- `.hover-glow` - Brightens on hover (1.2x brightness)
- `.transition-smooth` - Smooth cubic-bezier transition
- `.gradient-overlay-cyan` - Subtle cyan gradient overlay

### Backdrops

- `.backdrop-blur-glass` - 8px blur
- `.backdrop-blur-glass-strong` - 12px blur

---

## Implementation Checklist

- [ ] Apply `.page-gradient` to body
- [ ] Add `.grid-texture` overlay for subtle grid
- [ ] Use `.glass-panel` for cards and containers
- [ ] Apply `.glow-*` classes to key focal points
- [ ] Use `.fade-in` for entrance animations
- [ ] Apply `.ambient-drift` to interactive elements
- [ ] Replace buttons with `.neon-button` styling
- [ ] Use status indicator classes for trust levels
- [ ] Ensure all headings use Space Grotesk
- [ ] Body text uses Sora font family

---

## Accessibility Notes

- Maintain WCAG AA contrast ratios
- Respect `prefers-reduced-motion` for animations
- Keep glow effects subtle (0.15-0.5 opacity range)
- Ensure text on glass panels remains readable
- Use color + icon combinations for status (not color alone)

---

## Browser Support

- Modern browsers with CSS Grid, Flexbox, and backdrop-filter
- Fallback backgrounds for older browsers
- Gradients widely supported (IE10+)
- Animation support in all modern browsers

---

## Notes

- All hex colors can be adjusted via CSS variables in `:root`
- Animation durations are intentionally slow for ambient, smooth feel
- Glow effects use soft blur rather than harsh shadows
- Glass blur is optimized for performance (8-12px range)
- Grid texture opacity is very subtle (0.015-0.02) to avoid distraction

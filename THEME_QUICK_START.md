# 🎨 Cyber Trust Theme - Quick Implementation Guide

## Quick CSS Classes Reference

### Glass Panels

```html
<!-- Standard glass panel (blue accent) -->
<div class="glass-panel">Content here</div>

<!-- Enhanced glass panel (purple accent) -->
<div class="glass-panel-alt">Content here</div>
```

### Borders & Glows

```html
<!-- Cyan luminous border -->
<div class="border-luminous">Content</div>

<!-- Purple luminous border -->
<div class="border-luminous-purple">Content</div>

<!-- Enhanced cyan border -->
<div class="border-luminous-cyan">Content</div>
```

### Glow Effects

```html
<div class="glow-cyan">Cyan glow</div>
<div class="glow-blue">Blue glow</div>
<div class="glow-purple">Purple glow</div>
<div class="glow-green">Green glow</div>
<div class="glow-red">Red glow</div>
<div class="glow-amber">Amber glow</div>
```

### Animations

```html
<!-- Fade-in with rise animation -->
<div class="fade-in">Enters with smooth rise</div>

<!-- Ambient drift for interactive elements -->
<button class="ambient-drift">Hover me</button>
```

### Status Indicators

```html
<!-- Verified status -->
<div class="status-verified">✓ This is verified</div>

<!-- Questionable status -->
<div class="status-questionable">⚠ Needs verification</div>

<!-- Misinformation status -->
<div class="status-misinformation">✗ Misinformation detected</div>
```

### Badges & Text

```html
<!-- Trust badge -->
<span class="trust-badge">✓ Verified Source</span>

<!-- Gradient text -->
<h2 class="text-gradient-cyber">Critical Analysis</h2>
```

### Buttons

```html
<!-- Neon button style -->
<button class="neon-button">Analyze Content</button>
```

### Shadows

```html
<!-- Card shadow -->
<div class="shadow-card">Card content</div>

<!-- Elevated shadow -->
<div class="shadow-elevated">Elevated content</div>

<!-- Glow shadows -->
<div class="shadow-glow-md">Medium glow</div>
<div class="shadow-glow-lg">Large glow</div>
```

### Background Utilities

```html
<!-- Page background (on body) -->
<body class="page-gradient">
  <!-- Grid texture overlay -->
  <div class="grid-texture">Content with subtle grid</div>

  <!-- Cyan gradient overlay -->
  <div class="gradient-overlay-cyan">Overlay content</div>
</body>
```

### Interactions

```html
<!-- Hover glow effect -->
<div class="hover-glow">Brightens on hover</div>

<!-- Smooth transitions -->
<div class="transition-smooth">Smooth transitions</div>
```

### Backdrops

```html
<!-- Standard glass blur -->
<div class="backdrop-blur-glass">8px blur</div>

<!-- Strong glass blur -->
<div class="backdrop-blur-glass-strong">12px blur</div>
```

---

## Color Variables (CSS Custom Properties)

```css
/* Access colors using HSL variables */
--cyber-blue: 200 100% 50%; /* #0096ff */
--cyber-cyan: 180 100% 45%; /* #00c8ff */
--cyber-purple: 280 70% 50%; /* #a855f7 */
--cyber-dark: 220 30% 8%; /* #0a1420 */

/* Trust indicators */
--trust-verified: 120 80% 45%; /* #22c55e */
--trust-questionable: 45 95% 50%; /* #fbbf24 */
--trust-misinformation: 0 95% 55%; /* #ef4444 */
```

---

## Tailwind Integration

All theme utilities are available via Tailwind classes:

```html
<!-- Colors from config -->
<div class="bg-cyber-dark text-cyber-cyan">Content</div>
<div class="border-cyber-blue">Bordered</div>

<!-- Standard utilities still work -->
<div class="p-4 rounded-lg shadow-lg">Card</div>

<!-- Animations -->
<div class="animate-rise">Animated entrance</div>
<div class="animate-drift">Drifting animation</div>
```

---

## Component Pattern Examples

### Card with Glass Effect

```tsx
<div className="glass-panel p-6 rounded-lg">
  <h3 className="font-semibold text-cyber-cyan mb-2">Analysis Result</h3>
  <p className="text-foreground/80">Content here</p>
</div>
```

### Button with Neon Style

```tsx
<button className="neon-button px-6 py-2 rounded-lg font-medium hover:glow-cyan">
  Verify Content
</button>
```

### Status Badge

```tsx
<div className="status-verified px-3 py-1 rounded-full text-sm">
  ✓ Verified Source
</div>
```

### Interactive Panel with Drift

```tsx
<div className="glass-panel p-4 rounded-lg ambient-drift cursor-pointer hover-glow">
  <div className="trust-badge mb-2">✓ Safe</div>
  <p>Interactive content</p>
</div>
```

### Alert Box with Glow

```tsx
<div className="glass-panel-alt p-4 rounded-lg border-luminous-cyan">
  <div className="status-questionable mb-2">⚠ Requires Review</div>
  <p>Alert content here</p>
</div>
```

---

## Animation Usage

### Entrance Animation

```css
/* Component automatically inherits rise animation */
.fade-in {
  animation: rise 0.6s ease-out;
}

/* Use on mount in React */
<div className={mounted ? "fade-in" : ""}>
  Content appears with smooth rise
</div>
```

### Continuous Drift

```css
/* For interactive elements that should feel "alive" */
.ambient-drift {
  animation: drift 6s ease-in-out infinite;
}

/* Pause on hover */
&:hover {
  animation-play-state: paused;
}
```

---

## Typography

### Heading Styles (Automatic via Space Grotesk)

```html
<h1>Large heading - 2.25rem</h1>
<h2>Medium heading - 1.875rem</h2>
<h3>Small heading - 1.5rem</h3>
<p>Body text uses Sora - clean, modern</p>
```

### Text Sizes

- Display: `text-4xl` (36px)
- Heading 1: `text-3xl` (30px)
- Heading 2: `text-2xl` (24px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Tiny: `text-xs` (12px)

---

## Responsive Considerations

```html
<!-- Glass panels adjust backdrop-filter on mobile if needed -->
<div class="glass-panel md:backdrop-blur-glass-strong">Responsive glass</div>

<!-- Glow effects can be toggled on small screens -->
<div class="glow-cyan md:glow-cyan">Optional glow</div>
```

---

## Troubleshooting

### Glass effect not showing?

- Ensure `backdrop-filter` is supported (most modern browsers)
- Check z-index layers aren't conflicting
- Verify background is visible behind the glass

### Glows too bright?

- Reduce opacity in box-shadow (0.15-0.3 range is subtle)
- Use `.shadow-glow-md` instead of `.shadow-glow-lg`

### Text hard to read?

- Increase glass panel background opacity
- Use stronger border colors
- Add text shadow for emphasis: `text-shadow: 0 0 8px rgba(0,0,0,0.5)`

### Animation stuttering?

- Use `will-change: transform` on animated elements
- Check for conflicting animations
- Consider `animation-fill-mode: forwards` for final state

---

## Performance Tips

1. **Limit glow effects** - Use sparingly for focal points
2. **Optimize backdrop-filter** - Only 8-12px blur (higher = performance cost)
3. **Use CSS variables** - Reduces repaints when colors change
4. **Contain animations** - Use `will-change` on long-running animations
5. **Prefer GPU animations** - transform and opacity only
6. **Reduce motion for users** - Respect `prefers-reduced-motion`

---

## Next Steps

1. ✅ Apply theme to main page layouts
2. ✅ Style components with glass panels
3. ✅ Add status indicators to results
4. ✅ Implement animations on cards
5. ✅ Test contrast ratios for accessibility
6. ✅ Refine glow intensities based on UX feedback

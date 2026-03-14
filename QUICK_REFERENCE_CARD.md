# Quick Reference Card - UI Design System v1.0

## 🎯 One-Minute Setup

### Fonts

- **Headings**: Space Grotesk ✓ (automatic)
- **Body/UI**: Sora ✓ (automatic)

### Animations

```
.fade-in           → Rise 0.6s (mount animation)
.ambient-drift     → Drift 6s (floating effect)
```

### Colors

```
Primary: #00c8ff (Cyan Blue) - All borders & glows
Background: #090f1b (Dark Navy) - Main background
```

### Elements

```
.glass-panel       → Main content surface
.glass-panel-alt   → Secondary surface
.border-luminous   → Glowing border effect
```

---

## 📋 Copy-Paste Examples

### Basic Card

```tsx
<div className="glass-panel p-6 rounded-lg">
  <h2>Title</h2>
  <p>Content here</p>
</div>
```

### Page with Animation

```tsx
<div className="fade-in">
  <div className="glass-panel">Content slides up smoothly</div>
</div>
```

### Floating Element

```tsx
<div className="glass-panel ambient-drift">This gently floats</div>
```

### Glowing Border

```tsx
<div className="border-luminous border p-4">Element with luminous border</div>
```

---

## 🎨 Colors & Opacity

| Use Case             | Color   | Opacity |
| -------------------- | ------- | ------- |
| Panel border         | #00c8ff | 30%     |
| Panel border (hover) | #00c8ff | 45%     |
| Glow (strong)        | #00c8ff | 15-25%  |
| Glow (soft)          | #00c8ff | 5-8%    |
| Background           | #090f1b | 100%    |

---

## ⏱️ Animation Timings

| Animation | Duration | Motion        | Use For      |
| --------- | -------- | ------------- | ------------ |
| rise      | 0.6s     | ↑ 16px        | Page loads   |
| drift     | 6s       | ↕️ 12px       | Floating UI  |
| hover     | 0.3s     | border/shadow | Interactions |

---

## 📐 Glass Panel Specs

```
Background: rgba(18, 26, 45, 0.35)
Blur: 10px
Saturation: 180%
Border: 1px #00c8ff @ 30%
Glow: Multi-layer shadows
```

---

## ✅ Checklist for New Components

- [ ] Use `.fade-in` on initial render
- [ ] Use `.glass-panel` for main container
- [ ] Headings auto-use Space Grotesk
- [ ] Body text auto-uses Sora
- [ ] Add `.ambient-drift` if floating
- [ ] Verify color contrast (WCAG AA)
- [ ] Test animations on mobile

---

## 🚨 Common Mistakes

❌ Applying custom fonts to headings
❌ Using old mint color instead of cyan
❌ Forgetting .fade-in on component mount
❌ Not checking hover states

✅ Trust the automatic fonts
✅ Use cyan #00c8ff everywhere
✅ Add .fade-in to main containers
✅ Verify all interactive states

---

## 📱 Mobile Considerations

- Animations run smooth on all devices
- Glows may appear softer on phones
- Touch targets remain 44px minimum
- Drift animation safe for battery

---

## 🔗 File Locations

| What   | Where                 |
| ------ | --------------------- |
| Styles | `src/index.css`       |
| Config | `tailwind.config.ts`  |
| Fonts  | Imported in CSS       |
| Docs   | `UI_DESIGN_SYSTEM.md` |

---

## 🎓 Full Documentation

See detailed guides:

- **UI_DESIGN_SYSTEM.md** - Complete reference
- **IMPLEMENTATION_GUIDE_v1.md** - Detailed usage
- **DESIGN_IMPLEMENTATION_SUMMARY.md** - What changed

---

## 🚀 Status

✅ Typography system active
✅ Animations defined
✅ Glass panels ready
✅ Background complete
✅ Colors unified

**Ready for production!**

---

**Version**: 1.0
**Date**: March 15, 2026

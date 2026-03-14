/**
 * Cyber Trust Theme - Color Tokens Reference
 *
 * This file documents all color values and CSS custom properties
 * used in the Cyber Trust theme system.
 */

// ============================================================================
// CSS CUSTOM PROPERTIES (use in CSS)
// ============================================================================

/**
 * :root {
 *   // CORE BACKGROUNDS
 *   --background: 220 30% 8%;           // #0a1420
 *   --foreground: 220 15% 95%;          // #f0f4f8
 *
 *   // SURFACE COLORS
 *   --card: 220 25% 12%;                // #0e1b28
 *   --card-foreground: 220 15% 95%;     // #f0f4f8
 *   --popover: 220 25% 12%;             // #0e1b28
 *   --popover-foreground: 220 15% 95%;  // #f0f4f8
 *
 *   // INTERACTIVE COLORS
 *   --primary: 200 100% 50%;            // #0096ff (Cyber Blue)
 *   --primary-foreground: 220 30% 8%;   // #0a1420
 *   --secondary: 280 70% 50%;           // #a855f7 (Cyber Purple)
 *   --secondary-foreground: 220 30% 8%; // #0a1420
 *   --accent: 180 100% 45%;             // #00c8ff (Cyber Cyan)
 *   --accent-foreground: 220 30% 8%;    // #0a1420
 *
 *   // SEMANTIC COLORS
 *   --destructive: 0 84% 60%;           // #ff4d4d
 *   --destructive-foreground: 220 30% 8%; // #0a1420
 *
 *   // MUTED/DISABLED
 *   --muted: 220 20% 30%;               // #3d4a5c
 *   --muted-foreground: 220 15% 70%;    // #b8c5d6
 *
 *   // FORM & BORDERS
 *   --border: 220 25% 25%;              // #1e3f50
 *   --input: 220 25% 18%;               // #152436
 *   --ring: 200 100% 50%;               // #0096ff
 *
 *   // RADIUS
 *   --radius: 0.75rem;
 *
 *   // CYBER SPECIFIC
 *   --cyber-dark: 220 30% 8%;           // #0a1420
 *   --cyber-blue: 200 100% 50%;         // #0096ff
 *   --cyber-cyan: 180 100% 45%;         // #00c8ff
 *   --cyber-purple: 280 70% 50%;        // #a855f7
 *   --cyber-glass: 220 25% 12%;         // #0e1b28
 *
 *   // TRUST INDICATORS
 *   --trust-verified: 120 80% 45%;      // #22c55e (Green)
 *   --trust-questionable: 45 95% 50%;   // #fbbf24 (Amber)
 *   --trust-misinformation: 0 95% 55%;  // #ef4444 (Red)
 *   --trust-glow: 200 100% 50%;         // #0096ff
 *
 *   // SHADOWS & GLOWS
 *   --shadow-card: 0 0 20px rgba(0, 200, 255, 0.15),
 *                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
 *   --shadow-elevated: 0 0 30px rgba(0, 200, 255, 0.25),
 *                      inset 0 1px 0 rgba(255, 255, 255, 0.15);
 *   --glow-cyan: 0 0 20px rgba(0, 200, 255, 0.4);
 *   --glow-blue: 0 0 20px rgba(0, 100, 255, 0.3);
 *   --glow-purple: 0 0 20px rgba(168, 85, 247, 0.3);
 *
 *   font-family: 'Sora', sans-serif;
 * }
 */

// ============================================================================
// HEX COLOR VALUES
// ============================================================================

const COLORS = {
  // Primary Cyber Colors
  CYBER_BLUE: "#0096ff", // Primary - Trust/Security
  CYBER_CYAN: "#00c8ff", // Accent - Highlights
  CYBER_PURPLE: "#a855f7", // Secondary - Alternatives

  // Dark Backgrounds
  DARK_NAVY: "#0a1420", // Main background
  DARK_BLUE: "#0f1a2e", // Gradient layer
  DARK_TEAL: "#0d1825", // Gradient layer
  DARK_ALMOST_BLACK: "#050a14", // Gradient layer
  DARK_SURFACE: "#0e1b28", // Card/Surface base

  // Light/Foreground
  FOREGROUND_LIGHT: "#f0f4f8", // Text
  FOREGROUND_MUTED: "#b8c5d6", // Secondary text
  FOREGROUND_DISABLED: "#3d4a5c", // Disabled text

  // Trust Indicators
  TRUST_VERIFIED: "#22c55e", // Green - Content OK
  TRUST_QUESTIONABLE: "#fbbf24", // Amber - Need review
  TRUST_MISINFORMATION: "#ef4444", // Red - False content

  // Borders & Inputs
  BORDER_COLOR: "#1e3f50", // Border/divider
  INPUT_BG: "#152436", // Input field background
  INPUT_BORDER: "#1e3f50", // Input border

  // Special Purpose
  RING_COLOR: "#0096ff", // Focus ring
  ERROR_COLOR: "#ff4d4d", // Error state
};

// ============================================================================
// RGB COLOR VALUES (for rgba operations)
// ============================================================================

const COLORS_RGB = {
  CYBER_CYAN_RGB: "0, 200, 255",
  CYBER_BLUE_RGB: "0, 100, 255",
  CYBER_PURPLE_RGB: "168, 85, 247",
  TRUST_VERIFIED_RGB: "34, 197, 94",
  TRUST_QUESTIONABLE_RGB: "245, 158, 11",
  TRUST_MISINFORMATION_RGB: "239, 68, 68",
  WHITE_RGB: "255, 255, 255",
  BLACK_RGB: "0, 0, 0",
};

// ============================================================================
// TAILWIND INTEGRATION (use in className)
// ============================================================================

/**
 * Available in tailwind.config.ts as:
 *
 * colors: {
 *   cyber: {
 *     dark: 'hsl(var(--cyber-dark))',
 *     blue: 'hsl(var(--cyber-blue))',
 *     cyan: 'hsl(var(--cyber-cyan))',
 *     purple: 'hsl(var(--cyber-purple))',
 *     glass: 'hsl(var(--cyber-glass))',
 *   },
 * }
 *
 * Usage:
 * <div className="text-cyber-cyan bg-cyber-dark border border-cyber-blue">
 *   Styled with Cyber Trust colors
 * </div>
 */

// ============================================================================
// USAGE PATTERNS
// ============================================================================

/*
 * CSS VARIABLES (in CSS files):
 * =============================
 *
 * .my-element {
 *   background: hsl(var(--primary));
 *   color: hsl(var(--foreground));
 *   border: 1px solid hsl(var(--border));
 * }
 */

/*
 * RGBA WITH OPACITY (in CSS files):
 * ==================================
 *
 * .glass-element {
 *   background: rgba(14, 27, 40, 0.4);
 *   border: 1px solid rgba(0, 200, 255, 0.2);
 *   box-shadow: 0 0 20px rgba(0, 200, 255, 0.15);
 * }
 */

/*
 * TAILWIND CLASSES (in JSX):
 * ==========================
 *
 * <div className="bg-cyber-dark text-cyber-cyan">
 *   Content
 * </div>
 *
 * <button className="bg-primary text-primary-foreground">
 *   Action
 * </button>
 */

/*
 * INLINE STYLES (in JSX):
 * =======================
 *
 * <div style={{
 *   backgroundColor: '#0a1420',
 *   color: '#00c8ff',
 *   boxShadow: '0 0 20px rgba(0, 200, 255, 0.15)',
 * }}>
 *   Content
 * </div>
 */

// ============================================================================
// GLOW EFFECTS - BOX-SHADOW VALUES
// ============================================================================

const GLOWS = {
  CYAN_LIGHT: "0 0 12px rgba(0, 200, 255, 0.25)",
  CYAN_MEDIUM: "0 0 20px rgba(0, 200, 255, 0.3)",
  CYAN_STRONG: "0 0 30px rgba(0, 200, 255, 0.5)",

  BLUE_LIGHT: "0 0 12px rgba(0, 100, 255, 0.2)",
  BLUE_MEDIUM: "0 0 20px rgba(0, 100, 255, 0.3)",
  BLUE_STRONG: "0 0 25px rgba(0, 100, 255, 0.4)",

  PURPLE_LIGHT: "0 0 12px rgba(168, 85, 247, 0.2)",
  PURPLE_MEDIUM: "0 0 20px rgba(168, 85, 247, 0.3)",
  PURPLE_STRONG: "0 0 25px rgba(168, 85, 247, 0.4)",

  GREEN_LIGHT: "0 0 12px rgba(34, 197, 94, 0.2)",
  GREEN_MEDIUM: "0 0 20px rgba(34, 197, 94, 0.3)",
  GREEN_STRONG: "0 0 25px rgba(34, 197, 94, 0.4)",

  RED_LIGHT: "0 0 12px rgba(239, 68, 68, 0.2)",
  RED_MEDIUM: "0 0 20px rgba(239, 68, 68, 0.3)",
  RED_STRONG: "0 0 25px rgba(239, 68, 68, 0.4)",

  AMBER_LIGHT: "0 0 12px rgba(245, 158, 11, 0.2)",
  AMBER_MEDIUM: "0 0 20px rgba(245, 158, 11, 0.3)",
  AMBER_STRONG: "0 0 25px rgba(245, 158, 11, 0.4)",
};

// ============================================================================
// GLASS EFFECT - BACKGROUND & BORDER COMBINATIONS
// ============================================================================

const GLASS_PANELS = {
  STANDARD: {
    background: "rgba(30, 60, 110, 0.4)",
    border: "1px solid rgba(0, 200, 255, 0.2)",
    blur: "8px",
  },
  ENHANCED: {
    background: "rgba(40, 80, 140, 0.35)",
    border: "1px solid rgba(168, 85, 247, 0.25)",
    blur: "12px",
  },
};

// ============================================================================
// STATUS COLORS - COMPLETE SETS
// ============================================================================

const STATUS_COLORS = {
  VERIFIED: {
    background: "rgba(34, 197, 94, 0.15)", // Green with transparency
    border: "1px solid rgba(34, 197, 94, 0.4)",
    text: "#22c55e",
    glow: "0 0 12px rgba(34, 197, 94, 0.3)",
  },
  QUESTIONABLE: {
    background: "rgba(245, 158, 11, 0.15)", // Amber with transparency
    border: "1px solid rgba(245, 158, 11, 0.4)",
    text: "#fbbf24",
    glow: "0 0 12px rgba(245, 158, 11, 0.3)",
  },
  MISINFORMATION: {
    background: "rgba(239, 68, 68, 0.15)", // Red with transparency
    border: "1px solid rgba(239, 68, 68, 0.4)",
    text: "#ef4444",
    glow: "0 0 12px rgba(239, 68, 68, 0.3)",
  },
};

// ============================================================================
// GRADIENT DEFINITIONS
// ============================================================================

const GRADIENTS = {
  // Backgrounds
  PAGE_BACKGROUND: `
    radial-gradient(circle at 20% 50%, rgba(0, 150, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a1420 0%, #0f1a2e 25%, #0d1825 50%, #0a1420 75%, #050a14 100%)
  `,

  // Text
  GRADIENT_CYBER: `
    linear-gradient(135deg, #00c8ff 0%, #a855f7 50%, #00c8ff 100%)
  `,

  // Button
  GRADIENT_NEON_BUTTON: `
    linear-gradient(135deg, rgba(0, 150, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)
  `,

  // Hover
  GRADIENT_NEON_BUTTON_HOVER: `
    linear-gradient(135deg, rgba(0, 200, 255, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)
  `,
};

// ============================================================================
// OPACITY VALUES
// ============================================================================

const OPACITY = {
  GLASS_STANDARD: 0.4, // Standard glass panel
  GLASS_ENHANCED: 0.35, // Enhanced glass panel
  BORDER_SUBTLE: 0.2, // Subtle borders
  BORDER_VISIBLE: 0.4, // Visible borders
  GLOW_LIGHT: 0.15, // Light glow
  GLOW_MEDIUM: 0.25, // Medium glow
  GLOW_STRONG: 0.5, // Strong glow
  GRID_TEXTURE: 0.015, // Grid texture overlay
};

// ============================================================================
// BLUR AMOUNTS
// ============================================================================

const BLUR = {
  GLASS_STANDARD: "8px",
  GLASS_STRONG: "12px",
};

// ============================================================================
// QUICK REFERENCE TABLE
// ============================================================================

/*
╔═══════════════════════════════════════════════════════════════════════════╗
║                     CYBER TRUST COLOR PALETTE                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ COLOR         │ HEX VALUE  │ RGB               │ HSL             │ USE    ║
╟───────────────┼────────────┼───────────────────┼─────────────────┼────────╣
║ Cyber Blue    │ #0096ff    │ 0, 150, 255       │ 200 100% 50%    │ Primary║
║ Cyber Cyan    │ #00c8ff    │ 0, 200, 255       │ 180 100% 45%    │ Accent ║
║ Cyber Purple  │ #a855f7    │ 168, 85, 247      │ 280 70% 50%     │ Sec.   ║
║ Dark Navy     │ #0a1420    │ 10, 20, 32        │ 220 30% 8%      │ BG     ║
║ Verified      │ #22c55e    │ 34, 197, 94       │ 120 80% 45%     │ OK     ║
║ Questionable  │ #fbbf24    │ 245, 191, 36      │ 45 95% 50%      │ Alert  ║
║ Misinformation│ #ef4444    │ 239, 68, 68       │ 0 95% 55%       │ Error  ║
║ Foreground    │ #f0f4f8    │ 240, 244, 248     │ 220 15% 95%     │ Text   ║
╚═══════════════════════════════════════════════════════════════════════════╝
*/

export {
  COLORS,
  COLORS_RGB,
  GLOWS,
  GLASS_PANELS,
  STATUS_COLORS,
  GRADIENTS,
  OPACITY,
  BLUR,
};

import React, { useState } from "react";

/**
 * ThemeShowcase Component
 * Demonstrates all Cyber Trust Theme elements
 * Useful for design review and component testing
 */
export const ThemeShowcase: React.FC = () => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  return (
    <div className="page-gradient min-h-screen p-8 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gradient-cyber mb-2">
          🌌 Cyber Trust Theme
        </h1>
        <p className="text-muted-foreground">
          Complete theme system for TrustVault Finder
        </p>
      </div>

      {/* Color Palette */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cyber Colors */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-cyber-blue mb-3"></div>
            <p className="text-sm font-medium">Cyber Blue</p>
            <p className="text-xs text-muted-foreground">#0096ff</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-cyber-cyan mb-3"></div>
            <p className="text-sm font-medium">Cyber Cyan</p>
            <p className="text-xs text-muted-foreground">#00c8ff</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-cyber-purple mb-3"></div>
            <p className="text-sm font-medium">Cyber Purple</p>
            <p className="text-xs text-muted-foreground">#a855f7</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded border-2 border-border mb-3"></div>
            <p className="text-sm font-medium">Dark Base</p>
            <p className="text-xs text-muted-foreground">#0a1420</p>
          </div>

          {/* Trust Colors */}
          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-green-500 mb-3"></div>
            <p className="text-sm font-medium">Verified</p>
            <p className="text-xs text-muted-foreground">#22c55e</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-amber-400 mb-3"></div>
            <p className="text-sm font-medium">Questionable</p>
            <p className="text-xs text-muted-foreground">#fbbf24</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-red-500 mb-3"></div>
            <p className="text-sm font-medium">Misinformation</p>
            <p className="text-xs text-muted-foreground">#ef4444</p>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="w-full h-20 rounded bg-foreground mb-3"></div>
            <p className="text-sm font-medium">Foreground</p>
            <p className="text-xs text-muted-foreground">#f0f4f8</p>
          </div>
        </div>
      </section>

      {/* Glass Panels */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Glass Panels</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">
              Standard Glass Panel
            </h3>
            <p className="text-foreground/80">
              Cyan border with 8px blur. Perfect for primary content.
            </p>
          </div>

          <div className="glass-panel-alt p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              Enhanced Glass Panel
            </h3>
            <p className="text-foreground/80">
              Purple accent with 12px blur. Great for secondary content.
            </p>
          </div>
        </div>
      </section>

      {/* Luminous Borders */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Luminous Borders</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-luminous p-6 rounded-lg bg-card">
            <p className="text-sm">Cyan luminous</p>
          </div>

          <div className="border-luminous-purple p-6 rounded-lg bg-card">
            <p className="text-sm">Purple luminous</p>
          </div>

          <div className="border-luminous-cyan p-6 rounded-lg bg-card">
            <p className="text-sm">Enhanced cyan</p>
          </div>
        </div>
      </section>

      {/* Glow Effects */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Glow Effects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { class: "glow-cyan", label: "Cyan", color: "bg-cyan-500" },
            { class: "glow-blue", label: "Blue", color: "bg-blue-500" },
            { class: "glow-purple", label: "Purple", color: "bg-purple-500" },
            { class: "glow-green", label: "Green", color: "bg-green-500" },
            { class: "glow-red", label: "Red", color: "bg-red-500" },
            { class: "glow-amber", label: "Amber", color: "bg-amber-500" },
          ].map((glow) => (
            <div key={glow.class} className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-lg ${glow.color} ${glow.class}`}
              />
              <p className="text-sm text-muted-foreground">{glow.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Status Indicators */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Status Indicators</h2>
        <div className="space-y-3">
          <div className="status-verified px-4 py-3 rounded-lg">
            ✓ Verified - Content is credible and trustworthy
          </div>

          <div className="status-questionable px-4 py-3 rounded-lg">
            ⚠ Questionable - Content requires further verification
          </div>

          <div className="status-misinformation px-4 py-3 rounded-lg">
            ✗ Misinformation - Content contains false or misleading information
          </div>
        </div>
      </section>

      {/* Badges & Labels */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Badges & Labels</h2>
        <div className="flex flex-wrap gap-3">
          <span className="trust-badge">✓ Verified Source</span>
          <span className="trust-badge">🔍 Analyzed</span>
          <span className="trust-badge">⚡ Real-time</span>
          <span className="trust-badge">🛡️ Secured</span>
        </div>
      </section>

      {/* Typography */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Typography</h2>
        <div className="glass-panel p-8 rounded-lg space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Heading 1 (Space Grotesk)
            </h1>
            <p className="text-sm text-muted-foreground">36px, bold</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">
              Heading 2 (Space Grotesk)
            </h2>
            <p className="text-sm text-muted-foreground">30px, bold</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2">
              Heading 3 (Space Grotesk)
            </h3>
            <p className="text-sm text-muted-foreground">24px, bold</p>
          </div>

          <div>
            <p className="text-base mb-2 font-sora">
              Body text (Sora) - Clean and readable
            </p>
            <p className="text-sm text-muted-foreground">16px, regular</p>
          </div>

          <div>
            <p className="text-gradient-cyber font-bold text-lg">
              Gradient Text Effect
            </p>
            <p className="text-sm text-muted-foreground">
              Cyan → Purple → Cyan
            </p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="neon-button px-6 py-2 rounded-lg font-medium">
            Analyze
          </button>

          <button className="neon-button px-6 py-2 rounded-lg font-medium">
            Verify
          </button>

          <button
            className="neon-button px-6 py-2 rounded-lg font-medium hover-glow"
            onMouseEnter={() => setHoveredElement("button")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Hover me (Glow)
          </button>
        </div>
      </section>

      {/* Animations */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Animations</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Fade-in (Rise)</p>
            <div className="glass-panel p-6 rounded-lg fade-in">
              This element fades in with a smooth rise animation
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Ambient Drift</p>
            <div className="glass-panel p-6 rounded-lg ambient-drift cursor-pointer">
              This element drifts subtly for ambient effect
            </div>
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Shadows & Glows</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="shadow-card p-4 rounded-lg bg-card">
            <p className="text-sm font-medium">Shadow Card</p>
          </div>

          <div className="shadow-elevated p-4 rounded-lg bg-card">
            <p className="text-sm font-medium">Shadow Elevated</p>
          </div>

          <div className="shadow-glow-md p-4 rounded-lg bg-card">
            <p className="text-sm font-medium">Glow Medium</p>
          </div>

          <div className="shadow-glow-lg p-4 rounded-lg bg-card">
            <p className="text-sm font-medium">Glow Large</p>
          </div>
        </div>
      </section>

      {/* Interactive Components */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Interactive Components</h2>
        <div className="glass-panel p-6 rounded-lg hover-glow transition-smooth">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">
            Hover Interactive Panel
          </h3>
          <p className="text-foreground/80 mb-4">
            This panel brightens on hover with smooth transitions
          </p>
          <div className="flex gap-2">
            <span className="trust-badge">✓ Interactive</span>
            <span className="trust-badge">🎨 Styled</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-muted-foreground">
          Cyber Trust Theme © 2024 - TrustVault Finder
        </p>
      </div>
    </div>
  );
};

export default ThemeShowcase;

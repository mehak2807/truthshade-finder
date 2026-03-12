import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Upload, Scan } from "lucide-react";
import CredibilityGauge from "@/components/CredibilityGauge";
import HeatmapDemo from "@/components/HeatmapDemo";
import AnalysisPanel from "@/components/AnalysisPanel";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleAnalyze = () => {
    if (inputText.trim()) setShowDemo(true);
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-trust-glow" />
            <span className="text-lg font-bold font-['Space_Grotesk'] tracking-tight">TrustVault</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="hidden sm:inline hover:text-foreground transition-colors cursor-pointer">How it works</span>
            <span className="hidden sm:inline hover:text-foreground transition-colors cursor-pointer">About</span>
            <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors">
              Install Extension
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 pt-20 pb-16">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            Detect <span className="text-gradient-trust">misinformation</span> before it spreads
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
            AI-powered credibility analysis for news articles, social media posts, and screenshots. See exactly which claims are trustworthy.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div
          className="mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="rounded-xl border border-border bg-card shadow-card p-1">
            <textarea
              className="w-full bg-transparent resize-none p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[120px]"
              placeholder="Paste a news article, claim, or URL to analyze..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex items-center justify-between p-3 pt-0">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-secondary transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Image
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-secondary transition-colors">
                  <Scan className="w-3.5 h-3.5" /> Scan Page
                </button>
              </div>
              <button
                onClick={handleAnalyze}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-trust-glow text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-glow"
              >
                <Search className="w-4 h-4" /> Analyze
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Demo Results */}
      {showDemo && (
        <motion.section
          className="container max-w-6xl mx-auto px-4 pb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="border-t border-border/50 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Analysis Results</h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-trust-misinformation/15 text-trust-misinformation border border-trust-misinformation/20">
                High Risk
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Scores */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card flex flex-col items-center gap-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider self-start">Credibility Score</h3>
                <CredibilityGauge score={23} label="Overall Credibility" />
                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border">
                  <CredibilityGauge score={85} label="Source" />
                  <CredibilityGauge score={12} label="Claims" />
                </div>
              </div>

              {/* Heatmap */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Misinformation Heatmap</h3>
                <HeatmapDemo />
              </div>

              {/* Findings */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Findings</h3>
                <AnalysisPanel />
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Features */}
      {!showDemo && (
        <section className="container max-w-6xl mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-5 h-5 text-trust-glow" />, title: "Text & URL Analysis", desc: "Paste any article or claim for instant AI-powered credibility scoring." },
              { icon: <Scan className="w-5 h-5 text-trust-glow" />, title: "Visual Heatmap", desc: "See misinformation highlighted directly on the page with color-coded risk levels." },
              { icon: <ShieldCheck className="w-5 h-5 text-trust-glow" />, title: "Explainable AI", desc: "Understand exactly why content is flagged with clear, detailed explanations." },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;

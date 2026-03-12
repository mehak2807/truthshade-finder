import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Scan, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CredibilityGauge from "@/components/CredibilityGauge";
import HeatmapDemo, { type Segment } from "@/components/HeatmapDemo";
import AnalysisPanel, { type Finding } from "@/components/AnalysisPanel";

interface AnalysisResult {
  overall_score: number;
  source_score: number;
  claims_score: number;
  risk_level: "low" | "medium" | "high";
  segments: Segment[];
  findings: Finding[];
}

const riskColors = {
  low: "bg-trust-verified/15 text-trust-verified border-trust-verified/20",
  medium: "bg-trust-questionable/15 text-trust-questionable border-trust-questionable/20",
  high: "bg-trust-misinformation/15 text-trust-misinformation border-trust-misinformation/20",
};

const riskLabels = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      toast.error("Please enter some text to analyze.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { text: trimmed },
      });

      if (error) {
        throw new Error(error.message || "Analysis failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data as AnalysisResult);
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error(e.message || "Failed to analyze. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            Detect <span className="text-gradient-trust">misinformation</span> in real time
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
            AI-powered credibility analysis for news articles, social media posts, and claims. Paste any text and get instant results.
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
              placeholder="Paste a news article, claim, or social media post to analyze..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex items-center justify-end p-3 pt-0">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-trust-glow text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Results */}
      {result && (
        <motion.section
          className="container max-w-6xl mx-auto px-4 pb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="border-t border-border/50 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Analysis Results</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${riskColors[result.risk_level]}`}>
                {riskLabels[result.risk_level]}
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Scores */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card flex flex-col items-center gap-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider self-start">Credibility Score</h3>
                <CredibilityGauge score={result.overall_score} label="Overall Credibility" />
                <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border">
                  <CredibilityGauge score={result.source_score} label="Source" />
                  <CredibilityGauge score={result.claims_score} label="Claims" />
                </div>
              </div>

              {/* Heatmap */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card overflow-auto max-h-[500px]">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Misinformation Heatmap</h3>
                <HeatmapDemo segments={result.segments} />
              </div>

              {/* Findings */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card overflow-auto max-h-[500px]">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Findings</h3>
                <AnalysisPanel findings={result.findings} />
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Features (when no result) */}
      {!result && !isLoading && (
        <section className="container max-w-6xl mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-5 h-5 text-trust-glow" />, title: "Real-Time AI Analysis", desc: "Powered by advanced AI models that analyze claims, sources, and language patterns instantly." },
              { icon: <Scan className="w-5 h-5 text-trust-glow" />, title: "Visual Heatmap", desc: "See misinformation highlighted directly in the text with color-coded risk levels." },
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

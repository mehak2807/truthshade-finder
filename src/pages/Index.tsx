import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Scan, Loader2, Image, Type, Globe, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CredibilityGauge from "@/components/CredibilityGauge";
import HeatmapDemo, { type Segment } from "@/components/HeatmapDemo";
import AnalysisPanel, { type Finding } from "@/components/AnalysisPanel";
import ExplainableAI from "@/components/ExplainableAI";
import ImageUpload from "@/components/ImageUpload";
import UrlInput from "@/components/UrlInput";

interface AnalysisResult {
  overall_score: number;
  source_score: number;
  claims_score: number;
  risk_level: "low" | "medium" | "high";
  segments: Segment[];
  findings: Finding[];
  explanation: string;
}

const riskColors = {
  low: "bg-trust-verified/10 text-trust-verified border border-trust-verified/25",
  medium: "bg-trust-questionable/10 text-trust-questionable border border-trust-questionable/25",
  high: "bg-trust-misinformation/10 text-trust-misinformation border border-trust-misinformation/25",
};

const riskLabels = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

type InputMode = "text" | "image" | "url";

const modeConfig = [
  { key: "text" as InputMode, icon: Type, label: "Text" },
  { key: "image" as InputMode, icon: Image, label: "Image" },
  { key: "url" as InputMode, icon: Globe, label: "URL" },
];

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("text");

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
      if (error) throw new Error(error.message || "Analysis failed");
      if (data?.error) throw new Error(data.error);
      setResult(data as AnalysisResult);
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error(e.message || "Failed to analyze. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-sm">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold font-['Space_Grotesk'] tracking-tight text-foreground">TrustVault</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container max-w-5xl mx-auto px-4 pt-16 pb-12">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground">
            Verify any claim,<br />instantly.
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Paste text, upload an image, or enter a URL — our AI analyzes credibility and flags misinformation.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          className="mt-10 max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Mode tabs */}
          <div className="flex gap-1 mb-3 bg-muted rounded-lg p-1 w-fit">
            {modeConfig.map((m) => (
              <button
                key={m.key}
                onClick={() => setInputMode(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  inputMode === m.key
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <m.icon className="w-3.5 h-3.5" /> {m.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card shadow-card">
            {inputMode === "image" && (
              <div className="p-4 pb-2">
                <ImageUpload
                  onTextExtracted={(text) => {
                    setInputText(text);
                    toast.success("Text extracted from image!");
                  }}
                  isExtracting={isExtracting}
                  setIsExtracting={setIsExtracting}
                />
              </div>
            )}

            {inputMode === "url" && (
              <UrlInput
                onTextExtracted={(text) => {
                  setInputText(text);
                  toast.success("Content fetched from URL!");
                }}
                isExtracting={isExtracting}
                setIsExtracting={setIsExtracting}
              />
            )}

            <textarea
              className="w-full bg-transparent resize-none p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[100px]"
              placeholder={
                inputMode === "image"
                  ? "Extracted text will appear here..."
                  : inputMode === "url"
                  ? "Fetched content will appear here..."
                  : "Paste a news article, claim, or social media post..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading || isExtracting}
            />
            <div className="flex items-center justify-end p-3 pt-0">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || isExtracting || !inputText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Search className="w-4 h-4" /> Analyze</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Results */}
      {result && (
        <motion.section
          className="container max-w-5xl mx-auto px-4 pb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="border-t border-border pt-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Results</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[result.risk_level]}`}>
                {riskLabels[result.risk_level]}
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Scores */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">Credibility</h3>
                <div className="flex justify-center mb-5">
                  <CredibilityGauge score={result.overall_score} label="Overall" size="lg" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  <CredibilityGauge score={result.source_score} label="Source" size="sm" />
                  <CredibilityGauge score={result.claims_score} label="Claims" size="sm" />
                </div>
              </div>

              {/* Heatmap */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card overflow-auto max-h-[460px]">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Heatmap</h3>
                <HeatmapDemo segments={result.segments} />
              </div>

              {/* Findings */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card overflow-auto max-h-[460px]">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Findings</h3>
                <AnalysisPanel findings={result.findings} />
              </div>
            </div>

            {result.explanation && (
              <div className="mt-6">
                <ExplainableAI explanation={result.explanation} />
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Features */}
      {!result && !isLoading && (
        <section className="container max-w-5xl mx-auto px-4 pb-20">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Search, title: "AI Analysis", desc: "Analyzes claims, sources, and language patterns using advanced models." },
              { icon: Scan, title: "Image OCR", desc: "Upload screenshots — AI extracts and analyzes text automatically." },
              { icon: Globe, title: "URL Fetch", desc: "Enter any article URL to fetch and analyze its content instantly." },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
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

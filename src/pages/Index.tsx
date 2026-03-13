import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Home, Loader2, Mic, Search, Scan, Type, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CredibilityGauge from "@/components/CredibilityGauge";
import HeatmapDemo, { type Segment } from "@/components/HeatmapDemo";
import AnalysisPanel, { type Finding } from "@/components/AnalysisPanel";
import ExplainableAI from "@/components/ExplainableAI";
import ScreenshotFactChecker from "@/components/ScreenshotFactChecker";
import UrlInput from "@/components/UrlInput";
import VoiceInput from "@/components/VoiceInput";
import logo from "@/assets/trustvault-logo.png";

interface AnalysisResult {
  overall_score: number;
  source_score: number;
  claims_score: number;
  risk_level: "low" | "medium" | "high";
  segments: Segment[];
  findings: Finding[];
  explanation: string;
}

interface ForwardDetectionResult {
  forward_detected: boolean;
  similarity_score: number;
  risk_score: number;
  forward_verdict: string;
  detected_pattern: string;
  message_type: string;
  forward_explanation: string;
  recommended_action: string;
  forward_signals: string[];
}

const riskColors = {
  low: "bg-trust-verified/10 text-trust-verified border border-trust-verified/25",
  medium: "bg-trust-questionable/10 text-trust-questionable border border-trust-questionable/25",
  high: "bg-trust-misinformation/10 text-trust-misinformation border border-trust-misinformation/25",
};

const riskLabels = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

type InputMode = "text" | "screenshot" | "url" | "voice";

const modeConfig = [
  { key: "text" as InputMode, icon: Type, label: "Text" },
  { key: "screenshot" as InputMode, icon: Scan, label: "Screenshot" },
  { key: "url" as InputMode, icon: Globe, label: "URL" },
  { key: "voice" as InputMode, icon: Mic, label: "Voice" },
];

const hotTopics = [
  {
    title: "LPG Cylinder Shortage: Panic over cooking gas supply disruptions across India",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=640&q=80",
    source: "India Energy Watch",
    risk: "High",
  },
  {
    title: "India LPG Crisis: Black marketing reports in Delhi and Bengaluru while government denies major shortage",
    image:
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=640&q=80",
    source: "Metro Policy Desk",
    risk: "High",
  },
  {
    title: "US-Israel-Iran tensions escalate, oil crosses $100 and fuel supply fears rise",
    image:
      "https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=640&q=80",
    source: "Global Conflict Monitor",
    risk: "High",
    faces: [
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Seyyed_Ali_Khamenei.jpg",
    ],
  },
  {
    title: "Middle East conflict pressure: PM-level India-Iran talks and impact on LPG and economy",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=640&q=80",
    source: "Diplomacy Brief",
    risk: "Medium",
  },
  {
    title: "IPL 2026 Schedule: Phase 1 announced, RCB vs SRH opener on March 28",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=640&q=80",
    source: "Sports Pulse",
    risk: "Medium",
  },
  {
    title: "Inflation update: CPI at 10-month high, RBI rates and fuel stress hit cost of living",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80",
    source: "Economic Tracker",
    risk: "Medium",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [forwardDetection, setForwardDetection] = useState<ForwardDetectionResult | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [liveTopicIndex, setLiveTopicIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTopicIndex((prev) => (prev + 1) % hotTopics.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleAnalyze = async (overrideText?: string) => {
    const trimmed = (overrideText ?? inputText).trim();
    if (!trimmed) {
      toast.error("Please enter some text to analyze.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setForwardDetection(null);
    try {
      const [analysisRes, forwardRes] = await Promise.allSettled([
        supabase.functions.invoke("analyze-news", {
          body: { text: trimmed },
        }),
        supabase.functions.invoke("fact-check", {
          body: { content: trimmed, language: "auto", type: "text" },
        }),
      ]);

      if (analysisRes.status === "rejected") {
        throw new Error("Analysis failed");
      }

      const analysisData = analysisRes.value;
      if (analysisData.error) throw new Error(analysisData.error.message || "Analysis failed");
      if (analysisData.data?.error) throw new Error(analysisData.data.error);
      setResult(analysisData.data as AnalysisResult);

      if (forwardRes.status === "fulfilled" && !forwardRes.value.error && forwardRes.value.data) {
        setForwardDetection(forwardRes.value.data as ForwardDetectionResult);
      }
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error(e.message || "Failed to analyze. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInputText(text);
    handleAnalyze(text);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/90 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="TrustVault" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-bold font-['Space_Grotesk'] tracking-tight text-foreground">TrustVault</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </button>
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
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-foreground">
            Verify any claim,<br />instantly.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Paste text, take a screenshot, or enter a URL — our AI analyzes credibility and flags misinformation.
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
            {inputMode === "screenshot" && (
              <div className="p-4">
                <ScreenshotFactChecker />
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

            {inputMode === "voice" && (
              <VoiceInput onTranscript={handleVoiceTranscript} />
            )}

            {(inputMode === "text" || inputMode === "url") && (
              <>
                <textarea
                  className="w-full bg-transparent resize-none p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[100px]"
                  placeholder={
                    inputMode === "url"
                      ? "Fetched content will appear here..."
                      : "Paste a news article, claim, or social media post..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading || isExtracting}
                />
                <div className="flex items-center justify-end p-3 pt-0">
                  <button
                    onClick={() => handleAnalyze()}
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
              </>
            )}
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

            {forwardDetection?.forward_detected && (
              <div className="mt-6 rounded-xl border border-trust-misinformation/30 bg-trust-misinformation/5 p-4">
                <h3 className="text-sm font-bold text-trust-misinformation">🚨 Viral WhatsApp Forward Detected</h3>
                <p className="mt-2 text-sm text-foreground">
                  Similarity Match: {Math.round((forwardDetection.similarity_score || 0) * 100)}%
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pattern</p>
                <ul className="mt-1 space-y-1 text-sm text-foreground/90">
                  <li>• {forwardDetection.detected_pattern || "Known misinformation forward"}</li>
                  {(forwardDetection.forward_signals || []).slice(0, 2).map((signal) => (
                    <li key={signal}>• {signal}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommendation</p>
                <p className="mt-1 text-sm font-medium text-trust-misinformation">
                  {forwardDetection.recommended_action || "Do not forward this message."}
                </p>
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

          <motion.div
            className="mt-8 rounded-2xl border border-border bg-card/95 p-4 shadow-card sm:p-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <Flame className="h-3.5 w-3.5" />
                  Live Hot Topics
                </p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">Trending Claims Being Verified Right Now</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Tracking: <span className="font-semibold text-foreground">{hotTopics[liveTopicIndex].title}</span>
              </p>
            </div>

            <div className="topics-marquee overflow-hidden rounded-xl border border-border/80 bg-background/70">
              <div className="topics-track flex w-max gap-3 p-3">
                {[...hotTopics, ...hotTopics].map((topic, index) => (
                  <article
                    key={`${topic.title}-${index}`}
                    className="w-[260px] shrink-0 rounded-xl border border-border bg-card p-2 shadow-card"
                  >
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="h-28 w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="px-1 pb-1 pt-3">
                      <p className="text-xs font-semibold leading-snug text-foreground">{topic.title}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{topic.source}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-semibold ${
                            topic.risk === "High"
                              ? "bg-trust-misinformation/10 text-trust-misinformation"
                              : "bg-trust-questionable/10 text-trust-questionable"
                          }`}
                        >
                          {topic.risk} Risk
                        </span>
                      </div>
                      {topic.faces && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={topic.faces[0]}
                            alt="Donald Trump"
                            className="h-6 w-6 rounded-full border border-white object-cover shadow-sm"
                            loading="lazy"
                          />
                          <img
                            src={topic.faces[1]}
                            alt="Ali Khamenei"
                            className="-ml-3 h-6 w-6 rounded-full border border-white object-cover shadow-sm"
                            loading="lazy"
                          />
                          <span className="text-[10px] font-medium text-muted-foreground">Trump vs Khamenei</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setInputMode("text");
                          setInputText(topic.title);
                        }}
                        className="mt-3 w-full rounded-lg border border-border px-2 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        Verify This Topic
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Index;

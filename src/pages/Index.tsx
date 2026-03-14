import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Flame,
  Home,
  Loader2,
  Mic,
  Search,
  Scan,
  Type,
  Globe,
  BookOpen,
} from "lucide-react";
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
import ReportToCyberPolice from "@/components/ReportToCyberPolice";
import LanguageBar from "@/components/LanguageBar";
import { type LanguageCode } from "@/config/languages";
import logo from "@/assets/trustvault-logo.png";
import { getVerificationStatus } from "@/lib/verificationHelpers";

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
  low: "border border-emerald-300/50 bg-emerald-400/15 text-emerald-200 shadow-[0_0_16px_rgba(74,222,128,0.25)]",
  medium: "border border-amber-300/50 bg-amber-400/15 text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.22)]",
  high: "border border-rose-300/50 bg-rose-400/15 text-rose-200 shadow-[0_0_16px_rgba(251,113,133,0.24)]",
};

const riskLabels = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

const getCredibilityTheme = (score: number) => {
  if (score >= 70) {
    return {
      card: "border-cyan-300/60 bg-[linear-gradient(145deg,rgba(16,32,56,0.88),rgba(22,58,88,0.82))] shadow-[0_0_34px_rgba(56,189,248,0.28)]",
      title: "text-cyan-200",
      divider: "border-white/15",
    };
  }
  if (score >= 40) {
    return {
      card: "border-amber-300/60 bg-[linear-gradient(145deg,rgba(56,41,24,0.88),rgba(86,58,23,0.82))] shadow-[0_0_34px_rgba(245,158,11,0.26)]",
      title: "text-amber-200",
      divider: "border-white/15",
    };
  }
  return {
    card: "border-rose-300/60 bg-[linear-gradient(145deg,rgba(56,27,44,0.9),rgba(88,31,57,0.82))] shadow-[0_0_36px_rgba(251,113,133,0.28)]",
    title: "text-rose-200",
    divider: "border-white/15",
  };
};

const getCredibilityTier = (score: number) => {
  if (score >= 70) {
    return {
      label: "High Confidence",
      pill: "border-sky-300/50 bg-sky-400/15 text-sky-200",
    };
  }
  if (score >= 40) {
    return {
      label: "Medium Confidence",
      pill: "border-amber-300/50 bg-amber-400/15 text-amber-200",
    };
  }
  return {
    label: "Low Confidence",
    pill: "border-rose-300/50 bg-rose-400/15 text-rose-200",
  };
};

type InputMode = "text" | "screenshot" | "url" | "voice";

const modeConfig = [
  { key: "text" as InputMode, icon: Type, label: "Text" },
  { key: "screenshot" as InputMode, icon: Scan, label: "Screenshot" },
  { key: "url" as InputMode, icon: Globe, label: "URL" },
  { key: "voice" as InputMode, icon: Mic, label: "Voice" },
];

const hotTopics = [
  {
    title:
      "LPG Cylinder Shortage: Panic over cooking gas supply disruptions across India",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=640&q=80",
    source: "India Energy Watch",
    risk: "High",
  },
  {
    title:
      "India LPG Crisis: Black marketing reports in Delhi and Bengaluru while government denies major shortage",
    image:
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=640&q=80",
    source: "Metro Policy Desk",
    risk: "High",
  },
  {
    title:
      "US-Israel-Iran tensions escalate, oil crosses $100 and fuel supply fears rise",
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
    title:
      "Middle East conflict pressure: PM-level India-Iran talks and impact on LPG and economy",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=640&q=80",
    source: "Diplomacy Brief",
    risk: "Medium",
  },
  {
    title:
      "IPL 2026 Schedule: Phase 1 announced, RCB vs SRH opener on March 28",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=640&q=80",
    source: "Sports Pulse",
    risk: "Medium",
  },
  {
    title:
      "Inflation update: CPI at 10-month high, RBI rates and fuel stress hit cost of living",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&q=80",
    source: "Economic Tracker",
    risk: "Medium",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [forwardDetection, setForwardDetection] =
    useState<ForwardDetectionResult | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [liveTopicIndex, setLiveTopicIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const isResultsMode = !!result;

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
      if (analysisData.error)
        throw new Error(analysisData.error.message || "Analysis failed");
      if (analysisData.data?.error) throw new Error(analysisData.data.error);
      setResult(analysisData.data as AnalysisResult);

      if (
        forwardRes.status === "fulfilled" &&
        !forwardRes.value.error &&
        forwardRes.value.data
      ) {
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
    <div className="page-gradient">
      {/* Nav */}
      <nav className="border-b border-white/20 sticky top-0 z-50 glass-panel shadow-glow-md">
        <div className="container max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            <img
              src={logo}
              alt="TrustVault"
              className="w-8 h-8 rounded-lg object-cover border border-white/40"
            />
            <span className="text-lg font-bold font-['Space_Grotesk'] tracking-tight text-gradient-cyber">
              TrustVault
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/learn")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-mint transition-colors hover-glow"
              whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
            >
              <BookOpen className="w-4 h-4" /> Learn
            </motion.button>
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-mint transition-colors hover-glow"
              whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
            >
              <Home className="w-4 h-4" /> Home
            </motion.button>
          </div>
        </div>
      </nav>

      {/* App container */}
      <div className="container max-w-5xl mx-auto px-4 pt-14 pb-24">
        {/* Hero */}
        <motion.div
          className="max-w-2xl mb-10"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:whitespace-nowrap">
            Verify any claim, instantly.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed sm:whitespace-nowrap">
            Paste text, take a screenshot, or enter a URL — our AI analyzes
            credibility and flags misinformation.
          </p>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          className="mb-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
        >
          <LanguageBar
            currentLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            showQuickSelect={true}
            maxQuickSelectItems={5}
          />
        </motion.div>

        {/* Input section */}
        <motion.div
          className="w-full max-w-4xl"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          {/* Segmented tabs */}
          <div
            className={`flex gap-1 mb-4 rounded-lg p-1 w-fit ${
              isResultsMode
                ? "border border-[#8b7bff]/40 bg-[rgba(28,22,48,0.72)] backdrop-blur-md shadow-[0_0_22px_rgba(139,123,255,0.3)]"
                : "border border-white/30 glass-panel shadow-glow-md"
            }`}
          >
            {modeConfig.map((m) => (
              <motion.button
                key={m.key}
                onClick={() => setInputMode(m.key)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  inputMode === m.key
                    ? isResultsMode
                      ? "bg-[linear-gradient(135deg,rgba(139,123,255,0.45),rgba(255,138,167,0.38))] text-[#f4ecff] border border-[#c8b9ff]/60 shadow-[0_0_18px_rgba(139,123,255,0.45)]"
                      : "neon-button text-cyber-cyan shadow-glow-md"
                    : isResultsMode
                      ? "text-[#cabff0] hover:text-[#f2e8ff] hover:bg-[#8b7bff]/15"
                      : "text-muted-foreground hover:text-cyber-cyan hover-glow"
                }`}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                {inputMode === m.key && (
                  <motion.span
                    layoutId="tab-pill"
                    className={`absolute inset-0 rounded-md ${
                      isResultsMode
                        ? "border border-[#c8b9ff]/55 bg-[rgba(61,46,100,0.35)]"
                        : "border border-white/40 glass-panel"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <m.icon className="w-3.5 h-3.5" /> {m.label}
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={inputMode}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              {/* Screenshot mode — full width */}
              {inputMode === "screenshot" && (
                <div
                  className={`rounded-lg p-4 fade-in ${
                    isResultsMode
                      ? "border border-[#8b7bff]/40 bg-[rgba(34,29,58,0.72)] backdrop-blur-md shadow-[0_0_24px_rgba(139,123,255,0.28)]"
                      : "border border-white/30 glass-panel shadow-glow-lg"
                  }`}
                >
                  <ScreenshotFactChecker />
                </div>
              )}

              {/* Voice mode — full width */}
              {inputMode === "voice" && (
                <div
                  className={`rounded-lg fade-in ${
                    isResultsMode
                      ? "border border-[#8b7bff]/40 bg-[rgba(34,29,58,0.72)] backdrop-blur-md shadow-[0_0_24px_rgba(139,123,255,0.28)]"
                      : "border border-white/30 glass-panel shadow-glow-lg"
                  }`}
                >
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
              )}

              {/* Text / URL mode — two-column on desktop */}
              {(inputMode === "text" || inputMode === "url") && (
                <div className="space-y-3">
                  {/* Input panel */}
                  <div
                    className={`rounded-xl overflow-hidden fade-in min-h-[190px] ${
                      isResultsMode
                        ? "border border-[#8b7bff]/40 bg-[rgba(34,29,58,0.72)] backdrop-blur-md shadow-[0_0_24px_rgba(139,123,255,0.28)]"
                        : "border border-white/30 glass-panel shadow-glow-lg"
                    }`}
                  >
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
                      className="w-full bg-transparent resize-none px-5 py-4 text-[15px] leading-7 text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[150px]"
                      placeholder={
                        inputMode === "url"
                          ? "Fetched content will appear here..."
                          : "Paste a news article, claim, or social media post..."
                      }
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading || isExtracting}
                    />
                  </div>

                  {/* Analyze action */}
                  <div>
                    <motion.button
                      onClick={() => handleAnalyze()}
                      disabled={isLoading || isExtracting || !inputText.trim()}
                      className={`w-full min-h-[60px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                        isResultsMode
                          ? "border border-[#ffb5c9]/50 bg-[linear-gradient(135deg,rgba(139,123,255,0.5),rgba(255,138,167,0.45))] text-[#fff3f8] shadow-[0_0_24px_rgba(255,138,167,0.35)] hover:opacity-95"
                          : "bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
                      }`}
                      whileHover={
                        prefersReducedMotion ? {} : { scale: 1.03, y: -1 }
                      }
                      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" /> Analyze
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Analysis preview card */}
                  <div
                    className={`rounded-2xl p-4 min-h-[150px] ${
                      isResultsMode
                        ? "border border-[#f5b971]/45 bg-[rgba(63,49,32,0.7)] backdrop-blur-md shadow-[0_0_22px_rgba(245,185,113,0.22)]"
                        : "border border-cyber-cyan/35 glass-panel-alt shadow-glow-md"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          className="space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="h-3 rounded-full skeleton-shimmer w-3/4" />
                          <div className="h-3 rounded-full skeleton-shimmer w-1/2" />
                          <div className="h-3 rounded-full skeleton-shimmer w-5/6" />
                          <div className="h-3 rounded-full skeleton-shimmer w-2/3" />
                          <div className="h-3 rounded-full skeleton-shimmer w-4/5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          className="h-full min-h-[96px] flex flex-col items-center justify-center gap-2.5 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isResultsMode
                                ? "bg-[#f5b971]/20 border border-[#f5b971]/45"
                                : "bg-cyber-cyan/15 border border-cyber-cyan/40"
                            }`}
                          >
                            <Search className="w-5 h-5 text-primary/60" />
                          </div>
                          <p className="text-sm text-muted-foreground leading-snug">
                            Analysis preview will appear here
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.section
              className="mt-12"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="border-t border-white/20 pt-8 rounded-2xl px-2 sm:px-3 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(251,113,133,0.14),transparent_38%),linear-gradient(180deg,rgba(10,20,36,0.68),rgba(17,24,39,0.52))]">
                {/* Results header */}
                <div className="flex flex-wrap items-center gap-2 mb-5 px-1">
                  <h2 className="text-xl font-bold tracking-tight text-[#dbeafe]">
                    Results
                  </h2>
                  {/* Evidence-aware status chip */}
                  {(() => {
                    const chip = getVerificationStatus(result);
                    return (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${chip.className}`}
                      >
                        {chip.label}
                      </span>
                    );
                  })()}
                  {/* Existing risk_level badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColors[result.risk_level]}`}
                  >
                    {riskLabels[result.risk_level]}
                  </span>
                </div>

                {/* Result cards — 2-column on desktop (Credibility + Findings) */}
                {(() => {
                  const credibilityTheme = getCredibilityTheme(result.overall_score);
                  const credibilityTier = getCredibilityTier(result.overall_score);
                  return (
                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Credibility card */}
                  <motion.div
                    className={`rounded-2xl border backdrop-blur-md p-5 min-h-[460px] ${credibilityTheme.card}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0, duration: 0.4 }}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${credibilityTheme.title}`}>
                        Credibility
                      </h3>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${credibilityTier.pill}`}>
                        {credibilityTier.label}
                      </span>
                    </div>
                    <div className="flex justify-center mb-5">
                      <CredibilityGauge
                        score={result.overall_score}
                        label="Overall"
                        size="lg"
                      />
                    </div>
                    <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${credibilityTheme.divider}`}>
                      <CredibilityGauge
                        score={result.source_score}
                        label="Source"
                        size="sm"
                      />
                      <CredibilityGauge
                        score={result.claims_score}
                        label="Claims"
                        size="sm"
                      />
                    </div>
                  </motion.div>

                  {/* Findings card */}
                  <motion.div
                    className="rounded-2xl border border-fuchsia-300/55 bg-[linear-gradient(145deg,rgba(47,25,49,0.88),rgba(84,35,62,0.82))] backdrop-blur-md p-5 shadow-[0_0_30px_rgba(217,70,239,0.24)] overflow-auto min-h-[460px] max-h-[460px]"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.4 }}
                  >
                    <h3 className="text-xs font-semibold text-fuchsia-200 uppercase tracking-wider mb-4">
                      Findings
                    </h3>
                    <AnalysisPanel findings={result.findings} />
                  </motion.div>
                </div>
                  );
                })()}

                {/* Heatmap — full width */}
                <motion.div
                  className="mt-5 rounded-2xl border border-violet-300/50 bg-[linear-gradient(145deg,rgba(30,30,58,0.88),rgba(47,36,70,0.82))] backdrop-blur-md p-5 shadow-[0_0_28px_rgba(167,139,250,0.22)] overflow-auto min-h-[240px] max-h-[460px]"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.4 }}
                >
                  <h3 className="text-xs font-semibold text-violet-200 uppercase tracking-wider mb-4">
                    Heatmap
                  </h3>
                  <HeatmapDemo segments={result.segments} />
                </motion.div>

                {result.explanation && (
                  <motion.div
                    className="mt-5"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <ExplainableAI explanation={result.explanation} />
                  </motion.div>
                )}

                {forwardDetection?.forward_detected && (
                  <motion.div
                    className="mt-5 rounded-2xl border border-trust-misinformation/30 bg-trust-misinformation/5 p-4"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <h3 className="text-sm font-bold text-trust-misinformation">
                      🚨 Viral WhatsApp Forward Detected
                    </h3>
                    <p className="mt-2 text-sm text-foreground">
                      Similarity Match:{" "}
                      {Math.round(
                        (forwardDetection.similarity_score || 0) * 100,
                      )}
                      %
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pattern
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-foreground/90">
                      <li>
                        •{" "}
                        {forwardDetection.detected_pattern ||
                          "Known misinformation forward"}
                      </li>
                      {(forwardDetection.forward_signals || [])
                        .slice(0, 2)
                        .map((signal) => (
                          <li key={signal}>• {signal}</li>
                        ))}
                    </ul>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Recommendation
                    </p>
                    <p className="mt-1 text-sm font-medium text-trust-misinformation">
                      {forwardDetection.recommended_action ||
                        "Do not forward this message."}
                    </p>
                  </motion.div>
                )}

                {result.overall_score < 50 && (
                  <ReportToCyberPolice
                    score={result.overall_score}
                    contentToReport={inputText}
                  />
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Features + Hot Topics (shown when no result) */}
        {!result && !isLoading && (
          <section className="mt-12">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Search,
                  title: "AI Analysis",
                  desc: "Analyzes claims, sources, and language patterns using advanced models.",
                },
                {
                  icon: Scan,
                  title: "Image OCR",
                  desc: "Upload screenshots — AI extracts and analyzes text automatically.",
                },
                {
                  icon: Globe,
                  title: "URL Fetch",
                  desc: "Enter any article URL to fetch and analyze its content instantly.",
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl glass-panel border border-white/30 p-5 shadow-glow-md hover-glow"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-white/20 flex items-center justify-center mb-3 border border-white/30">
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 rounded-2xl glass-panel border border-white/30 p-4 shadow-glow-md sm:p-5"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-cyber-blue/20 border border-white/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    <Flame className="h-3.5 w-3.5" />
                    Live Hot Topics
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-gradient-cyber">
                    Trending Claims Being Verified Right Now
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tracking:{" "}
                  <span className="font-semibold text-white">
                    {hotTopics[liveTopicIndex].title}
                  </span>
                </p>
              </div>

              <div className="topics-marquee overflow-hidden rounded-xl border border-white/30 bg-background/40 glass-panel">
                <div className="topics-track flex w-max gap-3 p-3">
                  {[...hotTopics, ...hotTopics].map((topic, index) => (
                    <article
                      key={`${topic.title}-${index}`}
                      className="w-[260px] shrink-0 rounded-xl border border-white/30 glass-panel p-2 shadow-glow-sm hover:shadow-glow-md transition-all hover-glow"
                    >
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="h-28 w-full rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div className="px-1 pb-1 pt-3">
                        <p className="text-xs font-semibold leading-snug text-gradient-cyber">
                          {topic.title}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            {topic.source}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-semibold border ${
                              topic.risk === "High"
                                ? "border-red-500/40 bg-red-500/10 text-red-400"
                                : "border-amber-500/40 bg-amber-500/10 text-amber-400"
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
                              className="h-6 w-6 rounded-full border border-white/40 object-cover shadow-glow-sm"
                              loading="lazy"
                            />
                            <img
                              src={topic.faces[1]}
                              alt="Ali Khamenei"
                              className="-ml-3 h-6 w-6 rounded-full border border-white/40 object-cover shadow-glow-sm"
                              loading="lazy"
                            />
                            <span className="text-[10px] font-medium text-muted-foreground">
                              Trump vs Khamenei
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setInputMode("text");
                            setInputText(topic.title);
                          }}
                          className="mt-3 w-full rounded-lg neon-button border border-white/40 px-2 py-1.5 text-[11px] font-semibold text-white transition-all hover:shadow-glow-sm hover-glow"
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
    </div>
  );
};

export default Index;

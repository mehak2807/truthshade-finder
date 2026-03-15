import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  analyzeTextWithGemini,
  analyzeImageWithGemini,
} from "@/services/geminiService";

interface AnalysisResult {
  detectedIssues: string[];
  credibilityScore: number;
  educationalExplanation: string;
  redFlags: string[];
  suggestions: string[];
  verdict: "credible" | "suspicious" | "misinformation";
}

interface PracticeModeCardProps {
  onClose: () => void;
}

type PracticeStep = "input" | "prediction" | "analysis" | "feedback";

export default function PracticeModeCard({ onClose }: PracticeModeCardProps) {
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<PracticeStep>("input");
  const [userPrediction, setUserPrediction] = useState<{
    verdict: string;
    score: number;
  } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        toast.success("Image selected. Click 'Next' to make your prediction.");
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const proceedToPrediction = () => {
    if (!textInput && !selectedFile) {
      toast.error("Please enter text or upload an image");
      return;
    }
    setCurrentStep("prediction");
  };

  const recordUserPrediction = (verdict: string, score: number) => {
    setUserPrediction({ verdict, score });
    setCurrentStep("analysis");
    analyzeContent();
  };

  const calculateAccuracy = (
    userVerdict: string,
    aiVerdict: string,
    userScore: number,
    aiScore: number,
  ): number => {
    let verdictMatch = 0;
    if (userVerdict === aiVerdict) {
      verdictMatch = 50; // 50% for correct verdict
    } else if (
      (userVerdict === "suspicious" &&
        (aiVerdict === "credible" || aiVerdict === "misinformation")) ||
      (userVerdict === "credible" && aiVerdict === "misinformation") ||
      (userVerdict === "misinformation" && aiVerdict === "credible")
    ) {
      verdictMatch = 0; // Completely wrong
    } else {
      verdictMatch = 25; // Partially correct
    }

    const scoreAccuracy = Math.max(0, 50 - Math.abs(userScore - aiScore));
    return Math.round(verdictMatch + scoreAccuracy);
  };

  const analyzeContent = async () => {
    setIsAnalyzing(true);

    try {
      let analysisResult: AnalysisResult;

      if (selectedFile) {
        // Analyze image using Gemini API
        analysisResult = await analyzeImageWithGemini(selectedFile);
      } else if (textInput) {
        // Analyze text using Gemini API
        analysisResult = await analyzeTextWithGemini(textInput);
      } else {
        toast.error("No content to analyze");
        setIsAnalyzing(false);
        return;
      }

      setResult(analysisResult);
      if (userPrediction) {
        const acc = calculateAccuracy(
          userPrediction.verdict,
          analysisResult.verdict,
          userPrediction.score,
          analysisResult.credibilityScore,
        );
        setAccuracy(acc);
        setCurrentStep("feedback");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 1: Input Collection
  if (currentStep === "input") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 rounded-lg glass-panel border border-mint border-opacity-20 p-4"
          >
            <label className="block mb-2 text-sm font-semibold text-mint">
              Paste Text or Claim
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste a claim, article text, or post to analyze..."
              className="w-full h-24 rounded-lg bg-background bg-opacity-40 border border-mint border-opacity-20 text-foreground placeholder-muted-foreground px-3 py-2 focus:outline-none focus:border-mint focus:border-opacity-50 focus:ring-1 focus:ring-mint focus:ring-opacity-30 resize-none"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => fileInputRef.current?.click()}
            className="col-span-2 rounded-lg glass-panel border-2 border-dashed border-mint border-opacity-40 p-6 cursor-pointer hover:border-opacity-60 transition-all hover:bg-mint hover:bg-opacity-5"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="h-8 w-8 text-mint mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-mint mb-1">
                {selectedFile ? selectedFile.name : "Upload Screenshot"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedFile
                  ? "Click to change file"
                  : "Click or drag to upload image"}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={proceedToPrediction}
          disabled={!textInput && !selectedFile}
          className="w-full neon-button rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="h-4 w-4" />
          Next: Make Your Prediction
        </motion.button>

        <div className="rounded-lg bg-mint bg-opacity-5 border border-mint border-opacity-20 p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 <strong>Practice Mode:</strong> Upload content, make your
            prediction, then see AI analysis & compare!
          </p>
        </div>
      </div>
    );
  }

  // Step 2: User Prediction
  if (currentStep === "prediction") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-lg font-bold text-gradient-cyber mb-4">
            📊 Make Your Prediction
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Based on the content you provided, what's your assessment?
          </p>
        </div>

        {/* Verdict Prediction */}
        <div>
          <p className="text-sm font-semibold text-mint mb-3">
            Step 1: What's your verdict?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "✓ Credible", value: "credible", color: "ok-green" },
              {
                label: "⚠ Suspicious",
                value: "suspicious",
                color: "warn-yellow",
              },
              {
                label: "✗ Misinformation",
                value: "misinformation",
                color: "danger-red",
              },
            ].map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setUserPrediction((prev) =>
                    prev ? { ...prev, verdict: option.value } : null,
                  )
                }
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  userPrediction?.verdict === option.value
                    ? `bg-${option.color} text-white border-2 border-${option.color}`
                    : `bg-${option.color} bg-opacity-10 border-2 border-${option.color} border-opacity-30 text-foreground hover:border-opacity-50`
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Score Prediction */}
        <div>
          <p className="text-sm font-semibold text-mint mb-3">
            Step 2: Estimate credibility score (0-100)
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={userPrediction?.score || 50}
              onChange={(e) =>
                setUserPrediction((prev) =>
                  prev
                    ? { ...prev, score: parseInt(e.target.value) }
                    : {
                        verdict: "suspicious",
                        score: parseInt(e.target.value),
                      },
                )
              }
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="text-center min-w-16">
              <div className="text-2xl font-bold text-gradient-cyber">
                {userPrediction?.score || 50}%
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentStep("input");
              setUserPrediction(null);
            }}
            className="flex-1 button-ghost rounded-lg px-4 py-2 font-semibold"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              userPrediction?.verdict
                ? recordUserPrediction(
                    userPrediction.verdict,
                    userPrediction.score,
                  )
                : toast.error("Please select a verdict")
            }
            className="flex-1 neon-button rounded-lg px-4 py-2 font-semibold"
          >
            Submit & Analyze
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Step 3: Loading Analysis
  if (currentStep === "analysis") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-4"
      >
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
        <p className="text-lg font-semibold text-gradient-cyber">
          Sending to AI Analysis Engine...
        </p>
        <p className="text-sm text-muted-foreground">
          Generating credibility score & explanation
        </p>
      </motion.div>
    );
  }

  // Step 4: Feedback & Comparison
  if (currentStep === "feedback" && result) {
    const verdictConfig = {
      credible: {
        color: "ok-green",
        icon: CheckCircle2,
        text: "Credible",
        bgClass: "bg-ok-green",
      },
      suspicious: {
        color: "warn-yellow",
        icon: AlertCircle,
        text: "Suspicious",
        bgClass: "bg-warn-yellow",
      },
      misinformation: {
        color: "danger-red",
        icon: AlertCircle,
        text: "Misinformation",
        bgClass: "bg-danger-red",
      },
    };

    const config = verdictConfig[result.verdict];
    const Icon = config.icon;

    const userVerdictConfig =
      verdictConfig[userPrediction?.verdict as keyof typeof verdictConfig] ||
      verdictConfig.suspicious;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {/* Accuracy Score */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Your Accuracy Score
              </p>
              <p className="text-3xl font-bold text-gradient-cyber">
                {accuracy}%
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round((accuracy || 0) / 20)
                      ? "fill-warn-yellow text-warn-yellow"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-3">
          {/* Your Prediction */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-slate-800/50 border border-slate-700 p-3"
          >
            <p className="text-xs text-muted-foreground mb-2">
              Your Prediction
            </p>
            <p className="font-semibold text-foreground mb-1">
              {userVerdictConfig.text}
            </p>
            <p className="text-lg font-bold text-gradient-cyber">
              {userPrediction?.score}%
            </p>
          </motion.div>

          {/* AI Result */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-lg ${config.bgClass} bg-opacity-10 border border-${config.color} border-opacity-40 p-3`}
          >
            <p className="text-xs text-muted-foreground mb-2">AI Analysis</p>
            <p className={`font-semibold text-${config.color} mb-1`}>
              {config.text}
            </p>
            <p className="text-lg font-bold text-gradient-cyber">
              {result.credibilityScore}%
            </p>
          </motion.div>
        </div>

        {/* AI Verdict Banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-lg ${config.bgClass} bg-opacity-10 border border-${config.color} border-opacity-40 p-4`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 text-${config.color}`} />
            <div>
              <p className={`font-semibold text-${config.color}`}>
                AI Verdict: {config.text}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Credibility Score:{" "}
                <span className="font-bold">{result.credibilityScore}%</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Educational Explanation */}
        <div className="rounded-lg bg-mint bg-opacity-5 border border-mint border-opacity-20 p-4">
          <h4 className="flex items-center gap-2 font-semibold text-mint mb-2">
            <Zap className="h-4 w-4" />
            Educational Analysis
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {result.educationalExplanation}
          </p>
        </div>

        {/* Red Flags */}
        <div>
          <h4 className="font-semibold text-danger-red mb-2">
            Detected Red Flags
          </h4>
          <div className="space-y-2">
            {result.redFlags.map((flag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-2 rounded-lg bg-danger-red bg-opacity-5 p-2 text-sm"
              >
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-danger-red flex-shrink-0" />
                <span className="text-foreground">{flag}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h4 className="font-semibold text-ok-green mb-2">How to Verify</h4>
          <div className="space-y-2">
            {result.suggestions.map((suggestion, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-2 rounded-lg bg-ok-green bg-opacity-5 p-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-ok-green mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{suggestion}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setResult(null);
              setTextInput("");
              setSelectedFile(null);
              setUserPrediction(null);
              setAccuracy(null);
              setCurrentStep("input");
            }}
            className="flex-1 button-ghost rounded-lg px-4 py-2 font-semibold"
          >
            Try Another
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 neon-button rounded-lg px-4 py-2 font-semibold"
          >
            Return to Lessons
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return null;
}

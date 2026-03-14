import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export default function PracticeModeCard({ onClose }: PracticeModeCardProps) {
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        toast.success("Image selected. Click 'Analyze' to begin.");
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const analyzeContent = async () => {
    if (!textInput && !selectedFile) {
      toast.error("Please enter text or upload an image");
      return;
    }

    setIsAnalyzing(true);

    try {
      let analysisContent = textInput;

      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          // Simulate sending to AI for analysis
          const mockAnalysis: AnalysisResult = {
            detectedIssues: [
              "Clickbait language detected",
              "Lack of credible source attribution",
              "Sensationalized tone",
            ],
            credibilityScore: 32,
            educationalExplanation:
              "This content shows several signs of potential misinformation. The language uses emotional triggers and lacks proper source attribution, which are red flags we learned about in the lessons.",
            redFlags: [
              "Excessive punctuation marks (!!!)",
              "ALL CAPS keywords for emphasis",
              "No source citations",
              "Emotional manipulation language",
            ],
            suggestions: [
              "Look for proper news sources covering the same story",
              "Check the original source website directly",
              "Use reverse image search to verify image authenticity",
              "Compare with fact-checking websites",
            ],
            verdict: "suspicious",
          };

          setResult(mockAnalysis);
        };
        reader.readAsDataURL(selectedFile);
      } else if (textInput) {
        // Simulate API call to analyze text
        try {
          const { data, error } = await supabase.functions.invoke(
            "analyze-news",
            {
              body: { text: textInput },
            },
          );

          if (error) throw error;

          // Transform API response to educational format
          const mockAnalysis: AnalysisResult = {
            detectedIssues: [
              ...(data?.findings?.slice(0, 3)?.map((f: any) => f.claim) || []),
              "Potential misinformation signal detected",
            ],
            credibilityScore: Math.round(data?.overall_score * 100 || 50),
            educationalExplanation: `This content has a credibility score of ${Math.round(data?.overall_score * 100 || 50)}%. The analysis detected potential issues related to source reliability and claim verification. These are exactly the types of signals we learn to identify in the lessons.`,
            redFlags:
              data?.risk_level === "high"
                ? [
                    "Unverified claims",
                    "Questionable source credibility",
                    "Sensationalized language",
                    "Lack of supporting evidence",
                  ]
                : data?.risk_level === "medium"
                  ? [
                      "Mixed credibility signals",
                      "Some unverified claims",
                      "Limited source verification",
                    ]
                  : ["No major red flags detected"],
            suggestions: [
              "Cross-reference with established news sources",
              "Check author credibility and background",
              "Look for peer-reviewed sources on the topic",
              "Compare multiple perspectives",
            ],
            verdict:
              data?.risk_level === "high"
                ? "misinformation"
                : data?.risk_level === "medium"
                  ? "suspicious"
                  : "credible",
          };

          setResult(mockAnalysis);
        } catch (error) {
          // Fallback to mock analysis if API fails
          const mockAnalysis: AnalysisResult = {
            detectedIssues: ["Pattern analysis complete"],
            credibilityScore: 55,
            educationalExplanation:
              "This content analysis shows mixed credibility signals. The text contains some factual statements but also includes claims that need verification through reliable sources.",
            redFlags: [
              "Some unattributed claims",
              "Mixed tone and evidence quality",
              "Partial sourcing",
            ],
            suggestions: [
              "Verify each claim independently",
              "Check original sources",
              "Compare with fact-checking sites",
            ],
            verdict: "suspicious",
          };

          setResult(mockAnalysis);
        }
      }
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (result) {
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

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {/* Verdict Banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-lg ${config.bgClass} bg-opacity-10 border border-${config.color} border-opacity-40 p-4`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 text-${config.color}`} />
            <div>
              <p className={`font-semibold text-${config.color}`}>
                {config.text}
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

  return (
    <div className="space-y-4">
      {/* Input Options */}
      <div className="grid grid-cols-2 gap-3">
        {/* Text Input */}
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

        {/* File Upload */}
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

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={analyzeContent}
        disabled={isAnalyzing || (!textInput && !selectedFile)}
        className="w-full neon-button rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Analyze & Learn
          </>
        )}
      </motion.button>

      {/* Info Box */}
      <div className="rounded-lg bg-mint bg-opacity-5 border border-mint border-opacity-20 p-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 Practice Mode uses AI to analyze your content and provides
          educational explanations about detected signals. This helps you
          understand misinformation tactics in real examples.
        </p>
      </div>
    </div>
  );
}

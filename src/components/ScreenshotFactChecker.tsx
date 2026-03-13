import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Loader2, ScanText, Share2, UploadCloud } from "lucide-react";
import Tesseract from "tesseract.js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  escapeRegex,
  findSuspiciousPhrases,
  normalizeExtractedText,
} from "@/lib/screenshotFactCheck";

interface VerificationSource {
  title: string;
  url: string;
  snippet: string;
}

interface ScreenshotFactCheckResult {
  extracted_text: string;
  normalized_text: string;
  claims: string[];
  detected_claim: string;
  credibility_score: number;
  verdict: "True" | "Likely False" | "Misleading" | "Unverified";
  sources: VerificationSource[];
  suspicious_phrases: string[];
  explanation: string;
}

type AnalyzeNewsFallback = {
  overall_score?: number;
  findings?: Array<{ title?: string; description?: string }>;
  explanation?: string;
};

const buildFallbackSources = (claim: string): VerificationSource[] => {
  const encoded = encodeURIComponent(claim || "latest misinformation claim");
  return [
    {
      title: "Google Fact Check Explorer",
      url: `https://toolbox.google.com/factcheck/explorer/search/${encoded}`,
      snippet: "Search verified fact-check verdicts",
    },
    {
      title: "Reuters Search",
      url: `https://www.reuters.com/site-search/?query=${encoded}`,
      snippet: "Reuters reporting search",
    },
    {
      title: "AP News Search",
      url: `https://apnews.com/search?q=${encoded}`,
      snippet: "Associated Press reporting",
    },
  ];
};

const fallbackVerdictFromScore = (
  score: number
): ScreenshotFactCheckResult["verdict"] => {
  if (score >= 70) return "True";
  if (score <= 35) return "Likely False";
  if (score <= 55) return "Misleading";
  return "Unverified";
};

const verdictStyles = {
  True: "bg-trust-verified/10 text-trust-verified border border-trust-verified/30",
  "Likely False": "bg-trust-misinformation/10 text-trust-misinformation border border-trust-misinformation/30",
  Misleading: "bg-trust-questionable/10 text-trust-questionable border border-trust-questionable/30",
  Unverified: "bg-muted text-muted-foreground border border-border",
};

const ScreenshotFactChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<ScreenshotFactCheckResult | null>(null);

  const detectedSuspicious = useMemo(
    () => (result ? result.suspicious_phrases : findSuspiciousPhrases(ocrText)),
    [ocrText, result]
  );

  const onFilePicked = async (imageFile: File) => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(imageFile.type)) {
      toast.error("Please upload PNG or JPG images only.");
      return;
    }

    if (imageFile.size > 12 * 1024 * 1024) {
      toast.error("Image must be under 12MB.");
      return;
    }

    setFile(imageFile);
    setResult(null);

    const localPreview = URL.createObjectURL(imageFile);
    setPreview(localPreview);

    setIsExtracting(true);
    setOcrProgress(0);

    try {
      const ocr = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text" && typeof m.progress === "number") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const cleaned = normalizeExtractedText(ocr.data.text || "");
      if (!cleaned) {
        toast.error("No readable text found in screenshot.");
        return;
      }

      setOcrText(cleaned);
      toast.success("Screenshot text extracted.");
    } catch (error) {
      console.error("OCR failure", error);
      toast.error("Failed to run OCR on this screenshot.");
    } finally {
      setIsExtracting(false);
    }
  };

  const runFactCheck = async () => {
    if (!ocrText.trim()) {
      toast.error("Please upload a screenshot with readable text first.");
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("screenshot-fact-check", {
        body: { text: ocrText },
      });

      if (error) {
        const message = error.message || "Fact-check failed";
        if (message.includes("Failed to send a request to the Edge Function")) {
          const fallback = await supabase.functions.invoke("analyze-news", {
            body: { text: ocrText },
          });

          if (fallback.error) {
            throw new Error(
              "Screenshot service is unavailable and fallback analysis also failed. Please try again."
            );
          }

          const fallbackData = (fallback.data || {}) as AnalyzeNewsFallback;
          const score = Math.max(0, Math.min(100, Math.round(fallbackData.overall_score ?? 55)));
          const detectedClaim = ocrText.split(/[.!?\n]/).find((line) => line.trim().length > 15)?.trim() ||
            "No clear claim detected from screenshot.";

          setResult({
            extracted_text: ocrText,
            normalized_text: ocrText,
            claims: [detectedClaim],
            detected_claim: detectedClaim,
            credibility_score: score,
            verdict: fallbackVerdictFromScore(score),
            sources: buildFallbackSources(detectedClaim),
            suspicious_phrases: findSuspiciousPhrases(ocrText),
            explanation:
              fallbackData.explanation ||
              "Primary screenshot fact-check function was unavailable, so a fallback analysis pipeline was used.",
          });

          toast.warning(
            "Screenshot service is temporarily unavailable. Showing fallback verification result."
          );
          return;
        }

        throw new Error(message);
      }
      if (data?.error) throw new Error(data.error);

      setResult(data as ScreenshotFactCheckResult);
      toast.success("Fact-check completed.");
    } catch (error: any) {
      console.error("Screenshot fact-check failed", error);
      toast.error(error.message || "Could not verify screenshot claims.");
    } finally {
      setIsVerifying(false);
    }
  };

  const shareResult = async () => {
    if (!result) return;

    const summary = `Screenshot Fact-Check\nClaim: ${result.detected_claim}\nVerdict: ${result.verdict}\nCredibility: ${result.credibility_score}/100`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "TruthShade Screenshot Fact-Check",
          text: summary,
        });
      } else {
        await navigator.clipboard.writeText(summary);
        toast.success("Result copied to clipboard.");
      }
    } catch (error) {
      console.error("share failed", error);
      toast.error("Could not share result.");
    }
  };

  const highlightedText = useMemo(() => {
    const source = result?.normalized_text || ocrText;
    if (!source || detectedSuspicious.length === 0) {
      return [<span key="plain">{source}</span>];
    }

    const regex = new RegExp(`(${detectedSuspicious.map((p) => escapeRegex(p)).join("|")})`, "gi");
    return source.split(regex).map((part, index) => {
      const suspicious = detectedSuspicious.some((phrase) => phrase.toLowerCase() === part.toLowerCase());
      if (suspicious) {
        return (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-trust-misinformation/20 px-1 text-trust-misinformation"
          >
            {part}
          </mark>
        );
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });
  }, [detectedSuspicious, ocrText, result]);

  return (
    <motion.section
      className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Screenshot Fact-Checker</h2>
          <p className="text-sm text-muted-foreground">
            Upload WhatsApp forwards, tweets, or social posts to detect misinformation quickly.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <label
            htmlFor="screenshot-file"
            className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary/45"
          >
            <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Upload screenshot (PNG/JPG)</p>
            <p className="mt-1 text-xs text-muted-foreground">Max 12MB. OCR runs in your browser.</p>
            <input
              id="screenshot-file"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  void onFilePicked(selected);
                }
              }}
            />
          </label>

          {preview && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/20">
              <img src={preview} alt="Screenshot preview" className="h-56 w-full object-contain" />
            </div>
          )}

          {(isExtracting || ocrProgress > 0) && (
            <div className="mt-3 rounded-lg border border-border bg-background p-3">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>OCR progress</span>
                <span>{ocrProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ScanText className="h-4 w-4 text-primary" /> Extracted Text
          </div>
          <div className="max-h-[210px] overflow-auto rounded-lg border border-border bg-card p-3 text-sm leading-relaxed text-foreground/90">
            {highlightedText}
          </div>

          {detectedSuspicious.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {detectedSuspicious.map((phrase) => (
                <span
                  key={phrase}
                  className="rounded-full bg-trust-misinformation/10 px-2 py-1 text-[11px] font-medium text-trust-misinformation"
                >
                  {phrase}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={runFactCheck}
            disabled={isExtracting || isVerifying || !ocrText.trim()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying claims...
              </>
            ) : (
              <>Run Screenshot Fact-Check</>
            )}
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          className="mt-6 rounded-xl border border-border bg-background p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Detected Claim</p>
              <h3 className="mt-1 text-base font-semibold text-foreground">{result.detected_claim}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verdictStyles[result.verdict]}`}>
                {result.verdict}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
                Score {result.credibility_score}/100
              </span>
            </div>
          </div>

          {result.claims.length > 1 && (
            <div className="mt-4 rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Additional Claims</p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
                {result.claims.slice(1).map((claim) => (
                  <li key={claim}>• {claim}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why this verdict?</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{result.explanation}</p>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sources used for verification</p>
            <div className="mt-2 space-y-2">
              {result.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-muted"
                >
                  <p className="font-semibold text-foreground">{source.title}</p>
                  <p className="mt-0.5 text-muted-foreground">{source.snippet}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={shareResult}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Share2 className="h-3.5 w-3.5" /> Share Verified Result
            </button>
            <button
              onClick={async () => {
                if (!result) return;
                await navigator.clipboard.writeText(result.normalized_text);
                toast.success("Extracted text copied.");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Copy className="h-3.5 w-3.5" /> Copy Extracted Text
            </button>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default ScreenshotFactChecker;

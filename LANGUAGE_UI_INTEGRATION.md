/**
 * Integration Example for Language Selection UI
 * Shows how to use LanguageButton and LanguageBar in your Index.tsx
 */

// At the top of Index.tsx, add these imports:
import { LanguageButton } from "@/components/LanguageButton";
import { LanguageBar } from "@/components/LanguageBar";
import { LanguageCode } from "@/config/languages";

// In your Index component, add state for language selection:
const Index = () => {
  // ... existing state
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [inputText, setInputText] = useState("");
  // ... rest of state

  // ... existing functions
  const handleAnalyze = async (overrideText?: string) => {
    // ... existing code
    // When calling the API, include the selected language:
    const [analysisRes, forwardRes] = await Promise.allSettled([
      supabase.functions.invoke("analyze-news", {
        body: { text: trimmed, language: selectedLanguage },
      }),
      supabase.functions.invoke("regional-language-analysis", {
        body: { 
          content: trimmed, 
          sourceLanguage: selectedLanguage,
          targetLanguage: selectedLanguage,
          analysisType: "text",
        },
      }),
    ]);
    // ... rest of code
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Logo */}
      <motion.div
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TruthShade" className="h-10" />
            <h1 className="text-2xl font-bold text-slate-900">TruthShade</h1>
          </div>

          {/* OPTION 1: Language Button in Header */}
          <LanguageButton 
            currentLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            variant="default"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* OPTION 2: Language Bar (Popular Languages + More) */}
        <LanguageBar
          currentLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          showQuickSelect={true}
          maxQuickSelectItems={5}
        />

        <div className="mt-8 space-y-6">
          {/* Input Mode Selection */}
          <div className="flex gap-2 flex-wrap justify-center">
            {modeConfig.map((mode) => (
              <motion.button
                key={mode.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInputMode(mode.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${inputMode === mode.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400"
                  }
                `}
              >
                <mode.icon className="w-5 h-5" />
                {mode.label}
              </motion.button>
            ))}
          </div>

          {/* Text Input */}
          {inputMode === "text" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Paste text in any language including: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, or English...`}
                className="w-full p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none resize-none h-32"
              />
            </motion.div>
          )}

          {/* Other Modes */}
          {inputMode === "screenshot" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ScreenshotFactChecker onAnalysis={handleAnalyze} />
            </motion.div>
          )}

          {inputMode === "url" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UrlInput onAnalysis={handleAnalyze} />
            </motion.div>
          )}

          {inputMode === "voice" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VoiceInput onTranscription={handleAnalyze} onLanguageDetected={setSelectedLanguage} />
            </motion.div>
          )}

          {/* Analyze Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !inputText.trim()}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold text-white transition-all
                ${isLoading || !inputText.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Content"
              )}
            </button>
          </motion.div>

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Credibility Gauge */}
              <CredibilityGauge score={result.overall_score} />

              {/* Risk Level */}
              <div className={`p-4 rounded-lg ${riskColors[result.risk_level]}`}>
                <h3 className="font-semibold">Risk Level: {riskLabels[result.risk_level]}</h3>
              </div>

              {/* Heatmap */}
              {result.segments.length > 0 && (
                <HeatmapDemo segments={result.segments} originalText={inputText} />
              )}

              {/* Analysis Panel */}
              {result.findings.length > 0 && (
                <AnalysisPanel findings={result.findings} />
              )}

              {/* Explainable AI */}
              <ExplainableAI explanation={result.explanation} />

              {/* Report to Cyber Police */}
              {result.overall_score < 40 && (
                <ReportToCyberPolice />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

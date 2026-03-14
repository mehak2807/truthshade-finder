/**
 * Regional Language Integration Example
 * Shows how to integrate multi-language support into your main Index.tsx
 */

import React, { useState, useCallback } from 'react';
import { LanguageCode } from '@/config/languages';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RegionalReportDisplay } from '@/components/RegionalReportDisplay';
import { useRegionalAnalysis } from '@/hooks/useRegionalAnalysis';
import { languageDetector } from '@/services/languageDetector';
import { regionalMisinformationDetector } from '@/services/regionalMisinformationDetector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * Example usage in your main page component
 */
export default function RegionalLanguageExample() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(false);
  const [detectedLanguageInfo, setDetectedLanguageInfo] = useState<{
    language: LanguageCode;
    confidence: number;
  } | null>(null);

  const { analyzeContent, report, isLoading, error, detectedLanguage } =
    useRegionalAnalysis({
      targetLanguage: selectedLanguage,
    });

  /**
   * Handle language auto-detection
   */
  const handleAutoDetect = useCallback(() => {
    if (!inputText.trim()) return;

    const detection = languageDetector.detectLanguage(inputText);
    setDetectedLanguageInfo({
      language: detection.detectedLanguage,
      confidence: detection.confidence,
    });

    if (detection.isSupported) {
      setAutoDetectLanguage(true);
      setSelectedLanguage(detection.detectedLanguage);
    }
  }, [inputText]);

  /**
   * Handle analysis
   */
  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) {
      alert('Please enter text to analyze');
      return;
    }

    // Detect misinformation patterns in the regional language
    const misinfoDetection = regionalMisinformationDetector.detectMisinfo(
      selectedLanguage,
      inputText,
    );

    console.log('Regional Misinformation Detection:', misinfoDetection);

    // Proceed with full analysis
    await analyzeContent(inputText);
  }, [inputText, selectedLanguage, analyzeContent]);

  /**
   * Handle report download (example)
   */
  const handleDownloadReport = useCallback(() => {
    if (!report) return;

    const reportText = `
${report.header}
Generated: ${report.metadata.generatedAt}
Language: ${report.metadata.language.toUpperCase()}

${report.content.summary}

Credibility Score: ${report.content.credibility.score}/100
Risk Level: ${report.content.riskAssessment.level}

${report.content.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

Disclaimer: ${report.content.disclaimer}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(reportText)}`);
    element.setAttribute('download', `report_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [report]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Regional Misinformation Analyzer</h1>
        <p className="text-gray-600">
          Analyze misinformation in 10 Indian regional languages with localized insights
        </p>
      </div>

      {/* Language Selection */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-3">
        <h2 className="font-semibold">Language Settings</h2>
        <div className="space-y-2">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            disabled={isLoading}
          />

          <Button
            variant="outline"
            onClick={handleAutoDetect}
            disabled={isLoading || !inputText.trim()}
          >
            Auto-Detect Language
          </Button>

          {detectedLanguageInfo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Detected: {detectedLanguageInfo.language.toUpperCase()} (
                {Math.round(detectedLanguageInfo.confidence * 100)}% confidence)
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <label className="block font-semibold">Content to Analyze</label>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste text in any Indian regional language or English..."
          disabled={isLoading}
          className="min-h-32"
        />
        <div className="flex gap-2">
          <Button onClick={handleAnalyze} disabled={isLoading || !inputText.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Content'
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setInputText('')}
            disabled={isLoading || !inputText.trim()}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-gray-600">
              Analyzing content in {selectedLanguage.toUpperCase()}...
            </p>
            <p className="text-sm text-gray-500">
              Detecting language, translating if needed, and running misinformation checks
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {report && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleDownloadReport} variant="outline">
              Download Report
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
            >
              Print Report
            </Button>
          </div>

          <RegionalReportDisplay
            report={report}
            onSourceClick={(source) => {
              // Example: Open source in new window
              console.log('Clicked source:', source);
              // window.open(source, '_blank');
            }}
          />
        </div>
      )}

      {/* Information Panel */}
      {!report && (
        <div className="bg-gray-50 p-6 rounded-lg text-center space-y-2">
          <p className="text-gray-600">Enter text to analyze for misinformation</p>
          <p className="text-sm text-gray-500">
            Supports: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam,
            Punjabi, and English
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Example of using individual services separately
 */
export function ServiceUsageExamples() {
  return (
    <div className="space-y-6 p-6">
      {/* Example 1: Language Detection */}
      <div>
        <h3 className="font-semibold mb-2">Example 1: Language Detection</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm mb-2">
          {`const detection = languageDetector.detectLanguage('नमस्ते दुनिया');
console.log(detection.detectedLanguage); // 'hi'
console.log(detection.confidence); // 0.95`}
        </code>
      </div>

      {/* Example 2: Regional Misinformation Detection */}
      <div>
        <h3 className="font-semibold mb-2">Example 2: Misinformation Detection</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm mb-2">
          {`const result = regionalMisinformationDetector.detectMisinfo(
  'hi',
  'सरकार ने नई योजना शुरू की है जिसमें सभी को पैसा मिलेगा'
);
console.log(result.detectedCategories); // Financial fraud detected
console.log(result.estimatedRiskLevel); // 'high'`}
        </code>
      </div>

      {/* Example 3: Regional Report Generation */}
      <div>
        <h3 className="font-semibold mb-2">Example 3: Report Generation</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm mb-2">
          {`const report = regionalReportGenerator.generateReport('hi', {
  text: '...',
  overallScore: 35,
  sourceScore: 40,
  claimsScore: 30,
  riskLevel: 'high',
  findings: [...],
  explanation: '...',
  segments: [...],
  sources: [...]
});
// Returns fully localized report in Hindi`}
        </code>
      </div>

      {/* Example 4: API Usage */}
      <div>
        <h3 className="font-semibold mb-2">Example 4: API Usage</h3>
        <code className="block bg-gray-100 p-3 rounded text-sm mb-2">
          {`const response = await fetch(
  '/functions/v1/regional-language-analysis',
  {
    method: 'POST',
    body: JSON.stringify({
      content: 'आपकी विश्लेषण करने के लिए सामग्री',
      sourceLanguage: 'hi', // Auto-detected if omitted
      targetLanguage: 'hi',
      analysisType: 'text'
    })
  }
);`}
        </code>
      </div>
    </div>
  );
}

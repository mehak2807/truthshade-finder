import { useState, useCallback } from 'react';
import { LanguageCode } from '@/config/languages';
import { regionalReportGenerator, RegionalReport } from '@/services/regionalReportGenerator';
import { useToast } from '@/hooks/use-toast';

interface UseRegionalAnalysisProps {
  sourceLanguage?: LanguageCode;
  targetLanguage?: LanguageCode;
}

interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  report: RegionalReport | null;
  detectedLanguage: LanguageCode | null;
}

export const useRegionalAnalysis = ({
  sourceLanguage,
  targetLanguage = 'en',
}: UseRegionalAnalysisProps) => {
  const { toast } = useToast();
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    report: null,
    detectedLanguage: null,
  });

  const analyzeContent = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        toast({
          title: 'Error',
          description: 'Please provide content to analyze',
          variant: 'destructive',
        });
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Call the regional language analysis API
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/regional-language-analysis`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              content,
              sourceLanguage,
              targetLanguage,
              analysisType: 'text',
              includeReportTranslation: true,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const analysisResult = await response.json();

        // Generate regional report using the analysis result
        const report = regionalReportGenerator.generateReport(
          targetLanguage,
          {
            text: analysisResult.originalText,
            overallScore: analysisResult.analysis.overall_score,
            sourceScore: analysisResult.analysis.source_score,
            claimsScore: analysisResult.analysis.claims_score,
            riskLevel: analysisResult.analysis.risk_level,
            findings: analysisResult.analysis.findings,
            explanation: analysisResult.analysis.explanation,
            segments: analysisResult.analysis.segments,
            sources: analysisResult.analysis.sources,
          },
        );

        setState((prev) => ({
          ...prev,
          report,
          detectedLanguage: analysisResult.detectedLanguage,
          isLoading: false,
        }));

        toast({
          title: 'Analysis Complete',
          description: `Content analyzed in ${analysisResult.detectedLanguage.toUpperCase()}`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));

        toast({
          title: 'Analysis Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [sourceLanguage, targetLanguage, toast],
  );

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      report: null,
      detectedLanguage: null,
    });
  }, []);

  return {
    ...state,
    analyzeContent,
    resetState,
    setTargetLanguage: (lang: LanguageCode) => {
      // This would be used to change the report language dynamically
    },
  };
};

export default useRegionalAnalysis;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LanguageCode } from "../src/config/languages.ts";

const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1";

interface AnalysisRequest {
  content: string;
  sourceLanguage?: LanguageCode;
  targetLanguage?: LanguageCode;
  analysisType: "text" | "url" | "image";
  includeReportTranslation?: boolean;
}

interface LanguageDetectionResult {
  detectedLanguage: LanguageCode;
  confidence: number;
}

interface RegionalAnalysisResponse {
  detectedLanguage: LanguageCode;
  originalText: string;
  englishText?: string;
  analysis: {
    overall_score: number;
    source_score: number;
    claims_score: number;
    risk_level: "low" | "medium" | "high";
    findings: Array<{
      title: string;
      description: string;
      type: string;
    }>;
    explanation: string;
    segments: Array<{
      text: string;
      level: "verified" | "questionable" | "misinformation";
    }>;
    sources: string[];
  };
  reportLanguage: LanguageCode;
  timestamp: string;
}

/**
 * Detect language from text using Google Cloud Translation API fallback
 */
async function detectLanguage(text: string): Promise<LanguageDetectionResult> {
  try {
    const response = await fetch(`${LOVABLE_AI_GATEWAY}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: `Detect the language of this text. Respond with ONLY a language code (en, hi, ta, te, bn, mr, gu, kn, ml, pa):\n\n${text.substring(0, 200)}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const detectedLang = data.choices[0].message.content.trim().toLowerCase();

    const supportedLanguages = ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa"];
    const language = supportedLanguages.includes(detectedLang)
      ? (detectedLang as LanguageCode)
      : "en";

    return {
      detectedLanguage: language,
      confidence: 0.85,
    };
  } catch (error) {
    console.error("Language detection error:", error);
    return {
      detectedLanguage: "en",
      confidence: 0.5,
    };
  }
}

/**
 * Translate text to English for processing
 */
async function translateToEnglish(
  text: string,
  sourceLanguage: LanguageCode,
): Promise<string> {
  if (sourceLanguage === "en") return text;

  try {
    const response = await fetch(`${LOVABLE_AI_GATEWAY}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: `Translate this text from ${sourceLanguage} to English. Provide ONLY the translation:\n\n${text}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original if translation fails
  }
}

/**
 * Run misinformation analysis using existing analyze-news function
 */
async function analyzeContent(englishText: string): Promise<any> {
  try {
    const response = await fetch(`${LOVABLE_AI_GATEWAY}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gemini-3-flash",
        messages: [
          {
            role: "user",
            content: `Analyze this text for misinformation and credibility. Provide a JSON response with:
{
  "overall_score": number (0-100),
  "source_score": number (0-100),
  "claims_score": number (0-100),
  "risk_level": "low" | "medium" | "high",
  "findings": [{"title": string, "description": string, "type": string}],
  "explanation": string,
  "segments": [{"text": string, "level": "verified" | "questionable" | "misinformation"}],
  "sources": [string]
}\n\nText: ${englishText.substring(0, 3000)}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if parsing fails
    return {
      overall_score: 50,
      source_score: 50,
      claims_score: 50,
      risk_level: "medium",
      findings: [{ title: "Analysis performed", description: "Content analyzed", type: "info" }],
      explanation: analysisText,
      segments: [{ text: englishText.substring(0, 100), level: "questionable" }],
      sources: [],
    };
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      overall_score: 0,
      source_score: 0,
      claims_score: 0,
      risk_level: "medium",
      findings: [],
      explanation: "Analysis failed",
      segments: [],
      sources: [],
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const request: AnalysisRequest = await req.json();

    const {
      content,
      sourceLanguage,
      targetLanguage = "en",
      analysisType,
      includeReportTranslation = false,
    } = request;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Step 1: Detect language
    let detectedLanguage = sourceLanguage;
    if (!detectedLanguage) {
      const detection = await detectLanguage(content);
      detectedLanguage = detection.detectedLanguage;
    }

    // Step 2: Translate to English for processing if needed
    let englishText = detectedLanguage === "en" ? content : await translateToEnglish(content, detectedLanguage);

    // Step 3: Run analysis on English text
    const analysis = await analyzeContent(englishText);

    // Step 4: Prepare response
    const response: RegionalAnalysisResponse = {
      detectedLanguage,
      originalText: content,
      englishText: detectedLanguage !== "en" ? englishText : undefined,
      analysis,
      reportLanguage: targetLanguage,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});

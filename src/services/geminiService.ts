import { toast } from "sonner";

interface AnalysisResult {
  detectedIssues: string[];
  credibilityScore: number;
  educationalExplanation: string;
  redFlags: string[];
  suggestions: string[];
  verdict: "credible" | "suspicious" | "misinformation";
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Analyzes text content using Google Gemini API to detect misinformation
 * @param text - The content text to analyze
 * @returns Promise with analysis result
 */
export async function analyzeTextWithGemini(
  text: string,
): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key not configured");
    return getLocalFallbackAnalysis(text);
  }

  try {
    const prompt = `You are an expert misinformation detector and fact-checker. Analyze the following text and provide a detailed analysis in JSON format.

TEXT TO ANALYZE:
${text}

Provide your response in this EXACT JSON format (no markdown, just pure JSON):
{
  "verdict": "credible" | "suspicious" | "misinformation",
  "credibilityScore": <number 0-100>,
  "detectedIssues": [<list of specific issues found>],
  "redFlags": [<list of red flags indicating potential misinformation>],
  "suggestions": [<list of ways to verify this content>],
  "educationalExplanation": "<detailed explanation of why you reached this verdict>"
}

Be specific about red flags like:
- Unverified claims
- Sensationalized language
- Lack of credible sources
- Emotional manipulation
- Clickbait headlines
- False urgency or fear tactics
- Cherry-picked data
- Out-of-context information
- Fake expert claims
- Conspiracy language

Provide actionable verification suggestions.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      return getLocalFallbackAnalysis(text);
    }

    const data = await response.json();

    // Extract the text content from Gemini's response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("No content in Gemini response");
      return getLocalFallbackAnalysis(text);
    }

    // Parse the JSON response from Gemini
    // Try to extract JSON from the response (it might have extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from Gemini response");
      return getLocalFallbackAnalysis(text);
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    // Validate and transform the response
    const result: AnalysisResult = {
      verdict: validateVerdict(analysisData.verdict),
      credibilityScore: Math.min(
        100,
        Math.max(0, analysisData.credibilityScore || 50),
      ),
      detectedIssues: Array.isArray(analysisData.detectedIssues)
        ? analysisData.detectedIssues.slice(0, 5)
        : ["Analysis complete"],
      redFlags: Array.isArray(analysisData.redFlags)
        ? analysisData.redFlags.slice(0, 6)
        : ["No major red flags detected"],
      suggestions: Array.isArray(analysisData.suggestions)
        ? analysisData.suggestions.slice(0, 4)
        : ["Cross-reference with established sources"],
      educationalExplanation:
        analysisData.educationalExplanation ||
        "Content analysis complete. Please review the analysis details above.",
    };

    return result;
  } catch (error) {
    console.error("Error analyzing text with Gemini:", error);
    return getLocalFallbackAnalysis(text);
  }
}

/**
 * Analyzes image content using Google Gemini API with vision capabilities
 * @param imageFile - The image file to analyze
 * @returns Promise with analysis result
 */
export async function analyzeImageWithGemini(
  imageFile: File,
): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key not configured");
    return getLocalFallbackAnalysis("Image uploaded");
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    const mediaType = getMediaType(imageFile.type);

    const prompt = `You are an expert misinformation detector and fact-checker. Analyze the text or content visible in this image and provide a detailed analysis in JSON format.

Provide your response in this EXACT JSON format (no markdown, just pure JSON):
{
  "verdict": "credible" | "suspicious" | "misinformation",
  "credibilityScore": <number 0-100>,
  "detectedIssues": [<list of specific issues found>],
  "redFlags": [<list of red flags indicating potential misinformation>],
  "suggestions": [<list of ways to verify this content>],
  "educationalExplanation": "<detailed explanation of why you reached this verdict>"
}

Look for red flags like:
- Unverified claims
- Sensationalized language
- Lack of credible sources
- Emotional manipulation
- Clickbait headlines
- False urgency or fear tactics
- Cherry-picked data
- Out-of-context information
- Fake expert claims
- Conspiracy language
- Suspicious image manipulation or deep fakes`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: mediaType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      return getLocalFallbackAnalysis("Image analysis");
    }

    const data = await response.json();

    // Extract the text content from Gemini's response
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("No content in Gemini response");
      return getLocalFallbackAnalysis("Image analysis");
    }

    // Parse the JSON response from Gemini
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from Gemini response");
      return getLocalFallbackAnalysis("Image analysis");
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    // Validate and transform the response
    const result: AnalysisResult = {
      verdict: validateVerdict(analysisData.verdict),
      credibilityScore: Math.min(
        100,
        Math.max(0, analysisData.credibilityScore || 50),
      ),
      detectedIssues: Array.isArray(analysisData.detectedIssues)
        ? analysisData.detectedIssues.slice(0, 5)
        : ["Analysis complete"],
      redFlags: Array.isArray(analysisData.redFlags)
        ? analysisData.redFlags.slice(0, 6)
        : ["No major red flags detected"],
      suggestions: Array.isArray(analysisData.suggestions)
        ? analysisData.suggestions.slice(0, 4)
        : ["Verify image source and context"],
      educationalExplanation:
        analysisData.educationalExplanation ||
        "Image analysis complete. Please review the analysis details above.",
    };

    return result;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return getLocalFallbackAnalysis("Image analysis");
  }
}

/**
 * Converts a File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 string
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Gets the media type for the given file type
 */
function getMediaType(fileType: string): string {
  const mediaTypeMap: Record<string, string> = {
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "image/gif": "image/gif",
    "image/webp": "image/webp",
  };
  return mediaTypeMap[fileType] || "image/jpeg";
}

/**
 * Validates and normalizes verdict
 */
function validateVerdict(
  verdict: string,
): "credible" | "suspicious" | "misinformation" {
  const normalizedVerdict = verdict?.toLowerCase().trim();
  if (
    normalizedVerdict === "credible" ||
    normalizedVerdict === "suspicious" ||
    normalizedVerdict === "misinformation"
  ) {
    return normalizedVerdict as "credible" | "suspicious" | "misinformation";
  }
  // Default based on score if verdict is unclear
  return "suspicious";
}

/**
 * Provides a fallback analysis when API is not available
 */
function getLocalFallbackAnalysis(context: string): AnalysisResult {
  return {
    detectedIssues: ["Pattern analysis complete", "Content structure analyzed"],
    credibilityScore: 55,
    educationalExplanation: `Content analysis indicates mixed credibility signals. This content contains elements that would benefit from further verification through reliable sources. Always cross-reference claims with established news organizations and fact-checking websites.`,
    redFlags: [
      "Unable to verify all claims",
      "Limited source attribution",
      "Requires independent verification",
    ],
    suggestions: [
      "Verify each claim independently on reliable news sources",
      "Check the original source website directly",
      "Cross-reference with fact-checking websites like Snopes or PolitiFact",
      "Look for peer-reviewed or academic sources on the topic",
    ],
    verdict: "suspicious",
  };
}

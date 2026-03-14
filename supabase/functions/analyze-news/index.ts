import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getSystemPrompt, getUserInstruction } from "../_shared/languagePrompts.ts";

// Schema version bumped to 2: segments and findings now include evidence fields.
// Old fields (overall_score, source_score, claims_score, risk_level, segments,
// findings, explanation) are fully preserved for backwards compatibility.
export const SCHEMA_VERSION = 2;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export type EvidenceStrength = "strong" | "medium" | "weak" | "none";
export type CredibilityLevel = "verified" | "questionable" | "misinformation";

export interface EvidenceSource {
  title: string;
  url: string;
}

export interface Segment {
  text: string;
  level: CredibilityLevel;
  evidence: EvidenceSource[];
  evidence_strength: EvidenceStrength;
}

export interface Finding {
  title: string;
  description: string;
  type: CredibilityLevel;
  evidence: EvidenceSource[];
  evidence_strength: EvidenceStrength;
}

export interface Sentiment {
  sentiment: "positive" | "neutral" | "negative";
  emotional_intensity: "low" | "medium" | "high";
  explanation: string;
}

export interface AnalysisReport {
  schema_version: number;
  overall_score: number;
  source_score: number;
  claims_score: number;
  risk_level: "low" | "medium" | "high";
  segments: Segment[];
  findings: Finding[];
  explanation: string;
  sentiment: Sentiment;
}

/** Evidence levels that permit the "verified" label. */
export const VERIFIED_EVIDENCE_THRESHOLD: EvidenceStrength[] = ["strong", "medium"];

/**
 * Downgrades any segment or finding whose level is "verified" but whose
 * evidence_strength is insufficient (weak / none).  This is the core
 * conservative rule: *no evidence → not verified*.
 */
export function enforceEvidenceRule(report: AnalysisReport): AnalysisReport {
  const isAllowed = (strength: EvidenceStrength) =>
    VERIFIED_EVIDENCE_THRESHOLD.includes(strength);

  const fixedSegments: Segment[] = report.segments.map((seg) => {
    if (seg.level === "verified" && !isAllowed(seg.evidence_strength)) {
      return { ...seg, level: "questionable" as CredibilityLevel };
    }
    return seg;
  });

  const fixedFindings: Finding[] = report.findings.map((f) => {
    if (f.type === "verified" && !isAllowed(f.evidence_strength)) {
      return { ...f, type: "questionable" as CredibilityLevel };
    }
    return f;
  });

  return { ...report, segments: fixedSegments, findings: fixedFindings };
}

/** Trusted search links used as a conservative evidence fallback. */
export function buildTrustedSearchSources(
  query: string
): Array<{ title: string; url: string; snippet: string }> {
  const encoded = encodeURIComponent(query);
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
    {
      title: "Snopes Search",
      url: `https://www.snopes.com/?s=${encoded}`,
      snippet: "Snopes fact checks",
    },
    {
      title: "PolitiFact Search",
      url: `https://www.politifact.com/search/?q=${encoded}`,
      snippet: "PolitiFact fact checks",
    },
    {
      title: "FactCheck.org Search",
      url: `https://www.factcheck.org/?s=${encoded}`,
      snippet: "FactCheck.org reports",
    },
    {
      title: "Wikipedia Search",
      url: `https://en.wikipedia.org/w/index.php?search=${encoded}`,
      snippet: "Wikipedia reference articles",
    },
    {
      title: "WHO Search",
      url: `https://www.who.int/search?indexCatalogue=genericsearchindex1&searchQuery=${encoded}`,
      snippet: "WHO health information",
    },
    {
      title: "CDC Search",
      url: `https://search.cdc.gov/search/index.html?query=${encoded}`,
      snippet: "CDC health information",
    },
  ];
}

/**
 * Extract 1–5 key verifiable claims from the input text.
 * Uses the same model/gateway as the main analysis.
 */
export async function extractClaims(
  apiKey: string,
  text: string
): Promise<string[]> {
  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0,
        top_p: 0.1,
        messages: [
          {
            role: "system",
            content:
              "Extract factual claims from the provided text. Return only 1 to 5 concise, verifiable factual claims. Ignore opinions, emotions, and jokes.",
          },
          {
            role: "user",
            content: `Text:\n\n${text.slice(0, 5000)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "claim_list",
              description: "List detected factual claims",
              parameters: {
                type: "object",
                properties: {
                  claims: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 1,
                    maxItems: 5,
                  },
                },
                required: ["claims"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "claim_list" },
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("Claim extraction failed:", response.status);
    return [];
  }

  const data = await response.json();
  const args =
    data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return [];

  try {
    const parsed = JSON.parse(args);
    return Array.isArray(parsed.claims)
      ? parsed.claims.filter(
          (c: unknown) => typeof c === "string" && c.trim().length > 0
        )
      : [];
  } catch {
    return [];
  }
}

/** Build a formatted evidence context string from trusted source links. */
export function buildEvidenceContext(
  claims: string[],
  sources: Array<{ title: string; url: string; snippet: string }>
): string {
  const claimList =
    claims.length > 0
      ? claims.map((c, i) => `${i + 1}. ${c}`).join("\n")
      : "No specific claims extracted.";

  const sourceList = sources
    .map((s, i) => `${i + 1}. ${s.title} | ${s.url} | ${s.snippet}`)
    .join("\n");

  return `KEY CLAIMS IDENTIFIED:\n${claimList}\n\nTRUSTED REFERENCE SOURCES (search links):\n${sourceList}`;
}

// Note: systemPrompt is now dynamically generated per language in the serve function
// See getSystemPrompt() in languagePrompts.ts for language-specific prompts

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = "en" } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // --- RAG step: extract claims and build evidence context ---
    const claims = await extractClaims(LOVABLE_API_KEY, text);
    const primaryClaim = claims[0] || text.slice(0, 120);
    const trustedSources = buildTrustedSearchSources(primaryClaim);
    const evidenceContext = buildEvidenceContext(claims, trustedSources);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          temperature: 0,
          top_p: 0.1,
          messages: [
            { role: "system", content: getSystemPrompt(language) },
            {
              role: "user",
              content: `${getUserInstruction(language)}${text.slice(0, 5000)}\n\n---\n${evidenceContext}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_analysis",
                description:
                  "Report the credibility analysis results for the given text.",
                parameters: {
                  type: "object",
                  properties: {
                    overall_score: {
                      type: "number",
                      description: "Overall credibility score 0-100",
                    },
                    source_score: {
                      type: "number",
                      description: "Source reliability score 0-100",
                    },
                    claims_score: {
                      type: "number",
                      description: "Claims accuracy score 0-100",
                    },
                    risk_level: {
                      type: "string",
                      enum: ["low", "medium", "high"],
                    },
                    segments: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          level: {
                            type: "string",
                            enum: [
                              "verified",
                              "questionable",
                              "misinformation",
                            ],
                          },
                          evidence: {
                            type: "array",
                            description:
                              "Sources that support or refute this segment",
                            items: {
                              type: "object",
                              properties: {
                                title: { type: "string" },
                                url: { type: "string" },
                              },
                              required: ["title", "url"],
                              additionalProperties: false,
                            },
                          },
                          evidence_strength: {
                            type: "string",
                            enum: ["strong", "medium", "weak", "none"],
                            description:
                              "How strong is the available evidence for this segment",
                          },
                        },
                        required: ["text", "level", "evidence", "evidence_strength"],
                        additionalProperties: false,
                      },
                    },
                    findings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          type: {
                            type: "string",
                            enum: [
                              "verified",
                              "questionable",
                              "misinformation",
                            ],
                          },
                          evidence: {
                            type: "array",
                            description:
                              "Sources that support or refute this finding",
                            items: {
                              type: "object",
                              properties: {
                                title: { type: "string" },
                                url: { type: "string" },
                              },
                              required: ["title", "url"],
                              additionalProperties: false,
                            },
                          },
                          evidence_strength: {
                            type: "string",
                            enum: ["strong", "medium", "weak", "none"],
                            description:
                              "How strong is the available evidence for this finding",
                          },
                        },
                        required: [
                          "title",
                          "description",
                          "type",
                          "evidence",
                          "evidence_strength",
                        ],
                        additionalProperties: false,
                      },
                    },
                    explanation: {
                      type: "string",
                      description:
                        "A detailed, human-readable explanation of the AI's reasoning process, red flags found, manipulation techniques detected, and advice for the reader.",
                    },
                    sentiment: {
                      type: "object",
                      description: "Sentiment analysis of the article or content.",
                      properties: {
                        sentiment: {
                          type: "string",
                          enum: ["positive", "neutral", "negative"],
                          description: "Overall sentiment of the content.",
                        },
                        emotional_intensity: {
                          type: "string",
                          enum: ["low", "medium", "high"],
                          description: "Intensity of the emotional tone.",
                        },
                        explanation: {
                          type: "string",
                          description: "Brief explanation of the detected sentiment and emotional tone.",
                        },
                      },
                      required: ["sentiment", "emotional_intensity", "explanation"],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    "overall_score",
                    "source_score",
                    "claims_score",
                    "risk_level",
                    "segments",
                    "findings",
                    "explanation",
                    "sentiment",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "report_analysis" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limited. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI usage limit reached. Please add credits.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No analysis returned from AI");
    }

    const rawAnalysis = JSON.parse(toolCall.function.arguments) as AnalysisReport;

    // Enforce the "no evidence → not verified" rule as a server-side safety net.
    const analysis = enforceEvidenceRule({
      ...rawAnalysis,
      schema_version: SCHEMA_VERSION,
    });

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-news error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { filterText } from "../_shared/textFilter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Verdict = "True" | "Likely False" | "Misleading" | "Unverified";

type Source = {
  title: string;
  url: string;
  snippet: string;
};

/** Maximum number of claims to verify per request. */
const MAX_CLAIMS_TO_VERIFY = 3;

/** Pre-compiled regex for date-like tokens used in salience scoring. */
const DATE_TOKEN_RE =
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|\d{1,2}\/\d{1,2})\b/i;

/**
 * Scores a claim by the presence of named-entity-like tokens:
 * numbers, dates, proper-noun indicators, quoted phrases, etc.
 * Higher score = more factual / verifiable.
 */
const scoreClaimSalience = (claim: string): number => {
  let score = 0;
  if (/\d/.test(claim)) score += 3;
  if (DATE_TOKEN_RE.test(claim)) score += 2;
  if (/["']/.test(claim)) score += 1;
  const capitalizedWords = claim.match(/\b[A-Z][a-z]{2,}/g) || [];
  score += Math.min(capitalizedWords.length, 3);
  return score;
};

const findSuspiciousPhrases = (text: string): string[] => {
  const patterns = [
    /urgent(?:ly)?/gi,
    /forward (?:this|it) to/gi,
    /share (?:this|it) now/gi,
    /breaking news/gi,
    /secret (?:cure|formula|plan)/gi,
    /guaranteed/gi,
    /they don't want you to know/gi,
    /100% true/gi,
    /confirmed by experts/gi,
    /must watch/gi,
    /immediately/gi,
  ];

  const found = new Set<string>();
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      if (match[0]) {
        found.add(match[0]);
      }
    }
  }

  return [...found];
};

const extractClaims = async (
  apiKey: string,
  text: string
): Promise<string[]> => {
  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        temperature: 0,
        top_p: 0.1,
        messages: [
          {
            role: "system",
            content:
              "Extract factual claims from user-provided text. " +
              "Return only 1 to 3 concise factual claims that can be externally verified. " +
              "Prefer claims that contain named entities, numbers, dates, or statistics. " +
              "Ignore opinions, questions, jokes, and calls to action. " +
              "If no verifiable factual claims exist, return an empty list.",
          },
          {
            role: "user",
            content: `Text to process:\n\n${text.slice(0, 5000)}`,
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
                    minItems: 0,
                    maxItems: 3,
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
    const err = await response.text();
    throw new Error(`Claim extraction failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const args =
    data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    return [];
  }

  const parsed = JSON.parse(args);
  const raw: string[] = Array.isArray(parsed.claims)
    ? parsed.claims.filter(
        (c: unknown) => typeof c === "string" && c.trim().length > 0
      )
    : [];

  // Sort by salience so the most verifiable claims are checked first.
  return raw
    .slice()
    .sort((a, b) => scoreClaimSalience(b) - scoreClaimSalience(a))
    .slice(0, MAX_CLAIMS_TO_VERIFY);
};

const fetchWikipediaSources = async (query: string): Promise<Source[]> => {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
    query
  )}&limit=3&namespace=0&format=json`;

  const response = await fetch(endpoint, {
    headers: { "User-Agent": "TruthShade/1.0 (fact-checker)" },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as [
    string,
    string[],
    string[],
    string[]
  ];
  const titles = data[1] || [];
  const snippets = data[2] || [];
  const urls = data[3] || [];

  return urls.map((url, i) => ({
    title: titles[i] || "Wikipedia entry",
    url,
    snippet: snippets[i] || "Reference article",
  }));
};

const buildTrustedSearchSources = (query: string): Source[] => {
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
      title: "Alt News Search",
      url: `https://www.altnews.in/?s=${encoded}`,
      snippet: "Alt News investigations",
    },
  ];
};

/**
 * Maps a verdict to a baseline credibility score.
 * "Unverified" returns a neutral/low value (40) so it is never displayed as
 * "True" in the UI regardless of the confidence value.
 */
const mapVerdictToScore = (verdict: Verdict): number => {
  if (verdict === "True") return 85;
  if (verdict === "Misleading") return 45;
  if (verdict === "Likely False") return 20;
  // Unverified – explicitly neutral/low, not high
  return 40;
};

/**
 * Calls the AI to verify a single claim against the provided source references.
 *
 * Conservative rules enforced:
 * - System prompt requires at least 2 evidence bullets citing the sources
 *   before "True" may be returned.
 * - Server-side post-processing: if verdict is "True" but fewer than 2
 *   evidence items were returned, verdict is downgraded to "Unverified".
 */
const verifyClaim = async (
  apiKey: string,
  claim: string,
  sources: Source[]
): Promise<{
  verdict: Verdict;
  confidence: number;
  explanation: string;
  evidence: string[];
}> => {
  const evidenceBlock = sources
    .slice(0, 6)
    .map((s, idx) => `${idx + 1}. ${s.title} | ${s.url} | ${s.snippet}`)
    .join("\n");

  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        temperature: 0,
        top_p: 0.1,
        messages: [
          {
            role: "system",
            content:
              "You are a conservative fact-checking analyst. " +
              "Your task is to determine a verdict for a claim using only the provided trusted-source references.\n\n" +
              "VERDICT RULES (follow strictly):\n" +
              '- "True": ONLY when the sources DIRECTLY confirm the claim. ' +
              "You MUST supply at least 2 evidence bullets quoting specific source titles. " +
              "If you cannot provide 2 such bullets, use 'Unverified' instead.\n" +
              '- "Likely False": sources DIRECTLY contradict the claim.\n' +
              '- "Misleading": claim contains a mix of true and false elements, or is taken out of context.\n' +
              '- "Unverified": sources do not directly address the claim, or evidence is insufficient.\n\n' +
              "When in doubt, choose 'Unverified'. It is better to under-claim than to falsely verify.",
          },
          {
            role: "user",
            content: `Claim:\n${claim}\n\nSource references:\n${evidenceBlock}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "claim_verdict",
              description: "Return claim verification verdict",
              parameters: {
                type: "object",
                properties: {
                  verdict: {
                    type: "string",
                    enum: ["True", "Likely False", "Misleading", "Unverified"],
                  },
                  confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                  },
                  explanation: {
                    type: "string",
                  },
                  evidence: {
                    type: "array",
                    description:
                      'Evidence bullets supporting the verdict. At least 2 required when verdict is "True".',
                    items: { type: "string" },
                  },
                },
                required: ["verdict", "confidence", "explanation", "evidence"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "claim_verdict" },
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claim verification failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const args =
    data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    return {
      verdict: "Unverified",
      confidence: 35,
      explanation: "No structured verdict returned by model.",
      evidence: [],
    };
  }

  const parsed: {
    verdict: Verdict;
    confidence: number;
    explanation: string;
    evidence?: unknown[];
  } = JSON.parse(args);

  const evidenceList: string[] = Array.isArray(parsed.evidence)
    ? parsed.evidence.filter(
        (e: unknown) => typeof e === "string" && (e as string).trim().length > 0
      ) as string[]
    : [];

  // Conservative post-processing: "True" requires at least 2 evidence bullets.
  if (parsed.verdict === "True" && evidenceList.length < 2) {
    return {
      verdict: "Unverified",
      confidence: Math.min(parsed.confidence, 45),
      explanation:
        `Verdict downgraded to Unverified: insufficient evidence bullets ` +
        `(got ${evidenceList.length}, need >= 2). ` +
        parsed.explanation,
      evidence: evidenceList,
    };
  }

  return {
    verdict: parsed.verdict,
    confidence: parsed.confidence,
    explanation: parsed.explanation,
    evidence: evidenceList,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body = await req.json();
    const inputText = typeof body.text === "string" ? body.text : "";

    if (!inputText.trim()) {
      return new Response(
        JSON.stringify({ error: "Extracted screenshot text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // A. Text filtration – runs before any model call.
    const { filteredText, metadata: filterMetadata } = filterText(inputText);

    const suspiciousPhrases = findSuspiciousPhrases(filteredText);

    // B. Claim extraction on the filtered text.
    const claims = await extractClaims(LOVABLE_API_KEY, filteredText);

    // If no verifiable claims were found, return Unverified immediately.
    if (claims.length === 0) {
      return new Response(
        JSON.stringify({
          extracted_text: inputText,
          normalized_text: filteredText,
          filter_metadata: filterMetadata,
          claims: [],
          detected_claim: null,
          credibility_score: 40,
          verdict: "Unverified" as Verdict,
          sources: [],
          suspicious_phrases: suspiciousPhrases,
          explanation:
            "No verifiable factual claims could be extracted from the provided text.",
          evidence: [],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // C. Verify the primary (highest-salience) claim.
    const primaryClaim = claims[0];

    const sources = [
      ...(await fetchWikipediaSources(primaryClaim)),
      ...buildTrustedSearchSources(primaryClaim),
    ].slice(0, 8);

    const verification = await verifyClaim(
      LOVABLE_API_KEY,
      primaryClaim,
      sources
    );

    // D. Score mapping.
    const baseScore = mapVerdictToScore(verification.verdict);
    const credibilityScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(baseScore * 0.6 + verification.confidence * 0.4)
      )
    );

    return new Response(
      JSON.stringify({
        extracted_text: inputText,
        normalized_text: filteredText,
        filter_metadata: filterMetadata,
        claims,
        detected_claim: primaryClaim,
        credibility_score: credibilityScore,
        verdict: verification.verdict,
        sources,
        suspicious_phrases: suspiciousPhrases,
        explanation: verification.explanation,
        evidence: verification.evidence,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("screenshot-fact-check error:", e);
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

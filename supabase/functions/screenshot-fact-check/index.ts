import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const normalizeText = (input: string): string => {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
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

const extractClaims = async (apiKey: string, text: string): Promise<string[]> => {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Extract factual claims from user-provided text. Return only 1 to 3 concise factual claims that can be verified externally. Ignore opinions and jokes.",
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
                  minItems: 1,
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
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claim extraction failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    return [];
  }

  const parsed = JSON.parse(args);
  return Array.isArray(parsed.claims)
    ? parsed.claims.filter((c: unknown) => typeof c === "string" && c.trim().length > 0)
    : [];
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

  const data = (await response.json()) as [string, string[], string[], string[]];
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

const mapVerdictToScore = (verdict: Verdict): number => {
  if (verdict === "True") return 85;
  if (verdict === "Misleading") return 45;
  if (verdict === "Likely False") return 20;
  return 55;
};

const verifyClaim = async (
  apiKey: string,
  claim: string,
  sources: Source[]
): Promise<{ verdict: Verdict; confidence: number; explanation: string }> => {
  const evidence = sources
    .slice(0, 6)
    .map((s, idx) => `${idx + 1}. ${s.title} | ${s.url} | ${s.snippet}`)
    .join("\n");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a fact-checking analyst. Determine a verdict for a claim using provided trusted-source references. If evidence is weak or insufficient, choose Unverified.",
        },
        {
          role: "user",
          content: `Claim:\n${claim}\n\nSource references:\n${evidence}`,
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
              },
              required: ["verdict", "confidence", "explanation"],
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
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claim verification failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    return {
      verdict: "Unverified",
      confidence: 35,
      explanation: "No structured verdict returned by model.",
    };
  }

  return JSON.parse(args);
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

    const normalizedText = normalizeText(inputText);
    const suspiciousPhrases = findSuspiciousPhrases(normalizedText);

    const claims = await extractClaims(LOVABLE_API_KEY, normalizedText);
    const detectedClaim = claims[0] || "No clear factual claim detected.";

    const sources = [
      ...(await fetchWikipediaSources(detectedClaim)),
      ...buildTrustedSearchSources(detectedClaim),
    ].slice(0, 8);

    const verification = await verifyClaim(LOVABLE_API_KEY, detectedClaim, sources);

    const baseScore = mapVerdictToScore(verification.verdict);
    const credibilityScore = Math.max(
      0,
      Math.min(100, Math.round(baseScore * 0.6 + verification.confidence * 0.4))
    );

    return new Response(
      JSON.stringify({
        extracted_text: inputText,
        normalized_text: normalizedText,
        claims,
        detected_claim: detectedClaim,
        credibility_score: credibilityScore,
        verdict: verification.verdict,
        sources,
        suspicious_phrases: suspiciousPhrases,
        explanation: verification.explanation,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("screenshot-fact-check error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

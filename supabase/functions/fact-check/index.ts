// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type SupportedLanguage =
  | "auto"
  | "en"
  | "hi"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa";

type FactVerdict = "Likely True" | "Misleading" | "Fake" | "Unverified";

type InternalVerdict = "True" | "Likely False" | "Misleading" | "Unverified";

type Source = {
  title: string;
  url: string;
  snippet: string;
};

type ForwardFingerprint = {
  message_embedding: number[];
  keywords: string[];
  entities: string[];
  urls: string[];
  claim_type: string;
};

type ForwardRecord = {
  id: string;
  title: string;
  seed_text: string;
  verdict: "False" | "Misleading" | "Unverified";
  detected_pattern: string;
  explanation: string;
  fact_check_sources: string[];
  fingerprint?: Partial<ForwardFingerprint>;
};

const supportedLanguageSet = new Set<SupportedLanguage>([
  "auto",
  "en",
  "hi",
  "bn",
  "ta",
  "te",
  "mr",
  "gu",
  "kn",
  "ml",
  "pa",
]);

const translationCache = new Map<string, string>();
const learnedForwardFingerprints: ForwardRecord[] = [];

const knownForwardTemplates: ForwardRecord[] = [
  {
    id: "MISINFO_1023",
    title: "Fake Government Student Grant",
    seed_text:
      "Government announced today all students get direct benefit cash. Register quickly and share with everyone.",
    verdict: "False",
    detected_pattern: "Fake government benefit scheme",
    explanation:
      "This pattern falsely claims instant government money and pushes urgent sharing behavior.",
    fact_check_sources: ["PIB Fact Check", "AltNews", "BoomLive"],
  },
  {
    id: "MISINFO_2031",
    title: "Fake Bank KYC Alert",
    seed_text:
      "Your bank account will be blocked tonight. Update KYC now and forward to all contacts.",
    verdict: "False",
    detected_pattern: "Fake bank alert",
    explanation:
      "Scam forwards use account-block panic and suspicious links to steal data.",
    fact_check_sources: ["RBI Alerts", "PIB Fact Check", "Cyber Dost"],
  },
  {
    id: "MISINFO_3094",
    title: "Fake No-Exam Job Recruitment",
    seed_text:
      "Central government opened huge vacancy with no exam today. Apply fast using this private link.",
    verdict: "False",
    detected_pattern: "Fake job recruitment message",
    explanation:
      "These forwards misuse job urgency and non-official domains to target users.",
    fact_check_sources: ["PIB Fact Check", "AltNews", "BoomLive"],
  },
  {
    id: "MISINFO_4122",
    title: "Miracle Health Cure",
    seed_text:
      "Doctors confirmed this home remedy cures severe disease in 3 days. Share immediately.",
    verdict: "False",
    detected_pattern: "Health misinformation",
    explanation:
      "Miracle-cure claims without medical evidence are common misinformation templates.",
    fact_check_sources: ["WHO", "PIB Fact Check", "AltNews"],
  },
  {
    id: "MISINFO_5180",
    title: "Emergency Panic Curfew Rumor",
    seed_text:
      "Emergency curfew in all cities tonight. Stock essentials and forward as received.",
    verdict: "False",
    detected_pattern: "Panic-inducing rumor",
    explanation:
      "Panic forwards spread quickly with urgency and unverifiable emergency claims.",
    fact_check_sources: ["PIB Fact Check", "Factly", "BoomLive"],
  },
];

const forwardStylePatterns = [
  /forwarded as received/gi,
  /share with everyone/gi,
  /share (?:this|it) (?:now|immediately)/gi,
  /government announced today/gi,
  /urgent(?:ly)?/gi,
  /must share/gi,
  /bit\.ly|tinyurl\.com|t\.co/gi,
  /🚨|⚠️|❗|‼️|🔴/g,
];

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

const extractUrls = (text: string): string[] => {
  const matches = text.match(/https?:\/\/[^\s]+|(?:bit\.ly|tinyurl\.com|t\.co)\/[^\s]+/gi);
  return matches ? [...new Set(matches)] : [];
};

const extractKeywords = (text: string, topK = 8): string[] => {
  const stop = new Set([
    "the", "is", "are", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with", "at", "this", "that", "you", "your", "all",
  ]);
  const tokens = (text.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || []).filter((t) => !stop.has(t));
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([token]) => token);
};

const extractEntities = (text: string): string[] => {
  const entities = text.match(/\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g) || [];
  return [...new Set(entities)].slice(0, 10);
};

const detectClaimType = (text: string): string => {
  const value = text.toLowerCase();
  if (/grant|benefit|money transfer|scheme|scholarship/.test(value)) return "financial benefit scheme";
  if (/bank|kyc|account blocked|otp|atm/.test(value)) return "banking panic alert";
  if (/job|recruitment|vacancy|apply now|no exam/.test(value)) return "fake recruitment drive";
  if (/cure|medicine|doctors confirmed|health|vaccine/.test(value)) return "health misinformation";
  if (/curfew|emergency|riot|panic|war/.test(value)) return "panic rumor";
  return "general misinformation claim";
};

const localEmbedding = (text: string, dimensions = 128): number[] => {
  const vector = new Array(dimensions).fill(0);
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || [];
  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i += 1) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0;
    }
    vector[Math.abs(hash) % dimensions] += 1;
  }
  const norm = Math.sqrt(vector.reduce((acc, n) => acc + n * n, 0)) || 1;
  return vector.map((n) => n / norm);
};

const aiEmbedding = async (apiKey: string, text: string): Promise<number[]> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900);
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 3500) }),
      signal: controller.signal,
    });
    if (!response.ok) return localEmbedding(text);
    const data = await response.json();
    const embedding = data?.data?.[0]?.embedding;
    if (!Array.isArray(embedding) || embedding.length === 0) return localEmbedding(text);
    const norm = Math.sqrt(embedding.reduce((acc: number, n: number) => acc + n * n, 0)) || 1;
    return embedding.map((n: number) => n / norm);
  } catch {
    return localEmbedding(text);
  } finally {
    clearTimeout(timeout);
  }
};

const cosineSimilarity = (a: number[], b: number[]): number => {
  if (!a.length || !b.length) return 0;
  const len = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < len; i += 1) {
    dot += (a[i] || 0) * (b[i] || 0);
  }
  return Math.max(0, Math.min(1, dot));
};

const keywordOverlap = (a: string[], b: string[]): number => {
  if (!a.length || !b.length) return 0;
  const sa = new Set(a.map((x) => x.toLowerCase()));
  const sb = new Set(b.map((x) => x.toLowerCase()));
  let overlap = 0;
  sa.forEach((token) => {
    if (sb.has(token)) overlap += 1;
  });
  return overlap / Math.max(sa.size, sb.size);
};

const claimTypeSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const ta = new Set(a.toLowerCase().split(/\s+/));
  const tb = new Set(b.toLowerCase().split(/\s+/));
  let overlap = 0;
  ta.forEach((token) => {
    if (tb.has(token)) overlap += 1;
  });
  return overlap / Math.max(ta.size, tb.size);
};

const getForwardStyleSignals = (text: string): string[] => {
  const signals: string[] = [];
  for (const pattern of forwardStylePatterns) {
    if (pattern.test(text)) {
      signals.push(pattern.source.replace(/\\/g, ""));
    }
  }
  return signals;
};

const buildFingerprint = async (apiKey: string, text: string): Promise<ForwardFingerprint> => {
  return {
    message_embedding: await aiEmbedding(apiKey, text),
    keywords: extractKeywords(text),
    entities: extractEntities(text),
    urls: extractUrls(text),
    claim_type: detectClaimType(text),
  };
};

const detectKnownForward = async (apiKey: string, englishInput: string) => {
  const fingerprint = await buildFingerprint(apiKey, englishInput);
  const styleSignals = getForwardStyleSignals(englishInput);

  const records = [...knownForwardTemplates, ...learnedForwardFingerprints];
  let bestMatch: { record: ForwardRecord; score: number } | null = null;

  for (const record of records) {
    const refFingerprint = record.fingerprint?.message_embedding
      ? (record.fingerprint as ForwardFingerprint)
      : {
          message_embedding: localEmbedding(record.seed_text),
          keywords: record.fingerprint?.keywords || extractKeywords(record.seed_text),
          entities: record.fingerprint?.entities || extractEntities(record.seed_text),
          urls: record.fingerprint?.urls || extractUrls(record.seed_text),
          claim_type: record.fingerprint?.claim_type || detectClaimType(record.seed_text),
        };

    const semantic = cosineSimilarity(fingerprint.message_embedding, refFingerprint.message_embedding || []);
    const keyword = keywordOverlap(fingerprint.keywords, refFingerprint.keywords || []);
    const claim = claimTypeSimilarity(fingerprint.claim_type, refFingerprint.claim_type || "");
    const score = semantic * 0.65 + keyword * 0.2 + claim * 0.15;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { record: { ...record, fingerprint: refFingerprint }, score };
    }
  }

  const boosted = Math.min(0.99, (bestMatch?.score || 0) + Math.min(0.1, styleSignals.length * 0.02));
  const forwardDetected = boosted > 0.8;
  const riskScore = Math.round(boosted * 100);

  return {
    forward_detected: forwardDetected,
    similarity_score: Number(boosted.toFixed(2)),
    risk_score: riskScore,
    forward_verdict: forwardDetected
      ? "Known Viral Misinformation Forward"
      : "No Known Viral Forward Match",
    detected_pattern: forwardDetected
      ? bestMatch?.record?.detected_pattern || fingerprint.claim_type
      : fingerprint.claim_type,
    message_type: styleSignals.length > 0 ? "WhatsApp forward chain" : "General social message",
    explanation: forwardDetected
      ? bestMatch?.record?.explanation || "Message matches known viral misinformation signature."
      : "No strong match found in known viral forward fingerprints.",
    recommended_action: forwardDetected
      ? "Do not forward this message."
      : "Verify with trusted sources before forwarding.",
    suspicious_signals: styleSignals,
    fingerprint,
    fact_check_sources: bestMatch?.record?.fact_check_sources || [],
    matched_record_id: bestMatch?.record?.id || null,
  };
};

const mapVerdictToScore = (verdict: InternalVerdict): number => {
  if (verdict === "True") return 85;
  if (verdict === "Misleading") return 45;
  if (verdict === "Likely False") return 20;
  return 55;
};

const mapVerdict = (verdict: InternalVerdict): FactVerdict => {
  if (verdict === "True") return "Likely True";
  if (verdict === "Likely False") return "Fake";
  if (verdict === "Misleading") return "Misleading";
  return "Unverified";
};

const callAi = async (apiKey: string, payload: Record<string, unknown>) => {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI gateway failed: ${response.status} ${err}`);
  }

  return response.json();
};

const extractImageText = async (apiKey: string, image: string): Promise<string> => {
  const data = await callAi(apiKey, {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are an OCR specialist. Extract all text exactly as in the image. Keep line breaks. If no text, return NO_TEXT_FOUND.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract all text from this screenshot." },
          {
            type: "image_url",
            image_url: {
              url: image.startsWith("data:") ? image : `data:image/png;base64,${image}`,
            },
          },
        ],
      },
    ],
  });

  const extracted = String(data.choices?.[0]?.message?.content || "").trim();
  if (!extracted || extracted === "NO_TEXT_FOUND") {
    throw new Error("No text could be extracted from screenshot.");
  }
  return extracted;
};

const detectLanguage = async (apiKey: string, text: string): Promise<SupportedLanguage> => {
  const data = await callAi(apiKey, {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "Detect the primary language of the input and return only one ISO code from: en, hi, bn, ta, te, mr, gu, kn, ml, pa. If uncertain, return en.",
      },
      {
        role: "user",
        content: text.slice(0, 1500),
      },
    ],
  });

  const code = String(data.choices?.[0]?.message?.content || "en").trim().toLowerCase() as SupportedLanguage;
  return supportedLanguageSet.has(code) && code !== "auto" ? code : "en";
};

const translateText = async (
  apiKey: string,
  text: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): Promise<string> => {
  if (!text.trim()) return "";
  if (source === target || target === "auto") return text;

  const cacheKey = `${source}:${target}:${text.slice(0, 1200)}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const data = await callAi(apiKey, {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are a translator for Indian users. Translate accurately using simple, clear vocabulary. Preserve factual meaning. Return only translated text.",
      },
      {
        role: "user",
        content: `Source language: ${source}\nTarget language: ${target}\n\nText:\n${text.slice(0, 5000)}`,
      },
    ],
  });

  const translated = String(data.choices?.[0]?.message?.content || "").trim() || text;
  translationCache.set(cacheKey, translated);
  return translated;
};

const extractClaims = async (apiKey: string, text: string): Promise<string[]> => {
  const data = await callAi(apiKey, {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "Extract 1 to 3 factual claims from user text. Ignore jokes and opinion. Return using tool call only.",
      },
      {
        role: "user",
        content: text.slice(0, 5000),
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "claim_list",
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
  });

  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return [];
  const parsed = JSON.parse(args);
  const claims = Array.isArray(parsed.claims) ? parsed.claims : [];
  return claims.filter((c: unknown) => typeof c === "string" && c.trim().length > 0);
};

const fetchWikipediaSources = async (query: string): Promise<Source[]> => {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
    query
  )}&limit=3&namespace=0&format=json`;

  const response = await fetch(endpoint, {
    headers: { "User-Agent": "TruthShade/1.0 (fact-check)" },
  });
  if (!response.ok) return [];

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
      title: "Alt News Search",
      url: `https://www.altnews.in/?s=${encoded}`,
      snippet: "Alt News investigations",
    },
  ];
};

const verifyClaim = async (
  apiKey: string,
  claim: string,
  sources: Source[]
): Promise<{ verdict: InternalVerdict; confidence: number; explanation: string }> => {
  const evidence = sources
    .slice(0, 6)
    .map((s, idx) => `${idx + 1}. ${s.title} | ${s.url} | ${s.snippet}`)
    .join("\n");

  const data = await callAi(apiKey, {
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are a fact-check analyst. Decide claim verdict with available evidence. Use Unverified when evidence is weak. Return tool call only.",
      },
      {
        role: "user",
        content: `Claim:\n${claim}\n\nEvidence:\n${evidence}`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "claim_verdict",
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
              explanation: { type: "string" },
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
  });

  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    return {
      verdict: "Unverified",
      confidence: 35,
      explanation: "Evidence was insufficient for a final verdict.",
    };
  }

  return JSON.parse(args);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body = await req.json();
    const type = body?.type === "screenshot" ? "screenshot" : "text";
    const rawLanguage = String(body?.language || "auto").toLowerCase() as SupportedLanguage;
    const preferredLanguage: SupportedLanguage = supportedLanguageSet.has(rawLanguage) ? rawLanguage : "auto";

    const rawContent = typeof body?.content === "string" ? body.content : "";
    if (!rawContent.trim()) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const textContent =
      type === "screenshot" ? await extractImageText(apiKey, rawContent) : rawContent;

    const normalizedInput = normalizeText(textContent);
    const detectedLanguage =
      preferredLanguage === "auto" ? await detectLanguage(apiKey, normalizedInput) : preferredLanguage;

    const englishInput =
      detectedLanguage === "en"
        ? normalizedInput
        : await translateText(apiKey, normalizedInput, detectedLanguage, "en");

    const claims = await extractClaims(apiKey, englishInput);
    const detectedClaimEn = claims[0] || "No clear factual claim detected.";

    const sourcesEn = [
      ...(await fetchWikipediaSources(detectedClaimEn)),
      ...buildTrustedSearchSources(detectedClaimEn),
    ].slice(0, 8);

    const verification = await verifyClaim(apiKey, detectedClaimEn, sourcesEn);
    const baseScore = mapVerdictToScore(verification.verdict);
    const credibilityScore = Math.max(
      0,
      Math.min(100, Math.round(baseScore * 0.6 + verification.confidence * 0.4))
    );

    const outputLanguage = preferredLanguage === "auto" ? detectedLanguage : preferredLanguage;

    const translatedClaim =
      outputLanguage === "en"
        ? detectedClaimEn
        : await translateText(apiKey, detectedClaimEn, "en", outputLanguage);

    const translatedExplanation =
      outputLanguage === "en"
        ? verification.explanation
        : await translateText(apiKey, verification.explanation, "en", outputLanguage);

    const translatedSources = await Promise.all(
      sourcesEn.map(async (source) => ({
        title:
          outputLanguage === "en"
            ? source.title
            : await translateText(apiKey, source.title, "en", outputLanguage),
        url: source.url,
        snippet:
          outputLanguage === "en"
            ? source.snippet
            : await translateText(apiKey, source.snippet, "en", outputLanguage),
      }))
    );

    const suspicious = findSuspiciousPhrases(englishInput);
    const forwardMatch = await detectKnownForward(apiKey, englishInput);

    if (!forwardMatch.forward_detected && verification.verdict === "Likely False" && verification.confidence >= 75) {
      learnedForwardFingerprints.push({
        id: `LEARNED_${Date.now()}`,
        title: detectedClaimEn.slice(0, 80),
        seed_text: englishInput.slice(0, 800),
        verdict: "False",
        detected_pattern: forwardMatch.detected_pattern,
        explanation: verification.explanation,
        fact_check_sources: ["Auto-learned from model decision"],
        fingerprint: forwardMatch.fingerprint,
      });
    }

    const translatedForwardExplanation =
      outputLanguage === "en"
        ? forwardMatch.explanation
        : await translateText(apiKey, forwardMatch.explanation, "en", outputLanguage);

    const translatedRecommendedAction =
      outputLanguage === "en"
        ? forwardMatch.recommended_action
        : await translateText(apiKey, forwardMatch.recommended_action, "en", outputLanguage);

    return new Response(
      JSON.stringify({
        credibility_score: credibilityScore,
        verdict: mapVerdict(verification.verdict),
        explanation: translatedExplanation,
        sources: translatedSources,
        claims,
        detected_claim: translatedClaim,
        detected_language: detectedLanguage,
        output_language: outputLanguage,
        suspicious_phrases: suspicious,
        english_content: englishInput,
        normalized_content: normalizedInput,
        forward_detected: forwardMatch.forward_detected,
        similarity_score: forwardMatch.similarity_score,
        risk_score: forwardMatch.risk_score,
        forward_verdict: forwardMatch.forward_verdict,
        detected_pattern: forwardMatch.detected_pattern,
        message_type: forwardMatch.message_type,
        forward_explanation: translatedForwardExplanation,
        recommended_action: translatedRecommendedAction,
        forward_signals: forwardMatch.suspicious_signals,
        forward_fact_check_sources: forwardMatch.fact_check_sources,
        fingerprint: forwardMatch.fingerprint,
        viral_forward_output: {
          forward_detected: forwardMatch.forward_detected,
          similarity_score: forwardMatch.similarity_score,
          risk_score: forwardMatch.risk_score,
          verdict: forwardMatch.forward_verdict,
          detected_pattern: forwardMatch.detected_pattern,
          message_type: forwardMatch.message_type,
          explanation: translatedForwardExplanation,
          recommended_action: translatedRecommendedAction,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("fact-check error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

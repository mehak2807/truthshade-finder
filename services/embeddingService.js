const STOP_WORDS = new Set([
  "the", "is", "are", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with", "at", "from", "by",
  "this", "that", "it", "as", "be", "was", "were", "will", "has", "have", "had", "you", "your", "all"
]);

export function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s]+|(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl)\/[^\s]+/gi);
  return matches ? [...new Set(matches)] : [];
}

export function extractKeywords(text, topK = 8) {
  const tokens = (text.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])
    .filter((token) => !STOP_WORDS.has(token));

  const counts = new Map();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([token]) => token);
}

export function extractEntities(text) {
  const raw = text.match(/\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g) || [];
  return [...new Set(raw)].slice(0, 10);
}

export function detectClaimType(text) {
  const value = text.toLowerCase();
  if (/grant|benefit|money transfer|scheme|scholarship/.test(value)) return "financial benefit scheme";
  if (/bank|kyc|account blocked|otp|atm/.test(value)) return "banking panic alert";
  if (/job|recruitment|vacancy|apply now|no exam/.test(value)) return "fake recruitment drive";
  if (/cure|medicine|doctors confirmed|vaccine|health/.test(value)) return "health misinformation";
  if (/curfew|emergency|riot|panic|war/.test(value)) return "panic rumor";
  return "general misinformation claim";
}

function hashToken(token, dimensions) {
  let hash = 0;
  for (let i = 0; i < token.length; i += 1) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % dimensions;
}

function normalizedVector(vec) {
  const norm = Math.sqrt(vec.reduce((acc, n) => acc + n * n, 0)) || 1;
  return vec.map((n) => n / norm);
}

function localEmbedding(text, dimensions = 128) {
  const vector = new Array(dimensions).fill(0);
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || [];
  for (const token of tokens) {
    const i = hashToken(token, dimensions);
    vector[i] += 1;
  }
  return normalizedVector(vector);
}

export async function generateEmbedding(text, options = {}) {
  const { apiKey } = options;
  if (!apiKey) {
    return localEmbedding(text);
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.slice(0, 4000),
      }),
    });

    if (!response.ok) {
      return localEmbedding(text);
    }

    const data = await response.json();
    const embedding = data?.data?.[0]?.embedding;
    if (!Array.isArray(embedding) || embedding.length === 0) {
      return localEmbedding(text);
    }

    return normalizedVector(embedding.map((value) => Number(value) || 0));
  } catch {
    return localEmbedding(text);
  }
}

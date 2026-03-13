export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) return 0;
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;

  for (let i = 0; i < len; i += 1) {
    const av = Number(a[i]) || 0;
    const bv = Number(b[i]) || 0;
    dot += av * bv;
    aNorm += av * av;
    bNorm += bv * bv;
  }

  const denom = Math.sqrt(aNorm) * Math.sqrt(bNorm);
  if (!denom) return 0;
  return dot / denom;
}

export function keywordOverlapScore(inputKeywords = [], referenceKeywords = []) {
  if (!inputKeywords.length || !referenceKeywords.length) return 0;
  const input = new Set(inputKeywords.map((v) => String(v).toLowerCase()));
  const ref = new Set(referenceKeywords.map((v) => String(v).toLowerCase()));
  let overlap = 0;
  input.forEach((v) => {
    if (ref.has(v)) overlap += 1;
  });
  return overlap / Math.max(input.size, ref.size);
}

export function claimSimilarityScore(a = "", b = "") {
  const x = String(a).toLowerCase();
  const y = String(b).toLowerCase();
  if (!x || !y) return 0;
  if (x === y) return 1;

  const xTokens = new Set(x.split(/\s+/).filter(Boolean));
  const yTokens = new Set(y.split(/\s+/).filter(Boolean));
  let overlap = 0;
  xTokens.forEach((token) => {
    if (yTokens.has(token)) overlap += 1;
  });

  return overlap / Math.max(xTokens.size, yTokens.size);
}

export function combinedSimilarity(inputFp, knownFp) {
  const semantic = cosineSimilarity(inputFp.message_embedding, knownFp.message_embedding);
  const keyword = keywordOverlapScore(inputFp.keywords || [], knownFp.keywords || []);
  const claim = claimSimilarityScore(inputFp.claim_type || "", knownFp.claim_type || "");

  const score = semantic * 0.65 + keyword * 0.2 + claim * 0.15;
  return {
    semantic,
    keyword,
    claim,
    score,
  };
}

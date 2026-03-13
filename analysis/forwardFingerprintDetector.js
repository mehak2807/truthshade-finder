import fingerprintsDb from "../database/misinformationFingerprints.json" assert { type: "json" };
import {
  generateEmbedding,
  extractKeywords,
  extractEntities,
  detectClaimType,
  extractUrls,
} from "../services/embeddingService.js";
import { combinedSimilarity } from "../services/similarityService.js";

const learnedFingerprints = [];

const FORWARD_STYLE_PATTERNS = [
  /forwarded as received/gi,
  /share with everyone/gi,
  /share (this|it) immediately/gi,
  /government announced today/gi,
  /urgent/gi,
  /⚠️|🚨|❗/g,
  /bit\.ly|tinyurl\.com|t\.co/gi,
];

function forwardStyleSignals(text) {
  const signals = [];
  FORWARD_STYLE_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      signals.push(pattern.source.replace(/\\/g, ""));
    }
  });
  return signals;
}

async function buildFingerprint(text, options = {}) {
  return {
    message_embedding: await generateEmbedding(text, options),
    keywords: extractKeywords(text),
    entities: extractEntities(text),
    urls: extractUrls(text),
    claim_type: detectClaimType(text),
    forward_style_signals: forwardStyleSignals(text),
  };
}

async function normalizeTemplateRecord(record, options = {}) {
  if (record.fingerprint?.message_embedding) {
    return record;
  }

  const seed = record.seed_text || record.title || "";
  const generated = await buildFingerprint(seed, options);

  return {
    ...record,
    fingerprint: {
      ...record.fingerprint,
      message_embedding: generated.message_embedding,
      keywords: record.fingerprint?.keywords?.length ? record.fingerprint.keywords : generated.keywords,
      entities: record.fingerprint?.entities?.length ? record.fingerprint.entities : generated.entities,
      urls: record.fingerprint?.urls?.length ? record.fingerprint.urls : generated.urls,
      claim_type: record.fingerprint?.claim_type || generated.claim_type,
    },
  };
}

export async function detectForwardFingerprint(message, options = {}) {
  const threshold = Number(options.threshold || 0.8);
  const input = await buildFingerprint(message, options);

  const references = [...fingerprintsDb, ...learnedFingerprints];
  const normalizedRefs = await Promise.all(
    references.map((record) => normalizeTemplateRecord(record, options))
  );

  let best = null;
  for (const record of normalizedRefs) {
    const similarity = combinedSimilarity(input, record.fingerprint);
    if (!best || similarity.score > best.similarity.score) {
      best = { record, similarity };
    }
  }

  const styleBoost = Math.min(0.1, (input.forward_style_signals?.length || 0) * 0.02);
  const finalScore = Math.min(1, (best?.similarity.score || 0) + styleBoost);
  const knownForward = finalScore >= threshold;

  return {
    forward_detected: knownForward,
    similarity_score: Number(finalScore.toFixed(2)),
    risk_score: Math.round(Math.min(100, finalScore * 100)),
    verdict: knownForward ? "Known Viral Misinformation Forward" : "No Known Viral Match",
    detected_pattern: knownForward
      ? best?.record?.detected_pattern || "Known misinformation forward"
      : input.claim_type,
    message_type:
      input.forward_style_signals.length > 0 ? "WhatsApp forward chain" : "General social message",
    explanation: knownForward
      ? best?.record?.explanation || "Message pattern matches known misinformation forwards."
      : "No strong match found against known viral misinformation templates.",
    recommended_action: knownForward
      ? "Do not forward this message."
      : "Verify with trusted sources before forwarding.",
    suspicious_signals: input.forward_style_signals,
    matched_record_id: best?.record?.id || null,
    fact_check_sources: best?.record?.fact_check_sources || [],
    fingerprint: input,
  };
}

export function learnNewMisinformationFingerprint(record) {
  if (!record || !record.id || !record.fingerprint) return;
  learnedFingerprints.push(record);
}

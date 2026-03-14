/**
 * Helpers for interpreting analysis report verification status in the UI.
 *
 * Key principle: a high credibility *score* alone does NOT mean a claim is
 * "Verified".  Evidence strength (from findings and segments) must back up
 * the score before the "Verified" label is shown.  This mirrors the
 * `enforceEvidenceRule` that runs in the backend edge function.
 */

export type EvidenceStrength = "strong" | "medium" | "weak" | "none";
export type CredibilityLevel = "verified" | "questionable" | "misinformation";

/** Minimum evidence strength required to display the "Verified" UI label. */
export const VERIFIED_EVIDENCE_THRESHOLD: EvidenceStrength[] = ["strong", "medium"];

export interface ReportSegment {
  level: CredibilityLevel;
  evidence_strength?: EvidenceStrength;
}

export interface ReportFinding {
  type: CredibilityLevel;
  evidence_strength?: EvidenceStrength;
}

/** Minimal shape of an analysis report consumed by the helpers below. */
export interface VerifiableReport {
  overall_score: number;
  segments: ReportSegment[];
  findings: ReportFinding[];
}

/**
 * Returns `true` only when the report contains at least one segment or finding
 * that is marked "verified" **and** is backed by medium-or-strong evidence.
 *
 * A high `overall_score` alone is NOT sufficient to be considered verified.
 * When `evidence_strength` is `undefined` it is treated as "none" (not verified).
 */
export function isVerifiedReport(report: VerifiableReport): boolean {
  // Missing evidence_strength defaults to "none", which is not in the threshold list.
  const evidenceOk = (strength: EvidenceStrength | undefined): boolean =>
    VERIFIED_EVIDENCE_THRESHOLD.includes(strength ?? "none");

  return (
    report.segments.some((s) => s.level === "verified" && evidenceOk(s.evidence_strength)) ||
    report.findings.some((f) => f.type === "verified" && evidenceOk(f.evidence_strength))
  );
}

/**
 * Returns the status chip label and Tailwind CSS classes for the result
 * header badge.
 *
 * Rules:
 * - score < 25  → "Red"
 * - score < 50  → "Unreliable"
 * - score < 75  → "Caution"
 * - score ≥ 75 **with** medium/strong evidence → "Verified"
 * - score ≥ 75 **without** sufficient evidence → "Needs evidence"
 */
export function getVerificationStatus(report: VerifiableReport): {
  label: string;
  className: string;
} {
  if (report.overall_score < 25)
    return {
      label: "Red",
      className: "bg-red-500/10 text-red-600 border border-red-500/30",
    };

  if (report.overall_score < 50)
    return {
      label: "Unreliable",
      className: "bg-orange-500/10 text-orange-600 border border-orange-500/30",
    };

  if (report.overall_score < 75)
    return {
      label: "Caution",
      className: "bg-yellow-500/10 text-yellow-700 border border-yellow-500/30",
    };

  // score >= 75: only "Verified" when evidence supports it
  if (isVerifiedReport(report))
    return {
      label: "Verified",
      className: "bg-trust-verified/10 text-trust-verified border border-trust-verified/25",
    };

  return {
    label: "Needs evidence",
    className: "bg-yellow-500/10 text-yellow-700 border border-yellow-500/30",
  };
}

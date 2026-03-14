/**
 * Unit tests for src/lib/verificationHelpers.ts
 *
 * Key behaviour being tested:
 * 1. isVerifiedReport – returns true only when at least one segment/finding
 *    has level "verified" AND evidence_strength "strong" | "medium".
 * 2. getVerificationStatus – returns "Verified" chip only when evidence
 *    warrants it; high score alone must NOT produce "Verified".
 */

import { describe, it, expect } from "vitest";
import {
  isVerifiedReport,
  getVerificationStatus,
  type VerifiableReport,
} from "@/lib/verificationHelpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeReport(
  overall_score: number,
  segments: VerifiableReport["segments"] = [],
  findings: VerifiableReport["findings"] = []
): VerifiableReport {
  return { overall_score, segments, findings };
}

// ---------------------------------------------------------------------------
// isVerifiedReport
// ---------------------------------------------------------------------------

describe("isVerifiedReport", () => {
  it("returns false when there are no segments or findings", () => {
    expect(isVerifiedReport(makeReport(90))).toBe(false);
  });

  it("returns false when all segments have weak evidence", () => {
    const report = makeReport(90, [{ level: "verified", evidence_strength: "weak" }]);
    expect(isVerifiedReport(report)).toBe(false);
  });

  it("returns false when all segments have no evidence", () => {
    const report = makeReport(90, [{ level: "verified", evidence_strength: "none" }]);
    expect(isVerifiedReport(report)).toBe(false);
  });

  it("returns false when all segments have undefined evidence_strength", () => {
    const report = makeReport(90, [{ level: "verified" }]);
    expect(isVerifiedReport(report)).toBe(false);
  });

  it("returns false when findings are verified but have no evidence", () => {
    const report = makeReport(90, [], [{ type: "verified", evidence_strength: "none" }]);
    expect(isVerifiedReport(report)).toBe(false);
  });

  it("returns true when a segment is verified with medium evidence", () => {
    const report = makeReport(90, [{ level: "verified", evidence_strength: "medium" }]);
    expect(isVerifiedReport(report)).toBe(true);
  });

  it("returns true when a segment is verified with strong evidence", () => {
    const report = makeReport(90, [{ level: "verified", evidence_strength: "strong" }]);
    expect(isVerifiedReport(report)).toBe(true);
  });

  it("returns true when a finding is verified with medium evidence", () => {
    const report = makeReport(90, [], [{ type: "verified", evidence_strength: "medium" }]);
    expect(isVerifiedReport(report)).toBe(true);
  });

  it("returns true when a finding is verified with strong evidence", () => {
    const report = makeReport(90, [], [{ type: "verified", evidence_strength: "strong" }]);
    expect(isVerifiedReport(report)).toBe(true);
  });

  it("returns false when non-verified segment has strong evidence (level matters)", () => {
    const report = makeReport(90, [{ level: "questionable", evidence_strength: "strong" }]);
    expect(isVerifiedReport(report)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getVerificationStatus
// ---------------------------------------------------------------------------

describe("getVerificationStatus", () => {
  it('returns "Red" label for score < 25', () => {
    const chip = getVerificationStatus(makeReport(10));
    expect(chip.label).toBe("Red");
  });

  it('returns "Unreliable" label for score 25–49', () => {
    expect(getVerificationStatus(makeReport(25)).label).toBe("Unreliable");
    expect(getVerificationStatus(makeReport(49)).label).toBe("Unreliable");
  });

  it('returns "Caution" label for score 50–74', () => {
    expect(getVerificationStatus(makeReport(50)).label).toBe("Caution");
    expect(getVerificationStatus(makeReport(74)).label).toBe("Caution");
  });

  it('returns "Needs evidence" (not "Verified") for high score with NO findings/segments', () => {
    const chip = getVerificationStatus(makeReport(80));
    expect(chip.label).toBe("Needs evidence");
  });

  it('returns "Needs evidence" for high score with weak evidence', () => {
    const report = makeReport(
      80,
      [{ level: "verified", evidence_strength: "weak" }],
      [{ type: "verified", evidence_strength: "none" }]
    );
    expect(getVerificationStatus(report).label).toBe("Needs evidence");
  });

  it('returns "Needs evidence" for score exactly 75 with no evidence', () => {
    expect(getVerificationStatus(makeReport(75)).label).toBe("Needs evidence");
  });

  it('returns "Verified" only when score >= 75 AND evidence is sufficient', () => {
    const report = makeReport(
      80,
      [{ level: "verified", evidence_strength: "strong" }]
    );
    expect(getVerificationStatus(report).label).toBe("Verified");
  });

  it('returns "Verified" when a finding has medium evidence and score >= 75', () => {
    const report = makeReport(
      90,
      [],
      [{ type: "verified", evidence_strength: "medium" }]
    );
    expect(getVerificationStatus(report).label).toBe("Verified");
  });

  it("does not return \"Verified\" for high score + evidence when score is below 75", () => {
    // score 70 is below threshold
    const report = makeReport(
      70,
      [{ level: "verified", evidence_strength: "strong" }]
    );
    expect(getVerificationStatus(report).label).toBe("Caution");
  });
});

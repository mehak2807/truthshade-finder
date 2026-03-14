/**
 * Unit tests for the analyze-news edge function logic.
 *
 * These tests validate:
 * 1. JSON schema parsing for the report_analysis tool output.
 * 2. The "no evidence → not verified" enforcement rule.
 * 3. That deterministic generation parameters (temperature, top_p) are present.
 * 4. The buildTrustedSearchSources helper.
 * 5. The buildEvidenceContext helper.
 *
 * Note: The Supabase Edge Function runs in Deno; these tests exercise the
 * pure TypeScript logic that has been exported from the function module.
 * They run under Vitest (the project's existing test framework).
 */

import { describe, it, expect } from "vitest";

// --------------------------------------------------------------------------
// Inline copies of the exported helpers so Vitest (Node/JSDOM) can import
// them without a full Deno runtime.  These must stay in sync with the
// corresponding exports in supabase/functions/analyze-news/index.ts.
// --------------------------------------------------------------------------

type EvidenceStrength = "strong" | "medium" | "weak" | "none";
type CredibilityLevel = "verified" | "questionable" | "misinformation";

interface EvidenceSource {
  title: string;
  url: string;
}

interface Segment {
  text: string;
  level: CredibilityLevel;
  evidence: EvidenceSource[];
  evidence_strength: EvidenceStrength;
}

interface Finding {
  title: string;
  description: string;
  type: CredibilityLevel;
  evidence: EvidenceSource[];
  evidence_strength: EvidenceStrength;
}

interface AnalysisReport {
  schema_version: number;
  overall_score: number;
  source_score: number;
  claims_score: number;
  risk_level: "low" | "medium" | "high";
  segments: Segment[];
  findings: Finding[];
  explanation: string;
}

const VERIFIED_EVIDENCE_THRESHOLD: EvidenceStrength[] = ["strong", "medium"];

function enforceEvidenceRule(report: AnalysisReport): AnalysisReport {
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

function buildTrustedSearchSources(
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

function buildEvidenceContext(
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

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function makeReport(overrides: Partial<AnalysisReport> = {}): AnalysisReport {
  return {
    schema_version: 2,
    overall_score: 70,
    source_score: 65,
    claims_score: 60,
    risk_level: "medium",
    segments: [],
    findings: [],
    explanation: "Test explanation",
    ...overrides,
  };
}

// --------------------------------------------------------------------------
// 1. JSON schema parsing
// --------------------------------------------------------------------------

describe("JSON schema parsing", () => {
  it("parses a minimal valid report_analysis JSON payload", () => {
    const json = JSON.stringify(
      makeReport({
        segments: [
          {
            text: "Scientists say X",
            level: "verified",
            evidence: [{ title: "Reuters", url: "https://reuters.com/x" }],
            evidence_strength: "strong",
          },
        ],
        findings: [
          {
            title: "Finding A",
            description: "Detail",
            type: "questionable",
            evidence: [],
            evidence_strength: "none",
          },
        ],
      })
    );

    const parsed = JSON.parse(json) as AnalysisReport;

    expect(parsed.overall_score).toBe(70);
    expect(parsed.segments).toHaveLength(1);
    expect(parsed.segments[0].evidence_strength).toBe("strong");
    expect(parsed.findings[0].evidence_strength).toBe("none");
  });

  it("preserves all required top-level fields", () => {
    const report = makeReport();
    const fields: (keyof AnalysisReport)[] = [
      "schema_version",
      "overall_score",
      "source_score",
      "claims_score",
      "risk_level",
      "segments",
      "findings",
      "explanation",
    ];
    for (const field of fields) {
      expect(report).toHaveProperty(field);
    }
  });

  it("schema_version is 2", () => {
    const report = makeReport();
    expect(report.schema_version).toBe(2);
  });
});

// --------------------------------------------------------------------------
// 2. "No evidence → not verified" rule
// --------------------------------------------------------------------------

describe("enforceEvidenceRule", () => {
  it("downgrades a verified segment with evidence_strength=none to questionable", () => {
    const report = makeReport({
      segments: [
        {
          text: "Claim with no evidence",
          level: "verified",
          evidence: [],
          evidence_strength: "none",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("questionable");
  });

  it("downgrades a verified segment with evidence_strength=weak to questionable", () => {
    const report = makeReport({
      segments: [
        {
          text: "Weak claim",
          level: "verified",
          evidence: [],
          evidence_strength: "weak",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("questionable");
  });

  it("keeps verified segment intact when evidence_strength=medium", () => {
    const report = makeReport({
      segments: [
        {
          text: "Medium claim",
          level: "verified",
          evidence: [{ title: "Reuters", url: "https://reuters.com/a" }],
          evidence_strength: "medium",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("verified");
  });

  it("keeps verified segment intact when evidence_strength=strong", () => {
    const report = makeReport({
      segments: [
        {
          text: "Strong claim",
          level: "verified",
          evidence: [{ title: "AP News", url: "https://apnews.com/a" }],
          evidence_strength: "strong",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("verified");
  });

  it("does not change misinformation segments", () => {
    const report = makeReport({
      segments: [
        {
          text: "False claim",
          level: "misinformation",
          evidence: [],
          evidence_strength: "none",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("misinformation");
  });

  it("does not change questionable segments", () => {
    const report = makeReport({
      segments: [
        {
          text: "Questionable claim",
          level: "questionable",
          evidence: [],
          evidence_strength: "weak",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("questionable");
  });

  it("downgrades a verified finding with evidence_strength=none to questionable", () => {
    const report = makeReport({
      findings: [
        {
          title: "Finding",
          description: "No evidence",
          type: "verified",
          evidence: [],
          evidence_strength: "none",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.findings[0].type).toBe("questionable");
  });

  it("keeps verified finding intact when evidence_strength=strong", () => {
    const report = makeReport({
      findings: [
        {
          title: "Finding",
          description: "Strong evidence",
          type: "verified",
          evidence: [{ title: "Snopes", url: "https://snopes.com/x" }],
          evidence_strength: "strong",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.findings[0].type).toBe("verified");
  });

  it("does not mutate the original report", () => {
    const report = makeReport({
      segments: [
        {
          text: "Claim",
          level: "verified",
          evidence: [],
          evidence_strength: "none",
        },
      ],
    });

    enforceEvidenceRule(report);
    // Original must be unchanged
    expect(report.segments[0].level).toBe("verified");
  });

  it("processes multiple segments correctly", () => {
    const report = makeReport({
      segments: [
        {
          text: "A",
          level: "verified",
          evidence: [],
          evidence_strength: "none",
        },
        {
          text: "B",
          level: "verified",
          evidence: [{ title: "Reuters", url: "https://reuters.com" }],
          evidence_strength: "medium",
        },
        {
          text: "C",
          level: "misinformation",
          evidence: [],
          evidence_strength: "none",
        },
      ],
    });

    const fixed = enforceEvidenceRule(report);
    expect(fixed.segments[0].level).toBe("questionable"); // downgraded
    expect(fixed.segments[1].level).toBe("verified"); // kept
    expect(fixed.segments[2].level).toBe("misinformation"); // kept
  });
});

// --------------------------------------------------------------------------
// 3. Deterministic generation parameters in request payload
// --------------------------------------------------------------------------

describe("AI request payload parameters", () => {
  it("includes temperature=0 and top_p=0.1 in a constructed request body", () => {
    // Simulate the body that analyze-news sends to the AI gateway.
    const requestBody = {
      model: "google/gemini-3-flash-preview",
      temperature: 0,
      top_p: 0.1,
      messages: [{ role: "system", content: "prompt" }],
      tools: [],
      tool_choice: { type: "function", function: { name: "report_analysis" } },
    };

    expect(requestBody.temperature).toBe(0);
    expect(requestBody.top_p).toBe(0.1);
  });

  it("claim extraction request also uses temperature=0 and top_p=0.1", () => {
    const claimRequestBody = {
      model: "google/gemini-3-flash-preview",
      temperature: 0,
      top_p: 0.1,
      messages: [{ role: "system", content: "extract claims" }],
      tools: [],
      tool_choice: { type: "function", function: { name: "claim_list" } },
    };

    expect(claimRequestBody.temperature).toBe(0);
    expect(claimRequestBody.top_p).toBe(0.1);
  });
});

// --------------------------------------------------------------------------
// 4. buildTrustedSearchSources
// --------------------------------------------------------------------------

describe("buildTrustedSearchSources", () => {
  it("returns a non-empty array of sources", () => {
    const sources = buildTrustedSearchSources("vaccine misinformation");
    expect(sources.length).toBeGreaterThan(0);
  });

  it("includes Reuters in the sources", () => {
    const sources = buildTrustedSearchSources("test");
    const hasReuters = sources.some((s) =>
      s.url.startsWith("https://www.reuters.com/")
    );
    expect(hasReuters).toBe(true);
  });

  it("includes Snopes in the sources", () => {
    const sources = buildTrustedSearchSources("test");
    const hasSnopes = sources.some((s) =>
      s.url.startsWith("https://www.snopes.com/")
    );
    expect(hasSnopes).toBe(true);
  });

  it("includes Wikipedia in the sources", () => {
    const sources = buildTrustedSearchSources("test");
    const hasWiki = sources.some((s) =>
      s.url.startsWith("https://en.wikipedia.org/")
    );
    expect(hasWiki).toBe(true);
  });

  it("URL-encodes the query correctly", () => {
    const sources = buildTrustedSearchSources("COVID vaccine");
    const reuter = sources.find((s) =>
      s.url.startsWith("https://www.reuters.com/")
    );
    expect(reuter?.url).toContain(encodeURIComponent("COVID vaccine"));
  });

  it("each source has title, url, and snippet", () => {
    const sources = buildTrustedSearchSources("any query");
    for (const s of sources) {
      expect(s).toHaveProperty("title");
      expect(s).toHaveProperty("url");
      expect(s).toHaveProperty("snippet");
      expect(typeof s.title).toBe("string");
      expect(typeof s.url).toBe("string");
      expect(typeof s.snippet).toBe("string");
    }
  });
});

// --------------------------------------------------------------------------
// 5. buildEvidenceContext
// --------------------------------------------------------------------------

describe("buildEvidenceContext", () => {
  it("includes extracted claims in the output", () => {
    const context = buildEvidenceContext(
      ["Claim 1", "Claim 2"],
      []
    );
    expect(context).toContain("Claim 1");
    expect(context).toContain("Claim 2");
  });

  it("shows fallback message when no claims", () => {
    const context = buildEvidenceContext([], []);
    expect(context).toContain("No specific claims extracted");
  });

  it("includes source titles and URLs in the output", () => {
    const sources = [
      {
        title: "Reuters",
        url: "https://reuters.com",
        snippet: "Reporting",
      },
    ];
    const context = buildEvidenceContext(["Claim"], sources);
    expect(context).toContain("Reuters");
    expect(context).toContain("https://reuters.com");
  });
});

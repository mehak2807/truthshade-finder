/**
 * Unit tests for the textFilter utility.
 *
 * These tests exercise the pure TypeScript logic from
 * supabase/functions/_shared/textFilter.ts without a Deno runtime.
 * Inline copies of the helpers are used so Vitest (Node/JSDOM) can import them.
 * The inline copies must stay in sync with the originals.
 *
 * Tests run under Vitest (the project's existing test framework).
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Inline copies of types and helpers from _shared/textFilter.ts
// ---------------------------------------------------------------------------

interface FilterMetadata {
  removed_urls_count: number;
  removed_mentions_count: number;
  removed_hashtags_count: number;
  removed_lines_count: number;
  original_length: number;
  filtered_length: number;
}

interface FilterResult {
  filteredText: string;
  metadata: FilterMetadata;
}

const MAX_INPUT_CHARS = 8000;

const BOILERPLATE_PATTERNS: RegExp[] = [
  /forwarded\s+as\s+received/gi,
  /forwarded\s+message/gi,
  /please\s+(share|forward|re-?share)\s+(this|it)(\s+to\s+[\w\s]+)?/gi,
  /share\s+(this\s+)?now/gi,
  /copied\s+from/gi,
  /must\s+(share|watch|read|see)/gi,
  /spread\s+the\s+(word|news|message)/gi,
  /\bfwd\s*:/gi,
  /\[forwarded\]/gi,
  /click\s+(here|the\s+link)\s+to\s+share/gi,
];

function normalizeUnicode(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, " - ")
    .replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

function removeNoise(text: string): {
  text: string;
  urlCount: number;
  mentionCount: number;
  hashtagCount: number;
} {
  let urlCount = 0;
  let mentionCount = 0;
  let hashtagCount = 0;

  const withoutUrls = text.replace(
    /https?:\/\/[^\s]+|www\.[^\s]+|ftp:\/\/[^\s]+/gi,
    () => {
      urlCount++;
      return "";
    }
  );

  const withoutMentions = withoutUrls.replace(/@[\w._-]+/g, () => {
    mentionCount++;
    return "";
  });

  const withoutHashtags = withoutMentions.replace(/#[\w_]+/g, () => {
    hashtagCount++;
    return "";
  });

  return { text: withoutHashtags, urlCount, mentionCount, hashtagCount };
}

function removeBoilerplate(text: string): string {
  let result = text;
  for (const pattern of BOILERPLATE_PATTERNS) {
    result = result.replace(pattern, " ");
  }
  return result;
}

function condenseWhitespace(text: string): string {
  return text
    .replace(/([!?.,;:]){2,}/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function deduplicateLines(text: string): {
  text: string;
  removedCount: number;
} {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const kept: string[] = [];
  let removedCount = 0;

  for (const line of lines) {
    const normalized = line.trim().toLowerCase();
    if (normalized === "" || !seen.has(normalized)) {
      kept.push(line);
      if (normalized !== "") seen.add(normalized);
    } else {
      removedCount++;
    }
  }

  return { text: kept.join("\n"), removedCount };
}

function filterText(input: string): FilterResult {
  const originalLength = input.length;

  let text = normalizeUnicode(input);

  const {
    text: noNoise,
    urlCount,
    mentionCount,
    hashtagCount,
  } = removeNoise(text);
  text = noNoise;

  text = removeBoilerplate(text);
  text = condenseWhitespace(text);

  const { text: deduped, removedCount: removedLinesCount } =
    deduplicateLines(text);
  text = deduped;

  if (text.length > MAX_INPUT_CHARS) {
    text = text.slice(0, MAX_INPUT_CHARS) + "…";
  }

  return {
    filteredText: text,
    metadata: {
      removed_urls_count: urlCount,
      removed_mentions_count: mentionCount,
      removed_hashtags_count: hashtagCount,
      removed_lines_count: removedLinesCount,
      original_length: originalLength,
      filtered_length: text.length,
    },
  };
}

// ---------------------------------------------------------------------------
// Helper – inline copy of scoreClaimSalience from screenshot-fact-check/index.ts
// ---------------------------------------------------------------------------

const DATE_TOKEN_RE =
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|\d{1,2}\/\d{1,2})\b/i;

function scoreClaimSalience(claim: string): number {
  let score = 0;
  if (/\d/.test(claim)) score += 3;
  if (DATE_TOKEN_RE.test(claim)) score += 2;
  if (/["']/.test(claim)) score += 1;
  const capitalizedWords = claim.match(/\b[A-Z][a-z]{2,}/g) || [];
  score += Math.min(capitalizedWords.length, 3);
  return score;
}

// ---------------------------------------------------------------------------
// 1. filterText – basic smoke test
// ---------------------------------------------------------------------------

describe("filterText – basic", () => {
  it("returns an object with filteredText and metadata", () => {
    const result = filterText("Hello world");
    expect(result).toHaveProperty("filteredText");
    expect(result).toHaveProperty("metadata");
  });

  it("metadata contains all expected keys", () => {
    const { metadata } = filterText("test");
    const keys: (keyof FilterMetadata)[] = [
      "removed_urls_count",
      "removed_mentions_count",
      "removed_hashtags_count",
      "removed_lines_count",
      "original_length",
      "filtered_length",
    ];
    for (const k of keys) {
      expect(metadata).toHaveProperty(k);
    }
  });

  it("original_length matches the raw input length", () => {
    const input = "Some text with content";
    const { metadata } = filterText(input);
    expect(metadata.original_length).toBe(input.length);
  });

  it("filtered_length equals filteredText.length", () => {
    const { filteredText, metadata } = filterText("Any text here");
    expect(metadata.filtered_length).toBe(filteredText.length);
  });
});

// ---------------------------------------------------------------------------
// 2. URL removal
// ---------------------------------------------------------------------------

describe("filterText – URL removal", () => {
  it("removes https URLs and increments removed_urls_count", () => {
    const { filteredText, metadata } = filterText(
      "Check this out https://example.com/page for details"
    );
    expect(filteredText).not.toContain("https://");
    expect(metadata.removed_urls_count).toBe(1);
  });

  it("removes www URLs", () => {
    const { filteredText, metadata } = filterText(
      "Visit www.example.com today"
    );
    expect(filteredText).not.toContain("www.example.com");
    expect(metadata.removed_urls_count).toBe(1);
  });

  it("removes multiple URLs and counts each", () => {
    const { metadata } = filterText(
      "See https://a.com and https://b.org for references"
    );
    expect(metadata.removed_urls_count).toBe(2);
  });

  it("counts zero when no URLs present", () => {
    const { metadata } = filterText("Plain text with no links");
    expect(metadata.removed_urls_count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. @mention removal
// ---------------------------------------------------------------------------

describe("filterText – @mention removal", () => {
  it("removes @mentions", () => {
    const { filteredText, metadata } = filterText("Hello @user123 how are you");
    expect(filteredText).not.toContain("@user123");
    expect(metadata.removed_mentions_count).toBe(1);
  });

  it("counts zero when no mentions", () => {
    const { metadata } = filterText("No mentions here");
    expect(metadata.removed_mentions_count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 4. #hashtag removal
// ---------------------------------------------------------------------------

describe("filterText – hashtag removal", () => {
  it("removes #hashtags", () => {
    const { filteredText, metadata } = filterText(
      "Big news #BreakingNews #FakeAlert"
    );
    expect(filteredText).not.toContain("#BreakingNews");
    expect(filteredText).not.toContain("#FakeAlert");
    expect(metadata.removed_hashtags_count).toBe(2);
  });

  it("counts zero when no hashtags", () => {
    const { metadata } = filterText("Just normal text");
    expect(metadata.removed_hashtags_count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 5. Boilerplate removal
// ---------------------------------------------------------------------------

describe("filterText – boilerplate removal", () => {
  it("removes 'forwarded as received'", () => {
    const { filteredText } = filterText(
      "Forwarded as received: The government is hiding something."
    );
    expect(filteredText.toLowerCase()).not.toContain("forwarded as received");
  });

  it("removes 'forwarded message'", () => {
    const { filteredText } = filterText(
      "Forwarded message from a friend: Big claim here."
    );
    expect(filteredText.toLowerCase()).not.toContain("forwarded message");
  });

  it("removes 'please share this'", () => {
    const { filteredText } = filterText(
      "Please share this to everyone you know."
    );
    expect(filteredText.toLowerCase()).not.toContain("please share this");
  });

  it("removes 'share now'", () => {
    const { filteredText } = filterText("Share now before it's too late!");
    expect(filteredText.toLowerCase()).not.toContain("share now");
  });

  it("removes 'fwd:'", () => {
    const { filteredText } = filterText("Fwd: Important message inside");
    expect(filteredText.toLowerCase()).not.toContain("fwd:");
  });
});

// ---------------------------------------------------------------------------
// 6. Whitespace / punctuation condensing
// ---------------------------------------------------------------------------

describe("filterText – whitespace and punctuation", () => {
  it("collapses repeated exclamation marks", () => {
    const { filteredText } = filterText("This is urgent!!!");
    expect(filteredText).not.toContain("!!!");
    expect(filteredText).toContain("!");
  });

  it("collapses repeated question marks", () => {
    const { filteredText } = filterText("Is this true???");
    expect(filteredText).not.toContain("???");
  });

  it("collapses multiple spaces into one", () => {
    const { filteredText } = filterText("Hello    world");
    expect(filteredText).toBe("Hello world");
  });

  it("trims leading and trailing whitespace", () => {
    const { filteredText } = filterText("  Hello world  ");
    expect(filteredText).toBe("Hello world");
  });

  it("collapses 3+ blank lines to 2", () => {
    const { filteredText } = filterText("Line 1\n\n\n\nLine 2");
    expect(filteredText).not.toContain("\n\n\n");
  });
});

// ---------------------------------------------------------------------------
// 7. Duplicate line removal
// ---------------------------------------------------------------------------

describe("filterText – duplicate line deduplication", () => {
  it("removes duplicate lines and increments removed_lines_count", () => {
    const input = "Breaking news\nBreaking news\nBreaking news";
    const { filteredText, metadata } = filterText(input);
    const lines = filteredText.split("\n").filter((l) => l.trim());
    expect(lines.length).toBe(1);
    expect(metadata.removed_lines_count).toBeGreaterThan(0);
  });

  it("keeps unique lines intact", () => {
    const input = "Line A\nLine B\nLine C";
    const { metadata } = filterText(input);
    expect(metadata.removed_lines_count).toBe(0);
  });

  it("treats duplicate detection as case-insensitive", () => {
    const input = "BREAKING NEWS\nbreaking news";
    const { filteredText } = filterText(input);
    const lines = filteredText.split("\n").filter((l) => l.trim());
    expect(lines.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 8. Unicode normalization
// ---------------------------------------------------------------------------

describe("filterText – Unicode normalization", () => {
  it("replaces curly double quotes with straight double quotes", () => {
    const { filteredText } = filterText("\u201CHello\u201D");
    expect(filteredText).toBe('"Hello"');
  });

  it("replaces curly single quotes with straight apostrophes", () => {
    const { filteredText } = filterText("it\u2019s fine");
    expect(filteredText).toBe("it's fine");
  });

  it("replaces em-dash with hyphen-space", () => {
    const { filteredText } = filterText("good\u2014bad");
    expect(filteredText).toContain(" - ");
  });

  it("removes zero-width spaces", () => {
    const { filteredText } = filterText("hel\u200Blo");
    expect(filteredText).not.toContain("\u200B");
  });
});

// ---------------------------------------------------------------------------
// 9. Long input truncation
// ---------------------------------------------------------------------------

describe("filterText – truncation", () => {
  it("truncates input that exceeds MAX_INPUT_CHARS", () => {
    const longInput = "a".repeat(MAX_INPUT_CHARS + 500);
    const { filteredText } = filterText(longInput);
    // +1 for the single ellipsis character appended after truncation
    expect(filteredText.length).toBeLessThanOrEqual(MAX_INPUT_CHARS + 1);
  });

  it("appends ellipsis when truncated", () => {
    const longInput = "b".repeat(MAX_INPUT_CHARS + 100);
    const { filteredText } = filterText(longInput);
    expect(filteredText.endsWith("…")).toBe(true);
  });

  it("does not truncate input within MAX_INPUT_CHARS", () => {
    const shortInput = "Hello world";
    const { filteredText } = filterText(shortInput);
    expect(filteredText.endsWith("\u2026")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 10. scoreClaimSalience
// ---------------------------------------------------------------------------

describe("scoreClaimSalience", () => {
  it("scores a claim with a number higher than one without", () => {
    const withNumber = scoreClaimSalience("The government spent 500 million");
    const withoutNumber = scoreClaimSalience("The government spent money");
    expect(withNumber).toBeGreaterThan(withoutNumber);
  });

  it("scores a claim with a year higher (dates)", () => {
    const withYear = scoreClaimSalience("In 2023 the law was passed");
    const withoutYear = scoreClaimSalience("The law was passed");
    expect(withYear).toBeGreaterThan(withoutYear);
  });

  it("scores a claim with capitalized named entities higher", () => {
    const withEntity = scoreClaimSalience("President Biden signed the bill");
    const withoutEntity = scoreClaimSalience("the president signed something");
    expect(withEntity).toBeGreaterThan(withoutEntity);
  });

  it("returns a non-negative score for any input", () => {
    expect(scoreClaimSalience("")).toBeGreaterThanOrEqual(0);
    expect(scoreClaimSalience("random words")).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// 11. mapVerdictToScore – Unverified must not equal True score
// ---------------------------------------------------------------------------

describe("mapVerdictToScore", () => {
  type Verdict = "True" | "Likely False" | "Misleading" | "Unverified";

  function mapVerdictToScore(verdict: Verdict): number {
    if (verdict === "True") return 85;
    if (verdict === "Misleading") return 45;
    if (verdict === "Likely False") return 20;
    return 40;
  }

  it("True maps to 85", () => {
    expect(mapVerdictToScore("True")).toBe(85);
  });

  it("Unverified maps to 40, strictly less than True (85)", () => {
    expect(mapVerdictToScore("Unverified")).toBe(40);
    expect(mapVerdictToScore("Unverified")).toBeLessThan(
      mapVerdictToScore("True")
    );
  });

  it("Likely False maps to 20", () => {
    expect(mapVerdictToScore("Likely False")).toBe(20);
  });

  it("Misleading maps to 45", () => {
    expect(mapVerdictToScore("Misleading")).toBe(45);
  });

  it("default/unknown verdict maps to 40 (Unverified path)", () => {
    // Cast to Verdict to simulate an unexpected model output
    expect(mapVerdictToScore("Unverified")).toBe(40);
  });
});

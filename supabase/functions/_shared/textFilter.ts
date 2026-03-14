/**
 * Text filtration / normalization utility for the TrustVault fact-check pipeline.
 * Runs before any AI model call to clean and condense user input.
 */

export interface FilterMetadata {
  removed_urls_count: number;
  removed_mentions_count: number;
  removed_hashtags_count: number;
  removed_lines_count: number;
  original_length: number;
  filtered_length: number;
}

export interface FilterResult {
  filteredText: string;
  metadata: FilterMetadata;
}

/** Maximum characters to pass downstream; truncate anything longer. */
const MAX_INPUT_CHARS = 8000;

/**
 * Boilerplate phrases found in viral/forwarded messages that add noise
 * but carry no factual content.
 */
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

/**
 * Normalizes Unicode, line-endings, and common typographic substitutions.
 */
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

/**
 * Removes or condenses URLs, @mentions, and #hashtags.
 * Returns the modified text and counts of each removed type.
 */
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

/** Removes known boilerplate phrases from the text. */
function removeBoilerplate(text: string): string {
  let result = text;
  for (const pattern of BOILERPLATE_PATTERNS) {
    result = result.replace(pattern, " ");
  }
  return result;
}

/** Collapses repeated punctuation and excessive whitespace. */
function condenseWhitespace(text: string): string {
  return text
    .replace(/([!?.,;:]){2,}/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Removes duplicate lines (common in copy-pasted viral messages).
 * Returns the deduplicated text and the count of removed duplicate lines.
 */
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

/**
 * Filters and normalizes raw user input before it is passed to any AI model.
 *
 * Steps applied in order:
 * 1. Normalize Unicode, quotes, and line-endings.
 * 2. Remove URLs, @mentions, and #hashtags.
 * 3. Strip known viral/boilerplate phrases.
 * 4. Collapse repeated punctuation and whitespace.
 * 5. Deduplicate identical lines.
 * 6. Truncate to MAX_INPUT_CHARS.
 *
 * @param input - Raw user input (OCR output, pasted text, etc.)
 * @returns `filteredText` ready for the AI pipeline, plus `metadata` about
 *          what was removed (useful for debugging / audit logging).
 */
export function filterText(input: string): FilterResult {
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

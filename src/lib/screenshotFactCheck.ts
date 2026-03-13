const suspiciousPatterns = [
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

export const normalizeExtractedText = (input: string): string => {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
};

export const findSuspiciousPhrases = (text: string): string[] => {
  const found = new Set<string>();
  for (const pattern of suspiciousPatterns) {
    for (const match of text.matchAll(pattern)) {
      if (match[0]) {
        found.add(match[0]);
      }
    }
  }
  return [...found];
};

export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Language Detection & Validation Service
 * Detects language from text and provides language metadata
 */

import { LanguageCode, LANGUAGES, SUPPORTED_LANGUAGES } from '../config/languages';

export interface DetectionResult {
  detectedLanguage: LanguageCode;
  confidence: number; // 0-1
  scriptType: string;
  isSupported: boolean;
  alternatives: Array<{
    language: LanguageCode;
    confidence: number;
  }>;
}

class LanguageDetector {
  /**
   * Unicode ranges for different scripts
   */
  private readonly scriptPatterns = {
    Devanagari: /[\u0900-\u097F]/g,
    Bengali: /[\u0980-\u09FF]/g,
    Gujarati: /[\u0A80-\u0AFF]/g,
    Gurmukhi: /[\u0A00-\u0A7F]/g,
    Kannada: /[\u0C80-\u0CFF]/g,
    Malayalam: /[\u0D00-\u0D7F]/g,
    Oriya: /[\u0B00-\u0B7F]/g,
    Tamil: /[\u0B80-\u0BFF]/g,
    Telugu: /[\u0C00-\u0C7F]/g,
    Latin: /[a-zA-Z]/g,
  };

  /**
   * Common word patterns for language detection
   */
  private readonly languagePatterns: Record<
    LanguageCode,
    { patterns: string[]; weights: number[] }
  > = {
    en: {
      patterns: ['the', 'is', 'are', 'and', 'or', 'a', 'an', 'in', 'on'],
      weights: Array(9).fill(0.8),
    },
    hi: {
      patterns: ['है', 'हैं', 'और', 'का', 'की', 'को', 'में', 'से', 'यह'],
      weights: Array(9).fill(0.85),
    },
    ta: {
      patterns: ['உள்ளது', 'கூறினார்', 'என்று', 'ஆகிய', 'சொல்லினார்', 'வீடு', 'ஆள்'],
      weights: Array(7).fill(0.85),
    },
    te: {
      patterns: ['ఉన్న', 'అని', 'చెప్పారు', 'ఆయన', 'ఆ', 'ఈ', 'ఇవ్వ', 'చేసిన'],
      weights: Array(8).fill(0.85),
    },
    bn: {
      patterns: ['আছে', 'বলেন', 'এবং', 'যা', 'করেছেন', 'রয়েছে', 'বলেছেন'],
      weights: Array(7).fill(0.85),
    },
    mr: {
      patterns: ['आहे', 'म्हणून', 'आणि', 'असे', 'म्हणून', 'या', 'होते'],
      weights: Array(7).fill(0.85),
    },
    gu: {
      patterns: ['છે', 'અને', 'મહત્વપૂર્ણ', 'તે', 'આ', 'જે', 'કહ્યું'],
      weights: Array(7).fill(0.85),
    },
    kn: {
      patterns: ['ಆಗಿದೆ', 'ಮತ್ತು', 'ಎಂದರು', 'ಈ', 'ಅವರು', 'ನಾವು', 'ಹೆಸರು'],
      weights: Array(7).fill(0.85),
    },
    ml: {
      patterns: ['ഉണ്ട്', 'പറയുന്നു', 'അദ്ദേഹം', 'ഇത്', 'ആ', 'വെച്ച്', 'കൊണ്ട്'],
      weights: Array(7).fill(0.85),
    },
    pa: {
      patterns: ['ਹੈ', 'ਅਤੇ', 'ਕਿਹਾ', 'ਉਹ', 'ਇਹ', 'ਤੋਂ', 'ਵਿੱਚ'],
      weights: Array(7).fill(0.85),
    },
  };

  /**
   * Detect language from text using multiple methods
   */
  detectLanguage(text: string): DetectionResult {
    if (!text || text.trim().length === 0) {
      return this.getDefaultDetection();
    }

    // Method 1: Script analysis
    const scriptResult = this.detectByScript(text);

    // Method 2: Pattern matching
    const patternResult = this.detectByPatterns(text);

    // Method 3: Majority voting
    const combined = this.combineResults(scriptResult, patternResult);

    return combined;
  }

  /**
   * Detect language by script analysis
   */
  private detectByScript(text: string): Partial<DetectionResult> {
    const scriptCounts: Record<string, number> = {};
    let totalChars = 0;

    for (const [script, pattern] of Object.entries(this.scriptPatterns)) {
      const matches = text.match(pattern) || [];
      if (matches.length > 0) {
        scriptCounts[script] = matches.length;
        totalChars += matches.length;
      }
    }

    if (totalChars === 0) {
      return { detectedLanguage: 'en', confidence: 0.5 };
    }

    // Map scripts to languages
    const scriptToLanguage: Record<string, LanguageCode[]> = {
      Devanagari: ['hi', 'mr'],
      Bengali: ['bn'],
      Tamil: ['ta'],
      Telugu: ['te'],
      Kannada: ['kn'],
      Malayalam: ['ml'],
      Gujarati: ['gu'],
      Gurmukhi: ['pa'],
      Latin: ['en'],
    };

    const langScores: Record<LanguageCode, number> = {} as Record<
      LanguageCode,
      number
    >;

    for (const [script, count] of Object.entries(scriptCounts)) {
      const langs = scriptToLanguage[script] || [];
      const confidence = count / totalChars;

      for (const lang of langs) {
        langScores[lang] = (langScores[lang] || 0) + confidence;
      }
    }

    const detected = Object.entries(langScores).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return detected ? { detectedLanguage: detected[0] as LanguageCode, confidence: Math.min(detected[1], 1) } : { detectedLanguage: 'en', confidence: 0.5 };
  }

  /**
   * Detect language by pattern matching
   */
  private detectByPatterns(text: string): Partial<DetectionResult> {
    const textLower = text.toLowerCase();
    const langScores: Record<LanguageCode, number> = {} as Record<
      LanguageCode,
      number
    >;

    for (const lang of SUPPORTED_LANGUAGES) {
      const patternData = this.languagePatterns[lang];
      if (!patternData) continue;

      let score = 0;
      for (let i = 0; i < patternData.patterns.length; i++) {
        const pattern = patternData.patterns[i];
        if (textLower.includes(pattern.toLowerCase())) {
          score += patternData.weights[i];
        }
      }

      langScores[lang] = score / patternData.patterns.length;
    }

    const detected = Object.entries(langScores).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return detected ? { detectedLanguage: detected[0] as LanguageCode, confidence: Math.min(detected[1], 1) } : { detectedLanguage: 'en', confidence: 0.3 };
  }

  /**
   * Combine detection results from multiple methods
   */
  private combineResults(
    scriptResult: Partial<DetectionResult>,
    patternResult: Partial<DetectionResult>,
  ): DetectionResult {
    const scriptLang = scriptResult.detectedLanguage || 'en';
    const patternLang = patternResult.detectedLanguage || 'en';
    const scriptConf = scriptResult.confidence || 0;
    const patternConf = patternResult.confidence || 0;

    // Weight script detection higher (more reliable)
    const scriptWeight = 0.6;
    const patternWeight = 0.4;

    const finalLang =
      scriptConf * scriptWeight > patternConf * patternWeight
        ? scriptLang
        : patternLang;
    const finalConfidence =
      scriptConf * scriptWeight + patternConf * patternWeight;

    return {
      detectedLanguage: finalLang as LanguageCode,
      confidence: Math.min(finalConfidence, 1),
      scriptType:
        Object.entries(this.scriptPatterns).find(
          ([, pattern]) => pattern.test(pattern),
        )?.[0] || 'Latin',
      isSupported: SUPPORTED_LANGUAGES.includes(finalLang as LanguageCode),
      alternatives: this.getAlternatives(finalLang as LanguageCode),
    };
  }

  /**
   * Get alternative language suggestions
   */
  private getAlternatives(
    primary: LanguageCode,
  ): Array<{ language: LanguageCode; confidence: number }> {
    return SUPPORTED_LANGUAGES.filter((lang) => lang !== primary)
      .slice(0, 3)
      .map((lang) => ({
        language: lang,
        confidence: Math.random() * 0.3 + 0.1, // Mock confidence
      }));
  }

  /**
   * Get default detection (English)
   */
  private getDefaultDetection(): DetectionResult {
    return {
      detectedLanguage: 'en',
      confidence: 0,
      scriptType: 'Latin',
      isSupported: true,
      alternatives: [],
    };
  }

  /**
   * Validate if text is in expected language
   */
  validateLanguage(
    text: string,
    expectedLanguage: LanguageCode,
  ): { isValid: boolean; confidence: number; reason: string } {
    const detected = this.detectLanguage(text);

    if (detected.detectedLanguage === expectedLanguage) {
      return {
        isValid: true,
        confidence: detected.confidence,
        reason: `Text detected as ${expectedLanguage}`,
      };
    }

    if (detected.confidence < 0.5) {
      return {
        isValid: false,
        confidence: detected.confidence,
        reason: `Low confidence: detected as ${detected.detectedLanguage}`,
      };
    }

    return {
      isValid: false,
      confidence: detected.confidence,
      reason: `Expected ${expectedLanguage}, got ${detected.detectedLanguage}`,
    };
  }
}

export const languageDetector = new LanguageDetector();

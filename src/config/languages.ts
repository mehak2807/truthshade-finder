/**
 * Regional Language Configuration
 * Supports 10+ Indian regional languages with language codes, names, and metadata
 */

export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  speakers: number; // in millions
  rtl: boolean;
  apiSupported: boolean;
  script: string;
}

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Pan-India',
    speakers: 125,
    rtl: false,
    apiSupported: true,
    script: 'Latin',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    region: 'North India',
    speakers: 345,
    rtl: false,
    apiSupported: true,
    script: 'Devanagari',
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'East India',
    speakers: 230,
    rtl: false,
    apiSupported: true,
    script: 'Bengali',
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'South India',
    speakers: 78,
    rtl: false,
    apiSupported: true,
    script: 'Tamil',
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'South India',
    speakers: 74,
    rtl: false,
    apiSupported: true,
    script: 'Telugu',
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'West India',
    speakers: 83,
    rtl: false,
    apiSupported: true,
    script: 'Devanagari',
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'West India',
    speakers: 55,
    rtl: false,
    apiSupported: true,
    script: 'Gujarati',
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'South India',
    speakers: 44,
    rtl: false,
    apiSupported: true,
    script: 'Kannada',
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'South India',
    speakers: 34,
    rtl: false,
    apiSupported: true,
    script: 'Malayalam',
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'North India',
    speakers: 125,
    rtl: false,
    apiSupported: true,
    script: 'Gurmukhi',
  },
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const SUPPORTED_LANGUAGES: LanguageCode[] = Object.keys(
  LANGUAGES,
) as LanguageCode[];

export const LANGUAGE_PRIORITY: LanguageCode[] = [
  'en',
  'hi',
  'ta',
  'te',
  'bn',
  'mr',
  'gu',
  'kn',
  'ml',
  'pa',
];

/**
 * Get language config by code
 */
export function getLanguageConfig(code: string): LanguageConfig | null {
  return LANGUAGES[code as LanguageCode] || null;
}

/**
 * Get all supported language codes
 */
export function getSupportedLanguageCodes(): LanguageCode[] {
  return SUPPORTED_LANGUAGES;
}

/**
 * Format language name with native script
 */
export function formatLanguageName(code: LanguageCode): string {
  const lang = LANGUAGES[code];
  return `${lang.name} (${lang.nativeName})`;
}

/**
 * Get region from language code
 */
export function getRegionFromLanguage(code: LanguageCode): string {
  return LANGUAGES[code]?.region || 'Unknown';
}

/**
 * Regional Misinformation Detection Service
 * Detects misinformation patterns specific to Indian regional languages
 */

import { LanguageCode } from '../config/languages';

export interface RegionalMisinfoCategoryMatch {
  category: string;
  confidence: number;
  keywords: string[];
  pattern: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RegionalMisisinfoDetectionResult {
  language: LanguageCode;
  detectedCategories: RegionalMisinfoCategoryMatch[];
  urgencyScore: number; // 0-1
  forwardBehaviorLikelihood: number; // 0-1
  estimatedRiskLevel: 'low' | 'medium' | 'high';
  suspiciousPhrases: string[];
}

interface RegionalPattern {
  language: LanguageCode;
  urgencyKeywords: string[];
  forwardKeywords: string[];
}

class RegionalMisinformationDetector {
  /**
   * Regional misinformation categories with keywords
   */
  private readonly regionalCategories: Record<
    LanguageCode,
    Record<
      string,
      {
        name: string;
        keywords: string[];
        riskLevel: 'low' | 'medium' | 'high';
      }
    >
  > = {
    en: {
      financial_fraud: {
        name: 'Financial Fraud',
        keywords: [
          'free money',
          'instant success',
          'guaranteed profits',
          'share and win',
          'limited time offer',
        ],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'Banking Phishing',
        keywords: ['verify account', 'update details', 'confirm identity', 'click link'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'Health Misinformation',
        keywords: ['miracle cure', 'doctors confirmed', 'pharmacy conspiracy', 'natural remedy'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'Fake Job',
        keywords: ['no exam', 'high salary', 'home work', 'easy money'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'Panic Rumor',
        keywords: ['curfew', 'lockdown', 'emergency', 'stock essentials'],
        riskLevel: 'high',
      },
    },
    hi: {
      financial_fraud: {
        name: 'वित्तीय धोखाधड़ी',
        keywords: [
          'सरकार',
          'योजना',
          'पैसा',
          'तुरंत',
          'शेयर',
          'जीतें',
          'सभी को',
          'खाता',
        ],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'बैंकिंग फिशिंग',
        keywords: ['खाता', 'सत्यापन', 'जानकारी', 'तुरंत', 'लिंक', 'बंद'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'स्वास्थ्य धोखाधड़ी',
        keywords: ['ईलाज', 'डॉक्टर', 'कहते', 'तीन दिन', 'जड़ी-बूटी'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'नकली नौकरी',
        keywords: ['परीक्षा', 'नहीं', 'वेतन', 'ज्यादा', 'घर', 'काम'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'आतंक अफवाह',
        keywords: ['कर्फ्यू', 'बंद', 'आपातकाल', 'चेतावनी', 'सभी को'],
        riskLevel: 'high',
      },
    },
    ta: {
      financial_fraud: {
        name: 'நிதி欺',
        keywords: ['பணம்', 'தெரியவில்லை', 'இப்போது', 'பகிரவும்', 'வென்று'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'வங்கி கடத்தல்',
        keywords: ['கணக்கு', 'சரிபார்க்க', 'நம்பர்', 'வசூல்'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'ஆரோக்கிய பொய்',
        keywords: ['மருந்து', 'நிরமண', 'கடவுள்', 'குணம்'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'பொய்ப்பணி',
        keywords: ['வேலை', 'விவாத', 'கூலி', 'வக'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'பீதி ஊசல்',
        keywords: ['தடை', 'மூடு', 'வாங்க', 'சேகரம்'],
        riskLevel: 'high',
      },
    },
    te: {
      financial_fraud: {
        name: 'ఆర్థిక చేవర',
        keywords: ['డబ్బు', 'ఆఫర్', 'ఇప్పుడు', 'పంచుకో', 'జైతు'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'బ్యాంకు దొంగ',
        keywords: ['ఖాతా', 'నిర్ధారణ', 'ఎంటర్', 'ఇచ్చు'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'ఆరోగ్య చేవర',
        keywords: ['ఔషధం', 'డాక్టర్', 'సరిపడు', 'చికిత్స'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'నకిలి ఉద్యోగం',
        keywords: ['ఉద్యోగం', 'వేతనం', 'ఆఫర్', 'ఇల్లు'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'భయ ప్రచారం',
        keywords: ['నిషేధం', 'మూసుకో', 'కొనండి', 'సংచయం'],
        riskLevel: 'high',
      },
    },
    bn: {
      financial_fraud: {
        name: 'আর্থিক জালিয়াতি',
        keywords: ['টাকা', 'পাবেন', 'এখনই', 'শেয়ার', 'সবাইকে'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'ব্যাংক ফিশিং',
        keywords: ['অ্যাকাউন্ট', 'যাচাই', 'তথ্য', 'তাৎক্ষণিক'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'স্বাস্থ্য জালিয়াতি',
        keywords: ['ওষুধ', 'সুস্থ', 'ডাক্তার', 'চিকিৎসা'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'জাল চাকরি',
        keywords: ['চাকরি', 'পরীক্ষা', 'বেতন', 'বাড়ি'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'আতঙ্ক রুমর',
        keywords: ['কার্ফিউ', 'বন্ধ', 'জরুরি', 'সংগ্রহ'],
        riskLevel: 'high',
      },
    },
    mr: {
      financial_fraud: {
        name: 'आर्थिक धोखाधडी',
        keywords: ['पैसा', 'मिळेल', 'लगेच', 'शेअर', 'सर्वांना'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'बँक फिशिंग',
        keywords: ['खाता', 'पडताळणी', 'माहिती', 'लगेच'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'आरोग्य धोखाधडी',
        keywords: ['औषध', 'बरा', 'डाक्टर', 'उपचार'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'खोटी नोकरी',
        keywords: ['नोकरी', 'परीक्षा', 'वेतन', 'घर'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'घबराहट',
        keywords: ['कर्फ्यू', 'बंद', 'तरतूद', 'संग्रह'],
        riskLevel: 'high',
      },
    },
    gu: {
      financial_fraud: {
        name: 'આર્થિક ઠગ',
        keywords: ['પૈસા', 'મળશે', 'તરત', 'શેર', 'બધાને'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'બેંક ઠગ',
        keywords: ['ખાતું', 'ચકાસણી', 'માહિતી', 'તરત'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'આરોગ્ય ఠگ',
        keywords: ['દવા', 'સુસ્થ', 'ડૉક્ટર', 'સારવાર'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'ખોટી નોકરી',
        keywords: ['નોકરી', 'પરીક્ષા', 'પગાર', 'ઘર'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'ભય',
        keywords: ['કર્ફ્યૂ', 'બંધ', 'જરૂરી', 'એકત્રણ'],
        riskLevel: 'high',
      },
    },
    kn: {
      financial_fraud: {
        name: 'ಆರ್ಥಿಕ ಮೋಸ',
        keywords: ['ಹಣ', 'ಪಡೆಯಿರಿ', 'ಈಗ', 'ಹಂಚು', 'ಎಲ್ಲರಿಗೆ'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'ಬ್ಯಾಂಕ್ ಮೋಸ',
        keywords: ['ಖಾತೆ', 'ಪರಿಶೀಲಿಸು', 'ಮಾಹಿತಿ', 'ಈಗ'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'ಆರೋಗ್ಯ ಮೋಸ',
        keywords: ['ಔಷಧ', 'ಸುಸ್ಥ', 'ವೈದ್ಯ', 'ಚಿಕಿತ್ಸೆ'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'ನಕಲಿ ಚಾಕರಿ',
        keywords: ['ಚಾಕರಿ', 'ಪರೀಕ್ಷೆ', 'ವೇತನ', 'ಮನೆ'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'ಭೀತಿ ವದಂತಿ',
        keywords: ['ಕರ್ಫ್ಯೂ', 'ಹೊಂದಣೆ', 'ತುರ್ತು', 'ಸಂಗ್ರಹ'],
        riskLevel: 'high',
      },
    },
    ml: {
      financial_fraud: {
        name: 'ആರ്ഥിക വഞ്ചന',
        keywords: ['പണം', 'ലഭിക്കും', 'ഇപ്പോൾ', 'പങ്കുവെയ്വാൻ', 'എല്ലാവരും'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'ബാങ്ക് വഞ്ചന',
        keywords: ['അക്കൗണ്ട്', 'പരിശോധന', 'വിവരം', 'ഐതിഹ്യം'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'ആരോഗ്യ വഞ്ചന',
        keywords: ['മരുന്ന്', 'സുഖം', 'ഡാക്ടർ', 'ചികിത്സ'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'വ്യാജ ജോലി',
        keywords: ['ജോലി', 'പരീക്ഷ', 'വേതനം', 'വീട്'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'ഭയം',
        keywords: ['കർഫിউ', 'അടയ്ക്കുക', 'അടിയന്തരം', 'സവ്ര'],
        riskLevel: 'high',
      },
    },
    pa: {
      financial_fraud: {
        name: 'ਆਰਥਿਕ ਠگ',
        keywords: ['ਪੈਸੇ', 'ਮਿਲਣਗੇ', 'ਹੁਣ', 'ਸਾਝਾ', 'ਸਾਰਿਆਂ'],
        riskLevel: 'high',
      },
      banking_phishing: {
        name: 'ਬੈਂਕ ਠگ',
        keywords: ['ਖਾਤਾ', 'ਜਾਂਚ', 'ਜਾਣਕਾਰੀ', 'ਹੁਣ'],
        riskLevel: 'high',
      },
      health_fraud: {
        name: 'ਸਿਹਤ ਠگ',
        keywords: ['ਦਵਾ', 'ਚੰਗਾ', 'ਡਾਕਟਰ', 'ਇਲਾਜ'],
        riskLevel: 'high',
      },
      fake_job: {
        name: 'ਨਕਲੀ ਨੌਕਰੀ',
        keywords: ['ਨੌਕਰੀ', 'ਪਰੀਖ', 'ਤਨਖਾਹ', 'ਘਰ'],
        riskLevel: 'high',
      },
      panic_rumor: {
        name: 'ਡਰ',
        keywords: ['ਕਰਫਿਊ', 'ਬੰਦ', 'ਜਰੂਰੀ', 'ਜਮਫ'],
        riskLevel: 'high',
      },
    },
  };

  /**
   * Detect regional misinformation patterns
   */
  detectMisinfo(language: LanguageCode, text: string): RegionalMisisinfoDetectionResult {
    const lowerText = text.toLowerCase();
    const categories = this.regionalCategories[language] || this.regionalCategories['en'];

    const detectedCategories: RegionalMisinfoCategoryMatch[] = [];
    const suspiciousPhrases: string[] = [];

    // Check each category
    for (const [catKey, category] of Object.entries(categories)) {
      let matchedKeywords: string[] = [];

      for (const keyword of category.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          matchedKeywords.push(keyword);
          if (!suspiciousPhrases.includes(keyword)) {
            suspiciousPhrases.push(keyword);
          }
        }
      }

      if (matchedKeywords.length > 0) {
        const confidence = Math.min(
          (matchedKeywords.length / category.keywords.length) * 1.2,
          1,
        );
        detectedCategories.push({
          category: category.name,
          confidence,
          keywords: matchedKeywords,
          pattern: catKey,
          riskLevel: category.riskLevel,
        });
      }
    }

    // Calculate urgency and forward behavior scores
    const urgencyScore = this.calculateUrgencyScore(language, text);
    const forwardLikelihood = this.calculateForwardLikelihood(language, text);

    // Determine overall risk
    let estimatedRiskLevel: 'low' | 'medium' | 'high' = 'low';
    if (detectedCategories.length > 0) {
      estimatedRiskLevel = 'high';
    } else if (urgencyScore > 0.6 || forwardLikelihood > 0.6) {
      estimatedRiskLevel = 'medium';
    }

    return {
      language,
      detectedCategories,
      urgencyScore,
      forwardBehaviorLikelihood: forwardLikelihood,
      estimatedRiskLevel,
      suspiciousPhrases,
    };
  }

  /**
   * Calculate urgency score (0-1) based on urgent keywords
   */
  private calculateUrgencyScore(language: LanguageCode, text: string): number {
    const urgencyMap: Record<LanguageCode, string[]> = {
      en: ['urgent', 'immediately', 'emergency', 'now', 'quickly'],
      hi: ['तुरंत', 'जल्दी', 'अभी', 'आपातकालीन'],
      ta: ['உடனடி', 'உடன்'],
      te: ['తక్షణ', 'ఆపద'],
      bn: ['জরুরি', 'এখনই'],
      mr: ['तरुणात', 'लगेच'],
      gu: ['તાત્કાલીક', 'તરત'],
      kn: ['ತಕ್ಷಣ'],
      ml: ['ബദ്ധത'],
      pa: ['ତୂrٹ', 'ཛཱིѐ'],
    };

    const keywords = urgencyMap[language] || urgencyMap['en'];
    let matchCount = 0;

    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    return Math.min(matchCount / keywords.length, 1);
  }

  /**
   * Calculate forward behavior likelihood (0-1)
   */
  private calculateForwardLikelihood(language: LanguageCode, text: string): number {
    const forwardMap: Record<LanguageCode, string[]> = {
      en: [
        'share',
        'forward',
        'send',
        'everyone',
        'all',
        'tell everyone',
        'spread',
      ],
      hi: [
        'शेयर',
        'सभी को',
        'फॉरवर्ड',
        'सबको',
        'फैलाएं',
        'बताएं',
      ],
      ta: ['பகிர்', 'அனுப்பு', 'எல்லாவரையும்'],
      te: ['పంచుకోండి', 'పంపండి'],
      bn: ['শেয়ার', 'সবাইকে', 'পাঠান'],
      mr: ['शेअर', 'सर्वांना'],
      gu: ['શેર', 'પાઠવો'],
      kn: ['ಹಂಚು', 'ಕಳುಹಿಸಿ'],
      ml: ['പങ്കുവെക്കുക', 'അയയ്ക്കുക'],
      pa: ['ਸਾਝਾ', 'ਭੇਜੋ'],
    };

    const keywords = forwardMap[language] || forwardMap['en'];
    let matchCount = 0;

    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    return Math.min(matchCount / keywords.length, 1);
  }

  /**
   * Get category recommendation
   */
  getCategoryRecommendation(category: string, language: LanguageCode): string {
    const recommendations: Record<LanguageCode, Record<string, string>> = {
      en: {
        financial_fraud: 'Do not share. Report to authorities if necessary.',
        banking_phishing: 'This is likely a phishing attempt. Do not click any links.',
        health_fraud: 'Consult official health authorities for medical information.',
        fake_job: 'Verify employment offers through official channels only.',
        panic_rumor: 'Verify with official sources before believing or sharing.',
      },
      hi: {
        financial_fraud: 'शेयर न करें। यदि आवश्यक हो तो प्राधिकारियों को रिपोर्ट करें।',
        banking_phishing: 'यह संभवतः एक फिशिंग प्रयास है। किसी भी लिंक पर क्लिक न करें।',
        health_fraud: 'चिकित्सा सूचना के लिए आधिकारिक स्वास्थ्य प्राधिकारियों से परामर्श लें।',
        fake_job: 'आधिकारिक चैनलों के माध्यम से ही रोजगार की पेशकश सत्यापित करें।',
        panic_rumor: 'विश्वास करने या साझा करने से पहले आधिकारिक स्रोतों से सत्यापित करें।',
      },
      // Similar mappings for other languages
      ta: {},
      te: {},
      bn: {},
      mr: {},
      gu: {},
      kn: {},
      ml: {},
      pa: {},
    };

    return (
      recommendations[language]?.[category] ||
      recommendations['en'][category as keyof typeof recommendations.en] ||
      'Verify with official sources before sharing.'
    );
  }
}

export const regionalMisinformationDetector = new RegionalMisinformationDetector();

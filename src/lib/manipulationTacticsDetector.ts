import type { LanguageCode } from "@/config/languages";

export type ManipulationTacticKey =
  | "fear_bait"
  | "urgency_pressure"
  | "authority_impersonation"
  | "communal_trigger"
  | "emotional_outrage"
  | "fake_scarcity";

export interface ManipulationTacticMatch {
  key: ManipulationTacticKey;
  title: string;
  severity: "medium" | "high";
  score: number;
  description: string;
  matchedSignals: string[];
  educationalTip: string;
}

export interface ManipulationTacticsResult {
  detected: boolean;
  riskLevel: "low" | "medium" | "high";
  score: number;
  tactics: ManipulationTacticMatch[];
  summary: string;
}

interface TacticPattern {
  key: ManipulationTacticKey;
  title: string;
  description: string;
  educationalTip: string;
  threshold: number;
  patterns: Array<{ regex: RegExp; signal: string; score: number }>;
}

export interface ManipulationTacticsUiLabels {
  detectorBadge: string;
  breakdownTitle: string;
  tacticSingular: string;
  tacticPlural: string;
  detectedSuffix: string;
  confidenceMeter: string;
  manipulationRiskLow: string;
  manipulationRiskMedium: string;
  manipulationRiskHigh: string;
  severityLabel: string;
  signalsLabel: string;
  tipLabel: string;
  teachMeButton: string;
  hideLessonButton: string;
  miniLessonTitle: string;
  lessonStep1: string;
  lessonStep2: string;
  lessonStep3: string;
}

const LOCALIZED_TACTIC_TITLES: Record<LanguageCode, Record<ManipulationTacticKey, string>> = {
  en: {
    fear_bait: "Fear Bait",
    urgency_pressure: "Urgency Pressure",
    authority_impersonation: "Authority Impersonation",
    communal_trigger: "Communal Trigger",
    emotional_outrage: "Emotional Outrage",
    fake_scarcity: "Fake Scarcity",
  },
  hi: {
    fear_bait: "डर आधारित उकसावा",
    urgency_pressure: "तुरंत कार्रवाई का दबाव",
    authority_impersonation: "अथॉरिटी की नकली पहचान",
    communal_trigger: "सामुदायिक उकसावा",
    emotional_outrage: "भावनात्मक आक्रोश",
    fake_scarcity: "झूठी कमी का दबाव",
  },
  bn: {
    fear_bait: "ভয় দেখিয়ে প্রভাব",
    urgency_pressure: "তাৎক্ষণিক চাপ",
    authority_impersonation: "কর্তৃপক্ষ সেজে প্রতারণা",
    communal_trigger: "সাম্প্রদায়িক উস্কানি",
    emotional_outrage: "আবেগী ক্ষোভ উস্কানো",
    fake_scarcity: "কৃত্রিম ঘাটতি চাপ",
  },
  ta: {
    fear_bait: "பயத்தை தூண்டும் முறை",
    urgency_pressure: "அவசர அழுத்தம்",
    authority_impersonation: "அதிகாரி போல நடிப்பு",
    communal_trigger: "சமூக உசாவல்",
    emotional_outrage: "உணர்ச்சி கோப தூண்டல்",
    fake_scarcity: "போலி பற்றாக்குறை",
  },
  te: {
    fear_bait: "భయాన్ని ఉపయోగించే మాయ",
    urgency_pressure: "అత్యవసర ఒత్తిడి",
    authority_impersonation: "అధికార వేషధారణ",
    communal_trigger: "సామూహిక ఉద్రిక్తత ప్రేరేపణ",
    emotional_outrage: "భావోద్వేగ ఆగ్రహ ప్రేరేపణ",
    fake_scarcity: "నకిలీ కొరత ఒత్తిడి",
  },
  mr: {
    fear_bait: "भीतीचा वापर",
    urgency_pressure: "तातडीचा दबाव",
    authority_impersonation: "अधिकृततेची बनावट नक्कल",
    communal_trigger: "सामुदायिक चिथावणी",
    emotional_outrage: "भावनिक संताप उकसवणे",
    fake_scarcity: "खोटी टंचाई",
  },
  gu: {
    fear_bait: "ભય આધારિત દબાણ",
    urgency_pressure: "તાત્કાલિક દબાણ",
    authority_impersonation: "સત્તાવાળાની નકલ",
    communal_trigger: "સમુદાયિક ઉશ્કેરણી",
    emotional_outrage: "ભાવનાત્મક આક્રોશ",
    fake_scarcity: "ખોટી અછત",
  },
  kn: {
    fear_bait: "ಭಯ ಆಧಾರಿತ ಪ್ರಭಾವ",
    urgency_pressure: "ತುರ್ತು ಒತ್ತಡ",
    authority_impersonation: "ಅಧಿಕಾರದ ನಕಲಿ ರೂಪ",
    communal_trigger: "ಸಾಮುದಾಯಿಕ ಪ್ರಚೋದನೆ",
    emotional_outrage: "ಭಾವನಾತ್ಮಕ ಕೋಪ ಉದ್ದೀಪನ",
    fake_scarcity: "ನಕಲಿ ಕೊರತೆ",
  },
  ml: {
    fear_bait: "ഭയം ഉപയോഗിച്ച പ്രേരണം",
    urgency_pressure: "അതിവേഗ സമ്മർദ്ദം",
    authority_impersonation: "അധികാര ഭാവന തട്ടിപ്പ്",
    communal_trigger: "സമുദായ പ്രേരണം",
    emotional_outrage: "വികാരാധിഷ്ഠിത പ്രകോപനം",
    fake_scarcity: "കൃത്രിമ ക്ഷാമ സമ്മർദ്ദം",
  },
  pa: {
    fear_bait: "ਡਰ ਆਧਾਰਿਤ ਫਸਾਵਾ",
    urgency_pressure: "ਤੁਰੰਤ ਦਬਾਅ",
    authority_impersonation: "ਅਧਿਕਾਰੀ ਬਣ ਕੇ ਧੋਖਾ",
    communal_trigger: "ਸਾਮੂਹਿਕ ਭੜਕਾਵਾ",
    emotional_outrage: "ਭਾਵਨਾਤਮਕ ਗੁੱਸਾ ਉਕਸਾਉਣਾ",
    fake_scarcity: "ਝੂਠੀ ਘਾਟ ਦਾ ਦਬਾਅ",
  },
};

const LOCALIZED_SUMMARY: Record<
  LanguageCode,
  {
    high: (count: number) => string;
    medium: (count: number) => string;
    lowWithMatch: string;
    none: string;
    noText: string;
  }
> = {
  en: {
    high: (count) => `High manipulation risk detected with ${count} tactic patterns. Treat this content as potentially deceptive.`,
    medium: (count) => `Moderate manipulation risk detected with ${count} tactic patterns. Verify before you trust or forward.`,
    lowWithMatch: "Low-confidence manipulation cues were detected. Stay cautious and verify independently.",
    none: "No strong manipulation tactic pattern detected in this text.",
    noText: "No text provided for manipulation analysis.",
  },
  hi: {
    high: (count) => `उच्च मैनिपुलेशन जोखिम मिला (${count} पैटर्न)। इस सामग्री को संभावित रूप से भ्रामक मानें।`,
    medium: (count) => `मध्यम मैनिपुलेशन जोखिम मिला (${count} पैटर्न)। भरोसा/फॉरवर्ड करने से पहले सत्यापित करें।`,
    lowWithMatch: "कम-विश्वास वाले मैनिपुलेशन संकेत मिले हैं। सतर्क रहें और स्वतंत्र रूप से जांचें।",
    none: "इस टेक्स्ट में मजबूत मैनिपुलेशन पैटर्न नहीं मिला।",
    noText: "मैनिपुलेशन विश्लेषण के लिए कोई टेक्स्ट नहीं दिया गया।",
  },
  bn: {
    high: (count) => `উচ্চ ম্যানিপুলেশন ঝুঁকি ধরা পড়েছে (${count}টি প্যাটার্ন)। এই কনটেন্ট বিভ্রান্তিকর হতে পারে।`,
    medium: (count) => `মাঝারি ম্যানিপুলেশন ঝুঁকি ধরা পড়েছে (${count}টি প্যাটার্ন)। বিশ্বাস/শেয়ার করার আগে যাচাই করুন।`,
    lowWithMatch: "কম-আত্মবিশ্বাসের ম্যানিপুলেশন সংকেত ধরা পড়েছে। সতর্ক থাকুন ও যাচাই করুন।",
    none: "এই টেক্সটে শক্তিশালী ম্যানিপুলেশন প্যাটার্ন পাওয়া যায়নি।",
    noText: "ম্যানিপুলেশন বিশ্লেষণের জন্য কোনো টেক্সট দেওয়া হয়নি।",
  },
  ta: {
    high: (count) => `${count} முறைபாடுகளுடன் அதிக மாயச்செயல் அபாயம் கண்டறியப்பட்டது. இந்த உள்ளடக்கம் தவறாக வழிநடத்தக்கூடும்.`,
    medium: (count) => `${count} முறைபாடுகளுடன் நடுத்தர மாயச்செயல் அபாயம் கண்டறியப்பட்டது. நம்புவதற்கு முன் சரிபார்க்கவும்.`,
    lowWithMatch: "குறைந்த நம்பகத்தன்மை கொண்ட மாயச்செயல் சுட்டுகள் கண்டறியப்பட்டன. எச்சரிக்கையுடன் இருங்கள்.",
    none: "இந்த உரையில் வலுவான மாயச்செயல் முறைபாடு இல்லை.",
    noText: "மாயச்செயல் பகுப்பாய்வுக்கு உரை வழங்கப்படவில்லை.",
  },
  te: {
    high: (count) => `${count} ప్యాటర్న్‌లతో అధిక మానిప్యులేషన్ ప్రమాదం గుర్తించబడింది. ఈ కంటెంట్ తప్పుదారి పట్టించే అవకాశం ఉంది.`,
    medium: (count) => `${count} ప్యాటర్న్‌లతో మధ్యస్థ మానిప్యులేషన్ ప్రమాదం గుర్తించబడింది. నమ్మే ముందు ధృవీకరించండి.`,
    lowWithMatch: "తక్కువ నమ్మకమైన మానిప్యులేషన్ సంకేతాలు గుర్తించబడ్డాయి. జాగ్రత్తగా ఉండండి.",
    none: "ఈ టెక్స్ట్‌లో బలమైన మానిప్యులేషన్ ప్యాటర్న్ కనిపించలేదు.",
    noText: "మానిప్యులేషన్ విశ్లేషణకు టెక్స్ట్ ఇవ్వలేదు.",
  },
  mr: {
    high: (count) => `${count} पॅटर्नसह उच्च मॅनिप्युलेशन धोका आढळला. हा मजकूर दिशाभूल करणारा असू शकतो.`,
    medium: (count) => `${count} पॅटर्नसह मध्यम मॅनिप्युलेशन धोका आढळला. विश्वास ठेवण्यापूर्वी पडताळा.`,
    lowWithMatch: "कमी-विश्वास मॅनिप्युलेशन संकेत आढळले. सावध रहा.",
    none: "या मजकुरात ठोस मॅनिप्युलेशन पॅटर्न आढळला नाही.",
    noText: "मॅनिप्युलेशन विश्लेषणासाठी मजकूर दिलेला नाही.",
  },
  gu: {
    high: (count) => `${count} પેટર્ન સાથે ઊંચો મેનિપ્યુલેશન જોખમ મળ્યો. આ કન્ટેન્ટ ભ્રામક હોઈ શકે છે.`,
    medium: (count) => `${count} પેટર્ન સાથે મધ્યમ મેનિપ્યુલેશન જોખમ મળ્યો. વિશ્વાસ પહેલાં ચકાસો.`,
    lowWithMatch: "ઓછા વિશ્વાસવાળા મેનિપ્યુલેશન સંકેતો મળ્યા. સાવચેત રહો.",
    none: "આ ટેક્સ્ટમાં મજબૂત મેનિપ્યુલેશન પેટર્ન મળ્યો નથી.",
    noText: "મેનિપ્યુલેશન વિશ્લેષણ માટે ટેક્સ્ટ આપવામાં આવ્યો નથી.",
  },
  kn: {
    high: (count) => `${count} ಪ್ಯಾಟರ್ನ್‌ಗಳೊಂದಿಗೆ ಹೆಚ್ಚು ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಅಪಾಯ ಕಂಡುಬಂದಿದೆ. ಈ ವಿಷಯ ದಾರಿ ತಪ್ಪಿಸಬಹುದು.`,
    medium: (count) => `${count} ಪ್ಯಾಟರ್ನ್‌ಗಳೊಂದಿಗೆ ಮಧ್ಯಮ ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಅಪಾಯ ಕಂಡುಬಂದಿದೆ. ನಂಬುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.`,
    lowWithMatch: "ಕಡಿಮೆ ವಿಶ್ವಾಸದ ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಸೂಚನೆಗಳು ಕಂಡುಬಂದಿವೆ. ಎಚ್ಚರಿಕೆಯಿಂದಿರಿ.",
    none: "ಈ ಪಠ್ಯದಲ್ಲಿ ಬಲವಾದ ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಪ್ಯಾಟರ್ನ್ ಕಾಣಿಸಲಿಲ್ಲ.",
    noText: "ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ವಿಶ್ಲೇಷಣೆಗೆ ಪಠ್ಯ ನೀಡಲಾಗಿಲ್ಲ.",
  },
  ml: {
    high: (count) => `${count} പാറ്റേണുകളോടെ ഉയർന്ന മാനിപുലേഷൻ അപകടസാധ്യത കണ്ടെത്തി. ഈ ഉള്ളടക്കം തെറ്റിദ്ധരിപ്പിക്കുന്നതാകാം.`,
    medium: (count) => `${count} പാറ്റേണുകളോടെ ഇടത്തരം മാനിപുലേഷൻ അപകടസാധ്യത കണ്ടെത്തി. വിശ്വസിക്കുന്നതിന് മുമ്പ് പരിശോധിക്കുക.`,
    lowWithMatch: "കുറഞ്ഞ വിശ്വാസമുള്ള മാനിപുലേഷൻ സൂചനകൾ കണ്ടെത്തി. ജാഗ്രത പാലിക്കുക.",
    none: "ഈ ടെക്സ്റ്റിൽ ശക്തമായ മാനിപുലേഷൻ പാറ്റേൺ കണ്ടെത്തിയില്ല.",
    noText: "മാനിപുലേഷൻ വിശകലനത്തിന് ടെക്സ്റ്റ് നൽകിയിട്ടില്ല.",
  },
  pa: {
    high: (count) => `${count} ਪੈਟਰਨ ਨਾਲ ਉੱਚ ਮੈਨਿਪੁਲੇਸ਼ਨ ਜੋਖਮ ਮਿਲਿਆ। ਇਹ ਸਮੱਗਰੀ ਭਰਮਕ ਹੋ ਸਕਦੀ ਹੈ।`,
    medium: (count) => `${count} ਪੈਟਰਨ ਨਾਲ ਦਰਮਿਆਨਾ ਮੈਨਿਪੁਲੇਸ਼ਨ ਜੋਖਮ ਮਿਲਿਆ। ਭਰੋਸੇ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚੋ।`,
    lowWithMatch: "ਘੱਟ-ਭਰੋਸੇ ਵਾਲੇ ਮੈਨਿਪੁਲੇਸ਼ਨ ਸੰਕੇਤ ਮਿਲੇ ਹਨ। ਸਾਵਧਾਨ ਰਹੋ।",
    none: "ਇਸ ਟੈਕਸਟ ਵਿੱਚ ਮਜ਼ਬੂਤ ਮੈਨਿਪੁਲੇਸ਼ਨ ਪੈਟਰਨ ਨਹੀਂ ਮਿਲਿਆ।",
    noText: "ਮੈਨਿਪੁਲੇਸ਼ਨ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਕੋਈ ਟੈਕਸਟ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।",
  },
};

const MANIPULATION_UI_LABELS: Record<LanguageCode, ManipulationTacticsUiLabels> = {
  en: {
    detectorBadge: "Manipulation Tactics Detector",
    breakdownTitle: "Manipulation Tactics Breakdown",
    tacticSingular: "manipulation tactic",
    tacticPlural: "manipulation tactics",
    detectedSuffix: "detected",
    confidenceMeter: "Tactic Confidence Meter",
    manipulationRiskLow: "Low Manipulation Risk",
    manipulationRiskMedium: "Medium Manipulation Risk",
    manipulationRiskHigh: "High Manipulation Risk",
    severityLabel: "Severity",
    signalsLabel: "Signals",
    tipLabel: "Tip",
    teachMeButton: "Teach me this tactic",
    hideLessonButton: "Hide lesson",
    miniLessonTitle: "How to resist this tactic",
    lessonStep1: "Check original source and publication context.",
    lessonStep2: "Cross-verify with at least one trusted source.",
    lessonStep3: "Do not forward until evidence is confirmed.",
  },
  hi: {
    detectorBadge: "मैनिपुलेशन टैक्टिक्स डिटेक्टर",
    breakdownTitle: "मैनिपुलेशन टैक्टिक्स विश्लेषण",
    tacticSingular: "मैनिपुलेशन टैक्टिक",
    tacticPlural: "मैनिपुलेशन टैक्टिक्स",
    detectedSuffix: "मिले",
    confidenceMeter: "टैक्टिक कॉन्फिडेंस मीटर",
    manipulationRiskLow: "कम मैनिपुलेशन जोखिम",
    manipulationRiskMedium: "मध्यम मैनिपुलेशन जोखिम",
    manipulationRiskHigh: "उच्च मैनिपुलेशन जोखिम",
    severityLabel: "गंभीरता",
    signalsLabel: "संकेत",
    tipLabel: "टिप",
    teachMeButton: "यह टैक्टिक समझाएं",
    hideLessonButton: "पाठ छिपाएं",
    miniLessonTitle: "इस टैक्टिक से कैसे बचें",
    lessonStep1: "मूल स्रोत और संदर्भ जांचें।",
    lessonStep2: "कम से कम एक विश्वसनीय स्रोत से क्रॉस-चेक करें।",
    lessonStep3: "सबूत पक्का होने तक फॉरवर्ड न करें।",
  },
  bn: {
    detectorBadge: "ম্যানিপুলেশন ট্যাকটিকস ডিটেক্টর",
    breakdownTitle: "ম্যানিপুলেশন ট্যাকটিকস বিশ্লেষণ",
    tacticSingular: "ম্যানিপুলেশন কৌশল",
    tacticPlural: "ম্যানিপুলেশন কৌশল",
    detectedSuffix: "ধরা পড়েছে",
    confidenceMeter: "ট্যাকটিক কনফিডেন্স মিটার",
    manipulationRiskLow: "কম ম্যানিপুলেশন ঝুঁকি",
    manipulationRiskMedium: "মাঝারি ম্যানিপুলেশন ঝুঁকি",
    manipulationRiskHigh: "উচ্চ ম্যানিপুলেশন ঝুঁকি",
    severityLabel: "তীব্রতা",
    signalsLabel: "সংকেত",
    tipLabel: "টিপ",
    teachMeButton: "এই কৌশল শেখাও",
    hideLessonButton: "পাঠ লুকাও",
    miniLessonTitle: "এই কৌশল থেকে বাঁচার উপায়",
    lessonStep1: "মূল উৎস ও প্রেক্ষাপট যাচাই করুন।",
    lessonStep2: "কমপক্ষে একটি বিশ্বস্ত উৎসে মিলিয়ে দেখুন।",
    lessonStep3: "প্রমাণ না পাওয়া পর্যন্ত ফরওয়ার্ড করবেন না।",
  },
  ta: {
    detectorBadge: "மாயச்செயல் தந்திரம் கண்டுபிடிப்பான்",
    breakdownTitle: "மாயச்செயல் தந்திர விவரம்",
    tacticSingular: "தந்திரம்",
    tacticPlural: "தந்திரங்கள்",
    detectedSuffix: "கண்டறியப்பட்டது",
    confidenceMeter: "தந்திர நம்பிக்கை அளவுகோல்",
    manipulationRiskLow: "குறைந்த மாய அபாயம்",
    manipulationRiskMedium: "நடுத்தர மாய அபாயம்",
    manipulationRiskHigh: "அதிக மாய அபாயம்",
    severityLabel: "தீவிரம்",
    signalsLabel: "சிக்னல்கள்",
    tipLabel: "உதவி குறிப்புகள்",
    teachMeButton: "இந்த தந்திரத்தை கற்பிக்கவும்",
    hideLessonButton: "பாடத்தை மறை",
    miniLessonTitle: "இந்த தந்திரத்திலிருந்து பாதுகாப்பு",
    lessonStep1: "மூல ஆதாரத்தையும் சூழலையும் சரிபார்க்கவும்.",
    lessonStep2: "குறைந்தது ஒரு நம்பகமான ஆதாரத்துடன் ஒப்பிடவும்.",
    lessonStep3: "ஆதாரம் உறுதியாகும் வரை பகிர வேண்டாம்.",
  },
  te: {
    detectorBadge: "మానిప్యులేషన్ టాక్టిక్స్ డిటెక్టర్",
    breakdownTitle: "మానిప్యులేషన్ టాక్టిక్స్ విశ్లేషణ",
    tacticSingular: "టాక్టిక్",
    tacticPlural: "టాక్టిక్స్",
    detectedSuffix: "గుర్తించబడ్డాయి",
    confidenceMeter: "టాక్టిక్ కాన్ఫిడెన్స్ మీటర్",
    manipulationRiskLow: "తక్కువ మానిప్యులేషన్ ప్రమాదం",
    manipulationRiskMedium: "మధ్యస్థ మానిప్యులేషన్ ప్రమాదం",
    manipulationRiskHigh: "అధిక మానిప్యులేషన్ ప్రమాదం",
    severityLabel: "తీవ్రత",
    signalsLabel: "సంకేతాలు",
    tipLabel: "సలహా",
    teachMeButton: "ఈ టాక్టిక్ నేర్పండి",
    hideLessonButton: "పాఠం దాచు",
    miniLessonTitle: "ఈ టాక్టిక్‌ను ఎలా ఎదుర్కోవాలి",
    lessonStep1: "అసలు మూలం మరియు సందర్భాన్ని చెక్ చేయండి.",
    lessonStep2: "కనీసం ఒక నమ్మకమైన మూలంతో పోల్చి చూడండి.",
    lessonStep3: "సాక్ష్యం రాకముందు ఫార్వర్డ్ చేయవద్దు.",
  },
  mr: {
    detectorBadge: "मॅनिप्युलेशन टॅक्टिक्स डिटेक्टर",
    breakdownTitle: "मॅनिप्युलेशन टॅक्टिक्स विश्लेषण",
    tacticSingular: "टॅक्टिक",
    tacticPlural: "टॅक्टिक्स",
    detectedSuffix: "आढळले",
    confidenceMeter: "टॅक्टिक कॉन्फिडन्स मीटर",
    manipulationRiskLow: "कमी मॅनिप्युलेशन धोका",
    manipulationRiskMedium: "मध्यम मॅनिप्युलेशन धोका",
    manipulationRiskHigh: "उच्च मॅनिप्युलेशन धोका",
    severityLabel: "गंभीरता",
    signalsLabel: "संकेत",
    tipLabel: "टीप",
    teachMeButton: "ही टॅक्टिक समजवा",
    hideLessonButton: "पाठ लपवा",
    miniLessonTitle: "या टॅक्टिकपासून बचाव कसा करावा",
    lessonStep1: "मूळ स्रोत आणि संदर्भ तपासा.",
    lessonStep2: "किमान एका विश्वासार्ह स्रोताशी पडताळणी करा.",
    lessonStep3: "पुरावा मिळेपर्यंत फॉरवर्ड करू नका.",
  },
  gu: {
    detectorBadge: "મેનિપ્યુલેશન ટાક્ટિક્સ ડિટેક્ટર",
    breakdownTitle: "મેનિપ્યુલેશન ટાક્ટિક્સ વિશ્લેષણ",
    tacticSingular: "ટાક્ટિક",
    tacticPlural: "ટાક્ટિક્સ",
    detectedSuffix: "મળ્યા",
    confidenceMeter: "ટાક્ટિક કોન્ફિડન્સ મીટર",
    manipulationRiskLow: "ઓછું મેનિપ્યુલેશન જોખમ",
    manipulationRiskMedium: "મધ્યમ મેનિપ્યુલેશન જોખમ",
    manipulationRiskHigh: "ઉચ્ચ મેનિપ્યુલેશન જોખમ",
    severityLabel: "તીવ્રતા",
    signalsLabel: "સંકેતો",
    tipLabel: "ટિપ",
    teachMeButton: "આ ટાક્ટિક શીખવો",
    hideLessonButton: "પાઠ છુપાવો",
    miniLessonTitle: "આ ટાક્ટિક સામે કેવી રીતે બચવું",
    lessonStep1: "મૂળ સ્રોત અને સંદર્ભ તપાસો.",
    lessonStep2: "ઓછામાં ઓછા એક વિશ્વસનીય સ્રોત સાથે ચકાસો.",
    lessonStep3: "પુરાવો મળે ત્યાં સુધી ફોરવર્ડ ન કરો.",
  },
  kn: {
    detectorBadge: "ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಟ್ಯಾಕ್ಟಿಕ್ಸ್ ಡಿಟೆಕ್ಟರ್",
    breakdownTitle: "ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಟ್ಯಾಕ್ಟಿಕ್ಸ್ ವಿಶ್ಲೇಷಣೆ",
    tacticSingular: "ಟ್ಯಾಕ್ಟಿಕ್",
    tacticPlural: "ಟ್ಯಾಕ್ಟಿಕ್ಸ್",
    detectedSuffix: "ಪತ್ತೆಯಾಗಿದೆ",
    confidenceMeter: "ಟ್ಯಾಕ್ಟಿಕ್ ಕಾನ್ಫಿಡೆನ್ಸ್ ಮೀಟರ್",
    manipulationRiskLow: "ಕಡಿಮೆ ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಅಪಾಯ",
    manipulationRiskMedium: "ಮಧ್ಯಮ ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಅಪಾಯ",
    manipulationRiskHigh: "ಹೆಚ್ಚು ಮ್ಯಾನಿಪ್ಯುಲೇಶನ್ ಅಪಾಯ",
    severityLabel: "ತಿೀವ್ರತೆ",
    signalsLabel: "ಸೂಚನೆಗಳು",
    tipLabel: "ಸಲಹೆ",
    teachMeButton: "ಈ ಟ್ಯಾಕ್ಟಿಕ್ ಕಲಿಸಿ",
    hideLessonButton: "ಪಾಠ ಮರೆಮಾಡಿ",
    miniLessonTitle: "ಈ ಟ್ಯಾಕ್ಟಿಕ್‌ನಿಂದ ರಕ್ಷಣೆ",
    lessonStep1: "ಮೂಲ ಮೂಲ ಮತ್ತು ಸಂದರ್ಭ ಪರಿಶೀಲಿಸಿ.",
    lessonStep2: "ಕನಿಷ್ಠ ಒಂದು ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲದೊಂದಿಗೆ ಕ್ರಾಸ್-ಚೆಕ್ ಮಾಡಿ.",
    lessonStep3: "ಸಾಕ್ಷ್ಯ ಖಚಿತವಾಗುವವರೆಗೆ ಫಾರ್ವರ್ಡ್ ಮಾಡಬೇಡಿ.",
  },
  ml: {
    detectorBadge: "മാനിപുലേഷൻ ടാക്റ്റിക്സ് ഡിറ്റക്ടർ",
    breakdownTitle: "മാനിപുലേഷൻ ടാക്റ്റിക്സ് വിശകലനം",
    tacticSingular: "ടാക്റ്റിക്",
    tacticPlural: "ടാക്റ്റിക്സ്",
    detectedSuffix: "കണ്ടെത്തി",
    confidenceMeter: "ടാക്റ്റിക് കോൺഫിഡൻസ് മീറ്റർ",
    manipulationRiskLow: "കുറഞ്ഞ മാനിപുലേഷൻ അപകടം",
    manipulationRiskMedium: "ഇടത്തരം മാനിപുലേഷൻ അപകടം",
    manipulationRiskHigh: "ഉയർന്ന മാനിപുലേഷൻ അപകടം",
    severityLabel: "തീവ്രത",
    signalsLabel: "സിഗ്നലുകൾ",
    tipLabel: "ടിപ്പ്",
    teachMeButton: "ഈ ടാക്റ്റിക് പഠിപ്പിക്കുക",
    hideLessonButton: "പാഠം മറയ്ക്കുക",
    miniLessonTitle: "ഈ ടാക്റ്റിക്കിൽ നിന്ന് എങ്ങനെ സംരക്ഷിക്കാം",
    lessonStep1: "മൂല ഉറവിടവും സാഹചര്യവും പരിശോധിക്കുക.",
    lessonStep2: "കുറഞ്ഞത് ഒരു വിശ്വസനീയ ഉറവിടവുമായി താരതമ്യം ചെയ്യുക.",
    lessonStep3: "തെളിവ് ഉറപ്പാകുന്നതുവരെ ഫോർവേഡ് ചെയ്യരുത്.",
  },
  pa: {
    detectorBadge: "ਮੈਨਿਪੁਲੇਸ਼ਨ ਟੈਕਟਿਕਸ ਡਿਟੈਕਟਰ",
    breakdownTitle: "ਮੈਨਿਪੁਲੇਸ਼ਨ ਟੈਕਟਿਕਸ ਵਿਸ਼ਲੇਸ਼ਣ",
    tacticSingular: "ਟੈਕਟਿਕ",
    tacticPlural: "ਟੈਕਟਿਕਸ",
    detectedSuffix: "ਮਿਲੇ",
    confidenceMeter: "ਟੈਕਟਿਕ ਕਾਨਫਿਡੈਂਸ ਮੀਟਰ",
    manipulationRiskLow: "ਘੱਟ ਮੈਨਿਪੁਲੇਸ਼ਨ ਜੋਖਮ",
    manipulationRiskMedium: "ਦਰਮਿਆਨਾ ਮੈਨਿਪੁਲੇਸ਼ਨ ਜੋਖਮ",
    manipulationRiskHigh: "ਉੱਚ ਮੈਨਿਪੁਲੇਸ਼ਨ ਜੋਖਮ",
    severityLabel: "ਤੀਬਰਤਾ",
    signalsLabel: "ਸੰਕੇਤ",
    tipLabel: "ਸੁਝਾਅ",
    teachMeButton: "ਇਹ ਟੈਕਟਿਕ ਸਿਖਾਓ",
    hideLessonButton: "ਪਾਠ ਲੁਕਾਓ",
    miniLessonTitle: "ਇਸ ਟੈਕਟਿਕ ਤੋਂ ਕਿਵੇਂ ਬਚਣਾ ਹੈ",
    lessonStep1: "ਅਸਲ ਸਰੋਤ ਅਤੇ ਸੰਦਰਭ ਚੈੱਕ ਕਰੋ।",
    lessonStep2: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਭਰੋਸੇਯੋਗ ਸਰੋਤ ਨਾਲ ਤਸਦੀਕ ਕਰੋ।",
    lessonStep3: "ਸਬੂਤ ਪੱਕੇ ਹੋਣ ਤੱਕ ਫਾਰਵਰਡ ਨਾ ਕਰੋ।",
  },
};

const TACTIC_PATTERNS: TacticPattern[] = [
  {
    key: "fear_bait",
    title: "Fear Bait",
    description: "Uses fear-inducing language to force immediate, emotional reaction.",
    educationalTip:
      "Pause and verify the claim from official sources before sharing fear-based messages.",
    threshold: 4,
    patterns: [
      { regex: /danger|threat|deadly|fatal|panic/i, signal: "Fear-loaded words", score: 2 },
      { regex: /your\s*account\s*will\s*be\s*(blocked|closed)/i, signal: "Personal fear trigger", score: 2 },
      { regex: /save\s*your\s*family|protect\s*your\s*kids/i, signal: "Family safety pressure", score: 2 },
    ],
  },
  {
    key: "urgency_pressure",
    title: "Urgency Pressure",
    description: "Creates deadline panic so users act before checking facts.",
    educationalTip:
      "Urgent messages are common scam tactics. Verify first, then act.",
    threshold: 4,
    patterns: [
      { regex: /immediately|urgent|act\s*now|right\s*now/i, signal: "Urgency words", score: 2 },
      { regex: /within\s*(\d+\s*)?(minutes?|hours?)/i, signal: "Artificial deadline", score: 2 },
      { regex: /last\s*chance|final\s*warning/i, signal: "Final warning trigger", score: 2 },
    ],
  },
  {
    key: "authority_impersonation",
    title: "Authority Impersonation",
    description: "Pretends to represent trusted institutions to gain compliance.",
    educationalTip:
      "Always cross-check announcements on official websites or verified handles.",
    threshold: 5,
    patterns: [
      { regex: /rbi|sebi|income\s*tax|police|cyber\s*cell/i, signal: "Institution mention", score: 2 },
      { regex: /official\s*notice|government\s*order/i, signal: "Official notice framing", score: 2 },
      { regex: /verified\s*agent|authorized\s*officer/i, signal: "Authority role claim", score: 2 },
      { regex: /your\s*kyc\s*has\s*expired/i, signal: "Compliance intimidation", score: 2 },
    ],
  },
  {
    key: "communal_trigger",
    title: "Communal Trigger",
    description: "Attempts to inflame group identity, religion, or regional hostility.",
    educationalTip:
      "Treat identity-targeted claims carefully and verify with neutral primary sources.",
    threshold: 4,
    patterns: [
      { regex: /religion|community|caste|ethnic/i, signal: "Identity framing", score: 2 },
      { regex: /they\s*are\s*coming\s*for\s*us|attack\s*on\s*our\s*people/i, signal: "Group threat framing", score: 2 },
      { regex: /boycott|revenge|retaliate/i, signal: "Collective action incitement", score: 2 },
    ],
  },
  {
    key: "emotional_outrage",
    title: "Emotional Outrage",
    description: "Uses outrage and anger language to bypass critical thinking.",
    educationalTip:
      "If a post makes you angry instantly, pause and verify before forwarding.",
    threshold: 4,
    patterns: [
      { regex: /shocking|disgusting|unbelievable|outrage/i, signal: "Outrage vocabulary", score: 2 },
      { regex: /!!!|\?\?\?/i, signal: "Excessive punctuation", score: 1 },
      { regex: /share\s*this\s*now|everyone\s*must\s*see\s*this/i, signal: "Viral outrage push", score: 2 },
      { regex: /traitor|corrupt\s*media|sold\s*out/i, signal: "Polarizing blame language", score: 2 },
    ],
  },
  {
    key: "fake_scarcity",
    title: "Fake Scarcity",
    description: "Manufactures scarcity to force rushed decisions.",
    educationalTip:
      "Scarcity claims should be verified through official channels before taking action.",
    threshold: 4,
    patterns: [
      { regex: /limited\s*slots|few\s*left|only\s*today/i, signal: "Limited availability claim", score: 2 },
      { regex: /offer\s*ends\s*soon|expires\s*tonight/i, signal: "Expiring offer pressure", score: 2 },
      { regex: /stock\s*ending|shortage\s*alert/i, signal: "Supply panic framing", score: 2 },
    ],
  },
];

const getRiskLevel = (score: number): ManipulationTacticsResult["riskLevel"] => {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
};

const buildSummary = (
  riskLevel: ManipulationTacticsResult["riskLevel"],
  tacticCount: number,
  language: LanguageCode,
): string => {
  const summary = LOCALIZED_SUMMARY[language] || LOCALIZED_SUMMARY.en;
  if (riskLevel === "high") {
    return summary.high(tacticCount);
  }
  if (riskLevel === "medium") {
    return summary.medium(tacticCount);
  }
  if (tacticCount > 0) {
    return summary.lowWithMatch;
  }
  return summary.none;
};

export const getManipulationTacticsUiLabels = (
  language: LanguageCode,
): ManipulationTacticsUiLabels => {
  return MANIPULATION_UI_LABELS[language] || MANIPULATION_UI_LABELS.en;
};

export const detectManipulationTactics = (
  text: string,
  language: LanguageCode = "en",
): ManipulationTacticsResult => {
  const summary = LOCALIZED_SUMMARY[language] || LOCALIZED_SUMMARY.en;
  const tacticTitles = LOCALIZED_TACTIC_TITLES[language] || LOCALIZED_TACTIC_TITLES.en;
  const normalized = text.trim();
  if (!normalized) {
    return {
      detected: false,
      riskLevel: "low",
      score: 0,
      tactics: [],
      summary: summary.noText,
    };
  }

  const matches: ManipulationTacticMatch[] = [];

  for (const tactic of TACTIC_PATTERNS) {
    let score = 0;
    const matchedSignals: string[] = [];

    for (const pattern of tactic.patterns) {
      if (pattern.regex.test(normalized)) {
        score += pattern.score;
        matchedSignals.push(pattern.signal);
      }
    }

    if (score >= tactic.threshold) {
      matches.push({
        key: tactic.key,
        title: tacticTitles[tactic.key],
        severity: score >= tactic.threshold + 2 ? "high" : "medium",
        score,
        description: tactic.description,
        matchedSignals,
        educationalTip: tactic.educationalTip,
      });
    }
  }

  const topScore = matches.reduce((max, current) => Math.max(max, current.score), 0);
  const riskLevel = getRiskLevel(topScore);

  return {
    detected: matches.length > 0,
    riskLevel,
    score: topScore,
    tactics: matches,
    summary: buildSummary(riskLevel, matches.length, language),
  };
};

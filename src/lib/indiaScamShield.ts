import type { LanguageCode } from "@/config/languages";

export type ScamCategory =
  | "upi_refund"
  | "kyc_panic"
  | "fake_job"
  | "investment_trap";

export interface ScamSignalMatch {
  category: ScamCategory;
  title: string;
  confidence: "medium" | "high";
  score: number;
  matchedSignals: string[];
  immediateActions: string[];
}

export interface IndiaScamShieldResult {
  detected: boolean;
  riskLevel: "low" | "medium" | "high";
  score: number;
  matches: ScamSignalMatch[];
  urgentActions: string[];
  advisory: string;
}

interface ScamPatternDefinition {
  category: ScamCategory;
  title: string;
  keywords: Array<{ regex: RegExp; signal: string; score: number }>;
  threshold: number;
  immediateActions: string[];
}

type RiskLevel = IndiaScamShieldResult["riskLevel"];

interface LocalizedScamCopy {
  titles: Record<ScamCategory, string>;
  advisories: {
    high: string;
    medium: string;
    lowWithMatch: string;
    none: string;
    noText: string;
  };
  actions: Record<ScamCategory, string[]>;
}

export interface IndiaScamShieldUiLabels {
  modeBadge: string;
  modeHeading: string;
  potentialPatternDetected: string;
  scamRiskLow: string;
  scamRiskMedium: string;
  scamRiskHigh: string;
  call1930: string;
  reportOnline: string;
  blockSender: string;
  blockSenderHint: string;
  verdictTitle: string;
  emergencyReport: string;
  fileCyberComplaint: string;
  confidence: string;
}

const LOCALIZED_SCAM_COPY: Record<LanguageCode, LocalizedScamCopy> = {
  en: {
    titles: {
      upi_refund: "UPI Refund / Payment Reversal Scam",
      kyc_panic: "KYC Panic / Account Freeze Scam",
      fake_job: "Fake Job Offer / Task Scam",
      investment_trap: "Investment Trap / Guaranteed Return Fraud",
    },
    advisories: {
      high:
        "High-risk scam patterns detected. Stop interaction, do not click links, and report immediately.",
      medium:
        "Suspicious fraud signals detected. Verify using official channels before taking any action.",
      lowWithMatch:
        "Low-confidence scam indicators detected. Stay cautious and independently verify claims.",
      none: "No strong India-specific scam pattern detected in this content.",
      noText: "No text provided for scam screening.",
    },
    actions: {
      upi_refund: [
        "Do not click payment or refund links.",
        "Never share UPI PIN, OTP, CVV, or screen-share access.",
        "Block the sender and report financial fraud at 1930 immediately.",
      ],
      kyc_panic: [
        "Do not open KYC links from SMS/WhatsApp forwards.",
        "Verify account status only from official bank app or website.",
        "Report suspicious financial messages to 1930 and cybercrime.gov.in.",
      ],
      fake_job: [
        "Do not pay registration or document fees.",
        "Do not share Aadhaar, PAN, or bank details over chat.",
        "Verify recruiter/company on official website and LinkedIn.",
      ],
      investment_trap: [
        "Do not transfer funds based on guaranteed-return claims.",
        "Check if the platform is SEBI-registered before investing.",
        "Preserve chats/screenshots and report to 1930 if money was requested.",
      ],
    },
  },
  hi: {
    titles: {
      upi_refund: "यूपीआई रिफंड / पेमेंट रिवर्सल धोखाधड़ी",
      kyc_panic: "केवाईसी पैनिक / अकाउंट फ्रीज धोखाधड़ी",
      fake_job: "फर्जी जॉब ऑफर / टास्क स्कैम",
      investment_trap: "इन्वेस्टमेंट ट्रैप / गारंटीड रिटर्न फ्रॉड",
    },
    advisories: {
      high:
        "उच्च जोखिम वाला धोखाधड़ी पैटर्न मिला है। तुरंत बातचीत रोकें, लिंक पर क्लिक न करें और तुरंत रिपोर्ट करें।",
      medium:
        "संदिग्ध फ्रॉड संकेत मिले हैं। कोई भी कार्रवाई करने से पहले केवल आधिकारिक स्रोत से सत्यापन करें।",
      lowWithMatch:
        "कम-विश्वास वाले धोखाधड़ी संकेत मिले हैं। सतर्क रहें और दावे को स्वतंत्र रूप से जांचें।",
      none: "इस सामग्री में भारत-विशिष्ट मजबूत स्कैम पैटर्न नहीं मिला।",
      noText: "स्कैम जांच के लिए कोई टेक्स्ट नहीं दिया गया।",
    },
    actions: {
      upi_refund: [
        "पेमेंट या रिफंड लिंक पर क्लिक न करें।",
        "UPI PIN, OTP, CVV या स्क्रीन-शेयर एक्सेस कभी साझा न करें।",
        "सेंडर को ब्लॉक करें और 1930 पर तुरंत वित्तीय फ्रॉड रिपोर्ट करें।",
      ],
      kyc_panic: [
        "SMS/WhatsApp के KYC लिंक न खोलें।",
        "अकाउंट स्टेटस केवल बैंक के आधिकारिक ऐप/वेबसाइट पर जांचें।",
        "संदिग्ध संदेश 1930 और cybercrime.gov.in पर रिपोर्ट करें।",
      ],
      fake_job: [
        "रजिस्ट्रेशन या डॉक्यूमेंट फीस न दें।",
        "आधार, PAN या बैंक डिटेल्स चैट में साझा न करें।",
        "रिक्रूटर/कंपनी को आधिकारिक वेबसाइट और LinkedIn पर सत्यापित करें।",
      ],
      investment_trap: [
        "गारंटीड रिटर्न वाले दावों पर पैसे ट्रांसफर न करें।",
        "निवेश से पहले देखें कि प्लेटफॉर्म SEBI-रजिस्टर्ड है या नहीं।",
        "चैट/स्क्रीनशॉट सुरक्षित रखें और 1930 पर रिपोर्ट करें।",
      ],
    },
  },
  bn: {
    titles: {
      upi_refund: "UPI রিফান্ড / পেমেন্ট রিভার্সাল প্রতারণা",
      kyc_panic: "KYC প্যানিক / অ্যাকাউন্ট ফ্রিজ প্রতারণা",
      fake_job: "ভুয়া চাকরির অফার / টাস্ক স্ক্যাম",
      investment_trap: "বিনিয়োগ ফাঁদ / গ্যারান্টিযুক্ত রিটার্ন জালিয়াতি",
    },
    advisories: {
      high:
        "উচ্চ ঝুঁকির প্রতারণার প্যাটার্ন ধরা পড়েছে। যোগাযোগ বন্ধ করুন, লিঙ্কে ক্লিক করবেন না এবং সঙ্গে সঙ্গে রিপোর্ট করুন।",
      medium:
        "সন্দেহজনক প্রতারণার সংকেত পাওয়া গেছে। কোনো পদক্ষেপের আগে শুধুমাত্র অফিসিয়াল উৎসে যাচাই করুন।",
      lowWithMatch:
        "কম-আত্মবিশ্বাসের স্ক্যাম সংকেত পাওয়া গেছে। সতর্ক থাকুন এবং স্বাধীনভাবে যাচাই করুন।",
      none: "এই কনটেন্টে শক্তিশালী ভারত-নির্দিষ্ট স্ক্যাম প্যাটার্ন পাওয়া যায়নি।",
      noText: "স্ক্যাম স্ক্রিনিংয়ের জন্য কোনো টেক্সট দেওয়া হয়নি।",
    },
    actions: {
      upi_refund: [
        "পেমেন্ট বা রিফান্ড লিঙ্কে ক্লিক করবেন না।",
        "UPI PIN, OTP, CVV বা স্ক্রিন-শেয়ার অ্যাক্সেস কখনও শেয়ার করবেন না।",
        "প্রেরককে ব্লক করুন এবং ১৯৩০-এ আর্থিক প্রতারণা রিপোর্ট করুন।",
      ],
      kyc_panic: [
        "SMS/WhatsApp থেকে KYC লিঙ্ক খুলবেন না।",
        "অ্যাকাউন্ট স্ট্যাটাস শুধু অফিসিয়াল ব্যাংক অ্যাপ/ওয়েবসাইটে যাচাই করুন।",
        "সন্দেহজনক বার্তা ১৯৩০ এবং cybercrime.gov.in-এ রিপোর্ট করুন।",
      ],
      fake_job: [
        "রেজিস্ট্রেশন বা ডকুমেন্ট ফি দেবেন না।",
        "আধার, PAN বা ব্যাংক তথ্য চ্যাটে শেয়ার করবেন না।",
        "রিক্রুটার/কোম্পানি অফিসিয়াল ওয়েবসাইট ও LinkedIn-এ যাচাই করুন।",
      ],
      investment_trap: [
        "গ্যারান্টিযুক্ত রিটার্ন দাবিতে টাকা পাঠাবেন না।",
        "বিনিয়োগের আগে প্ল্যাটফর্ম SEBI-নিবন্ধিত কি না যাচাই করুন।",
        "চ্যাট/স্ক্রিনশট সংরক্ষণ করে ১৯৩০-এ রিপোর্ট করুন।",
      ],
    },
  },
  ta: {
    titles: {
      upi_refund: "UPI ரீஃபண்ட் / பேமென்ட் ரிவர்சல் மோசடி",
      kyc_panic: "KYC அவசர / கணக்கு முடக்கம் மோசடி",
      fake_job: "போலி வேலை வாய்ப்பு / டாஸ்க் மோசடி",
      investment_trap: "முதலீட்டு கண்ணி / உறுதி வருமான மோசடி",
    },
    advisories: {
      high:
        "அதிக ஆபத்தான மோசடி முறை கண்டறியப்பட்டது. உடனே தொடர்பை நிறுத்துங்கள், இணைப்பை கிளிக் செய்யாதீர்கள், உடனே புகார் செய்யுங்கள்.",
      medium:
        "சந்தேகமான மோசடி சிக்னல்கள் உள்ளன. எந்த நடவடிக்கைக்கும் முன் அதிகாரப்பூர்வ சேனலில் சரிபார்க்கவும்.",
      lowWithMatch:
        "குறைந்த நம்பகத் தன்மையுள்ள மோசடி சிக்னல்கள் கண்டறியப்பட்டன. எச்சரிக்கையுடன் இருந்து தனியாக உறுதிப்படுத்தவும்.",
      none: "இந்த உள்ளடக்கத்தில் வலுவான இந்திய மோசடி முறை காணப்படவில்லை.",
      noText: "மோசடி ஆய்வுக்கு உரை வழங்கப்படவில்லை.",
    },
    actions: {
      upi_refund: [
        "பணம்/ரீஃபண்ட் இணைப்புகளை கிளிக் செய்யாதீர்கள்.",
        "UPI PIN, OTP, CVV அல்லது ஸ்க்ரீன் ஷேர் அணுகலை பகிர வேண்டாம்.",
        "அனுப்புநரை பிளாக் செய்து 1930-க்கு உடனே புகார் செய்யுங்கள்.",
      ],
      kyc_panic: [
        "SMS/WhatsApp KYC இணைப்புகளைத் திறக்காதீர்கள்.",
        "கணக்கு நிலையை வங்கியின் அதிகாரப்பூர்வ app/website-ல் மட்டும் சரிபார்க்கவும்.",
        "சந்தேகமான செய்திகளை 1930 மற்றும் cybercrime.gov.in-ல் புகார் செய்யவும்.",
      ],
      fake_job: [
        "ரெஜிஸ்ட்ரேஷன் அல்லது டாக்குமெண்ட் கட்டணம் செலுத்த வேண்டாம்.",
        "ஆதார், PAN, வங்கி விவரங்களை சாட்டில் பகிர வேண்டாம்.",
        "நிறுவனம்/ரிக்ரூட்டரை அதிகாரப்பூர்வ தளமும் LinkedIn-மும் மூலம் சரிபார்க்கவும்.",
      ],
      investment_trap: [
        "உறுதி வருமானம் என்ற பெயரில் பணம் மாற்ற வேண்டாம்.",
        "முதலீட்டுக்கு முன் தளம் SEBI பதிவு செய்யப்பட்டதா என பார்க்கவும்.",
        "சாட்/ஸ்கிரீன்ஷாட்களை சேமித்து 1930-க்கு புகார் செய்யவும்.",
      ],
    },
  },
  te: {
    titles: {
      upi_refund: "UPI రీఫండ్ / చెల్లింపు రివర్సల్ మోసం",
      kyc_panic: "KYC అత్యవసర / ఖాతా ఫ్రీజ్ మోసం",
      fake_job: "నకిలీ ఉద్యోగ ఆఫర్ / టాస్క్ స్కామ్",
      investment_trap: "ఇన్వెస్ట్‌మెంట్ ట్రాప్ / గ్యారంటీ రిటర్న్ మోసం",
    },
    advisories: {
      high:
        "అధిక ప్రమాద మోసం సంకేతాలు కనుగొనబడ్డాయి. వెంటనే సంభాషణ ఆపండి, లింక్‌లపై క్లిక్ చేయకండి, వెంటనే రిపోర్ట్ చేయండి.",
      medium:
        "సందేహాస్పద మోసం సంకేతాలు ఉన్నాయి. ఏ చర్యకైనా ముందు అధికారిక వనరుల ద్వారా ధృవీకరించండి.",
      lowWithMatch:
        "తక్కువ నమ్మకంతో మోసం సంకేతాలు కనిపించాయి. జాగ్రత్తగా ఉండి స్వతంత్రంగా ధృవీకరించండి.",
      none: "ఈ కంటెంట్‌లో బలమైన భారత్-స్పెసిఫిక్ స్కామ్ ప్యాటర్న్ కనిపించలేదు.",
      noText: "స్కామ్ స్క్రీనింగ్ కోసం టెక్స్ట్ ఇవ్వలేదు.",
    },
    actions: {
      upi_refund: [
        "పేమెంట్/రీఫండ్ లింక్‌లను క్లిక్ చేయకండి.",
        "UPI PIN, OTP, CVV లేదా స్క్రీన్-షేర్ యాక్సెస్ ఎప్పుడూ పంచుకోవద్దు.",
        "పంపిన వారిని బ్లాక్ చేసి 1930కి వెంటనే ఫిర్యాదు చేయండి.",
      ],
      kyc_panic: [
        "SMS/WhatsAppలోని KYC లింక్‌లను ఓపెన్ చేయకండి.",
        "ఖాతా స్థితిని అధికారిక బ్యాంక్ app/websiteలో మాత్రమే చెక్ చేయండి.",
        "సందేహాస్పద సందేశాలను 1930 మరియు cybercrime.gov.inలో రిపోర్ట్ చేయండి.",
      ],
      fake_job: [
        "రిజిస్ట్రేషన్ లేదా డాక్యుమెంట్ ఫీజులు చెల్లించకండి.",
        "ఆధార్, PAN, బ్యాంక్ వివరాలను చాట్‌లో పంచుకోవద్దు.",
        "రిక్రూటర్/కంపెనీని అధికారిక వెబ్‌సైట్ మరియు LinkedInలో ధృవీకరించండి.",
      ],
      investment_trap: [
        "గ్యారంటీ రిటర్న్ క్లెయిమ్‌లపై డబ్బు పంపకండి.",
        "ఇన్వెస్ట్ చేయడానికి ముందు ప్లాట్‌ఫామ్ SEBI రిజిస్టర్ అయ్యిందో లేదో చెక్ చేయండి.",
        "చాట్లు/స్క్రీన్‌షాట్‌లు సేవ్ చేసి 1930కి రిపోర్ట్ చేయండి.",
      ],
    },
  },
  mr: {
    titles: {
      upi_refund: "UPI रिफंड / पेमेंट रिव्हर्सल फसवणूक",
      kyc_panic: "KYC पॅनिक / अकाउंट फ्रीझ फसवणूक",
      fake_job: "बनावट जॉब ऑफर / टास्क स्कॅम",
      investment_trap: "इन्व्हेस्टमेंट ट्रॅप / हमी परतावा फसवणूक",
    },
    advisories: {
      high:
        "उच्च-जोखीम फसवणुकीचे संकेत आढळले. त्वरित संवाद थांबवा, लिंकवर क्लिक करू नका आणि लगेच तक्रार करा.",
      medium:
        "संशयास्पद फसवणुकीचे संकेत आढळले. कोणतीही कृती करण्यापूर्वी अधिकृत माध्यमातून पडताळणी करा.",
      lowWithMatch:
        "कमी-विश्वास फसवणूक संकेत सापडले. सावध रहा आणि स्वतंत्र पडताळणी करा.",
      none: "या मजकुरात ठोस भारत-विशिष्ट स्कॅम पॅटर्न आढळला नाही.",
      noText: "स्कॅम तपासणीसाठी मजकूर दिलेला नाही.",
    },
    actions: {
      upi_refund: [
        "पेमेंट किंवा रिफंड लिंकवर क्लिक करू नका.",
        "UPI PIN, OTP, CVV किंवा स्क्रीन-शेअर प्रवेश कधीही शेअर करू नका.",
        "प्रेषकाला ब्लॉक करा आणि 1930 वर त्वरित तक्रार करा.",
      ],
      kyc_panic: [
        "SMS/WhatsApp मधील KYC लिंक उघडू नका.",
        "अकाउंट स्थिती फक्त अधिकृत बँक app/website वर तपासा.",
        "संशयास्पद संदेश 1930 आणि cybercrime.gov.in वर नोंदवा.",
      ],
      fake_job: [
        "नोंदणी किंवा कागदपत्र शुल्क भरू नका.",
        "आधार, PAN किंवा बँक तपशील चॅटमध्ये शेअर करू नका.",
        "रिक्रूटर/कंपनी अधिकृत वेबसाइट आणि LinkedIn वर पडताळा.",
      ],
      investment_trap: [
        "हमी परताव्याच्या दाव्यांवर पैसे ट्रान्सफर करू नका.",
        "गुंतवणुकीपूर्वी प्लॅटफॉर्म SEBI नोंदणीकृत आहे का तपासा.",
        "चॅट/स्क्रीनशॉट जतन करा आणि 1930 वर तक्रार करा.",
      ],
    },
  },
  gu: {
    titles: {
      upi_refund: "UPI રિફંડ / પેમેન્ટ રિવર્સલ સ્કેમ",
      kyc_panic: "KYC પેનિક / એકાઉન્ટ ફ્રીઝ સ્કેમ",
      fake_job: "નકલી જોબ ઓફર / ટાસ્ક સ્કેમ",
      investment_trap: "ઇન્વેસ્ટમેન્ટ ટ્રેપ / ગેરંટી રિટર્ન છેતરપિંડી",
    },
    advisories: {
      high:
        "ઉચ્ચ જોખમવાળો સ્કેમ પેટર્ન મળ્યો છે. તરત સંપર્ક બંધ કરો, લિંક પર ક્લિક ન કરો અને તરત રિપોર્ટ કરો.",
      medium:
        "શંકાસ્પદ છેતરપિંડી સંકેતો મળ્યા છે. કોઈ કાર્યવાહી પહેલાં ઓફિશિયલ ચેનલથી ચકાસો.",
      lowWithMatch:
        "ઓછા વિશ્વાસવાળા સ્કેમ સંકેતો મળ્યા છે. સાવચેત રહો અને સ્વતંત્ર રીતે ચકાસણી કરો.",
      none: "આ કન્ટેન્ટમાં મજબૂત ભારત-વિશિષ્ટ સ્કેમ પેટર્ન મળ્યો નથી.",
      noText: "સ્કેમ સ્ક્રીનિંગ માટે કોઈ ટેક્સ્ટ આપવામાં આવ્યું નથી.",
    },
    actions: {
      upi_refund: [
        "પેમેન્ટ અથવા રિફંડ લિંક પર ક્લિક ન કરો.",
        "UPI PIN, OTP, CVV અથવા સ્ક્રીન-શેર એક્સેસ ક્યારેય શેર ન કરો.",
        "મોકલનારને બ્લોક કરો અને 1930 પર તરત રિપોર્ટ કરો.",
      ],
      kyc_panic: [
        "SMS/WhatsAppના KYC લિંક ન ખોલો.",
        "એકાઉન્ટ સ્થિતિ ફક્ત ઓફિશિયલ બેંક app/website પર તપાસો.",
        "શંકાસ્પદ મેસેજ 1930 અને cybercrime.gov.in પર રિપોર્ટ કરો.",
      ],
      fake_job: [
        "રજીસ્ટ્રેશન અથવા દસ્તાવેજ ફી ચૂકવો નહીં.",
        "આધાર, PAN અથવા બેંક વિગતો ચેટમાં શેર ન કરો.",
        "રિક્રૂટર/કંપનીને ઓફિશિયલ વેબસાઇટ અને LinkedIn પર ચકાસો.",
      ],
      investment_trap: [
        "ગેરંટી રિટર્ન દાવા પર પૈસા ટ્રાન્સફર ન કરો.",
        "રોકાણ પહેલાં પ્લેટફોર્મ SEBI-રજિસ્ટર્ડ છે કે નહીં તે ચકાસો.",
        "ચેટ/સ્ક્રીનશોટ સાચવો અને 1930 પર રિપોર્ટ કરો.",
      ],
    },
  },
  kn: {
    titles: {
      upi_refund: "UPI ರಿಫಂಡ್ / ಪಾವತಿ ರಿವರ್ಸಲ್ ವಂಚನೆ",
      kyc_panic: "KYC ಪ್ಯಾನಿಕ್ / ಖಾತೆ ಫ್ರೀಜ್ ವಂಚನೆ",
      fake_job: "ನಕಲಿ ಉದ್ಯೋಗ ಆಫರ್ / ಟಾಸ್ಕ್ ಸ್ಕ್ಯಾಮ್",
      investment_trap: "ಹೂಡಿಕೆ ಬಲೆ / ಗ್ಯಾರಂಟೀ ರಿಟರ್ನ್ ವಂಚನೆ",
    },
    advisories: {
      high:
        "ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಂಚನೆ ಮಾದರಿ ಪತ್ತೆಯಾಗಿದೆ. ತಕ್ಷಣ ಸಂಪರ್ಕ ನಿಲ್ಲಿಸಿ, ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಮತ್ತು ಕೂಡಲೆ ವರದಿ ಮಾಡಿ.",
      medium:
        "ಸಂದೇಹಾಸ್ಪದ ವಂಚನೆ ಸಂಕೇತಗಳು ಕಂಡುಬಂದಿವೆ. ಯಾವುದೇ ಕ್ರಮಕ್ಕೂ ಮುಂಚೆ ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ.",
      lowWithMatch:
        "ಕಡಿಮೆ ವಿಶ್ವಾಸದ ವಂಚನೆ ಸಂಕೇತಗಳು ಕಂಡುಬಂದಿವೆ. ಎಚ್ಚರಿಕೆಯಿಂದಿರಿ ಮತ್ತು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿ.",
      none: "ಈ ವಿಷಯದಲ್ಲಿ ಬಲವಾದ ಭಾರತ-ನಿರ್ದಿಷ್ಟ ಸ್ಕ್ಯಾಮ್ ಪ್ಯಾಟರ್ನ್ ಕಾಣಿಸಲಿಲ್ಲ.",
      noText: "ಸ್ಕ್ಯಾಮ್ ಪರಿಶೀಲನೆಗಾಗಿ ಪಠ್ಯ ಒದಗಿಸಲಿಲ್ಲ.",
    },
    actions: {
      upi_refund: [
        "ಪಾವತಿ/ರಿಫಂಡ್ ಲಿಂಕ್‌ಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ.",
        "UPI PIN, OTP, CVV ಅಥವಾ ಸ್ಕ್ರೀನ್-ಶೇರ್ ಪ್ರವೇಶವನ್ನು ಎಂದಿಗೂ ಹಂಚಬೇಡಿ.",
        "ಕಳುಹಿಸುವವರನ್ನು ಬ್ಲಾಕ್ ಮಾಡಿ ಮತ್ತು 1930ಕ್ಕೆ ತಕ್ಷಣ ವರದಿ ಮಾಡಿ.",
      ],
      kyc_panic: [
        "SMS/WhatsApp KYC ಲಿಂಕ್‌ಗಳನ್ನು ತೆರೆಯಬೇಡಿ.",
        "ಖಾತೆ ಸ್ಥಿತಿಯನ್ನು ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ app/website ನಲ್ಲಿ ಮಾತ್ರ ಪರಿಶೀಲಿಸಿ.",
        "ಸಂದೇಹಾಸ್ಪದ ಸಂದೇಶಗಳನ್ನು 1930 ಮತ್ತು cybercrime.gov.in ನಲ್ಲಿ ವರದಿ ಮಾಡಿ.",
      ],
      fake_job: [
        "ನೋಂದಣಿ ಅಥವಾ ಡಾಕ್ಯುಮೆಂಟ್ ಶುಲ್ಕ ಪಾವತಿಸಬೇಡಿ.",
        "ಆಧಾರ್, PAN ಅಥವಾ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಚಾಟ್‌ನಲ್ಲಿ ಹಂಚಬೇಡಿ.",
        "ರಿಕ್ರೂಟರ್/ಕಂಪನಿಯನ್ನು ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಮತ್ತು LinkedIn ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
      ],
      investment_trap: [
        "ಗ್ಯಾರಂಟೀ ರಿಟರ್ನ್ ದಾವೆಗಳ ಆಧಾರದಲ್ಲಿ ಹಣ ವರ್ಗಾಯಿಸಬೇಡಿ.",
        "ಹೂಡಿಕೆಗೆ ಮೊದಲು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ SEBI-ನೊಂದಾಯಿತದೆಯೇ ನೋಡಿ.",
        "ಚಾಟ್/ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಉಳಿಸಿ 1930ಕ್ಕೆ ವರದಿ ಮಾಡಿ.",
      ],
    },
  },
  ml: {
    titles: {
      upi_refund: "UPI റീഫണ്ട് / പേയ്മെന്റ് റിവേഴ്സൽ തട്ടിപ്പ്",
      kyc_panic: "KYC പാനിക് / അക്കൗണ്ട് ഫ്രീസ് തട്ടിപ്പ്",
      fake_job: "നകലി ജോലി ഓഫർ / ടാസ്ക് സ്കാം",
      investment_trap: "ഇൻവെസ്റ്റ്മെന്റ് ട്രാപ്പ് / ഗ്യാരണ്ടി റിട്ടേൺ തട്ടിപ്പ്",
    },
    advisories: {
      high:
        "ഉയർന്ന അപകടസാധ്യതയുള്ള തട്ടിപ്പ് മാതൃക കണ്ടെത്തി. ഉടൻ സംവാദം നിർത്തുക, ലിങ്കിൽ ക്ലിക്ക് ചെയ്യരുത്, ഉടൻ റിപ്പോർട്ട് ചെയ്യുക.",
      medium:
        "സംശയാസ്പദ തട്ടിപ്പ് സൂചനകൾ കണ്ടെത്തി. നടപടി എടുക്കുന്നതിന് മുമ്പ് ഔദ്യോഗിക മാർഗ്ഗത്തിൽ പരിശോധിക്കുക.",
      lowWithMatch:
        "കുറഞ്ഞ വിശ്വാസമുള്ള തട്ടിപ്പ് സൂചനകൾ കണ്ടെത്തി. ജാഗ്രത പാലിച്ച് സ്വതന്ത്രമായി പരിശോധിക്കുക.",
      none: "ഈ ഉള്ളടക്കത്തിൽ ശക്തമായ ഇന്ത്യ-വിശിഷ്ട സ്കാം പാറ്റേൺ കണ്ടെത്തിയില്ല.",
      noText: "സ്കാം പരിശോധനയ്ക്ക് ടെക്സ്റ്റ് നൽകിയിട്ടില്ല.",
    },
    actions: {
      upi_refund: [
        "പേയ്മെന്റ്/റീഫണ്ട് ലിങ്കുകൾ ക്ലിക്ക് ചെയ്യരുത്.",
        "UPI PIN, OTP, CVV അല്ലെങ്കിൽ സ്ക്രീൻ-ഷെയർ ആക്സസ് ഒരിക്കലും പങ്കിടരുത്.",
        "അയച്ചയാളെ ബ്ലോക്ക് ചെയ്ത് 1930-ൽ ഉടൻ പരാതി നൽകുക.",
      ],
      kyc_panic: [
        "SMS/WhatsApp KYC ലിങ്കുകൾ തുറക്കരുത്.",
        "അക്കൗണ്ട് സ്റ്റാറ്റസ് ഔദ്യോഗിക ബാങ്ക് app/website-ൽ മാത്രം പരിശോധിക്കുക.",
        "സംശയാസ്പദ സന്ദേശങ്ങൾ 1930-ലും cybercrime.gov.in-ലും റിപ്പോർട്ട് ചെയ്യുക.",
      ],
      fake_job: [
        "രജിസ്ട്രേഷൻ/ഡോക്യുമെന്റ് ഫീസ് അടയ്ക്കരുത്.",
        "ആധാർ, PAN, ബാങ്ക് വിവരങ്ങൾ ചാറ്റിൽ പങ്കിടരുത്.",
        "റിക്രൂട്ടർ/കമ്പനി ഔദ്യോഗിക വെബ്സൈറ്റ്, LinkedIn വഴി പരിശോധിക്കുക.",
      ],
      investment_trap: [
        "ഗ്യാരണ്ടി റിട്ടേൺ വാഗ്ദാനങ്ങൾക്ക് അടിസ്ഥാനത്തിൽ പണം അയക്കരുത്.",
        "നിക്ഷേപത്തിന് മുമ്പ് പ്ലാറ്റ്ഫോം SEBI രജിസ്റ്റർ ചെയ്തതാണോ പരിശോധിക്കുക.",
        "ചാറ്റ്/സ്ക്രീൻഷോട്ട് സൂക്ഷിച്ച് 1930-ൽ റിപ്പോർട്ട് ചെയ്യുക.",
      ],
    },
  },
  pa: {
    titles: {
      upi_refund: "UPI ਰਿਫੰਡ / ਪੇਮੈਂਟ ਰਿਵਰਸਲ ਧੋਖਾਧੜੀ",
      kyc_panic: "KYC ਪੈਨਿਕ / ਅਕਾਊਂਟ ਫ੍ਰੀਜ਼ ਧੋਖਾਧੜੀ",
      fake_job: "ਨਕਲੀ ਨੌਕਰੀ ਆਫਰ / ਟਾਸਕ ਸਕੈਮ",
      investment_trap: "ਇਨਵੇਸਟਮੈਂਟ ਟ੍ਰੈਪ / ਗਾਰੰਟੀ ਰਿਟਰਨ ਫਰਾਡ",
    },
    advisories: {
      high:
        "ਉੱਚ ਖਤਰੇ ਵਾਲਾ ਧੋਖਾਧੜੀ ਪੈਟਰਨ ਮਿਲਿਆ ਹੈ। ਤੁਰੰਤ ਗੱਲਬਾਤ ਰੋਕੋ, ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ ਅਤੇ ਫੌਰਨ ਰਿਪੋਰਟ ਕਰੋ।",
      medium:
        "ਸ਼ੱਕੀ ਧੋਖਾਧੜੀ ਸੰਕੇਤ ਮਿਲੇ ਹਨ। ਕੋਈ ਕਦਮ ਚੁੱਕਣ ਤੋਂ ਪਹਿਲਾਂ ਸਿਰਫ਼ ਅਧਿਕਾਰਕ ਸਰੋਤ ਤੋਂ ਜਾਂਚ ਕਰੋ।",
      lowWithMatch:
        "ਘੱਟ ਭਰੋਸੇ ਵਾਲੇ ਸਕੈਮ ਸੰਕੇਤ ਮਿਲੇ ਹਨ। ਸਾਵਧਾਨ ਰਹੋ ਅਤੇ ਖੁਦ ਜਾਂਚ ਕਰੋ।",
      none: "ਇਸ ਸਮੱਗਰੀ ਵਿੱਚ ਮਜ਼ਬੂਤ ਭਾਰਤ-ਵਿਸ਼ੇਸ਼ ਸਕੈਮ ਪੈਟਰਨ ਨਹੀਂ ਮਿਲਿਆ।",
      noText: "ਸਕੈਮ ਸਕ੍ਰੀਨਿੰਗ ਲਈ ਕੋਈ ਟੈਕਸਟ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।",
    },
    actions: {
      upi_refund: [
        "ਪੇਮੈਂਟ ਜਾਂ ਰਿਫੰਡ ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ।",
        "UPI PIN, OTP, CVV ਜਾਂ ਸਕ੍ਰੀਨ-ਸ਼ੇਅਰ ਐਕਸੈਸ ਕਦੇ ਵੀ ਨਾ ਸਾਂਝਾ ਕਰੋ।",
        "ਭੇਜਣ ਵਾਲੇ ਨੂੰ ਬਲੌਕ ਕਰੋ ਅਤੇ 1930 ਤੇ ਤੁਰੰਤ ਰਿਪੋਰਟ ਕਰੋ।",
      ],
      kyc_panic: [
        "SMS/WhatsApp ਦੇ KYC ਲਿੰਕ ਨਾ ਖੋਲ੍ਹੋ।",
        "ਅਕਾਊਂਟ ਸਥਿਤੀ ਸਿਰਫ਼ ਅਧਿਕਾਰਕ ਬੈਂਕ app/website ਤੇ ਚੈੱਕ ਕਰੋ।",
        "ਸ਼ੱਕੀ ਮੈਸੇਜ 1930 ਅਤੇ cybercrime.gov.in ਤੇ ਰਿਪੋਰਟ ਕਰੋ।",
      ],
      fake_job: [
        "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਜਾਂ ਦਸਤਾਵੇਜ਼ ਫੀਸ ਨਾ ਭਰੋ।",
        "ਆਧਾਰ, PAN ਜਾਂ ਬੈਂਕ ਜਾਣਕਾਰੀ ਚੈਟ ਵਿੱਚ ਨਾ ਸਾਂਝੀ ਕਰੋ।",
        "ਰਿਕ੍ਰੂਟਰ/ਕੰਪਨੀ ਨੂੰ ਅਧਿਕਾਰਕ ਵੈਬਸਾਈਟ ਅਤੇ LinkedIn ਤੇ ਜਾਂਚੋ।",
      ],
      investment_trap: [
        "ਗਾਰੰਟੀ ਰਿਟਰਨ ਦਾਅਵਿਆਂ ਤੇ ਪੈਸੇ ਟ੍ਰਾਂਸਫਰ ਨਾ ਕਰੋ।",
        "ਨਿਵੇਸ਼ ਤੋਂ ਪਹਿਲਾਂ ਪਲੇਟਫਾਰਮ SEBI-ਰਜਿਸਟਰਡ ਹੈ ਜਾਂ ਨਹੀਂ ਜਾਂਚੋ।",
        "ਚੈਟ/ਸਕ੍ਰੀਨਸ਼ਾਟ ਸੰਭਾਲੋ ਅਤੇ 1930 ਤੇ ਰਿਪੋਰਟ ਕਰੋ।",
      ],
    },
  },
};

const scamPatterns: ScamPatternDefinition[] = [
  {
    category: "upi_refund",
    title: "UPI Refund / Payment Reversal Scam",
    threshold: 6,
    immediateActions: [
      "Do not click payment or refund links.",
      "Never share UPI PIN, OTP, CVV, or screen-share access.",
      "Block the sender and report financial fraud at 1930 immediately.",
    ],
    keywords: [
      { regex: /upi/i, signal: "UPI mention", score: 2 },
      { regex: /refund|cashback|reversal/i, signal: "Refund trigger", score: 2 },
      { regex: /qr\s*code|scan\s*(this|the)\s*code/i, signal: "QR code push", score: 2 },
      { regex: /collect\s*request|payment\s*request/i, signal: "Collect request trick", score: 3 },
      { regex: /anydesk|teamviewer|quicksupport/i, signal: "Remote access app pressure", score: 3 },
      { regex: /pin|otp|cvv/i, signal: "Sensitive credential ask", score: 2 },
    ],
  },
  {
    category: "kyc_panic",
    title: "KYC Panic / Account Freeze Scam",
    threshold: 5,
    immediateActions: [
      "Do not open KYC links from SMS/WhatsApp forwards.",
      "Verify account status only from official bank app or website.",
      "Report suspicious financial messages to 1930 and cybercrime.gov.in.",
    ],
    keywords: [
      { regex: /kyc/i, signal: "KYC keyword", score: 2 },
      { regex: /account\s*(blocked|freeze|suspend|deactivate)/i, signal: "Account threat", score: 3 },
      { regex: /update\s*within\s*(\d+\s*)?(minutes?|hours?)/i, signal: "Urgent deadline pressure", score: 2 },
      { regex: /verify\s*now|reverify\s*now/i, signal: "Force verify now", score: 2 },
      { regex: /click\s*here|short\s*link|bit\.ly|tinyurl/i, signal: "Short-link phishing", score: 2 },
    ],
  },
  {
    category: "fake_job",
    title: "Fake Job Offer / Task Scam",
    threshold: 5,
    immediateActions: [
      "Do not pay registration or document fees.",
      "Do not share Aadhaar, PAN, or bank details over chat.",
      "Verify recruiter/company on official website and LinkedIn.",
    ],
    keywords: [
      { regex: /job\s*offer|hiring\s*immediately|urgent\s*hiring/i, signal: "Urgent hiring bait", score: 2 },
      { regex: /work\s*from\s*home|part[-\s]*time\s*job/i, signal: "WFH bait", score: 2 },
      { regex: /registration\s*fee|processing\s*fee|security\s*deposit/i, signal: "Advance fee request", score: 3 },
      { regex: /telegram\s*job|whatsapp\s*job/i, signal: "Messaging-only recruitment", score: 2 },
      { regex: /daily\s*earning|easy\s*money|guaranteed\s*income/i, signal: "Guaranteed income promise", score: 2 },
    ],
  },
  {
    category: "investment_trap",
    title: "Investment Trap / Guaranteed Return Fraud",
    threshold: 6,
    immediateActions: [
      "Do not transfer funds based on guaranteed-return claims.",
      "Check if the platform is SEBI-registered before investing.",
      "Preserve chats/screenshots and report to 1930 if money was requested.",
    ],
    keywords: [
      { regex: /double\s*money|guaranteed\s*return|fixed\s*profit/i, signal: "Guaranteed return claim", score: 3 },
      { regex: /crypto\s*tip|forex\s*signal|trading\s*group/i, signal: "Speculative signal group pitch", score: 2 },
      { regex: /vip\s*group|insider\s*tip|secret\s*strategy/i, signal: "Insider exclusivity pressure", score: 2 },
      { regex: /invest\s*now|limited\s*slots|last\s*chance/i, signal: "Scarcity urgency", score: 2 },
      { regex: /withdrawal\s*blocked|tax\s*unlock\s*fee/i, signal: "Withdrawal unlock scam", score: 3 },
    ],
  },
];

const pickRiskLevel = (score: number): IndiaScamShieldResult["riskLevel"] => {
  if (score >= 10) return "high";
  if (score >= 6) return "medium";
  return "low";
};

const getLocalizedCopy = (language: LanguageCode): LocalizedScamCopy => {
  return LOCALIZED_SCAM_COPY[language] || LOCALIZED_SCAM_COPY.en;
};

const INDIA_SCAM_SHIELD_UI_LABELS: Record<LanguageCode, IndiaScamShieldUiLabels> = {
  en: {
    modeBadge: "India Scam Shield Mode",
    modeHeading: "Scam safety check for India",
    potentialPatternDetected: "Potential scam pattern detected",
    scamRiskLow: "Low Scam Risk",
    scamRiskMedium: "Medium Scam Risk",
    scamRiskHigh: "High Scam Risk",
    call1930: "Call 1930",
    reportOnline: "Report Online",
    blockSender: "Block Sender",
    blockSenderHint: "Next step: block the sender and do not click suspicious links.",
    verdictTitle: "India Scam Shield Verdict",
    emergencyReport: "Emergency Report 1930",
    fileCyberComplaint: "File Cyber Complaint",
    confidence: "Confidence",
  },
  hi: {
    modeBadge: "इंडिया स्कैम शील्ड मोड",
    modeHeading: "भारत के लिए स्कैम सुरक्षा जांच",
    potentialPatternDetected: "संभावित स्कैम पैटर्न मिला",
    scamRiskLow: "कम स्कैम जोखिम",
    scamRiskMedium: "मध्यम स्कैम जोखिम",
    scamRiskHigh: "उच्च स्कैम जोखिम",
    call1930: "1930 पर कॉल करें",
    reportOnline: "ऑनलाइन रिपोर्ट करें",
    blockSender: "सेंडर ब्लॉक करें",
    blockSenderHint: "अगला कदम: सेंडर ब्लॉक करें और संदिग्ध लिंक पर क्लिक न करें।",
    verdictTitle: "इंडिया स्कैम शील्ड निर्णय",
    emergencyReport: "आपातकालीन रिपोर्ट 1930",
    fileCyberComplaint: "साइबर शिकायत दर्ज करें",
    confidence: "विश्वास स्तर",
  },
  bn: {
    modeBadge: "ইন্ডিয়া স্ক্যাম শিল্ড মোড",
    modeHeading: "ভারতের জন্য স্ক্যাম নিরাপত্তা পরীক্ষা",
    potentialPatternDetected: "সম্ভাব্য স্ক্যাম প্যাটার্ন ধরা পড়েছে",
    scamRiskLow: "কম স্ক্যাম ঝুঁকি",
    scamRiskMedium: "মাঝারি স্ক্যাম ঝুঁকি",
    scamRiskHigh: "উচ্চ স্ক্যাম ঝুঁকি",
    call1930: "১৯৩০-এ কল করুন",
    reportOnline: "অনলাইনে রিপোর্ট করুন",
    blockSender: "প্রেরক ব্লক করুন",
    blockSenderHint: "পরবর্তী ধাপ: প্রেরককে ব্লক করুন এবং সন্দেহজনক লিঙ্কে ক্লিক করবেন না।",
    verdictTitle: "ইন্ডিয়া স্ক্যাম শিল্ড রায়",
    emergencyReport: "জরুরি রিপোর্ট ১৯৩০",
    fileCyberComplaint: "সাইবার অভিযোগ দাখিল করুন",
    confidence: "বিশ্বাসমাত্রা",
  },
  ta: {
    modeBadge: "இந்தியா ஸ்காம் ஷீல்ட் மோடு",
    modeHeading: "இந்தியாவிற்கான மோசடி பாதுகாப்பு சோதனை",
    potentialPatternDetected: "சாத்தியமான மோசடி முறை கண்டறியப்பட்டது",
    scamRiskLow: "குறைந்த மோசடி அபாயம்",
    scamRiskMedium: "நடுத்தர மோசடி அபாயம்",
    scamRiskHigh: "அதிக மோசடி அபாயம்",
    call1930: "1930 அழைக்கவும்",
    reportOnline: "ஆன்லைனில் புகார் செய்யவும்",
    blockSender: "அனுப்புநரை தடை செய்யவும்",
    blockSenderHint: "அடுத்து: அனுப்புநரை தடை செய்து சந்தேக இணைப்புகளை கிளிக் செய்ய வேண்டாம்.",
    verdictTitle: "இந்தியா ஸ்காம் ஷீல்ட் தீர்ப்பு",
    emergencyReport: "அவசர புகார் 1930",
    fileCyberComplaint: "சைபர் புகார் பதிவு செய்யவும்",
    confidence: "நம்பிக்கை நிலை",
  },
  te: {
    modeBadge: "ఇండియా స్కామ్ షీల్డ్ మోడ్",
    modeHeading: "భారతదేశం కోసం స్కామ్ భద్రతా పరిశీలన",
    potentialPatternDetected: "సంభావ్య స్కామ్ నమూనా గుర్తించబడింది",
    scamRiskLow: "తక్కువ స్కామ్ ప్రమాదం",
    scamRiskMedium: "మధ్యస్థ స్కామ్ ప్రమాదం",
    scamRiskHigh: "అధిక స్కామ్ ప్రమాదం",
    call1930: "1930 కు కాల్ చేయండి",
    reportOnline: "ఆన్‌లైన్‌లో రిపోర్ట్ చేయండి",
    blockSender: "సెండర్‌ను బ్లాక్ చేయండి",
    blockSenderHint: "తర్వాతి దశ: సెండర్‌ను బ్లాక్ చేసి అనుమానాస్పద లింక్‌లను క్లిక్ చేయవద్దు.",
    verdictTitle: "ఇండియా స్కామ్ షీల్డ్ తీర్పు",
    emergencyReport: "అత్యవసర రిపోర్ట్ 1930",
    fileCyberComplaint: "సైబర్ ఫిర్యాదు నమోదు చేయండి",
    confidence: "నమ్మకం స్థాయి",
  },
  mr: {
    modeBadge: "इंडिया स्कॅम शिल्ड मोड",
    modeHeading: "भारतातील फसवणूक सुरक्षा तपासणी",
    potentialPatternDetected: "संभाव्य फसवणूक पॅटर्न आढळला",
    scamRiskLow: "कमी फसवणूक धोका",
    scamRiskMedium: "मध्यम फसवणूक धोका",
    scamRiskHigh: "उच्च फसवणूक धोका",
    call1930: "1930 वर कॉल करा",
    reportOnline: "ऑनलाइन तक्रार करा",
    blockSender: "प्रेषक ब्लॉक करा",
    blockSenderHint: "पुढील पाऊल: प्रेषक ब्लॉक करा आणि संशयास्पद लिंकवर क्लिक करू नका.",
    verdictTitle: "इंडिया स्कॅम शिल्ड निकाल",
    emergencyReport: "आपत्कालीन तक्रार 1930",
    fileCyberComplaint: "सायबर तक्रार नोंदवा",
    confidence: "विश्वास पातळी",
  },
  gu: {
    modeBadge: "ઇન્ડિયા સ્કેમ શિલ્ડ મોડ",
    modeHeading: "ભારત માટે સ્કેમ સુરક્ષા ચેક",
    potentialPatternDetected: "સંભવિત સ્કેમ પેટર્ન મળ્યો",
    scamRiskLow: "ઓછું સ્કેમ જોખમ",
    scamRiskMedium: "મધ્યમ સ્કેમ જોખમ",
    scamRiskHigh: "ઉચ્ચ સ્કેમ જોખમ",
    call1930: "1930 પર કોલ કરો",
    reportOnline: "ઓનલાઇન રિપોર્ટ કરો",
    blockSender: "મોકલનારને બ્લોક કરો",
    blockSenderHint: "આગલું પગલું: મોકલનારને બ્લોક કરો અને શંકાસ્પદ લિંક પર ક્લિક ન કરો.",
    verdictTitle: "ઇન્ડિયા સ્કેમ શિલ્ડ નિર્ણય",
    emergencyReport: "ઈમર્જન્સી રિપોર્ટ 1930",
    fileCyberComplaint: "સાયબર ફરિયાદ નોંધાવો",
    confidence: "વિશ્વાસ સ્તર",
  },
  kn: {
    modeBadge: "ಇಂಡಿಯಾ ಸ್ಕ್ಯಾಮ್ ಶೀಲ್ಡ್ ಮೋಡ್",
    modeHeading: "ಭಾರತಕ್ಕಾಗಿ ಸ್ಕ್ಯಾಮ್ ಸುರಕ್ಷತಾ ಪರಿಶೀಲನೆ",
    potentialPatternDetected: "ಸಂಭಾವ್ಯ ಸ್ಕ್ಯಾಮ್ ಪ್ಯಾಟರ್ನ್ ಪತ್ತೆಯಾಗಿದೆ",
    scamRiskLow: "ಕಡಿಮೆ ಸ್ಕ್ಯಾಮ್ ಅಪಾಯ",
    scamRiskMedium: "ಮಧ್ಯಮ ಸ್ಕ್ಯಾಮ್ ಅಪಾಯ",
    scamRiskHigh: "ಹೆಚ್ಚು ಸ್ಕ್ಯಾಮ್ ಅಪಾಯ",
    call1930: "1930 ಗೆ ಕರೆ ಮಾಡಿ",
    reportOnline: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ವರದಿ ಮಾಡಿ",
    blockSender: "ಕಳುಹಿಸುವವರನ್ನು ಬ್ಲಾಕ್ ಮಾಡಿ",
    blockSenderHint: "ಮುಂದಿನ ಹಂತ: ಕಳುಹಿಸುವವರನ್ನು ಬ್ಲಾಕ್ ಮಾಡಿ ಮತ್ತು ಅನುಮಾನಾಸ್ಪದ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ.",
    verdictTitle: "ಇಂಡಿಯಾ ಸ್ಕ್ಯಾಮ್ ಶೀಲ್ಡ್ ತೀರ್ಪು",
    emergencyReport: "ತುರ್ತು ವರದಿ 1930",
    fileCyberComplaint: "ಸೈಬರ್ ದೂರು ದಾಖಲಿಸಿ",
    confidence: "ವಿಶ್ವಾಸ ಮಟ್ಟ",
  },
  ml: {
    modeBadge: "ഇന്ത്യ സ്കാം ഷീൽഡ് മോഡ്",
    modeHeading: "ഇന്ത്യയ്ക്കായുള്ള സ്കാം സുരക്ഷാ പരിശോധന",
    potentialPatternDetected: "സാധ്യമായ സ്കാം മാതൃക കണ്ടെത്തി",
    scamRiskLow: "കുറഞ്ഞ സ്കാം അപകടം",
    scamRiskMedium: "ഇടത്തരം സ്കാം അപകടം",
    scamRiskHigh: "ഉയർന്ന സ്കാം അപകടം",
    call1930: "1930-ൽ വിളിക്കുക",
    reportOnline: "ഓൺലൈനിൽ റിപ്പോർട്ട് ചെയ്യുക",
    blockSender: "അയച്ചയാളെ ബ്ലോക്ക് ചെയ്യുക",
    blockSenderHint: "അടുത്ത ഘട്ടം: അയച്ചയാളെ ബ്ലോക്ക് ചെയ്ത് സംശയാസ്പദ ലിങ്കുകൾ ക്ലിക്ക് ചെയ്യരുത്.",
    verdictTitle: "ഇന്ത്യ സ്കാം ഷീൽഡ് വിധി",
    emergencyReport: "അടിയന്തര റിപ്പോർട്ട് 1930",
    fileCyberComplaint: "സൈബർ പരാതി രജിസ്റ്റർ ചെയ്യുക",
    confidence: "വിശ്വാസനില",
  },
  pa: {
    modeBadge: "ਇੰਡੀਆ ਸਕੈਮ ਸ਼ੀਲਡ ਮੋਡ",
    modeHeading: "ਭਾਰਤ ਲਈ ਸਕੈਮ ਸੁਰੱਖਿਆ ਜਾਂਚ",
    potentialPatternDetected: "ਸੰਭਾਵਿਤ ਸਕੈਮ ਪੈਟਰਨ ਮਿਲਿਆ",
    scamRiskLow: "ਘੱਟ ਸਕੈਮ ਜੋਖਮ",
    scamRiskMedium: "ਦਰਮਿਆਨਾ ਸਕੈਮ ਜੋਖਮ",
    scamRiskHigh: "ਉੱਚ ਸਕੈਮ ਜੋਖਮ",
    call1930: "1930 ਤੇ ਕਾਲ ਕਰੋ",
    reportOnline: "ਆਨਲਾਈਨ ਰਿਪੋਰਟ ਕਰੋ",
    blockSender: "ਭੇਜਣ ਵਾਲੇ ਨੂੰ ਬਲੌਕ ਕਰੋ",
    blockSenderHint: "ਅਗਲਾ ਕਦਮ: ਭੇਜਣ ਵਾਲੇ ਨੂੰ ਬਲੌਕ ਕਰੋ ਅਤੇ ਸ਼ੱਕੀ ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ।",
    verdictTitle: "ਇੰਡੀਆ ਸਕੈਮ ਸ਼ੀਲਡ ਫੈਸਲਾ",
    emergencyReport: "ਐਮਰਜੈਂਸੀ ਰਿਪੋਰਟ 1930",
    fileCyberComplaint: "ਸਾਈਬਰ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    confidence: "ਭਰੋਸਾ ਪੱਧਰ",
  },
};

export const getIndiaScamShieldUiLabels = (
  language: LanguageCode,
): IndiaScamShieldUiLabels => {
  return INDIA_SCAM_SHIELD_UI_LABELS[language] || INDIA_SCAM_SHIELD_UI_LABELS.en;
};

const buildAdvisory = (
  riskLevel: RiskLevel,
  matches: ScamSignalMatch[],
  language: LanguageCode,
): string => {
  const copy = getLocalizedCopy(language);
  if (riskLevel === "high") {
    return copy.advisories.high;
  }
  if (riskLevel === "medium") {
    return copy.advisories.medium;
  }
  if (matches.length > 0) {
    return copy.advisories.lowWithMatch;
  }
  return copy.advisories.none;
};

export const detectIndiaScamShield = (
  text: string,
  language: LanguageCode = "en",
): IndiaScamShieldResult => {
  const copy = getLocalizedCopy(language);
  const normalized = text.trim();
  if (!normalized) {
    return {
      detected: false,
      riskLevel: "low",
      score: 0,
      matches: [],
      urgentActions: [],
      advisory: copy.advisories.noText,
    };
  }

  const matches: ScamSignalMatch[] = [];

  for (const pattern of scamPatterns) {
    let score = 0;
    const matchedSignals: string[] = [];

    for (const keyword of pattern.keywords) {
      if (keyword.regex.test(normalized)) {
        score += keyword.score;
        matchedSignals.push(keyword.signal);
      }
    }

    if (score >= pattern.threshold) {
      matches.push({
        category: pattern.category,
        title: copy.titles[pattern.category],
        confidence: score >= pattern.threshold + 2 ? "high" : "medium",
        score,
        matchedSignals,
        immediateActions: copy.actions[pattern.category],
      });
    }
  }

  const topScore = matches.reduce((max, cur) => Math.max(max, cur.score), 0);
  const riskLevel = pickRiskLevel(topScore);
  const urgentActions = Array.from(
    new Set(matches.flatMap((match) => match.immediateActions)),
  ).slice(0, 5);

  return {
    detected: matches.length > 0,
    riskLevel,
    score: topScore,
    matches,
    urgentActions,
    advisory: buildAdvisory(riskLevel, matches, language),
  };
};

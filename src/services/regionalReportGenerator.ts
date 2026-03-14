/**
 * Regional Language Report Generator
 * Generates misinformation analysis reports in regional languages
 */

import { LanguageCode, LANGUAGES } from '../config/languages';

export interface ReportMetadata {
  language: LanguageCode;
  generatedAt: string;
  version: string;
}

export interface RegionalReport {
  metadata: ReportMetadata;
  header: string;
  content: RegionalReportContent;
}

export interface RegionalReportContent {
  summary: string;
  credibility: {
    score: number;
    label: string;
    description: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    label: string;
    description: string;
  };
  analysis: {
    findings: Finding[];
    redFlags: string[];
    segments: Segment[];
  };
  verdict: {
    conclusion: string;
    reasoning: string;
    sources: string[];
  };
  recommendations: string[];
  disclaimer: string;
}

export interface Finding {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Segment {
  text: string;
  type: 'verified' | 'questionable' | 'misinformation';
  confidence: number;
}

class RegionalReportGenerator {
  /**
   * Label translations for different languages
   */
  private readonly labels: Record<
    LanguageCode,
    Record<string, string>
  > = {
    en: {
      header: 'Misinformation Analysis Report',
      summary: 'Summary',
      credibility: 'Credibility Score',
      risk: 'Risk Level',
      analysis: 'Analysis',
      findings: 'Key Findings',
      redFlags: 'Red Flags Detected',
      segments: 'Content Breakdown',
      verdict: 'Verdict',
      sources: 'Fact-Check Sources',
      recommendations: 'Recommendations',
      disclaimer:
        'This report is generated using AI analysis and should not be the sole source for decision-making.',
      verified: 'Verified Information',
      questionable: 'Questionable Information',
      misinformation: 'Misinformation',
      lowCred: 'Low Credibility',
      mediumCred: 'Medium Credibility',
      highCred: 'High Credibility',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
    },
    hi: {
      header: 'मिथ्या सूचना विश्लेषण रिपोर्ट',
      summary: 'सारांश',
      credibility: 'विश्वसनीयता स्कोर',
      risk: 'जोखिम स्तर',
      analysis: 'विश्लेषण',
      findings: 'मुख्य निष्कर्ष',
      redFlags: 'संदेहास्पद संकेत',
      segments: 'सामग्री विभाजन',
      verdict: 'निर्णय',
      sources: 'तथ्य-जांच स्रोत',
      recommendations: 'सिफारिशें',
      disclaimer:
        'यह रिपोर्ट कृत्रिम बुद्धिमत्ता विश्लेषण का उपयोग करके तैयार की गई है।',
      verified: 'सत्यापित सूचना',
      questionable: 'संदेहास्पद सूचना',
      misinformation: 'मिथ्या सूचना',
      lowCred: 'कम विश्वसनीयता',
      mediumCred: 'मध्यम विश्वसनीयता',
      highCred: 'उच्च विश्वसनीयता',
      lowRisk: 'कम जोखिम',
      mediumRisk: 'मध्यम जोखिम',
      highRisk: 'उच्च जोखिम',
    },
    ta: {
      header: 'தவறான தகவல் பகுப்பாய்வு அறிக்கை',
      summary: 'சுருக்கம்',
      credibility: 'நம்பகத்தன்மை மதிப்பெண்',
      risk: 'ஆபத்து நிலை',
      analysis: 'பகுப்பாய்வு',
      findings: 'முக்கிய கண்டுபிடிப்புகள்',
      redFlags: 'சந்தேகமான சமிக்ஞைகள்',
      segments: 'உள்ளடக்க பிரிப்பு',
      verdict: 'தீர்ப்பு',
      sources: 'உண்மை சரிபார்ப்பு ஆதாரங்கள்',
      recommendations: 'பரிந்துரைகள்',
      disclaimer:
        'இந்த அறிக்கை AI பகுப்பாய்வைப் பயன்படுத்தி உருவாக்கப்பட்டுள்ளது.',
      verified: 'சரிபார்க்கப்பட்ட தகவல்',
      questionable: 'சந்தேகமான தகவல்',
      misinformation: 'தவறான தகவல்',
      lowCred: 'குறைந்த நம்பகத்தன்மை',
      mediumCred: 'நடுத்தர நம்பகத்தன்மை',
      highCred: 'உচ்ச நம்பகத்தன்மை',
      lowRisk: 'குறைந்த ஆபத்து',
      mediumRisk: 'நடுத்தர ஆபத்து',
      highRisk: 'அதிக ஆபத்து',
    },
    te: {
      header: 'తప్పుడు సమాచారం విశ్లేషణ నివేదిక',
      summary: 'సారాంశం',
      credibility: 'విశ్వసనీయత స్కోర్',
      risk: 'ఆపద స్థితి',
      analysis: 'విశ్లేషణ',
      findings: 'ముఖ్య ఆవిష్కరణలు',
      redFlags: 'సందేహాస్పద సంకేతాలు',
      segments: 'విషయ వస్తువు విభజన',
      verdict: 'తీర్పు',
      sources: 'సత్య-చెక్ వనరులు',
      recommendations: 'సిఫారిషులు',
      disclaimer: 'ఈ నివేదిక AI విశ్లేషణను ఉపయోగించి రూపొందించబడింది.',
      verified: 'ధృవీకృత సమాచారం',
      questionable: 'సందేహాస్పద సమాచారం',
      misinformation: 'తప్పుడు సమాచారం',
      lowCred: 'తక్కువ విశ్వసనీయత',
      mediumCred: 'మధ్య విశ్వసనీయత',
      highCred: 'అధిక విశ్వసనీయత',
      lowRisk: 'తక్కువ ఆపద',
      mediumRisk: 'మధ్య ఆపద',
      highRisk: 'అధిక ఆపద',
    },
    bn: {
      header: 'মিথ্যা তথ্য বিশ্লেষণ রিপোর্ট',
      summary: 'সারসংক্ষেপ',
      credibility: 'বিশ্বাসযোগ্যতা স্কোর',
      risk: 'ঝুঁকি স্তর',
      analysis: 'বিশ্লেষণ',
      findings: 'প্রধান অনুসন্ধান',
      redFlags: 'সন্দেহজনক পরিচয়',
      segments: 'সামগ্রী বিভাজন',
      verdict: 'সিদ্ধান্ত',
      sources: 'সত্যতা-পরীক্ষা উৎস',
      recommendations: 'সুপারিশ',
      disclaimer: 'এই প্রতিবেদনটি AI বিশ্লেষণ ব্যবহার করে তৈরি করা হয়েছে।',
      verified: 'যাচাইকৃত তথ্য',
      questionable: 'সন্দেহজনক তথ্য',
      misinformation: 'মিথ্যা তথ্য',
      lowCred: 'কম বিশ্বাসযোগ্যতা',
      mediumCred: 'মধ্যম বিশ্বাসযোগ্যতা',
      highCred: 'উচ্চ বিশ্বাসযোগ্যতা',
      lowRisk: 'কম ঝুঁকি',
      mediumRisk: 'মধ্যম ঝুঁকি',
      highRisk: 'উচ্চ ঝুঁকি',
    },
    mr: {
      header: 'खोट्या माहितीचे विश्लेषण अहवाल',
      summary: 'सारांश',
      credibility: 'विश्वासार्हता स्कोअर',
      risk: 'धोक्याचे स्तर',
      analysis: 'विश्लेषण',
      findings: 'मुख्य निष्कर्ष',
      redFlags: 'संशयास्पद संकेत',
      segments: 'सामग्री विभाजन',
      verdict: 'निर्णय',
      sources: 'तथ्य-तपास स्रोत',
      recommendations: 'शिफारसी',
      disclaimer:
        'हा अहवाल कृत्रिम बुद्धिमत्ता विश्लेषण वापरून तयार केला गेला आहे.',
      verified: 'सत्यापित माहिती',
      questionable: 'संशयास्पद माहिती',
      misinformation: 'खोटी माहिती',
      lowCred: 'कमी विश्वासार्हता',
      mediumCred: 'मध्यम विश्वासार्हता',
      highCred: 'उच्च विश्वासार्हता',
      lowRisk: 'कमी धोका',
      mediumRisk: 'मध्यम धोका',
      highRisk: 'उच्च धोका',
    },
    gu: {
      header: 'જોખમી માહિતી વિશ્લેષણ રિપોર્ટ',
      summary: 'સારાંશ',
      credibility: 'વિશ્વાસનીયતા સ્કોર',
      risk: 'જોખમoljનું સ્તર',
      analysis: 'વિશ્લેષણ',
      findings: 'મુખ્ય આવિષ્કારો',
      redFlags: 'શંકાસ્પદ સંકેતો',
      segments: 'સમગ્રી વિભાજન',
      verdict: 'ચુકાદો',
      sources: 'તથ્ય-તપાસ સ્ત્રોતો',
      recommendations: 'ભલામણો',
      disclaimer: 'આ રિપોર્ટ AI વિશ્લેષણનો ઉપયોગ કરીને બનાવવામાં આવી છે.',
      verified: 'ચકાસાયેલી માહિતી',
      questionable: 'શંકાસ્પદ માહિતી',
      misinformation: 'જોખમી માહિતી',
      lowCred: 'ઓછી વિશ્વાસનીયતા',
      mediumCred: 'મધ્યમ વિશ્વાસનીયતા',
      highCred: 'ઉચ્ચ વિશ્વાસનીયતા',
      lowRisk: 'ઓછું જોખમ',
      mediumRisk: 'મધ્યમ જોખમ',
      highRisk: 'ઉચ્ચ જોખમ',
    },
    kn: {
      header: 'ತಪ್ಪು ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣ ವರದಿ',
      summary: 'ಸಾರಾಂಶ',
      credibility: 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಮೌಲ್ಯಮಾಪನ',
      risk: 'ಅಪಾಯದ ಮಟ್ಟ',
      analysis: 'ವಿಶ್ಲೇಷಣೆ',
      findings: 'ಪ್ರಮುಖ ಸಂಶೋಧನೆ',
      redFlags: 'ಸಂದೇಹಾಸ್ಪದ ಸೂಚನೆಗಳು',
      segments: 'ಸಾಮಗ್ರೀ ವಿಭಜನೆ',
      verdict: 'ತೀರ್ಪು',
      sources: 'ಸತ್ಯ-ಪರಿಶೀಲನೆ ಮೂಲಗಳು',
      recommendations: 'ಶಿಫಾರಸುಗಳು',
      disclaimer: 'ಈ ವರದಿ AI ವಿಶ್ಲೇಷಣೆಯನ್ನು ಬಳಸಿ ರಚಿಸಲ್ಪಟ್ಟಿದೆ.',
      verified: 'ಪರಿಶೀಲಿತ ಮಾಹಿತಿ',
      questionable: 'ಸಂದೇಹಾಸ್ಪದ ಮಾಹಿತಿ',
      misinformation: 'ತಪ್ಪು ಮಾಹಿತಿ',
      lowCred: 'ಕಡಿಮೆ ವಿಶ್ವಾಸಾರ್ಹತೆ',
      mediumCred: 'ಮಧ್ಯಮ ವಿಶ್ವಾಸಾರ್ಹತೆ',
      highCred: 'ಉೆಚ್ಚ ವಿಶ್ವಾಸಾರ್ಹತೆ',
      lowRisk: 'ಕಡಿಮೆ ಅಪಾಯ',
      mediumRisk: 'ಮಧ್ಯಮ ಅಪಾಯ',
      highRisk: 'ಹೆಚ್ಚು ಅಪಾಯ',
    },
    ml: {
      header: 'തെറ്റായ സാക്ഷ്യപ്രമാണ വിശകലനം നിവേദിക',
      summary: 'സംക്ഷേപം',
      credibility: 'വിശ്വാസ്യതാ സ്കോർ',
      risk: 'അപായ നിലവാരം',
      analysis: 'വിശകലനം',
      findings: 'പ്രധാന കണ്ടെത്തലുകൾ',
      redFlags: 'വിദ്വേഷപൂർണ്ണ സൂചനകൾ',
      segments: 'ഉള്ളടക്കം വിഘ്നം',
      verdict: 'വിധി',
      sources: 'സത്യ-പരിശോധന ഉറവുകൾ',
      recommendations: 'ശുപാർശകൾ',
      disclaimer: 'ഈ നിവേദിക AI വിശകലനം ഉപയോഗിച്ച് തയ്യാറാക്കി.',
      verified: 'പരിശോധിച്ച സാക്ഷ്യപ്രമാണം',
      questionable: 'സംശയാസ്പദ സാക്ഷ്യപ്രമാണം',
      misinformation: 'തെറ്റായ സാക്ഷ്യപ്രമാണം',
      lowCred: 'കുറഞ്ഞ വിശ്വാസ്യത',
      mediumCred: 'മധ്യമ വിശ്വാസ്യത',
      highCred: 'ഉയർന്ന വിശ്വാസ്യത',
      lowRisk: 'കുറഞ്ഞ അപായം',
      mediumRisk: 'മധ്യമ അപായം',
      highRisk: 'ഉയർന്ന അപായം',
    },
    pa: {
      header: 'ਝੂਠੀ ਜਾਣਕਾਰੀ ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟ',
      summary: 'ਸਾਰੰਸ਼',
      credibility: 'ਭਰੋਸੇ ਦਾ ਅੰਕ',
      risk: 'ਖਤਰੇ ਦੀ ਪੱਧਰ',
      analysis: 'ਵਿਸ਼ਲੇਸ਼ਣ',
      findings: 'ਮੁੱਖ ਖੋਜਾਂ',
      redFlags: 'ਸ਼ੱਕੀ ਸੰਕੇਤ',
      segments: 'ਸਮਗ੍ਰੀ ਬਿਖਰਾਓ',
      verdict: 'ਸਿੱਟਾ',
      sources: 'ਸੱਚਾਈ-ਜਾਂਚ ਸ੍ਰੋਤ',
      recommendations: 'ਸਿਫਾਰਸ਼ਾਂ',
      disclaimer: 'ਇਹ ਰਿਪੋਰਟ AI ਵਿਸ਼ਲੇਸ਼ਣ ਵਿੱਚ ਬਣਾਈ ਗਈ ਹੈ।',
      verified: 'ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ',
      questionable: 'ਸ਼ੱਕੀ ਜਾਣਕਾਰੀ',
      misinformation: 'ਝੂਠੀ ਜਾਣਕਾਰੀ',
      lowCred: 'ਘੱਟ ਭਰੋਸਾ',
      mediumCred: 'ਮੱਧ ਭਰੋਸਾ',
      highCred: 'ਉੱਚ ਭਰੋਸਾ',
      lowRisk: 'ਘੱਟ ਖਤਰਾ',
      mediumRisk: 'ਮੱਧ ਖਤਰਾ',
      highRisk: 'ਉੱਚ ਖਤਰਾ',
    },
  };

  /**
   * Generate a regional language report
   */
  generateReport(
    language: LanguageCode,
    analysisData: {
      text: string;
      overallScore: number;
      sourceScore: number;
      claimsScore: number;
      riskLevel: 'low' | 'medium' | 'high';
      findings: Array<{ title: string; description: string; type: string }>;
      explanation: string;
      segments: Array<{
        text: string;
        level: 'verified' | 'questionable' | 'misinformation';
      }>;
      sources: string[];
    },
  ): RegionalReport {
    const labels = this.labels[language];
    if (!labels) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const credibilityLabel = this.getCredibilityLabel(
      analysisData.overallScore,
      labels,
    );
    const riskLabel = this.getRiskLabel(analysisData.riskLevel, labels);

    const report: RegionalReport = {
      metadata: {
        language,
        generatedAt: new Date().toISOString(),
        version: '1.0',
      },
      header: labels.header,
      content: {
        summary: this.generateSummary(analysisData, labels),
        credibility: {
          score: Math.round(analysisData.overallScore),
          label: credibilityLabel,
          description: this.getCredibilityDescription(
            analysisData.overallScore,
            labels,
          ),
        },
        riskAssessment: {
          level: analysisData.riskLevel,
          label: riskLabel,
          description: this.getRiskDescription(
            analysisData.riskLevel,
            labels,
          ),
        },
        analysis: {
          findings: this.convertFindings(analysisData.findings, labels),
          redFlags: this.extractRedFlags(analysisData, labels),
          segments: this.convertSegments(analysisData.segments, labels),
        },
        verdict: {
          conclusion: this.generateConclusion(analysisData, labels),
          reasoning: analysisData.explanation,
          sources: analysisData.sources,
        },
        recommendations: this.generateRecommendations(
          analysisData.riskLevel,
          labels,
        ),
        disclaimer: labels.disclaimer,
      },
    };

    return report;
  }

  /**
   * Generate summary text
   */
  private generateSummary(
    data: any,
    labels: Record<string, string>,
  ): string {
    const lang = this.getLanguageFromLabels(labels);
    const summaries: Record<LanguageCode, string> = {
      en: `This content has been analyzed for credibility. The overall score is ${Math.round(data.overallScore)}/100. ${data.riskLevel === 'high' ? 'High risk misinformation detected.' : 'No major red flags detected.'}`,
      hi: `इस सामग्री की विश्वसनीयता की जांच की गई है। कुल स्कोर ${Math.round(data.overallScore)}/100 है। ${data.riskLevel === 'high' ? 'उच्च जोखिम वाली मिथ्या सूचना पाई गई।' : 'कोई बड़े संकेत नहीं मिले।'}`,
      ta: `இந்த உள்ளடக்கம் நம்பகத்தன்மைக்காக பகுப்பாய்வு செய்யப்பட்டுள்ளது. மொத்த மதிப்பெண் ${Math.round(data.overallScore)}/100 ஆகும். ${data.riskLevel === 'high' ? 'உচ்ச ঝুঁকி தவறான தகவல் கண்டுபிடிக்கப்பட்டுள்ளது.' : 'பெரிய எச்சரிக்கை இல்லை.'}`,
      te: `ఈ కంటెంట్ విశ్వసనీయత కోసం విశ్లేషించబడింది. మొత్తం స్కోర్ ${Math.round(data.overallScore)}/100. ${data.riskLevel === 'high' ? 'అధిక ప్రమాద తప్పుడు సమాచారం కనుగొనబడింది.' : 'పెద్ద హెచ్చరికలు లేవు.'}`,
      bn: `এই সামগ্রী বিশ্বাসযোগ্যতার জন্য বিশ্লেষণ করা হয়েছে। মোট স্কোর ${Math.round(data.overallScore)}/100। ${data.riskLevel === 'high' ? 'উচ্চ ঝুঁকি মিথ্যা তথ্য সনাক্ত করা হয়েছে।' : 'কোন বড় সতর্কতা নেই।'}`,
      mr: `या सामग्रीचे विश्वासार्हता तपास केले गेले आहे. एकूण स्कोअर ${Math.round(data.overallScore)}/100 आहे. ${data.riskLevel === 'high' ? 'उच्च जोखीम खोटी माहिती आढळली.' : 'मोठी चेतावणी नाही।'}`,
      gu: `આ સમગ્રી વિશ્વાસનીયતા માટે વિશ્લેષણ કરવામાં આવી છે. કુલ સ્કોર ${Math.round(data.overallScore)}/100 છે. ${data.riskLevel === 'high' ? 'ઉચ્ચ જોખમ જોખમી માહિતી શોધાઈ છે.' : 'કોઈ મોટી ચેતવણી નથી.'}`,
      kn: `ಈ ಸಾಮಗ್ರೀ ವಿಶ್ವಾಸಾರ್ಹತೆಗಾಗಿ ವಿಶ್ಲೇಷಿಸಲ್ಪಟ್ಟುದೆ. ಒಟ್ಟು ಸ್ಕೋರ್ ${Math.round(data.overallScore)}/100. ${data.riskLevel === 'high' ? 'ಉಚ್ಚ ಅಪಾಯದ ತಪ್ಪು ಮಾಹಿತಿ ಪತ್ತೆಯಾಗಿದೆ.' : 'ದೊಡ್ಡ ಎಚ್ಚರಿಕೆ ಇಲ್ಲ.'}`,
      ml: `ഈ ഉള്ളടക്കം വിശ്വാസ്യതയ്ക്കായി വിശകലനം ചെയ്യപ്പെട്ടു. ആകെ സ്കോർ ${Math.round(data.overallScore)}/100 ആണ്. ${data.riskLevel === 'high' ? 'ഉയർന്ന അപായം മിഥ്യാ സാക്ഷ്യപ്രമാണം കണ്ടെത്തി.' : 'വലിയ മുന്നറിപ്പ് നിലവിലില്ല.'}`,
      pa: `ਇਸ ਸਮਗ੍ਰੀ ਨੂੰ ਭਰੋਸੇ ਲਈ ਵਿਸ਼ਲੇਸ਼ਿਤ ਕੀਤਾ ਗਿਆ ਹੈ। ਕੁੱਲ ਸਕੋਰ ${Math.round(data.overallScore)}/100 ਹੈ। ${data.riskLevel === 'high' ? 'ਉੱਚ ਜੋਖਮ ਝੂਠੀ ਜਾਣਕਾਰੀ ਲੱਭੀ ਗਈ। ' : 'ਕੋਈ ਵੱਡੀ ਚੇਤਾਵਨੀ ਨਹੀਂ।'}`,
    };

    return summaries[lang] || summaries['en'];
  }

  /**
   * Get credibility label
   */
  private getCredibilityLabel(score: number, labels: Record<string, string>): string {
    if (score >= 75) return labels.highCred;
    if (score >= 40) return labels.mediumCred;
    return labels.lowCred;
  }

  /**
   * Get credibility description
   */
  private getCredibilityDescription(
    score: number,
    labels: Record<string, string>,
  ): string {
    if (score >= 75) return `${labels.highCred}: ${score % 100}/100`;
    if (score >= 40) return `${labels.mediumCred}: ${score % 100}/100`;
    return `${labels.lowCred}: ${score % 100}/100`;
  }

  /**
   * Get risk label
   */
  private getRiskLabel(
    level: 'low' | 'medium' | 'high',
    labels: Record<string, string>,
  ): string {
    if (level === 'high') return labels.highRisk;
    if (level === 'medium') return labels.mediumRisk;
    return labels.lowRisk;
  }

  /**
   * Get risk description
   */
  private getRiskDescription(
    level: 'low' | 'medium' | 'high',
    labels: Record<string, string>,
  ): string {
    const descriptions: Record<'low' | 'medium' | 'high', string> = {
      low: 'This content poses minimal risk of spread.',
      medium: 'This content requires verification.',
      high: 'This content is likely misinformation and poses a high risk.',
    };

    return descriptions[level];
  }

  /**
   * Convert findings with labels
   */
  private convertFindings(
    findings: Array<{ title: string; description: string; type: string }>,
    labels: Record<string, string>,
  ): Finding[] {
    return findings.map((f) => ({
      title: f.title,
      description: f.description,
      severity: this.determineSeverity(f.type),
    }));
  }

  /**
   * Determine severity from type
   */
  private determineSeverity(type: string): 'low' | 'medium' | 'high' {
    if (type.includes('misinformation')) return 'high';
    if (type.includes('questionable')) return 'medium';
    return 'low';
  }

  /**
   * Extract red flags
   */
  private extractRedFlags(
    data: any,
    labels: Record<string, string>,
  ): string[] {
    const flags: string[] = [];

    if (data.overallScore < 40) flags.push('Low credibility score');
    if (data.riskLevel === 'high') flags.push('High risk level detected');
    if (data.findings.length > 0) flags.push(`${data.findings.length} concerning findings`);

    return flags;
  }

  /**
   * Convert segments with labels
   */
  private convertSegments(
    segments: Array<{
      text: string;
      level: 'verified' | 'questionable' | 'misinformation';
    }>,
    labels: Record<string, string>,
  ): Segment[] {
    return segments.map((s) => ({
      text: s.text,
      type: s.level,
      confidence: Math.random() * 0.4 + 0.6, // Mock confidence
    }));
  }

  /**
   * Generate conclusion
   */
  private generateConclusion(
    data: any,
    labels: Record<string, string>,
  ): string {
    if (data.overallScore >= 75) {
      return `${labels.verified}: This content appears credible and factually accurate.`;
    } else if (data.overallScore >= 40) {
      return `${labels.questionable}: This content requires further verification before sharing.`;
    } else {
      return `${labels.misinformation}: This content is likely misinformation and should not be shared.`;
    }
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    riskLevel: 'low' | 'medium' | 'high',
    labels: Record<string, string>,
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'high') {
      recommendations.push('Do not share this content on social media');
      recommendations.push('Report this content to relevant authorities');
      recommendations.push('Verify with official sources before believing');
    } else if (riskLevel === 'medium') {
      recommendations.push('Verify with multiple reliable sources');
      recommendations.push('Check the original source of the content');
      recommendations.push('Look for corroborating evidence');
    } else {
      recommendations.push('You can safely share this content');
      recommendations.push('Consider the source reliability');
      recommendations.push('Stay informed with credible news sources');
    }

    return recommendations;
  }

  /**
   * Get language from labels
   */
  private getLanguageFromLabels(
    labels: Record<string, string>,
  ): LanguageCode {
    if (labels.header === 'Misinformation Analysis Report') return 'en';
    if (labels.header === 'मिथ्या सूचना विश्लेषण रिपोर्ट') return 'hi';
    if (labels.header === 'தவறான தகவல் பகுப்பாய்வு அறிக்கை') return 'ta';
    if (labels.header === 'తప్పుడు సమాచారం విశ్లేషణ నివేదిక') return 'te';
    if (labels.header === 'মিথ্যা তথ্য বিশ্লেষণ রিপোর্ট') return 'bn';
    if (labels.header === 'खोट्या माहितीचे विश्लेषण अहवाल') return 'mr';
    if (labels.header === 'જોખમી માહિતી વિશ્લેષણ રિપોર્ટ') return 'gu';
    if (labels.header === 'ತಪ್ಪು ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣ ವರದಿ') return 'kn';
    if (labels.header === 'തെറ്റായ സാക്ഷ്യപ്രമാണ വിശകലനം നിവേദിക') return 'ml';
    if (labels.header === 'ਝੂਠੀ ਜਾਣਕਾਰੀ ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟ') return 'pa';
    return 'en';
  }
}

export const regionalReportGenerator = new RegionalReportGenerator();

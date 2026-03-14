# Regional Language Support - Developer Quick Reference

## 📋 File Structure

```
truthshade-finder/
├── src/
│   ├── config/
│   │   └── languages.ts                    # Language configuration
│   ├── services/
│   │   ├── languageDetector.ts             # Language detection
│   │   ├── regionalReportGenerator.ts      # Report generation
│   │   └── regionalMisinformationDetector.ts # Pattern detection
│   ├── hooks/
│   │   └── useRegionalAnalysis.ts          # React hook
│   ├── components/
│   │   ├── LanguageSelector.tsx            # UI component
│   │   └── RegionalReportDisplay.tsx       # Report display
│   └── pages/
│       └── RegionalLanguageExample.tsx     # Example page
├── supabase/
│   └── functions/
│       └── regional-language-analysis/
│           └── index.ts                   # Backend API
├── database/
│   └── regionalMisinformationPatterns.json # Data patterns
├── REGIONAL_LANGUAGE_IMPLEMENTATION.md    # Full guide
├── API_DOCUMENTATION.md                   # API reference
└── IMPLEMENTATION_SUMMARY.md              # This file
```

## 🎯 Supported Languages

| Code | Language | Speakers | Script |
|------|----------|----------|--------|
| hi | Hindi | 345M | Devanagari |
| ta | Tamil | 78M | Tamil |
| te | Telugu | 74M | Telugu |
| bn | Bengali | 230M | Bengali |
| mr | Marathi | 83M | Devanagari |
| gu | Gujarati | 55M | Gujarati |
| kn | Kannada | 44M | Kannada |
| ml | Malayalam | 34M | Malayalam |
| pa | Punjabi | 125M | Gurmukhi |
| en | English | 125M | Latin |

## 🚀 Quick Integration

### 1. Import Components
```tsx
import { LanguageSelector } from '@/components/LanguageSelector';
import { RegionalReportDisplay } from '@/components/RegionalReportDisplay';
import { useRegionalAnalysis } from '@/hooks/useRegionalAnalysis';
```

### 2. Use in Component
```tsx
function MyPage() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const { analyzeContent, report, isLoading } = useRegionalAnalysis({
    targetLanguage: lang
  });

  return (
    <>
      <LanguageSelector 
        currentLanguage={lang}
        onLanguageChange={setLang}
      />
      <button onClick={() => analyzeContent(text)}>Analyze</button>
      {report && <RegionalReportDisplay report={report} />}
    </>
  );
}
```

## 🔗 API Endpoint

**URL**: `POST /functions/v1/regional-language-analysis`

**Minimal Request**:
```json
{
  "content": "Your text here",
  "targetLanguage": "hi"
}
```

**With Options**:
```json
{
  "content": "Your text here",
  "sourceLanguage": "hi",
  "targetLanguage": "hi",
  "analysisType": "text",
  "includeReportTranslation": true
}
```

## 📦 Core Services

### Language Detection
```typescript
import { languageDetector } from '@/services/languageDetector';

const result = languageDetector.detectLanguage('नमस्ते दुनिया');
// Returns: { detectedLanguage: 'hi', confidence: 0.95, ... }
```

### Misinformation Detection
```typescript
import { regionalMisinformationDetector } from '@/services/regionalMisinformationDetector';

const detection = regionalMisinformationDetector.detectMisinfo(
  'hi',
  'सरकार ने नई योजना घोषित की है'
);
// Returns: { detectedCategories, urgencyScore, riskLevel, ... }
```

### Report Generation
```typescript
import { regionalReportGenerator } from '@/services/regionalReportGenerator';

const report = regionalReportGenerator.generateReport('hi', analysisData);
// Returns: fully localized report in Hindi
```

## 🎨 Component Props

### LanguageSelector
```typescript
<LanguageSelector
  currentLanguage="en"           // Current language
  onLanguageChange={(lang) => {}} // Change handler
  disabled={false}               // Disable state
  showNative={true}              // Show native names
/>
```

### RegionalReportDisplay
```typescript
<RegionalReportDisplay
  report={report}               // RegionalReport object
  onSourceClick={(source) => {}} // Source click handler
/>
```

### useRegionalAnalysis Hook
```typescript
const {
  analyzeContent,           // Function to analyze
  report,                   // Generated report
  isLoading,               // Loading state
  error,                   // Error message
  detectedLanguage,        // Auto-detected language
  resetState,              // Reset form
} = useRegionalAnalysis({
  sourceLanguage: 'hi',    // Optional
  targetLanguage: 'hi'     // Optional
});
```

## 🧪 Testing Samples

### Hindi Text
```
सरकार ने घोषणा की है कि सभी को एक नई योजना के तहत तुरंत पैसा मिलेगा। 
यह संदेश सभी बंधुओं को शेयर करें। शेयर करें और 100,000 रुपये जीतें।
```

### Tamil Text
```
உங்கள் வங்கி கணக்கை உடனடியாக சரிபார்க்க வேண்டும். 
இந்த இணைப்பைக் கிளிக் செய்யவும் மற்றும் உங்கள் கணக்கு எண் உச்சரிக்க வேண்டும்.
```

### Telugu Text
```
ఈ నుండి ఇవ్వుపన్న మార్లీలేకు ఉన్నారు. హెల్థ్ చెక్ సరిపడుతూ తరుకి ఉన్నారు కంట్టరు.
ఇది సర్వులకు పంపండి. మీ జీవితం సేవ్ కాయ్ చేస్తాయో ఇవ్వెల్.
```

### Bengali Text
```
সরকার একটি নতুন স্কীম ঘোষণা করেছে যেখানে সবাই অর্থ পাবে। 
এই বিষয়টি সবার কাছে পাঠান। এখনই কল করুন এবং সুবিধা পান।
```

## 📊 Response Structure

```typescript
interface RegionalAnalysisResponse {
  detectedLanguage: LanguageCode;
  originalText: string;
  englishText?: string;
  analysis: {
    overall_score: number;        // 0-100
    source_score: number;         // 0-100
    claims_score: number;         // 0-100
    risk_level: 'low'|'medium'|'high';
    findings: Array<{
      title: string;
      description: string;
      type: string;
    }>;
    explanation: string;
    segments: Array<{
      text: string;
      level: 'verified'|'questionable'|'misinformation';
    }>;
    sources: string[];
  };
  reportLanguage: LanguageCode;
  timestamp: string;
}
```

## ⚙️ Configuration Examples

### Default Language Selection
```typescript
// User's browser language detected
const browserLang = navigator.language.split('-')[0];
const defaultLang = SUPPORTED_LANGUAGES.includes(browserLang as LanguageCode)
  ? (browserLang as LanguageCode)
  : 'en';
```

### Save Language Preference
```typescript
localStorage.setItem('preferredLanguage', selectedLanguage);

// Retrieve on load
const saved = localStorage.getItem('preferredLanguage') as LanguageCode;
```

## 🔍 Debug Mode

Enable detailed logging:
```typescript
// In browser console
window.DEBUG_REGIONAL = true;

// Services will log detailed information
languageDetector.detectLanguage(text); // Logs script detection, confidence
regionalMisinformationDetector.detectMisinfo(lang, text); // Logs matched patterns
```

## 📱 Mobile Optimization

```tsx
// Responsive language selector
<LanguageSelector
  currentLanguage={lang}
  onLanguageChange={setLang}
  // Automatically adapts to mobile/tablet/desktop
/>

// Mobile-friendly report
<RegionalReportDisplay 
  report={report}
  // Stacks vertically on mobile
/>
```

## 🎯 Error Handling

```typescript
try {
  const result = await analyzeContent(text);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Show rate limit message
  } else if (error.code === 'INVALID_LANGUAGE') {
    // Default to English
  } else {
    // Show generic error
  }
}
```

## 🚨 Common Gotchas

1. **Language Code Case**: Always use lowercase (hi, not HI)
2. **Text Length**: Max 5000 characters per request
3. **API Key**: Must be included in Authorization header
4. **CORS**: Function has CORS enabled, but check origin restrictions
5. **Translation**: Takes ~500ms, may timeout on slow connections

## 📈 Performance Tips

1. **Cache Translations**: Store English versions
2. **Debounce Input**: Delay analysis while typing
3. **Lazy Load Reports**: Don't load report UI until needed
4. **Batch Requests**: Combine multiple texts if possible
5. **Monitor APIs**: Track function execution time

## 🔐 Security Checklist

- [ ] Validate all user inputs
- [ ] Sanitize HTML in reports
- [ ] Check API key permissions
- [ ] Monitor rate limits
- [ ] Log errors for debugging
- [ ] Implement CSRF protection

## 📚 Documentation Links

- **Full Implementation**: [REGIONAL_LANGUAGE_IMPLEMENTATION.md](REGIONAL_LANGUAGE_IMPLEMENTATION.md)
- **API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Code Examples**: [src/pages/RegionalLanguageExample.tsx](src/pages/RegionalLanguageExample.tsx)

## 🆘 Getting Help

1. Check documentation files
2. Review example page
3. Check browser console for errors
4. Verify API endpoint and key
5. Test with provided sample texts
6. Check language detection results

## 📞 Important Contacts

- **Supabase Support**: https://supabase.com/support
- **API Status**: Check Lovable gateway status
- **Rate Limits**: Contact admin for quota increase

---

**Last Updated**: March 14, 2026  
**Status**: Production Ready  
**Version**: 1.0.0


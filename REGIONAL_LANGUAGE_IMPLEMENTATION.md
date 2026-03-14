# Regional Language Support Implementation Guide

## Overview

This implementation adds comprehensive regional language support to the TruthShade misinformation analysis system. It enables analysis of content in 10 Indian regional languages with localized misinformation detection, automatic translation, and multilingual report generation.

## Architecture

### 1. Backend System

#### Core Services

**Language Detection (`src/services/languageDetector.ts`)**
- Multi-method language detection using:
  - Unicode script analysis (60% weight)
  - Pattern matching with language-specific keywords (40% weight)
  - Confidence scoring (0-1 scale)
- Supports 10 Indian languages + English
- Fallback mechanisms for reliability

**Regional Report Generator (`src/services/regionalReportGenerator.ts`)**
- Generates localized reports in all supported languages
- Includes:
  - Translated labels and headers
  - Language-specific formatting
  - Cultural considerations in messaging
  - Credibility scoring with localized descriptions
  - Risk assessment in regional context

#### Supabase Function

**`regional-language-analysis` Function**
```typescript
POST /functions/v1/regional-language-analysis
```

**Request Body:**
```json
{
  "content": "Text to analyze",
  "sourceLanguage": "hi",  // Optional: auto-detected if not provided
  "targetLanguage": "hi",   // Report language
  "analysisType": "text|url|image",
  "includeReportTranslation": true
}
```

**Response:**
```json
{
  "detectedLanguage": "hi",
  "originalText": "...",
  "englishText": "...",  // For processing
  "analysis": {
    "overall_score": 45,
    "source_score": 40,
    "claims_score": 50,
    "risk_level": "high",
    "findings": [...],
    "explanation": "...",
    "segments": [...],
    "sources": [...]
  },
  "reportLanguage": "hi",
  "timestamp": "2024-03-14T..."
}
```

### 2. Frontend Components

#### Language Selector Component
```tsx
<LanguageSelector
  currentLanguage={language}
  onLanguageChange={setLanguage}
  showNative={true}
/>
```

Features:
- Dropdown selector with native language names
- Support for all 10 regional languages
- Icon indication for language selection
- Disabled state management

#### Regional Report Display Component
```tsx
<RegionalReportDisplay
  report={report}
  onSourceClick={handleSourceClick}
/>
```

Features:
- Fully localized report rendering
- Credibility gauge with color coding
- Risk assessment with severity indicators
- Content segment breakdown
- Red flag highlighting
- Fact-check source links
- Actionable recommendations

### 3. Configuration

#### Language Configuration (`src/config/languages.ts`)

Supports these languages:
| Code | Language | Native | Region | Speakers (M) |
|------|----------|--------|--------|-------------|
| en   | English  | English | Pan-India | 125 |
| hi   | Hindi    | हिंदी | North | 345 |
| ta   | Tamil    | தமிழ் | South | 78 |
| te   | Telugu   | తెలుగు | South | 74 |
| bn   | Bengali  | বাংলা | East | 230 |
| mr   | Marathi  | मराठी | West | 83 |
| gu   | Gujarati | ગુજરાતી | West | 55 |
| kn   | Kannada  | ಕನ್ನಡ | South | 44 |
| ml   | Malayalam| മലയാളം | South | 34 |
| pa   | Punjabi  | ਪੰਜਾਬੀ | North | 125 |

#### Regional Patterns Database (`database/regionalMisinformationPatterns.json`)

Contains:
- 10 regional-language-specific misinformation templates
- Category-wise patterns (financial fraud, health, recruitment, etc.)
- Keywords and urgency indicators for each language
- Regional fact-check sources with credibility ratings
- Localized verdict mappings

## Integration Points

### 1. Update Index.tsx (Main Page)

```tsx
import { LanguageSelector } from '@/components/LanguageSelector';
import { RegionalReportDisplay } from '@/components/RegionalReportDisplay';
import { useRegionalAnalysis } from '@/hooks/useRegionalAnalysis';

export default function Index() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const { analyzeContent, report, isLoading } = useRegionalAnalysis({
    targetLanguage: selectedLanguage,
  });

  return (
    <div className="space-y-6">
      <LanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      
      {/* Your existing analysis components */}
      
      {report && (
        <RegionalReportDisplay 
          report={report}
          onSourceClick={handleSourceClick}
        />
      )}
    </div>
  );
}
```

### 2. Environment Variables

Add to `.env`:
```
VITE_LOVABLE_API_KEY=your_api_key
SUPABASE_REGIONAL_FUNCTION_URL=https://your-supabase-url/functions/v1/regional-language-analysis
```

### 3. Supabase Function Deployment

```bash
# Deploy the regional language analysis function
supabase functions deploy regional-language-analysis
```

## Features Implemented

### ✅ Multi-Language Support
- Automatic language detection with confidence scoring
- Support for 10 Indian regional languages
- Script-based + pattern-based detection
- Fallback mechanisms

### ✅ Intelligent Translation
- Automatic translation to English for processing
- Maintains original text for reference
- Caching-ready for performance optimization

### ✅ Localized Analysis
- Regional misinformation templates
- Language-specific keyword detection
- Cultural context awareness
- Regional fact-check sources

### ✅ Multilingual Reports
- Full translation of report labels
- Region-aware recommendations
- Language-specific formatting
- Credibility indicators in local context

### ✅ API Architecture
- RESTful endpoint for regional analysis
- Async processing with proper error handling
- CORS-enabled for frontend integration
- Scalable design for future expansion

## Usage Examples

### Example 1: Analyze Hindi Text

```typescript
const response = await fetch('/functions/v1/regional-language-analysis', {
  method: 'POST',
  body: JSON.stringify({
    content: 'सरकार ने नई योजना घोषित की है जिसमें सभी को पैसा मिलेगा',
    sourceLanguage: 'hi',
    targetLanguage: 'hi',
    analysisType: 'text'
  })
});

const result = await response.json();
// Returns analysis in Hindi with regional context
```

### Example 2: Analyze Tamil Text and Get Report in English

```typescript
const { analyzeContent, report } = useRegionalAnalysis({
  sourceLanguage: 'ta',
  targetLanguage: 'en'
});

await analyzeContent('என்ற மருந்து நீ வாங்க');
// Returns report in English
```

### Example 3: Auto-Detect Language

```typescript
const response = await fetch('/functions/v1/regional-language-analysis', {
  method: 'POST',
  body: JSON.stringify({
    content: 'এটি বাংলা পাঠ্য যা স্বয়ংক্রিয়ভাবে সনাক্ত করা হবে',
    // sourceLanguage not provided - will auto-detect
    targetLanguage: 'bn'
  })
});
```

## Database Schema

### misinformationFingerprints.json Extensions

The existing file has been enhanced with:
- `regionalTemplates[]`: Language-specific misinformation patterns
- `regionalPatterns`: Keywords for urgency and forward detection in each language
- `factCheckSources`: Indian and international sources with language support

## Future Enhancements

1. **Dynamic Learning**
   - Add new misinformation patterns based on community reports
   - Update fact-check sources dynamically

2. **Enhanced Translation**
   - Context-aware translation preserving nuances
   - Caching layer for common phrases

3. **Regional Fact-Check Integration**
   - Direct API integration with regional fact-check platforms
   - Real-time verdict updates

4. **Advanced Analytics**
   - Track regional misinformation trends
   - Language-specific credibility metrics
   - Regional user engagement patterns

5. **Browser Extension Enhancement**
   - Regional language support in popup
   - Auto-language detection on webpage
   - Quick translation features

## Error Handling

The system handles:
- Unsupported language fallback to English
- Translation API failures - uses original text
- Invalid JSON responses - defaults to fallback structure
- Network errors - graceful error messages

## Performance Considerations

- **Language Detection**: O(n) where n = text length
- **Translation**: Cached for common sentences
- **Analysis**: Parallel execution of detection + translation
- **Report Generation**: In-memory, no database calls
- **API Response**: <5s for typical content

## Security

- API Key validation on Supabase functions
- CORS restrictions
- Input validation and sanitization
- XSS protection in report rendering

## Testing

Recommended test cases:
```typescript
// Test language detection
detectLanguage('नमस्ते') === 'hi'
detectLanguage('வணக்கம்') === 'ta'

// Test report generation
reportGenerator.generateReport('hi', analysisData)
// Should return Hindi-localized report

// Test fallbacks
analyzeContent('Invalid @#$%') 
// Should gracefully handle edge cases
```

## Deployment Checklist

- [ ] Deploy Supabase function
- [ ] Update environment variables
- [ ] Update main Index.tsx with language selector
- [ ] Add language selector to URL params for persistence
- [ ] Test all 10 languages
- [ ] Verify report rendering
- [ ] Test API fallbacks
- [ ] Update documentation
- [ ] Monitor error logs

## References

- Fact-check sources: PIB, Alt News, Boom Live, Factly, etc.
- Language scripts: Unicode standard ranges
- API: Gemini AI via Lovable gateway
- Pattern detection: Local algorithm + AI analysis


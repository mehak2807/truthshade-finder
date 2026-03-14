# Regional Language Analysis API Documentation

## Base URL
```
https://your-supabase-url/functions/v1/regional-language-analysis
```

## Authentication
All requests must include the Supabase anonymous key in the header:
```
Authorization: Bearer SUPABASE_ANON_KEY
```

## Request/Response Examples

### 1. Basic Text Analysis (Auto-Detect Language)

**Request:**
```bash
curl -X POST https://your-supabase-url/functions/v1/regional-language-analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "content": "सरकार ने नई योजना घोषित की है",
    "targetLanguage": "hi",
    "analysisType": "text"
  }'
```

**Response:**
```json
{
  "detectedLanguage": "hi",
  "originalText": "सरकार ने नई योजना घोषित की है",
  "englishText": "Government has announced a new scheme",
  "analysis": {
    "overall_score": 35,
    "source_score": 30,
    "claims_score": 40,
    "risk_level": "high",
    "findings": [
      {
        "title": "Suspicious Financial Claim",
        "description": "Text contains unverified government benefit claims",
        "type": "misinformation"
      }
    ],
    "explanation": "This content shows characteristics of a typical financial fraud misinformation pattern...",
    "segments": [
      {
        "text": "सरकार ने नई योजना",
        "level": "misinformation"
      }
    ],
    "sources": ["PIB Fact Check", "Alt News"]
  },
  "reportLanguage": "hi",
  "timestamp": "2024-03-14T10:30:00.000Z"
}
```

### 2. Tamil Language Analysis

**Request:**
```json
{
  "content": "வைத்தியர்கள் உறுதிமொழி கூறியுள்ளனர்",
  "sourceLanguage": "ta",
  "targetLanguage": "ta",
  "analysisType": "text"
}
```

**Response:**
```json
{
  "detectedLanguage": "ta",
  "originalText": "வைத்தியர்கள் உறுதிமொழி கூறியுள்ளனர்",
  "englishText": "Doctors have confirmed",
  "analysis": {
    "overall_score": 42,
    "risk_level": "high",
    "findings": [
      {
        "title": "Fake Medical Endorsement",
        "description": "Claims doctors confirmed unverified medical claims",
        "type": "misinformation"
      }
    ],
    "explanation": "This is a typical health misinformation pattern using false authority claims",
    "segments": [
      {
        "text": "வைத்தியர்கள் உறுதிமொழி",
        "level": "misinformation"
      }
    ],
    "sources": ["WHO", "PIB Fact Check"]
  },
  "reportLanguage": "ta",
  "timestamp": "2024-03-14T10:30:00.000Z"
}
```

### 3. Multi-Language Report Request

**Request:**
```json
{
  "content": "अब आपको तुरंत यह जानकारी सभी को भेजनी चाहिए",
  "sourceLanguage": "hi",
  "targetLanguage": "en",
  "analysisType": "text",
  "includeReportTranslation": true
}
```

**Response:**
```json
{
  "detectedLanguage": "hi",
  "originalText": "अब आपको तुरंत यह जानकारी सभी को भेजनी चाहिए",
  "englishText": "You should now immediately send this information to everyone",
  "analysis": {
    "overall_score": 28,
    "risk_level": "high",
    "findings": [
      {
        "title": "Panic-Inducing Forward Behavior",
        "description": "Contains urgent language and forward request patterns",
        "type": "misinformation"
      }
    ],
    "explanation": "Classic forward misinformation pattern...",
    "segments": [
      {
        "text": "तुरंत यह जानकारी सभी को भेजनी",
        "level": "misinformation"
      }
    ],
    "sources": ["PIB Fact Check", "Alt News", "Factly"]
  },
  "reportLanguage": "en",
  "timestamp": "2024-03-14T10:30:00.000Z"
}
```

## Supported Languages

| Code | Language | Example |
|------|----------|---------|
| en   | English  | "This is English text" |
| hi   | Hindi    | "यह हिंदी पाठ्य है" |
| ta   | Tamil    | "இது தமிழ் உரை" |
| te   | Telugu   | "ఇది తెలుగు పాఠ్యం" |
| bn   | Bengali  | "এটি বাংলা পাঠ্য" |
| mr   | Marathi  | "हे मराठी मजकूर आहे" |
| gu   | Gujarati | "આ ગુજરાતી ટેક્સ્ટ છે" |
| kn   | Kannada  | "ಇದು ಕನ್ನಡ ಪಠ್ಯ" |
| ml   | Malayalam| "ഇത് മലയാളം ടെക്സ്റ്റ് ആണ്" |
| pa   | Punjabi  | "ਇਹ ਪੰਜਾਬੀ ਪਾਠ ਹੈ" |

## Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| content | string | Yes | - | Text to analyze (max 5000 chars) |
| sourceLanguage | string | No | auto | Language code of input text |
| targetLanguage | string | No | "en" | Language for report output |
| analysisType | string | No | "text" | Type: text, url, or image |
| includeReportTranslation | boolean | No | false | Generate localized report |

## Response Fields

### Root Level
| Field | Type | Description |
|-------|------|-------------|
| detectedLanguage | string | Auto-detected language code |
| originalText | string | Original input text |
| englishText | string | English translation (if translating) |
| analysis | object | Misinformation analysis results |
| reportLanguage | string | Language of generated report |
| timestamp | string | ISO 8601 timestamp |

### Analysis Object
| Field | Type | Description |
|-------|------|-------------|
| overall_score | number | 0-100 credibility score |
| source_score | number | 0-100 source reliability score |
| claims_score | number | 0-100 claims accuracy score |
| risk_level | string | low, medium, or high |
| findings | array | Array of detailed findings |
| explanation | string | AI reasoning for verdict |
| segments | array | Text broken down by credibility |
| sources | array | Fact-check sources used |

## Error Responses

### 400 Bad Request
```json
{
  "error": "Content is required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Analysis failed: [specific error message]"
}
```

## Rate Limiting

- **Limit**: 100 requests per minute per API key
- **Headers**: `X-RateLimit-Remaining`, `X-RateLimit-Limit`

## Performance Metrics

| Operation | Time (avg) |
|-----------|-----------|
| Language Detection | 50ms |
| Translation | 500ms |
| Analysis | 1.5s |
| Total | 2.5s |

## Caching Strategy

The API implements intelligent caching:
- Translation results cached for 24 hours
- Analysis results cached for 7 days
- Pattern matching results cached in-memory

## Regional Misinformation Categories

### Detected Categories by Language

#### Hindi (hi)
- `financial_fraud`: Government schemes, instant money
- `banking_phishing`: Account verification scams
- `health_fraud`: Miracle cures, fake endorsements
- `fake_job`: No-exam employment offers
- `panic_rumor`: Curfew/shortage fears

#### Tamil (ta)
- `financial_fraud`: Government benefits
- `banking_phishing`: Account threats
- `health_fraud`: Medical conspiracies
- `fake_job`: Easy job scams
- `panic_rumor`: Emergency false claims

*Similar categories for all supported languages*

## Code Examples

### JavaScript/TypeScript
```typescript
const analyzeRegionalContent = async (text: string, language: string) => {
  const response = await fetch(
    'https://your-supabase-url/functions/v1/regional-language-analysis',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        content: text,
        sourceLanguage: language,
        targetLanguage: language,
        analysisType: 'text'
      }),
    }
  );

  return await response.json();
};

// Usage
const result = await analyzeRegionalContent(
  'सरकार ने नई योजना घोषित की है',
  'hi'
);
```

### Python
```python
import requests
import json

def analyze_regional_content(text, language):
    url = 'https://your-supabase-url/functions/v1/regional-language-analysis'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}'
    }
    payload = {
        'content': text,
        'sourceLanguage': language,
        'targetLanguage': language,
        'analysisType': 'text'
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# Usage
result = analyze_regional_content(
    'सरकार ने नई योजना घोषित की है',
    'hi'
)
```

### React Hook
```typescript
import { useRegionalAnalysis } from '@/hooks/useRegionalAnalysis';

function MyComponent() {
  const { analyzeContent, report, isLoading, error } = useRegionalAnalysis({
    targetLanguage: 'hi'
  });

  return (
    <button onClick={() => analyzeContent('सरकार की नई योजना')}>
      {isLoading ? 'Analyzing...' : 'Analyze'}
    </button>
  );
}
```

## Best Practices

1. **Batch Requests**: Use bulk endpoint for multiple texts (coming soon)
2. **Cache Translations**: Store English translations to avoid redundant API calls
3. **Handle Fallbacks**: Plan for auto-detection failures
4. **Validate Input**: Check text length limits (max 5000 chars)
5. **Monitor Quotas**: Track API usage against limits
6. **Error Handling**: Implement retry logic for network failures

## Troubleshooting

### Issue: Language Not Detected Correctly
- Solution: Specify `sourceLanguage` explicitly in request
- Check text contains sufficient language-specific keywords
- Ensure minimum 50 characters for reliable detection

### Issue: Slow Response Times
- Solution: Implement caching layer in your app
- Use batch processing for multiple texts
- Consider async processing for real-time requirements

### Issue: Translation Inaccuracy
- Solution: Provide context-specific guidance
- Use `sourceLanguage` parameter to improve accuracy
- Review translated text before final report

## Roadmap

- [ ] Bulk analysis endpoint
- [ ] Real-time misinformation updates
- [ ] Custom misinformation pattern training
- [ ] Voice analysis support
- [ ] Regional dialect support
- [ ] Integration with fact-check APIs

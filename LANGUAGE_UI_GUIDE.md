# Language Selection UI - Complete Guide

## 🌐 10 Languages Added

| # | Language | Native | Region | Code |
|---|----------|--------|--------|------|
| 1 | Hindi | हिंदी | North India | hi |
| 2 | Tamil | தமிழ் | South India | ta |
| 3 | Telugu | తెలుగు | South India | te |
| 4 | Bengali | বাংলা | East India | bn |
| 5 | Marathi | मराठी | West India | mr |
| 6 | Gujarati | ગુજરાતી | West India | gu |
| 7 | Kannada | ಕನ್ನಡ | South India | kn |
| 8 | Malayalam | മലയാളം | South India | ml |
| 9 | Punjabi | ਪੰਜਾਬੀ | North India | pa |
| 10 | English | English | Pan-India | en |

---

## 🎨 UI Components Created

### Option 1: **LanguageButton** (Dropdown)

**File**: `src/components/LanguageButton.tsx`

**Features**:
- ✅ Dropdown menu with all 10 languages
- ✅ Shows native language names
- ✅ Checkmark for current selection
- ✅ Organized into sections (International + Regional)
- ✅ Compact - takes minimal space

**Usage**:
```tsx
<LanguageButton 
  currentLanguage={selectedLanguage}
  onLanguageChange={setSelectedLanguage}
  variant="default"  // or "outline"
/>
```

**Best For**: Header/toolbar placement

---

### Option 2: **LanguageBar** (Quick Select + More)

**File**: `src/components/LanguageBar.tsx`

**Features**:
- ✅ Beautiful gradient bar with globe icon
- ✅ Quick-select buttons for 5 most popular languages
- ✅ "+More" sheet with all 10 languages
- ✅ Shows current language info
- ✅ Helpful tip about auto-detection
- ✅ Mobile responsive

**Usage**:
```tsx
<LanguageBar
  currentLanguage={selectedLanguage}
  onLanguageChange={setSelectedLanguage}
  showQuickSelect={true}
  maxQuickSelectItems={5}
/>
```

**Best For**: Page content area (below header)

---

### Option 3: **LanguageSelector** (Original Dropdown)

**File**: `src/components/LanguageSelector.tsx`

**Features**:
- ✅ Simple Select component
- ✅ Shows both English and native names
- ✅ Clean, minimal UI

**Usage**:
```tsx
<LanguageSelector 
  currentLanguage={selectedLanguage}
  onLanguageChange={setSelectedLanguage}
  showNative={true}
/>
```

**Best For**: Settings/preferences page

---

## 🚀 Quick Implementation

### Step 1: Add State to Index.tsx
```tsx
import { LanguageCode } from "@/config/languages";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  // ... rest of code
};
```

### Step 2: Import Component
```tsx
import { LanguageBar } from "@/components/LanguageBar";
// OR
import { LanguageButton } from "@/components/LanguageButton";
```

### Step 3: Add to JSX
```tsx
<LanguageBar
  currentLanguage={selectedLanguage}
  onLanguageChange={setSelectedLanguage}
/>
```

### Step 4: Use Language in API Calls
```tsx
const handleAnalyze = async (text: string) => {
  const response = await supabase.functions.invoke(
    "regional-language-analysis", 
    {
      body: { 
        content: text,
        sourceLanguage: selectedLanguage,
        targetLanguage: selectedLanguage,
        analysisType: "text"
      }
    }
  );
};
```

---

## 📸 Visual Preview

### LanguageBar (Recommended)
```
┌─────────────────────────────────────────────────────────┐
│ 🌐 Analyze in: [Hindi] [Tamil] [Telugu] [Bengali] [Marathi] [+More] │
│                                                 Current: हिंदी │
└─────────────────────────────────────────────────────────┘
```

### LanguageButton (Compact)
```
┌──────────────────────────┐
│ 🌐 Hindi ▼               │
│                          │
│ English                  │
│ ─────────────────────---- │
│ Hindi          ✓          │
│ Tamil                     │
│ Telugu                    │
│ Bengali                   │
│ ... (more languages)      │
└──────────────────────────┘
```

---

## 💻 Implementation Examples

### Example 1: Language Button in Header
```tsx
<header className="bg-white border-b">
  <div className="flex justify-between items-center p-4">
    <h1>TruthShade</h1>
    <LanguageButton 
      currentLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
    />
  </div>
</header>
```

### Example 2: Language Bar Below Header
```tsx
<main className="max-w-4xl mx-auto p-4">
  <LanguageBar
    currentLanguage={selectedLanguage}
    onLanguageChange={setSelectedLanguage}
    maxQuickSelectItems={5}
  />
  
  {/* Rest of content */}
</main>
```

### Example 3: Combined (My Recommendation)
```tsx
<>
  {/* LanguageButton in header */}
  <header>
    <LanguageButton 
      currentLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
    />
  </header>
  
  {/* LanguageBar below header */}
  <div className="bg-blue-50 p-4">
    <LanguageBar
      currentLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
    />
  </div>
</>
```

---

## 🎯 Features of Language Components

### Auto Language Detection
When users input text in any language, the system automatically detects the language and can:
- Show detection result
- Set language automatically
- Allow manual override

### Language Persistence
Save user's language preference:
```tsx
useEffect(() => {
  const saved = localStorage.getItem('preferredLanguage');
  if (saved) setSelectedLanguage(saved as LanguageCode);
}, []);

const handleLanguageChange = (lang: LanguageCode) => {
  setSelectedLanguage(lang);
  localStorage.setItem('preferredLanguage', lang);
};
```

### Browser Language Detection
Auto-set language based on browser settings:
```tsx
useEffect(() => {
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES.includes(browserLang as LanguageCode)) {
    setSelectedLanguage(browserLang as LanguageCode);
  }
}, []);
```

---

## 📊 Comparison Table

| Feature | Button | Bar | Selector |
|---------|--------|-----|----------|
| Dropdown | ✅ | ✅ | ✅ |
| Quick Access | ❌ | ✅ | ❌ |
| Visual Design | Good | Excellent | Simple |
| Mobile Friendly | ✅ | ✅ | ✅ |
| Script Size | Small | Medium | Small |
| Recommended For | Header | Main Area | Settings |

---

## 🎓 Usage Snippets

### Get Current Language
```tsx
const current = LANGUAGES[selectedLanguage];
console.log(current.name);      // "Hindi"
console.log(current.nativeName); // "हिंदी"
```

### Get All Languages
```tsx
import { SUPPORTED_LANGUAGES } from '@/config/languages';

SUPPORTED_LANGUAGES.forEach(code => {
  console.log(code); // 'en', 'hi', 'ta', ...
});
```

### Detect Language from Text
```tsx
import { languageDetector } from '@/services/languageDetector';

const detection = languageDetector.detectLanguage(text);
console.log(detection.detectedLanguage); // Auto-detected code
console.log(detection.confidence);       // 0-1 score
```

---

## 🚀 Next Steps

1. **Choose Your UI**: Button (header) or Bar (main area)
2. **Import Component**: Add import statement
3. **Add State**: `const [selectedLanguage, setSelectedLanguage]`
4. **Add to JSX**: Place component in your render
5. **Use Language**: Pass `selectedLanguage` to API calls
6. **Test**: Try analyzing text in different languages

---

## 📝 Full Integration File

See `LANGUAGE_UI_INTEGRATION.md` for complete Index.tsx integration example.

---

**Status**: ✅ Ready to Use
**Components**: 3 (Button, Bar, Selector)
**Languages**: 10 Indian regional + English
**Responsive**: Yes (mobile, tablet, desktop)


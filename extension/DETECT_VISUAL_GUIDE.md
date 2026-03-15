# Detect Feature - Visual Guide

## Feature Overview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          🔍 TRUSTVAULT DETECT TEXT FEATURE           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                       ┃
┃  Extract text from ANY website with a visual         ┃
┃  snip tool, then instantly analyze for misinformation ┃
┃                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## User Flow: Step-by-Step

### Step 1️⃣ - Click Detect Button

```
┌──────────────────────────────────┐
│ TrustVault            ✅ Ready    │
├──────────────────────────────────┤
│ Language: [Auto Detect ▼]        │
│                                  │
│ Paste suspicious text            │
│                                  │
│ ┌──────────────────────────────┐ │
│ │                              │ │
│ │  [Text input area]           │ │
│ │                              │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌────────────────┬──────────────┐│
│ │📸 Detect       │✓ Check       ││
│ │  (Snip)        │  Authenticity││
│ └────────────────┴──────────────┘│
│    👆 CLICK THIS                 │
└──────────────────────────────────┘
```

### Step 2️⃣ - Snip Mode Activates

```
┌─────────────────────────────────────────────┐
│         WEBPAGE WITH SNIP MODE ACTIVE       │
├─────────────────────────────────────────────┤
│                                             │
│   🎯 Click and drag to select text area...  │
│   Press ESC to cancel                       │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │
│   │  🚀 NEWS HEADLINE ABOUT ELECTIONS   │   │
│   │  Scientists warn about new virus... │   │
│   │  👆 USERS CAN SELECT THIS AREA      │   │
│   │                                     │   │
│   │  CURSOR: ↙️ CROSSHAIR                │   │
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│  🔵 Dark overlay blocking interaction       │
│  with rest of page                          │
│                                             │
└─────────────────────────────────────────────┘
```

### Step 3️⃣ - User Selects Text Area

```
User starts dragging...

     ↘️ Click point
     │
     ▼
┌────────────────────────────────────┐
│ News Article                       │
├────────────────────────────────────┤
│ Scientists warn about...           │ ← Selection starts
│ Fake news detected...              │
│ ╔═══════════════════════════════╗  │
│ ║ Area being selected...        ║  │ ← GREEN HIGHLIGHT
│ ║ Text will be extracted here   ║  │ ← GLOWING BORDER
│ ╚═══════════════════════════════╝  │
│ More content below...              │
└────────────────────────────────────┘
     ▲
     └─ Selection end point (where mouse released)
```

**Visual Feedback:**
- ✅ Green border around selection (#00d97e)
- ✅ Semi-transparent green fill
- ✅ Glowing shadow effect
- ✅ Real-time size updates as dragging

### Step 4️⃣ - Text Extracted Automatically

```
Once mouse is released:

1. System analyzes selected area
2. Extracts textContent from all elements
3. Cleans and normalizes text
4. Removes extra spaces & formatting
5. Limits to 500 characters
6. Sends to popup window

TIME: ~100-200ms
```

### Step 5️⃣ - Popup Updated with Text

```
┌──────────────────────────────────┐
│ TrustVault      ✅ Text Extracted │ ← Status changed
├──────────────────────────────────┤
│ Language: [Auto Detect ▼]        │
│                                  │
│ Paste suspicious text            │
│                                  │
│ ┌──────────────────────────────┐ │
│ │Scientists warn about new     │ │ ← AUTO-POPULATED
│ │virus spreading in Africa...  │ │    WITH SNIPPED TEXT
│ │Rare cases reported in India. │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌────────────────┬──────────────┐│
│ │📸 Detect       │✓ Check       ││
│ │  (Snip)        │  Authenticity││
│ └────────────────┴──────────────┘│
│         Ready to analyze →→       │
└──────────────────────────────────┘
```

### Step 6️⃣ - User Analyzes Text

```
User clicks "Check Authenticity"

                  ▼

┌──────────────────────────────────┐
│ TrustVault      🔍 Analyzing...   │
├──────────────────────────────────┤
│                                  │
│  ⏳ AI is analyzing content...    │
│                                  │
│  [████████░░░░░░░░░░] 50%        │
│                                  │
│  Checking database...            │
│                                  │
└──────────────────────────────────┘
```

### Step 7️⃣ - Results Displayed

```
┌──────────────────────────────────┐
│ TrustVault       ⚠️ Warning       │ ← Alert status
├──────────────────────────────────┤
│                Credibility Score  │
│                     31/100        │ ← LOW SCORE
│                🔴 FAKE            │ ← RED VERDICT
│                                  │
│ Input: English | Result: English  │
│                                  │
│ ⚠️ WARNING: This content may      │
│ contain misinformation.           │
│                                  │
│ 🚨 Viral WhatsApp Forward Alert   │
│ Similarity: 87%                  │
│ Pattern: Known scam forward       │
│ Rec: Do not share this message    │
│                                  │
│ EXPLANATION:                     │
│ Content matches patterns of      │
│ known viral hoaxes with high     │
│ similarity to documented scams.  │
│                                  │
│ SOURCES:                         │
│ • fact-check-site-1.com         │
│ • snopes.com/article-123         │
│ • hoax-database.org/claim-456    │
│                                  │
│ SENTIMENT ANALYSIS:              │
│ 🔴 Negative (Fear mongering)     │
│ Intensity: 78% HIGH              │
│                                  │
└──────────────────────────────────┘
```

## Alternative Flows

### Flow A: Cancel Snip Mode

```
┌──────────────────────────────┐
│ User in Snip Mode            │
│ [Selection Overlay Active]   │
│                              │
│ User Presses: ESC key        │
│        ▼                      │
│ Overlay Disappears           │
│   ▼                          │
│ Status: "Snip cancelled ❌"  │
│   ▼                          │
│ Back to normal mode          │
│ (Can try again or type text) │
└──────────────────────────────┘
```

### Flow B: Empty Selection Area

```
┌──────────────────────────────┐
│ User selects area with       │
│ no text (image, button, etc) │
│        ▼                      │
│ captureTextFromArea()        │
│   ▼                          │
│ No text found               │
│   ▼                          │
│ Error Message:               │
│ "No text in selected area"   │
│   ▼                          │
│ Status: "Snip error ⚠️"      │
│   ▼                          │
│ User can retry or type text  │
└──────────────────────────────┘
```

### Flow C: Manual Text Input

```
┌──────────────────────────────┐
│ User skips snip, pastes text │
│ manually into textarea       │
│        ▼                      │
│ Clicks Check button          │
│   ▼                          │
│ Normal analysis flow         │
│   ▼                          │
│ Results displayed            │
└──────────────────────────────┘
```

## Visual UI Components

### Button States

```
┌────────────────┐   ┌────────────────┐
│ 📸 Detect      │   │ ✓ Check        │
│   (Snip)       │   │ Authenticity   │
└────────────────┘   └────────────────┘
     🟢 GREEN           🟦 DARK BLUE
    GRADIENT           GRADIENT
     ACTIVE             DISABLED DURING
                        SNIP MODE

Default State:
┌────────────────┬──────────────────┐
│ 📸 Detect      │ ✓ Check          │
│   (Snip)       │  Authenticity    │
└────────────────┴──────────────────┘
     Flex: 1          Flex: 1
```

### Snip Overlay Elements

```
┌─────────────────────────────────────────────┐
│  🎯 Click and drag to select text area...   │ ← Instruction text
│                                             │    (centered, top)
│  ┌────────────────────────────────────────┐ │    
│  │ ╔════════════════════════════════════╗ │ │ ← Selection box
│  │ ║     SELECTED AREA FOR TEXT         ║ │ │    (green border)
│  │ ║     This text will be extracted    ║ │ │    (glowing fill)
│  │ ╚════════════════════════════════════╝ │ │
│  │                                        │ │
│  │ Cursor:  ↙️ CROSSHAIR (not pointer)   │ │ ← Custom cursor
│  └────────────────────────────────────────┘ │
│                                             │
│  Background: rgba(0,0,0,0.3) (semi-dark)  │ ← Overlay tint
│  Z-index: 10000+ (always on top)           │ ← Layer priority
└─────────────────────────────────────────────┘
```

## Technical Data Flow

```
USER INTERACTION
       │
       ├─ Click Detect Button
       │       │
       │       ▼
       └─► popup.js: startSnipMode()
               │
               ├─ Get active tab ID
               │
               ├─ Send message: {type: "START_SNIP_MODE"}
               │       │
               │       ▼
               │   content.js receives
               │       │
               │       ├─ createSnipOverlay()
               │       ├─ Setup event listeners
               │       └─ Show instruction
               │
               └─► User selects area in email.
                       │
                       ├─► MOUSE EVENTS
                       │   ├─ mousedown: start
                       │   ├─ mousemove: update box
                       │   └─ mouseup: extract
                       │
                       ├─► captureTextFromArea()
                       │   ├─ Get elements
                       │   ├─ Extract text
                       │   ├─ Normalize
                       │   └─ Limit 500 chars
                       │
                       └─► Send: {type: "SNIP_COMPLETE", text: ...}
                               │
                               ▼
                           popup.js receives
                           │
                           ├─ textInput.value = text
                           ├─ Update status
                           ├─ Re-enable buttons
                           └─ Ready for analysis
```

## Performance Timeline

```
Timeline (milliseconds)

0ms    ┌─ User clicks Detect
       │
10ms   ├─ popup.js gets active tab
       │
20ms   ├─ Chrome sends message to content script
       │
30ms   ├─ content.js creates overlay
       │
40ms   └─ Overlay visible, awaiting user selection
       
       [User drags to select - ~500ms]
       
550ms  ┌─ User releases mouse
       │
560ms  ├─ Extract text from DOM
       │
570ms  ├─ Send SNIP_COMPLETE message
       │
580ms  ├─ popup.js receives, updates UI
       │
600ms  └─ Text visible in textarea, ready to check

TOTAL SNIP CYCLE: ~600ms
```

## Comparison: Before & After

### BEFORE (Manual Process)

```
1. Read text on page
2. Manually select & copy  ~10 seconds
3. Switch to extension
4. Paste in textarea
5. Click Check
6. Wait for results        ~5 seconds
────────────────────────────
TOTAL TIME: ~15-20 seconds
EFFORT: High (manual selection + switching)
```

### AFTER (Snip Detection)

```
1. Click Detect button
2. Select area with snip   ~2 seconds
3. Text auto-populates
4. Click Check
5. Wait for results        ~3 seconds
────────────────────────────
TOTAL TIME: ~5-8 seconds
EFFORT: Low (visual selection, automatic)

⏱️ IMPROVEMENT: 50-60% faster! 🚀
```

## Icon Legend

```
🎯 - Snip/Select action
✅ - Success/Verified
❌ - Error/Cancel
⚠️ - Warning
🔍 - Analysis/Check
📸 - Screenshot/Snip
✓  - Verified/Complete
🔴 - Fake/Negative
🟡 - Misleading/Warning
🟢 - Likely True/Positive
🟦 - Processing/Loading
```

## Accessibility Considerations

- ✅ Clear visual feedback (green highlight, cursor change)
- ✅ Text instructions on overlay
- ✅ Keyboard shortcut (ESC to cancel)
- ✅ Status updates in badge
- ✅ High contrast colors (#00d97e on dark)
- ✅ No reliance on color alone (icons + text)

## Common Scenarios

### Scenario 1: News Article

```
WEBPAGE:
─────────────────────
🔤 "Major Discovery in Space"
   Scientists reveal...
   [Snip this section]
─────────────────────

EXTRACTION:
📝 "Major Discovery in Space 
    Scientists reveal mysterious 
    signals from outer space..."

ANALYSIS:
⏳ Checking...
🔴 LIKELY FAKE - Sensationalized
⚠️ Matches known clickbait patterns
```

### Scenario 2: Social Media Post

```
WEBPAGE:
─────────────────────
👤 John Doe posted:
   "NEW VACCINE SIDE EFFECT!!!"
   [Snip this]
─────────────────────

EXTRACTION:
📝 "NEW VACCINE SIDE EFFECT!!!
    Don't share this forwarded
    message if you care..."

ANALYSIS:
⏳ Checking...
🟡 MISLEADING - Viral forward
⚠️ 89% match with known hoax
💡 Recommendation: Don't share
```

### Scenario 3: Plain Text Message

```
WEBPAGE:
─────────────────────
WhatsApp Web/Email
"An Indian researcher 
discovers natural cure..."
[Snip message]
─────────────────────

EXTRACTION:
📝 "An Indian researcher 
    discovers natural cure 
    for COVID..."

ANALYSIS:
⏳ Checking...
🔴 FAKE - Medical misinformation
❌ No credible sources
📊 Score: 15/100
```

## Tips for Best Results

```
✅ DO:
  ├─ Select entire message/article
  ├─ Include context clues
  ├─ Use snip on main content areas
  └─ Read the analysis explanation

❌ DON'T:
  ├─ Select image-only areas
  ├─ Select ads or headers only
  ├─ Snip partial sentences
  └─ Ignore the credibility warnings
```

---

**Ready to detect misinformation?** 🚀

Use the Snip feature to quickly verify suspicious content!

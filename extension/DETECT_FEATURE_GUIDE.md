# TrustVault Detect Feature Documentation

## Overview

The **Detect Text (Snip)** feature in TrustVault extension allows users to quickly select and extract text from any website using a visual snipping tool, then immediately perform misinformation analysis on the extracted text.

## How It Works

### Step 1: Open TrustVault Extension
Click the TrustVault icon in your browser's extension menu to open the popup.

### Step 2: Click "Detect Text (Snip)" Button
The green "📸 Detect Text (Snip)" button activates snip selection mode.

```
┌─────────────────────────────────────┐
│ TrustVault                     Ready │
├─────────────────────────────────────┤
│ Language: [Auto Detect]             │
│ Paste suspicious text               │
│ [Text Input Area]                   │
│                                     │
│ ┌──────────────┬─────────────────┐  │
│ │📸 Detect     │ Check           │  │
│ │(Snip)        │ Authenticity    │  │
│ └──────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

### Step 3: Select Text Area on Page
- The page will show a **crosshair cursor**
- Click and drag to select the area containing suspicious text
- A **green highlight** will show your selection
- An on-screen instruction appears: "🎯 Click and drag to select text area"

### Step 4: Release to Extract
- Release the mouse to extract text from the selected area
- Text is automatically populated in the textarea
- Status updates to "Text extracted! ✅"

### Step 5: Auto-Check or Customize
- Edit the extracted text if needed
- Select a language if desired
- Click "Check Authenticity" to analyze
- Results appear instantly with credibility score

## Features

### ✨ Key Benefits
- **Fast & Intuitive** - Point and select, no copying/pasting
- **Visual Feedback** - See exactly what you're selecting
- **Auto-Extract** - Text is intelligently pulled from the selection area
- **Regional Language Support** - Works with Hindi, Tamil, Bengali, and more
- **Real-time Analysis** - Immediate misinformation detection

### 🎯 Supported Actions

| Action | Behavior |
|--------|----------|
| **Click & Drag** | Select text area to extract |
| **ESC Key** | Cancel snip mode |
| **Type Text** | Manually paste or type content |
| **Select Language** | Auto or choose from 11 languages |
| **Check Button** | Analyze the content |

## Text Extraction Process

### What Gets Extracted?
The snip tool extracts:
- ✅ Visible text content from selected area
- ✅ Text from elements (paragraphs, headings, links)
- ✅ Multiple lines of text up to 500 characters
- ✅ Cleaned text (extra spaces removed)

### What It Doesn't Extract?
- ❌ Images or visual elements (use image upload for that)
- ❌ Videos or embedded media
- ❌ Form inputs or hidden text

## Usage Examples

### Example 1: Check a WhatsApp Forward Screenshot
1. Open whatsapp-web.com and take screenshot
2. Click "📸 Detect Text (Snip)"
3. Select the message text
4. System extracts text from image
5. Click "Check Authenticity"
6. Get verdict: Likely Viral Forward ⚠️

### Example 2: Verify News Article Headline
1. Open a news website
2. Click "📸 Detect Text (Snip)"
3. Select the headline and first paragraph
4. Text auto-extracts to input field
5. Click "Check"
6. Get credibility score and fact-check sources

### Example 3: Check Social Media Post
1. Open Twitter/Facebook
2. Click "📸 Detect Text (Snip)"
3. Select the suspicious post
4. Extracted text appears in textarea
5. Analyze misinformation patterns
6. See forward detection results

## Advanced Features

### Language Selection
- **Auto Detect** - Automatically detects content language
- **11 Languages Supported**:
  - English 🇬🇧
  - Hindi 🇮🇳
  - Bengali 🇧🇩
  - Tamil 🇮🇳
  - Telugu 🇮🇳
  - Marathi 🇮🇳
  - Gujarati 🇮🇳
  - Kannada 🇮🇳
  - Malayalam 🇮🇳
  - Punjabi 🇵🇰

### Results Dashboard
After analysis, view:
- **Credibility Score** - 0-100 rating
- **Verdict** - Likely True 🟢 | Misleading 🟡 | Fake 🔴
- **Explanation** - Why content is flagged
- **Sources** - Fact-check links and evidence
- **Sentiment Analysis** - Emotional tone detection
- **Forward Detection** - Viral WhatsApp patterns

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **ESC** | Cancel snip mode |
| **Click + Drag** | Select text area |
| **Enter** | Submit for analysis (in text mode) |

## Troubleshooting

### ❌ Snip Mode Not Starting
**Issue**: Button doesn't activate snip mode
**Solution**:
- Ensure extension has permission for the website
- Try refreshing the page
- Close and reopen the popup

### ❌ No Text Extracted
**Issue**: Selection area shows no text
**Solution**:
- Select a larger area
- Ensure text is visible on page
- Try a different element that contains text

### ❌ Extracted Text is Incomplete
**Issue**: Only partial text extracted
**Solution**:
- Make a larger selection box
- Text is limited to 500 characters for analysis
- Manually paste additional text if needed

### ❌ Analysis Takes Too Long
**Issue**: Results loading slowly
**Solution**:
- Check internet connection
- Wait for AI processing (usually 2-5 seconds)
- For large text, try shorter excerpts

## Tips & Best Practices

### ✅ Do's
- ✅ Select the main content area
- ✅ Include context (headlines, first few lines)
- ✅ Use appropriate language setting
- ✅ Verify suspicious claims before sharing
- ✅ Cross-check with multiple sources

### ❌ Don'ts
- ❌ Select area with no text content
- ❌ Use snip for images only (use upload instead)
- ❌ Ignore credibility warnings
- ❌ Over-rely on single analysis
- ❌ Share unverified content

## Performance Notes

- **Snip Selection**: Instant
- **Text Extraction**: < 1 second
- **Analysis Time**: 2-5 seconds depending on text length
- **Language Detection**: Automatic (< 1 second)

## Permissions Required

The extension needs these permissions:
- **activeTab** - To interact with the current tab
- **tabs** - To send messages to content scripts
- **scripting** - For text extraction overlay
- **storage** - To remember your language preference

## FAQ

**Q: Can I use snip on PDF files?**
A: Yes, if the PDF is displayed in the browser. PDFs downloaded locally won't work.

**Q: Can I snip video captions?**
A: Only if the captions are overlaid as text elements. Hard-burned captions in videos cannot be extracted.

**Q: Is my selection data private?**
A: Text is sent only to TrustVault's servers for analysis. No data is stored after the check completes.

**Q: Can I undo an analysis?**
A: The application doesn't affect the original content. You can always re-analyze.

**Q: What's the character limit?**
A: Snip extraction supports up to 500 characters. Longer text will be truncated.

**Q: Does snip work in all languages?**
A: Text extraction works for any language. Analysis supports 11 languages detection.

## Integration with Other Features

### Snip → Check Authenticity Flow
```
1. Click Detect Button
   ↓
2. Visual Snip Overlay Appears
   ↓
3. Select Text Area
   ↓
4. Extract Text Automatically
   ↓
5. Populate Textarea
   ↓
6. Click "Check Authenticity"
   ↓
7. View Results & Verdict
```

### Combined with Other Inputs
- Can combine manually typed text with snipped text
- Can upload images alongside snipped text
- Language preference applies to all snipped content

## Support & Feedback

For issues or feature requests:
1. Check the troubleshooting section
2. Verify extension permissions
3. Contact support with details about what text you're trying to snip

## Version History

**v1.0.0** (Initial Release)
- ✨ Snip text selection tool
- 📄 Automatic text extraction
- 🎯 Visual selection overlay
- 🌍 Multi-language support
- 🔍 Instant misinformation analysis

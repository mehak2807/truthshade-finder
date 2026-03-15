# Detect Feature - Quick Testing Guide

## ⚡ 5-Minute Quick Start

### Step 1: Load Extension in Chrome

```
1. Open Chrome
2. Navigate to: chrome://extensions
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select: truthshade-finder/extension folder
6. Extension loads with icon in toolbar
```

### Step 2: Open a Webpage

```
1. Navigate to any news article or website
   Examples: bbc.com, cnn.com, wikipedia.org
2. Open TrustVault extension (click icon in toolbar)
3. See popup with textarea and buttons
```

### Step 3: Test Detect Feature

```
1. Click green button: "📸 Detect Text (Snip)"
2. Watch for overlay on webpage (black background, green highlight)
3. Click and drag to select text
4. Release mouse
5. Look at popup - text should appear in textarea
6. See status: "Text extracted! ✅"
```

### Step 4: Analyze Extracted Text

```
1. (Optional) Edit text in textarea if needed
2. Click dark button: "✓ Check Authenticity"
3. (Takes 2-5 seconds)
4. View results:
   - Credibility Score
   - Verdict (Fake/Misleading/Authentic)
   - Explanation
   - Sources
```

## 🔍 What to Look For

### Visual Overlay ✓
- [ ] Black semi-transparent background appears over page
- [ ] Green selection box follows your mouse
- [ ] Crosshair cursor shows over overlay
- [ ] "Click and drag" instruction visible at top
- [ ] "Press ESC to cancel" instruction visible

### Text Extraction ✓
- [ ] Selection box highlights correct area
- [ ] Text appears in popup textarea after release
- [ ] Text is readable and makes sense
- [ ] Status shows "Text extracted! ✅"
- [ ] Character count is reasonable (10-500 chars)

### Button Behavior ✓
- [ ] Detect button is green with hover effect
- [ ] Check button is dark blue
- [ ] Both buttons are side-by-side
- [ ] Buttons responsive and clickable
- [ ] Button state changes during snip

### Edge Cases to Test

```
✓ Large text areas (multiple paragraphs)
✓ Small text areas (single sentence)
✓ Text with special characters (emoji, symbols)
✓ Thin text columns (news sidebars)
✓ Different fonts and sizes
✓ Text inside images (won't work - OCR planned)
✓ Hidden text (won't extract)
```

## 🆘 Troubleshooting

### Issue: Overlay doesn't appear

**Solution:**
```
1. Check console for errors:
   Right-click → Inspect → Console tab
2. Look for error messages
3. Try on different website:
   - Some sites block content scripts (Facebook, Gmail)
   - Try: wikipedia.org or bbc.com
4. Verify manifest.json has "scripting" permission
5. Reload extension: Click refresh icon in extensions page
```

### Issue: Text doesn't extract

**Solution:**
```
1. Check selection area is visible
   - Make sure text is actually in selection box
2. Increase selection size
   - Drag wider and taller
3. Try different elements:
   - Select paragraph text (not buttons)
   - Avoid empty whitespace
4. Check console for error messages
```

### Issue: Popup text field is empty

**Solution:**
```
1. Did you see "Text extracted!" message?
   - If no: Text didn't extract from page
   - If yes: Message wasn't sent to popup
2. Check popup console:
   - Right-click popup → Inspect
   - Look for messages in Console
3. Try repeating snip on different text
```

### Issue: Extension not loading

**Solution:**
```
1. Check for manifest.json errors:
   - Right-click extension → Options
   - Look for error message
2. Verify manifest.json syntax:
   - Valid JSON (use jsonlint.com)
   - All required fields present
3. Check file structure:
   - manifest.json in root of extension/
   - popup.html, popup.js, content.js present
4. Reload extension (refresh icon)
```

### Issue: Taking text but Button not changing

**Solution:**
```
1. Check popup.js messages:
   - Open popup console
   - Select text with snip tool
   - Look for "SNIP_COMPLETE" message
2. Verify message listener:
   - Should print "Received [message type]"
   - Check content.js sending message
3. Try reloading extension
```

## 📊 Common Test Cases

### Test Case 1: News Article Text
```
Website: bbc.com
1. Find article heading and first paragraph
2. Click Detect
3. Drag over headline + first few lines
4. Release
Expected: Full text of headline + paragraph in textarea
```

### Test Case 2: Multiple Paragraphs
```
Website: wikipedia.org
1. Go to any article
2. Click Detect
3. Drag over entire "Introduction" section
4. Release
Expected: Concatenated text from all overlapping elements
```

### Test Case 3: Small Text
```
Website: any site with footnotes/captions
1. Click Detect
2. Drag small selection (5-10 words)
3. Release
Expected: Small text correctly extracted
```

### Test Case 4: Cancel Snip
```
Any website:
1. Click Detect
2. Start dragging
3. Press ESC key
4. Release mouse
Expected: Overlay disappears, popup returns to normal
```

### Test Case 5: Multi-Column Layout
```
Website: news site with sidebars
1. Click Detect
2. Drag across multiple columns
3. Release
Expected: Text from multiple columns combined
```

## 💡 Pro Tips

### For Better Results

1. **Select Complete Sentences**
   - Avoid selecting partial words
   - Extract full paragraphs for better analysis

2. **Plain Text Works Best**
   - HTML elements → plain text conversion
   - Special formatting may be lost
   - That's normal!

3. **Larger Selections = More Context**
   - Analyze multiple sentences together
   - Better accuracy with full context
   - Limited to 500 characters max

4. **Clean Up if Needed**
   - Edit extracted text before analyzing
   - Remove typos or unwanted words
   - Manually fix any OCR-like issues

## 🔧 Developer Console Access

### View Extension Messages

In Chrome DevTools:

```javascript
// Open Console in popup (right-click popup → Inspect)
// You'll see messages like:

"Detect button clicked"
"Starting snip mode..."
"Received SNIP_COMPLETE: {text: '...extracted text...'}"
"Textarea updated with extracted text"
"Check Authenticity clicked"
```

### Debug Content Script

```javascript
// On webpage where snip happens
Right-click → Inspect → Sources tab

// Find content.js in sources
// Set breakpoints on:
// - createSnipOverlay() 
// - captureTextFromArea()
// - Message listeners
```

## 📱 Mobile & Responsive

**Current Status: Desktop Only**
- Extension works on desktop Chrome
- Mobile Chrome doesn't support extensions yet
- Future enhancement: Mobile app version

## 🌍 Language Support

The Detect feature automatically:
- ✅ Detects language of extracted text
- ✅ Supports 11 regional languages
- ✅ Works with mixed-language content
- ✅ Passes language preference to analyzer

## 🎯 Success Indicators

### Feature is Working ✓
- [ ] Overlay appears immediately on "Detect" click
- [ ] Selection box tracks mouse movement smoothly
- [ ] Text populates textarea after release
- [ ] Status updates to "Text extracted!"
- [ ] Extracted text can be analyzed
- [ ] Green button is clearly visible and distinct

### Ready for Production ✓
- [ ] No console errors
- [ ] Works on 3+ different websites
- [ ] Extracting various text lengths
- [ ] Analysis results display correctly
- [ ] ESC key cancels properly
- [ ] Image upload still functional

## 📞 Known Limitations

1. **Blocked by Content Security Policy**
   - Some websites don't allow content scripts
   - Extensions like Banks, Gmail may block
   - Solution: Use screenshot upload as fallback

2. **No OCR Support Yet**
   - Can't extract text from images
   - Text must be selectable by browser
   - Planned for future enhancement

3. **Limited to Visible Text**
   - Hidden or overflow text not extracted
   - CSS display:none elements excluded
   - That's by design for accuracy

4. **500 Character Limit**
   - Prevents excessive analysis requests
   - Can manually paste more text
   - Adjustable in content.js if needed

## 🚀 Next Steps

After testing works:

1. **Deploy**
   - Package for Chrome Web Store
   - Submit for app review

2. **Gather Feedback**
   - User testing on real misinformation
   - Performance optimization
   - Error handling improvements

3. **Enhance**
   - Add OCR for image text
   - Keyboard shortcuts
   - Selection history
   - Batch processing

---

## ✅ Final Checklist

Before declaring feature complete:

```
FUNCTIONALITY:
- [ ] Detect button opens snip overlay
- [ ] Snip overlay has visual feedback
- [ ] Text extracts correctly
- [ ] Textarea auto-populates
- [ ] Analysis works on extracted text

VISUAL DESIGN:
- [ ] Layout is clean and professional
- [ ] Buttons are clearly visible
- [ ] Colors match TrustVault branding
- [ ] Overlay doesn't cover instructions

UI/UX:
- [ ] Instructions are clear
- [ ] Status updates are helpful
- [ ] Errors have good messages
- [ ] ESC key works for cancellation

PERFORMANCE:
- [ ] Overlay appears instantly
- [ ] Text extracts in <1 second
- [ ] No lag or stuttering
- [ ] Buttons respond immediately

TESTING:
- [ ] Works on 5+ websites
- [ ] Different screen sizes
- [ ] No console errors
- [ ] Message passing verified
```

Good luck with testing! 🎉

For detailed technical info, see:
- `DETECT_IMPLEMENTATION.md` - How it works
- `DETECT_FEATURE_GUIDE.md` - User guide
- `DETECT_VISUAL_GUIDE.md` - Visual flowcharts

# Detect Feature - Technical Implementation Guide

## Architecture Overview

The Detect Text (Snip) feature implements a multi-stage text extraction pipeline:

```
┌─────────────────┐
│   Popup.js      │
│  (Frontend UI)  │
└────────┬────────┘
         │
         ├─ User clicks "Detect" button
         │
         ▼
┌─────────────────┐
│ Content.js      │
│ (Page Overlay)  │
└────────┬────────┘
         │
         ├─ Create snip overlay
         ├─ Show crosshair cursor
         ├─ Listen for selection
         │
         ▼
┌─────────────────┐
│ Text Extraction │
│ from DOM        │
└────────┬────────┘
         │
         ├─ Get elements in selection area
         ├─ Extract textContent
         ├─ Clean & normalize text
         ├─ Limit to 500 characters
         │
         ▼
┌─────────────────┐
│ Popup.js        │
│ (Results)       │
└────────┬────────┘
         │
         ├─ Receive extracted text
         ├─ Auto-populate textarea
         ├─ Enable analysis button
         │
         ▼
┌─────────────────┐
│ Misinformation  │
│ Detection API   │
└─────────────────┘
```

## File Structure

```
extension/
├── popup.html          # Main UI with Detect button
├── popup.js            # Popup logic + snip handler
├── content.js          # Page overlay + text extraction
├── background.js       # Service worker
├── manifest.json       # Extension config (updated)
├── styles.css          # UI styling (updated)
├── DETECT_FEATURE_GUIDE.md    # User guide
└── DETECT_IMPLEMENTATION.md   # This file
```

## Component Details

### 1. popup.html Changes

**New Elements:**
```html
<div class="button-group">
  <button id="detectBtn" class="detect-btn">📸 Detect Text (Snip)</button>
  <button id="checkBtn" class="primary-btn">Check Authenticity</button>
</div>
```

- Replaced single button with button group
- Two-button layout: Detect (green), Check (dark)
- Responsive design

### 2. popup.js Enhancements

**New Functions:**

#### `startSnipMode()`
- Queries active tab
- Sends START_SNIP_MODE message to content script
- Sets UI to "snip mode active"
- Disables detect button during snip

```javascript
async function startSnipMode() {
  // Get active tab
  // Send message to content.js
  // Update UI status
}
```

#### Message Listener
Handles three message types from content.js:

```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SNIP_COMPLETE") {
    // Extract successful
    textInput.value = message.text;
    setStatus("Text extracted!", "ok");
  } else if (message.type === "SNIP_ERROR") {
    // Extraction failed
    setStatus("Snip error", "warn");
  } else if (message.type === "SNIP_CANCELLED") {
    // User pressed ESC
    setStatus("Snip cancelled", "idle");
  }
});
```

**New Event Listeners:**
```javascript
detectBtn.addEventListener("click", () => startSnipMode());
```

### 3. content.js Complete Rewrite

**Key Features:**

#### Overlay Creation
```javascript
function createSnipOverlay() {
  // Create main overlay div (dark, semi-transparent)
  // Create selection box (green border, glowing)
  // Create instruction text
}
```

**Styling:**
- Main overlay: Fixed position, transparent black, full screen
- Selection box: Green border (#00d97e), semi-transparent fill, 2px border, glowing shadow
- Instruction: Centered at top, green text, dark background

#### Mouse Event Handling
```javascript
overlay.addEventListener("mousedown", (e) => {
  // Start selection
  // Record starting coordinates
});

overlay.addEventListener("mousemove", (e) => {
  // Update selection box in real-time
  // Show visual feedback
});

overlay.addEventListener("mouseup", (e) => {
  // Finalize selection
  // Extract text from area
  // Send to popup
  // Cleanup overlay
});
```

#### Text Extraction
```javascript
function captureTextFromArea(x, y, width, height) {
  // 1. Get all elements at selection point
  const elements = document.elementsFromPoint(x + width/2, y + height/2);
  
  // 2. Filter overlapping elements
  for (let el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.overlaps(selection)) {
      extractedText += el.textContent + " ";
    }
  }
  
  // 3. Clean text
  extractedText = extractedText
    .trim()
    .replace(/\s+/g, " ") // Remove extra spaces
    .substring(0, 500);    // Limit length
  
  // 4. Send to popup
  chrome.runtime.sendMessage({
    type: "SNIP_COMPLETE",
    text: extractedText
  });
}
```

#### Keyboard Handling
```javascript
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Cancel snip mode
    // Remove overlay
    // Reset button state
  }
});
```

### 4. CSS Enhancements

**New Classes:**

```css
.button-group {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.detect-btn {
  flex: 1;
  background: linear-gradient(135deg, #00d97e, #00c969);
  /* Green gradient for snip button */
  border-radius: 10px;
  padding: 10px 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.detect-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #00c969, #00b759);
  box-shadow: 0 4px 12px rgba(0, 217, 126, 0.3);
}

.detect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 5. manifest.json Updates

**Permission Changes:**
```json
"permissions": [
  "contextMenus",
  "activeTab",
  "tabs",
  "storage",
  "scripting"  // NEW: Required for content script access
]
```

**Content Script Changes:**
```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_idle",
    "all_frames": true  // NEW: Support nested frames
  }
]
```

## Message Flow

### Snip Initiation
```
User clicks Detect
  ↓
popup.js: startSnipMode()
  ↓
chrome.tabs.sendMessage({type: "START_SNIP_MODE"})
  ↓
content.js receives message
  ↓
createSnipOverlay()
```

### Snip Completion
```
User selects area & releases
  ↓
captureTextFromArea()
  ↓
Extract text from DOM
  ↓
Clean & normalize
  ↓
chrome.runtime.sendMessage({type: "SNIP_COMPLETE", text: extractedText})
  ↓
popup.js receives message
  ↓
textInput.value = extractedText
  ↓
Update UI status: "Text extracted! ✅"
```

### Snip Cancellation
```
User presses ESC
  ↓
content.js: handleEsc()
  ↓
Remove overlay
  ↓
chrome.runtime.sendMessage({type: "SNIP_CANCELLED"})
  ↓
popup.js resets UI
```

## Data Flow & Processing

### 1. Text Selection
- User drags to define rectangular area
- Selection box updates in real-time with coordinates
- Z-index hierarchy ensures visibility

### 2. Element Detection
```javascript
// Find all elements at selection center point
const elements = document.elementsFromPoint(x, y);

// Filter by overlap with selection area
for (let el of elements) {
  // Check bounding rect overlap
  if (isOverlapping(el.getBoundingClientRect(), selectionRect)) {
    // Extract text
  }
}
```

### 3. Text Extraction
- Concatenate textContent from all matching elements
- Remove HTML/formatting
- Normalize whitespace
- Limit to 500 characters (API limit)

### 4. Text Cleaning
```javascript
text = text
  .trim()           // Remove leading/trailing whitespace
  .replace(/\s+/g, " ")  // Collapse multiple spaces
  .substring(0, 500);     // Enforce length limit
```

## Error Handling

### Snip Mode Failures

```javascript
try {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tabs[0]?.id) throw new Error("No active tab");
  
  await chrome.tabs.sendMessage(tabs[0].id, {type: "START_SNIP_MODE"});
} catch (error) {
  setStatus("Snip mode failed", "warn");
  // Graceful degradation - user can still paste text manually
}
```

### No Text Found
```javascript
if (!extractedText) {
  chrome.runtime.sendMessage({
    type: "SNIP_ERROR",
    message: "No text found in selected area"
  });
  // User is informed to try different area
}
```

## Performance Considerations

### Overlay Rendering
- Pure CSS transitions for smooth selection box
- No heavy computations during mousemove
- Debouncing not needed (native event handling)

### Text Extraction
- Single pass through DOM
- Efficient getBoundingClientRect() usage
- String concatenation optimized with substring limit

### Memory Usage
- Overlay elements removed immediately after use
- No persistent DOM modifications
- Event listeners cleaned up on completion

## Browser Compatibility

| Feature | Chrome | Edge | Firefox |
|---------|--------|------|---------|
| Manifest v3 | ✅ Full | ✅ Full | ⚠️ Partial |
| Content Scripts | ✅ Full | ✅ Full | ✅ Full |
| elementFromPoint | ✅ Full | ✅ Full | ✅ Full |
| CSS Gradients | ✅ Full | ✅ Full | ✅ Full |
| Message API | ✅ Full | ✅ Full | ✅ Full |

## Security Considerations

### User Privacy
- Text is only extracted from visible elements
- No tracking of selection patterns
- No server logs of extracted content

### XSS Prevention
- No eval() or dynamic script injection
- DOMContent always treated as text
- No HTML injection

### Content Isolation
- Snip overlay runs in isolated context
- Cannot access cross-origin resources
- Respects browser sandboxing

## Testing Checklist

- [ ] Click Detect button activates snip mode
- [ ] Overlay appears with instructions
- [ ] Cursor changes to crosshair
- [ ] Selection box shows green highlight
- [ ] Text extraction works on various elements
- [ ] ESC key cancels snip mode
- [ ] Extracted text populates textarea
- [ ] Status updates show correct messages
- [ ] Works across different websites
- [ ] Works with different text formats
- [ ] Handles empty selections gracefully
- [ ] Check Authenticity triggers after snip

## Future Enhancements

### Potential Features
1. **OCR Support** - Extract text from images using Tesseract.js
2. **Multi-language Extraction** - Better handling of mixed-language text
3. **Smart Selection** - Auto-expand selection to complete paragraphs
4. **History** - Store recent snips for reference
5. **Annotations** - Highlight flagged sections
6. **Batch Processing** - Multiple snips in sequence

### Performance Improvements
1. Web Workers for text extraction
2. Service Worker caching
3. Compression for large text
4. Lazy loading of analysis results

## Related Documentation

- [User Guide](./DETECT_FEATURE_GUIDE.md)
- [Extension README](./README.md)
- [API Documentation](../API_DOCUMENTATION.md)

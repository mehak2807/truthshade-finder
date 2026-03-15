let lastSelection = "";
let isSnipMode = false;
let snippedText = "";

function updateSelection() {
  const selected = window.getSelection();
  lastSelection = selected ? selected.toString().trim() : "";
}

document.addEventListener("mouseup", updateSelection);
document.addEventListener("keyup", updateSelection);
document.addEventListener("selectionchange", updateSelection);

// Snip selector overlay
function createSnipOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "trustvault-snip-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    cursor: crosshair;
    z-index: 10000;
    user-select: none;
  `;

  const selectionBox = document.createElement("div");
  selectionBox.id = "trustvault-selection-box";
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px solid #00d97e;
    background: rgba(0, 217, 126, 0.1);
    cursor: crosshair;
    z-index: 10001;
    display: none;
    box-shadow: 0 0 10px rgba(0, 217, 126, 0.5);
  `;

  const instructionDiv = document.createElement("div");
  instructionDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: #00d97e;
    padding: 12px 20px;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    font-size: 14px;
    font-weight: 600;
    z-index: 10002;
    white-space: nowrap;
  `;
  instructionDiv.textContent = "🎯 Click and drag to select text area - Press ESC to cancel";

  document.body.appendChild(overlay);
  document.body.appendChild(selectionBox);
  document.body.appendChild(instructionDiv);

  let startX = 0,
    startY = 0;
  let isSelecting = false;

  overlay.addEventListener("mousedown", (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.display = "block";
  });

  overlay.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.left = x + "px";
    selectionBox.style.top = y + "px";
    selectionBox.style.width = width + "px";
    selectionBox.style.height = height + "px";
  });

  overlay.addEventListener("mouseup", (e) => {
    if (!isSelecting) return;
    isSelecting = false;

    const x = Math.min(startX, e.clientX);
    const y = Math.min(startY, e.clientY);
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);

    if (width > 10 && height > 10) {
      // Capture the selected area
      captureTextFromArea(x, y, width, height);
    }

    // Cleanup
    overlay.remove();
    selectionBox.remove();
    instructionDiv.remove();
    isSnipMode = false;
  });

  // Cancel on ESC
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      overlay.remove();
      selectionBox.remove();
      instructionDiv.remove();
      isSnipMode = false;
      document.removeEventListener("keydown", handleEsc);
      chrome.runtime.sendMessage({ type: "SNIP_CANCELLED" });
    }
  };

  document.addEventListener("keydown", handleEsc);
}

function captureTextFromArea(x, y, width, height) {
  // Get text content from the selected area
  const elements = document.elementsFromPoint(x + width / 2, y + height / 2);
  let extractedText = "";

  for (let el of elements) {
    if (
      el.offsetWidth > 0 &&
      el.offsetHeight > 0 &&
      el.nodeType !== Node.COMMENT_NODE
    ) {
      const rect = el.getBoundingClientRect();
      // Check if element overlaps with selection
      if (
        rect.left < x + width &&
        rect.right > x &&
        rect.top < y + height &&
        rect.bottom > y
      ) {
        extractedText += el.textContent + " ";
      }
    }
  }

  extractedText = extractedText
    .trim()
    .replace(/\s+/g, " ")
    .substring(0, 500);

  if (extractedText) {
    snippedText = extractedText;
    chrome.runtime.sendMessage(
      {
        type: "SNIP_COMPLETE",
        text: extractedText,
      },
      (response) => {
        if (response?.success) {
          // Text sent successfully
        }
      }
    );
  } else {
    chrome.runtime.sendMessage(
      { type: "SNIP_ERROR", message: "No text found in selected area" },
      (response) => {
        if (response?.acknowledged) {
          // Error acknowledged
        }
      }
    );
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GET_SELECTED_TEXT") {
    updateSelection();
    sendResponse({ text: lastSelection });
  } else if (message?.type === "START_SNIP_MODE") {
    isSnipMode = true;
    createSnipOverlay();
    sendResponse({ success: true });
  }
});

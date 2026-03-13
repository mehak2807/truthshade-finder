let lastSelection = "";

function updateSelection() {
  const selected = window.getSelection();
  lastSelection = selected ? selected.toString().trim() : "";
}

document.addEventListener("mouseup", updateSelection);
document.addEventListener("keyup", updateSelection);
document.addEventListener("selectionchange", updateSelection);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GET_SELECTED_TEXT") {
    updateSelection();
    sendResponse({ text: lastSelection });
  }
});

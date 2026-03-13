const API_ENDPOINT = "http://localhost:3000/api/fact-check";
const MENU_ID = "truthshade-verify-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Verify this with AI",
    contexts: ["selection"],
  });
});

async function callFactCheck(payload) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed (${response.status}): ${text || "Unknown error"}`);
  }

  return response.json();
}

function normalizeResult(result) {
  const score = Number(result?.credibility_score ?? 0);
  const verdictRaw = String(result?.verdict ?? "Unverified");
  let verdict = verdictRaw;

  if (/likely false|false|fake/i.test(verdictRaw)) {
    verdict = "Fake";
  } else if (/misleading/i.test(verdictRaw)) {
    verdict = "Misleading";
  } else if (/true/i.test(verdictRaw)) {
    verdict = "Likely True";
  }

  const sources = Array.isArray(result?.sources) ? result.sources : [];

  return {
    credibility_score: Math.max(0, Math.min(100, score)),
    verdict,
    explanation: String(result?.explanation ?? "No explanation returned."),
    sources,
  };
}

async function getSelectionFromTab(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: "GET_SELECTED_TEXT" });
    return typeof response?.text === "string" ? response.text.trim() : "";
  } catch {
    return "";
  }
}

async function verifyAndStore(content, type) {
  chrome.action.setBadgeText({ text: "..." });
  chrome.action.setBadgeBackgroundColor({ color: "#0f172a" });

  try {
    const apiResult = await callFactCheck({ content, type });
    const normalized = normalizeResult(apiResult);
    const lastResult = {
      ...normalized,
      content,
      type,
      checkedAt: new Date().toISOString(),
    };

    await chrome.storage.local.set({ lastResult });

    const isWarning =
      normalized.verdict === "Fake" ||
      normalized.verdict === "Misleading" ||
      normalized.credibility_score < 50;

    chrome.action.setBadgeText({ text: isWarning ? "!" : "OK" });
    chrome.action.setBadgeBackgroundColor({ color: isWarning ? "#b91c1c" : "#166534" });

    return lastResult;
  } catch (error) {
    chrome.action.setBadgeText({ text: "ERR" });
    chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
    throw error;
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;

  const selected = (info.selectionText || "").trim();
  const content = selected || (tab?.id ? await getSelectionFromTab(tab.id) : "");

  if (!content) {
    chrome.action.setBadgeText({ text: "NO" });
    chrome.action.setBadgeBackgroundColor({ color: "#7c2d12" });
    return;
  }

  try {
    await verifyAndStore(content, "text");
  } catch (error) {
    chrome.action.setBadgeText({ text: "ERR" });
    chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
    console.error("Context menu verification failed", error);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "VERIFY_CONTENT") {
    verifyAndStore(message.content, message.inputType)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }));
    return true;
  }

  if (message?.type === "GET_LAST_RESULT") {
    chrome.storage.local.get(["lastResult"]).then((stored) => {
      sendResponse({ ok: true, result: stored.lastResult || null });
    });
    return true;
  }

  if (message?.type === "GET_ACTIVE_TAB_SELECTION") {
    chrome.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ ok: true, text: "" });
        return;
      }
      const text = await getSelectionFromTab(tab.id);
      sendResponse({ ok: true, text });
    });
    return true;
  }
});

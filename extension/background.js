const DEFAULT_API_ENDPOINT = "https://rbbdjyhijolreehhojva.supabase.co/functions/v1/fact-check";
const MENU_ID = "trustvault-verify-selection";
const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5500;

function hashInput(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

async function getApiEndpoint() {
  const stored = await chrome.storage.local.get(["apiEndpoint"]);
  return stored.apiEndpoint || DEFAULT_API_ENDPOINT;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Verify this with AI",
    contexts: ["selection"],
  });
});

async function callFactCheck(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const API_ENDPOINT = await getApiEndpoint();
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed (${response.status}): ${text || "Unknown error"}`);
  }

  return response.json();
}

async function readResultCache(cacheKey) {
  const stored = await chrome.storage.local.get(["resultCache"]);
  const cache = stored.resultCache || {};
  const entry = cache[cacheKey];
  if (!entry) return null;
  const fresh = Date.now() - Number(entry.savedAt || 0) <= CACHE_TTL_MS;
  return fresh ? entry.result : null;
}

async function writeResultCache(cacheKey, result) {
  const stored = await chrome.storage.local.get(["resultCache"]);
  const cache = stored.resultCache || {};
  cache[cacheKey] = { result, savedAt: Date.now() };
  await chrome.storage.local.set({ resultCache: cache });
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

  // Normalize sentiment: validate fields so the popup renders safely even with partial data.
  const rawSentiment = result?.sentiment;
  let sentiment = null;
  if (rawSentiment && typeof rawSentiment === "object") {
    const validSentiments = ["positive", "neutral", "negative"];
    const validIntensities = ["low", "medium", "high"];
    sentiment = {
      sentiment: validSentiments.includes(rawSentiment.sentiment) ? rawSentiment.sentiment : "neutral",
      sentiment_score: typeof rawSentiment.sentiment_score === "number"
        ? Math.max(-1, Math.min(1, rawSentiment.sentiment_score))
        : 0,
      emotional_intensity: validIntensities.includes(rawSentiment.emotional_intensity)
        ? rawSentiment.emotional_intensity
        : "low",
      explanation: typeof rawSentiment.explanation === "string" ? rawSentiment.explanation : "",
    };
  }

  return {
    credibility_score: Math.max(0, Math.min(100, score)),
    verdict,
    explanation: String(result?.explanation ?? "No explanation returned."),
    sources,
    forward_detected: Boolean(result?.forward_detected),
    similarity_score: Number(result?.similarity_score ?? 0),
    risk_score: Number(result?.risk_score ?? 0),
    forward_verdict: String(result?.forward_verdict ?? "No match"),
    detected_pattern: String(result?.detected_pattern ?? ""),
    message_type: String(result?.message_type ?? ""),
    recommended_action: String(result?.recommended_action ?? ""),
    forward_signals: Array.isArray(result?.forward_signals) ? result.forward_signals : [],
    forward_explanation: String(result?.forward_explanation ?? ""),
    sentiment,
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

async function verifyAndStore(content, type, language = "auto") {
  const cacheKey = `${type}:${language}:${hashInput(content.slice(0, 1200))}`;
  const cachedResult = await readResultCache(cacheKey);
  if (cachedResult) {
    await chrome.storage.local.set({ lastResult: cachedResult });
    return cachedResult;
  }

  chrome.action.setBadgeText({ text: "..." });
  chrome.action.setBadgeBackgroundColor({ color: "#0f172a" });

  try {
    const apiResult = await callFactCheck({ content, type, language });
    const normalized = normalizeResult(apiResult);
    const lastResult = {
      ...normalized,
      content,
      type,
      detected_language: apiResult?.detected_language || "en",
      output_language: apiResult?.output_language || (language === "auto" ? apiResult?.detected_language || "en" : language),
      checkedAt: new Date().toISOString(),
    };

    await chrome.storage.local.set({ lastResult });
    await writeResultCache(cacheKey, lastResult);

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
    await verifyAndStore(content, "text", "auto");
  } catch (error) {
    chrome.action.setBadgeText({ text: "ERR" });
    chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
    console.error("Context menu verification failed", error);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "VERIFY_CONTENT") {
    verifyAndStore(message.content, message.inputType, message.language || "auto")
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

const textInput = document.getElementById("textInput");
const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");
const languageSelect = document.getElementById("languageSelect");
const preview = document.getElementById("preview");
const checkBtn = document.getElementById("checkBtn");
const loading = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");
const scoreText = document.getElementById("scoreText");
const verdictPill = document.getElementById("verdictPill");
const scoreFill = document.getElementById("scoreFill");
const explanationText = document.getElementById("explanationText");
const sourceList = document.getElementById("sourceList");
const warningText = document.getElementById("warningText");
const statusBadge = document.getElementById("statusBadge");
const languageInfo = document.getElementById("languageInfo");
const forwardAlert = document.getElementById("forwardAlert");
const forwardSimilarity = document.getElementById("forwardSimilarity");
const forwardPatterns = document.getElementById("forwardPatterns");
const forwardRecommendation = document.getElementById("forwardRecommendation");
const sentimentSection = document.getElementById("sentimentSection");
const sentimentPositive = document.getElementById("sentimentPositive");
const sentimentNeutral = document.getElementById("sentimentNeutral");
const sentimentNegative = document.getElementById("sentimentNegative");
const intensityBar = document.getElementById("intensityBar");
const intensityPercent = document.getElementById("intensityPercent");
const sentimentExplanation = document.getElementById("sentimentExplanation");

let imageData = "";

const languageNames = {
  auto: "Auto Detect",
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
};

const verdictLocalization = {
  en: { "Likely True": "Likely True", Misleading: "Misleading", Fake: "Fake", Unverified: "Unverified" },
  hi: { "Likely True": "संभवतः सही", Misleading: "भ्रामक", Fake: "फर्जी", Unverified: "असत्यापित" },
  bn: { "Likely True": "সম্ভবত সত্য", Misleading: "বিভ্রান্তিকর", Fake: "ভুয়া", Unverified: "যাচাই হয়নি" },
  ta: { "Likely True": "சாத்தியமான உண்மை", Misleading: "தவறாக வழிநடத்தும்", Fake: "போலி", Unverified: "சரிபார்க்கப்படவில்லை" },
  te: { "Likely True": "బహుశా నిజం", Misleading: "తప్పుదారి పట్టించే", Fake: "నకిలీ", Unverified: "ధృవీకరించలేదు" },
  mr: { "Likely True": "बहुधा खरे", Misleading: "दिशाभूल करणारे", Fake: "खोटे", Unverified: "अप्रमाणित" },
  gu: { "Likely True": "શક્યતા મુજબ સાચું", Misleading: "ભ્રામક", Fake: "ખોટું", Unverified: "અચકાસાયેલું" },
  kn: { "Likely True": "ಬಹುಶಃ ಸತ್ಯ", Misleading: "ತಪ್ಪುದಾರಿ ಮಾಡುವ", Fake: "ನಕಲಿ", Unverified: "ಪರಿಶೀಲಿಸದ" },
  ml: { "Likely True": "സാധ്യതയുള്ള സത്യം", Misleading: "തെറ്റിദ്ധരിപ്പിക്കുന്നത്", Fake: "വ്യാജം", Unverified: "സ്ഥിരീകരിച്ചിട്ടില്ല" },
  pa: { "Likely True": "ਸ਼ਾਇਦ ਸਹੀ", Misleading: "ਭ੍ਰਮਿਤ ਕਰਨ ਵਾਲਾ", Fake: "ਨਕਲੀ", Unverified: "ਪੁਸ਼ਟੀ ਨਹੀਂ" },
};

function getVerdictIcon(verdict) {
  if (verdict === "Likely True") return "🟢";
  if (verdict === "Misleading") return "🟡";
  if (verdict === "Fake") return "🔴";
  return "⚪";
}

function setLoading(isLoading) {
  loading.hidden = !isLoading;
  checkBtn.disabled = isLoading;
  statusBadge.textContent = isLoading ? "Checking" : "Ready";
}

function setStatus(text, state = "idle") {
  statusBadge.textContent = text;
  statusBadge.className = `badge ${state}`;
}

function normalizeVerdict(verdictRaw, score) {
  const verdict = String(verdictRaw || "Unverified");
  if (/fake|false/i.test(verdict)) return "Fake";
  if (/misleading/i.test(verdict)) return "Misleading";
  if (/true/i.test(verdict)) return "Likely True";

  if (score >= 70) return "Likely True";
  if (score <= 40) return "Fake";
  return "Misleading";
}

function renderSources(sources) {
  sourceList.innerHTML = "";

  if (!Array.isArray(sources) || sources.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No source links were returned by the API.";
    sourceList.appendChild(li);
    return;
  }

  sources.forEach((source) => {
    const li = document.createElement("li");

    if (typeof source === "string") {
      li.innerHTML = `<a href="${source}" target="_blank" rel="noreferrer">${source}</a>`;
      sourceList.appendChild(li);
      return;
    }

    const title = source.title || source.url || "Reference link";
    const url = source.url || "#";
    const snippet = source.snippet || "";

    li.innerHTML = `
      <a href="${url}" target="_blank" rel="noreferrer">${title}</a>
      ${snippet ? `<p>${snippet}</p>` : ""}
    `;

    sourceList.appendChild(li);
  });
}

function renderResult(result) {
  const score = Math.max(0, Math.min(100, Number(result.credibility_score || 0)));
  const verdict = normalizeVerdict(result.verdict, score);
  const selectedLanguage = languageSelect.value || "auto";
  const outputLanguage = result.output_language || (selectedLanguage === "auto" ? result.detected_language || "en" : selectedLanguage);
  const localizedVerdict =
    verdictLocalization[outputLanguage]?.[verdict] || verdictLocalization.en[verdict] || verdict;

  scoreText.textContent = `${score}/100`;
  verdictPill.textContent = `${getVerdictIcon(verdict)} ${localizedVerdict}`;
  verdictPill.className = `pill ${verdict.toLowerCase().replace(/\s+/g, "-")}`;
  scoreFill.style.width = `${score}%`;
  languageInfo.textContent = `Input: ${languageNames[result.detected_language] || result.detected_language || "Unknown"} | Result: ${languageNames[outputLanguage] || outputLanguage}`;

  explanationText.textContent = result.explanation || "No explanation provided by API.";
  renderSources(result.sources);

  const showWarning = verdict === "Fake" || verdict === "Misleading" || score < 50;
  warningText.hidden = !showWarning;
  warningText.textContent = showWarning
    ? "Warning: This content may contain misinformation. Cross-check before sharing."
    : "";

  resultCard.hidden = false;
  setStatus(showWarning ? "Warning" : "Verified", showWarning ? "warn" : "ok");

  const forwardDetected = Boolean(result.forward_detected);
  forwardAlert.hidden = !forwardDetected;
  forwardPatterns.innerHTML = "";

  if (forwardDetected) {
    const similarityPercent = Math.round(Number(result.similarity_score || 0) * 100);
    forwardSimilarity.textContent = `Similarity Match: ${similarityPercent}%`;

    const detectedPattern = result.detected_pattern || "Known viral forward pattern";
    const suspiciousSignals = Array.isArray(result.forward_signals) ? result.forward_signals.slice(0, 2) : [];

    [detectedPattern, ...suspiciousSignals].forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      forwardPatterns.appendChild(li);
    });

    forwardRecommendation.textContent =
      result.recommended_action || "Do not forward this message.";
  }

  const sentiment = result.sentiment;
  if (sentiment && typeof sentiment === "object") {
    sentimentSection.hidden = false;

    sentimentPositive.classList.toggle("active", sentiment.sentiment === "positive");
    sentimentNeutral.classList.toggle("active", sentiment.sentiment === "neutral");
    sentimentNegative.classList.toggle("active", sentiment.sentiment === "negative");

    // Intensity → percentage: low=30%, medium=60%, high=80% (subjective UX thresholds for bar width)
    const intensityMap = { low: 30, medium: 60, high: 80 };
    const DEFAULT_INTENSITY_PCT = intensityMap.low;
    const pct = intensityMap[sentiment.emotional_intensity] ?? DEFAULT_INTENSITY_PCT;
    intensityBar.style.width = `${pct}%`;
    intensityBar.dataset.intensity = sentiment.emotional_intensity || "low";
    intensityPercent.textContent = `${pct}%`;

    sentimentExplanation.textContent = sentiment.explanation || "";
  } else {
    sentimentSection.hidden = true;
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

async function loadImage(file) {
  if (!file) return;
  if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
    setStatus("PNG/JPG only", "warn");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    setStatus("Image too large", "warn");
    return;
  }

  imageData = await readFileAsDataURL(file);
  preview.src = imageData;
  preview.hidden = false;
  setStatus("Screenshot loaded", "ok");
}

async function initSelectedText() {
  const response = await chrome.runtime.sendMessage({ type: "GET_ACTIVE_TAB_SELECTION" });
  if (response?.ok && response.text) {
    textInput.value = response.text;
  }
}

async function initLastResult() {
  const response = await chrome.runtime.sendMessage({ type: "GET_LAST_RESULT" });
  if (response?.ok && response.result) {
    renderResult(response.result);
  }
}

async function saveSelectedLanguage() {
  await chrome.storage.local.set({ preferredLanguage: languageSelect.value || "auto" });
}

async function initLanguagePreference() {
  const stored = await chrome.storage.local.get(["preferredLanguage"]);
  const preferred = stored.preferredLanguage || "auto";
  languageSelect.value = preferred;
}

async function runVerification() {
  const text = textInput.value.trim();
  const useImage = !text && !!imageData;

  if (!text && !imageData) {
    setStatus("Add text or screenshot", "warn");
    return;
  }

  setLoading(true);
  setStatus("Analyzing", "idle");
  resultCard.hidden = true;

  try {
    const response = await chrome.runtime.sendMessage({
      type: "VERIFY_CONTENT",
      content: useImage ? imageData : text,
      inputType: useImage ? "screenshot" : "text",
      language: languageSelect.value || "auto",
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Verification request failed.");
    }

    renderResult(response.result);
  } catch (error) {
    setStatus("Request failed", "warn");
    warningText.hidden = false;
    warningText.textContent = error instanceof Error ? error.message : "Unexpected error.";
    resultCard.hidden = false;
  } finally {
    setLoading(false);
  }
}

browseBtn.addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) void loadImage(file);
});

["dragenter", "dragover"].forEach((evt) => {
  dropZone.addEventListener(evt, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropZone.addEventListener(evt, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (file) void loadImage(file);
});

document.addEventListener("paste", (event) => {
  const items = event.clipboardData?.items || [];
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        void loadImage(file);
        break;
      }
    }
  }
});

checkBtn.addEventListener("click", () => {
  void runVerification();
});

languageSelect.addEventListener("change", () => {
  void saveSelectedLanguage();
});

void initSelectedText();
void initLastResult();
void initLanguagePreference();

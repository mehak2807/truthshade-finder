const textInput = document.getElementById("textInput");
const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");
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

let imageData = "";

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

  scoreText.textContent = `${score}/100`;
  verdictPill.textContent = verdict;
  verdictPill.className = `pill ${verdict.toLowerCase().replace(/\s+/g, "-")}`;
  scoreFill.style.width = `${score}%`;

  explanationText.textContent = result.explanation || "No explanation provided by API.";
  renderSources(result.sources);

  const showWarning = verdict === "Fake" || verdict === "Misleading" || score < 50;
  warningText.hidden = !showWarning;
  warningText.textContent = showWarning
    ? "Warning: This content may contain misinformation. Cross-check before sharing."
    : "";

  resultCard.hidden = false;
  setStatus(showWarning ? "Warning" : "Verified", showWarning ? "warn" : "ok");
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

void initSelectedText();
void initLastResult();

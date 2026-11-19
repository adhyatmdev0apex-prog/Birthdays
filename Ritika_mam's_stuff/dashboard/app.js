const DEFAULT_CONFIG = {
  recipient: "Ritika Ma'am",
  profession: "Teacher",
  relationshipToRitika: "",
  occasionDate: "",
  headline: "A birthday tribute, shaped with gratitude.",
  openingLine: "Some people make every ordinary moment feel like it belongs in a story.",
  memorySource: "blended",
  portraitImage: "",
  memories: [
    { image: "", title: "Light in Every Moment", caption: "A snapshot of the moments that make this story yours." },
    { image: "", title: "Smiles Along the Way", caption: "Shared laughter and little moments that stay with us." },
    { image: "", title: "Moments of Pride", caption: "A milestone made brighter by having you there." },
    { image: "", title: "Gratitude Held in Time", caption: "A memory we will always look back on with warmth." }
  ],
  wishes: [
    { text: "Wishing you a year filled with good health, peaceful mornings, and all the happiness you deserve.", author: "With deepest gratitude" },
    { text: "Thank you for the kindness, encouragement, and joy you bring to the people around you.", author: "With love and appreciation" },
    { text: "May this new year bring you new adventures, well-deserved rest, and countless reasons to smile every day.", author: "With warmest wishes" }
  ],
  celebrationMessage: "Wishing you a truly wonderful birthday and a bright, fulfilling year ahead! May good health, peace, and happiness follow you wherever you go.",
  finalMessage: "Thank you for being a guide we will always look up to. May this year bring you peace, joy, and bright new chapters.",
  finalClosing: "With deepest respect and warmest wishes, always."
};

const form = document.querySelector("#draft-form");
const contentForm = document.querySelector("#content-form");
const formMessage = document.querySelector("#form-message");
const contentFormMessage = document.querySelector("#content-form-message");
const saveState = document.querySelector("#save-state");
const toast = document.querySelector("#toast");
const fields = {
  recipient: document.querySelector("#recipient"),
  profession: document.querySelector("#profession"),
  relationshipToRitika: document.querySelector("#relationshipToRitika"),
  occasionDate: document.querySelector("#occasionDate"),
  headline: document.querySelector("#headline"),
  openingLine: document.querySelector("#openingLine")
};
const contentFields = {
  celebrationMessage: document.querySelector("#celebration-message"),
  finalMessage: document.querySelector("#final-message"),
  finalClosing: document.querySelector("#final-closing")
};
const pendingImages = new Map();
const previewUrls = new Map();
let currentConfig = mergeConfig(DEFAULT_CONFIG);
let saveStateTimer;
let toastTimer;

function mergeConfig(config) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    memories: DEFAULT_CONFIG.memories.map((item, index) => ({
      ...item,
      ...(Array.isArray(config.memories) ? config.memories[index] : {})
    })),
    wishes: DEFAULT_CONFIG.wishes.map((item, index) => ({
      ...item,
      ...(Array.isArray(config.wishes) ? config.wishes[index] : {})
    }))
  };
}

function showToast(message, isError) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle("error", Boolean(isError));
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 4200);
}

async function readJsonResponse(response, action) {
  const body = await response.text();
  let result;
  try {
    result = JSON.parse(body);
  } catch {
    const responseType = response.headers.get("content-type") || "unknown content type";
    const detail = body.trim()
      ? `a non-JSON response (${responseType})`
      : "an empty response";
    throw new Error(
      `${action} returned ${detail} (HTTP ${response.status}). ` +
      "Ensure Render runs this dashboard as a Web Service with dashboard/server.js as its start command, then check the service logs."
    );
  }
  if (!response.ok) {
    throw new Error(result.error || `${action} failed (HTTP ${response.status}).`);
  }
  return result;
}

function updatePreview(config) {
  document.querySelector("#preview-recipient").textContent = `For the esteemed ${config.recipient}`;
  document.querySelector("#preview-identity").textContent = [
    config.profession,
    config.relationshipToRitika || "A tribute for one most dear"
  ].filter(Boolean).join(" · ");
  document.querySelector("#preview-headline").textContent = config.headline;
  document.querySelector("#preview-opening").textContent = config.openingLine;
  document.querySelector("#stat-recipient").textContent = config.recipient;
  document.querySelector("#preview-final-message").textContent = config.finalMessage;
  document.querySelector("#preview-final-closing").textContent = config.finalClosing;
}

function updateImagePreview(image, url, placeholder) {
  image.src = url || "";
  image.hidden = !url;
  placeholder.hidden = Boolean(url);
}

function populateForm(config) {
  currentConfig = mergeConfig(config);
  for (const [key, input] of Object.entries(fields)) {
    input.value = currentConfig[key];
  }
  for (const [key, input] of Object.entries(contentFields)) {
    input.value = currentConfig[key];
  }

  const portraitImage = document.querySelector("#portrait-preview");
  const portraitPlaceholder = document.querySelector("#portrait-placeholder");
  updateImagePreview(portraitImage, currentConfig.portraitImage, portraitPlaceholder);
  document.querySelector("#portrait-status").textContent = currentConfig.portraitImage
    ? "Portrait kept · choose another, shouldst thou wish to replace it"
    : "No portrait chosen as yet";

  document.querySelectorAll(".memory-editor-card").forEach((card, index) => {
    const memory = currentConfig.memories[index];
    card.querySelector(".memory-title").value = memory.title;
    card.querySelector(".memory-caption").value = memory.caption;
    const image = card.querySelector(".memory-preview img");
    const placeholder = card.querySelector(".memory-preview span");
    updateImagePreview(image, memory.image, placeholder);
    card.querySelector(".upload-status").textContent = memory.image
      ? "Photograph kept · choose another, shouldst thou wish to replace it"
      : "No photograph chosen as yet";
  });

  document.querySelectorAll(".wish-editor-card").forEach((card, index) => {
    card.querySelector(".wish-text").value = currentConfig.wishes[index].text;
    card.querySelector(".wish-author").value = currentConfig.wishes[index].author;
  });
  updatePreview(currentConfig);
}

function readConfig() {
  const config = {
    ...currentConfig,
    ...Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()])),
    ...Object.fromEntries(Object.entries(contentFields).map(([key, input]) => [key, input.value.trim()])),
    memories: Array.from(document.querySelectorAll(".memory-editor-card"), (card, index) => ({
      ...currentConfig.memories[index],
      title: card.querySelector(".memory-title").value.trim(),
      caption: card.querySelector(".memory-caption").value.trim()
    })),
    wishes: Array.from(document.querySelectorAll(".wish-editor-card"), (card) => ({
      text: card.querySelector(".wish-text").value.trim(),
      author: card.querySelector(".wish-author").value.trim()
    }))
  };
  return config;
}

function setSaveState(text, mode) {
  saveState.lastChild.textContent = ` ${text}`;
  saveState.dataset.mode = mode || "";
}

function updateGitHubStatus(status) {
  const element = document.querySelector("#github-status");
  element.dataset.mode = status.configured ? "github" : "local";
  element.replaceChildren();

  const dot = document.createElement("span");
  dot.className = "status-dot";
  const label = document.createElement("span");
  label.textContent = status.configured
    ? `All is ready · ${status.repository} · GitHub App connected`
    : status.setupError
      ? `A setup matter requires thy attention: ${status.setupError}`
      : "Not connected · drafts are kept upon this device";
  element.append(dot, label);

  const saveLabel = status.configured ? "Draft kept in GitHub App" : "Draft kept upon this device";
  setSaveState(saveLabel, status.configured ? "github" : "local");
}

async function loadDashboard() {
  try {
    const [configResponse, statusResponse] = await Promise.all([
      fetch("/api/config"),
      fetch("/api/status")
    ]);
    const [configResult, status] = await Promise.all([
      readJsonResponse(configResponse, "Loading dashboard settings"),
      readJsonResponse(statusResponse, "Checking the GitHub App connection")
    ]);
    populateForm(configResult.config);
    updateGitHubStatus(status);
    formMessage.textContent = configResult.source === "github"
      ? "Thy settings have arrived from the connected GitHub repository."
      : "Thy changes remain herein, within this dashboard.";
    contentFormMessage.textContent = configResult.source === "github"
      ? "Thy photographs and words have arrived from the connected GitHub repository."
      : "Thy photographs and words shall be kept in the dashboard draft.";
  } catch (error) {
    let localConfig = mergeConfig(DEFAULT_CONFIG);
    try {
      const saved = JSON.parse(localStorage.getItem("birthday-studio-config"));
      if (saved && typeof saved === "object") localConfig = mergeConfig(saved);
    } catch {
      formMessage.textContent = "The local draft could not be read; hence, the default settings are shown instead.";
    }
    populateForm(localConfig);
    document.querySelector("#github-status").dataset.mode = "error";
    document.querySelector("#github-status").textContent = "The dashboard server is unavailable; changes may yet be kept in this browser.";
    setSaveState("Preview in this browser", "error");
    formMessage.textContent = error.message ? `Alas, ${error.message}` : "The dashboard server could not be reached.";
    contentFormMessage.textContent = "Image uploads require the dashboard server to be running, lest they fail.";
  }
}

function fileToBase64(file) {
  return file.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  });
}

async function uploadPendingImages() {
  for (const [key, file] of pendingImages) {
    const status = document.querySelector(key === "portrait"
      ? "#portrait-status"
      : `#memory-status-${Number(key.slice(-1)) + 1}`);
    status.textContent = "Uploading thy photograph…";
    const response = await fetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, type: file.type, data: await fileToBase64(file) })
    });
    const result = await readJsonResponse(response, `Uploading ${file.name}`);

    if (key === "portrait") {
      currentConfig.portraitImage = result.path;
    } else {
      currentConfig.memories[Number(key.slice(-1))].image = result.path;
    }
    status.textContent = `Uploaded unto the dashboard · ${file.name}`;
    pendingImages.delete(key);
  }
}

function saveDraft() {
  if (!form.reportValidity() || !contentForm.reportValidity()) return;

  formMessage.textContent = "I shall save thy draft…";
  contentFormMessage.textContent = pendingImages.size
    ? "Uploading thy photographs and saving the draft…"
    : "Saving thy photographs and messages…";
  setSaveState("Saving thy draft…", "");

  uploadPendingImages()
    .then(() => {
      const config = readConfig();
      return fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
    })
    .then(async (response) => {
      const result = await readJsonResponse(response, "Saving thy draft");
      currentConfig = mergeConfig(result.config);
      updateGitHubStatus({ configured: result.source === "github", repository: result.repository });
      formMessage.textContent = result.source === "github"
        ? "Thy draft hath been saved to GitHub. The hosted tribute shall use its name, profession, and relationship."
        : "Thy draft hath been saved upon this computer. The tribute reads this profile when served from the project folder.";
      contentFormMessage.textContent = result.source === "github"
        ? "Thy photographs and messages have been sent unto the dashboard folder in GitHub."
        : "Thy photographs and messages have been kept in the dashboard folder.";
      showToast(result.source === "github"
        ? "Thy photographs and messages are now synced to GitHub."
        : "Thy photographs and messages have been saved.", false);
      window.clearTimeout(saveStateTimer);
      saveStateTimer = window.setTimeout(() => {
        setSaveState(result.source === "github" ? "Draft kept in GitHub App" : "Draft kept upon this device", result.source);
      }, 2800);
    })
    .catch((error) => {
      const config = readConfig();
      try {
        localStorage.setItem("birthday-studio-config", JSON.stringify(config));
      } catch {
        formMessage.textContent = `Alas, the saving hath failed: ${error.message}`;
        contentFormMessage.textContent = "Thy changes could not be saved. Pray ensure the dashboard server is running.";
        setSaveState("Thy saving hath failed", "error");
        showToast(`Thy draft could not be saved: ${error.message}`, true);
        return;
      }
      formMessage.textContent = `Alas, the sync hath failed: ${error.message} Thy words are kept as a backup in this browser.`;
      contentFormMessage.textContent = pendingImages.size
        ? "Some chosen photographs were not uploaded. Pray keep the dashboard server running, then try once more."
        : "Thy words are kept as a backup in this browser; uploaded photographs remain in the dashboard folder.";
      setSaveState("Backup in this browser", "error");
      showToast(`Alas, the draft could not be fully saved: ${error.message}`, true);
    });
}

function handleImageChange(input) {
  const key = input.dataset.imageKey;
  const file = input.files[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
    input.value = "";
    showToast("Pray choose a JPG, PNG, or WebP image no larger than 5 MB.", true);
    return;
  }

  const previousUrl = previewUrls.get(key);
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  const previewUrl = URL.createObjectURL(file);
  previewUrls.set(key, previewUrl);
  pendingImages.set(key, file);

  if (key === "portrait") {
    updateImagePreview(
      document.querySelector("#portrait-preview"),
      previewUrl,
      document.querySelector("#portrait-placeholder")
    );
    document.querySelector("#portrait-status").textContent = `Ready to upload thy portrait · ${file.name}`;
  } else {
    const index = Number(key.slice(-1));
    const card = document.querySelector(`[data-memory-index="${index}"]`);
    updateImagePreview(card.querySelector(".memory-preview img"), previewUrl, card.querySelector(".memory-preview span"));
    card.querySelector(".upload-status").textContent = `Ready to upload thy photograph · ${file.name}`;
  }
  contentFormMessage.textContent = "New photographs shall be uploaded when thou savest the draft.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveDraft();
});

contentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveDraft();
});

document.querySelector("#top-save").addEventListener("click", saveDraft);

for (const input of [...Object.values(fields), ...Object.values(contentFields)]) {
  input.addEventListener("input", () => updatePreview(readConfig()));
}

document.querySelectorAll(".memory-title, .memory-caption, .wish-text, .wish-author").forEach((input) => {
  input.addEventListener("input", () => updatePreview(readConfig()));
});

document.querySelectorAll(".image-file").forEach((input) => {
  input.addEventListener("change", () => handleImageChange(input));
});

document.querySelectorAll(".side-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".side-nav .nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

loadDashboard();

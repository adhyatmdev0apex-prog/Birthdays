const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const ROOT = __dirname;
const CONFIG_FILE = path.join(ROOT, "studio-config.json");
const GITHUB_CONFIG_PATH = "Ritika_mam's_stuff/dashboard/studio-config.json";
const GITHUB_UPLOADS_PATH = "Ritika_mam's_stuff/dashboard/uploads";
const UPLOADS_DIR = path.join(ROOT, "uploads");
const REFERENCES = {
  "/references/chuttu.jpg": path.resolve(ROOT, "..", "..", "Chutu_X_mutt_chachus-bday", "assets", "images", "final-image.jpg"),
  "/references/mama.jpg": path.resolve(ROOT, "..", "..", "Mama-b;day", "assets", "images", "final.jpeg")
};
const STATIC_FILES = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/GITHUB_APP_SETUP.md", ["GITHUB_APP_SETUP.md", "text/markdown; charset=utf-8"]]
]);
const DEFAULT_CONFIG = {
  recipient: "Ritika Ma'am",
  occasionDate: "",
  headline: "A birthday tribute, shaped with gratitude.",
  openingLine: "Some people make every ordinary moment feel like it belongs in a story.",
  memorySource: "blended",
  portraitImage: "",
  memories: [
    { image: "", title: "Lessons Filled With Light", caption: "The kind of classes where learning felt effortless and curiosity was always welcomed." },
    { image: "", title: "Smiles Along the Way", caption: "Shared laughter, warm conversations, and the joy of being encouraged by a wonderful mentor." },
    { image: "", title: "Moments of Pride", caption: "Every milestone reached felt brighter knowing you were cheering us on." },
    { image: "", title: "Gratitude Held in Time", caption: "Snapshots of a chapter we will always look back on with deep respect and fondness." }
  ],
  wishes: [
    { text: "Wishing you a year filled with good health, peaceful mornings, and the same joy you bring into every classroom.", author: "With deepest gratitude" },
    { text: "Thank you for never giving up on us, celebrating our small wins, and showing us what true dedication looks like.", author: "From your grateful students" },
    { text: "May this new year bring you new adventures, well-deserved rest, and countless reasons to smile every day.", author: "With warmest regards" }
  ],
  celebrationMessage: "Wishing you a truly wonderful birthday and a bright, fulfilling year ahead, Ritika Ma'am! May good health, peace, and happiness follow you wherever you go.",
  finalMessage: "Thank you for being a guide we will always look up to. May this year bring you peace, joy, and bright new chapters.",
  finalClosing: "With deepest respect and warmest wishes, always."
};
const MAX_BODY_BYTES = 16 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_BODY_BYTES = Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 1024;
const TOKEN_URL = "https://api.github.com";
const IMAGE_TYPES = {
  "image/jpeg": { extension: "jpg", signature: (buffer) => buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  "image/png": { extension: "png", signature: (buffer) => buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { extension: "webp", signature: (buffer) => buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" }
};
const IMAGE_KEYS = new Set(["portrait", "memory-0", "memory-1", "memory-2", "memory-3"]);

class GitHubError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function loadDotEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || Object.hasOwn(process.env, match[1])) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value.replace(/\\n/g, "\n");
  }
}

loadDotEnv();

function configuration() {
  return {
    appId: process.env.GITHUB_APP_ID || "",
    installationId: process.env.GITHUB_APP_INSTALLATION_ID || "",
    owner: process.env.GITHUB_OWNER || "",
    repository: process.env.GITHUB_REPOSITORY || "",
    branch: process.env.GITHUB_BRANCH || "main",
    privateKeyPath: process.env.GITHUB_APP_PRIVATE_KEY_PATH || "",
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY || ""
  };
}

function getPrivateKey(config) {
  if (config.privateKey) return config.privateKey;
  if (config.privateKeyPath) {
    const keyPath = path.resolve(ROOT, config.privateKeyPath);
    if (keyPath !== ROOT && !keyPath.startsWith(`${ROOT}${path.sep}`)) {
      throw new Error("GITHUB_APP_PRIVATE_KEY_PATH must point inside the dashboard folder.");
    }
    return fs.readFileSync(keyPath, "utf8");
  }
  return "";
}

function githubConfigured(config) {
  if (!config.appId || !config.installationId || !config.owner || !config.repository) return false;
  try {
    const privateKey = getPrivateKey(config);
    if (!privateKey) return false;
    crypto.createPrivateKey(privateKey);
    return true;
  } catch {
    return false;
  }
}

function githubSetupError(config) {
  const provided = [
    config.appId,
    config.installationId,
    config.owner,
    config.repository,
    config.privateKeyPath,
    config.privateKey
  ].some(Boolean);
  if (!provided || githubConfigured(config)) return "";
  const missing = [];
  if (!config.appId) missing.push("GITHUB_APP_ID");
  if (!config.installationId) missing.push("GITHUB_APP_INSTALLATION_ID");
  if (!config.owner) missing.push("GITHUB_OWNER");
  if (!config.repository) missing.push("GITHUB_REPOSITORY");
  if (!config.privateKey && !config.privateKeyPath) missing.push("GITHUB_APP_PRIVATE_KEY_PATH");
  if (missing.length) return `Add ${missing.join(", ")} to .env to enable GitHub App sync.`;
  return "The GitHub App private key could not be read. Check GITHUB_APP_PRIVATE_KEY_PATH.";
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function createAppJwt(config) {
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iat: issuedAt, exp: issuedAt + 540, iss: config.appId }));
  const body = `${header}.${payload}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(body), getPrivateKey(config)).toString("base64url");
  return `${body}.${signature}`;
}

let installationToken;
let installationTokenExpires = 0;

async function getInstallationToken(config) {
  if (installationToken && installationTokenExpires > Date.now() + 60_000) return installationToken;

  const response = await fetch(`${TOKEN_URL}/app/installations/${encodeURIComponent(config.installationId)}/access_tokens`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${createAppJwt(config)}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Birthday-Studio-Dashboard"
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new GitHubError(response.status, body.message || "GitHub App installation-token request failed.");
  }
  if (!body.token || !body.expires_at) {
    throw new Error("GitHub did not return an installation token.");
  }
  installationToken = body.token;
  installationTokenExpires = Date.parse(body.expires_at);
  return installationToken;
}

async function githubRequest(config, apiPath, method, body) {
  const token = await getInstallationToken(config);
  const response = await fetch(`${TOKEN_URL}${apiPath}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Birthday-Studio-Dashboard",
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new GitHubError(response.status, responseBody.message || `GitHub API request failed (${response.status}).`);
  }
  return responseBody;
}

function githubFileUrl(config) {
  return githubContentsUrl(config, GITHUB_CONFIG_PATH);
}

function githubContentsUrl(config, repositoryPath) {
  const segments = repositoryPath.split("/").map(encodeURIComponent).join("/");
  return `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${segments}?ref=${encodeURIComponent(config.branch)}`;
}

function githubContentsPath(config, repositoryPath) {
  const segments = repositoryPath.split("/").map(encodeURIComponent).join("/");
  return `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${segments}`;
}

function validateConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new GitHubError(400, "Draft must be a JSON object.");
  }
  if (
    (value.memories !== undefined && (!Array.isArray(value.memories) || value.memories.length !== 4
      || value.memories.some((memory) => !memory || typeof memory !== "object" || Array.isArray(memory))))
    || (value.wishes !== undefined && (!Array.isArray(value.wishes) || value.wishes.length !== 3
      || value.wishes.some((wish) => !wish || typeof wish !== "object" || Array.isArray(wish))))
  ) {
    throw new GitHubError(400, "Draft must contain four memories and three wishes.");
  }
  const result = {
    ...DEFAULT_CONFIG,
    ...value,
    memories: DEFAULT_CONFIG.memories.map((memory, index) => ({
      ...memory,
      ...(Array.isArray(value.memories) ? value.memories[index] : {})
    })),
    wishes: DEFAULT_CONFIG.wishes.map((wish, index) => ({
      ...wish,
      ...(Array.isArray(value.wishes) ? value.wishes[index] : {})
    }))
  };
  const limits = {
    recipient: 80, occasionDate: 10, headline: 140, openingLine: 320,
    celebrationMessage: 500, finalMessage: 500, finalClosing: 160
  };
  for (const [key, maxLength] of Object.entries(limits)) {
    if (typeof result[key] !== "string" || result[key].length > maxLength) {
      throw new GitHubError(400, `${key} must be text no longer than ${maxLength} characters.`);
    }
    result[key] = result[key].trim();
  }
  if (!result.recipient || !result.headline || !result.openingLine) {
    throw new GitHubError(400, "Recipient, headline, and opening thought are required.");
  }
  const occasionTimestamp = result.occasionDate
    ? Date.parse(`${result.occasionDate}T00:00:00Z`)
    : null;
  if (result.occasionDate && (
    !/^\d{4}-\d{2}-\d{2}$/.test(result.occasionDate)
    || !Number.isFinite(occasionTimestamp)
    || new Date(occasionTimestamp).toISOString().slice(0, 10) !== result.occasionDate
  )) {
    throw new GitHubError(400, "Birthday date must use a real date in YYYY-MM-DD format.");
  }
  if (!["blended", "chuttu", "mama"].includes(result.memorySource)) {
    throw new GitHubError(400, "Choose one of the available photo and memory directions.");
  }
  const imagePattern = /^\/uploads\/[a-z0-9-]+\.(?:jpg|png|webp)$/;
  if (typeof result.portraitImage !== "string" || (result.portraitImage && !imagePattern.test(result.portraitImage))) {
    throw new GitHubError(400, "Choose a portrait image uploaded through this dashboard.");
  }
  for (const [index, memory] of result.memories.entries()) {
    if (!memory || typeof memory !== "object" || Array.isArray(memory)) {
      throw new GitHubError(400, `Memory ${index + 1} must be an object.`);
    }
    for (const [key, maxLength] of Object.entries({ title: 80, caption: 240 })) {
      if (typeof memory[key] !== "string" || memory[key].length > maxLength || !memory[key].trim()) {
        throw new GitHubError(400, `Memory ${index + 1} ${key} is required and must be at most ${maxLength} characters.`);
      }
      memory[key] = memory[key].trim();
    }
    if (typeof memory.image !== "string" || (memory.image && !imagePattern.test(memory.image))) {
      throw new GitHubError(400, `Choose a valid uploaded image for memory ${index + 1}.`);
    }
  }
  for (const [index, wish] of result.wishes.entries()) {
    if (!wish || typeof wish !== "object" || Array.isArray(wish)) {
      throw new GitHubError(400, `Wish ${index + 1} must be an object.`);
    }
    for (const [key, maxLength] of Object.entries({ text: 300, author: 80 })) {
      if (typeof wish[key] !== "string" || wish[key].length > maxLength || !wish[key].trim()) {
        throw new GitHubError(400, `Wish ${index + 1} ${key} is required and must be at most ${maxLength} characters.`);
      }
      wish[key] = wish[key].trim();
    }
  }
  if (!result.celebrationMessage || !result.finalMessage || !result.finalClosing) {
    throw new GitHubError(400, "Birthday card, final message, and closing signature are required.");
  }
  return result;
}

function readLocalConfig() {
  const stored = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  return validateConfig({ ...DEFAULT_CONFIG, ...stored });
}

async function readGitHubConfig(config) {
  try {
    const remote = await githubRequest(config, githubFileUrl(config), "GET");
    if (!remote.content || remote.encoding !== "base64") {
      throw new Error("The GitHub draft file is not base64 encoded.");
    }
    return { config: validateConfig(JSON.parse(Buffer.from(remote.content, "base64").toString("utf8"))), source: "github" };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) {
      return { config: readLocalConfig(), source: "local" };
    }
    throw error;
  }
}

async function writeGitHubFile(config, repositoryPath, content, message) {
  let sha;
  try {
    const existing = await githubRequest(config, githubContentsUrl(config, repositoryPath), "GET");
    sha = existing.sha;
  } catch (error) {
    if (!(error instanceof GitHubError) || error.status !== 404) throw error;
  }

  const result = await githubRequest(config, githubContentsPath(config, repositoryPath), "PUT", {
    message,
    content,
    branch: config.branch,
    ...(sha ? { sha } : {})
  });
  return result.commit && result.commit.sha;
}

async function writeGitHubConfig(config, draft) {
  return writeGitHubFile(
    config,
    GITHUB_CONFIG_PATH,
    Buffer.from(`${JSON.stringify(draft, null, 2)}\n`).toString("base64"),
    "Update Birthday Studio draft"
  );
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

function readRequestBody(request, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let raw = "";
    let exceeded = false;
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      if (exceeded) return;
      raw += chunk;
      if (Buffer.byteLength(raw, "utf8") > maxBytes) {
        exceeded = true;
        reject(new GitHubError(413, "Request body is too large."));
      }
    });
    request.on("end", () => {
      if (!exceeded) resolve(raw);
    });
    request.on("error", reject);
  });
}

async function saveImage(request, response, config) {
  const raw = await readRequestBody(request, MAX_IMAGE_BODY_BYTES);
  let upload;
  try {
    upload = JSON.parse(raw);
  } catch {
    throw new GitHubError(400, "Image upload must be valid JSON.");
  }
  if (!IMAGE_KEYS.has(upload.key)) {
    throw new GitHubError(400, "Choose a portrait or one of the four memory image slots.");
  }
  const imageType = IMAGE_TYPES[upload.type];
  if (!imageType || typeof upload.data !== "string" || upload.data.length > MAX_IMAGE_BODY_BYTES) {
    throw new GitHubError(400, "Upload a JPG, PNG, or WebP image up to 5 MB.");
  }
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(upload.data)) {
    throw new GitHubError(400, "Image data is not valid base64.");
  }

  const image = Buffer.from(upload.data, "base64");
  if (
    image.length === 0
    || image.length > MAX_IMAGE_BYTES
    || !imageType.signature(image)
  ) {
    throw new GitHubError(400, "Image content is invalid or exceeds the 5 MB limit.");
  }

  const filename = `${upload.key}-${crypto.randomUUID()}.${imageType.extension}`;
  const publicPath = `/uploads/${filename}`;
  const repositoryPath = `${GITHUB_UPLOADS_PATH}/${filename}`;
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), image, { flag: "wx" });

  let commit;
  if (githubConfigured(config)) {
    commit = await writeGitHubFile(
      config,
      repositoryPath,
      image.toString("base64"),
      `Add Birthday Studio ${upload.key} image`
    );
  }
  sendJson(response, 201, {
    path: publicPath,
    source: githubConfigured(config) ? "github" : "local",
    ...(commit ? { commit } : {})
  });
}

async function serveUpload(request, response, config) {
  const match = request.url.match(/^\/uploads\/([a-z0-9-]+\.(?:jpg|png|webp))$/);
  if (request.method !== "GET" || !match) {
    response.writeHead(404);
    response.end();
    return;
  }

  const [, filename] = match;
  const localPath = path.join(UPLOADS_DIR, filename);
  let image;
  if (fs.existsSync(localPath)) {
    image = fs.readFileSync(localPath);
  } else if (githubConfigured(config)) {
    const remotePath = `${GITHUB_UPLOADS_PATH}/${filename}`;
    const remote = await githubRequest(config, githubContentsUrl(config, remotePath), "GET");
    if (!remote.content || remote.encoding !== "base64") {
      throw new Error("The stored image is not base64 encoded.");
    }
    image = Buffer.from(remote.content, "base64");
  } else {
    response.writeHead(404);
    response.end();
    return;
  }

  const extension = path.extname(filename);
  const mimeType = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" }[extension];
  response.writeHead(200, {
    "Content-Type": mimeType,
    "Cache-Control": "private, max-age=300",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(image);
}

function secureHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
}

async function handleApi(request, response, config) {
  if (request.method === "GET" && request.url === "/api/status") {
    const configured = githubConfigured(config);
    sendJson(response, 200, {
      configured,
      repository: configured ? `${config.owner}/${config.repository}` : "",
      branch: config.branch,
      setupError: githubSetupError(config)
    });
    return;
  }

  if (request.method === "GET" && request.url === "/api/config") {
    if (githubConfigured(config)) {
      const result = await readGitHubConfig(config);
      sendJson(response, 200, { ...result, repository: `${config.owner}/${config.repository}` });
      return;
    }
    sendJson(response, 200, { config: readLocalConfig(), source: "local" });
    return;
  }

  if (request.method === "PUT" && request.url === "/api/config") {
    const raw = await readRequestBody(request);
    let incoming;
    try {
      incoming = JSON.parse(raw);
    } catch {
      throw new GitHubError(400, "Request body must be valid JSON.");
    }
    const draft = validateConfig(incoming);
    if (githubConfigured(config)) {
      const commit = await writeGitHubConfig(config, draft);
      sendJson(response, 200, {
        config: draft,
        source: "github",
        repository: `${config.owner}/${config.repository}`,
        commit
      });
      return;
    }
    fs.writeFileSync(CONFIG_FILE, `${JSON.stringify(draft, null, 2)}\n`, "utf8");
    sendJson(response, 200, { config: draft, source: "local" });
    return;
  }

  if (request.method === "POST" && request.url === "/api/images") {
    await saveImage(request, response, config);
    return;
  }

  sendJson(response, 404, { error: "API endpoint not found." });
}

function contentType(filename) {
  const extension = path.extname(filename).toLowerCase();
  return { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg" }[extension] || "application/octet-stream";
}

async function serveStatic(request, response, config) {
  if (request.url && request.url.startsWith("/uploads/")) {
    await serveUpload(request, response, config);
    return;
  }

  const referencePath = REFERENCES[request.url];
  if (request.method === "GET" && referencePath) {
    if (!fs.existsSync(referencePath)) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "no-store" });
    fs.createReadStream(referencePath).pipe(response);
    return;
  }

  const entry = STATIC_FILES.get(request.url);
  if (request.method !== "GET" || !entry) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const filename = path.join(ROOT, entry[0]);
  response.writeHead(200, { "Content-Type": entry[1], "Cache-Control": "no-store" });
  fs.createReadStream(filename).pipe(response);
}

const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

const server = http.createServer(async (request, response) => {
  secureHeaders(response);
  try {
    if (request.url && request.url.startsWith("/api/")) {
      await handleApi(request, response, configuration());
      return;
    }
    await serveStatic(request, response, configuration());
  } catch (error) {
    const status = error instanceof GitHubError ? error.status : 500;
    const message = error instanceof GitHubError || error instanceof SyntaxError
      ? error.message
      : "Dashboard request failed. Check the GitHub App setup and server log.";
    console.error(`[dashboard] ${request.method} ${request.url}: ${error.message}`);
    if (!response.headersSent) sendJson(response, status, { error: message });
    else response.end();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Birthday Studio dashboard: http://127.0.0.1:${port}`);
});

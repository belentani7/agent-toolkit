#!/usr/bin/env node
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const providerDefaults = {
  demo: { kind: "demo", label: "Modo demostración", model: "no-model" },
  ollama: { kind: "local", label: "Ollama", model: "llama3.2", baseUrl: "http://127.0.0.1:11434" },
  lmstudio: { kind: "local", label: "LM Studio", model: "local-model", baseUrl: "http://127.0.0.1:1234/v1" },
  llamacpp: { kind: "local", label: "llama.cpp", model: "local-model", baseUrl: "http://127.0.0.1:8080/v1" },
  openai: { kind: "remote", label: "OpenAI", model: "gpt-4o-mini", baseUrl: "https://api.openai.com/v1", key: "OPENAI_API_KEY" },
  anthropic: { kind: "remote", label: "Anthropic / Claude", model: "claude-3-5-haiku-latest", baseUrl: "https://api.anthropic.com/v1", key: "ANTHROPIC_API_KEY" },
  google: { kind: "remote", label: "Google AI Studio / Gemini", model: "gemini-2.0-flash", baseUrl: "https://generativelanguage.googleapis.com/v1beta", key: "GOOGLE_AI_API_KEY" },
  openrouter: { kind: "remote", label: "OpenRouter", model: "openai/gpt-4o-mini", baseUrl: "https://openrouter.ai/api/v1", key: "OPENROUTER_API_KEY" },
};

function loadDotEnv() {
  const envPath = resolve(projectRoot, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function json(res, status, payload, origin = "http://localhost:3000") {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "content-type, authorization",
    "access-control-allow-methods": "GET,POST,OPTIONS",
  });
  res.end(body);
}

function verifyAuthorization(req) {
  const expectedToken = process.env.COMPANION_TOKEN;
  if (!expectedToken) return true; // Si no hay token configurado, permite conexiones locales por defecto.
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return Boolean(match && match[1] === expectedToken);
}

function verifyOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // Herramientas CLI o tests sin header Origin.
  try {
    const parsed = new URL(origin);
    const host = parsed.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".manus.space");
    return isLocal;
  } catch {
    return false;
  }
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error("La petición supera el límite de 1 MB."));
    });
    req.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON inválido."));
      }
    });
    req.on("error", reject);
  });
}

function localUrl(value, fallback) {
  const parsed = new URL(value || fallback);
  const allowedHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1";
  if (!allowedHost || !["http:", "https:"].includes(parsed.protocol)) throw new Error("El endpoint personalizado debe ser local: localhost o 127.0.0.1.");
  return parsed.toString().replace(/\/+$/, "");
}

function messagesFromInput(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) throw new Error("messages debe contener entre 1 y 100 mensajes.");
  return value.map((message) => {
    if (!message || !["system", "user", "assistant"].includes(message.role) || typeof message.content !== "string" || !message.content.trim()) throw new Error("Mensaje inválido.");
    return { role: message.role, content: message.content.slice(0, 100_000) };
  });
}

async function upstreamJson(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const raw = await response.text();
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = { raw }; }
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(payload).slice(0, 600)}`);
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

function textContent(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((part) => typeof part === "string" ? part : part?.text || "").join("").trim();
  return "";
}

async function runChat(input) {
  const provider = providerDefaults[input.provider];
  if (!provider) throw new Error("Proveedor no soportado.");
  const model = typeof input.model === "string" && input.model.trim() ? input.model.trim() : provider.model;
  const messages = messagesFromInput(input.messages);

  if (input.provider === "demo") {
    return { provider: input.provider, model, choices: [{ message: { role: "assistant", content: "Modo demostración: no se ha llamado a ningún modelo." } }] };
  }

  if (input.provider === "ollama") {
    const baseUrl = localUrl(input.baseUrl, provider.baseUrl);
    const payload = await upstreamJson(`${baseUrl}/api/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model, messages, stream: false }) });
    const content = textContent(payload.message?.content);
    if (!content) throw new Error("Ollama no devolvió texto; comprueba el modelo instalado.");
    return { provider: input.provider, model, choices: [{ message: { role: "assistant", content } }] };
  }

  if (input.provider === "anthropic") {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("Falta ANTHROPIC_API_KEY en el archivo .env del companion.");
    const system = messages.find((message) => message.role === "system")?.content;
    const payload = await upstreamJson(`${provider.baseUrl}/messages`, { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model, max_tokens: 2048, ...(system ? { system } : {}), messages: messages.filter((message) => message.role !== "system") }) });
    const content = textContent(payload.content);
    if (!content) throw new Error("Anthropic no devolvió texto.");
    return { provider: input.provider, model, choices: [{ message: { role: "assistant", content } }] };
  }

  if (input.provider === "google") {
    const key = process.env.GOOGLE_AI_API_KEY;
    if (!key) throw new Error("Falta GOOGLE_AI_API_KEY en el archivo .env del companion.");
    const system = messages.find((message) => message.role === "system")?.content;
    const contents = messages.filter((message) => message.role !== "system").map((message) => ({ role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] }));
    const payload = await upstreamJson(`${provider.baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}), contents }) });
    const content = textContent(payload.candidates?.[0]?.content?.parts);
    if (!content) throw new Error("Gemini no devolvió texto.");
    return { provider: input.provider, model, choices: [{ message: { role: "assistant", content } }] };
  }

  const keyName = provider.key;
  const apiKey = keyName ? process.env[keyName] : undefined;
  if (provider.kind === "remote" && !apiKey) throw new Error(`Falta ${keyName} en el archivo .env del companion.`);
  const headers = { "content-type": "application/json" };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  if (input.provider === "openrouter") { headers["http-referer"] = process.env.APP_ORIGIN || "http://localhost:3000"; headers["x-title"] = "AI Command Center"; }
  const baseUrl = provider.kind === "local" ? localUrl(input.baseUrl, provider.baseUrl) : provider.baseUrl;
  const payload = await upstreamJson(`${baseUrl}/chat/completions`, { method: "POST", headers, body: JSON.stringify({ model, messages, temperature: 0.2 }) });
  const content = textContent(payload.choices?.[0]?.message?.content);
  if (!content) throw new Error("El proveedor compatible no devolvió texto.");
  return { provider: input.provider, model, choices: [{ message: { role: "assistant", content } }] };
}

function providerStatuses() {
  return Object.entries(providerDefaults).map(([id, provider]) => ({ id, label: provider.label, kind: provider.kind, model: provider.model, configured: id === "demo" || (provider.key ? Boolean(process.env[provider.key]) : false), requiresLocalRuntime: provider.kind === "local", requiresApiKey: Boolean(provider.key) }));
}

export async function startCompanion({ host = process.env.COMPANION_HOST || "127.0.0.1", port = Number(process.env.COMPANION_PORT || 8788) } = {}) {
  loadDotEnv();
  const server = createServer(async (req, res) => {
    const origin = req.headers.origin || "http://localhost:3000";
    if (req.method === "OPTIONS") return json(res, 204, {}, origin);

    if (!verifyOrigin(req)) {
      return json(res, 403, { error: "Origen no permitido por la política de seguridad del companion." }, origin);
    }

    if (!verifyAuthorization(req)) {
      return json(res, 401, { error: "No autorizado. Se requiere un token Bearer válido en el header Authorization." }, origin);
    }

    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
      if (req.method === "GET" && url.pathname === "/healthz") return json(res, 200, { ok: true, service: "ai-command-center-companion", mode: "local-first" }, origin);
      if (req.method === "GET" && url.pathname === "/v1/providers") return json(res, 200, { data: providerStatuses() }, origin);
      if (req.method === "POST" && url.pathname === "/v1/chat/completions") return json(res, 200, await runChat(await readBody(req)), origin);
      return json(res, 404, { error: "Ruta no encontrada." }, origin);
    } catch (error) {
      return json(res, 400, { error: error instanceof Error ? error.message : "Error desconocido." }, origin);
    }
  });
  await new Promise((resolveStart, rejectStart) => { server.once("error", rejectStart); server.listen(port, host, resolveStart); });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startCompanion().then((server) => {
    const address = server.address();
    console.log(`AI Command Center Companion activo en http://${address.address}:${address.port}`);
  }).catch((error) => { console.error(error); process.exitCode = 1; });
}

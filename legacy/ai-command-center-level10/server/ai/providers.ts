import { getProviderDescriptor, providerCatalog, type ChatMessage, type ProviderId } from "../../shared/ai";

type ProviderSecrets = {
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GOOGLE_AI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
};

export type ChatRequest = {
  provider: ProviderId;
  model: string;
  baseUrl?: string;
  messages: ChatMessage[];
  apiKey?: string;
};

export type ProviderRuntimeStatus = {
  id: ProviderId;
  label: string;
  kind: string;
  model: string;
  baseUrl?: string;
  configured: boolean;
  requiresLocalRuntime: boolean;
  requiresApiKey: boolean;
  description: string;
  docsUrl?: string;
};

const defaultTimeoutMs = 45_000;

function getEnvSecrets(): ProviderSecrets {
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  };
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function textFromUnknown(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item && typeof item.text === "string") return item.text;
        return "";
      })
      .join("")
      .trim();
  }
  return "";
}

async function fetchJson(url: string, init: RequestInit): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), defaultTimeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const raw = await response.text();
    let payload: unknown = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = { raw };
    }
    if (!response.ok) {
      const detail = payload && typeof payload === "object" ? JSON.stringify(payload) : raw;
      throw new Error(`${response.status} ${response.statusText}: ${detail.slice(0, 600)}`);
    }
    return (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
  }
}

function requireApiKey(provider: ProviderId, explicitKey?: string): string {
  const secrets = getEnvSecrets();
  const envKey = provider === "openai"
    ? secrets.OPENAI_API_KEY
    : provider === "anthropic"
      ? secrets.ANTHROPIC_API_KEY
      : provider === "google"
        ? secrets.GOOGLE_AI_API_KEY
        : provider === "openrouter"
          ? secrets.OPENROUTER_API_KEY
          : undefined;
  const key = explicitKey || envKey;
  if (!key) {
    throw new Error(`Falta la clave del proveedor ${getProviderDescriptor(provider).label}. Configúrala en el servidor.`);
  }
  return key;
}

function getOpenAiLikeBaseUrl(provider: ProviderId, baseUrl?: string): string {
  const descriptor = getProviderDescriptor(provider);
  if (descriptor.kind === "local" && baseUrl) {
    const parsed = new URL(baseUrl);
    const allowedHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1";
    if (!allowedHost || !["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Por seguridad, un endpoint local personalizado debe apuntar a localhost o 127.0.0.1.");
    }
    return trimTrailingSlash(parsed.toString());
  }
  return trimTrailingSlash(descriptor.defaultBaseUrl || "");
}

async function callOpenAiCompatible(request: ChatRequest): Promise<string> {
  const baseUrl = getOpenAiLikeBaseUrl(request.provider, request.baseUrl);
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (["openai", "openrouter"].includes(request.provider)) {
    headers.authorization = `Bearer ${requireApiKey(request.provider, request.apiKey)}`;
  }
  if (request.provider === "openrouter") {
    headers["http-referer"] = process.env.APP_ORIGIN || "http://localhost:3000";
    headers["x-title"] = "AI Command Center";
  }
  const payload = await fetchJson(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: request.model, messages: request.messages, temperature: 0.2 }),
  });
  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  const first = choices[0] as { message?: { content?: unknown } } | undefined;
  const content = textFromUnknown(first?.message?.content);
  if (!content) throw new Error("El proveedor no devolvió contenido de texto.");
  return content;
}

async function callOllama(request: ChatRequest): Promise<string> {
  const baseUrl = getOpenAiLikeBaseUrl("ollama", request.baseUrl || "http://127.0.0.1:11434");
  const payload = await fetchJson(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: request.model, messages: request.messages, stream: false }),
  });
  const message = payload.message as { content?: unknown } | undefined;
  const content = textFromUnknown(message?.content);
  if (!content) throw new Error("Ollama respondió sin texto. Comprueba que el modelo esté descargado.");
  return content;
}

async function callAnthropic(request: ChatRequest): Promise<string> {
  const baseUrl = trimTrailingSlash(request.baseUrl || "https://api.anthropic.com/v1");
  const apiKey = requireApiKey("anthropic", request.apiKey);
  const system = request.messages.find((message) => message.role === "system")?.content;
  const messages = request.messages
    .filter((message) => message.role !== "system")
    .map((message) => ({ role: message.role, content: message.content }));
  const payload = await fetchJson(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: request.model, max_tokens: 2048, ...(system ? { system } : {}), messages }),
  });
  const content = textFromUnknown(payload.content);
  if (!content) throw new Error("Anthropic respondió sin contenido de texto.");
  return content;
}

async function callGoogle(request: ChatRequest): Promise<string> {
  const baseUrl = trimTrailingSlash(request.baseUrl || "https://generativelanguage.googleapis.com/v1beta");
  const apiKey = requireApiKey("google", request.apiKey);
  const system = request.messages.find((message) => message.role === "system")?.content;
  const contents = request.messages
    .filter((message) => message.role !== "system")
    .map((message) => ({ role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] }));
  const payload = await fetchJson(`${baseUrl}/models/${encodeURIComponent(request.model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}), contents }),
  });
  const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
  const first = candidates[0] as { content?: { parts?: Array<{ text?: unknown }> } } | undefined;
  const content = textFromUnknown(first?.content?.parts);
  if (!content) throw new Error("Gemini respondió sin contenido de texto.");
  return content;
}

export function getProviderStatuses(): ProviderRuntimeStatus[] {
  const secrets = getEnvSecrets();
  return providerCatalog.map((descriptor) => {
    const configured = descriptor.id === "openai"
      ? Boolean(secrets.OPENAI_API_KEY)
      : descriptor.id === "anthropic"
        ? Boolean(secrets.ANTHROPIC_API_KEY)
        : descriptor.id === "google"
          ? Boolean(secrets.GOOGLE_AI_API_KEY)
          : descriptor.id === "openrouter"
            ? Boolean(secrets.OPENROUTER_API_KEY)
            : descriptor.id === "demo";
    return {
      id: descriptor.id,
      label: descriptor.label,
      kind: descriptor.kind,
      model: descriptor.defaultModel,
      baseUrl: descriptor.defaultBaseUrl,
      configured,
      requiresLocalRuntime: descriptor.kind === "local",
      requiresApiKey: descriptor.requiresApiKey,
      description: descriptor.description,
      docsUrl: descriptor.docsUrl,
    };
  });
}

export async function runChat(request: ChatRequest): Promise<{ content: string; provider: ProviderId; model: string }> {
  if (request.provider === "demo") {
    return {
      provider: request.provider,
      model: request.model,
      content: "Modo demostración activo: no se ha llamado a ningún modelo. Configura Ollama, un servidor local o un proveedor remoto para obtener una respuesta real.",
    };
  }

  const content = request.provider === "ollama"
    ? await callOllama(request)
    : request.provider === "anthropic"
      ? await callAnthropic(request)
      : request.provider === "google"
        ? await callGoogle(request)
        : await callOpenAiCompatible(request);

  return { content, provider: request.provider, model: request.model };
}

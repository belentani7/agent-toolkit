export const providerIds = [
  "demo",
  "ollama",
  "lmstudio",
  "llamacpp",
  "openai",
  "anthropic",
  "google",
  "openrouter",
] as const;

export type ProviderId = (typeof providerIds)[number];

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ProviderKind = "local" | "remote" | "demo";

export type ProviderDescriptor = {
  id: ProviderId;
  label: string;
  kind: ProviderKind;
  defaultModel: string;
  description: string;
  requiresApiKey: boolean;
  defaultBaseUrl?: string;
  docsUrl?: string;
};

export const providerCatalog: readonly ProviderDescriptor[] = [
  {
    id: "demo",
    label: "Modo demostración",
    kind: "demo",
    defaultModel: "no-model",
    description: "Prueba la interfaz sin hacer una llamada de IA.",
    requiresApiKey: false,
  },
  {
    id: "ollama",
    label: "Ollama",
    kind: "local",
    defaultModel: "llama3.2",
    description: "Modelos locales en http://127.0.0.1:11434.",
    requiresApiKey: false,
    defaultBaseUrl: "http://127.0.0.1:11434",
    docsUrl: "https://ollama.com/library",
  },
  {
    id: "lmstudio",
    label: "LM Studio",
    kind: "local",
    defaultModel: "local-model",
    description: "Servidor local compatible con OpenAI en el puerto 1234.",
    requiresApiKey: false,
    defaultBaseUrl: "http://127.0.0.1:1234/v1",
    docsUrl: "https://lmstudio.ai/docs",
  },
  {
    id: "llamacpp",
    label: "llama.cpp",
    kind: "local",
    defaultModel: "local-model",
    description: "Servidor local OpenAI-compatible para GGUF y CPU/GPU.",
    requiresApiKey: false,
    defaultBaseUrl: "http://127.0.0.1:8080/v1",
    docsUrl: "https://github.com/ggerganov/llama.cpp/tree/master/examples/server",
  },
  {
    id: "openai",
    label: "OpenAI",
    kind: "remote",
    defaultModel: "gpt-4o-mini",
    description: "Modelos remotos de OpenAI mediante una clave del servidor.",
    requiresApiKey: true,
    defaultBaseUrl: "https://api.openai.com/v1",
    docsUrl: "https://platform.openai.com/docs",
  },
  {
    id: "anthropic",
    label: "Anthropic / Claude",
    kind: "remote",
    defaultModel: "claude-3-5-haiku-latest",
    description: "Modelos remotos Claude mediante una clave del servidor.",
    requiresApiKey: true,
    defaultBaseUrl: "https://api.anthropic.com/v1",
    docsUrl: "https://docs.anthropic.com/",
  },
  {
    id: "google",
    label: "Google AI Studio / Gemini",
    kind: "remote",
    defaultModel: "gemini-2.0-flash",
    description: "Modelos Gemini mediante Google AI Studio.",
    requiresApiKey: true,
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    docsUrl: "https://ai.google.dev/gemini-api/docs",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    kind: "remote",
    defaultModel: "openai/gpt-4o-mini",
    description: "Puerta compatible con OpenAI para múltiples modelos.",
    requiresApiKey: true,
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    docsUrl: "https://openrouter.ai/docs",
  },
];

export function isProviderId(value: string): value is ProviderId {
  return providerIds.includes(value as ProviderId);
}

export function getProviderDescriptor(id: ProviderId): ProviderDescriptor {
  const descriptor = providerCatalog.find((provider) => provider.id === id);
  if (!descriptor) {
    throw new Error(`Proveedor no soportado: ${id}`);
  }
  return descriptor;
}

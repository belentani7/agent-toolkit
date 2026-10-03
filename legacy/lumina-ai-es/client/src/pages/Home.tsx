import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CircleDot, Download, Eraser, Search, Settings2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { LUMINA_SYSTEM_PROMPT, sanitizeGeneratedText } from "../../../shared/chatPolicy";

type ChatStatus = "idle" | "streaming" | "error";

const STORAGE_KEY = "lumina-chat-session";

const suggestedPrompts = [
  "Explícame una idea científica de forma sencilla",
  "Cuéntame un episodio fascinante de la historia",
  "Ayúdame a entender una tecnología actual",
  "Recomiéndame una obra cultural y explica por qué",
];

function readSavedMessages(): Message[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Message[];
    return Array.isArray(parsed)
      ? parsed.filter(
          message =>
            message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function parseStreamChunk(
  buffer: string,
  onDelta: (delta: string) => void
): string {
  const events = buffer.split("\n\n");
  const remainder = events.pop() ?? "";

  for (const event of events) {
    const dataLine = event
      .split("\n")
      .find(line => line.startsWith("data:"));
    if (!dataLine) continue;

    const data = dataLine.slice(5).trim();
    if (!data || data === "[DONE]") continue;

    try {
      const parsed = JSON.parse(data) as {
        choices?: Array<{ delta?: { content?: string } }>;
        error?: string;
      };
      if (parsed.error) throw new Error(parsed.error);
      const delta = parsed.choices?.[0]?.delta?.content;
      if (delta) onDelta(sanitizeGeneratedText(delta));
    } catch (error) {
      if (error instanceof Error && error.message !== "Unexpected end of JSON input") {
        throw error;
      }
    }
  }

  return remainder;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(readSavedMessages);
  const [chatStatus, setChatStatus] = useState<ChatStatus>("idle");
  const isStreaming = chatStatus === "streaming";
  const traceIdRef = useRef(`lumina-${crypto.randomUUID()}`);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelId, setModelId] = useState("");
  const [temperature, setTemperature] = useState(0.5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fallbackMutation = trpc.chat.fallback.useMutation();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void fetch("/api/chat/models", {
      headers: {
        "X-Trace-Id": traceIdRef.current,
        "X-Client-Version": "1.0.0",
        "Accept-Version": "1.0.0",
      },
    })
      .then(response => response.json())
      .then(payload => {
        if (Array.isArray(payload.models)) setAvailableModels(payload.models);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (isStreaming || !content.trim()) return;

      const userMessage: Message = { role: "user", content: content.trim() };
      const assistantMessage: Message = { role: "assistant", content: "" };
      const nextMessages = [...messages, userMessage, assistantMessage];
      setMessages(nextMessages);
      setChatStatus("streaming");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Trace-Id": traceIdRef.current,
            "X-Client-Version": "1.0.0",
            "Accept-Version": "1.0.0",
          },
          signal: controller.signal,
          body: JSON.stringify({
            clientVersion: "1.0.0",
            options: {
              ...(modelId ? { model: modelId } : {}),
              temperature,
            },
            messages: [
              { role: "system", content: LUMINA_SYSTEM_PROMPT },
              ...nextMessages
                .filter(message => message.content.length > 0)
                .map(message => ({ role: message.role, content: message.content })),
            ],
          }),
        });

        if (!response.ok || !response.body) {
          const errorPayload = await response.json().catch(() => null);
          const errorCode = errorPayload?.envelope?.errors?.[0]?.code;
          const traceId = errorPayload?.envelope?.traceId || response.headers.get("X-Trace-Id");
          throw new Error([
            errorCode ? `[${errorCode}]` : "",
            errorPayload?.error || "No se pudo conectar con Lúmina.",
            traceId ? `(traza: ${traceId})` : "",
          ].filter(Boolean).join(" "));
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const appendDelta = (delta: string) => {
          setMessages(current => {
            const updated = [...current];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + delta,
              };
            }
            return updated;
          });
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          buffer = parseStreamChunk(buffer, appendDelta);
        }

        if (buffer.trim()) parseStreamChunk(`${buffer}\n\n`, appendDelta);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        try {
          const fallback = await fallbackMutation.mutateAsync({
            clientVersion: "1.0.0",
            options: {
              ...(modelId ? { model: modelId } : {}),
              temperature,
            },
            messages: [
              { role: "system", content: LUMINA_SYSTEM_PROMPT },
              ...nextMessages
                .filter(message => message.content.length > 0)
                .map(message => ({ role: message.role, content: message.content })),
            ],
          });
          setMessages(current => {
            const updated = [...current];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = { ...last, content: fallback.reply };
            }
            return updated;
          });
        } catch (fallbackError) {
          setChatStatus("error");
          const message =
            fallbackError instanceof Error
              ? fallbackError.message
              : error instanceof Error
                ? error.message
                : "Se produjo un error inesperado al generar la respuesta.";
          setMessages(current => {
            const updated = [...current];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: `No he podido completar la respuesta.\n\n> ${message}`,
              };
            }
            return updated;
          });
        }
      } finally {
        abortControllerRef.current = null;
        setChatStatus("idle");
      }
    },
    [fallbackMutation, isStreaming, messages, modelId, temperature]
  );

  const visibleMessages = searchTerm.trim()
    ? messages.filter(message =>
        message.content.toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase())
      )
    : messages;

  const exportMarkdown = () => {
    const transcript = messages
      .map(message => `${message.role === "user" ? "## Tú" : "## Lúmina"}\n\n${message.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([`# Conversación con Lúmina\n\n${transcript}\n`], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `lumina-conversacion-${new Date().toISOString().slice(0, 10)}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setChatStatus("idle");
    setMessages([]);
  };

  return (
    <main className="lumina-app min-h-screen overflow-hidden">
      <div className="lumina-orb lumina-orb-one" aria-hidden="true" />
      <div className="lumina-orb lumina-orb-two" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-10">
        <header className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="lumina-mark flex size-9 items-center justify-center rounded-[12px] shadow-lg shadow-indigo-500/20">
              <Sparkles className="size-[18px] text-white" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-display text-[17px] font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                Lúmina
              </p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500 sm:block dark:text-slate-400">
                Inteligencia en español
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4">
            <div className="hidden items-center gap-2 text-[11px] font-medium text-slate-500 sm:flex dark:text-slate-400">
              <CircleDot className="size-3 text-emerald-500" fill="currentColor" />
              Modelo disponible
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(open => !open)}
                aria-label="Abrir ajustes de conversación"
                aria-expanded={isSettingsOpen}
                className="gap-2 rounded-full px-2.5 text-[12px] font-semibold text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-white"
              >
                <Settings2 className="size-3.5" />
                <span className="hidden sm:inline">Ajustes</span>
              </Button>

              {isSettingsOpen && (
                <div className="absolute right-0 top-11 z-30 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-left shadow-[0_18px_50px_rgba(54,46,120,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
                  <div className="mb-3">
                    <p className="font-display text-sm font-semibold text-slate-950 dark:text-white">Ajustes de conversación</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">Personaliza el tono y encuentra cualquier idea del historial.</p>
                  </div>
                  <label className="mb-3 block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Modelo
                    <select
                      aria-label="Seleccionar modelo"
                      value={modelId}
                      onChange={event => setModelId(event.target.value)}
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-normal text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="">Selección automática</option>
                      {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
                    </select>
                  </label>
                  <label className="mb-3 block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Creatividad: <span className="font-mono font-normal">{temperature.toFixed(1)}</span>
                    <input aria-label="Nivel de creatividad" type="range" min="0" max="2" step="0.1" value={temperature} onChange={event => setTemperature(Number(event.target.value))} className="mt-2 w-full accent-indigo-600" />
                  </label>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Buscar en este chat
                    <div className="relative mt-1.5">
                      <Search className="pointer-events-none absolute left-2.5 top-2 size-3.5 text-slate-400" />
                      <input aria-label="Buscar en el historial" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar una palabra o idea…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-2.5 text-xs font-normal outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" />
                    </div>
                  </label>
                  {searchTerm && <p className="mt-2 text-[10px] text-slate-400">{visibleMessages.length} coincidencia(s) en el historial.</p>}
                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <Button variant="outline" size="sm" onClick={exportMarkdown} disabled={messages.length === 0} className="h-8 flex-1 gap-1.5 rounded-lg text-[11px]"><Download className="size-3.5" /> Exportar Markdown</Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()} disabled={messages.length === 0} className="h-8 rounded-lg px-2.5 text-[11px]">PDF</Button>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0 && !isStreaming}
              className="gap-2 rounded-full px-3 text-[12px] font-semibold text-slate-500 hover:bg-white/70 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-white"
            >
              <Eraser className="size-3.5" />
              <span className="hidden sm:inline">Limpiar conversación</span>
              <span className="sm:hidden">Limpiar</span>
            </Button>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col py-7 sm:py-10 lg:py-12">
          <div className="mb-6 flex shrink-0 flex-col items-center text-center sm:mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 shadow-sm shadow-indigo-100/30 dark:border-indigo-900/60 dark:bg-slate-900/60 dark:text-indigo-300">
              <Sparkles className="size-3" />
              Conversación inteligente
            </div>
            <h1 className="font-display max-w-2xl text-balance text-[clamp(2rem,5vw,3.45rem)] font-semibold leading-[1.03] tracking-[-0.055em] text-slate-950 dark:text-white">
              Ideas complejas, conversadas con claridad.
            </h1>
            <p className="mt-4 max-w-xl text-[14px] leading-6 text-slate-500 sm:text-[15px] dark:text-slate-400">
              Un espacio sereno para explorar preguntas, conectar ideas y convertir la curiosidad en conocimiento.
            </p>
          </div>

          <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
            <AIChatBox
              messages={visibleMessages}
              onSendMessage={handleSendMessage}
              isLoading={isStreaming}
              placeholder="Escribe tu pregunta aquí…"
              height="min(660px, calc(100dvh - 258px))"
              emptyStateMessage={searchTerm ? "No se encontraron coincidencias" : "¿Qué te gustaría explorar hoy?"}
              suggestedPrompts={searchTerm ? undefined : suggestedPrompts}
              className="lumina-chat-panel min-h-[410px] flex-1 overflow-hidden rounded-[24px] border border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(54,46,120,0.12)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
            />

            {messages.length === 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                <ArrowUpRight className="size-3" />
                Pulsa Enter para enviar · Mayús + Enter para una nueva línea
              </div>
            )}
          </div>
        </section>

        <footer className="flex shrink-0 items-center justify-center pb-5 text-center text-[10px] font-medium tracking-[0.04em] text-slate-400 dark:text-slate-500">
          Lúmina puede equivocarse. Verifica la información importante antes de tomar decisiones.
        </footer>
      </div>
    </main>
  );
}

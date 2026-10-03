import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bot, CheckCircle2, CircleAlert, Cpu, Loader2, LockKeyhole, RefreshCw, Send, ShieldCheck, Wifi } from "lucide-react";
import { toast } from "sonner";
import { providerCatalog, type ChatMessage, type ProviderId } from "@shared/ai";
import { trpc } from "@/lib/trpc";

type BridgeMessage = ChatMessage & { id: string };

type CompanionReply = {
  choices?: Array<{ message?: { content?: string } }>;
  provider?: ProviderId;
  model?: string;
};

const initialMessage: BridgeMessage = {
  id: "welcome",
  role: "assistant",
  content: "El puente está listo. Elige un proveedor y escribe una tarea. El modo demo no llama a ningún modelo; los modelos locales necesitan un companion activo.",
};

const companionStorageKey = "ai-command-center-companion-url";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ModelBridge() {
  const providersQuery = trpc.ai.providers.useQuery(undefined, { staleTime: 30_000 });
  const remoteChat = trpc.ai.chat.useMutation();
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>("ollama");
  const [model, setModel] = useState("llama3.2");
  const [baseUrl, setBaseUrl] = useState("http://127.0.0.1:11434");
  const [companionUrl, setCompanionUrl] = useState(() => localStorage.getItem(companionStorageKey) ?? "http://127.0.0.1:8788");
  const [companionToken, setCompanionToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<BridgeMessage[]>([initialMessage]);
  const [busy, setBusy] = useState(false);
  const [lastTransport, setLastTransport] = useState("Sin ejecución");

  const selectedDescriptor = useMemo(() => providerCatalog.find((provider) => provider.id === selectedProvider) ?? providerCatalog[0], [selectedProvider]);
  const selectedStatus = providersQuery.data?.find((provider) => provider.id === selectedProvider);

  useEffect(() => {
    setModel(selectedStatus?.model ?? selectedDescriptor.defaultModel);
    setBaseUrl(selectedStatus?.baseUrl ?? selectedDescriptor.defaultBaseUrl ?? "");
  }, [selectedDescriptor, selectedStatus]);

  const selectProvider = (id: ProviderId) => {
    setSelectedProvider(id);
    setMessages([initialMessage]);
    setLastTransport("Sin ejecución");
  };

  const saveCompanionUrl = (value: string) => {
    setCompanionUrl(value);
    localStorage.setItem(companionStorageKey, value);
  };

  const callLocalCompanion = async (conversation: ChatMessage[]) => {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (companionToken.trim()) headers.authorization = `Bearer ${companionToken.trim()}`;
    const response = await fetch(`${companionUrl.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ provider: selectedProvider, model, baseUrl, messages: conversation }),
    });
    const payload = (await response.json().catch(() => ({}))) as CompanionReply & { error?: string };
    if (!response.ok) throw new Error(payload.error || `Companion local respondió ${response.status}`);
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("El companion respondió sin contenido.");
    return content;
  };

  const runPrompt = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || busy) return;

    const userMessage: BridgeMessage = { id: makeId(), role: "user", content: trimmedPrompt };
    const conversation = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, userMessage]);
    setPrompt("");
    setBusy(true);

    try {
      let content: string;
      if (selectedProvider === "demo") {
        content = "Modo demostración: el mensaje se ha recibido correctamente, pero no se ha llamado a ningún modelo ni se ha inventado una respuesta de IA.";
        setLastTransport("Demo local · sin red");
      } else if (selectedDescriptor.kind === "local") {
        content = await callLocalCompanion(conversation);
        setLastTransport(`Companion local · ${selectedDescriptor.label}`);
      } else {
        const result = await remoteChat.mutateAsync({ provider: selectedProvider, model, baseUrl: undefined, messages: conversation });
        content = result.content;
        setLastTransport(`Backend seguro · ${selectedDescriptor.label}`);
      }
      setMessages((current) => [...current, { id: makeId(), role: "assistant", content }]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error desconocido";
      const hint = selectedDescriptor.kind === "local"
        ? "Arranca el companion local y comprueba la URL; después verifica que Ollama, LM Studio o llama.cpp estén respondiendo."
        : "El proveedor remoto requiere sesión autenticada y su clave configurada en el servidor.";
      setMessages((current) => [...current, { id: makeId(), role: "assistant", content: `No se pudo ejecutar la tarea. ${detail}\n\nSiguiente paso: ${hint}` }]);
      toast.error("La ejecución no se completó");
      setLastTransport("Error verificable");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-section model-bridge-page">
      <div className="section-heading">
        <div><p className="eyebrow">Módulo 02 / Modelos</p><h2>Puente multi-proveedor</h2><p className="lead">Una interfaz única para modelos locales y servicios remotos, sin guardar claves en el navegador.</p></div>
        <span className="section-note"><ShieldCheck size={14} /> 10/10 · estados honestos</span>
      </div>

      <div className="model-bridge-layout">
        <aside className="provider-panel">
          <div className="card-heading"><div><p className="eyebrow">Catálogo</p><h3>Elige el motor</h3></div><Cpu size={18} /></div>
          <div className="provider-list">
            {providerCatalog.map((provider) => {
              const status = providersQuery.data?.find((item) => item.id === provider.id);
              const active = provider.id === selectedProvider;
              return (
                <button key={provider.id} className={`provider-option ${active ? "provider-option-active" : ""}`} onClick={() => selectProvider(provider.id)}>
                  <span className="provider-option-icon">{provider.kind === "local" ? <Cpu size={15} /> : provider.kind === "remote" ? <Wifi size={15} /> : <Bot size={15} />}</span>
                  <span><strong>{provider.label}</strong><small>{provider.kind === "local" ? "LOCAL" : provider.kind === "remote" ? (status?.configured ? "CLAVE CONFIGURADA" : "REQUIERE CLAVE") : "SIN RED"}</small></span>
                  {active && <CheckCircle2 size={15} />}
                </button>
              );
            })}
          </div>
          <div className="provider-safety"><LockKeyhole size={15} /><span>Las claves remotas solo viven en el backend. Nunca se escriben en el ZIP.</span></div>
        </aside>

        <div className="bridge-main">
          <div className="bridge-config">
            <label>Modelo<input value={model} onChange={(event) => setModel(event.target.value)} placeholder={selectedDescriptor.defaultModel} /></label>
            <label>Endpoint local<input value={baseUrl} disabled={selectedDescriptor.kind !== "local"} onChange={(event) => setBaseUrl(event.target.value)} placeholder="http://127.0.0.1:11434" /></label>
            {selectedDescriptor.kind === "local" && (
              <>
                <label>Companion<input value={companionUrl} onChange={(event) => saveCompanionUrl(event.target.value)} placeholder="http://127.0.0.1:8788" /></label>
                <label>Token del companion<input type="password" value={companionToken} onChange={(event) => setCompanionToken(event.target.value)} placeholder="Solo memoria de esta sesión" autoComplete="off" /></label>
              </>
            )}
          </div>

          <div className="bridge-status-row">
            <span className={selectedStatus?.configured || selectedProvider === "demo" ? "bridge-status-ready" : "bridge-status-pending"}>{selectedProvider === "demo" ? "Sin red" : selectedStatus?.configured ? "Clave disponible en backend" : selectedDescriptor.kind === "local" ? "Comprobación local pendiente" : "Clave pendiente"}</span>
            <span>{lastTransport}</span>
            {selectedDescriptor.docsUrl && <a href={selectedDescriptor.docsUrl} target="_blank" rel="noreferrer">Documentación <ArrowUpRight size={13} /></a>}
            <button className="icon-button" onClick={() => providersQuery.refetch()} aria-label="Actualizar estados"><RefreshCw size={15} /></button>
          </div>

          <div className="bridge-chat" aria-live="polite">
            {messages.map((message) => <article key={message.id} className={`bridge-message bridge-message-${message.role}`}><span className="bridge-message-label">{message.role === "user" ? "TÚ" : "CENTRO"}</span><p>{message.content}</p></article>)}
            {busy && <div className="bridge-thinking"><Loader2 size={15} className="spin" /> Ejecutando con comprobación de transporte…</div>}
          </div>

          <div className="bridge-composer">
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) void runPrompt(); }} placeholder="Escribe una tarea. Ctrl/Cmd + Enter para ejecutar." aria-label="Tarea para el modelo" />
            <button className="button button-primary" onClick={() => void runPrompt()} disabled={busy || !prompt.trim()}>{busy ? <Loader2 size={15} className="spin" /> : <Send size={15} />} Ejecutar</button>
          </div>
          <p className="bridge-footnote"><CircleAlert size={13} /> Sin API y sin modelo local, el sistema no genera respuestas: muestra el motivo y el siguiente paso. El token del companion nunca se guarda en localStorage.</p>
        </div>
      </div>
    </section>
  );
}

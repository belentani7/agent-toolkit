/*
 * AI Command Center · Observatorio de Cristal
 * Layout asimétrico, glassmorfismo editorial y acciones honestas: distinguir conectado,
 * configurado y bloqueado. La UI no finge controlar procesos del sistema sin backend.
 */
import { lazy, Suspense, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Code2,
  Command,
  Copy,
  Cpu,
  Gauge,
  LayoutDashboard,
  Library,
  Menu,
  Network,
  Play,
  RefreshCw,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  TerminalSquare,
  X,
} from "lucide-react";
import { toast } from "sonner";
const ModelBridge = lazy(() => import("@/components/ModelBridge"));
const TokenLabView = lazy(() => import("@/components/DeferredViews").then(({ TokenLabView: View }) => ({ default: View })));
const MemoryView = lazy(() => import("@/components/DeferredViews").then(({ MemoryView: View }) => ({ default: View })));
const RunbookView = lazy(() => import("@/components/DeferredViews").then(({ RunbookView: View }) => ({ default: View })));

type ViewKey = "overview" | "workspaces" | "models" | "tokens" | "memory" | "runbook";

type Service = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  icon: typeof Bot;
  accent: "ice" | "coral" | "mint";
  status: "Enlace no verificado" | "No responde" | "No verificable";
  statusNote: string;
  endpoint?: string;
  command?: string;
  actionLabel: string;
};

const services: Service[] = [
  {
    id: "odysseus",
    name: "Odysseus",
    eyebrow: "Workspace general",
    description: "Chat, agentes, memoria, investigación y documentos en una sola estación.",
    icon: Bot,
    accent: "ice",
    status: "No responde",
    statusNote: "El enlace proxy devuelve 502 en esta sesión",
    endpoint: "https://7000-ish8079bsqjffkbhdb5q6-393e644c.us1.manus.computer",
    command: "cd ~/workspaces/odysseus && ./venv/bin/python -m uvicorn app:app --host 0.0.0.0 --port 7000",
    actionLabel: "Abrir enlace",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    eyebrow: "Agente personal",
    description: "La langosta para conectar canales y ejecutar tareas con aprobación humana.",
    icon: Network,
    accent: "coral",
    status: "No responde",
    statusNote: "El proxy devuelve 502; el Gateway no está verificable aquí",
    endpoint: "https://18789-ish8079bsqjffkbhdb5q6-393e644c.us1.manus.computer",
    command: "openclaw gateway run --port 18789",
    actionLabel: "Abrir enlace",
  },
  {
    id: "aider",
    name: "Aider",
    eyebrow: "Estación de código",
    description: "Pair programming en terminal con git, edición precisa y cualquier modelo compatible.",
    icon: Code2,
    accent: "mint",
    status: "No verificable",
    statusNote: "El proceso local no está disponible en este entorno",
    command: "cd ~/workspaces/aider && ./venv/bin/aider /ruta/a/tu/proyecto",
    actionLabel: "Copiar arranque",
  },
];

const navItems: { key: ViewKey; label: string; detail: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Centro de mando", detail: "Lectura general", icon: LayoutDashboard },
  { key: "workspaces", label: "Workspaces", detail: "3 estaciones", icon: ServerCog },
  { key: "models", label: "Model bridge", detail: "API / local", icon: Cpu },
  { key: "tokens", label: "Token lab", detail: "Optimización", icon: Gauge },
  { key: "memory", label: "Memoria y archivos", detail: "Estructura local", icon: Library },
  { key: "runbook", label: "Runbook", detail: "Pasos seguros", icon: Clipboard },
];


function StatusPill({ status }: { status: Service["status"] }) {
  const tone = status === "No responde" ? "coral" : status === "No verificable" ? "ice" : "ice";
  return (
    <span className={`status-pill status-pill-${tone}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function IconMark() {
  return (
    <img
      className="brand-symbol"
      src="/manus-storage/ai-command-symbol_275ca6ba.png"
      alt="Símbolo AI Command Center"
    />
  );
}

function ServiceCard({ service, onCopy }: { service: Service; onCopy: (value: string, label: string) => void }) {
  const Icon = service.icon;
  const isOpenable = Boolean(service.endpoint);
  return (
    <article className={`service-card service-${service.accent}`}>
      <div className="service-card-topline">
        <div className="service-icon"><Icon size={18} strokeWidth={1.8} /></div>
        <div className="service-top-actions">
          <StatusPill status={service.status} />
          <button className="icon-button" aria-label={`Más información sobre ${service.name}`} onClick={() => toast.info(service.statusNote)}>
            <CircleHelp size={15} />
          </button>
        </div>
      </div>
      <div className="service-copy">
        <p className="eyebrow">{service.eyebrow}</p>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
      </div>
      <div className="service-meta">
        <span><Activity size={13} /> {service.statusNote}</span>
      </div>
      <div className="service-card-footer">
        {isOpenable ? (
          <a className="button button-primary" href={service.endpoint} target="_blank" rel="noreferrer">
            {service.actionLabel} <ArrowUpRight size={14} />
          </a>
        ) : (
          <button className="button button-primary" onClick={() => service.command && onCopy(service.command, `${service.name}: comando copiado`)}>
            {service.actionLabel} <Copy size={14} />
          </button>
        )}
        {service.command && (
          <button className="button button-quiet" onClick={() => onCopy(service.command ?? "", "Comando copiado")}>Ver comando</button>
        )}
      </div>
    </article>
  );
}

function Home() {
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("Copiar");
  const [projectPath, setProjectPath] = useState(() => localStorage.getItem("ai-command-center-project") ?? "~/proyectos/mi-app");

  const activeLabel = useMemo(() => navItems.find((item) => item.key === activeView)?.label ?? "Centro de mando", [activeView]);

  const onCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      toast.success(label);
      window.setTimeout(() => setCopiedLabel("Copiar"), 2200);
    } catch {
      toast.error("El navegador no permitió copiar el comando");
    }
  };

  const saveProjectPath = () => {
    localStorage.setItem("ai-command-center-project", projectPath);
    toast.success("Ruta de proyecto guardada localmente");
  };

  const showView = (view: ViewKey) => {
    setActiveView(view);
    setMobileNav(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <div className="brand-lockup">
            <IconMark />
            <div>
              <span className="brand-kicker">AI / OPS</span>
              <strong>Command Center</strong>
            </div>
          </div>
          <button className="icon-button mobile-close" aria-label="Cerrar navegación" onClick={() => setMobileNav(false)}><X size={17} /></button>
        </div>

        <div className="sidebar-section-label">Navegación</div>
        <nav className="nav-list" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.key === activeView;
            return (
              <button key={item.key} className={`nav-item ${active ? "nav-item-active" : ""}`} onClick={() => showView(item.key)}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                {active && <ChevronRight className="nav-chevron" size={15} />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />
        <div className="operator-card">
          <div className="operator-avatar">OP</div>
          <div><span className="eyebrow">Operador local</span><strong>Tu estación</strong></div>
          <span className="online-pip" title="Interfaz activa" />
        </div>
        <div className="sidebar-footnote"><ShieldCheck size={14} /> Sin secretos guardados en esta interfaz</div>
      </aside>

      {mobileNav && <button className="mobile-scrim" aria-label="Cerrar menú" onClick={() => setMobileNav(false)} />}

      <main className="main-canvas">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" aria-label="Abrir navegación" onClick={() => setMobileNav(true)}><Menu size={19} /></button>
            <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeLabel}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Buscar en el centro de mando" onClick={() => setSearchOpen((open) => !open)}><Search size={17} /></button>
            <button className="button button-quiet topbar-command" onClick={() => onCopy("openclaw gateway run --port 18789", "Comando de Gateway copiado")}><Command size={15} /> <span>{copiedLabel}</span></button>
            <div className="live-indicator"><span className="live-dot" /> Sesión local</div>
          </div>
        </header>

        {searchOpen && (
          <div className="search-drawer">
            <Search size={16} /><input autoFocus placeholder="Busca una herramienta, una acción o un comando…" aria-label="Buscar" /><kbd>ESC</kbd>
          </div>
        )}

        <section className="hero-panel">
          <div className="hero-art" aria-hidden="true" />
          <div className="hero-gridlines" aria-hidden="true" />
          <div className="hero-content">
            <div className="hero-kicker"><span className="kicker-line" /> PARTE OPERATIVO / 01</div>
            <h1>Tu sistema,<br /><em>en una sola lectura.</em></h1>
            <p>Una estación de trabajo abierta para coordinar agentes, código, memoria y automatizaciones sin perder de vista qué está conectado de verdad.</p>
            <div className="hero-actions">
              <button className="button button-hero" onClick={() => showView("workspaces")}><Play size={14} fill="currentColor" /> Ir a workspaces</button>
              <button className="text-link" onClick={() => showView("runbook")}>Leer el runbook <ArrowUpRight size={14} /></button>
            </div>
          </div>
          <div className="hero-readout">
            <div className="readout-label">LECTURA DEL SISTEMA</div>
            <div className="readout-value">00 <span>/ 03</span></div>
            <div className="readout-caption">procesos verificados<br />desde esta interfaz web</div>
            <div className="readout-bar"><span /></div>
          </div>
        </section>

        {activeView === "overview" && (
          <>
            <section className="section-heading">
              <div><p className="eyebrow">Módulo 01 / Estado</p><h2>Estaciones de trabajo</h2></div>
              <div className="section-heading-side"><span>Actualizado ahora</span><button className="button button-quiet" onClick={() => toast.info("Estado de interfaz actualizado; la comprobación real requiere conectar cada servicio.")}><RefreshCw size={14} /> Comprobar</button></div>
            </section>
            <section className="services-grid">
              {services.map((service) => <ServiceCard key={service.id} service={service} onCopy={onCopy} />)}
            </section>

            <section className="lower-grid">
              <article className="focus-card">
                <div className="card-heading">                <div><p className="eyebrow">Foco recomendado</p><h3>Conecta el proceso real antes de automatizar</h3></div><span className="priority-tag">PENDIENTE</span></div>
                <p>La interfaz puede abrir enlaces y preparar comandos, pero no puede iniciar, detener ni inspeccionar procesos de tu máquina. Primero hay que levantar cada servicio en el mismo equipo donde vas a trabajar y verificar su respuesta.</p>
                <div className="code-strip"><TerminalSquare size={15} /><code>openclaw doctor --fix</code><button onClick={() => onCopy("openclaw doctor --fix", "Comando de diagnóstico copiado")}><Copy size={14} /></button></div>
                <button className="text-link" onClick={() => showView("runbook")}>Abrir pasos de conexión <ChevronRight size={14} /></button>
              </article>
              <article className="radar-card">
                <img src="/manus-storage/command-center-radar_ccbd4145.png" alt="Prisma glacial rodeado de anillos de estado" />
                <div className="radar-overlay"><span className="eyebrow">Señal de coordinación</span><strong>Una capa para cada decisión.</strong></div>
              </article>
            </section>
            <section className="truth-panel"><div className="card-heading"><div><p className="eyebrow">Contrato funcional</p><h3>Qué sí hace esta web</h3></div><ShieldCheck size={18} /></div><div className="truth-grid"><div><span className="truth-state truth-state-ready">FUNCIONA AQUÍ</span><strong>Navegación y estado declarado</strong><p>Cambia de módulo, muestra la situación conocida y conserva la ruta de proyecto en este navegador.</p></div><div><span className="truth-state truth-state-ready">FUNCIONA AQUÍ</span><strong>Enlaces y comandos</strong><p>Abre URLs externas y copia comandos; tú decides cuándo ejecutarlos en tu terminal.</p></div><div><span className="truth-state truth-state-pending">REQUIERE LOCAL</span><strong>Procesos y modelos</strong><p>Arrancar Gateway, usar Aider, conectar APIs y medir tokens exige un companion local o una instalación real.</p></div></div></section>
          </>
        )}

        {activeView === "workspaces" && (
          <section className="page-section">
            <div className="section-heading"><div><p className="eyebrow">Módulo 02 / Herramientas</p><h2>Todo lo instalado, sin mezclarlo.</h2></div><span className="section-note">3 estaciones · 1 operador</span></div>
            <div className="workspace-list">{services.map((service) => <ServiceCard key={service.id} service={service} onCopy={onCopy} />)}</div>
            <div className="setup-note"><Settings2 size={17} /><div><strong>Regla de oro</strong><p>Conecta un proveedor de modelo por estación. Esta interfaz recuerda rutas y comandos, pero nunca almacena tus API keys.</p></div><ShieldCheck size={17} className="muted-icon" /></div>
          </section>
        )}

        {activeView === "models" && (
          <Suspense fallback={<section className="page-section" aria-live="polite"><div className="section-heading"><div><p className="eyebrow">Módulo 02 / Modelos</p><h2>Cargando Model bridge…</h2></div></div></section>}>
            <ModelBridge />
          </Suspense>
        )}

        {activeView === "tokens" && <Suspense fallback={<section className="page-section" aria-live="polite"><h2>Cargando Token lab…</h2></section>}><TokenLabView showView={showView} /></Suspense>}

        {activeView === "memory" && <Suspense fallback={<section className="page-section" aria-live="polite"><h2>Cargando Memoria y archivos…</h2></section>}><MemoryView projectPath={projectPath} setProjectPath={setProjectPath} saveProjectPath={saveProjectPath} /></Suspense>}

        {activeView === "runbook" && <Suspense fallback={<section className="page-section" aria-live="polite"><h2>Cargando Runbook…</h2></section>}><RunbookView projectPath={projectPath} onCopy={onCopy} /></Suspense>}

        <footer className="page-footer"><span>AI Command Center / v1.0</span><span>Local-first · Open source friendly · Human in the loop</span></footer>
      </main>
    </div>
  );
}

export default Home;

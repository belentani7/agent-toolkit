/** Belentani · workbench basado en permisos locales y estados verificables. */
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, Check, ChevronDown, CircleDotDashed, FileCode2, Folder, FolderOpen, GitBranch, Info, LockKeyhole, Menu, Play, Plus, RefreshCcw, Search, Settings2, ShieldCheck, Terminal, X } from "lucide-react";
import { classifyOperation } from "@/lib/localPolicy";
import { openWorkspace, readWorkspaceFile, supportsDirectoryPicker, type Workspace, type WorkspaceFile } from "@/lib/browserWorkspace";

type Status = "VERIFIED" | "PARTIAL" | "FAILED" | "NOT_IMPLEMENTED";
type Evidence = { time: string; message: string; status: Status };
type Notice = { tone: "success" | "warning" | "error" | "info"; message: string };
const now = () => new Date().toLocaleTimeString();
const evidenceClass = (status: Status) => status === "VERIFIED" ? "green" : status === "FAILED" ? "red" : "amber";

function IconButton({ children, label, onClick, active = false }: { children: React.ReactNode; label: string; onClick?: () => void; active?: boolean }) {
  return <button aria-label={label} onClick={onClick} className={`icon-button ${active ? "is-active" : ""}`}>{children}</button>;
}

export default function Home() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null);
  const [content, setContent] = useState("// BELENTANI · LOCAL READY\n// Esperando permiso explícito para un workspace local.\n\n// 01  abre una carpeta que quieras inspeccionar\n// 02  selecciona un archivo para leerlo en modo seguro\n// 03  verifica cada operación antes de ejecutarla en la CLI\n\n// Ningún archivo se lee, escribe o transmite sin tu acción.");
  const [query, setQuery] = useState("");
  const [command, setCommand] = useState("");
  const [policy, setPolicy] = useState<Evidence | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 760);
  const [bottomOpen, setBottomOpen] = useState(true);
  const [evidence, setEvidence] = useState<Evidence[]>([{ time: "AHORA", status: "NOT_IMPLEMENTED", message: "Ningún workspace autorizado. No se han leído archivos." }]);
  const files = useMemo(() => workspace?.files.filter((file) => file.path.toLowerCase().includes(query.toLowerCase())) ?? [], [workspace, query]);

  function record(event: Evidence) { setEvidence((events) => [event, ...events].slice(0, 5)); }
  function notify(tone: Notice["tone"], message: string) { setNotice({ tone, message }); }
  async function chooseWorkspace() {
    try {
      const selected = await openWorkspace();
      setWorkspace(selected); setActiveFile(null);
      setContent("// WORKSPACE VERIFIED\n// La carpeta local fue autorizada. Selecciona un archivo para leerlo en modo seguro.");
      const event = { time: now(), status: "VERIFIED" as const, message: `${selected.files.length} archivos detectados en “${selected.name}”.` };
      setEvidence([event]); notify("success", `Workspace local abierto: ${selected.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo abrir el workspace.";
      if (message.includes("AbortError")) return;
      record({ time: now(), status: "FAILED", message }); notify("error", message);
    }
  }
  async function chooseFile(file: WorkspaceFile) {
    try { setActiveFile(file); setContent("// Leyendo archivo local autorizado..."); setContent(await readWorkspaceFile(file)); record({ time: now(), status: "VERIFIED", message: `Lectura local: ${file.path}` }); }
    catch (error) { const message = error instanceof Error ? error.message : "No se pudo leer el archivo."; setContent(`// FAILED\n// ${message}`); record({ time: now(), status: "FAILED", message }); }
  }
  function validateCommand() {
    const result = classifyOperation(command);
    const event: Evidence = result === "safe" ? { time: now(), status: "VERIFIED", message: "SAFE · permitido por la política determinista." } : result === "review" ? { time: now(), status: "PARTIAL", message: "CAUTION · requiere aprobación en la CLI local." } : { time: now(), status: "FAILED", message: "BLOCKED · este comando no se ejecutará." };
    setPolicy(event); record(event);
    if (event.status === "FAILED") notify("error", event.message); else if (event.status === "PARTIAL") notify("warning", event.message); else notify("success", event.message);
  }
  const lines = content.split("\n").slice(0, 220);

  return <main className="app-shell">
    <header className="topbar"><div className="brand-lockup"><div className="brand-mark" aria-hidden="true"><span className="b-stem">[</span><span className="b-arc b-arc-top">]</span><span className="b-arc b-arc-bottom">]</span><i></i></div><div><div className="wordmark">belentani</div><div className="brand-sub">NÚCLEO LOCAL <span>·</span> v0.3</div></div></div><div className="top-status"><span className="status-dot online"></span><span>SIN API · SIN MODELO</span><span className="status-divider"></span><span className="mono">POLÍTICA ACTIVA</span></div><div className="top-actions"><button type="button" className="open-workspace" onClick={chooseWorkspace}><FolderOpen size={14}/> abrir carpeta</button><IconButton label="Configuración" onClick={() => notify("info", "NOT_IMPLEMENTED: configuración persistente.")}><Settings2 size={16}/></IconButton><button className="avatar">BL</button></div></header>
    {notice && <div className={`local-notice ${notice.tone}`} role="status"><span>{notice.message}</span><button type="button" onClick={() => setNotice(null)} aria-label="Cerrar aviso"><X size={14}/></button></div>}
    <div className="workbench">
      <nav className="rail"><IconButton label="Menú" onClick={() => setSidebarOpen(!sidebarOpen)} active={sidebarOpen}><Menu size={18}/></IconButton><div className="rail-stack"><IconButton label="Archivos" active><Folder size={18}/></IconButton><IconButton label="Búsqueda" onClick={() => notify("info", "Usa el filtro del explorador.")}><Search size={18}/></IconButton><IconButton label="Git" onClick={() => notify("info", "PARTIAL: usa la CLI local para consultar Git.")}><GitBranch size={18}/></IconButton><IconButton label="Evidencia" onClick={() => setBottomOpen(true)}><Activity size={18}/></IconButton></div><div className="rail-bottom"><IconButton label="Política de seguridad"><ShieldCheck size={18}/></IconButton></div></nav>
      {sidebarOpen && <aside className="explorer panel-edge"><div className="pane-heading"><span>WORKSPACE</span><IconButton label="Abrir carpeta" onClick={chooseWorkspace}><FolderOpen size={15}/></IconButton></div><div className="project-title"><ChevronDown size={14}/><span className="folder-glyph">◆</span><strong>{workspace?.name ?? "LISTO PARA AUTORIZAR"}</strong><span className="project-count">{workspace?.files.length ?? 0}</span></div><div className="search-wrap"><Search size={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar archivos autorizados" /></div><div className="file-tree">{workspace ? files.map((file) => <button key={file.path} className={`tree-row child ${activeFile?.path === file.path ? "selected" : ""}`} onClick={() => chooseFile(file)}><FileCode2 size={14} className="tree-icon code-color"/><span>{file.path}</span></button>) : <div className="empty-tree"><LockKeyhole size={17}/><p>Permiso pendiente.</p><span>Abre una carpeta para iniciar una inspección local.</span></div>}{workspace && files.length === 0 && <div className="empty-tree"><Search size={17}/><p>Sin resultados.</p></div>}</div><div className="explorer-footer"><div><span className="status-dot online"></span> permiso explícito</div><span className="mono">READ_ONLY</span></div></aside>}
      <section className="center-stage"><div className="editor-tabs"><div className="tab active"><FileCode2 size={14}/><span>{activeFile?.name ?? "local-ready"}</span><X size={13}/></div><div className="tab-add"><Plus size={15}/></div><div className="editor-actions"><span className="saved"><CircleDotDashed size={13}/> solo lectura</span><IconButton label="Recargar" onClick={() => activeFile ? chooseFile(activeFile) : notify("info", "Selecciona un archivo primero.")}><RefreshCcw size={15}/></IconButton></div></div><div className="editor"><div className="file-breadcrumb"><span>{workspace?.name ?? "permiso local"}</span><ChevronDown size={12}/><strong>{activeFile?.path ?? "workbench listo"}</strong><span className="breadcrumb-note">· {activeFile?.language ?? "estado operativo"}</span></div><div className="code-view">{lines.map((line, index) => <div className="code-line" key={`${index}-${line}`}><span className="line-number">{String(index + 1).padStart(2, "0")}</span><code><span className={line.startsWith("// WORKSPACE VERIFIED") || line.startsWith("// BELENTANI") ? "fn" : line.startsWith("// FAILED") ? "str" : "code-text"}>{line || " "}</span></code></div>)}</div></div>
      {bottomOpen && <div className="bottom-panel"><div className="bottom-tabs"><button className="bottom-tab active"><Activity size={14}/> EVIDENCIA <span className="tab-badge">{evidence.length}</span></button><button className="bottom-tab"><Terminal size={14}/> TERMINAL <span className="zero-badge">CLI</span></button><button className="bottom-tab"><Info size={14}/> ESTADO REAL</button><button className="panel-collapse" onClick={() => setBottomOpen(false)}><ChevronDown size={15}/></button></div><div className="terminal-body">{evidence.map((event, index) => <div className="terminal-line" key={`${event.time}-${index}`}><span className="terminal-time">{event.time}</span><span className={`event-status ${evidenceClass(event.status)}`}>{event.status}</span><span className="terminal-text">{event.message}</span></div>)}<div className="terminal-line muted-line"><span className="terminal-time">CORE</span><span className="terminal-text">La ejecución real se limita a la CLI local; la interfaz no simula terminal ni edición.</span></div></div></div>}{!bottomOpen && <button className="collapsed-panel" onClick={() => setBottomOpen(true)}><Terminal size={14}/> abrir evidencia <ChevronDown size={14}/></button>}</section>
      <aside className="inspector panel-edge"><div className="pane-heading"><span>CONTROL LOCAL</span><span className="live-label"><span className="status-dot online"></span> ACTIVO</span></div><div className="inspector-card primary-card"><div className="card-kicker"><span className="trace-square"></span> CONTRATO DEL NÚCLEO</div><div className="mode-title"><div className="mode-icon"><ShieldCheck size={19}/></div><div><strong>Determinista</strong><span>sin modelo · sin API</span></div></div><div className="mode-rule"></div><p>La CLI emplea un workspace acotado, niveles de riesgo, aprobación y registro local. Esta vista pide permiso antes de leer.</p></div><div className="inspector-section"><div className="section-label">ESTADO VERIFICABLE <span>03</span></div><div className="state-list"><div><span className="state-icon green"><Check size={12}/></span><span>Core CLI local</span><strong>VERIFIED</strong></div><div><span className={`state-icon ${workspace ? "green" : "amber"}`}>{workspace ? <Check size={12}/> : <AlertTriangle size={12}/>}</span><span>Workspace actual</span><strong>{workspace ? "VERIFIED" : "NOT_SET"}</strong></div><div><span className="state-icon green"><Check size={12}/></span><span>Red / API / modelo</span><strong>0</strong></div></div></div><div className="inspector-section action-section"><div className="section-label">POLÍTICA DE COMANDO</div><textarea className="operation-input" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Ej.: git status" rows={3}/><div className="operation-hint"><span>no ejecuta desde el navegador</span><span className="mono">SAFE_MODE</span></div><button type="button" className="prepare-button" onClick={validateCommand}><Play size={14}/> verificar política</button></div><div className={`approval-card ${policy?.status === "VERIFIED" ? "approved" : ""}`}><div className="approval-icon">{policy?.status === "VERIFIED" ? <Check size={16}/> : <AlertTriangle size={16}/>}</div><div><strong>{policy?.status === "VERIFIED" ? "Comando seguro" : policy?.status === "FAILED" ? "Comando bloqueado" : "Aprobación requerida"}</strong><span>{policy?.message ?? "La CLI exige aprobación para operaciones no seguras."}</span></div></div><div className="inspector-footer"><span className="mono">BELENTANI CORE</span><span>{supportsDirectoryPicker() ? "FS ACCESS" : "FS N/I"}</span></div></aside>
    </div>
  </main>;
}

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Archive,
  Bot,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Command,
  ExternalLink,
  FileCode2,
  FileText,
  Folder,
  GitBranch,
  Github,
  Globe2,
  LayoutPanelLeft,
  Loader2,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Upload,
  UserRound,
  X,
} from "lucide-react";

const navItems = [
  { label: "Workspace", icon: LayoutPanelLeft },
  { label: "Repositories", icon: Github },
  { label: "Changes", icon: GitBranch },
];

const providerItems = [
  { name: "ChatGPT", tone: "bg-emerald-400" },
  { name: "Gemini", tone: "bg-blue-400" },
  { name: "Qwen", tone: "bg-violet-400" },
  { name: "DeepSeek", tone: "bg-cyan-400" },
];

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Workspace");
  const [chatInput, setChatInput] = useState("");
  const [projectContexts, setProjectContexts] = useState<Record<string, { chatStarted: boolean; previewMode: "preview" | "terminal"; aiProvider: string | null }>>({});
  const [showConnect, setShowConnect] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const projectsQuery = trpc.projects.list.useQuery(undefined, { enabled: isAuthenticated });
  const createProjectMutation = trpc.projects.create.useMutation({ onSuccess: (project) => { if (project) setActiveProjectId(project.id); void projectsQuery.refetch(); setNewProjectName(""); setShowNewProject(false); toast.success("Project created", { description: "Its repository and AI context are isolated." }); }, onError: () => toast.error("Project could not be created", { description: "Check your session and try again." }) });
  const projects = projectsQuery.data ?? [];
  const activeProject = projects.find((project) => project.id === activeProjectId);
  const projectKey = activeProjectId?.toString() ?? "unselected";
  const activeContext = projectContexts[projectKey] ?? { chatStarted: false, previewMode: "preview" as const, aiProvider: null };
  const chatStarted = activeContext.chatStarted;
  const previewMode = activeContext.previewMode;
  const updateProjectContext = (patch: Partial<typeof activeContext>) => setProjectContexts((current) => ({ ...current, [projectKey]: { ...activeContext, ...patch } }));

  const handleSend = () => {
    if (!chatInput.trim()) return;
    updateProjectContext({ chatStarted: true });
    setChatInput("");
    toast.success("Solicitud preparada", { description: "La conexión de un proveedor de IA será necesaria para ejecutarla." });
  };

  const handleAction = (description: string) => {
    toast.info(description, { description: "Esta acción se habilitará al conectar GitHub o un proveedor de IA." });
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-[#0b0d11] text-slate-300"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="app-shell min-h-screen bg-[#0b0d11] text-slate-100">
      <header className="topbar h-14 border-b border-white/[0.07] bg-[#101319]/95 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="brand-mark"><Code2 size={17} strokeWidth={2.4} /></div>
          <div className="hidden sm:block leading-none"><div className="text-[13px] font-semibold tracking-[-0.02em]">RepoPilot</div><div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-500">AI workspace</div></div>
          <Separator orientation="vertical" className="mx-2 h-5 bg-white/10" />
          <div className="project-picker"><button className="workspace-switch" onClick={() => setShowProjectMenu((value) => !value)}><Archive size={13} /><span>{activeProject?.name || "All projects"}</span><ChevronDown size={13} className="text-slate-500" /></button>{showProjectMenu && <div className="project-menu"><div className="project-menu-label">Personal workspace</div>{projects.length === 0 ? <div className="project-menu-empty">No projects yet</div> : projects.map((project) => <button key={project.id} className={`project-menu-item ${project.id === activeProjectId ? "active" : ""}`} onClick={() => { setActiveProjectId(project.id); setShowProjectMenu(false); }}><Archive size={13} /><span>{project.name}</span></button>)}<Separator className="my-1 bg-white/[0.07]" /><button className="project-menu-create" onClick={() => { setShowNewProject(true); setShowProjectMenu(false); }}><Plus size={13} />New project</button></div>}</div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500"><Command size={13} /><span>Quick actions</span><kbd>⌘ K</kbd></div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300 font-medium"><ShieldCheck size={12} className="mr-1.5" />Private</Badge>
          {isAuthenticated && user ? <button onClick={logout} className="avatar" title="Log out">{(user.name || user.email || "U").slice(0, 1).toUpperCase()}</button> : <Button onClick={() => startLogin()} size="sm" className="h-8 bg-white text-[#11151b] hover:bg-slate-200 text-xs">Sign in</Button>}
        </div>
      </header>

      {error && <div className="auth-error"><ShieldCheck size={13} /><span>We couldn't verify your session. Please sign in again.</span><button onClick={() => startLogin()}>Retry</button></div>}
      <div className="workspace-layout">
        <aside className="sidebar border-r border-white/[0.07] bg-[#0e1116] p-3 flex flex-col">
          <div className="mb-4 flex items-center justify-between px-2"><span className="section-label">Workspace</span><button className="icon-button" onClick={() => handleAction("Workspace settings")}><Settings2 size={14} /></button></div>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveNav(label)} className={`nav-item ${activeNav === label ? "is-active" : ""}`}><Icon size={15} /><span>{label}</span>{label === "Changes" && <span className="ml-auto text-[10px] text-slate-600">0</span>}</button>)}
          </nav>
          <Separator className="my-4 bg-white/[0.07]" />
          <div className="mb-2 px-2 flex items-center justify-between"><span className="section-label">Connected providers</span><button className="icon-button" onClick={() => setShowConnect(true)}><Plus size={14} /></button></div>
          <div className="space-y-1">
            {providerItems.map((provider) => <button key={provider.name} onClick={() => setShowConnect(true)} className="provider-row"><span className={`provider-dot ${provider.tone}`} />{provider.name}<span className="ml-auto text-[10px] text-slate-600">Setup</span></button>)}
          </div>
          <div className="mt-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"><div className="flex items-center gap-2 text-[11px] font-medium"><LockKeyhole size={13} className="text-emerald-300" />Secure by default</div><p className="mt-2 text-[10px] leading-relaxed text-slate-500">Changes stay local until you review and confirm a commit.</p></div>
        </aside>

        <main className="main-stage min-w-0">
          <div className="stage-toolbar h-12 border-b border-white/[0.07] px-4 flex items-center justify-between"><div className="flex items-center gap-2 text-[11px] text-slate-500"><span className="status-dot" />{activeProject ? `${activeProject.name} · no repository linked` : "No project selected"} <ChevronRight size={13} /></div><div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="icon-button" onClick={() => handleAction("Refresh repository state")}><RefreshCw size={14} /></Button><Button variant="ghost" size="icon" className="icon-button" onClick={() => handleAction("More workspace actions")}><MoreHorizontal size={15} /></Button></div></div>
          <div className="stage-grid">
            <section className="panel repo-panel">
              <div className="panel-header"><div className="flex items-center gap-2"><Github size={14} className="text-slate-400" /><span>Repository</span></div><button className="icon-button" onClick={() => setShowConnect(true)}><Plus size={14} /></button></div>
              <ScrollArea className="h-full"><div className="empty-panel"><div className="empty-icon"><Github size={19} /></div><h3>Connect GitHub</h3><p>List, select or create repositories with explicit permissions.</p><Button onClick={() => setShowConnect(true)} size="sm" className="mt-4 bg-white text-[#11151b] hover:bg-slate-200 text-xs"><Github size={14} className="mr-2" />Connect account</Button><button className="mt-3 text-[10px] text-slate-500 hover:text-slate-300" onClick={() => handleAction("Repository import")}>Import by URL instead</button></div></ScrollArea>
            </section>

            <section className="panel editor-panel">
              <div className="panel-header"><div className="flex items-center gap-2"><FileCode2 size={14} className="text-slate-400" /><span>Editor</span><span className="text-[10px] text-slate-600">No file open</span></div><div className="flex items-center gap-1"><button className="icon-button" onClick={() => handleAction("Upload a file")}><Upload size={14} /></button><button className="icon-button" onClick={() => handleAction("Open command palette")}><Command size={14} /></button></div></div>
              <div className="editor-empty"><div className="editor-watermark"><Code2 size={34} strokeWidth={1.2} /><div className="mt-3 text-xs text-slate-500">Select a file to start editing</div><div className="mt-1 text-[10px] text-slate-700">Your changes will appear here before review.</div></div><div className="editor-shortcuts"><span><kbd>⌘ P</kbd> Open file</span><span><kbd>⌘ I</kbd> Ask AI</span><span><kbd>⌘ S</kbd> Save locally</span></div></div>
              <div className="editor-footer"><span>Ln 1, Col 1</span><span>UTF-8</span><span className="ml-auto">Ready</span></div>
            </section>

            <section className="panel chat-panel">
              <div className="panel-header"><div className="flex items-center gap-2"><Bot size={14} className="text-sky-300" /><span>AI copilot</span><Badge variant="outline" className="ml-1 border-white/10 text-[9px] text-slate-500">No provider</Badge></div><button className="icon-button" onClick={() => setShowConnect(true)}><Settings2 size={14} /></button></div>
              <ScrollArea className="chat-scroll"><div className="chat-content">{!chatStarted ? <div className="chat-intro"><div className="ai-orb"><Sparkles size={18} /></div><h3>Build with context</h3><p>Ask for an explanation, a safe refactor or a proposed patch. RepoPilot will show the diff before anything changes.</p><div className="suggestion-grid"><button onClick={() => setChatInput("Explain the selected file")}>Explain this file</button><button onClick={() => setChatInput("Propose a focused refactor")}>Propose a refactor</button><button onClick={() => setChatInput("Find a likely bug")}>Find a likely bug</button><button onClick={() => setChatInput("Write a test for this")}>Write a test</button></div></div> : <div className="chat-message-list"><div className="chat-bubble user-bubble">{chatInput || "Prepare a safe code change"}</div><div className="chat-bubble assistant-bubble"><div className="flex items-center gap-2 text-sky-300 text-[11px] font-medium"><Bot size={13} />Copilot</div><p className="mt-2 text-[11px] leading-relaxed text-slate-400">Connect an official AI provider to analyze repository context and generate a reviewable proposal.</p></div></div>}</div></ScrollArea>
              <div className="chat-composer"><div className="composer-box"><Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Ask about your code..." className="min-h-[46px] resize-none border-0 bg-transparent px-3 py-2 text-xs shadow-none focus-visible:ring-0" /><div className="flex items-center justify-between px-2 pb-2"><button className="icon-button" onClick={() => handleAction("Attach a file or context")}><Paperclip size={14} /></button><Button onClick={handleSend} size="icon" className="h-7 w-7 rounded-lg bg-sky-400 text-slate-950 hover:bg-sky-300"><Send size={13} /></Button></div></div></div>
            </section>
          </div>

          <div className="bottom-stage border-t border-white/[0.07]">
            <div className="preview-toolbar h-10 px-4 flex items-center justify-between"><div className="flex items-center gap-1"><button onClick={() => updateProjectContext({ previewMode: "preview" })} className={`bottom-tab ${previewMode === "preview" ? "is-selected" : ""}`}><Globe2 size={13} />Preview</button><button onClick={() => updateProjectContext({ previewMode: "terminal" })} className={`bottom-tab ${previewMode === "terminal" ? "is-selected" : ""}`}><TerminalSquare size={13} />Terminal</button></div><div className="flex items-center gap-2"><span className="text-[10px] text-slate-600">Local preview</span><button className="icon-button" onClick={() => handleAction("Run preview")}><Play size={13} /></button><button className="icon-button" onClick={() => handleAction("Open preview in new tab")}><ExternalLink size={13} /></button></div></div>
            <div className="preview-canvas">{previewMode === "preview" ? <div className="preview-empty"><div className="browser-window"><div className="browser-dots"><i /><i /><i /></div><div className="browser-address"><Globe2 size={11} /> localhost / preview</div><div className="browser-body"><div className="browser-placeholder"><LayoutPanelLeft size={20} /><span>Choose a compatible project to preview it here.</span><Button onClick={() => handleAction("Select a repository to preview")} variant="outline" size="sm" className="mt-3 h-7 border-white/10 bg-transparent text-[10px] text-slate-400 hover:bg-white/5 hover:text-white">Select project</Button></div></div></div></div> : <div className="terminal-empty"><TerminalSquare size={17} /><span>Terminal will be available when a project is selected.</span></div>}</div>
          </div>
        </main>
      </div>
      {!isAuthenticated && !error && <div className="workspace-lock"><div className="workspace-lock-card"><div className="ai-orb"><LockKeyhole size={18} /></div><div className="modal-eyebrow mt-4">Private workspace</div><h2>Sign in to access your repositories</h2><p>Your GitHub permissions, local edits and AI context stay behind your personal session.</p><Button onClick={() => startLogin()} className="mt-5 w-full bg-white text-[#11151b] hover:bg-slate-200 text-xs">Continue with secure sign-in</Button></div></div>}

      {showNewProject && <div className="modal-backdrop" onMouseDown={() => setShowNewProject(false)}><div className="connect-modal new-project-modal" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><div className="modal-eyebrow">Project context</div><h2>Create a project</h2><p>Projects keep repository, AI chat, open files and preview state isolated from one another.</p></div><button className="icon-button" onClick={() => setShowNewProject(false)}><X size={15} /></button></div><label className="field-label" htmlFor="project-name">Project name</label><Input id="project-name" autoFocus value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g. Marketing site" className="mt-2 border-white/10 bg-white/[0.03] text-xs" /><Button disabled={!newProjectName.trim() || createProjectMutation.isPending} onClick={() => createProjectMutation.mutate({ name: newProjectName })} className="mt-4 w-full bg-white text-[#11151b] hover:bg-slate-200 text-xs">{createProjectMutation.isPending ? "Creating…" : "Create project"}</Button></div></div>}

      {showConnect && <div className="modal-backdrop" onMouseDown={() => setShowConnect(false)}><div className="connect-modal" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><div className="modal-eyebrow">Secure connection</div><h2>Connect your developer tools</h2><p>Authorize only the providers you want to use. Tokens remain server-side and actions require your confirmation.</p></div><button className="icon-button" onClick={() => setShowConnect(false)}><X size={15} /></button></div><div className="connection-card selected"><div className="flex items-center gap-3"><div className="connection-icon github-icon"><Github size={17} /></div><div><div className="text-sm font-medium">GitHub</div><div className="text-[10px] text-slate-500">Repositories, files and confirmed commits</div></div></div><Button onClick={() => handleAction("GitHub OAuth setup requested")} size="sm" className="mt-4 w-full bg-white text-[#11151b] hover:bg-slate-200 text-xs">Authorize GitHub</Button></div><div className="provider-list">{providerItems.map(({ name, tone }) => <button key={name} onClick={() => handleAction(`${name} API configuration`)} className="connection-row"><span className={`provider-dot ${tone}`} />{name}<span className="ml-auto text-[10px] text-slate-600">Configure API <ChevronRight size={12} /></span></button>)}</div><div className="modal-note"><ShieldCheck size={13} className="text-emerald-300" />Never embed provider websites. External services open in a separate secure tab.</div></div></div>}
    </div>
  );
}

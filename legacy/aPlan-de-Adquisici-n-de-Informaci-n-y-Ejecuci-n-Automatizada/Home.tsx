import { useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  Cloud,
  FileJson,
  Github,
  Import,
  Layers3,
  Lightbulb,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const iconForSource = (source: string) => source.toLowerCase().includes("github") ? Github : FileJson;
const dateLabel = (date?: Date | string | null) => date ? new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "Sin fecha";

export default function Home() {
  const [activeView, setActiveView] = useState<"overview" | "inventory" | "action-plan">("overview");
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importKind, setImportKind] = useState<"projects" | "drive">("projects");
  const [importFormat, setImportFormat] = useState<"json" | "csv">("json");
  const [importRaw, setImportRaw] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const projectsQuery = trpc.projects.list.useQuery();
  const actionPlanQuery = trpc.projects.actionPlan.useQuery();
  const pipelineQuery = trpc.pipeline.status.useQuery();
  const pipelineMutation = trpc.pipeline.syncGithub.useMutation({
    onSuccess: (result) => {
      toast.success("Pipeline GitHub completado", { description: `${result.verified}/${result.selected} repositorios verificados · ${result.stages.length} etapas` });
      projectsQuery.refetch();
      actionPlanQuery.refetch();
      pipelineQuery.refetch();
    },
    onError: (error) => toast.error("El pipeline no pudo completarse", { description: error.message }),
  });
  const githubMutation = trpc.projects.syncGithub.useMutation({
    onSuccess: (result) => { toast.success(`${result.count} repositorios reales sincronizados desde GitHub`); projectsQuery.refetch(); actionPlanQuery.refetch(); },
    onError: (error) => toast.error("No se pudo sincronizar GitHub", { description: error.message }),
  });
  const importMutation = trpc.projects.import.useMutation({
    onSuccess: (result) => {
      toast.success(`${result.imported} proyectos incorporados`, { description: result.excluded ? `${result.excluded} filas excluidas o duplicadas.` : "El inventario quedó actualizado." });
      setImportOpen(false); setImportRaw(""); projectsQuery.refetch(); actionPlanQuery.refetch();
    },
    onError: (error) => toast.error("No se pudo importar", { description: error.message }),
  });
  const driveImportMutation = trpc.projects.importDriveMetadata.useMutation({
    onSuccess: (result) => { toast.success(`${result.imported} metadatos de Drive incorporados`, { description: result.excluded ? `${result.excluded} archivos excluidos o duplicados.` : "Solo se guardaron metadatos, no el contenido." }); setImportOpen(false); setImportRaw(""); projectsQuery.refetch(); actionPlanQuery.refetch(); },
    onError: (error) => toast.error("No se pudo importar Drive", { description: error.message }),
  });
  const resetMutation = trpc.projects.reset.useMutation({ onSuccess: () => { toast.success("Inventario reiniciado"); projectsQuery.refetch(); actionPlanQuery.refetch(); } });

  const projects = projectsQuery.data ?? [];
  const filteredProjects = useMemo(() => projects.filter(project => `${project.name} ${project.purpose} ${project.stack}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const averageScore = projects.length ? Math.round(projects.reduce((sum, project) => sum + project.score, 0) / projects.length) : 0;
  const activeCount = projects.filter(project => project.status === "activo").length;
  const documentedCount = projects.filter(project => Boolean(project.hasDocs)).length;
  const topProject = projects[0];

  const handleFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setImportRaw(text);
    setImportFormat(file.name.toLowerCase().endsWith(".csv") ? "csv" : "json");
    setImportOpen(true);
  };

  const handleImport = () => {
    if (!importRaw.trim()) return toast.error("Selecciona un archivo o pega datos primero.");
    if (importKind === "drive") return driveImportMutation.mutate({ raw: importRaw });
    importMutation.mutate({ raw: importRaw, format: importFormat });
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#110b0d] text-[#f8eee9] shadow-2xl shadow-red-950/20">
      <div className="relative border-b border-white/10 px-5 py-6 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300/80"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-lg shadow-red-400" /> Centro de mando / Belentani</div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Menos ecosistema.<br /><span className="text-red-300">Más cierre.</span></h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b8a4a0]">Un inventario vivo de tus proyectos, ordenado por señales verificables de cercanía a valor. Los datos estimados están marcados. La información sensible queda fuera.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => githubMutation.mutate()} disabled={githubMutation.isPending} variant="outline" className="gap-2 rounded-full border-red-300/20 bg-red-400/5 text-red-100 hover:bg-red-400/10">{githubMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} {githubMutation.isPending ? "Sincronizando…" : "Sincronizar GitHub"}</Button>
            <Button onClick={() => pipelineMutation.mutate()} disabled={pipelineMutation.isPending} variant="outline" className="gap-2 rounded-full border-emerald-300/20 bg-emerald-400/5 text-emerald-100 hover:bg-emerald-400/10">{pipelineMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} {pipelineMutation.isPending ? "Gobernando…" : "Ejecutar pipeline"}</Button>
            <Button onClick={() => { setImportKind("projects"); setImportOpen(true); }} className="gap-2 rounded-full bg-red-500 px-4 text-white shadow-lg shadow-red-950/40 hover:bg-red-400"><Upload className="h-4 w-4" /> Importar inventario</Button>
            <Button onClick={() => { setImportKind("drive"); setImportFormat("json"); setImportOpen(true); }} variant="outline" className="gap-2 rounded-full border-white/15 bg-white/5 text-[#f8eee9] hover:bg-white/10"><FileJson className="h-4 w-4" /> Metadatos Drive</Button>
            <Button onClick={() => { projectsQuery.refetch(); actionPlanQuery.refetch(); }} variant="outline" className="gap-2 rounded-full border-white/15 bg-white/5 text-[#f8eee9] hover:bg-white/10"><RefreshCw className="h-4 w-4" /> Actualizar</Button>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-black/10 p-1 sm:w-fit">
          {[{ id: "overview", label: "Resumen", icon: BarChart3 }, { id: "inventory", label: "Inventario", icon: Layers3 }, { id: "action-plan", label: "Plan de esta semana", icon: Target }].map(item => <button key={item.id} onClick={() => setActiveView(item.id as typeof activeView)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${activeView === item.id ? "bg-white/10 text-white shadow-inner" : "text-[#9e8985] hover:text-white"}`}><item.icon className="h-4 w-4" />{item.label}</button>)}
        </div>
      </div>

      <div className="grid gap-4 border-b border-white/10 px-5 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
        {[{ label: "Proyectos visibles", value: projects.length, detail: "sin datos sensibles", icon: Layers3, color: "text-red-300" }, { label: "Score medio", value: `${averageScore}/100`, detail: "cercanía a valor", icon: Activity, color: "text-orange-300" }, { label: "Con documentación", value: documentedCount, detail: projects.length ? `${Math.round(documentedCount / projects.length * 100)}% del inventario` : "pendiente", icon: BookOpen, color: "text-amber-200" }, { label: "Activos confirmados", value: activeCount, detail: "no estimados", icon: Check, color: "text-emerald-300" }].map(stat => <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur"><div className="flex items-center justify-between"><span className="text-xs text-[#9e8985]">{stat.label}</span><stat.icon className={`h-4 w-4 ${stat.color}`} /></div><div className="mt-3 text-2xl font-semibold tracking-tight">{stat.value}</div><div className="mt-1 text-xs text-[#806d69]">{stat.detail}</div></div>)}
      </div>

      <main className="px-5 py-6 sm:px-8 lg:px-10">
        {activeView === "overview" && <Overview projects={projects} topProject={topProject} actionPlan={actionPlanQuery.data} onOpenPlan={() => setActiveView("action-plan")} />}
        {activeView === "inventory" && <Inventory projects={filteredProjects} query={query} setQuery={setQuery} onFile={handleFile} onReset={() => resetMutation.mutate()} />}
        {activeView === "action-plan" && <ActionPlan data={actionPlanQuery.data} onBack={() => setActiveView("overview")} />}
      </main>

      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-xs text-[#806d69] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Filtro sensible activo · {pipelineQuery.data?.runs?.[0]?.status ?? "sin ejecuciones"}</div><span>Pipeline PLAN → EXECUTE → VERIFY → AUDIT · {pipelineQuery.data?.auditEvents?.length ?? 0} eventos encadenados</span></div>

      {importOpen && <ImportDialog kind={importKind} format={importFormat} setFormat={setImportFormat} raw={importRaw} setRaw={setImportRaw} fileRef={fileRef} onFile={handleFile} onClose={() => setImportOpen(false)} onImport={handleImport} loading={importMutation.isPending || driveImportMutation.isPending} />}
    </div>
  );
}

function Overview({ projects, topProject, actionPlan, onOpenPlan }: { projects: any[]; topProject?: any; actionPlan?: any; onOpenPlan: () => void }) {
  return <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-red-300"><Sparkles className="h-4 w-4" /> Foco recomendado</div><h2 className="mt-3 text-2xl font-semibold tracking-tight">{topProject?.name ?? "Cargando inventario…"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#ae9b96]">{topProject?.purpose ?? "Estamos preparando el primer inventario con los proyectos públicos descritos en tu prompt."}</p></div><div className="rounded-2xl bg-red-500/15 px-4 py-3 text-right"><div className="text-3xl font-semibold text-red-200">{topProject?.score ?? 0}</div><div className="text-[10px] uppercase tracking-widest text-red-200/60">score / 100</div></div></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2"><Signal icon={Github} label="Actividad reciente" value={topProject?.commits30d ? `${topProject.commits30d} commits / 30d` : "Sin datos importados"} active={Boolean(topProject?.commits30d)} /><Signal icon={Cloud} label="Deploy verificable" value={topProject?.hasDeploy ? "Sí" : "Pendiente de validar"} active={Boolean(topProject?.hasDeploy)} /><Signal icon={UsersRound} label="Usuarios" value={topProject?.hasUsers ? "Señal confirmada" : "No informado"} active={Boolean(topProject?.hasUsers)} /><Signal icon={BookOpen} label="Documentación" value={topProject?.hasDocs ? "Disponible" : "Por crear"} active={Boolean(topProject?.hasDocs)} /></div>
      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-sm font-medium">Siguiente movimiento</div><div className="mt-1 text-xs text-[#aa9691]">{actionPlan?.steps?.[0]?.title ?? "Importa señales reales para generar un plan."}</div></div><Button onClick={onOpenPlan} variant="outline" className="gap-2 rounded-full border-red-300/20 bg-transparent text-red-200 hover:bg-red-300/10">Ver plan <ArrowUpRight className="h-4 w-4" /></Button></div>
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#191012] p-5 sm:p-7"><div className="flex items-center justify-between"><div><div className="text-xs font-medium uppercase tracking-[0.18em] text-[#9e8985]">Distribución</div><h2 className="mt-2 text-xl font-semibold">¿Dónde está la energía?</h2></div><BarChart3 className="h-5 w-5 text-orange-300" /></div><div className="mt-7 space-y-5">{projects.slice(0, 5).map((project, index) => <div key={project.id}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate text-[#d9c8c2]">{project.name}</span><span className="font-medium text-red-200">{project.score}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${index === 0 ? "bg-red-400" : "bg-orange-300/70"}`} style={{ width: `${Math.max(project.score, 4)}%` }} /></div></div>)}{projects.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-[#9e8985]">Todavía no hay proyectos visibles.</div>}</div><div className="mt-7 flex items-center gap-2 text-xs text-[#806d69]"><Lightbulb className="h-4 w-4 text-amber-200" /> El score prioriza señales, no intuiciones.</div></section>
  </div>;
}

function Signal({ icon: Icon, label, value, active }: { icon: any; label: string; value: string; active: boolean }) { return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-3"><div className={`rounded-xl p-2 ${active ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-[#907b76]"}`}><Icon className="h-4 w-4" /></div><div className="min-w-0"><div className="text-xs text-[#806d69]">{label}</div><div className="truncate text-sm text-[#e1d3ce]">{value}</div></div></div>; }

function Inventory({ projects, query, setQuery, onFile, onReset }: { projects: any[]; query: string; setQuery: (v: string) => void; onFile: (file?: File) => void; onReset: () => void }) {
  return <section><div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-red-300"><Layers3 className="h-4 w-4" /> Inventario unificado</div><h2 className="mt-3 text-2xl font-semibold">Lo que existe, sin adornos</h2><p className="mt-2 text-sm text-[#9e8985]">Carga JSON o CSV con señales reales. Los duplicados y registros sensibles se excluyen automáticamente.</p></div><div className="flex gap-2"><Button onClick={() => document.getElementById("inventory-file")?.click()} variant="outline" className="gap-2 rounded-full border-white/15 bg-white/5 text-[#f8eee9]"><Upload className="h-4 w-4" /> Cargar archivo</Button><input id="inventory-file" className="hidden" type="file" accept=".json,.csv,application/json,text/csv" onChange={event => onFile(event.target.files?.[0])} /><Button onClick={onReset} variant="ghost" className="gap-2 rounded-full text-[#9e8985] hover:bg-red-500/10 hover:text-red-200"><Trash2 className="h-4 w-4" /> Reiniciar</Button></div></div><div className="mb-5 flex items-center gap-3"><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar proyecto, propósito o stack…" className="max-w-xl rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-[#806d69]" /><span className="text-xs text-[#806d69]">{projects.length} visibles</span></div><div className="grid gap-3 lg:grid-cols-2">{projects.map(project => { const SourceIcon = iconForSource(project.source); return <article key={project.id} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-red-300/30 hover:bg-white/[0.055]"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><div className="rounded-xl bg-red-500/10 p-2.5 text-red-200"><SourceIcon className="h-4 w-4" /></div><div className="min-w-0"><h3 className="truncate font-medium text-[#f5e8e2]">{project.name}</h3><p className="mt-1 line-clamp-2 text-sm leading-5 text-[#a5918c]">{project.purpose}</p></div></div><div className="text-right"><div className="text-2xl font-semibold text-red-200">{project.score}</div><div className="text-[10px] uppercase tracking-wider text-[#806d69]">score</div></div></div><div className="mt-4 flex flex-wrap gap-2"><Badge variant="outline" className="border-white/10 bg-black/10 text-[#bca9a3]">{project.status}</Badge><Badge variant="outline" className="border-white/10 bg-black/10 text-[#bca9a3]">{project.stack}</Badge>{project.estimated ? <Badge className="border-amber-300/10 bg-amber-300/10 text-amber-200">estimado</Badge> : <Badge className="border-emerald-300/10 bg-emerald-300/10 text-emerald-200">verificado</Badge>}</div><div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#806d69]"><span>Última actividad: {dateLabel(project.lastActivityAt)}</span><span>{project.source}</span></div></article> })}{projects.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-10 text-center text-sm text-[#9e8985]">No hay coincidencias. Prueba otra búsqueda o importa un inventario.</div>}</div></section>;
}

function ActionPlan({ data, onBack }: { data: any; onBack: () => void }) { return <section className="mx-auto max-w-4xl"><button onClick={onBack} className="mb-6 text-sm text-[#9e8985] hover:text-white">← Volver al resumen</button><div className="rounded-3xl border border-red-300/20 bg-gradient-to-br from-red-500/[0.12] to-white/[0.03] p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-red-200"><Target className="h-4 w-4" /> Semana de foco</div><h2 className="mt-3 text-3xl font-semibold tracking-tight">{data?.project?.name ?? "Sin proyecto prioritario"}</h2><p className="mt-2 text-sm text-[#bdaaa5]">Cinco pasos concretos generados desde las señales disponibles. Ajusta los datos si alguna señal es estimada.</p></div><div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-center"><div className="text-2xl font-semibold text-red-100">{data?.project?.score ?? 0}</div><div className="text-[10px] uppercase tracking-widest text-red-100/60">prioridad</div></div></div><div className="mt-8 space-y-3">{(data?.steps ?? []).map((step: any) => <div key={step.order} className="flex gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-400/15 text-sm font-semibold text-red-200">{step.order}</div><div><div className="font-medium text-[#f2e3de]">{step.title}</div><div className="mt-1 text-xs text-[#806d69]">Responsable: {step.owner} · Estado: {step.status}</div></div></div>)}{!data && <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-[#9e8985]">Importa o valida proyectos para generar el plan.</div>}</div></div></section>; }

function ImportDialog({ kind, format, setFormat, raw, setRaw, fileRef, onFile, onClose, onImport, loading }: { kind: "projects" | "drive"; format: "json" | "csv"; setFormat: (v: "json" | "csv") => void; raw: string; setRaw: (v: string) => void; fileRef: React.RefObject<HTMLInputElement | null>; onFile: (file?: File) => void; onClose: () => void; onImport: () => void; loading: boolean }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#1c1013] p-6 shadow-2xl shadow-black/60"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-red-300"><Import className="h-4 w-4" /> {kind === "drive" ? "Google Drive · solo metadatos" : "Incorporar señales"}</div><h2 className="mt-2 text-2xl font-semibold">{kind === "drive" ? "Importar export de Drive" : "Importar inventario"}</h2></div><button onClick={onClose} className="text-2xl text-[#806d69] hover:text-white">×</button></div><p className="mt-3 text-sm leading-6 text-[#a5918c]">{kind === "drive" ? "Usa el JSON de `gws drive files list`. Se excluyen archivos legales, de terceros, chats, sesiones y borradores; nunca se guarda el contenido." : "Se excluyen automáticamente filas que parezcan contener información legal, personal, de terceros o conflictos. No se inventan métricas."}</p><div className="mt-5 flex gap-2"><Button onClick={() => { fileRef.current?.click(); }} variant="outline" className="gap-2 rounded-full border-white/15 bg-white/5 text-[#f8eee9]"><Upload className="h-4 w-4" /> Elegir archivo</Button><input ref={fileRef} className="hidden" type="file" accept={kind === "drive" ? ".json" : ".json,.csv"} onChange={event => onFile(event.target.files?.[0])} />{kind === "projects" && <div className="flex rounded-full border border-white/10 p-1"><button onClick={() => setFormat("json")} className={`rounded-full px-3 py-1 text-xs ${format === "json" ? "bg-white/10 text-white" : "text-[#806d69]"}`}>JSON</button><button onClick={() => setFormat("csv")} className={`rounded-full px-3 py-1 text-xs ${format === "csv" ? "bg-white/10 text-white" : "text-[#806d69]"}`}>CSV</button></div>}</div><Textarea value={raw} onChange={event => setRaw(event.target.value)} placeholder={kind === "drive" ? '{"files":[{"name":"proyecto.md","mimeType":"text/markdown","modifiedTime":"2026-09-16T12:00:00Z","webViewLink":"https://drive.google.com/..."}]}' : format === "json" ? '[{"name":"mi-proyecto","purpose":"...","commits30d":4,"hasDocs":true}]' : "name,purpose,status,stack,commits30d,hasDeploy,hasUsers,hasDocs,hasRevenue,sourceUrl"} className="mt-4 min-h-48 rounded-2xl border-white/10 bg-black/20 font-mono text-xs text-[#f8eee9] placeholder:text-[#685652]" /><div className="mt-5 flex justify-end gap-2"><Button onClick={onClose} variant="ghost" className="rounded-full text-[#9e8985]">Cancelar</Button><Button onClick={onImport} disabled={loading} className="gap-2 rounded-full bg-red-500 text-white hover:bg-red-400">{loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {loading ? "Importando…" : "Incorporar"}</Button></div></div></div>; }

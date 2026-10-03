"use client";

import { motion } from "framer-motion";
import {
  Hexagon,
  Terminal,
  Database,
  Network,
  ShieldCheck,
  GitBranch,
  BrainCircuit,
  Layers,
  Activity,
  ChevronRight,
  Boxes,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { catStyle, STATUS_STYLES, SEVERITY_STYLES } from "./colors";
import type { StatsResponse, AuditEventDTO } from "./types";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
      <Card className="relative overflow-hidden border-zinc-800 bg-zinc-900/60 backdrop-blur">
        <div className={`absolute inset-x-0 top-0 h-px ${accent}`} />
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                {label}
              </p>
              <p className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-zinc-100 tabular-nums">
                {value}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-400">
              {icon}
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LayerRow({
  title,
  code,
  icon,
  children,
  color,
}: {
  title: string;
  code: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`rounded-xl border bg-zinc-900/40 p-3 sm:p-4 ${color}`}>
      <div className="flex items-center gap-2">
        <span className="text-zinc-300">{icon}</span>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
          {title}
        </span>
        <span className="ml-auto font-mono text-[10px] text-zinc-600">{code}</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function Overview({
  stats,
  audit,
}: {
  stats: StatsResponse | undefined;
  audit: AuditEventDTO[] | undefined;
}) {
  const indexed = stats?.repos.byStatus.INDEXADO ?? 0;
  const total = stats?.repos.total ?? 0;
  const pct = total ? Math.round((indexed / total) * 100) : 0;

  const complexityEntries = stats
    ? Object.entries(stats.skills.byComplexity).sort((a, b) => b[1] - a[1])
    : [];
  const maxComplexity = Math.max(1, ...complexityEntries.map(([, v]) => v));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.5 }}
        aria-labelledby="nexus-title"
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(52,211,153,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.35) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-emerald-500/30 bg-emerald-500/10 font-mono text-emerald-300 hover:bg-emerald-500/10">
              PLAN MAESTRO v1.0
            </Badge>
            <Badge variant="outline" className="border-zinc-700 font-mono text-zinc-400">
              SUPABASE + MCP + PGVECTOR
            </Badge>
            <Badge variant="outline" className="border-zinc-700 font-mono text-zinc-400">
              4 FASES · 20 SEMANAS
            </Badge>
          </div>
          <h1
            id="nexus-title"
            className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100"
          >
            Ecosistema de Agentes Autónomos{" "}
            <span className="text-emerald-400">Multi-Stack</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-zinc-400">
            Arquitectura integral de un enjambre corporativo de agentes con{" "}
            <strong className="text-zinc-200">62 habilidades agénticas</strong> en 9
            sub-dominios, persistencia semántica en{" "}
            <strong className="text-zinc-200">Supabase/pgvector</strong>, interoperabilidad
            nativa vía <strong className="text-zinc-200">Model Context Protocol</strong> y
            auditoría legal inmutable con cadena SHA-256. El corpus de ingesta inicial ya
            está montado: <strong className="text-zinc-200">470 repositorios reales</strong>{" "}
            del workspace GitHub indexándose hacia el objetivo de 1.000.
          </p>
        </div>
      </motion.section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          icon={<Wrench className="h-5 w-5" aria-hidden />}
          label="Habilidades"
          value={stats ? String(stats.skills.total) : "—"}
          sub={stats ? `${stats.skills.categories} sub-dominios · ${stats.skills.nucleo} de núcleo` : "cargando…"}
          accent="bg-gradient-to-r from-emerald-400 to-teal-400"
        />
        <KpiCard
          icon={<GitBranch className="h-5 w-5" aria-hidden />}
          label="Corpus indexado"
          value={stats ? `${indexed}/${total}` : "—"}
          sub={`objetivo: 1.000 repos · ${pct}% vectorizado`}
          accent="bg-gradient-to-r from-amber-400 to-orange-400"
        />
        <KpiCard
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          label="Auditoría hash"
          value={stats ? String(stats.audits.total) : "—"}
          sub="eventos en cadena inmutable SHA-256"
          accent="bg-gradient-to-r from-rose-400 to-red-400"
        />
        <KpiCard
          icon={<Activity className="h-5 w-5" aria-hidden />}
          label="Planes orquestados"
          value={stats ? String(stats.simulations) : "—"}
          sub="simulaciones LLM del supervisor"
          accent="bg-gradient-to-r from-fuchsia-400 to-pink-400"
        />
      </div>

      {/* Diagrama de arquitectura en capas */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
        aria-labelledby="arch-diagram"
      >
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" aria-hidden />
          <h2 id="arch-diagram" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            {"// Arquitectura lógica · cerebro → skills → MCP → entorno"}
          </h2>
        </div>
        <div className="space-y-2.5 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3 sm:p-5">
          <LayerRow
            title="Cerebro · Orquestador"
            code="L4 · RAZ"
            icon={<BrainCircuit className="h-4 w-4" aria-hidden />}
            color="border-emerald-500/30"
          >
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {["HTN/DAG", "Debate adversarial", "Tree-of-Thoughts", "Anti-alucinación", "Compresión de contexto"].map(
                (t) => (
                  <span key={t} className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-emerald-200/80">
                    {t}
                  </span>
                )
              )}
            </div>
          </LayerRow>

          <div className="flex justify-center" aria-hidden>
            <ChevronRight className="h-4 w-4 rotate-90 text-zinc-700" />
          </div>

          <LayerRow
            title="Skills agénticas · 62"
            code="L3 · FSE/INF/SEG/DEV/WSC/FIN/SOP"
            icon={<Boxes className="h-4 w-4" aria-hidden />}
            color="border-teal-500/30"
          >
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {[
                ["FSE", "teal", 10],
                ["INF", "amber", 8],
                ["SEG", "rose", 8],
                ["MCP", "lime", 7],
                ["DEV", "orange", 6],
                ["WSC", "fuchsia", 4],
                ["FIN", "yellow", 4],
                ["SOP", "cyan", 4],
              ].map(([code, colorKey, n]) => (
                <span key={code as string} className={`rounded-md border px-2 py-1 ${catStyle(colorKey as string).chip}`}>
                  {code} · {n} skills
                </span>
              ))}
            </div>
          </LayerRow>

          <div className="flex justify-center" aria-hidden>
            <ChevronRight className="h-4 w-4 rotate-90 text-zinc-700" />
          </div>

          <LayerRow
            title="Capa MCP · JSON-RPC 2.0 + mTLS"
            code="L2 · INTEROP"
            icon={<Network className="h-4 w-4" aria-hidden />}
            color="border-lime-500/30"
          >
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {["mcp-server/filesystem", "registro de tools", "sandbox", "streaming SSE", "path-jail"].map((t) => (
                <span key={t} className="rounded-md border border-lime-500/20 bg-lime-500/5 px-2 py-1 text-lime-200/80">
                  {t}
                </span>
              ))}
            </div>
          </LayerRow>

          <div className="flex justify-center" aria-hidden>
            <ChevronRight className="h-4 w-4 rotate-90 text-zinc-700" />
          </div>

          <LayerRow
            title="Entorno físico y de datos"
            code="L1 · SUPABASE + APIs"
            icon={<Database className="h-4 w-4" aria-hidden />}
            color="border-amber-500/30"
          >
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono sm:grid-cols-4">
              {[
                ["agentes", "estado vivo"],
                ["memoria_episodica", "pgvector HNSW"],
                ["auditoria_legal", "WORM + SHA-256"],
                ["cola_trabajos", "SKIP LOCKED"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-md border border-amber-500/20 bg-amber-500/5 p-2">
                  <p className="text-amber-200/90">{t}</p>
                  <p className="text-zinc-500">{d}</p>
                </div>
              ))}
            </div>
          </LayerRow>
        </div>
      </motion.section>

      {/* Distribuciones + auditoría */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          aria-labelledby="pipeline-kpi"
          className="lg:col-span-2"
        >
          <Card className="h-full border-zinc-800 bg-zinc-900/60">
            <CardContent className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="pipeline-kpi" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  {"// Pipeline de indexación masiva"}
                </h2>
                <Badge variant="outline" className="border-zinc-700 font-mono text-zinc-500">
                  {stats ? `${total} / ${stats.goalRepos} repos` : "…"}
                </Badge>
              </div>
              {stats ? (
                <div className="space-y-3">
                  {(["PENDIENTE", "CHUNKING", "EMBEDDING", "INDEXADO"] as const).map((st) => {
                    const count = stats.repos.byStatus[st] ?? 0;
                    const bar = Math.round((count / Math.max(1, total)) * 100);
                    const style = STATUS_STYLES[st];
                    return (
                      <div key={st}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-mono text-zinc-400">{style.label}</span>
                          <span className="font-mono tabular-nums text-zinc-500">{count} repos</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                          <motion.div
                            className={`h-full rounded-full ${style.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2">
                    <Progress
                      value={pct}
                      aria-label="Progreso de indexación total"
                      className="h-1.5 bg-zinc-800 [&>div]:bg-emerald-500"
                    />
                    <p className="mt-1 text-right font-mono text-[10px] text-zinc-500">
                      {pct}% del corpus con embeddings activos
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full bg-zinc-800/60" />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          aria-labelledby="audit-kpi"
        >
          <Card className="h-full border-zinc-800 bg-zinc-900/60">
            <CardContent className="p-4 sm:p-5">
              <h2 id="audit-kpi" className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-400">
                {"// Cadena de auditoría (reciente)"}
              </h2>
              {audit ? (
                <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 custom-scroll" aria-label="Eventos de auditoría">
                  {audit.slice(0, 8).map((e) => {
                    const sev = SEVERITY_STYLES[e.severity] ?? SEVERITY_STYLES.INFO;
                    return (
                      <li
                        key={e.id}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] ${sev.chip}`}>
                            {sev.label}
                          </span>
                          <span className="truncate font-mono text-zinc-300">{e.action}</span>
                        </div>
                        <p className="mt-1 truncate font-mono text-[10px] text-zinc-600">
                          {e.agentCode} · hash:{" "}
                          <span className="text-zinc-500">{e.payloadHash.slice(0, 12)}…</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <Skeleton className="h-48 w-full bg-zinc-800/60" />
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>

      {/* Complejidad del catálogo */}
      <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.25 }} aria-labelledby="complexity-kpi">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Hexagon className="h-4 w-4 text-teal-400" aria-hidden />
              <h2 id="complexity-kpi" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                {"// Matriz de complejidad del catálogo de skills"}
              </h2>
            </div>
            {stats ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {complexityEntries.map(([level, count]) => (
                  <div key={level} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs text-zinc-400">{level}</span>
                      <span className="font-mono text-xl font-bold text-zinc-200 tabular-nums">{count}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                        style={{ width: `${Math.round((count / maxComplexity) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Skeleton className="h-20 w-full bg-zinc-800/60" />
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* Marco de cumplimiento */}
      <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} aria-label="Garantías del sistema">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: <ShieldCheck className="h-5 w-5 text-rose-300" aria-hidden />,
              title: "Seguridad por diseño",
              body: "RLS deny-by-default, mTLS entre agentes, sandbox de tools y SAST bloqueante en CI. 8 skills SEG dedicadas.",
            },
            {
              icon: <Terminal className="h-5 w-5 text-emerald-300" aria-hidden />,
              title: "Trazabilidad total",
              body: "Cada acción crítica queda firmada en auditoria_legal (WORM) con encadenamiento SHA-256 y verificación O(n).",
            },
            {
              icon: <Network className="h-5 w-5 text-lime-300" aria-hidden />,
              title: "Interoperabilidad MCP",
              body: "Descubrimiento dinámico de herramientas, mapeo JSON-RPC y streaming de recursos bajo presupuesto por llamada.",
            },
          ].map((c) => (
            <Card key={c.title} className="border-zinc-800 bg-zinc-900/60">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                  {c.icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-200">{c.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Hexagon,
  LayoutDashboard,
  Wrench,
  Network,
  GitBranch,
  Route,
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { Overview } from "@/components/nexus/overview";
import { SkillsMatrix } from "@/components/nexus/skills-matrix";
import { ArchitectureView } from "@/components/nexus/architecture-view";
import { RepoIndex } from "@/components/nexus/repo-index";
import { Lifecycle } from "@/components/nexus/lifecycle";
import { AgentConsole } from "@/components/nexus/agent-console";
import type {
  StatsResponse,
  SkillsResponse,
  ReposResponse,
  PhaseDTO,
  AuditEventDTO,
  SimulationRunDTO,
} from "@/components/nexus/types";

const TABS = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard, code: "00" },
  { id: "skills", label: "Matriz de Skills", icon: Wrench, code: "01" },
  { id: "arquitectura", label: "Arquitectura", icon: Network, code: "02" },
  { id: "repos", label: "Repositorios", icon: GitBranch, code: "03" },
  { id: "ciclo", label: "Ciclo de Vida", icon: Route, code: "04" },
  { id: "consola", label: "Consola", icon: Terminal, code: "05" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export default function NexusPage() {
  const [tab, setTab] = useState<TabId>("resumen");

  // Filtros de la matriz de skills
  const [skillQuery, setSkillQuery] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillComplexity, setSkillComplexity] = useState("ALL");
  const debouncedSkillQuery = useDebounced(skillQuery, 350);

  // Filtros del índice de repos
  const [repoQuery, setRepoQuery] = useState("");
  const [repoLanguage, setRepoLanguage] = useState("ALL");
  const [repoStatus, setRepoStatus] = useState("ALL");
  const [repoPage, setRepoPage] = useState(1);
  const debouncedRepoQuery = useDebounced(repoQuery, 350);

  const refreshKey = useState(0);
  const [tick, setTick] = refreshKey;
  const invalidate = useCallback(() => setTick((k) => k + 1), [setTick]);

  const statsQuery = useQuery({
    queryKey: ["stats", tick],
    queryFn: () => fetchJson<StatsResponse>("/api/stats"),
    refetchInterval: 60_000,
  });

  const auditQuery = useQuery({
    queryKey: ["audit", tick],
    queryFn: () => fetchJson<{ events: AuditEventDTO[] }>("/api/audit"),
    refetchInterval: 60_000,
  });

  const skillsQuery = useQuery({
    queryKey: [
      "skills",
      debouncedSkillQuery,
      skillCategory,
      skillComplexity === "ALL" ? "" : skillComplexity,
      tick,
    ],
    queryFn: () =>
      fetchJson<SkillsResponse>(
        `/api/skills?q=${encodeURIComponent(debouncedSkillQuery)}&category=${skillCategory}&complexity=${skillComplexity === "ALL" ? "" : skillComplexity}`
      ),
  });

  const reposQuery = useQuery({
    queryKey: [
      "repos",
      debouncedRepoQuery,
      repoLanguage,
      repoStatus,
      repoPage,
      tick,
    ],
    queryFn: () =>
      fetchJson<ReposResponse>(
        `/api/repos?q=${encodeURIComponent(debouncedRepoQuery)}&language=${repoLanguage === "ALL" ? "" : repoLanguage}&status=${repoStatus === "ALL" ? "" : repoStatus}&page=${repoPage}`
      ),
  });

  const phasesQuery = useQuery({
    queryKey: ["phases"],
    queryFn: () => fetchJson<{ phases: PhaseDTO[] }>("/api/phases"),
  });

  const historyQuery = useQuery({
    queryKey: ["history", tick],
    queryFn: () => fetchJson<{ runs: SimulationRunDTO[] }>("/api/simulate"),
  });

  const stats = statsQuery.data;
  const online = !statsQuery.error;

  const activeTab = useMemo(() => TABS.find((t) => t.id === tab)!, [tab]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <Hexagon className="h-9 w-9 text-emerald-500" strokeWidth={1.5} aria-hidden />
              <span className="absolute font-mono text-sm font-bold text-emerald-300">Ω</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-mono text-base font-bold tracking-tight text-zinc-100">
                  NEXUS-Ω
                </h1>
                <span className="hidden font-mono text-[10px] text-zinc-600 sm:inline">
                  ecosistema agéntico multi-stack
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge
                variant="outline"
                className={`hidden gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-300 sm:inline-flex ${
                  online ? "" : "border-zinc-700 text-zinc-500"
                }`}
              >
                <span
                  className={`relative flex h-2 w-2 ${online ? "" : "bg-zinc-500"}`}
                  aria-hidden
                >
                  {online && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-zinc-500"}`}
                  />
                </span>
                {online ? "SISTEMA ONLINE" : "SIN SEÑAL"}
              </Badge>
              <Badge variant="outline" className="border-zinc-700 font-mono text-[10px] text-zinc-500">
                v1.0
              </Badge>
            </div>
          </div>

          {/* Navegación */}
          <div className="relative">
            <nav
              role="tablist"
              aria-label="Secciones del plan maestro"
              className="flex gap-1 overflow-x-auto pb-2 custom-scroll-x"
            >
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${t.id}`}
                    id={`tab-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 font-mono text-xs transition-colors ${
                      active
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <span className="hidden md:inline">{t.label}</span>
                    <span className="md:hidden">{t.code}</span>
                  </button>
                );
              })}
            </nav>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-zinc-950 to-transparent md:hidden"
              aria-hidden
            />
          </div>
        </div>
      </header>

      {/* ── Contenido ── */}
      <main
        id={`panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "resumen" && (
              <Overview stats={stats} audit={auditQuery.data?.events} />
            )}
            {tab === "skills" && (
              <SkillsMatrix
                data={skillsQuery.data}
                loading={skillsQuery.isLoading}
                query={skillQuery}
                setQuery={setSkillQuery}
                category={skillCategory}
                setCategory={setSkillCategory}
                complexity={skillComplexity}
                setComplexity={setSkillComplexity}
              />
            )}
            {tab === "arquitectura" && <ArchitectureView />}
            {tab === "repos" && (
              <RepoIndex
                data={reposQuery.data}
                stats={stats}
                loading={reposQuery.isLoading}
                query={repoQuery}
                setQuery={setRepoQuery}
                language={repoLanguage}
                setLanguage={setRepoLanguage}
                status={repoStatus}
                setStatus={setRepoStatus}
                page={repoPage}
                setPage={setRepoPage}
                onIngested={invalidate}
              />
            )}
            {tab === "ciclo" && (
              <Lifecycle phases={phasesQuery.data?.phases} loading={phasesQuery.isLoading} />
            )}
            {tab === "consola" && (
              <AgentConsole
                history={historyQuery.data?.runs}
                audit={auditQuery.data?.events}
                onCompleted={invalidate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer (fijo al fondo) ── */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950/95">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Hexagon className="h-4 w-4 text-zinc-600" aria-hidden />
            <span className="font-mono text-[11px] text-zinc-500">
              NEXUS-Ω · Plan Maestro del Ecosistema Agéntico Multi-Stack
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-zinc-600">
            <span className="inline-flex items-center gap-1">
              <Wrench className="h-3 w-3" aria-hidden />
              {stats?.skills.total ?? "—"} skills
            </span>
            <span className="inline-flex items-center gap-1">
              <GitBranch className="h-3 w-3" aria-hidden />
              {stats?.repos.total ?? "—"} repos
            </span>
            <span className="inline-flex items-center gap-1">
              <Database className="h-3 w-3" aria-hidden />
              Supabase · pgvector
            </span>
            <span className="inline-flex items-center gap-1">
              <Network className="h-3 w-3" aria-hidden />
              MCP · mTLS
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              auditoría SHA-256
            </span>
            <span className="inline-flex items-center gap-1">
              <Cpu className="h-3 w-3" aria-hidden />
              orquestador glm
            </span>
          </div>
          <span className="ml-auto font-mono text-[10px] text-zinc-700">
            fases: {stats?.phases.length ?? 4} · hitos: {stats?.milestones ?? 16} · 20 semanas
          </span>
        </div>
      </footer>

      <Toaster position="bottom-right" richColors theme="dark" closeButton />
    </div>
  );
}

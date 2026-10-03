"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Loader2,
  BrainCircuit,
  Wrench,
  AlertTriangle,
  Gauge,
  DollarSign,
  History,
  ScrollText,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { SEVERITY_STYLES } from "./colors";
import type { SimulationResult, SimulationRunDTO, AuditEventDTO } from "./types";

const EXAMPLES = [
  "Migrar el módulo de facturación a Supabase con RLS multi-tenant y zero downtime",
  "Refactorizar 12 repos TypeScript con tests E2E y pipeline CI sintáctico",
  "Auditar el ecosistema contra GDPR: anonimización, RLS y cadena de custodia",
  "Indexar 300 repos nuevos con chunking semántico y búsqueda por similitud",
];

export function AgentConsole({
  history,
  audit,
  onCompleted,
}: {
  history: SimulationRunDTO[] | undefined;
  audit: AuditEventDTO[] | undefined;
  onCompleted: () => void;
}) {
  const [objective, setObjective] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  async function execute() {
    if (objective.trim().length < 8) {
      toast.error("El objetivo necesita al menos 8 caracteres para ser planificado.");
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective: objective.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "fallo");
      }
      setResult(json as SimulationResult);
      onCompleted();
      toast.success("ORQUESTADOR-01 completó el plan", {
        description: `${json.pasos.length} pasos · ${(json.confianza * 100).toFixed(0)}% de confianza · ${json.durationMs} ms`,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "El orquestador no respondió.");
    } finally {
      setRunning(false);
    }
  }

  const confidenceColor =
    result && result.confianza >= 0.75
      ? "text-emerald-300"
      : result && result.confianza >= 0.5
        ? "text-amber-300"
        : "text-rose-300";

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {/* Terminal de objetivos */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby="console-title"
        >
          <Card className="border-zinc-800 bg-zinc-900/60">
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950/60 px-4 py-2.5">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <span className="ml-2 font-mono text-[11px] text-zinc-400">
                orquestador-01 · glm-4.7 · catálogo de 62 skills
              </span>
              <span className={`ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] ${running ? "text-amber-300" : "text-emerald-300"}`}>
                <Cpu className="h-3 w-3" aria-hidden />
                {running ? "PLANIFICANDO…" : "LISTO"}
              </span>
            </div>
            <CardContent className="p-4 sm:p-5">
              <h2 id="console-title" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                {"// Consola de simulación · objetivo → plan agéntico"}
              </h2>
              <Textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Describe un objetivo corporativo: el orquestador seleccionará skills del catálogo y emitirá un plan de ejecución con herramientas, fases y riesgos…"
                aria-label="Objetivo para el orquestador"
                className="mt-3 min-h-[96px] border-zinc-800 bg-zinc-950/60 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-emerald-500/40"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setObjective(ex)}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-left font-mono text-[10px] text-zinc-500 transition-colors hover:border-emerald-500/30 hover:text-emerald-300"
                  >
                    {ex.length > 58 ? ex.slice(0, 58) + "…" : ex}
                  </button>
                ))}
              </div>
              <Button
                onClick={execute}
                disabled={running}
                aria-label="Ejecutar el orquestador"
                className="mt-4 h-12 w-full gap-2 bg-emerald-500 font-mono text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {running ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Play className="h-4 w-4" aria-hidden />
                )}
                {running ? "ORQUESTANDO…" : "EJECUTAR ORQUESTADOR"}
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {running && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
            >
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-300">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ORQUESTADOR-01 · descomponiendo objetivo (HTN)…
                  </div>
                  <Skeleton className="h-4 w-3/4 bg-zinc-800/60" />
                  <Skeleton className="h-4 w-1/2 bg-zinc-800/60" />
                  <Skeleton className="h-4 w-2/3 bg-zinc-800/60" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {result && !running && (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
            >
              <Card className="border-zinc-800 bg-zinc-900/60">
                <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <BrainCircuit className="h-4 w-4 text-emerald-400" aria-hidden />
                  <span className="font-mono text-xs text-zinc-300">
                    PLAN DE EJECUCIÓN · {result.id.slice(0, 8)}
                  </span>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-zinc-700 font-mono text-[10px] text-zinc-500">
                      {result.model} · {result.durationMs} ms
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`border-zinc-700 font-mono text-[10px] ${confidenceColor}`}
                    >
                      <Gauge className="mr-1 h-3 w-3" aria-hidden />
                      {(result.confianza * 100).toFixed(0)}% confianza
                    </Badge>
                    {result.presupuestoEstimadoUsd > 0 && (
                      <Badge variant="outline" className="border-zinc-700 font-mono text-[10px] text-zinc-500">
                        <DollarSign className="mr-1 h-3 w-3" aria-hidden />
                        ~${result.presupuestoEstimadoUsd.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="space-y-5 p-4 sm:p-5">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                      Diagnóstico
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                      {result.diagnostico}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Pasos del plan ({result.pasos.length})
                    </h3>
                    <ol className="space-y-2.5">
                      {result.pasos.map((step, i) => (
                        <motion.li
                          key={`${step.orden}-${i}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs font-bold text-zinc-400">
                            {step.orden}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <code className="font-mono text-[11px] font-bold text-emerald-300">
                                {step.skill}
                              </code>
                              <span className="text-sm font-medium text-zinc-200">
                                {step.titulo}
                              </span>
                              <span className="ml-auto rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600">
                                FASE {step.fase}
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                              {step.detalle}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] text-zinc-600">
                              <Wrench className="h-3 w-3" aria-hidden />
                              {step.herramienta}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  </div>

                  {result.skillsSeleccionadas.length > 0 && (
                    <div>
                      <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Selección de skills
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {result.skillsSeleccionadas.map((s) => (
                          <div
                            key={s.codigo}
                            className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5"
                          >
                            <code className="font-mono text-[11px] font-bold text-teal-300">
                              {s.codigo}
                            </code>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                              {s.motivo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.riesgos.length > 0 && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <h3 className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                        Riesgos del plan
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {result.riesgos.map((r) => (
                          <li key={r} className="flex gap-2 text-xs text-zinc-400">
                            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" aria-hidden />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar: historial + auditoría */}
      <div className="space-y-4">
        <section aria-labelledby="history-title">
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="p-4">
              <h2
                id="history-title"
                className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
              >
                <History className="h-3.5 w-3.5" aria-hidden />
                Ejecuciones recientes
              </h2>
              {history ? (
                <ul className="max-h-72 space-y-2 overflow-y-auto pr-1 custom-scroll" aria-label="Historial de simulaciones">
                  {history.length === 0 && (
                    <li className="py-6 text-center font-mono text-[11px] text-zinc-600">
                      Sin ejecuciones aún. Lanza el orquestador.
                    </li>
                  )}
                  {history.map((run) => (
                    <li
                      key={run.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5"
                    >
                      <p className="line-clamp-2 text-[11px] leading-snug text-zinc-300">
                        {run.objective}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px] text-zinc-600">
                        <span
                          className={`rounded px-1.5 py-0.5 ${
                            run.status === "COMPLETADO"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {run.status}
                        </span>
                        <span>{run.steps} pasos</span>
                        <span>· {run.skillsUsed.length} skills</span>
                        <span className="ml-auto">
                          {new Date(run.createdAt).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Skeleton className="h-40 w-full bg-zinc-800/50" />
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="audit-console-title">
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="p-4">
              <h2
                id="audit-console-title"
                className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
              >
                <ScrollText className="h-3.5 w-3.5" aria-hidden />
                Auditoría en vivo (cadena hash)
              </h2>
              {audit ? (
                <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1 custom-scroll" aria-label="Eventos de auditoría recientes">
                  {audit.slice(0, 12).map((e) => {
                    const sev = SEVERITY_STYLES[e.severity] ?? SEVERITY_STYLES.INFO;
                    return (
                      <li
                        key={e.id}
                        className="rounded border border-zinc-800/80 bg-zinc-950/60 px-2.5 py-2 text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`rounded border px-1 py-0.5 font-mono text-[8px] ${sev.chip}`}>
                            {sev.label}
                          </span>
                          <code className="truncate font-mono text-[10px] text-zinc-300">
                            {e.action}
                          </code>
                        </div>
                        <p className="mt-1 truncate font-mono text-[9px] text-zinc-600">
                          {e.agentCode} · ⛓ {e.payloadHash.slice(0, 10)}…
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <Skeleton className="h-40 w-full bg-zinc-800/50" />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

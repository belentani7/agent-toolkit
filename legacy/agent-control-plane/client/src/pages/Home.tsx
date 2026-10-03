import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  Download,
  FileKey2,
  GitPullRequest,
  Hourglass,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { openPvcRealtimeStream } from "@/lib/pvcu-realtime";

const gridStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M32 0H0V32' fill='none' stroke='%23ffffff' stroke-opacity='.055' stroke-width='1'/%3E%3C/svg%3E\")",
  backgroundSize: "32px 32px",
};

function Metric({ label, value, tone = "text-white" }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="border border-white/15 bg-[#0a2370]/80 p-4">
      <p className="text-[10px] uppercase tracking-[.24em] text-blue-200/70">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function statusTone(status: string) {
  if (status === "approved") return "border-emerald-300/40 bg-emerald-300/10 text-emerald-100";
  if (status === "rejected" || status === "quarantine") return "border-amber-300/40 bg-amber-300/10 text-amber-100";
  if (status === "human_review") return "border-fuchsia-300/40 bg-fuchsia-300/10 text-fuchsia-100";
  return "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const tenantsQuery = trpc.pvcu.tenants.useQuery(undefined, { enabled: isAuthenticated });
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [selectedValidationId, setSelectedValidationId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [quarantineReason, setQuarantineReason] = useState("");
  const [streamStatus, setStreamStatus] = useState<"offline" | "connecting" | "connected" | "degraded">("offline");
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState<string | null>(null);
  const tenantKey = selectedTenant ?? tenantsQuery.data?.[0]?.tenantKey ?? null;
  const overviewQuery = trpc.pvcu.overview.useQuery(
    { tenantKey: tenantKey ?? "__none__" },
    { enabled: Boolean(tenantKey && isAuthenticated) },
  );
  const selected = useMemo(
    () => tenantsQuery.data?.find((tenant) => tenant.tenantKey === tenantKey),
    [tenantsQuery.data, tenantKey],
  );
  const selectedValidation = useMemo(
    () => overviewQuery.data?.validations.find((validation) => validation.validationId === selectedValidationId),
    [overviewQuery.data?.validations, selectedValidationId],
  );
  const approvalGateQuery = trpc.pvcu.approvalGate.useQuery(
    { tenantKey: tenantKey ?? "__none__", validationId: selectedValidationId ?? "__none__" },
    { enabled: Boolean(tenantKey && selectedValidationId && isAuthenticated) },
  );
  const gate = approvalGateQuery.data;
  const createApprovalGateMutation = trpc.pvcu.createApprovalGate.useMutation({
    onSuccess: async () => {
      await approvalGateQuery.refetch();
      await overviewQuery.refetch();
    },
  });
  const approveMutation = trpc.pvcu.approve.useMutation({
    onSuccess: async () => {
      await approvalGateQuery.refetch();
      await overviewQuery.refetch();
    },
  });
  const quarantineMutation = trpc.pvcu.quarantine.useMutation({
    onSuccess: async () => {
      setQuarantineReason("");
      await overviewQuery.refetch();
    },
  });

  useEffect(() => {
    if (!tenantKey || !isAuthenticated || typeof EventSource === "undefined") {
      setStreamStatus("offline");
      setLastRealtimeEvent(null);
      return;
    }
    return openPvcRealtimeStream(tenantKey, {
      onStatus: setStreamStatus,
      onEvent: (event) => {
        setLastRealtimeEvent(event.eventId ?? null);
        void utils.pvcu.overview.invalidate({ tenantKey });
      },
    });
  }, [isAuthenticated, tenantKey, utils]);

  const handleExport = async (validationId: string) => {
    if (!tenantKey) return;
    setExportingId(validationId);
    setExportError(null);
    try {
      const signed = await utils.pvcu.exportEvidence.fetch({ tenantKey, validationId });
      const blob = new Blob([JSON.stringify(signed, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `paea-evidence-${validationId}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("No se pudo generar la exportación firmada para esta validación.");
    } finally {
      setExportingId(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#071b59] p-8 text-white">Loading kernel...</div>;

  return (
    <div className="relative min-h-screen bg-[#071b59] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-60" style={gridStyle} />
      <div className="relative z-10">
      <header className="border-b border-white/20 bg-[#06184f]/95 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.32em] text-blue-200">PAEA / SUPRA-KERNEL</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Universal Control Plane</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="rounded-none border border-emerald-300/40 bg-emerald-400/10 text-emerald-200">
              {isAuthenticated ? "SESSION ACTIVE" : "READ-ONLY"}
            </Badge>
            <span className="hidden text-xs text-blue-100/70 md:inline">{user?.name ?? "Operator console"}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white shadow-2xl shadow-blue-950/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[.25em] text-blue-200/70">PVC-U / L0–L8</p>
                  <CardTitle className="mt-2 text-xl">Policy Validation Control Unit</CardTitle>
                </div>
                <ShieldCheck className="text-cyan-200" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="max-w-2xl text-sm leading-6 text-blue-100/80">
                Capa transversal para validar entradas, acciones, efectos externos y respuestas de agentes con riesgo proporcional, evidencia hashada y aislamiento por tenant.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Badge variant="outline" className="rounded-none border-white/25 text-blue-100">FAIL-SAFE</Badge>
                <Badge variant="outline" className="rounded-none border-white/25 text-blue-100">EVIDENCE-FIRST</Badge>
                <Badge variant="outline" className="rounded-none border-white/25 text-blue-100">TENANT-SCOPED</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-white/20 bg-[#091c5a]/90 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><Terminal size={16} /> Runtime status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-blue-100/70">Persistence</span><span className="text-emerald-200">{overviewQuery.isFetching ? "SYNCING" : "READY"}</span></div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-blue-100/70">Evidence policy</span><span className="text-cyan-200">DIGEST + SIGNATURE</span></div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-blue-100/70">Realtime stream</span><span className={streamStatus === "connected" ? "text-emerald-200" : streamStatus === "degraded" ? "text-amber-200" : "text-blue-100/70"}>{streamStatus.toUpperCase()}</span></div><div className="flex items-center justify-between"><span className="text-blue-100/70">Operator</span><span>{user?.role ?? "guest"}</span></div>
            </CardContent>
          </Card>
        </section>

        {!isAuthenticated ? (
          <Card className="rounded-none border-amber-300/30 bg-amber-300/10 text-amber-50">
            <CardContent className="flex items-center gap-3 p-5"><TriangleAlert size={18} /><p className="text-sm">Inicia sesión para consultar tenants y operar validaciones PVC-U. El panel permanece en modo de lectura sin sesión.</p></CardContent>
          </Card>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Tenants visibles" value={tenantsQuery.data?.length ?? 0} />
          <Metric label="Validaciones" value={overviewQuery.data?.metrics.validationCount ?? 0} />
          <Metric label="Aprobadas" value={`${overviewQuery.data?.metrics.approvalRate ?? 0}%`} tone="text-emerald-200" />
          <Metric label="Bloqueadas / cuarentena" value={overviewQuery.data?.metrics.blocked ?? 0} tone="text-amber-200" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><LockKeyhole size={16} /> Tenant scope</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <select aria-label="Tenant scope" value={tenantKey ?? ""} onChange={(event) => { setSelectedTenant(event.target.value || null); setSelectedValidationId(null); }} className="w-full border border-white/20 bg-[#06184f] px-3 py-3 text-sm text-white outline-none focus:border-cyan-200" disabled={!tenantsQuery.data?.length || tenantsQuery.isError}>
                <option value="">{tenantsQuery.isLoading ? "Cargando scopes..." : "Selecciona un tenant"}</option>
                {tenantsQuery.data?.map((tenant) => <option key={tenant.tenantKey} value={tenant.tenantKey}>{tenant.name} · {tenant.tier}</option>)}
              </select>
              {tenantsQuery.isError ? <p className="text-sm text-amber-200">No se pudieron cargar los tenants de este operador.</p> : selected ? <div className="grid grid-cols-2 gap-3 text-xs"><div className="border border-white/10 p-3"><p className="text-blue-200/60">KEY</p><p className="mt-1 font-mono">{selected.tenantKey}</p></div><div className="border border-white/10 p-3"><p className="text-blue-200/60">STATUS</p><p className="mt-1 text-emerald-200">{selected.status}</p></div></div> : <p className="text-sm text-blue-100/60">No hay tenants visibles en este scope.</p>}
            </CardContent>
          </Card>

          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><Activity size={16} /> Validation ledger</CardTitle></CardHeader>
            <CardContent>
              {overviewQuery.isError ? <div className="flex items-center gap-3 py-8 text-sm text-amber-200"><TriangleAlert size={18} /> No se pudo consultar el ledger de este tenant.</div> : overviewQuery.isLoading ? <div className="py-8 text-sm text-blue-100/60">Sincronizando validaciones...</div> : overviewQuery.data?.validations?.length ? <div className="space-y-2">{overviewQuery.data.validations.slice(0, 8).map((validation) => <div key={validation.validationId} className={`flex flex-col gap-3 border px-3 py-3 text-xs sm:flex-row sm:items-center sm:justify-between ${selectedValidationId === validation.validationId ? "border-cyan-200/70 bg-cyan-300/10" : "border-white/10"}`}><button type="button" onClick={() => setSelectedValidationId(validation.validationId)} className="min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"><p className="truncate font-mono text-blue-100">{validation.validationId}</p><p className="mt-1 text-blue-200/55">{validation.artifactType} · {validation.riskClass}</p></button><div className="flex items-center gap-2"><Badge className={`rounded-none border text-[10px] ${statusTone(validation.status)}`}>{validation.status}</Badge><Button type="button" size="sm" variant="outline" className="h-8 rounded-none border-white/20 bg-transparent px-2 text-[10px] text-blue-100 hover:bg-white/10" onClick={() => void handleExport(validation.validationId)} disabled={exportingId === validation.validationId} aria-label={`Exportar evidencia ${validation.validationId}`}><Download size={13} />{exportingId === validation.validationId ? "..." : "Export"}</Button></div></div>)}</div> : <div className="flex items-center gap-3 py-8 text-sm text-blue-100/60"><Database size={18} /> Aún no existen ejecuciones para este tenant.</div>}
              {exportError ? <p className="mt-4 text-sm text-amber-200">{exportError}</p> : null}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><GitPullRequest size={16} /> Human approval gate</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {!selectedValidation ? <div className="flex items-center gap-3 py-6 text-sm text-blue-100/60"><Hourglass size={18} /> Selecciona una validación para abrir su control de aprobación.</div> : <>
                <div className="flex flex-col gap-3 border border-white/10 bg-[#06184f]/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-sm text-cyan-100">{selectedValidation.validationId}</p><p className="mt-1 text-xs text-blue-100/60">Una decisión de alto impacto requiere dos identidades distintas.</p></div>{!approvalGateQuery.data ? <Button type="button" size="sm" className="rounded-none bg-cyan-200 text-[#06184f] hover:bg-cyan-100" onClick={() => tenantKey && createApprovalGateMutation.mutate({ tenantKey, validationId: selectedValidation.validationId })} disabled={createApprovalGateMutation.isPending}><ShieldAlert size={14} /> {createApprovalGateMutation.isPending ? "Opening..." : "Open gate"}</Button> : <Badge className={`rounded-none border ${approvalGateQuery.data.status === "approved" ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100" : "border-amber-300/40 bg-amber-300/10 text-amber-100"}`}>{approvalGateQuery.data.status.toUpperCase()}</Badge>}</div>
                {approvalGateQuery.isError ? <p className="text-sm text-amber-200">No se pudo consultar el gate de esta validación.</p> : null}
                {approvalGateQuery.data ? <div className="grid gap-3 md:grid-cols-3"><div className="border border-white/10 p-3"><p className="text-[10px] uppercase tracking-[.2em] text-blue-200/55">Approval 1</p><p className="mt-2 flex items-center gap-2 text-xs text-blue-100"><UserRound size={13} /> {approvalGateQuery.data.firstApprover ?? "PENDING"}</p></div><div className="border border-white/10 p-3"><p className="text-[10px] uppercase tracking-[.2em] text-blue-200/55">Approval 2</p><p className="mt-2 flex items-center gap-2 text-xs text-blue-100"><UserRound size={13} /> {approvalGateQuery.data.secondApprover ?? "PENDING"}</p></div><div className="border border-white/10 p-3"><p className="text-[10px] uppercase tracking-[.2em] text-blue-200/55">Decision hash</p><p className="mt-2 truncate font-mono text-[10px] text-cyan-100">{approvalGateQuery.data.decisionHash ?? "Awaiting second signature"}</p></div></div> : null}
                {gate?.status === "pending" ? <Button type="button" variant="outline" className="rounded-none border-cyan-200/50 bg-transparent text-cyan-100 hover:bg-cyan-300/10" onClick={() => tenantKey && approveMutation.mutate({ tenantKey, approvalId: gate.approvalId })} disabled={approveMutation.isPending || gate.firstApprover === user?.openId}><Check size={14} /> {gate.firstApprover === user?.openId ? "Second operator required" : approveMutation.isPending ? "Recording..." : "Record approval"}</Button> : null}
                {approveMutation.isError ? <p className="text-sm text-amber-200">{approveMutation.error.message}</p> : null}
                {selectedValidation.status === "quarantine" ? <div className="border border-amber-300/40 bg-amber-300/10 p-4 text-sm text-amber-100"><div className="flex items-center gap-2 font-medium"><ShieldAlert size={15} /> Esta validación está en cuarentena.</div><p className="mt-2 text-xs leading-5 text-amber-100/70">Los efectos externos deben permanecer detenidos hasta una nueva decisión de gobernanza.</p></div> : <div className="border border-amber-300/20 bg-amber-300/5 p-4"><div className="flex items-center gap-2 text-sm text-amber-100"><ShieldAlert size={15} /> Quarantine control</div><Textarea aria-label="Motivo de cuarentena" value={quarantineReason} onChange={(event) => setQuarantineReason(event.target.value)} placeholder="Describe el motivo operativo y el control compensatorio..." className="mt-3 min-h-20 rounded-none border-white/15 bg-[#06184f] text-sm text-white placeholder:text-blue-100/40" maxLength={2000} /><div className="mt-3 flex items-center justify-between gap-3"><p className="text-[11px] text-blue-100/50">Requiere un motivo de al menos 5 caracteres y queda registrado en el outbox.</p><Button type="button" size="sm" variant="outline" className="rounded-none border-amber-300/50 bg-transparent text-amber-100 hover:bg-amber-300/10" onClick={() => tenantKey && quarantineMutation.mutate({ tenantKey, validationId: selectedValidation.validationId, reason: quarantineReason })} disabled={quarantineMutation.isPending || quarantineReason.trim().length < 5}><ShieldAlert size={14} /> {quarantineMutation.isPending ? "Quarantining..." : "Quarantine"}</Button></div></div>}
                {quarantineMutation.isError ? <p className="text-sm text-amber-200">{quarantineMutation.error.message}</p> : null}
              </>}
            </CardContent>
          </Card>

          <Card className="rounded-none border-white/20 bg-[#091c5a]/90 text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><FileKey2 size={16} /> Evidence chain</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 text-emerald-200" size={18} /><div><p className="text-blue-50">Atomic persistence</p><p className="mt-1 text-xs leading-5 text-blue-100/60">Validation, digest y evento outbox se confirman en una sola transacción MySQL.</p></div></div><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 text-emerald-200" size={18} /><div><p className="text-blue-50">Signed export</p><p className="mt-1 text-xs leading-5 text-blue-100/60">Cada descarga incluye SHA-256 del contenido y firma HMAC-SHA256 del servidor.</p></div></div><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 text-emerald-200" size={18} /><div><p className="text-blue-50">Tenant boundary</p><p className="mt-1 text-xs leading-5 text-blue-100/60">Las lecturas y decisiones exigen tenantKey y owner scope antes de consultar datos.</p></div></div></CardContent>
          </Card>
        </section>

        <footer className="flex flex-col justify-between gap-3 border-t border-white/15 pt-5 text-xs text-blue-100/55 md:flex-row"><span>PVC-U DB v1 · atomic outbox · dual approval · signed evidence{lastRealtimeEvent ? ` · last event ${lastRealtimeEvent}` : ""}</span><span className="flex items-center gap-2">Inspect controls <ArrowRight size={14} /></span></footer>
      </main>
      </div>
    </div>
  );
}

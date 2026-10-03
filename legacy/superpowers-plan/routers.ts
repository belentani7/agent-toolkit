import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { addPipelineStep, appendAuditEvent, createPipelineRun, deleteAllProjects, insertProjects, listAuditEvents, listPipelineRuns, listProjects, replaceProjects, upsertProjects, updatePipelineRun } from "./db";
import { z } from "zod";
import { PIPELINE_STAGES, hashPayload, verifyAuditChain } from "./governance";

const projectInput = z.object({
  name: z.string().min(1).max(180),
  purpose: z.string().min(1).max(5000),
  status: z.string().min(1).max(40).default("por validar"),
  stack: z.string().max(5000).default("No informado"),
  source: z.string().max(40).default("manual"),
  sourceUrl: z.string().max(500).optional(),
  lastActivityAt: z.coerce.date().optional(),
  commits30d: z.number().int().min(0).max(10000).default(0),
  hasDeploy: z.boolean().default(false),
  hasUsers: z.boolean().default(false),
  hasDocs: z.boolean().default(false),
  hasRevenue: z.boolean().default(false),
  estimated: z.boolean().default(true),
});

const blockedTerms = /legal|extranjer[ií]a|conflicto|judas en la realidad|tercero|herida|terapia/i;
const blockedDriveNames = /legal|expediente|extranjer[ií]a|jorge|tercero|conflicto|chat|sesi[oó]n|borrador/i;

function toInsertProject(item: z.infer<typeof projectInput>) {
  return {
    ...item,
    hasDeploy: item.hasDeploy ? 1 : 0,
    hasUsers: item.hasUsers ? 1 : 0,
    hasDocs: item.hasDocs ? 1 : 0,
    hasRevenue: item.hasRevenue ? 1 : 0,
    estimated: item.estimated ? 1 : 0,
  };
}

function parseImport(raw: string, format: "json" | "csv") {
  if (raw.length > 500_000) throw new Error("El archivo supera el límite de 500 KB.");
  const parsed: unknown[] = format === "json" ? JSON.parse(raw) : raw.trim().split(/\r?\n/).slice(1).map(line => {
    const values = line.split(",").map(value => value.trim().replace(/^"|"$/g, ""));
    return { name: values[0], purpose: values[1], status: values[2], stack: values[3], commits30d: Number(values[4] || 0), hasDeploy: values[5] === "true", hasUsers: values[6] === "true", hasDocs: values[7] === "true", hasRevenue: values[8] === "true", sourceUrl: values[9] };
  });
  if (!Array.isArray(parsed)) throw new Error("El JSON debe ser un array de proyectos.");
  return parsed.filter(item => {
    const text = JSON.stringify(item);
    return !blockedTerms.test(text);
  }).map(item => projectInput.parse(item));
}

export function parseDriveMetadata(raw: string) {
  if (raw.length > 500_000) throw new Error("El archivo supera el límite de 500 KB.");
  const parsed = JSON.parse(raw) as { files?: Array<{ name?: string; description?: string; mimeType?: string; modifiedTime?: string; webViewLink?: string }> } | Array<{ name?: string; description?: string; mimeType?: string; modifiedTime?: string; webViewLink?: string }>;
  const files = Array.isArray(parsed) ? parsed : parsed.files;
  if (!files || !Array.isArray(files)) throw new Error("El export de Drive debe contener un array files.");
  return files.filter(file => file.name && !blockedDriveNames.test(`${file.name} ${file.description || ""}`)).map(file => toInsertProject({
    name: file.name!, purpose: file.description || `Archivo ${file.mimeType || "sin tipo"} en Google Drive`, status: "por validar", stack: file.mimeType || "Tipo no informado", source: "Google Drive metadata", sourceUrl: file.webViewLink, lastActivityAt: file.modifiedTime ? new Date(file.modifiedTime) : undefined, commits30d: 0, hasDeploy: false, hasUsers: false, hasDocs: false, hasRevenue: false, estimated: true,
  }));
}

function buildActionPlan(project: any) {
  const plan = [
    project.hasDocs ? "Revisar la documentación y eliminar cualquier paso que no lleve a una entrega." : "Crear una página README con objetivo, usuario, estado actual y definición de terminado.",
    project.hasDeploy ? "Medir el flujo desplegado con una prueba de extremo a extremo." : "Preparar un deploy mínimo y verificable con una sola ruta principal.",
    project.hasUsers ? "Hablar con 3 usuarios y registrar una señal concreta de uso." : "Conseguir 3 validaciones de usuario antes de ampliar el alcance.",
    project.hasRevenue ? "Identificar la siguiente mejora que proteja o aumente el ingreso existente." : "Definir una hipótesis de valor y un experimento de monetización de una semana.",
    "Cerrar o archivar una tarea de alcance que no contribuya al próximo hito.",
  ];
  return plan.map((title, index) => ({ order: index + 1, title, owner: "Pedro", status: "pendiente" }));
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  projects: router({
    list: protectedProcedure.query(async () => listProjects()),
    syncGithub: protectedProcedure.mutation(async () => {
      const reposResponse = await fetch("https://api.github.com/users/belentani7/repos?per_page=100&sort=updated", { headers: { Accept: "application/vnd.github+json", "User-Agent": "belentani-command-center" } });
      if (!reposResponse.ok) throw new Error(`GitHub respondió ${reposResponse.status}`);
      const repos = await reposResponse.json() as Array<{ name: string; description: string | null; html_url: string; updated_at: string; pushed_at: string | null; language: string | null; archived: boolean; fork: boolean; has_pages: boolean }>;
      const since = Date.now() - 30 * 86_400_000;
      const items = await Promise.all(repos.filter(repo => !repo.fork).map(async repo => {
        let commits30d = 0;
        try {
          const commitsResponse = await fetch(`https://api.github.com/repos/belentani7/${encodeURIComponent(repo.name)}/commits?since=${new Date(since).toISOString()}&per_page=100`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "belentani-command-center" } });
          if (commitsResponse.ok) { const commits = await commitsResponse.json() as unknown[]; commits30d = commits.length; }
        } catch { /* GitHub rate limits should not block the rest of the inventory. */ }
        return toInsertProject({ name: repo.name, purpose: repo.description || "Sin descripción en GitHub", status: repo.archived ? "archivado" : "activo", stack: repo.language || "Stack no informado", source: "GitHub API", sourceUrl: repo.html_url, lastActivityAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(repo.updated_at), commits30d, hasDeploy: Boolean(repo.has_pages), hasUsers: false, hasDocs: false, hasRevenue: false, estimated: true });
      }));
      return { source: "github", count: items.length, projects: await replaceProjects(items) };
    }),
    import: protectedProcedure.input(z.object({ raw: z.string(), format: z.enum(["json", "csv"]) })).mutation(async ({ input }) => {
      const parsed = parseImport(input.raw, input.format);
      const existing = await listProjects();
      const existingNames = new Set(existing.map(project => project.name.toLowerCase()));
      const fresh = parsed.filter(project => !existingNames.has(project.name.toLowerCase()));
      const items = await insertProjects(fresh.map(toInsertProject));
      return { imported: fresh.length, excluded: parsed.length - fresh.length, projects: items };
    }),
    importDriveMetadata: protectedProcedure.input(z.object({ raw: z.string() })).mutation(async ({ input }) => {
      const parsed = parseDriveMetadata(input.raw);
      const existing = await listProjects();
      const existingNames = new Set(existing.map(project => project.name.toLowerCase()));
      const fresh = parsed.filter(project => !existingNames.has(project.name.toLowerCase()));
      const items = await insertProjects(fresh);
      return { imported: fresh.length, excluded: parsed.length - fresh.length, projects: items };
    }),
    reset: protectedProcedure.mutation(async () => { await deleteAllProjects(); return { success: true }; }),
    actionPlan: protectedProcedure.query(async () => {
      const projects = await listProjects();
      const top = projects[0];
      return top ? { project: top, steps: buildActionPlan(top) } : null;
    }),
  }),
  pipeline: router({
    status: protectedProcedure.query(async () => ({ runs: await listPipelineRuns(), auditEvents: await listAuditEvents() })),
    verifyAudit: protectedProcedure.query(async () => verifyAuditChain(await listAuditEvents(1000))),
    syncGithub: protectedProcedure.mutation(async ({ ctx }) => {
      const startedAt = new Date();
      const runKey = `github-sync:${startedAt.toISOString().slice(0, 10)}`;
      const run = await createPipelineRun({ runKey, trigger: "manual", status: "running", currentStage: "discovery", startedAt });
      if (!run) throw new Error("Base de datos no disponible para iniciar pipeline");
      try {
        const repos: Array<{ id: number; name: string; description: string | null; html_url: string; updated_at: string; pushed_at: string | null; language: string | null; archived: boolean; fork: boolean; default_branch: string }> = [];
        for (let page = 1; page <= 10; page++) {
          const response = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "belentani-command-center", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) } });
          if (!response.ok) throw new Error(`GitHub discovery respondió ${response.status}`);
          const pageItems = await response.json() as typeof repos;
          repos.push(...pageItems);
          if (pageItems.length < 100) break;
        }
        await updatePipelineRun(run.id, { currentStage: "analysis", totalItems: repos.length });
        await addPipelineStep({ runId: run.id, stage: "discovery", status: "completed", attempts: 1, outputHash: hashPayload(repos.map(repo => `${repo.id}:${repo.updated_at}`)), startedAt, finishedAt: new Date() });
        const candidates = repos.filter(repo => !repo.fork).map(repo => ({ name: repo.name, purpose: repo.description || "Sin descripción en GitHub", status: repo.archived ? "archivado" : "activo", stack: repo.language || "Stack no informado", source: "GitHub API", sourceUrl: repo.html_url, externalId: String(repo.id), defaultBranch: repo.default_branch, lastActivityAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(repo.updated_at), commits30d: 0, hasDeploy: 0, hasUsers: 0, hasDocs: 0, hasRevenue: 0, estimated: 0, syncVersion: repo.updated_at }));
        await addPipelineStep({ runId: run.id, stage: "analysis", status: "completed", attempts: 1, inputHash: hashPayload(candidates), outputHash: hashPayload(candidates.map(item => item.externalId)), startedAt: new Date(), finishedAt: new Date() });
        await updatePipelineRun(run.id, { currentStage: "decision" });
        const selected = candidates.filter(item => item.status !== "archivado");
        await addPipelineStep({ runId: run.id, stage: "decision", status: "completed", attempts: 1, inputHash: hashPayload(candidates), outputHash: hashPayload(selected), startedAt: new Date(), finishedAt: new Date() });
        await updatePipelineRun(run.id, { currentStage: "execution" });
        await upsertProjects(selected);
        await addPipelineStep({ runId: run.id, stage: "execution", status: "completed", attempts: 1, outputHash: hashPayload(selected.map(item => item.sourceUrl)), startedAt: new Date(), finishedAt: new Date() });
        const persisted = await listProjects();
        await updatePipelineRun(run.id, { currentStage: "verification", processedItems: selected.length, failedItems: 0 });
        const verified = persisted.filter(item => item.source === "GitHub API").length;
        await addPipelineStep({ runId: run.id, stage: "verification", status: verified >= selected.length ? "completed" : "failed", attempts: 1, outputHash: hashPayload({ verified, expected: selected.length }), startedAt: new Date(), finishedAt: new Date(), error: verified >= selected.length ? null : `Persistidos ${verified}/${selected.length}` });
        const audit = await appendAuditEvent({ actor: ctx.user?.openId ?? "unknown", action: "pipeline.github.sync", resourceType: "project_inventory", result: verified >= selected.length ? "completed" : "partial", metadata: { runId: run.id, discovered: repos.length, selected: selected.length, verified } });
        await updatePipelineRun(run.id, { currentStage: "audit", status: verified >= selected.length ? "completed" : "partial", finishedAt: new Date() });
        return { runId: run.id, stages: PIPELINE_STAGES, discovered: repos.length, selected: selected.length, verified, auditHash: audit?.eventHash ?? null };
      } catch (error) {
        await updatePipelineRun(run.id, { status: "failed", error: error instanceof Error ? error.message : "unknown error", finishedAt: new Date() });
        await appendAuditEvent({ actor: ctx.user?.openId ?? "unknown", action: "pipeline.github.sync.failed", resourceType: "project_inventory", result: "failed", metadata: { runId: run.id, error: error instanceof Error ? error.message : "unknown error" } });
        throw error;
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

import { lookup } from "node:dns/promises";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";

export type MissionStatus = "queued" | "running" | "completed" | "partial" | "failed";

export interface MissionRequest {
  id?: string;
  name: string;
  urls: string[];
  objective: string;
  maxConcurrency?: number;
  rateLimitMs?: number;
  retries?: number;
  timeoutMs?: number;
}

export interface UrlEvidence {
  url: string;
  finalUrl?: string;
  success: boolean;
  attempts: number;
  fetchedAt: string;
  durationMs: number;
  httpStatus?: number;
  title?: string;
  description?: string;
  canonical?: string;
  language?: string;
  techDetected?: string[];
  structuredData?: unknown[];
  relevantLinks?: string[];
  contentSnippet?: string;
  contentHash?: string;
  seo?: {
    score: number;
    signals: string[];
    opportunities: string[];
  };
  error?: string;
}

export interface MissionMetrics {
  requestedUrls: number;
  uniqueUrls: number;
  duplicatesRemoved: number;
  successCount: number;
  failureCount: number;
  retryCount: number;
  bytesFetched: number;
  deterministicOperations: number;
  estimatedCostUsd: number;
  measuredCostUsd: number;
}

export interface MissionResult {
  missionId: string;
  name: string;
  objective: string;
  status: MissionStatus;
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  itemsExtracted: number;
  results: UrlEvidence[];
  metrics: MissionMetrics;
  artifactDirectory: string;
}

interface StrategyMemory {
  host: string;
  successfulFetches: number;
  failedFetches: number;
  lastSeenAt: string;
  lastError?: string;
  observedTechnologies: string[];
}

const DEFAULT_CONCURRENCY = 3;
const DEFAULT_RATE_LIMIT_MS = 350;
const DEFAULT_RETRIES = 2;
const DEFAULT_TIMEOUT_MS = 15_000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function artifactRoot() {
  return path.resolve(process.cwd(), "artifacts", "missions");
}

function memoryPath() {
  return path.resolve(process.cwd(), "artifacts", "memory", "host-strategies.json");
}

function normalizeUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  return url.toString();
}

function isPrivateIpv4(address: string) {
  const [a, b] = address.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase();
  return normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

async function assertSafePublicUrl(rawUrl: string) {
  const normalized = normalizeUrl(rawUrl);
  const url = new URL(normalized);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS targets are allowed");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (["localhost", "localhost.localdomain", "metadata.google.internal"].includes(hostname) || hostname.endsWith(".local")) {
    throw new Error("Local and metadata targets are not allowed");
  }

  const addresses = net.isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true });

  if (addresses.some(({ address }) => {
    const family = net.isIP(address);
    return family === 4 ? isPrivateIpv4(address) : family === 6 && isPrivateIpv6(address);
  })) {
    throw new Error("Private network targets are not allowed");
  }

  return normalized;
}

function decodeText(value: string) {
  return value.replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}

function extractAttribute(html: string, attribute: "name" | "property", value: string) {
  const expression = new RegExp(`<meta\\b[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']+)["'][^>]*>|<meta\\b[^>]*content=["']([^"']+)["'][^>]*${attribute}=["']${value}["'][^>]*>`, "i");
  const match = html.match(expression);
  return match?.[1] || match?.[2];
}

function extractStructuredData(html: string) {
  const output: unknown[] = [];
  const expression = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = expression.exec(html)) !== null) {
    try {
      output.push(JSON.parse(match[1].trim()));
    } catch {
      // Invalid JSON-LD is evidence of a source problem, not a reason to fail the mission.
    }
  }
  return output.slice(0, 10);
}

function detectTechnologies(html: string) {
  const source = html.toLowerCase();
  const technologies = new Set<string>();
  if (source.includes("__next_data__") || source.includes("/_next/")) technologies.add("Next.js");
  if (source.includes("react") || source.includes("data-reactroot")) technologies.add("React");
  if (source.includes("__nuxt") || source.includes("nuxt")) technologies.add("Nuxt");
  if (source.includes("data-v-") || source.includes("vue")) technologies.add("Vue");
  if (source.includes("wp-content") || source.includes("wp-includes")) technologies.add("WordPress");
  if (source.includes("cdn.shopify.com") || source.includes("shopify")) technologies.add("Shopify");
  if (source.includes("tailwindcss") || source.includes("tailwind")) technologies.add("Tailwind CSS");
  if (source.includes("googletagmanager.com")) technologies.add("Google Tag Manager");
  if (source.includes("cloudflare")) technologies.add("Cloudflare");
  return technologies.size ? Array.from(technologies) : ["Standard HTML / Web Stack"];
}

function extractRelevantLinks(html: string, baseUrl: string) {
  const links = new Set<string>();
  const origin = new URL(baseUrl).origin;
  const expression = /<a\b[^>]*href=["']([^"'#\s]+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = expression.exec(html)) !== null) {
    try {
      const candidate = new URL(match[1], baseUrl);
      if ((candidate.protocol === "http:" || candidate.protocol === "https:") && candidate.origin === origin) {
        candidate.hash = "";
        links.add(candidate.toString());
      }
    } catch {
      // Ignore malformed links while preserving the page-level evidence.
    }
    if (links.size >= 20) break;
  }
  return Array.from(links);
}

function buildSeoEvidence(html: string, title: string | undefined, description: string | undefined, canonical: string | undefined, language: string | undefined, structuredData: unknown[]) {
  const signals: string[] = [];
  const opportunities: string[] = [];
  let score = 0;

  if (title && title.length >= 15 && title.length <= 70) { score += 25; signals.push("Título presente y con longitud razonable"); }
  else opportunities.push("Añadir un título descriptivo de 15–70 caracteres");
  if (description && description.length >= 50 && description.length <= 180) { score += 20; signals.push("Meta descripción presente"); }
  else opportunities.push("Añadir una meta descripción de 50–180 caracteres");
  if (canonical) { score += 15; signals.push("URL canónica presente"); }
  else opportunities.push("Añadir una URL canónica");
  if (language) { score += 10; signals.push("Idioma del documento declarado"); }
  else opportunities.push("Declarar el atributo lang en el documento");
  if (/<h1\b[^>]*>/i.test(html)) { score += 10; signals.push("Encabezado H1 presente"); }
  else opportunities.push("Añadir un H1 principal");
  if (structuredData.length) { score += 10; signals.push("Datos estructurados JSON-LD detectados"); }
  else opportunities.push("Evaluar datos estructurados JSON-LD");
  if (extractAttribute(html, "property", "og:title")) { score += 10; signals.push("Open Graph title presente"); }
  else opportunities.push("Añadir metadatos Open Graph");

  return { score, signals, opportunities };
}

function csvEscape(value: unknown) {
  const normalized = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

export class ManusCoreEngine {
  private activeMissions = new Map<string, MissionResult>();

  async executeMission(request: MissionRequest): Promise<MissionResult> {
    const missionId = request.id ?? `mission_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const startedAt = new Date().toISOString();
    const startedMs = Date.now();
    const artifactDirectory = path.join(artifactRoot(), missionId);
    const uniqueUrls = Array.from(new Set(request.urls.map(normalizeUrl)));
    const maxConcurrency = Math.min(Math.max(1, request.maxConcurrency ?? DEFAULT_CONCURRENCY), 10);
    const rateLimitMs = Math.max(0, request.rateLimitMs ?? DEFAULT_RATE_LIMIT_MS);
    const retries = Math.min(Math.max(0, request.retries ?? DEFAULT_RETRIES), 4);
    const timeoutMs = Math.min(Math.max(1_000, request.timeoutMs ?? DEFAULT_TIMEOUT_MS), 60_000);
    const metrics: MissionMetrics = {
      requestedUrls: request.urls.length,
      uniqueUrls: uniqueUrls.length,
      duplicatesRemoved: request.urls.length - uniqueUrls.length,
      successCount: 0,
      failureCount: 0,
      retryCount: 0,
      bytesFetched: 0,
      deterministicOperations: 0,
      estimatedCostUsd: 0,
      measuredCostUsd: 0,
    };
    const mission: MissionResult = {
      missionId,
      name: request.name,
      objective: request.objective,
      status: "running",
      startedAt,
      durationMs: 0,
      itemsExtracted: 0,
      results: [],
      metrics,
      artifactDirectory,
    };

    await fs.mkdir(artifactDirectory, { recursive: true });
    this.activeMissions.set(missionId, mission);
    await this.writeMission(mission);
    await this.logEvent(artifactDirectory, "mission.started", { missionId, maxConcurrency, rateLimitMs, retries });

    let cursor = 0;
    let nextAllowedStart = 0;
    const acquireRateLimit = async () => {
      const now = Date.now();
      const waitMs = Math.max(0, nextAllowedStart - now);
      nextAllowedStart = Math.max(now, nextAllowedStart) + rateLimitMs;
      if (waitMs) await sleep(waitMs);
    };

    const worker = async () => {
      while (true) {
        const currentIndex = cursor++;
        if (currentIndex >= uniqueUrls.length) return;
        const target = uniqueUrls[currentIndex];
        await acquireRateLimit();
        const evidence = await this.inspectUrl(target, retries, timeoutMs, metrics, artifactDirectory);
        mission.results.push(evidence);
        if (evidence.success) {
          metrics.successCount += 1;
          mission.itemsExtracted = metrics.successCount;
        }
        else metrics.failureCount += 1;
        await this.writeMission(mission);
      }
    };

    await Promise.all(Array.from({ length: Math.min(maxConcurrency, uniqueUrls.length) }, worker));
    mission.durationMs = Date.now() - startedMs;
    mission.completedAt = new Date().toISOString();
    mission.status = metrics.failureCount === 0 ? "completed" : metrics.successCount > 0 ? "partial" : "failed";
    await this.persistMemory(mission);
    await this.writeMission(mission);
    await this.logEvent(artifactDirectory, "mission.completed", { missionId, status: mission.status, metrics });
    return mission;
  }

  async startMission(request: Omit<MissionRequest, "id">) {
    const missionId = `mission_${Date.now()}_${randomUUID().slice(0, 8)}`;
    void this.executeMission({ ...request, id: missionId });
    return { missionId, status: "queued" as const };
  }

  async getMissionResult(id: string) {
    const active = this.activeMissions.get(id);
    if (active) return active;
    try {
      const file = await fs.readFile(path.join(artifactRoot(), id, "mission.json"), "utf-8");
      return JSON.parse(file) as MissionResult;
    } catch {
      return undefined;
    }
  }

  async exportMission(id: string, format: "json" | "csv") {
    const mission = await this.getMissionResult(id);
    if (!mission) throw new Error("Mission not found");
    if (format === "json") return JSON.stringify(mission, null, 2);
    const header = ["url", "finalUrl", "success", "httpStatus", "title", "description", "seoScore", "techDetected", "attempts", "durationMs", "error"];
    const rows = mission.results.map(result => [
      result.url, result.finalUrl, result.success, result.httpStatus, result.title, result.description,
      result.seo?.score, result.techDetected?.join(" | "), result.attempts, result.durationMs, result.error,
    ].map(csvEscape).join(","));
    return [header.join(","), ...rows].join("\n");
  }

  private async inspectUrl(target: string, retries: number, timeoutMs: number, metrics: MissionMetrics, artifactDirectory: string): Promise<UrlEvidence> {
    const fetchedAt = new Date().toISOString();
    const started = Date.now();
    let lastError = "Unknown error";
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const safeUrl = await assertSafePublicUrl(target);
        const response = await fetch(safeUrl, {
          headers: { "User-Agent": "ManusCoreEngine/2.0 (+https://github.com/belentani7/ai-command-center-level10)" },
          redirect: "follow",
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const html = await response.text();
        metrics.bytesFetched += Buffer.byteLength(html);
        metrics.deterministicOperations += 1;

        const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? decodeText(titleMatch[1].replace(/\s+/g, " ").trim()) : undefined;
        const description = extractAttribute(html, "name", "description");
        const canonicalMatch = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>|<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
        const canonical = canonicalMatch?.[1] ?? canonicalMatch?.[2];
        const language = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1];
        const structuredData = extractStructuredData(html);
        const contentSnippet = decodeText(html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ").trim()).slice(0, 500);
        const techDetected = detectTechnologies(html);
        const seo = buildSeoEvidence(html, title, description, canonical, language, structuredData);
        const evidence: UrlEvidence = {
          url: target,
          finalUrl: response.url,
          success: true,
          attempts: attempt + 1,
          fetchedAt,
          durationMs: Date.now() - started,
          httpStatus: response.status,
          title,
          description,
          canonical,
          language,
          techDetected,
          structuredData,
          relevantLinks: extractRelevantLinks(html, response.url),
          contentSnippet,
          contentHash: createHash("sha256").update(html).digest("hex"),
          seo,
        };
        await this.logEvent(artifactDirectory, "url.completed", { url: target, attempt: attempt + 1, httpStatus: response.status });
        return evidence;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        if (attempt < retries) {
          metrics.retryCount += 1;
          const retryDelay = 300 * 2 ** attempt;
          await this.logEvent(artifactDirectory, "url.retry", { url: target, attempt: attempt + 1, error: lastError, retryDelay });
          await sleep(retryDelay);
        }
      }
    }

    await this.logEvent(artifactDirectory, "url.failed", { url: target, error: lastError });
    return { url: target, success: false, attempts: retries + 1, fetchedAt, durationMs: Date.now() - started, error: lastError };
  }

  private async writeMission(mission: MissionResult) {
    await fs.writeFile(path.join(mission.artifactDirectory, "mission.json"), JSON.stringify(mission, null, 2), "utf-8");
  }

  private async logEvent(artifactDirectory: string, event: string, data: Record<string, unknown>) {
    await fs.appendFile(path.join(artifactDirectory, "events.ndjson"), `${JSON.stringify({ timestamp: new Date().toISOString(), event, ...data })}\n`, "utf-8");
  }

  private async persistMemory(mission: MissionResult) {
    await fs.mkdir(path.dirname(memoryPath()), { recursive: true });
    let memory: Record<string, StrategyMemory> = {};
    try { memory = JSON.parse(await fs.readFile(memoryPath(), "utf-8")); } catch { /* first run */ }
    for (const result of mission.results) {
      const host = new URL(result.url).hostname;
      const current = memory[host] ?? { host, successfulFetches: 0, failedFetches: 0, lastSeenAt: "", observedTechnologies: [] };
      if (result.success) current.successfulFetches += 1;
      else { current.failedFetches += 1; current.lastError = result.error; }
      current.lastSeenAt = mission.completedAt ?? new Date().toISOString();
      current.observedTechnologies = Array.from(new Set(current.observedTechnologies.concat(result.techDetected ?? [])));
      memory[host] = current;
    }
    await fs.writeFile(memoryPath(), JSON.stringify(memory, null, 2), "utf-8");
  }
}

export const globalEngine = new ManusCoreEngine();

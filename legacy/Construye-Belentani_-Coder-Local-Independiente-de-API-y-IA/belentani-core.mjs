/**
 * Belentani Core · capa local determinista.
 * No incluye proveedores, clientes HTTP ni dependencia de modelos.
 */
import { spawn } from "node:child_process";
import { appendFile, lstat, mkdir, readFile, readdir, realpath, writeFile } from "node:fs/promises";
import path from "node:path";

const SKIPPED_DIRECTORIES = new Set([".git", "node_modules", "dist", "build", ".next", ".cache", ".belentani"]);
const SAFE_COMMANDS = new Set(["pwd", "ls", "dir", "git status", "git diff", "pnpm check", "pnpm test", "npm test", "npm run check"]);
const BLOCKED_PATTERNS = [
  /(^|\s)(rm|del|rmdir|format|shutdown|reboot|mkfs)(\s|$)/i,
  /(^|\s)(sudo|runas|su)(\s|$)/i,
  /(^|\s)(curl|wget|invoke-webrequest|nc|ssh|scp)(\s|$)/i,
  /https?:\/\//i,
  /(^|\s)\.\.([/\\]|\s|$)/,
  /[;&|`$<>\n\r]/,
];
const CAUTION_PATTERNS = [
  /(^|\s)(npm|pnpm|yarn)\s+(install|add|remove|update)(\s|$)/i,
  /(^|\s)git\s+(commit|checkout|merge|rebase|clean)(\s|$)/i,
  /(^|\s)(cp|copy|mv|move|mkdir|md|touch)(\s|$)/i,
];
const DANGEROUS_PATTERNS = [
  /(^|\s)git\s+reset\s+--hard(\s|$)/i,
  /(^|\s)(docker|podman)\s+(system\s+prune|rm|rmi)(\s|$)/i,
  /(^|\s)(drop|truncate|delete\s+from)(\s|$)/i,
];

export const ToolStatus = Object.freeze({ NOT_IMPLEMENTED: "NOT_IMPLEMENTED", PARTIAL: "PARTIAL", FAILED: "FAILED", VERIFIED: "VERIFIED" });
export const TOOL_CONTRACTS = Object.freeze([
  { name: "filesystem.inspect", permissions: ["filesystem:read"], riskLevel: "SAFE", status: ToolStatus.VERIFIED },
  { name: "filesystem.read", permissions: ["filesystem:read"], riskLevel: "SAFE", status: ToolStatus.VERIFIED },
  { name: "filesystem.write", permissions: ["filesystem:write", "human:approve"], riskLevel: "CAUTION", status: ToolStatus.VERIFIED },
  { name: "filesystem.search", permissions: ["filesystem:read"], riskLevel: "SAFE", status: ToolStatus.VERIFIED },
  { name: "terminal.run", permissions: ["terminal", "human:approve"], riskLevel: "CAUTION", status: ToolStatus.VERIFIED },
  { name: "web.research", permissions: ["network"], riskLevel: "BLOCKED", status: ToolStatus.NOT_IMPLEMENTED },
  { name: "model.provider", permissions: ["model"], riskLevel: "OPTIONAL", status: ToolStatus.NOT_IMPLEMENTED },
]);

export function classifyCommand(command) {
  const normalized = command.trim().replace(/\s+/g, " ");
  if (!normalized) return { level: "BLOCKED", reason: "El comando está vacío." };
  if (BLOCKED_PATTERNS.some((rule) => rule.test(normalized))) return { level: "BLOCKED", reason: "Patrón bloqueado por política local." };
  if (/(^|\s)(-C|--work-tree|--git-dir|--prefix)(\s|=)/.test(normalized) || /(^|\s)\/[\w.-]+/.test(normalized)) return { level: "BLOCKED", reason: "Las rutas externas y los flags de redirección de workspace están bloqueados." };
  if (DANGEROUS_PATTERNS.some((rule) => rule.test(normalized))) return { level: "DANGEROUS", reason: "Operación potencialmente irreversible." };
  if (SAFE_COMMANDS.has(normalized)) return { level: "SAFE", reason: "Comando de lectura o verificación en lista permitida." };
  if (CAUTION_PATTERNS.some((rule) => rule.test(normalized))) return { level: "CAUTION", reason: "La operación cambia el entorno o el proyecto." };
  return { level: "CAUTION", reason: "Comando no incluido en la lista segura; requiere aprobación." };
}

export async function resolveWorkspace(root) {
  const resolved = await realpath(root);
  const info = await lstat(resolved);
  if (!info.isDirectory()) throw new Error("El workspace debe ser un directorio existente.");
  return resolved;
}

export function isPathInsideWorkspace(workspaceRoot, candidatePath) {
  const relative = path.relative(workspaceRoot, path.resolve(candidatePath));
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

async function resolveSafeFilePath(workspaceRoot, relativePath) {
  const workspace = await resolveWorkspace(workspaceRoot);
  if (!relativePath || path.isAbsolute(relativePath) || relativePath.split(/[\\/]+/).includes("..")) throw new Error("BLOCKED: la ruta debe ser relativa y permanecer dentro del workspace.");
  const candidate = path.resolve(workspace, relativePath);
  if (!isPathInsideWorkspace(workspace, candidate)) throw new Error("BLOCKED: ruta fuera del workspace.");
  let ancestor = path.dirname(candidate);
  while (isPathInsideWorkspace(workspace, ancestor)) {
    try {
      const resolvedAncestor = await realpath(ancestor);
      if (!isPathInsideWorkspace(workspace, resolvedAncestor)) throw new Error("BLOCKED: enlace simbólico fuera del workspace.");
      break;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("BLOCKED:")) throw error;
      const parent = path.dirname(ancestor);
      if (parent === ancestor) break;
      ancestor = parent;
    }
  }
  return { workspace, candidate };
}

export async function readWorkspaceText(workspaceRoot, relativePath, maxBytes = 256_000) {
  const { candidate } = await resolveSafeFilePath(workspaceRoot, relativePath);
  const fileInfo = await lstat(candidate);
  if (!fileInfo.isFile() || fileInfo.size > maxBytes) throw new Error("BLOCKED: archivo no legible o excede el límite local.");
  return readFile(candidate, "utf8");
}

export async function writeWorkspaceText({ workspaceRoot, relativePath, content, approved = false }) {
  if (!approved) throw new Error("APPROVAL_REQUIRED: escribir archivos exige --approve.");
  if (typeof content !== "string") throw new Error("El contenido debe ser texto.");
  if (Buffer.byteLength(content, "utf8") > 256_000) throw new Error("BLOCKED: contenido supera el límite local de 256 KB.");
  const { workspace, candidate } = await resolveSafeFilePath(workspaceRoot, relativePath);
  await mkdir(path.dirname(candidate), { recursive: true });
  await writeFile(candidate, content, "utf8");
  const record = { tool: "filesystem.write", path: relativePath, bytes: Buffer.byteLength(content, "utf8"), status: ToolStatus.VERIFIED };
  await appendAuditLog(workspace, record);
  return record;
}

export async function searchWorkspaceText({ workspaceRoot, query, maxMatches = 100 }) {
  if (!query || query.length > 200) throw new Error("La consulta debe tener entre 1 y 200 caracteres.");
  const report = await inspectWorkspace(workspaceRoot, { maxFiles: 600 });
  const matches = [];
  for (const relativePath of report.files) {
    if (matches.length >= maxMatches) break;
    try {
      const text = await readWorkspaceText(report.workspace, relativePath, 64_000);
      const line = text.split("\n").findIndex((value) => value.toLowerCase().includes(query.toLowerCase()));
      if (line >= 0) matches.push({ path: relativePath, line: line + 1 });
    } catch { /* binary, unreadable and oversize files are not search targets */ }
  }
  return { status: ToolStatus.VERIFIED, query, matches, truncated: matches.length >= maxMatches };
}

function tokenizeCommand(command) {
  const tokens = command.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  return tokens.map((token) => token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token);
}

function detectLanguage(file) {
  const extension = path.extname(file).toLowerCase();
  const map = { ".ts": "TypeScript", ".tsx": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript", ".py": "Python", ".go": "Go", ".rs": "Rust", ".java": "Java", ".json": "JSON", ".md": "Markdown", ".css": "CSS", ".html": "HTML" };
  return map[extension] ?? "Other";
}

export async function inspectWorkspace(root, options = {}) {
  const workspace = await resolveWorkspace(root);
  const maxFiles = options.maxFiles ?? 1000;
  const maxDepth = options.maxDepth ?? 8;
  const files = [];
  const languages = {};

  async function walk(directory, depth) {
    if (depth > maxDepth || files.length >= maxFiles) return;
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const relativePath = path.relative(workspace, fullPath);
        files.push(relativePath);
        const language = detectLanguage(relativePath);
        languages[language] = (languages[language] ?? 0) + 1;
      }
    }
  }

  await walk(workspace, 0);
  let packageData = null;
  try { packageData = JSON.parse(await readFile(path.join(workspace, "package.json"), "utf8")); } catch { /* package.json is optional */ }
  const entrypoints = files.filter((file) => /(^|\/)(main|index|app|server)\.(m?js|cjs|ts|tsx|jsx|py)$/i.test(file));
  const testFiles = files.filter((file) => /(^|\/).+\.(test|spec)\.[cm]?[jt]sx?$/i.test(file));
  return {
    status: ToolStatus.VERIFIED,
    workspace,
    files,
    fileCount: files.length,
    truncated: files.length >= maxFiles,
    languages,
    packageManager: packageData?.packageManager?.split("@")[0] ?? null,
    scripts: Object.keys(packageData?.scripts ?? {}),
    entrypoints,
    testFiles,
  };
}

export async function appendAuditLog(workspaceRoot, event) {
  const workspace = await resolveWorkspace(workspaceRoot);
  const logDirectory = path.join(workspace, ".belentani");
  if (!isPathInsideWorkspace(workspace, logDirectory)) throw new Error("Ruta de log fuera del workspace.");
  await mkdir(logDirectory, { recursive: true });
  const record = { timestamp: new Date().toISOString(), ...event };
  await appendFile(path.join(logDirectory, "audit.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

export async function executeCommand({ workspaceRoot, command, approved = false, allowNetwork = false, timeoutMs = 120000 }) {
  const workspace = await resolveWorkspace(workspaceRoot);
  const policy = classifyCommand(command);
  if (policy.level === "BLOCKED") throw new Error(`BLOCKED: ${policy.reason}`);
  if (policy.level === "DANGEROUS") throw new Error(`BLOCKED: ${policy.reason}`);
  if (policy.level === "CAUTION" && !approved) throw new Error("APPROVAL_REQUIRED: La operación necesita --approve.");
  if (!allowNetwork && /(^|\s)(npm|pnpm|yarn)\s+(install|add|remove|update)(\s|$)/i.test(command)) throw new Error("NETWORK_PERMISSION_REQUIRED: Añade --network junto a --approve para operaciones de paquetes.");
  const [executable, ...commandArgs] = tokenizeCommand(command);
  if (!executable) throw new Error("BLOCKED: comando vacío.");

  const startedAt = Date.now();
  const safeTimeoutMs = Math.max(100, Math.min(Number.isFinite(timeoutMs) ? timeoutMs : 120000, 120000));
  let result;
  try {
    result = await new Promise((resolve, reject) => {
      const child = spawn(executable, commandArgs, { cwd: workspace, shell: false, detached: process.platform !== "win32", env: { ...process.env, NO_PROXY: "*" } });
      let stdout = "";
      let stderr = "";
      let timedOut = false;
      const limitOutput = (text) => text.length > 200000 ? `${text.slice(0, 200000)}\n[output truncated]` : text;
      const stopProcess = (signal) => {
        try { process.kill(process.platform === "win32" ? child.pid : -child.pid, signal); }
        catch { child.kill(signal); }
      };
      child.stdout.on("data", (chunk) => { stdout = limitOutput(stdout + chunk.toString()); });
      child.stderr.on("data", (chunk) => { stderr = limitOutput(stderr + chunk.toString()); });
      const timeout = setTimeout(() => { timedOut = true; stopProcess("SIGTERM"); }, safeTimeoutMs);
      const forceKill = setTimeout(() => { if (timedOut) stopProcess("SIGKILL"); }, safeTimeoutMs + 2000);
      child.on("error", (error) => { clearTimeout(timeout); clearTimeout(forceKill); reject(error); });
      child.on("close", (exitCode, signal) => { clearTimeout(timeout); clearTimeout(forceKill); resolve({ exitCode, signal, stdout, stderr, timedOut }); });
    });
  } catch (error) {
    result = { exitCode: null, signal: null, stdout: "", stderr: error instanceof Error ? error.message : String(error), timedOut: false };
  }
  const record = { tool: "terminal", command, policy, durationMs: Date.now() - startedAt, ...result, status: result.exitCode === 0 && !result.timedOut ? ToolStatus.VERIFIED : ToolStatus.FAILED };
  await appendAuditLog(workspace, record);
  return record;
}

export async function runDoctor(workspaceRoot) {
  const workspace = await resolveWorkspace(workspaceRoot);
  const inspection = await inspectWorkspace(workspace, { maxFiles: 10 });
  const command = await new Promise((resolve) => {
    const child = spawn("git", ["--version"], { cwd: workspace });
    let stdout = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.on("close", (exitCode) => resolve({ exitCode, stdout: stdout.trim() }));
    child.on("error", () => resolve({ exitCode: 1, stdout: "not found" }));
  });
  return {
    status: ToolStatus.VERIFIED,
    checks: [
      { name: "Node.js", status: ToolStatus.VERIFIED, detail: process.version },
      { name: "Workspace", status: ToolStatus.VERIFIED, detail: workspace },
      { name: "Git", status: command.exitCode === 0 ? ToolStatus.VERIFIED : ToolStatus.PARTIAL, detail: command.stdout },
      { name: "Red/API/Modelo obligatorio", status: ToolStatus.VERIFIED, detail: "0" },
      { name: "Archivos detectados", status: ToolStatus.VERIFIED, detail: String(inspection.fileCount) },
    ],
  };
}

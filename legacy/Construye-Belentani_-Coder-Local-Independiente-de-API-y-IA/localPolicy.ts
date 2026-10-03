/**
 * Belentani · Local Policy Core
 * Reglas puras y deterministas. No hace llamadas de red, no interpreta lenguaje natural y no usa modelos.
 */

export type OperationRisk = "safe" | "review" | "blocked";

const SAFE_COMMANDS = new Set([
  "pwd",
  "ls",
  "dir",
  "git status",
  "git diff",
  "pnpm test",
  "pnpm check",
  "npm test",
  "npm run check",
]);

const BLOCKED_PATTERNS = [
  /(^|\s)(rm|del|rmdir|format|shutdown|reboot|mkfs)(\s|$)/i,
  /(^|\s)(sudo|runas|su)(\s|$)/i,
  /https?:\/\//i,
  /(^|\s)(curl|wget|invoke-webrequest|nc|ssh|scp)(\s|$)/i,
  /[;&|`$<>\n\r]/,
  /(^|\s)(-C|--work-tree|--git-dir|--prefix)(\s|=)/,
  /(^|\s)\/[\w.-]+/,
  /(^|\s)git\s+reset\s+--hard(\s|$)/i,
  /(^|\s)(docker|podman)\s+(system\s+prune|rm|rmi)(\s|$)/i,
];

const WRITE_PATTERNS = [
  /(^|\s)(mv|move|copy|cp|touch|mkdir|md|npm install|pnpm add|git commit)(\s|$)/i,
  />{1,2}|\bwrite\b|\bedit\b|\bcreate\b|\bdelete\b/i,
];

export function classifyOperation(command: string): OperationRisk {
  const normalized = command.trim().replace(/\s+/g, " ");
  if (!normalized) return "blocked";
  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized))) return "blocked";
  if (SAFE_COMMANDS.has(normalized)) return "safe";
  if (WRITE_PATTERNS.some((pattern) => pattern.test(normalized))) return "review";
  return "review";
}

export function isOfflineCore(): boolean {
  return true;
}

export function auditSummary() {
  return {
    networkRequests: 0,
    apiKeys: 0,
    aiModels: 0,
    destructiveCommandsWithoutReview: 0,
  } as const;
}

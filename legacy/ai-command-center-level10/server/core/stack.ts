import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type WorkspaceCapability = "workspace" | "coding-agent" | "general-agent" | "local-inference" | "model-router" | "mcp" | "automation";

export interface StackToolStatus {
  id: string;
  capability: WorkspaceCapability;
  command: string;
  available: boolean;
  version?: string;
  detail: string;
}

const TOOLS: Array<Omit<StackToolStatus, "available" | "version" | "detail">> = [
  { id: "odysseus", capability: "workspace", command: "odysseus" },
  { id: "opencode", capability: "coding-agent", command: "opencode" },
  { id: "goose", capability: "general-agent", command: "goose" },
  { id: "cline", capability: "coding-agent", command: "cline" },
  { id: "roo", capability: "coding-agent", command: "roo" },
  { id: "aider", capability: "coding-agent", command: "aider" },
  { id: "openhands", capability: "general-agent", command: "openhands" },
  { id: "ollama", capability: "local-inference", command: "ollama" },
  { id: "llama.cpp", capability: "local-inference", command: "llama-cli" },
  { id: "lm-studio", capability: "model-router", command: "lms" },
  { id: "n8n", capability: "automation", command: "n8n" },
];

async function inspectCommand(tool: Omit<StackToolStatus, "available" | "version" | "detail">): Promise<StackToolStatus> {
  try {
    const { stdout, stderr } = await execFileAsync("sh", ["-lc", `command -v ${tool.command} && ${tool.command} --version 2>&1 | head -n 1`], { timeout: 5_000 });
    const output = `${stdout}\n${stderr}`.trim().split("\n").filter(Boolean);
    return { ...tool, available: true, version: output[1] ?? output[0], detail: "Comando local detectado" };
  } catch {
    return { ...tool, available: false, detail: "No detectado en PATH; no se asume instalado ni se simula conexión" };
  }
}

export async function inspectWorkspaceStack() {
  return Promise.all(TOOLS.map(inspectCommand));
}

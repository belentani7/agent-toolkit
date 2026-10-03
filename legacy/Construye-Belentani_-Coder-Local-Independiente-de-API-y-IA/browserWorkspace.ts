/** Belentani · acceso de solo lectura a directorios autorizados explícitamente. */
export type WorkspaceFile = { path: string; name: string; language: string; handle: any };
export type Workspace = { name: string; files: WorkspaceFile[]; truncated: boolean };

const IGNORED = new Set([".git", "node_modules", "dist", "build", ".next", ".cache", ".belentani"]);
const LANGUAGES: Record<string, string> = { ts: "TypeScript", tsx: "TypeScript", js: "JavaScript", jsx: "JavaScript", mjs: "JavaScript", py: "Python", json: "JSON", md: "Markdown", css: "CSS", html: "HTML" };

export function supportsDirectoryPicker() { return typeof window !== "undefined" && typeof (window as any).showDirectoryPicker === "function"; }
function languageOf(name: string) { return LANGUAGES[name.split(".").pop()?.toLowerCase() ?? ""] ?? "Texto"; }

export async function openWorkspace(): Promise<Workspace> {
  if (!supportsDirectoryPicker()) throw new Error("NOT_IMPLEMENTED: este navegador no admite selección de carpetas local.");
  const root = await (window as any).showDirectoryPicker({ mode: "read" });
  const files: WorkspaceFile[] = [];
  async function walk(dir: any, prefix = "", depth = 0): Promise<void> {
    if (depth > 8 || files.length >= 600) return;
    for await (const [name, handle] of dir.entries()) {
      if (IGNORED.has(name) || files.length >= 600) continue;
      const itemPath = prefix ? `${prefix}/${name}` : name;
      if (handle.kind === "directory") await walk(handle, itemPath, depth + 1);
      if (handle.kind === "file") files.push({ path: itemPath, name, language: languageOf(name), handle });
    }
  }
  await walk(root);
  files.sort((a, b) => a.path.localeCompare(b.path));
  return { name: root.name, files, truncated: files.length >= 600 };
}

export async function readWorkspaceFile(file: WorkspaceFile) {
  const blob = await file.handle.getFile();
  return blob.size > 256_000 ? "// PARTIAL: archivo no mostrado porque supera el límite local de 256 KB." : blob.text();
}

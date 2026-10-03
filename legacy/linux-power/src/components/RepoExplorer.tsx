import { useState } from "react";
import { ALL_FILES, REPO_TREE, type RepoNode } from "../data/content";
import {
  CodeBlock,
  HudCorners,
  IconChevron,
  IconFile,
  IconFolder,
  IconFolderOpen,
  Reveal,
} from "./ui";

function TreeNode({
  node,
  depth,
  openDirs,
  toggleDir,
  activePath,
  onSelect,
}: {
  node: RepoNode;
  depth: number;
  openDirs: Set<string>;
  toggleDir: (name: string) => void;
  activePath: string;
  onSelect: (path: string) => void;
}) {
  const pad = { paddingLeft: `${depth * 16 + 12}px` };

  if (node.kind === "dir") {
    const open = openDirs.has(node.name);
    return (
      <div>
        <button
          type="button"
          onClick={() => toggleDir(node.name)}
          className="group flex w-full items-center gap-2 py-[7px] pr-3 text-left font-mono text-[12.5px] text-mist transition-colors hover:bg-ink-800/70 hover:text-fog"
          style={pad}
          aria-expanded={open}
        >
          <IconChevron
            className={`h-3 w-3 shrink-0 text-dim transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
          {open ? (
            <IconFolderOpen className="h-4 w-4 shrink-0 text-ember" />
          ) : (
            <IconFolder className="h-4 w-4 shrink-0 text-dim" />
          )}
          <span className="truncate font-medium">{node.name}/</span>
        </button>
        <div
          className={`grid transition-all duration-300 ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {node.children.map((c) => (
              <TreeNode
                key={c.name}
                node={c}
                depth={depth + 1}
                openDirs={openDirs}
                toggleDir={toggleDir}
                activePath={activePath}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const active = activePath === node.path;
  return (
    <button
      type="button"
      onClick={() => onSelect(node.path)}
      className={`group flex w-full items-center gap-2 py-[7px] pr-3 text-left font-mono text-[12.5px] transition-all duration-200 ${
        active
          ? "border-l-2 border-neon bg-neon/[0.09] text-fog shadow-[inset_0_0_24px_rgba(255,46,77,0.06)]"
          : "border-l-2 border-transparent text-mist hover:translate-x-1 hover:bg-ink-800/70 hover:text-fog"
      }`}
      style={pad}
      aria-current={active ? "true" : undefined}
    >
      <IconFile className={`h-4 w-4 shrink-0 ${active ? "text-neon" : "text-dim"}`} />
      <span className="truncate">{node.name}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-neon shadow-[0_0_8px_rgba(255,46,77,0.9)]" />
      )}
    </button>
  );
}

export default function RepoExplorer() {
  const [openDirs, setOpenDirs] = useState<Set<string>>(
    () => new Set([".github", "workflows", ".devcontainer", "scripts", "skills"])
  );
  const [activePath, setActivePath] = useState(ALL_FILES[0].path);

  const toggleDir = (name: string) =>
    setOpenDirs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const file = ALL_FILES.find((f) => f.path === activePath) ?? ALL_FILES[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      {/* -------- árbol -------- */}
      <Reveal>
        <aside className="glass relative overflow-hidden rounded-xl lg:sticky lg:top-24">
          <HudCorners />
          <div className="flex items-center justify-between border-b border-line-soft bg-ink-900/70 px-4 py-3">
            <p className="flex items-center gap-2 font-mono text-[12px] font-bold text-fog">
              <span className="text-neon">~/</span>control-linux
            </p>
            <span className="rounded border border-line bg-ink-800/70 px-1.5 py-0.5 font-mono text-[10px] text-dim">
              {ALL_FILES.length} archivos
            </span>
          </div>
          <div className="py-2">
            {REPO_TREE.map((n) => (
              <TreeNode
                key={n.name}
                node={n}
                depth={0}
                openDirs={openDirs}
                toggleDir={toggleDir}
                activePath={activePath}
                onSelect={setActivePath}
              />
            ))}
          </div>
          <div className="border-t border-line-soft px-4 py-3 font-mono text-[10.5px] leading-relaxed text-dim">
            <span className="text-neon">*</span> todo auditable dentro del repo — nada de
            servicios raros
          </div>
        </aside>
      </Reveal>

      {/* -------- visor -------- */}
      <Reveal delay={120}>
        <div className="glass relative overflow-hidden rounded-xl">
          <div className="border-b border-line-soft bg-ink-900/50 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              {file.path}
            </p>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-mist">{file.blurb}</p>
          </div>
          <div className="p-3 sm:p-4">
            <CodeBlock filename={file.path} lang={file.lang} code={file.content} tall />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

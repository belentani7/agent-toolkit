import { useEffect, useRef, useState } from "react";
import { SKILL_SIMS, type TermKind } from "../data/content";
import { IconPlay, IconRefresh, useReducedMotion } from "./ui";

const KIND_CLS: Record<TermKind, string> = {
  cmd: "text-fog",
  ok: "text-mint",
  out: "text-mist",
  dim: "text-dim",
  info: "neon-soft font-medium",
};

function BrowserMock() {
  return (
    <div className="glass line-in mt-4 overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-line-soft bg-ink-900/70 px-3 py-2">
        <span className="flex gap-1" aria-hidden="true">
          <i className="h-2 w-2 rounded-full bg-neon" />
          <i className="h-2 w-2 rounded-full bg-amber/70" />
          <i className="h-2 w-2 rounded-full bg-mint/70" />
        </span>
        <span className="flex-1 truncate rounded-md border border-line bg-ink-950/70 px-3 py-1 font-mono text-[10.5px] text-mist">
          🔒 https://github.com
        </span>
        <span className="font-mono text-[10px] text-dim">github.png</span>
      </div>
      {/* maqueta de la página capturada */}
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-ink-600" />
          <div className="space-y-1.5">
            <div className="h-2.5 w-28 rounded bg-ink-600" />
            <div className="h-2 w-40 rounded bg-ink-700" />
          </div>
          <span className="ml-auto rounded border border-rose/30 bg-rose/10 px-2 py-0.5 font-mono text-[10px] text-rose">
            fullPage: true
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-14 rounded-md bg-ink-700/80" />
          <div className="h-14 rounded-md bg-ink-700/60" />
          <div className="h-14 rounded-md bg-ink-700/40" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded bg-ink-700/70" />
          <div className="h-2 w-11/12 rounded bg-ink-700/60" />
          <div className="h-2 w-4/5 rounded bg-ink-700/50" />
        </div>
        <p className="pt-1 font-mono text-[10.5px] text-dim">
          chromium · headless · 1280×2400 px · <span className="text-mint">saved</span>
        </p>
      </div>
    </div>
  );
}

export default function SkillRunner() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(SKILL_SIMS[0].id);
  const [runId, setRunId] = useState(0);
  const [visible, setVisible] = useState(0);
  const [running, setRunning] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const skill = SKILL_SIMS.find((s) => s.id === activeId) ?? SKILL_SIMS[0];

  useEffect(() => {
    setVisible(0);
    setRunning(true);
    if (reduced) {
      setVisible(skill.lines.length);
      setRunning(false);
      return;
    }
    let count = 0;
    const iv = window.setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= skill.lines.length) {
        window.clearInterval(iv);
        setRunning(false);
      }
    }, 150);
    return () => window.clearInterval(iv);
  }, [activeId, runId, reduced, skill]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* -------- lista de skills -------- */}
      <div className="flex flex-col gap-2.5" role="tablist" aria-label="Skills disponibles">
        {SKILL_SIMS.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveId(s.id);
                setRunId((n) => n + 1);
              }}
              className={`glass group rounded-xl p-4 text-left transition-all duration-250 ${
                active
                  ? "border-neon/50 shadow-[0_14px_44px_-18px_rgba(255,46,77,0.55)]"
                  : "hover:-translate-y-0.5 hover:border-ink-600"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-display text-[14px] font-bold uppercase tracking-tight ${
                    active ? "text-fog" : "text-mist group-hover:text-fog"
                  }`}
                >
                  {s.name}
                </span>
                {active ? (
                  <IconPlay className="h-3.5 w-3.5 text-neon" />
                ) : (
                  <span className="font-mono text-[10px] text-dim">{s.duration}</span>
                )}
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{s.blurb}</p>
              <p className="mt-2.5 inline-block rounded border border-line-soft bg-ink-950/50 px-2 py-0.5 font-mono text-[10.5px] text-dim">
                {s.file}
              </p>
            </button>
          );
        })}
        <p className="mt-2 rounded-xl border border-dashed border-line px-4 py-3 font-mono text-[11px] leading-relaxed text-dim">
          <span className="text-amber">nota</span> — simulación con salidas de ejemplo; en un
          runner real las respuestas vienen de la API de GitHub.
        </p>
      </div>

      {/* -------- terminal -------- */}
      <div>
        <div className="glass sweep relative overflow-hidden rounded-xl">
          <div className="relative z-10 flex items-center gap-3 border-b border-line-soft bg-ink-900/70 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <i className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_8px_rgba(255,46,77,0.8)]" />
              <i className="h-2.5 w-2.5 rounded-full bg-amber/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-mint/80" />
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-mist">
              {skill.cmd}
            </span>
            <button
              type="button"
              onClick={() => setRunId((n) => n + 1)}
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-ink-800/70 px-2.5 py-1 font-mono text-[11px] text-mist transition-colors hover:border-neon/40 hover:text-fog"
            >
              <IconRefresh className="h-3 w-3" />
              ejecutar
            </button>
          </div>

          <div className="relative">
            <div className="scanlines" aria-hidden="true" />
            <div
              ref={scrollRef}
              className="code-scroll relative z-10 h-[340px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] sm:h-[360px]"
              aria-live="polite"
            >
              {skill.lines.slice(0, visible).map((l, i) => (
                <div
                  key={`${runId}-${i}`}
                  className={`line-in whitespace-pre-wrap break-all leading-[1.7] ${KIND_CLS[l.t]}`}
                >
                  {l.t === "cmd" ? (
                    <>
                      <span className="mr-2 select-none text-neon">$</span>
                      {l.text}
                    </>
                  ) : l.t === "ok" ? (
                    <>
                      <span className="mr-2 select-none text-mint">✓</span>
                      {l.text}
                    </>
                  ) : (
                    l.text
                  )}
                </div>
              ))}
              {running && <span className="term-cursor" aria-hidden="true" />}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-line-soft bg-ink-900/70 px-4 py-2 font-mono text-[10.5px] text-dim">
            <span className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${running ? "dot-live bg-neon" : "bg-mint"}`}
                style={!running ? { boxShadow: "0 0 8px rgba(69,212,131,0.8)" } : undefined}
              />
              {running ? "ejecutando skill…" : `exit 0 · ${skill.duration}`}
            </span>
            <span className="hidden sm:inline">skill: {skill.name}</span>
          </div>
        </div>

        {skill.preview === "screenshot" && !running && <BrowserMock />}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { BOOT_LINES, type TermLine, type TermKind } from "../data/content";
import { HudCorners, IconRefresh, useReducedMotion } from "./ui";

/* Colores por tipo de línea de terminal */
const KIND_CLS: Record<TermKind, string> = {
  cmd: "text-fog",
  ok: "text-mint",
  out: "text-mist",
  dim: "text-dim",
  info: "neon-soft font-medium",
};

function LineText({ line, partial }: { line: TermLine; partial?: string }) {
  const text = partial !== undefined ? partial : line.text;
  return (
    <div className={`whitespace-pre-wrap break-all leading-[1.7] ${KIND_CLS[line.t]}`}>
      {line.t === "cmd" ? (
        <>
          <span className="mr-2 select-none text-neon">$</span>
          {text}
        </>
      ) : line.t === "ok" ? (
        <>
          <span className="mr-2 select-none text-mint">✓</span>
          <span className="text-mist">{text.replace(/^✓\s*/, "")}</span>
        </>
      ) : (
        text
      )}
    </div>
  );
}

export default function BootTerminal({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState<{ li: number; ci: number }>({ li: 0, ci: 0 });
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    setDone(false);
    setPos({ li: 0, ci: 0 });

    if (reduced) {
      setPos({ li: BOOT_LINES.length, ci: 0 });
      setDone(true);
      return;
    }

    let li = 0;
    let ci = 0;
    let cancelled = false;

    const schedule = (fn: () => void, ms: number) => {
      timeouts.current.push(window.setTimeout(fn, ms));
    };

    const step = () => {
      if (cancelled) return;
      const line = BOOT_LINES[li];
      if (!line) {
        setDone(true);
        return;
      }
      if (line.t === "cmd") {
        if (ci < line.text.length) {
          ci += 1;
          setPos({ li, ci });
          schedule(step, 14 + Math.random() * 24);
        } else {
          li += 1;
          ci = 0;
          setPos({ li, ci });
          schedule(step, 240);
        }
      } else {
        li += 1;
        ci = 0;
        setPos({ li, ci });
        schedule(step, line.t === "ok" ? 200 : line.t === "info" ? 300 : 110);
      }
    };

    schedule(step, 500);
    return () => {
      cancelled = true;
      timeouts.current.forEach((t) => window.clearTimeout(t));
    };
  }, [runId, reduced]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pos, done]);

  const fullLines = BOOT_LINES.slice(0, pos.li);
  const current = BOOT_LINES[pos.li];
  const typingCmd = current && current.t === "cmd" && pos.ci < current.text.length;

  return (
    <div className={`glass sweep relative overflow-hidden rounded-xl ${className}`}>
      <HudCorners />

      {/* barra de la ventana */}
      <div className="relative z-10 flex items-center gap-3 border-b border-line-soft bg-ink-900/70 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-neon shadow-[0_0_8px_rgba(255,46,77,0.8)]" />
          <i className="h-3 w-3 rounded-full bg-amber/80" />
          <i className="h-3 w-3 rounded-full bg-mint/80" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-mist">
          <span className="font-bold text-neon">BE.Pilot</span> · pilot console — ~/control-linux
        </span>
        <span className="hidden rounded border border-neon/30 bg-neon/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neon sm:inline">
          pwsh · gh
        </span>
        <button
          type="button"
          onClick={() => setRunId((n) => n + 1)}
          aria-label="Reproducir de nuevo la secuencia"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-dim transition-all hover:rotate-90 hover:border-neon/40 hover:text-fog"
        >
          <IconRefresh className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* cuerpo */}
      <div className="relative">
        <div className="scanlines rounded-b-xl" aria-hidden="true" />
        <div
          ref={scrollRef}
          className="code-scroll relative z-10 h-[380px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] sm:h-[400px]"
          aria-label="Salida del bootstrap"
        >
          {fullLines.map((l, i) => (
            <LineText key={i} line={l} />
          ))}
          {typingCmd && current && (
            <LineText line={current} partial={current.text.slice(0, pos.ci)} />
          )}
          {done ? (
            <div className="mt-1 text-fog">
              <span className="mr-2 select-none text-neon">$</span>
              <span className="term-cursor" aria-hidden="true" />
            </div>
          ) : (
            !typingCmd &&
            current?.t === "cmd" && (
              <div className="text-fog">
                <span className="mr-2 select-none text-neon">$</span>
                <span className="term-cursor" aria-hidden="true" />
              </div>
            )
          )}
        </div>
      </div>

      {/* barra inferior de estado */}
      <div className="relative z-10 flex items-center justify-between border-t border-line-soft bg-ink-900/70 px-4 py-2 font-mono text-[10.5px] text-dim">
        <span className="flex items-center gap-2">
          <span
            className={`dot-live h-1.5 w-1.5 rounded-full ${done ? "bg-mint" : "bg-neon"}`}
            style={done ? { boxShadow: "0 0 8px rgba(69,212,131,0.8)" } : undefined}
          />
          {done ? "job completado · exit 0" : "ejecutando bootstrap…"}
        </span>
        <span className="hidden sm:inline">
          {Math.min(pos.li, BOOT_LINES.length)}/{BOOT_LINES.length} líneas
        </span>
      </div>
    </div>
  );
}

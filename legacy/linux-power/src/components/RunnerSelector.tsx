import { useState } from "react";
import { SCENARIOS } from "../data/content";
import { CodeBlock, IconBolt, IconServer, IconTerminal, Reveal } from "./ui";

const ICONS: Record<string, typeof IconBolt> = {
  actions: IconBolt,
  codespaces: IconTerminal,
  selfhosted: IconServer,
};

export default function RunnerSelector() {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id);
  const selected = SCENARIOS.find((s) => s.id === selectedId) ?? SCENARIOS[0];
  const Icon = ICONS[selected.id];

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* -------- escenarios -------- */}
      <div className="flex flex-col gap-2.5" role="tablist" aria-label="Escenarios de uso">
        {SCENARIOS.map((s) => {
          const active = s.id === selectedId;
          const SIcon = ICONS[s.id];
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedId(s.id)}
              className={`glass group flex items-center gap-4 rounded-xl p-4 text-left transition-all duration-250 ${
                active ? "hover:border-ink-600" : "hover:-translate-y-0.5 hover:border-ink-600"
              }`}
              style={active ? { boxShadow: `inset 3px 0 0 ${s.color}, 0 24px 70px -34px rgba(0,0,0,0.85)` } : undefined}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-ink-950/60 transition-transform duration-200 group-hover:scale-105"
                style={{ color: s.color }}
              >
                <SIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-display text-[14px] font-bold uppercase tracking-tight ${
                    active ? "text-fog" : "text-mist group-hover:text-fog"
                  }`}
                >
                  {s.title}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[11px] text-dim">
                  {s.tag}
                </span>
              </span>
            </button>
          );
        })}

        <Reveal delay={120} className="mt-2">
          <div className="glass rounded-xl border-neon/25 p-4">
            <p className="font-display text-[12px] font-bold uppercase tracking-wider text-neon">
              la combinación ganadora
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">
              Repo central con{" "}
              <span className="text-fog">workflows + scripts + skills + secrets</span>. Actions con
              schedule para lo periódico, Codespaces para lo interactivo y un runner self-hosted
              solo si necesitas 24/7 real.
            </p>
          </div>
        </Reveal>
      </div>

      {/* -------- detalle -------- */}
      <div key={selected.id} className="glass line-in overflow-hidden rounded-xl" role="tabpanel">
        <div className="border-b border-line-soft p-5 sm:p-6">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.25em]"
            style={{ color: selected.color }}
          >
            {selected.tag}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-fog sm:text-2xl">
            {selected.title}
          </h3>
          <p className="mt-3 max-w-2xl leading-relaxed text-mist">{selected.claim}</p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
              a favor
            </p>
            <ul className="space-y-2.5">
              {selected.pros.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-mist">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-mint"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4.5 12.5l5 5 10-11" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
              en contra
            </p>
            <ul className="space-y-2.5">
              {selected.cons.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-mist">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-amber"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <CodeBlock filename="terminal — bash" lang="bash" code={selected.code} />
        </div>

        <div className="flex items-center gap-2 border-t border-line-soft bg-ink-900/70 px-5 py-2.5 font-mono text-[10.5px] text-dim sm:px-6">
          <Icon className="h-3.5 w-3.5" style={{ color: selected.color }} />
          opción: {selected.id} · los mismos workflows y skills sirven en las tres
        </div>
      </div>
    </div>
  );
}

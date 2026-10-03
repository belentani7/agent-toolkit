import { useEffect, useRef, useState } from "react";
import { STEPS, type Step } from "../data/content";
import { CodeBlock, IconWarn, Reveal, useReducedMotion } from "./ui";

function StepPanel({ step }: { step: Step }) {
  return (
    <article id={step.id} data-step={step.id} className="scroll-mt-28">
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-4xl font-bold leading-none text-neon/20 sm:text-5xl">
            {step.num}
          </span>
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-fog sm:text-2xl">
            {step.title}
          </h3>
        </div>
        <p className="mt-4 leading-relaxed text-mist">{step.lead}</p>

        {step.body?.map((p, i) => (
          <p key={i} className="mt-3 leading-relaxed text-mist">
            {p}
          </p>
        ))}

        {step.code && (
          <div className="mt-5">
            <CodeBlock
              filename={step.code.filename}
              lang={step.code.lang}
              code={step.code.code}
              tall={step.code.tall}
            />
          </div>
        )}

        {step.bullets && (
          <ul className="mt-5 space-y-2.5">
            {step.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-mist">
                <span className="mt-[3px] select-none font-mono text-neon" aria-hidden="true">
                  ▸
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {step.warn && (
          <div className="glass mt-6 flex gap-4 rounded-xl border-neon/25 p-4 sm:p-5" style={{ borderLeft: "3px solid rgba(255,46,77,0.8)" }}>
            <IconWarn className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
            <div>
              <p className="font-display text-[13px] font-bold uppercase tracking-wider text-neon">
                {step.warn.title}
              </p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-mist">{step.warn.text}</p>
            </div>
          </div>
        )}
      </Reveal>
    </article>
  );
}

export default function Steps() {
  const [active, setActive] = useState(STEPS[0].id);
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const articles = wrapRef.current?.querySelectorAll("article[data-step]");
    if (!articles?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive((e.target as HTMLElement).dataset.step ?? STEPS[0].id);
          }
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
    );
    articles.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
      {/* -------- índice pegajoso -------- */}
      <nav className="hidden lg:block" aria-label="Índice de pasos">
        <div className="sticky top-28">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-neon">
            guía de montaje
          </p>
          <ol className="relative space-y-1 border-l border-line">
            {STEPS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id} className="relative">
                  <span
                    className={`absolute -left-px top-1/2 h-5 w-[2px] -translate-y-1/2 transition-all duration-300 ${
                      isActive
                        ? "bg-neon shadow-[0_0_10px_rgba(255,46,77,0.8)]"
                        : "bg-transparent"
                    }`}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => jump(s.id)}
                    className={`flex w-full items-baseline gap-3 rounded-r-md px-4 py-2 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-neon/[0.07] text-fog"
                        : "text-dim hover:bg-ink-800/60 hover:text-mist"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? "text-neon" : ""
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className="font-display text-[12.5px] font-medium uppercase leading-snug tracking-wide">
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="glass mt-6 rounded-xl p-4">
            <p className="font-mono text-[11px] leading-relaxed text-dim">
              <span className="text-neon">$</span> todo el montaje cabe en un solo bloque
              copiable: el paso{" "}
              <button
                type="button"
                onClick={() => jump("bootstrap")}
                className="text-neon u-slide font-medium"
              >
                02
              </button>
              .
            </p>
          </div>
        </div>
      </nav>

      {/* -------- pasos -------- */}
      <div ref={wrapRef} className="min-w-0 space-y-16 sm:space-y-20">
        {STEPS.map((s) => (
          <StepPanel key={s.id} step={s} />
        ))}
      </div>
    </div>
  );
}

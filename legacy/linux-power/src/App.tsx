import { useEffect, useRef, useState } from "react";
import BootTerminal from "./components/Terminal";
import RepoExplorer from "./components/RepoExplorer";
import Steps from "./components/Steps";
import SkillRunner from "./components/SkillRunner";
import RunnerSelector from "./components/RunnerSelector";
import {
  BOOTSTRAP,
  PIPELINE,
  SOURCES,
  STACK_CHIPS,
  TICKER_ITEMS,
  WARNINGS,
} from "./data/content";
import {
  CopyBtn,
  HudCorners,
  IconBranch,
  IconBrowser,
  IconCheck,
  IconClock,
  IconCopy,
  IconExt,
  IconKey,
  IconLayers,
  IconRepo,
  IconScope,
  IconTerminal,
  LogoMark,
  Reveal,
  SectionHead,
  copyText,
  useReducedMotion,
} from "./components/ui";

/* ------------------------------------------------------------------ */
/*  Hooks de telemetría                                                */
/* ------------------------------------------------------------------ */

function useUtcClock() {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const f = () => setNow(new Date().toISOString().slice(11, 19));
    f();
    const iv = window.setInterval(f, 1000);
    return () => window.clearInterval(iv);
  }, []);
  return now;
}

function useCountUp(target: number, duration = 950) {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reduced) {
      setVal(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, duration]);
  return val;
}

const STATS = [
  { label: "archivos", value: 10 },
  { label: "skills", value: 8 },
  { label: "pasos", value: 8 },
  { label: "tokens en código", value: 0 },
];

function StatChip({ label, value, delay }: { label: string; value: number; delay: number }) {
  const n = useCountUp(value);
  return (
    <Reveal delay={delay}>
      <div className="glass group rounded-xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-neon/40">
        <p className="font-display text-2xl font-bold tabular-nums text-fog transition-colors group-hover:text-neon sm:text-3xl">
          {n}
        </p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
          {label}
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Botón grande de copiar bootstrap                                   */
/* ------------------------------------------------------------------ */

function CopyBootstrapBtn() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    await copyText(BOOTSTRAP);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`btn-neon inline-flex items-center gap-2.5 rounded-lg px-5 py-3 font-display text-[13px] font-bold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 ${
        copied ? "!bg-none !bg-mint !text-ink-950 !shadow-[0_12px_40px_-12px_rgba(69,212,131,0.6)]" : ""
      }`}
    >
      {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
      {copied ? "bootstrap copiado" : "copiar el bootstrap"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Cabecera                                                           */
/* ------------------------------------------------------------------ */

const NAV = [
  { href: "#estructura", label: "estructura" },
  { href: "#guia", label: "guía" },
  { href: "#skills", label: "skills" },
  { href: "#runners", label: "runners" },
  { href: "#fuentes", label: "fuentes" },
];

function Header() {
  const clock = useUtcClock();
  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-neon/35 bg-neon/10 text-neon shadow-[0_0_18px_rgba(255,46,77,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <LogoMark className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-[15px] font-bold uppercase tracking-widest text-fog">
            BE<span className="neon-text">.Pilot</span>
          </span>
        </a>
        <nav className="ml-auto hidden items-center gap-5 md:flex" aria-label="Secciones">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="u-slide font-mono text-[11.5px] lowercase tracking-wide text-mist transition-colors hover:text-fog"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 md:ml-6">
          <span className="hidden font-mono text-[10.5px] tabular-nums text-dim lg:inline">
            UTC {clock}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 py-1 pl-2.5 pr-3 font-mono text-[10.5px] uppercase tracking-wider text-neon">
            <span className="dot-live h-1.5 w-1.5 rounded-full bg-neon" />
            online
          </span>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Apertura: consola de pilotaje                                      */
/* ------------------------------------------------------------------ */

function Opener() {
  const clock = useUtcClock();
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-[11.5px] uppercase tracking-[0.25em] text-neon">
              <span className="inline-block h-px w-8 bg-neon/70" aria-hidden="true" />
              BE.Pilot // montaje oficial
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-[2rem] font-bold uppercase leading-[1.02] tracking-tight text-fog sm:text-5xl xl:text-[3.4rem]">
              <span className="mask-line is-in">
                <span>El piloto</span>
              </span>
              <span className="mask-line is-in">
                <span style={{ transitionDelay: "120ms" }} className="neon-text">
                  automático
                </span>
              </span>
              <span className="mask-line is-in">
                <span style={{ transitionDelay: "240ms" }}>de tus repos.</span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-mist">
              BE.Pilot convierte una repo mínima de <strong className="font-semibold text-fog">Ubuntu</strong> en
              una cabina de control: <strong className="font-semibold text-fog">PowerShell 7</strong>,{" "}
              <strong className="font-semibold text-fog">GitHub CLI</strong> y{" "}
              <strong className="font-semibold text-fog">Chromium headless</strong> con Playwright — con skills
              ejecutables desde GitHub Actions y Codespaces.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              una collab de
              <span className="rounded border border-neon/30 bg-neon/[0.08] px-2 py-0.5 text-neon">
                Noicore Lab
              </span>
              <span className="text-neon">×</span>
              <span className="rounded border border-rose/30 bg-rose/[0.08] px-2 py-0.5 text-rose">
                Belentani
              </span>
            </p>
          </Reveal>

          <Reveal delay={240}>
            <ul className="mt-6 flex max-w-md flex-wrap gap-2" aria-label="Componentes del montaje">
              {STACK_CHIPS.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center gap-2 rounded-md border border-line bg-ink-900/60 px-2.5 py-1.5 font-mono text-[11px] text-mist transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-600 hover:text-fog"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                  />
                  {c.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyBootstrapBtn />
              <a
                href="#estructura"
                className="glass inline-flex items-center gap-2 rounded-lg px-5 py-3 font-display text-[13px] font-bold uppercase tracking-wide text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-neon/40 hover:text-fog"
              >
                ver la estructura
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4.5v15M6 13.5l6 6 6-6" />
                </svg>
              </a>
            </div>
          </Reveal>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <StatChip key={s.label} label={s.label} value={s.value} delay={340 + i * 70} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={180}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-dim">
              <span className="flex items-center gap-2">
                <IconTerminal className="h-3.5 w-3.5 text-neon" />
                telemetría de cabina
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <IconClock className="h-3.5 w-3.5" />
                  <span className="tabular-nums text-mist">UTC {clock}</span>
                </span>
                <span className="hidden sm:inline">runner: ubuntu-latest</span>
                <span className="hidden sm:inline">rama: main</span>
              </span>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <BootTerminal />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Cinta de logs                                                      */
/* ------------------------------------------------------------------ */

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative border-y border-line bg-ink-900/60 py-3 backdrop-blur-sm" aria-hidden="true">
      <div className="ticker-track gap-0">
        {items.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 pr-6 font-mono text-[11px] uppercase tracking-[0.2em] whitespace-nowrap text-dim"
          >
            {t}
            <span className="text-neon/50">//</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pipeline del job                                                   */
/* ------------------------------------------------------------------ */

function Pipeline() {
  return (
    <Reveal delay={120}>
      <div className="glass relative mt-10 overflow-hidden rounded-xl">
        <HudCorners />
        <div className="flex items-center justify-between border-b border-line-soft bg-ink-900/60 px-4 py-2.5 sm:px-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
            pipeline del job · linux-pwsh-cli-browser
          </span>
          <span className="hidden font-mono text-[10.5px] text-dim sm:inline">
            runs-on: <span className="text-rose">ubuntu-latest</span>
          </span>
        </div>
        <ol className="flex flex-col divide-y divide-line-soft md:flex-row md:divide-x md:divide-y-0">
          {PIPELINE.map((n, i) => (
            <li
              key={n.title}
              className="group relative flex flex-1 items-center gap-3 px-4 py-3.5 transition-colors duration-200 hover:bg-ink-800/50 md:flex-col md:items-start md:gap-1.5 md:py-4"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line bg-ink-950/70 font-mono text-[10px] tabular-nums transition-transform duration-200 group-hover:scale-110"
                style={{ color: n.color }}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-[11.5px] font-bold uppercase tracking-wide text-fog">
                  {n.title}
                </span>
                <span className="block truncate font-mono text-[10px] text-dim">{n.shell}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Avisos                                                             */
/* ------------------------------------------------------------------ */

const WARN_ICONS = {
  clock: IconClock,
  key: IconKey,
  scope: IconScope,
} as const;

function WarningsBand() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="space-y-3">
        {WARNINGS.map((w, i) => {
          const WIcon = WARN_ICONS[w.icon];
          return (
            <Reveal key={w.title} delay={i * 100}>
              <div
                className="glass group flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 hover:translate-x-1 hover:border-neon/35 sm:flex-row sm:items-start sm:gap-5 sm:p-5"
                style={{ borderLeft: "3px solid rgba(255,46,77,0.75)" }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neon/30 bg-neon/10 text-neon shadow-[0_0_16px_rgba(255,46,77,0.25)]">
                  <WIcon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[13.5px] font-bold uppercase tracking-tight text-fog">
                    <span className="mr-2 font-mono text-[11px] font-medium normal-case text-neon">
                      aviso {i + 1}/3
                    </span>
                    {w.title}
                  </p>
                  <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-mist">{w.text}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Fuentes                                                            */
/* ------------------------------------------------------------------ */

function Sources() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SOURCES.map((s, i) => (
        <Reveal key={s.url} delay={(i % 2) * 90}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass group flex items-center gap-4 rounded-xl p-4 transition-all duration-250 hover:-translate-y-0.5 hover:border-neon/45"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-ink-950/60 text-dim transition-colors group-hover:border-neon/40 group-hover:text-neon">
              <IconExt className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium text-fog">{s.label}</span>
              <span className="block font-mono text-[11px] text-dim">{s.domain}</span>
            </span>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-dim transition-all duration-250 group-hover:translate-x-0.5 group-hover:text-neon"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5H5.5A1.5 1.5 0 0 0 4 6.5v12A1.5 1.5 0 0 0 5.5 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
              <path d="M13.5 4H20v6.5" />
              <path d="M20 4l-8.5 8.5" />
            </svg>
          </a>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pie                                                                */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-900/50 backdrop-blur-sm">
      <p
        aria-hidden="true"
        className="text-ghost pointer-events-none absolute inset-x-0 -top-6 select-none text-center font-display text-[22vw] font-bold uppercase leading-none opacity-70 sm:-top-10"
      >
        BE.Pilot
      </p>

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pt-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neon/35 bg-neon/10 text-neon shadow-[0_0_24px_rgba(255,46,77,0.35)]">
                <LogoMark className="h-5.5 w-5.5" />
              </span>
              <span className="font-display text-3xl font-bold uppercase tracking-widest text-fog sm:text-4xl">
                BE<span className="neon-text">.Pilot</span>
              </span>
            </p>
            <p className="mt-5 max-w-md font-mono text-[12px] leading-relaxed text-dim">
              repo central → workflows + scripts + skills + secrets.
              <br />
              automatización con <span className="text-neon">gh</span>,{" "}
              <span className="text-rose">pwsh</span>, <span className="text-ember">node</span> y{" "}
              <span className="text-amber">playwright</span>.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="flex items-center gap-2 font-mono text-[12px] text-mint">
              <IconCheck className="h-3.5 w-3.5" />
              exit 0 — montaje completo
            </p>
            <div className="glass rounded-xl px-4 py-3">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-dim">
                una collab de
              </p>
              <p className="mt-1.5 flex items-center gap-2.5 font-display text-[13px] font-bold uppercase tracking-widest">
                <span className="text-neon">Noicore Lab</span>
                <span className="text-dim">×</span>
                <span className="text-rose">Belentani</span>
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Pie">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="u-slide font-mono text-[11px] lowercase text-dim hover:text-fog"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line-soft pt-6 font-mono text-[10.5px] text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            <span className="text-neon">$</span> echo "hecho para ejecutarse, no para leerse"
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <IconRepo className="h-3.5 w-3.5" /> actions
            </span>
            <span className="flex items-center gap-1.5">
              <IconBranch className="h-3.5 w-3.5" /> codespaces
            </span>
            <span className="flex items-center gap-1.5">
              <IconBrowser className="h-3.5 w-3.5" /> playwright
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <IconLayers className="h-3.5 w-3.5" /> dev containers
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* fondo por capas */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="layer-glow absolute inset-0" />
        <div className="layer-grid absolute inset-0" />
        <div className="layer-noise absolute inset-0" />
      </div>

      <div className="relative z-10">
        <Header />

        <main>
          <Opener />
          <Ticker />

          {/* estructura */}
          <section id="estructura" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                kicker="MÓD 01 // estructura"
                title={["Lo que genera", "el bootstrap"]}
                desc="Diez archivos, todos auditables en el repo. Haz clic en cualquiera para ver su contenido real: workflow, dev container, scripts y skills."
              />
              <Reveal delay={150} className="hidden lg:block">
                <p className="max-w-[220px] border-l-2 border-neon/60 pl-4 font-mono text-[11.5px] leading-relaxed text-dim">
                  la misma estructura sirve en Actions, en Codespaces y en local
                </p>
              </Reveal>
            </div>
            <RepoExplorer />
            <Pipeline />
          </section>

          {/* guía */}
          <section id="guia" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-12">
              <SectionHead
                kicker="MÓD 02 // guía de montaje"
                title={["Ocho pasos.", "Cero magia."]}
                desc="Del repo vacío al control operativo: crea, pega, lanza, abre, autentica, activa, extiende — y entiende la única limitación real."
              />
            </div>
            <Steps />
          </section>

          {/* skills */}
          <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                kicker="MÓD 03 // skills"
                title={["Scripts que un agente", "puede invocar"]}
                desc="Cada skill es un script PowerShell sobre gh, node y Playwright. Elige una y observa su salida tal y como la verías en el runner."
              />
              <Reveal delay={150} className="hidden lg:block">
                <p className="max-w-[220px] border-l-2 border-neon/60 pl-4 font-mono text-[11.5px] leading-relaxed text-dim">
                  sin plugins mágicos: scripts auditables, ejecutables en cualquier parte
                </p>
              </Reveal>
            </div>
            <SkillRunner />
          </section>

          <WarningsBand />

          {/* runners */}
          <section id="runners" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-10">
              <SectionHead
                kicker="MÓD 04 // dónde se ejecuta"
                title={["¿Actions, Codespaces", "o self-hosted?"]}
                desc="Tres superficies de ejecución reales para el mismo montaje. Elige según lo que necesites: periodicidad, interactividad o disponibilidad continua."
              />
            </div>
            <RunnerSelector />
          </section>

          {/* fuentes */}
          <section id="fuentes" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-10">
              <SectionHead
                kicker="MÓD 05 // fuentes"
                title={["Todo sale de la", "documentación oficial"]}
                desc="Cada pieza del montaje está documentada por GitHub, Microsoft, Dev Containers o Playwright. Estas son las referencias usadas."
              />
            </div>
            <Sources />
            <Reveal delay={120}>
              <div className="glass mt-8 flex items-start gap-4 rounded-xl p-5">
                <CopyBtn text={SOURCES.map((s) => s.url).join("\n")} idle="copiar URLs" done="copiadas ✓" />
                <p className="font-mono text-[11.5px] leading-relaxed text-dim">
                  puedes copiar todas las URLs de una vez y añadirlas al README del repo como
                  sección de referencias.
                </p>
              </div>
            </Reveal>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

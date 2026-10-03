import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";

/* ------------------------------------------------------------------ */
/*  Hooks y utilidades                                                 */
/* ------------------------------------------------------------------ */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string[];
  desc?: string;
}) {
  return (
    <Reveal>
      <div className="max-w-3xl">
        <p className="flex items-center gap-3 font-mono text-[11.5px] uppercase tracking-[0.25em] text-neon">
          <span className="inline-block h-px w-10 bg-neon/70" aria-hidden="true" />
          {kicker}
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.06] tracking-tight text-fog sm:text-4xl xl:text-5xl">
          {title.map((line, i) => (
            <span key={i} className="mask-line is-in">
              <span style={{ transitionDelay: `${i * 110}ms` }}>{line}</span>
            </span>
          ))}
        </h2>
        {desc && <p className="mt-5 text-[15.5px] leading-relaxed text-mist">{desc}</p>}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Copiado                                                            */
/* ------------------------------------------------------------------ */

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

export function CopyBtn({
  text,
  className = "",
  idle = "copiar",
  done = "copiado ✓",
}: {
  text: string;
  className?: string;
  idle?: string;
  done?: string;
}) {
  const [ok, setOk] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      onClick={async () => {
        await copyText(text);
        setOk(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setOk(false), 1800);
      }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] transition-all duration-200 ${
        ok
          ? "border-mint/40 bg-mint/10 text-mint"
          : "border-line bg-ink-800/60 text-mist hover:border-neon/40 hover:text-fog"
      } ${className}`}
      aria-label={idle}
    >
      {ok ? <IconCheck className="h-3 w-3" /> : <IconCopy className="h-3 w-3" />}
      {ok ? done : idle}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Bloque de código con numeración                                    */
/* ------------------------------------------------------------------ */

export function CodeBlock({
  filename,
  code,
  lang,
  tall = false,
}: {
  filename: string;
  code: string;
  lang: string;
  tall?: boolean;
}) {
  const lines = code.split("\n");
  return (
    <div className="glass relative overflow-hidden rounded-xl">
      <div className="flex items-center gap-3 border-b border-line-soft bg-ink-900/70 px-4 py-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-neon shadow-[0_0_8px_rgba(255,46,77,0.9)]" />
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-mist">{filename}</span>
        <span className="hidden rounded border border-line bg-ink-800/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-dim sm:inline">
          {lang}
        </span>
        <CopyBtn text={code} />
      </div>
      <pre
        className={`code-scroll overflow-auto p-4 font-mono text-[12.5px] leading-[1.65] text-[#e8d9de] ${
          tall ? "max-h-[520px]" : "max-h-[380px]"
        }`}
      >
        <code>
          {lines.map((l, i) => (
            <div key={i} className="flex">
              <span className="w-8 shrink-0 select-none border-r border-line-soft pr-3 text-right text-[11px] leading-[1.85] text-dim/70">
                {i + 1}
              </span>
              <span className="whitespace-pre pl-3">{l || " "}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Esquinas HUD                                                       */
/* ------------------------------------------------------------------ */

export function HudCorners() {
  return (
    <span aria-hidden="true">
      <i className="hud-corner hud-tl" />
      <i className="hud-corner hud-tr" />
      <i className="hud-corner hud-bl" />
      <i className="hud-corner hud-br" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Iconografía propia (SVG inline, trazo 1.8)                         */
/* ------------------------------------------------------------------ */

type IconProps = SVGProps<SVGSVGElement> & { style?: CSSProperties };

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const LogoMark = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 2.2 20.4 7v10L12 21.8 3.6 17V7z" />
    <path d="M12 7.4 15.6 15H8.4z" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCopy = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </svg>
);

export const IconCheck = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);

export const IconRefresh = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8" />
    <path d="M20 3.5V8h-4.5" />
  </svg>
);

export const IconFolder = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4.2l1.8 2.2H19a1.5 1.5 0 0 1 1.5 1.5V17A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17z" />
  </svg>
);

export const IconFolderOpen = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4.2l1.8 2.2H18a1.5 1.5 0 0 1 1.5 1.5V10" />
    <path d="M3.5 17V9.5h17.9l-2 6.2a1.5 1.5 0 0 1-1.4 1.3H5a1.5 1.5 0 0 1-1.5-1.5z" />
  </svg>
);

export const IconFile = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 3.5h7.5L18 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19V5A1.5 1.5 0 0 1 6.5 3.5z" />
    <path d="M13.5 3.5V8H18" />
  </svg>
);

export const IconChevron = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M8.5 5.5 15 12l-6.5 6.5" />
  </svg>
);

export const IconPlay = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M7.5 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconWarn = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 3.5 22 20H2z" />
    <path d="M12 9.5v5" />
    <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconBolt = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" />
  </svg>
);

export const IconServer = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3.5" y="4" width="17" height="6.5" rx="1.5" />
    <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5" />
    <circle cx="7" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="7" cy="16.7" r="0.9" fill="currentColor" stroke="none" />
    <path d="M11 7.2h6M11 16.7h6" />
  </svg>
);

export const IconTerminal = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M7 9.5l3.5 3L7 15.5" />
    <path d="M12.5 15.5H17" />
  </svg>
);

export const IconClock = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.2l3.4 2" />
  </svg>
);

export const IconKey = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="8" cy="14.5" r="4" />
    <path d="M11 11.5 20 3M16.5 6.5l2.5 2.5M14 9l2 2" />
  </svg>
);

export const IconScope = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5V6M12 18v3.5M2.5 12H6M18 12h3.5" />
  </svg>
);

export const IconExt = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M9 5H5.5A1.5 1.5 0 0 0 4 6.5v12A1.5 1.5 0 0 0 5.5 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
    <path d="M13.5 4H20v6.5" />
    <path d="M20 4l-8.5 8.5" />
  </svg>
);

export const IconBranch = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="6" cy="5.5" r="2.2" />
    <circle cx="6" cy="18.5" r="2.2" />
    <circle cx="18" cy="8" r="2.2" />
    <path d="M6 7.7v8.6" />
    <path d="M6 12c6 0 8-1.5 9.8-4" />
  </svg>
);

export const IconBrowser = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M3 9h18" />
    <circle cx="5.8" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="8.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

export const IconRepo = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 3.5h12.5A1.5 1.5 0 0 1 19 5v15.5H6.5A1.5 1.5 0 0 1 5 19z" />
    <path d="M5 17.5a1.5 1.5 0 0 0 1.5 1.5H19" />
    <path d="M9 7.5h6M9 10.5h4" />
  </svg>
);

export const IconLayers = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 3.5 21 8l-9 4.5L3 8z" />
    <path d="M3 12.5l9 4.5 9-4.5" />
    <path d="M3 16.5 12 21l9-4.5" />
  </svg>
);

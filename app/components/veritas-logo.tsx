import Link from "next/link";

type VeritasLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const sizes = {
  sm: { box: "h-8 w-8", text: "text-base", icon: 18 },
  md: { box: "h-10 w-10", text: "text-lg", icon: 22 },
  lg: { box: "h-12 w-12", text: "text-xl", icon: 26 },
};

export function VeritasLogo({ href = "/", size = "md", showWordmark = true, className = "" }: VeritasLogoProps) {
  const s = sizes[size];

  const mark = (
    <span className={`relative flex ${s.box} shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-lg shadow-cyan-500/30 ring-1 ring-white/20`}>
      <svg viewBox="0 0 32 32" width={s.icon} height={s.icon} aria-hidden className="relative z-10">
        <path
          d="M8 7h4.2l3.8 12.2L19.8 7H24l-5.6 18h-4.8L8 7z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M22.5 20.5l2.2 2.2 4.3-4.8"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
    </span>
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 ${className}`}>
      {mark}
      {showWordmark ? <span className={`${s.text} font-bold tracking-tight`}>Veritas</span> : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

/** Compact mark-only for admin top-right */
export function VeritasMark({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-md shadow-cyan-500/25 ring-1 ring-white/25 ${className}`}>
      <svg viewBox="0 0 32 32" width={20} height={20} aria-hidden>
        <path d="M8 7h4.2l3.8 12.2L19.8 7H24l-5.6 18h-4.8L8 7z" fill="white" fillOpacity="0.95" />
        <path d="M22.5 20.5l2.2 2.2 4.3-4.8" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

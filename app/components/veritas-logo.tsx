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

/** Creative mark: open manuscript + flowing verification path inside a soft seal */
function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden
      className="relative z-10"
    >
      <defs>
        <linearGradient id="veritasInk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="veritasAccent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Soft outer seal ring */}
      <circle
        cx="20"
        cy="20"
        r="17.5"
        fill="none"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
      <circle
        cx="20"
        cy="20"
        r="15.2"
        fill="none"
        stroke="white"
        strokeOpacity="0.12"
        strokeWidth="0.8"
        strokeDasharray="2.5 2"
      />

      {/* Open manuscript — left page */}
      <path
        d="M11 12.5c0-0.8 0.6-1.5 1.4-1.5h6.2c0.4 0 0.7 0.15 0.95 0.4L20 12.5v15.2l-0.45 0.35c-0.25 0.2-0.55 0.3-0.9 0.3H12.4c-0.8 0-1.4-0.7-1.4-1.5V12.5z"
        fill="url(#veritasInk)"
        fillOpacity="0.88"
      />
      {/* Open manuscript — right page */}
      <path
        d="M20 12.5l0.45-1.1c0.25-0.25 0.55-0.4 0.95-0.4h6.2c0.8 0 1.4 0.7 1.4 1.5v14.35c0 0.8-0.6 1.5-1.4 1.5h-6.25c-0.35 0-0.65-0.1-0.9-0.3L20 27.7V12.5z"
        fill="url(#veritasInk)"
        fillOpacity="0.72"
      />

      {/* Spine / center fold */}
      <path
        d="M20 11.8v16.2"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Subtle ruled lines on left page (writing) */}
      <path
        d="M13.2 16.2h5.2M13.2 18.8h4.6M13.2 21.4h5M13.2 24h3.8"
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* Flowing verification path — the "truth stroke" across the seal */}
      <path
        d="M14.5 22.8c1.8-0.4 3.2-1.8 4.2-3.6 0.9 1.6 2.4 3.2 4.6 4.4 1.4 0.75 3.1 1.1 4.8 0.85"
        fill="none"
        stroke="url(#veritasAccent)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Small authenticity spark near the end of the path */}
      <circle cx="28.2" cy="24.2" r="1.35" fill="#fef08a" fillOpacity="0.95" />
      <circle cx="28.2" cy="24.2" r="2.4" fill="none" stroke="#fef08a" strokeOpacity="0.35" strokeWidth="0.7" />
    </svg>
  );
}

export function VeritasLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  className = "",
}: VeritasLogoProps) {
  const s = sizes[size];

  const mark = (
    <span
      className={`relative flex ${s.box} shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-lg shadow-cyan-500/30 ring-1 ring-white/25`}
    >
      <LogoMark size={s.icon} />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
      <span className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 rounded-full bg-white/15 blur-md" />
    </span>
  );

  const content = (
    <span
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 ${className}`}
    >
      {mark}
      {showWordmark ? (
        <span className={`${s.text} font-bold tracking-[-0.02em]`}>
          Veritas
          <span className="ml-0.5 text-cyan-600/80">.</span>
        </span>
      ) : null}
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

/** Compact mark-only for admin / tight UI */
export function VeritasMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-md shadow-cyan-500/25 ring-1 ring-white/25 ${className}`}
    >
      <LogoMark size={20} />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
    </span>
  );
}

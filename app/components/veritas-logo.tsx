import Link from "next/link";

type VeritasLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: { box: "h-8 w-8", text: "text-base", icon: 32, tag: "text-[8px]" },
  md: { box: "h-10 w-10", text: "text-lg", icon: 40, tag: "text-[9px]" },
  lg: { box: "h-14 w-14", text: "text-2xl", icon: 56, tag: "text-[10px]" },
};

/**
 * Signature mark: shield of trust with a geometric V that resolves into a
 * verification check — inspired by the teal security / authenticity crest.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const uid = `v${size}`;
  return (
    <svg
      viewBox="0 0 64 72"
      width={size}
      height={size * (72 / 64)}
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id={`${uid}-shield`} x1="18%" y1="8%" x2="82%" y2="92%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="35%" stopColor="#14b8a6" />
          <stop offset="70%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id={`${uid}-face`} x1="30%" y1="15%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="45%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id={`${uid}-v`} x1="20%" y1="20%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#ecfeff" />
          <stop offset="40%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id={`${uid}-check`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#0f766e" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer shield outline */}
      <path
        d="M32 4c10 4 22 6 26 8v22c0 16-10 28-26 34C16 62 6 50 6 34V12c4-2 16-4 26-8z"
        fill={`url(#${uid}-shield)`}
        filter={`url(#${uid}-glow)`}
      />

      {/* Inner shield face */}
      <path
        d="M32 9c8.5 3.2 18.5 5 22 6.5V33c0 13.5-8.5 23.5-22 28.5C18.5 56.5 10 46.5 10 33V15.5C13.5 14 23.5 12.2 32 9z"
        fill={`url(#${uid}-face)`}
        opacity="0.92"
      />

      {/* Soft highlight on left edge */}
      <path
        d="M14 18c2-4 10-7 18-9 0 0-8 3-14 10-3 4-4 10-3 16 1-7 2-13-1-17z"
        fill="#ffffff"
        opacity="0.22"
      />

      {/* Geometric V (facet) */}
      <path
        d="M20 22l6.5 2.2 5.5 14.5 5.5-14.5L44 22l-9.5 26h-5L20 22z"
        fill={`url(#${uid}-v)`}
        opacity="0.95"
      />
      {/* V center facet shadow for depth */}
      <path d="M32 24.5l4.2 11.2-4.2 11.8-4.2-11.8L32 24.5z" fill="#0e7490" opacity="0.28" />

      {/* Verification check sweeping across the shield */}
      <path
        d="M15 36.5c4.5 1.5 8.5 5.5 11 10 6.5-11 14-16.5 24-18.5"
        fill="none"
        stroke={`url(#${uid}-check)`}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 36.5c4.5 1.5 8.5 5.5 11 10 6.5-11 14-16.5 24-18.5"
        fill="none"
        stroke="#ecfeff"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function VeritasLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  showTagline = false,
  className = "",
}: VeritasLogoProps) {
  const s = sizes[size];

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`relative flex ${s.box} shrink-0 items-center justify-center`}>
        <LogoMark size={s.icon} />
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={`${s.text} font-black tracking-[0.06em] text-slate-900`}
            style={{ letterSpacing: "0.08em" }}
          >
            VERITAS
          </span>
          {showTagline ? (
            <span
              className={`${s.tag} mt-1 font-semibold uppercase tracking-[0.22em] text-slate-500`}
            >
              Secure · Authentic · Verified
            </span>
          ) : null}
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
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <LogoMark size={36} />
    </span>
  );
}

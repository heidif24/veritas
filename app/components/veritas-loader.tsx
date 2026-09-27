"use client";

import { useId } from "react";

type VeritasLoaderProps = {
  fullScreen?: boolean;
  label?: string;
  className?: string;
  /** Compact mark for inline save states */
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { w: 48, h: 54 },
  md: { w: 72, h: 81 },
  lg: { w: 96, h: 108 },
};

/**
 * Signature animation: shield fades/scales in at center, then the verification
 * check draws itself across the crest like a seal being signed.
 */
export function VeritasLoader({
  fullScreen = true,
  label = "Verifying",
  className = "",
  size = "lg",
}: VeritasLoaderProps) {
  const uid = useId().replace(/:/g, "");
  const dim = sizeMap[size];

  const mark = (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-2xl" />

        <svg
          viewBox="0 0 64 72"
          width={dim.w}
          height={dim.h}
          aria-hidden
          className="relative drop-shadow-lg"
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
          </defs>

          <g className="veritas-shield-enter">
            <path
              d="M32 4c10 4 22 6 26 8v22c0 16-10 28-26 34C16 62 6 50 6 34V12c4-2 16-4 26-8z"
              fill={`url(#${uid}-shield)`}
            />
            <path
              d="M32 9c8.5 3.2 18.5 5 22 6.5V33c0 13.5-8.5 23.5-22 28.5C18.5 56.5 10 46.5 10 33V15.5C13.5 14 23.5 12.2 32 9z"
              fill={`url(#${uid}-face)`}
              opacity="0.92"
            />
            <path
              d="M14 18c2-4 10-7 18-9 0 0-8 3-14 10-3 4-4 10-3 16 1-7 2-13-1-17z"
              fill="#ffffff"
              opacity="0.22"
            />
            <path
              d="M20 22l6.5 2.2 5.5 14.5 5.5-14.5L44 22l-9.5 26h-5L20 22z"
              fill={`url(#${uid}-v)`}
              opacity="0.95"
            />
            <path d="M32 24.5l4.2 11.2-4.2 11.8-4.2-11.8L32 24.5z" fill="#0e7490" opacity="0.28" />
          </g>

          <path
            className="veritas-check-draw"
            d="M15 36.5c4.5 1.5 8.5 5.5 11 10 6.5-11 14-16.5 24-18.5"
            fill="none"
            stroke={`url(#${uid}-check)`}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="veritas-check-draw"
            d="M15 36.5c4.5 1.5 8.5 5.5 11 10 6.5-11 14-16.5 24-18.5"
            fill="none"
            stroke="#ecfeff"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </div>

      {fullScreen || label ? (
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-800">{label}</p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Secure · Authentic · Verified
          </p>
        </div>
      ) : null}
    </div>
  );

  if (!fullScreen) return mark;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/92 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {mark}
    </div>
  );
}

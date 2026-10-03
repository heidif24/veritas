"use client";

import { useEffect, useState } from "react";

export type SealSpinnerState = "verifying" | "success";

export type CryptographicSealSpinnerProps = {
  /** verifying = continuous spin + telemetry labels; success = locked ring + hash badge */
  state?: SealSpinnerState;
  /** Short hash shown in success state, e.g. sha256:a3f8...c91e */
  hashPreview?: string;
  /** Cycle these labels while verifying */
  steps?: string[];
  /** Interval between step labels (ms) */
  stepIntervalMs?: number;
  /** Visual size */
  size?: "sm" | "md" | "lg";
  /** Optional class on outer wrapper */
  className?: string;
  /** Hide the status text under the seal */
  hideLabel?: boolean;
};

const DEFAULT_STEPS = [
  "Checking Ed25519 signature…",
  "Validating SHA-256 hash…",
  "Replaying process trail…",
  "Binding content digest…",
  "Process trail verified",
];

const SIZE = {
  sm: { box: "h-28 w-28", ring: 112, stroke: 3, icon: "h-7 w-7", label: "text-[11px]" },
  md: { box: "h-40 w-40", ring: 160, stroke: 3.5, icon: "h-9 w-9", label: "text-xs" },
  lg: { box: "h-52 w-52", ring: 208, stroke: 4, icon: "h-11 w-11", label: "text-sm" },
} as const;

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Living trust indicator for Veritas seals.
 *
 * @example
 * // Hero / marketing (demo success)
 * <CryptographicSealSpinner state="success" hashPreview="sha256:a3f8…c91e" />
 *
 * // Verify page while checking
 * <CryptographicSealSpinner state="verifying" />
 *
 * // After verify API returns
 * <CryptographicSealSpinner state="success" hashPreview={`sha256:${hash.slice(0,4)}…${hash.slice(-4)}`} />
 */
export function CryptographicSealSpinner({
  state = "verifying",
  hashPreview = "sha256:a3f8…c91e",
  steps = DEFAULT_STEPS,
  stepIntervalMs = 1800,
  size = "md",
  className = "",
  hideLabel = false,
}: CryptographicSealSpinnerProps) {
  const s = SIZE[size];
  const [stepIndex, setStepIndex] = useState(0);
  const isSuccess = state === "success";

  useEffect(() => {
    if (isSuccess || steps.length === 0) return;
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, stepIntervalMs);
    return () => window.clearInterval(id);
  }, [isSuccess, steps, stepIntervalMs]);

  const r = s.ring / 2 - s.stroke;
  const c = 2 * Math.PI * r;
  // Arc segment for the glowing head of the spin
  const arc = c * 0.28;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Frosted glass container */}
      <div
        className={`relative flex ${s.box} items-center justify-center rounded-full border border-slate-800/90 bg-slate-900/80 shadow-[0_0_40px_-8px_rgba(16,185,129,0.45),0_0_80px_-20px_rgba(16,185,129,0.25)] backdrop-blur-md`}
      >
        {/* Soft outer halo */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-full ${
            isSuccess ? "bg-emerald-500/10" : "bg-emerald-500/5"
          }`}
        />

        {/* SVG ring */}
        <svg
          width={s.ring}
          height={s.ring}
          viewBox={`0 0 ${s.ring} ${s.ring}`}
          className="absolute inset-0 m-auto"
          aria-hidden
        >
          {/* Track */}
          <circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={r}
            fill="none"
            stroke="rgb(30 41 59)"
            strokeWidth={s.stroke}
          />
          {/* Glowing arc — spins while verifying; full ring when success */}
          <circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={r}
            fill="none"
            stroke="url(#seal-arc-grad)"
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={isSuccess ? `${c} 0` : `${arc} ${c - arc}`}
            className={isSuccess ? "transition-[stroke-dasharray] duration-700" : "origin-center animate-spin"}
            style={
              isSuccess
                ? { transformOrigin: "center" }
                : { transformOrigin: "center", animationDuration: "1.35s" }
            }
          />
          <defs>
            <linearGradient id="seal-arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="1" />
              <stop offset="55%" stopColor="rgb(52 211 153)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center icon */}
        <div
          className={`relative z-10 flex items-center justify-center rounded-full text-emerald-400 ${
            isSuccess
              ? "shadow-[0_0_24px_rgba(52,211,153,0.55)]"
              : "animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.35)]"
          }`}
        >
          {isSuccess ? (
            <CheckIcon className={`${s.icon} text-emerald-400`} />
          ) : (
            <ShieldIcon className={`${s.icon} text-emerald-400/90`} />
          )}
        </div>
      </div>

      {/* Status label */}
      {!hideLabel ? (
        <div className={`min-h-[2.5rem] text-center ${s.label}`}>
          {isSuccess ? (
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-medium text-emerald-400">Integrity verified</span>
              <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-300/90">
                {hashPreview}
              </span>
            </div>
          ) : (
            <p className="font-mono text-zinc-400 transition-opacity duration-300">
              {steps[stepIndex] ?? "Verifying…"}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default CryptographicSealSpinner;

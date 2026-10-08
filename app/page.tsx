"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale } from "./components/locale-provider";

/** Fade/slide in when the element enters the viewport. */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SLIDES — three colourful full-scene illustrations
   ═══════════════════════════════════════════════════════════ */

/** Slide 1 — Academic integrity: shield, scan, campus energy */
function HeroIntegrity() {
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="h1bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="40%" stopColor="#0c2a3a" />
          <stop offset="100%" stopColor="#061018" />
        </linearGradient>
        <radialGradient id="h1glow" cx="55%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h1shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#h1bg)" />
      <ellipse cx="360" cy="160" rx="220" ry="160" fill="url(#h1glow)" />
      {/* floating orbs */}
      <circle cx="80" cy="80" r="40" fill="#06b6d4" opacity="0.15" />
      <circle cx="560" cy="320" r="60" fill="#8b5cf6" opacity="0.12" />
      <circle cx="100" cy="300" r="25" fill="#34d399" opacity="0.2" />
      {/* abstract campus columns */}
      <rect x="40" y="200" width="18" height="120" rx="3" fill="#1e3a5f" opacity="0.7" />
      <rect x="70" y="170" width="18" height="150" rx="3" fill="#1e3a5f" opacity="0.5" />
      <rect x="100" y="210" width="18" height="110" rx="3" fill="#1e3a5f" opacity="0.6" />
      {/* main shield */}
      <path
        d="M320 60 L420 95 V195 C420 270 360 310 320 330 C280 310 220 270 220 195 V95 Z"
        fill="#0c1929"
        stroke="url(#h1shield)"
        strokeWidth="3"
      />
      <path
        d="M320 85 L395 112 V190 C395 250 350 285 320 300 C290 285 245 250 245 190 V112 Z"
        fill="#0a1628"
        stroke="#22d3ee"
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* scan beam */}
      <rect x="250" y="175" width="140" height="8" rx="2" fill="#22d3ee" opacity="0.45">
        <animate attributeName="y" values="130;220;130" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.55;0.2" dur="3.5s" repeatCount="indefinite" />
      </rect>
      {/* checkmark */}
      <path d="M285 195 L310 220 L365 155" fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      {/* signal bars */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={480 + i * 22} y={280 - i * 18} width="14" height={40 + i * 18} rx="3" fill="#22d3ee" opacity={0.25 + i * 0.15} />
      ))}
      {/* label chip */}
      <rect x="250" y="350" width="140" height="28" rx="14" fill="#0c1929" stroke="#22d3ee" strokeWidth="1" />
      <text x="320" y="368" textAnchor="middle" fill="#67e8f9" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600">
        INTEGRITY
      </text>
    </svg>
  );
}

/** Slide 2 — Prove authorship: composition trail, pen, timeline */
function HeroAuthorship() {
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="h2bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#071a12" />
          <stop offset="50%" stopColor="#0a2e1c" />
          <stop offset="100%" stopColor="#06140e" />
        </linearGradient>
        <radialGradient id="h2glow" cx="40%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h2trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#h2bg)" />
      <ellipse cx="280" cy="200" rx="240" ry="180" fill="url(#h2glow)" />
      <circle cx="520" cy="80" r="50" fill="#fbbf24" opacity="0.1" />
      <circle cx="80" cy="340" r="35" fill="#a78bfa" opacity="0.12" />
      {/* layered manuscripts */}
      <g transform="translate(80, 80)">
        <rect x="20" y="20" width="160" height="200" rx="10" fill="#0d1f18" stroke="#1a3d2e" strokeWidth="2" opacity="0.5" />
        <rect x="10" y="10" width="160" height="200" rx="10" fill="#0d1f18" stroke="#1a3d2e" strokeWidth="2" opacity="0.75" />
        <rect x="0" y="0" width="160" height="200" rx="10" fill="#0f2419" stroke="#34d399" strokeWidth="2" />
        <rect x="16" y="24" width="110" height="8" rx="2" fill="#34d399" opacity="0.45" />
        {[48, 64, 80, 96, 112, 128, 144].map((y, i) => (
          <rect key={y} x="16" y={y} width={90 - (i % 3) * 15} height="5" rx="1.5" fill="#2a4a3a" />
        ))}
        {/* pen stroke */}
        <path d="M30 170 C50 160 70 185 95 175 S130 165 145 180" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
      </g>
      {/* living timeline */}
      <line x1="320" y1="60" x2="320" y2="340" stroke="url(#h2trail)" strokeWidth="3" />
      {[80, 140, 200, 260, 320].map((y, i) => (
        <g key={y}>
          <circle cx="320" cy={y} r="12" fill="#0a1f16" stroke="#34d399" strokeWidth="2.5" />
          <circle cx="320" cy={y} r="5" fill="#34d399" opacity={0.5 + i * 0.1}>
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <rect x="350" y={y - 12} width={70 + i * 12} height="24" rx="8" fill="#0f2419" stroke="#234032" strokeWidth="1.5" />
          <rect x="360" y={y - 4} width={40 + i * 8} height="8" rx="2" fill="#34d399" opacity={0.25 + i * 0.1} />
        </g>
      ))}
      {/* authorship badge */}
      <rect x="230" y="350" width="180" height="28" rx="14" fill="#0a1f16" stroke="#34d399" strokeWidth="1" />
      <text x="320" y="368" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600">
        AUTHORSHIP TRAIL
      </text>
    </svg>
  );
}

/** Slide 3 — Cryptographic seal: gold seal, hash, verified package */
function HeroSeal() {
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="h3bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1208" />
          <stop offset="45%" stopColor="#2a1c0a" />
          <stop offset="100%" stopColor="#0f0c06" />
        </linearGradient>
        <radialGradient id="h3glow" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#C5A34B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#C5A34B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h3gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#C5A34B" />
          <stop offset="100%" stopColor="#92640a" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#h3bg)" />
      <ellipse cx="320" cy="180" rx="200" ry="150" fill="url(#h3glow)" />
      <circle cx="100" cy="100" r="45" fill="#f59e0b" opacity="0.08" />
      <circle cx="540" cy="300" r="55" fill="#34d399" opacity="0.1" />
      {/* outer rings */}
      <circle cx="320" cy="175" r="110" fill="none" stroke="#C5A34B" strokeWidth="2" opacity="0.35" />
      <circle cx="320" cy="175" r="95" fill="none" stroke="#C5A34B" strokeWidth="1" opacity="0.25" strokeDasharray="6 8">
        <animateTransform attributeName="transform" type="rotate" from="0 320 175" to="360 320 175" dur="40s" repeatCount="indefinite" />
      </circle>
      {/* hex seal */}
      <polygon
        points="320,85 385,120 385,190 320,225 255,190 255,120"
        fill="#1a1408"
        stroke="url(#h3gold)"
        strokeWidth="3"
      />
      <polygon
        points="320,105 365,130 365,180 320,205 275,180 275,130"
        fill="#12100a"
        stroke="#C5A34B"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <text x="320" y="160" textAnchor="middle" fill="#fde68a" fontSize="16" fontFamily="ui-monospace, monospace" fontWeight="700">
        SEALED
      </text>
      <text x="320" y="180" textAnchor="middle" fill="#C5A34B" fontSize="10" fontFamily="ui-monospace, monospace">
        Ed25519 · SHA-256
      </text>
      {/* check in seal */}
      <path d="M300 195 L312 207 L342 175" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* hash ribbons */}
      <rect x="60" y="300" width="130" height="26" rx="8" fill="#1a1408" stroke="#3d3420" />
      <text x="125" y="317" textAnchor="middle" fill="#C5A34B" fontSize="11" fontFamily="ui-monospace, monospace">sha256:a3f8c91e</text>
      <rect x="450" y="300" width="130" height="26" rx="8" fill="#1a1408" stroke="#3d3420" />
      <text x="515" y="317" textAnchor="middle" fill="#C5A34B" fontSize="11" fontFamily="ui-monospace, monospace">sig:valid ✓</text>
      {/* package corners */}
      <path d="M40 40 H80 V50 H40 Z" fill="#C5A34B" opacity="0.3" />
      <path d="M560 40 H600 V50 H560 Z" fill="#C5A34B" opacity="0.3" />
      <path d="M40 350 H80 V360 H40 Z" fill="#C5A34B" opacity="0.3" />
      <path d="M560 350 H600 V360 H560 Z" fill="#C5A34B" opacity="0.3" />
      <rect x="250" y="350" width="140" height="28" rx="14" fill="#1a1408" stroke="#C5A34B" strokeWidth="1" />
      <text x="320" y="368" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600">
        VERIFIED
      </text>
    </svg>
  );
}

const HERO_SLIDES = [
  {
    id: "integrity",
    Scene: HeroIntegrity,
    accent: "from-cyan-500/20 via-transparent to-transparent",
    label: "Academic integrity",
  },
  {
    id: "authorship",
    Scene: HeroAuthorship,
    accent: "from-emerald-500/20 via-transparent to-transparent",
    label: "Prove authorship",
  },
  {
    id: "seal",
    Scene: HeroSeal,
    accent: "from-amber-500/20 via-transparent to-transparent",
    label: "Seal & verify",
  },
] as const;

function HeroCarousel() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 5500);
    return () => clearInterval(id);
  }, [paused, go]);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Slides */}
      <div className="relative h-[min(72vh,560px)] w-full sm:h-[min(78vh,620px)]">
        {HERO_SLIDES.map((slide, i) => {
          const active = i === index;
          const Scene = slide.Scene;
          return (
            <div
              key={slide.id}
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "scale(1)" : "scale(1.04)",
                pointerEvents: active ? "auto" : "none",
              }}
              aria-hidden={!active}
            >
              <Scene />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/50 to-transparent" />
            </div>
          );
        })}

        {/* Copy overlay */}
        <div className="absolute inset-0 z-10 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-24 sm:pb-20">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {t("home.badge")}
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                {t("home.hero")}
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-200 sm:text-lg">{t("home.sub")}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950 shadow-lg transition hover:bg-zinc-100"
                >
                  {t("nav.getstarted")} →
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-black/30 px-6 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/45"
                >
                  {t("home.cta.verify")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-4 px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className="group flex flex-col items-center gap-1"
                aria-label={s.label}
                aria-current={i === index}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-white" : "w-1.5 bg-white/40 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        {/* Slide label */}
        <div className="absolute right-6 top-6 z-20 hidden sm:block">
          <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] text-zinc-300 backdrop-blur-md">
            {String(index + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")} · {HERO_SLIDES[index].label}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Card scenes (kept unique) ── */

function SceneProcess() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f3d2e" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
        <linearGradient id="pline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#pg)" />
      <rect x="48" y="36" width="120" height="140" rx="8" fill="#0d1117" stroke="#1f2a24" strokeWidth="1.5" />
      <rect x="56" y="48" width="88" height="6" rx="2" fill="#167451" opacity="0.5" />
      <rect x="56" y="62" width="72" height="4" rx="1" fill="#3f4f47" />
      <rect x="56" y="72" width="80" height="4" rx="1" fill="#3f4f47" />
      <rect x="56" y="82" width="60" height="4" rx="1" fill="#3f4f47" />
      <rect x="56" y="100" width="88" height="4" rx="1" fill="#2a3a32" />
      <rect x="56" y="110" width="70" height="4" rx="1" fill="#2a3a32" />
      <line x1="210" y1="40" x2="210" y2="170" stroke="url(#pline)" strokeWidth="2" />
      {[50, 85, 120, 155].map((y, i) => (
        <g key={y}>
          <circle cx="210" cy={y} r="7" fill="#0d1117" stroke="#34d399" strokeWidth="2" />
          <circle cx="210" cy={y} r="3" fill="#34d399" opacity={0.4 + i * 0.2} />
          <rect x="226" y={y - 5} width={40 + i * 8} height="10" rx="3" fill="#1a2e24" stroke="#234032" />
        </g>
      ))}
      <path d="M90 130 C100 125 110 140 120 135 S140 125 150 140" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
    </svg>
  );
}

function SceneIntegrity() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1a28" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
        <radialGradient id="iglow" cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#ig)" />
      <ellipse cx="160" cy="95" rx="90" ry="70" fill="url(#iglow)" />
      <path d="M160 40 L210 58 V105 C210 140 180 160 160 170 C140 160 110 140 110 105 V58 Z" fill="#0d1520" stroke="#38bdf8" strokeWidth="2" />
      <line x1="125" y1="80" x2="195" y2="80" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      <line x1="125" y1="95" x2="195" y2="95" stroke="#38bdf8" strokeWidth="1.5" opacity="0.55" />
      <line x1="125" y1="110" x2="195" y2="110" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      <path d="M140 100 L154 114 L184 84" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="60" width="36" height="80" rx="6" fill="#0d1520" stroke="#1e3a4a" />
      <rect x="34" y="110" width="24" height="22" rx="2" fill="#38bdf8" opacity="0.35" />
      <rect x="34" y="90" width="24" height="16" rx="2" fill="#38bdf8" opacity="0.2" />
      <rect x="256" y="60" width="36" height="80" rx="6" fill="#0d1520" stroke="#1e3a4a" />
      <rect x="262" y="100" width="24" height="32" rx="2" fill="#34d399" opacity="0.3" />
    </svg>
  );
}

function SceneSeal() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1408" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
        <radialGradient id="sgold" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#C5A34B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C5A34B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#sg)" />
      <ellipse cx="160" cy="95" rx="100" ry="75" fill="url(#sgold)" />
      <circle cx="160" cy="100" r="62" fill="none" stroke="#C5A34B" strokeWidth="2" opacity="0.6" />
      <circle cx="160" cy="100" r="54" fill="none" stroke="#C5A34B" strokeWidth="1" opacity="0.3" strokeDasharray="4 6" />
      <polygon points="160,48 198,70 198,114 160,136 122,114 122,70" fill="#12100a" stroke="#C5A34B" strokeWidth="2" />
      <text x="160" y="98" textAnchor="middle" fill="#C5A34B" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600">SEAL</text>
      <text x="160" y="112" textAnchor="middle" fill="#8a7340" fontSize="8" fontFamily="ui-monospace, monospace">Ed25519</text>
      <rect x="24" y="160" width="70" height="16" rx="4" fill="#1a1508" stroke="#3d3420" />
      <text x="59" y="171" textAnchor="middle" fill="#8a7340" fontSize="8" fontFamily="ui-monospace, monospace">sha256:a3f8</text>
      <rect x="226" y="160" width="70" height="16" rx="4" fill="#1a1508" stroke="#3d3420" />
      <text x="261" y="171" textAnchor="middle" fill="#8a7340" fontSize="8" fontFamily="ui-monospace, monospace">…c91e</text>
    </svg>
  );
}

function SceneDraft() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161820" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#dg)" />
      <rect x="70" y="28" width="180" height="150" rx="6" fill="#0d1117" stroke="#2a3038" strokeWidth="1.5" />
      <line x1="160" y1="28" x2="160" y2="178" stroke="#1e242c" strokeWidth="1" />
      {[48, 62, 76, 90, 104, 118, 132].map((y, i) => (
        <rect key={`l${y}`} x="82" y={y} width={50 + (i % 3) * 12} height="5" rx="1.5" fill={i === 2 ? "#167451" : "#2a323c"} opacity={i === 2 ? 0.6 : 0.8} />
      ))}
      {[48, 62, 76, 90, 104].map((y, i) => (
        <rect key={`r${y}`} x="172" y={y} width={40 + (i % 2) * 20} height="5" rx="1.5" fill="#2a323c" />
      ))}
      <rect x="172" y="118" width="2" height="14" fill="#34d399" opacity="0.9" />
      <rect x="230" y="140" width="56" height="22" rx="6" fill="#122018" stroke="#234032" />
      <text x="258" y="154" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="ui-monospace, monospace">+src</text>
    </svg>
  );
}

function SceneCheck() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1c1e" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#cg)" />
      <rect x="60" y="40" width="130" height="130" rx="6" fill="#0d1117" stroke="#1a2e30" />
      <rect x="74" y="56" width="90" height="5" rx="1" fill="#2a3a3c" />
      <rect x="74" y="70" width="70" height="4" rx="1" fill="#2a3a3c" />
      <rect x="74" y="84" width="80" height="4" rx="1" fill="#2a3a3c" />
      <rect x="74" y="98" width="60" height="4" rx="1" fill="#2a3a3c" />
      <rect x="74" y="112" width="88" height="10" rx="2" fill="#f59e0b" opacity="0.25" />
      <rect x="74" y="128" width="55" height="10" rx="2" fill="#38bdf8" opacity="0.2" />
      <circle cx="220" cy="95" r="42" fill="#0a1416" stroke="#22d3ee" strokeWidth="3" />
      <circle cx="220" cy="95" r="32" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      <line x1="250" y1="125" x2="280" y2="160" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <path d="M200 78 Q210 70 225 78" fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function SceneReview() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14101c" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#rg)" />
      <rect x="28" y="36" width="120" height="130" rx="8" fill="#0d1117" stroke="#2a2438" />
      <rect x="172" y="36" width="120" height="130" rx="8" fill="#0d1117" stroke="#2a2438" />
      <circle cx="48" cy="56" r="8" fill="#3b2d5c" />
      <rect x="62" y="50" width="60" height="5" rx="1" fill="#3b2d5c" />
      <rect x="40" y="74" width="96" height="4" rx="1" fill="#2a2438" />
      <rect x="40" y="86" width="80" height="4" rx="1" fill="#2a2438" />
      <rect x="40" y="98" width="88" height="4" rx="1" fill="#2a2438" />
      <rect x="40" y="120" width="96" height="28" rx="4" fill="#1a1528" stroke="#3b2d5c" />
      <circle cx="192" cy="56" r="8" fill="#167451" />
      <rect x="206" y="50" width="60" height="5" rx="1" fill="#167451" opacity="0.6" />
      <rect x="184" y="74" width="96" height="4" rx="1" fill="#2a2438" />
      <rect x="184" y="86" width="70" height="4" rx="1" fill="#2a2438" />
      <path d="M148 100 H172" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="160" cy="100" r="6" fill="#1a1528" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="184" y="110" width="96" height="40" rx="4" fill="#122018" stroke="#234032" />
      <path d="M198 130 L208 140 L228 116" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SceneExport() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c1f18" />
          <stop offset="100%" stopColor="#07090d" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#eg)" />
      <rect x="100" y="45" width="120" height="100" rx="10" fill="#0d1117" stroke="#234032" strokeWidth="2" />
      <rect x="100" y="45" width="120" height="28" rx="10" fill="#122018" />
      <rect x="100" y="63" width="120" height="10" fill="#122018" />
      <circle cx="160" cy="95" r="22" fill="#0a1812" stroke="#34d399" strokeWidth="2" />
      <path d="M150 95 L157 102 L172 86" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="40" y="150" width="52" height="20" rx="6" fill="#122018" stroke="#234032" />
      <text x="66" y="163" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="ui-monospace, monospace">.veritas</text>
      <rect x="100" y="150" width="40" height="20" rx="6" fill="#122018" stroke="#234032" />
      <text x="120" y="163" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="ui-monospace, monospace">.doc</text>
      <rect x="148" y="150" width="44" height="20" rx="6" fill="#122018" stroke="#234032" />
      <text x="170" y="163" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="ui-monospace, monospace">.html</text>
      <path d="M240 90 L270 90" stroke="#34d399" strokeWidth="2" opacity="0.6" />
      <path d="M262 82 L274 90 L262 98" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SCENES = {
  process: SceneProcess,
  integrity: SceneIntegrity,
  seal: SceneSeal,
  draft: SceneDraft,
  check: SceneCheck,
  review: SceneReview,
  export: SceneExport,
} as const;

type SceneKey = keyof typeof SCENES;

function CardVisual({ variant }: { variant: SceneKey }) {
  const Scene = SCENES[variant];
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07090d]">
      <Scene />
    </div>
  );
}

export default function Home() {
  const { t } = useLocale();

  const pillars = [
    { title: t("home.v1.title"), body: t("home.v1.body"), tag: "01", visual: "process" as const },
    { title: t("home.v2.title"), body: t("home.v2.body"), tag: "02", visual: "integrity" as const },
    { title: t("home.v3.title"), body: t("home.v3.body"), tag: "03", visual: "seal" as const },
  ];

  const steps = [
    { n: "01", title: t("platform.step1"), body: t("platform.step1.d"), visual: "draft" as const },
    { n: "02", title: t("platform.step2"), body: t("platform.step2.d"), visual: "check" as const },
    { n: "03", title: t("platform.step3"), body: t("platform.step3.d"), visual: "review" as const },
    { n: "04", title: t("platform.step4"), body: t("platform.step4.d"), visual: "export" as const },
  ];

  const stats = [
    { label: t("home.stat.institutions") },
    { label: t("home.stat.documents") },
    { label: t("home.stat.accuracy") },
    { label: t("home.stat.speed") },
  ];

  const roles = [
    { title: t("home.role.students"), detail: t("home.role.students.detail") },
    { title: t("home.role.faculty"), detail: t("home.role.faculty.detail") },
    { title: t("home.role.institutions"), detail: t("home.role.institutions.detail") },
    { title: t("home.role.publishers"), detail: t("home.role.publishers.detail") },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d] text-zinc-100 font-sans">
      <div className="relative z-10">
        {/* ═══ SLIDING HERO ═══ */}
        <HeroCarousel />

        {/* STATS */}
        <section className="border-y border-white/10 bg-black/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center px-4 py-9 text-center">
                <p className="text-sm font-medium tracking-wide text-zinc-300 sm:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PILLARS */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">{t("home.badge")}</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{t("platform.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">{t("platform.sub")}</p>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.tag} delay={i * 90}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] transition duration-300 hover:border-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/5">
                    <CardVisual variant={p.visual} />
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <span className="font-mono text-xs text-emerald-400">{p.tag}</span>
                      <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">{p.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">{p.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <section className="border-t border-white/10 bg-black/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">{t("platform.flowTitle")}</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20">
                    <CardVisual variant={s.visual} />
                    <div className="p-5">
                      <div className="font-mono text-xs text-cyan-400">{s.n}</div>
                      <div className="mt-2 text-base font-semibold text-white">{s.title}</div>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">{t("home.who.label")}</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{t("home.who.title")}</h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((r, i) => (
                <Reveal key={r.title} delay={i * 70}>
                  <div className="rounded-2xl border border-white/10 bg-[#0d1117] px-6 py-8 text-center transition hover:border-emerald-500/20">
                    <h3 className="text-base font-semibold text-white">{r.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{r.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 py-16 sm:py-20">
          <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-white">{t("home.cta.title")}</h2>
            <p className="mt-3 text-zinc-400">{t("home.cta.body")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100">
                {t("home.cta.account")}
              </Link>
              <Link href="/pricing" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35">
                {t("home.cta.pricing")}
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

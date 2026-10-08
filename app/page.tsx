"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CryptographicSealSpinner } from "./components/CryptographicSealSpinner";
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

/* ── Unique creative scenes for each card ── */

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
      {/* layered pages */}
      <rect x="48" y="36" width="120" height="140" rx="8" fill="#0d1117" stroke="#1f2a24" strokeWidth="1.5" />
      <rect x="56" y="48" width="88" height="6" rx="2" fill="#167451" opacity="0.5" />
      <rect x="56" y="62" width="72" height="4" rx="1" fill="#3f4f47" />
      <rect x="56" y="72" width="80" height="4" rx="1" fill="#3f4f47" />
      <rect x="56" y="82" width="60" height="4" rx="1" fill="#3f4f47" />
      <rect x="56" y="100" width="88" height="4" rx="1" fill="#2a3a32" />
      <rect x="56" y="110" width="70" height="4" rx="1" fill="#2a3a32" />
      {/* timeline spine */}
      <line x1="210" y1="40" x2="210" y2="170" stroke="url(#pline)" strokeWidth="2" />
      {[50, 85, 120, 155].map((y, i) => (
        <g key={y}>
          <circle cx="210" cy={y} r="7" fill="#0d1117" stroke="#34d399" strokeWidth="2" />
          <circle cx="210" cy={y} r="3" fill="#34d399" opacity={0.4 + i * 0.2} />
          <rect x="226" y={y - 5} width={40 + i * 8} height="10" rx="3" fill="#1a2e24" stroke="#234032" />
        </g>
      ))}
      {/* pen path */}
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
      {/* shield */}
      <path
        d="M160 40 L210 58 V105 C210 140 180 160 160 170 C140 160 110 140 110 105 V58 Z"
        fill="#0d1520"
        stroke="#38bdf8"
        strokeWidth="2"
      />
      {/* scan lines */}
      <line x1="125" y1="80" x2="195" y2="80" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      <line x1="125" y1="95" x2="195" y2="95" stroke="#38bdf8" strokeWidth="1.5" opacity="0.55" />
      <line x1="125" y1="110" x2="195" y2="110" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      {/* check */}
      <path d="M140 100 L154 114 L184 84" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* side meters */}
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
      {/* outer ring */}
      <circle cx="160" cy="100" r="62" fill="none" stroke="#C5A34B" strokeWidth="2" opacity="0.6" />
      <circle cx="160" cy="100" r="54" fill="none" stroke="#C5A34B" strokeWidth="1" opacity="0.3" strokeDasharray="4 6" />
      {/* hex seal */}
      <polygon
        points="160,48 198,70 198,114 160,136 122,114 122,70"
        fill="#12100a"
        stroke="#C5A34B"
        strokeWidth="2"
      />
      <text x="160" y="98" textAnchor="middle" fill="#C5A34B" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600">
        SEAL
      </text>
      <text x="160" y="112" textAnchor="middle" fill="#8a7340" fontSize="8" fontFamily="ui-monospace, monospace">
        Ed25519
      </text>
      {/* hash chips */}
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
      {/* open notebook */}
      <rect x="70" y="28" width="180" height="150" rx="6" fill="#0d1117" stroke="#2a3038" strokeWidth="1.5" />
      <line x1="160" y1="28" x2="160" y2="178" stroke="#1e242c" strokeWidth="1" />
      {/* left lines */}
      {[48, 62, 76, 90, 104, 118, 132].map((y, i) => (
        <rect key={`l${y}`} x="82" y={y} width={50 + (i % 3) * 12} height="5" rx="1.5" fill={i === 2 ? "#167451" : "#2a323c"} opacity={i === 2 ? 0.6 : 0.8} />
      ))}
      {/* right lines */}
      {[48, 62, 76, 90, 104].map((y, i) => (
        <rect key={`r${y}`} x="172" y={y} width={40 + (i % 2) * 20} height="5" rx="1.5" fill="#2a323c" />
      ))}
      {/* cursor */}
      <rect x="172" y="118" width="2" height="14" fill="#34d399" opacity="0.9" />
      {/* floating source chip */}
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
      {/* document under glass */}
      <rect x="60" y="40" width="130" height="130" rx="6" fill="#0d1117" stroke="#1a2e30" />
      <rect x="74" y="56" width="90" height="5" rx="1" fill="#2a3a3c" />
      <rect x="74" y="70" width="70" height="4" rx="1" fill="#2a3a3c" />
      <rect x="74" y="84" width="80" height="4" rx="1" fill="#2a3a3c" />
      <rect x="74" y="98" width="60" height="4" rx="1" fill="#2a3a3c" />
      {/* highlight matches */}
      <rect x="74" y="112" width="88" height="10" rx="2" fill="#f59e0b" opacity="0.25" />
      <rect x="74" y="128" width="55" height="10" rx="2" fill="#38bdf8" opacity="0.2" />
      {/* magnifier */}
      <circle cx="220" cy="95" r="42" fill="#0a1416" stroke="#22d3ee" strokeWidth="3" />
      <circle cx="220" cy="95" r="32" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      <line x1="250" y1="125" x2="280" y2="160" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      {/* lens reflection */}
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
      {/* dual panels */}
      <rect x="28" y="36" width="120" height="130" rx="8" fill="#0d1117" stroke="#2a2438" />
      <rect x="172" y="36" width="120" height="130" rx="8" fill="#0d1117" stroke="#2a2438" />
      {/* left = student */}
      <circle cx="48" cy="56" r="8" fill="#3b2d5c" />
      <rect x="62" y="50" width="60" height="5" rx="1" fill="#3b2d5c" />
      <rect x="40" y="74" width="96" height="4" rx="1" fill="#2a2438" />
      <rect x="40" y="86" width="80" height="4" rx="1" fill="#2a2438" />
      <rect x="40" y="98" width="88" height="4" rx="1" fill="#2a2438" />
      <rect x="40" y="120" width="96" height="28" rx="4" fill="#1a1528" stroke="#3b2d5c" />
      {/* right = faculty */}
      <circle cx="192" cy="56" r="8" fill="#167451" />
      <rect x="206" y="50" width="60" height="5" rx="1" fill="#167451" opacity="0.6" />
      <rect x="184" y="74" width="96" height="4" rx="1" fill="#2a2438" />
      <rect x="184" y="86" width="70" height="4" rx="1" fill="#2a2438" />
      {/* shared evidence link */}
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
      {/* sealed package */}
      <rect x="100" y="45" width="120" height="100" rx="10" fill="#0d1117" stroke="#234032" strokeWidth="2" />
      <rect x="100" y="45" width="120" height="28" rx="10" fill="#122018" />
      <rect x="100" y="63" width="120" height="10" fill="#122018" />
      {/* ribbon seal */}
      <circle cx="160" cy="95" r="22" fill="#0a1812" stroke="#34d399" strokeWidth="2" />
      <path d="M150 95 L157 102 L172 86" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* file type tags */}
      <rect x="40" y="150" width="52" height="20" rx="6" fill="#122018" stroke="#234032" />
      <text x="66" y="163" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="ui-monospace, monospace">.veritas</text>
      <rect x="100" y="150" width="40" height="20" rx="6" fill="#122018" stroke="#234032" />
      <text x="120" y="163" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="ui-monospace, monospace">.doc</text>
      <rect x="148" y="150" width="44" height="20" rx="6" fill="#122018" stroke="#234032" />
      <text x="170" y="163" textAnchor="middle" fill="#5eead4" fontSize="9" fontFamily="ui-monospace, monospace">.html</text>
      {/* arrow out */}
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
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-32 h-[680px] w-[680px] rounded-full bg-emerald-500/[0.08] blur-[150px]" />
        <div className="absolute right-[-10%] top-24 h-[560px] w-[560px] rounded-full bg-sky-500/[0.07] blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 pb-8 pt-14 sm:pt-20 lg:pb-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t("home.badge")}
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                {t("home.hero")}
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300 sm:text-lg">{t("home.sub")}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
                >
                  {t("nav.getstarted")} →
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.07]"
                >
                  {t("home.cta.verify")}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-emerald-500/[0.07] blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0e14] shadow-2xl shadow-black/50">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="ml-3 font-mono text-[11px] text-zinc-500">submission.veritas</span>
                    <span className="ml-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
                      seal.verified
                    </span>
                  </div>
                  <div className="grid lg:grid-cols-12">
                    <div className="relative aspect-[16/11] lg:col-span-8 lg:aspect-auto lg:min-h-[280px]">
                      <Image
                        src="/veritas-hero-illustration.jpg"
                        alt="Veritas"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    <div className="hidden border-l border-white/10 bg-black/50 p-5 font-mono text-[12px] lg:col-span-4 lg:block">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-[10px] uppercase text-zinc-500">{t("verify.result")}</span>
                        <span className="text-[11px] font-bold text-emerald-400">{t("verify.verified")}</span>
                      </div>
                      <p className="mt-3 text-zinc-400">
                        <span className="text-zinc-600">algorithm</span>
                        <br />
                        Ed25519 · SHA-256
                      </p>
                      <div className="mt-5">
                        <CryptographicSealSpinner state="success" size="sm" hashPreview="sha256:a3f8…c91e" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* PILLAR PICTURE CARDS */}
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

        {/* FLOW PICTURE CARDS */}
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

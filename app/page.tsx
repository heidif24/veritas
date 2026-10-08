"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CryptographicSealSpinner } from "./components/CryptographicSealSpinner";
import { useLocale } from "./components/locale-provider";

/** Fade/slide in when the element enters the viewport (Cohesity-style scroll cards). */
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

/** Visual panel used as the “picture” area of solution cards. */
function CardVisual({
  variant,
  label,
}: {
  variant: "process" | "integrity" | "seal" | "draft" | "check" | "review" | "export";
  label: string;
}) {
  const gradients: Record<string, string> = {
    process: "from-emerald-900/80 via-[#0a1f18] to-[#07090d]",
    integrity: "from-sky-900/70 via-[#0a1520] to-[#07090d]",
    seal: "from-amber-900/50 via-[#1a1508] to-[#07090d]",
    draft: "from-zinc-800/80 via-[#12141a] to-[#07090d]",
    check: "from-cyan-900/60 via-[#0a181c] to-[#07090d]",
    review: "from-violet-900/50 via-[#120f1c] to-[#07090d]",
    export: "from-emerald-800/60 via-[#0c1a14] to-[#07090d]",
  };

  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${gradients[variant]}`}>
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Soft orbs */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/[0.06] blur-2xl" />
      <div className="absolute bottom-0 left-0 h-24 w-32 rounded-full bg-emerald-400/[0.08] blur-xl" />

      {/* Mini UI chrome */}
      <div className="absolute inset-x-4 bottom-4 top-8 rounded-lg border border-white/10 bg-black/40 p-3 backdrop-blur-sm sm:inset-x-6 sm:top-10">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="ml-2 font-mono text-[9px] text-white/40">{label}</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-3/4 rounded bg-white/15" />
          <div className="h-1.5 w-1/2 rounded bg-white/10" />
          <div className="mt-3 flex gap-2">
            <div className="h-8 flex-1 rounded border border-white/10 bg-white/[0.04]" />
            <div className="h-8 w-16 rounded border border-emerald-500/30 bg-emerald-500/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLocale();

  const pillars = [
    { title: t("home.v1.title"), body: t("home.v1.body"), tag: "01", visual: "process" as const, chrome: "composition.trail" },
    { title: t("home.v2.title"), body: t("home.v2.body"), tag: "02", visual: "integrity" as const, chrome: "integrity.check" },
    { title: t("home.v3.title"), body: t("home.v3.body"), tag: "03", visual: "seal" as const, chrome: "seal.export" },
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
        {/* ═══════════════ HERO — cinematic, product-forward ═══════════════ */}
        <section className="mx-auto max-w-7xl px-6 pb-8 pt-14 sm:pt-20 lg:pb-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Copy */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t("home.badge")}
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                {t("home.hero")}
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300 sm:text-lg">
                {t("home.sub")}
              </p>
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

            {/* Oversized product frame */}
            <div className="lg:col-span-7">
              <div className="relative">
                {/* Glow behind frame */}
                <div className="absolute -inset-4 rounded-3xl bg-emerald-500/[0.07] blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0e14] shadow-2xl shadow-black/50">
                  {/* Window chrome */}
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

        {/* ═══════════════ STATS STRIP ═══════════════ */}
        <section className="border-y border-white/10 bg-black/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center px-4 py-9 text-center">
                <p className="text-sm font-medium tracking-wide text-zinc-300 sm:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ PICTURE CARDS — pillars ═══════════════ */}
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
                    <CardVisual variant={p.visual} label={p.chrome} />
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

        {/* ═══════════════ FLOW — picture-style step cards ═══════════════ */}
        <section className="border-t border-white/10 bg-black/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">{t("platform.flowTitle")}</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20">
                    <CardVisual variant={s.visual} label={`${s.n} · ${s.title}`} />
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

        {/* ═══════════════ ROLES ═══════════════ */}
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

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="border-t border-white/10 py-16 sm:py-20">
          <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-white">{t("home.cta.title")}</h2>
            <p className="mt-3 text-zinc-400">{t("home.cta.body")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100"
              >
                {t("home.cta.account")}
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
              >
                {t("home.cta.pricing")}
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

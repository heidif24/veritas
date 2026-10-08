"use client";

import Image from "next/image";
import Link from "next/link";
import { CryptographicSealSpinner } from "./components/CryptographicSealSpinner";
import { useLocale } from "./components/locale-provider";

/**
 * Homepage — Cohesity-inspired information architecture.
 * Strategy adapted from cohesity.com: hero → social proof → capability pillars → how-it-works → roles → CTA.
 * All marketing copy preserved via existing i18n keys. Dark canvas kept.
 */
export default function Home() {
  const { t } = useLocale();

  const pillars = [
    { title: t("home.v1.title"), body: t("home.v1.body"), tag: "01" },
    { title: t("home.v2.title"), body: t("home.v2.body"), tag: "02" },
    { title: t("home.v3.title"), body: t("home.v3.body"), tag: "03" },
  ];

  const steps = [
    { n: "01", title: t("platform.step1"), body: t("platform.step1.d") },
    { n: "02", title: t("platform.step2"), body: t("platform.step2.d") },
    { n: "03", title: t("platform.step3"), body: t("platform.step3.d") },
    { n: "04", title: t("platform.step4"), body: t("platform.step4.d") },
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
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -left-48 -top-32 h-[680px] w-[680px] rounded-full bg-emerald-500/[0.08] blur-[150px]" />
        <div className="absolute right-[-10%] top-24 h-[560px] w-[560px] rounded-full bg-sky-500/[0.07] blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* ── 1. Hero ── */}
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {t("home.badge")}
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("home.hero")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              {t("home.sub")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950"
              >
                {t("nav.getstarted")} →
              </Link>
              <Link
                href="/verify"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-zinc-200"
              >
                {t("home.cta.verify")}
              </Link>
            </div>
          </div>

          {/* Product visual — kept */}
          <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0b0e14]/90 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs text-zinc-400">submission.veritas</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-300">
                seal.verified
              </span>
            </div>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 lg:col-span-7">
                <div className="relative aspect-[16/11] w-full">
                  <Image
                    src="/veritas-hero-illustration.jpg"
                    alt="Veritas"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </div>
              </div>
              <div className="lg:col-span-5 rounded-xl border border-white/10 bg-black/50 p-5 font-mono text-[13px]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-zinc-400 text-xs uppercase">{t("verify.result")}</span>
                  <span className="text-emerald-400 text-xs font-bold">{t("verify.verified")}</span>
                </div>
                <p className="mt-3 text-zinc-300">
                  <span className="text-zinc-500">algorithm</span> Ed25519 · SHA-256
                </p>
                <div className="mt-4">
                  <CryptographicSealSpinner state="success" size="sm" hashPreview="sha256:a3f8…c91e" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Social proof / stats (Cohesity-style strip) ── */}
        <section className="border-y border-white/10 bg-black/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center px-4 py-10 text-center"
              >
                <p className="text-sm font-medium tracking-wide text-zinc-300 sm:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Capability pillars (Cohesity Data Insights / Security / Protection pattern) ── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">{t("home.badge")}</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{t("platform.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">{t("platform.sub")}</p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {pillars.map((p) => (
                <div
                  key={p.tag}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-[#0d1117] p-8 transition-colors hover:border-emerald-500/30 hover:bg-[#0f141c]"
                >
                  <span className="font-mono text-xs text-emerald-400">{p.tag}</span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. How it works / platform flow ── */}
        <section className="border-t border-white/10 bg-black/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">{t("platform.flowTitle")}</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="font-mono text-xs text-cyan-400">{s.n}</div>
                  <div className="mt-3 text-lg font-semibold text-white">{s.title}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Who uses Veritas (audience strip) ── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">{t("home.who.label")}</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{t("home.who.title")}</h2>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-white/10 bg-[#0d1117] px-6 py-7 text-center"
                >
                  <h3 className="text-base font-semibold text-white">{r.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Final CTA ── */}
        <section className="border-t border-white/10 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-white">{t("home.cta.title")}</h2>
            <p className="mt-3 text-zinc-400">{t("home.cta.body")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950"
              >
                {t("home.cta.account")}
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
              >
                {t("home.cta.pricing")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

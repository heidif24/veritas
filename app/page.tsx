"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";
import { metrics } from "./data";

export default function HomePage() {
  const { t } = useLocale();

  const roles = [
    { title: t("home.role.students"), detail: t("home.role.students.detail"), icon: "S" },
    { title: t("home.role.faculty"), detail: t("home.role.faculty.detail"), icon: "I" },
    { title: t("home.role.institutions"), detail: t("home.role.institutions.detail"), icon: "U" },
  ];

  const pillars = [
    { title: t("home.v1.title"), body: t("home.v1.body") },
    { title: t("home.v2.title"), body: t("home.v2.body") },
    { title: t("home.v3.title"), body: t("home.v3.body") },
  ];

  return (
    <main className="min-h-screen bg-[#07090d] text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(22,116,81,0.22), transparent), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(197,163,75,0.08), transparent)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {t("home.badge")}
          </div>
          <h1 className="max-w-3xl font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("home.hero")}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">{t("home.sub")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding?intent=institution"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              {t("nav.contactSupport")} →
            </Link>
            <Link
              href="/verify"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/10"
            >
              {t("home.cta.verify")}
            </Link>
            <a
              href="mailto:support@veritas.io"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-6 text-sm font-medium text-zinc-400 transition hover:border-white/25 hover:text-white"
            >
              support@veritas.io
            </a>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-white/5 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-[#07090d] px-6 py-8 text-center md:text-left">
              <p className="font-display text-2xl text-white sm:text-3xl">{m.value}</p>
              <p className="mt-1 text-sm font-medium text-zinc-300">{m.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6"
            >
              <h2 className="font-display text-xl text-white">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          {t("home.who.label")}
        </p>
        <h2 className="mt-2 font-display text-3xl text-white">{t("home.who.title")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 font-mono text-sm font-bold text-emerald-300">
                {role.icon}
              </div>
              <h3 className="mt-4 font-semibold text-white">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{role.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-gradient-to-b from-black/50 to-[#07090d]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl text-white sm:text-4xl">{t("home.cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">{t("home.cta.body")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding?intent=institution"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100"
            >
              {t("home.cta.contact")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40"
            >
              {t("home.cta.pricing")}
            </Link>
            <a
              href="mailto:support@veritas.io"
              className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              support@veritas.io
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

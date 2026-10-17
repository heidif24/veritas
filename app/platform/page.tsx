"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";
import { features, platformCapabilities } from "@/app/data";

export default function PlatformPage() {
  const { t } = useLocale();

  const pillars = [
    { t: t("platform.step1"), d: t("platform.step1.d") },
    { t: t("platform.step2"), d: t("platform.step2.d") },
    { t: t("platform.step3"), d: t("platform.step3.d") },
    { t: t("platform.step4"), d: t("platform.step4.d") },
  ];

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">
          {t("nav.product")}
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl md:text-4xl">
          {t("platform.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted)]">{t("platform.sub")}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="mb-6 text-center font-display text-xl text-[var(--ink)]">
          {t("platform.flowTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <div key={p.t} className="v-card relative p-5">
              <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--emerald-soft)] text-xs font-bold text-[var(--emerald)]">
                {i + 1}
              </span>
              <div className="text-base font-semibold text-[var(--ink)]">{p.t}</div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display text-2xl text-[var(--ink)]">Capabilities</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {platformCapabilities.map((c) => (
              <div key={c.title} className="rounded-2xl border border-[var(--line)] p-5">
                <h3 className="font-semibold text-[var(--ink)]">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{c.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border border-[var(--line)] bg-gradient-to-br ${f.accent} p-5`}
              >
                <h3 className="font-semibold text-[var(--ink)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl">{t("home.cta.title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-[var(--muted)]">{t("home.cta.body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
            {t("home.cta.contact")}
          </Link>
          <Link href="/universities" className="v-btn v-btn-secondary">
            {t("nav.universities")}
          </Link>
          <Link href="/verify" className="v-btn v-btn-secondary">
            {t("home.cta.verify")}
          </Link>
        </div>
      </section>
    </main>
  );
}

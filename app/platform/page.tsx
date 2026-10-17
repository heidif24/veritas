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
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="m-band">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">
            {t("nav.product")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] md:text-5xl">
            {t("platform.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("platform.sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-3xl">{t("platform.flowTitle")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {pillars.map((p, i) => (
            <article key={p.t} className="m-card p-5">
              <span className="font-mono text-[11px] text-[var(--emerald)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl">{p.t}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{p.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">For the campus</p>
            <h2 className="mt-3 font-display text-3xl">What stays with the institution</h2>
            <div className="mt-8 divide-y divide-[var(--line)]">
              {platformCapabilities.map((c) => (
                <div key={c.title} className="py-5">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">In the studio</p>
            <h2 className="mt-3 font-display text-3xl">What students and faculty already use</h2>
            <div className="mt-8 grid gap-4">
              {features.map((f) => (
                <article key={f.title} className="m-card p-5">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{f.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl">{t("home.cta.title")}</h2>
          <p className="mt-3 max-w-xl text-[var(--muted)]">{t("home.cta.body")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
            {t("home.cta.contact")}
          </Link>
          <Link href="/pricing" className="v-btn v-btn-secondary">
            {t("home.cta.pricing")}
          </Link>
        </div>
      </section>
    </main>
  );
}

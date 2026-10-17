"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

export default function UniversitiesPage() {
  const { t } = useLocale();

  const features = [
    { t: t("uni.f1.t"), d: t("uni.f1.d") },
    { t: t("uni.f2.t"), d: t("uni.f2.d") },
    { t: t("uni.f3.t"), d: t("uni.f3.d") },
    { t: t("uni.f4.t"), d: t("uni.f4.d") },
    { t: t("uni.f5.t"), d: t("uni.f5.d") },
    { t: t("uni.f6.t"), d: t("uni.f6.d") },
  ];

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--emerald)]">
          {t("uni.badge")}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl tracking-tight md:text-5xl">
          {t("uni.title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("uni.sub")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
            {t("uni.cta.pricing")}
          </Link>
          <Link href="/platform" className="v-btn v-btn-secondary">
            {t("uni.cta.preview")}
          </Link>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display text-2xl md:text-3xl">{t("uni.section")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="v-card p-6 transition hover:border-[var(--emerald)]/30">
                <div className="text-base font-semibold text-[var(--ink)]">{f.t}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-[var(--emerald)]/20 bg-[var(--emerald-soft)] p-8 md:p-10">
          <h2 className="font-display text-2xl text-[var(--ink)]">{t("uni.students.title")}</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("uni.students.body")}</p>
          <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary mt-6">
            {t("uni.cta.onboard")}
          </Link>
        </div>
      </section>
    </main>
  );
}

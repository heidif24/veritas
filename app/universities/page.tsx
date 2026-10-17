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
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="m-band">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">
              {t("uni.badge")}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight md:text-5xl">
              {t("uni.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("uni.sub")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <Link href="/onboarding?intent=institution" className="v-btn v-btn-primary">
              {t("uni.cta.onboard")}
            </Link>
            <a href="mailto:support@veritas.io" className="v-btn v-btn-secondary">
              support@veritas.io
            </a>
            <Link href="/platform" className="v-btn v-btn-ghost">
              {t("uni.cta.preview")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl md:text-4xl">{t("uni.section")}</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article key={f.t} className="m-card p-6">
              <p className="font-mono text-[11px] text-[var(--emerald)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-2xl">{f.t}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--emerald)]">
              How a campus buys
            </p>
            <h2 className="mt-3 font-display text-3xl">One licence. Your students write free.</h2>
            <p className="mt-4 text-[var(--muted)] leading-7">{t("uni.students.body")}</p>
          </div>
          <ol className="space-y-4 text-sm leading-6">
            {[
              ["Contact support", "Tell us the institution, domains, and LMS."],
              ["Receive codes", "We issue the campus licence and admin access."],
              ["Customize", "Branding, policy, and instructor provisioning stay with you."],
              ["Go live", "Students submit. Faculty review. Packages can be verified."],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 border-b border-[var(--line)] pb-4 last:border-0">
                <span className="font-mono text-xs text-[var(--emerald)]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold text-[var(--ink)]">{title}</p>
                  <p className="text-[var(--muted)]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

export default function PricingPage() {
  const { t } = useLocale();

  const tiers = [
    {
      name: t("pricing.individual"),
      price: "$15",
      period: t("pricing.perMonth"),
      blurb: t("pricing.individual.blurb"),
      cta: t("pricing.start"),
      href: "/register?plan=individual",
      featured: false,
      features: [
        t("pricing.f1"),
        t("pricing.f2"),
        t("pricing.f3"),
        t("pricing.f4"),
        t("pricing.f5"),
      ],
    },
    {
      name: t("pricing.publisher"),
      price: "$750",
      period: t("pricing.perMonth"),
      blurb: t("pricing.publisher.blurb"),
      cta: t("pricing.publisher.cta"),
      href: "/register?plan=publisher",
      featured: true,
      features: [
        t("pricing.pf1"),
        t("pricing.pf2"),
        t("pricing.pf3"),
        t("pricing.pf4"),
        t("pricing.pf5"),
      ],
    },
    {
      name: t("pricing.institution"),
      price: t("pricing.custom"),
      period: "",
      blurb: t("pricing.institution.blurb"),
      cta: t("pricing.contact"),
      href: "/onboarding?intent=institution",
      featured: false,
      features: [
        t("pricing.if1"),
        t("pricing.if2"),
        t("pricing.if3"),
        t("pricing.if4"),
        t("pricing.if5"),
        t("pricing.if6"),
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-12 text-center md:pt-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">{t("nav.pricing")}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-4xl">{t("pricing.title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{t("pricing.subtitle")}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 px-5 py-4 text-left sm:text-center">
          <p className="text-sm font-semibold text-slate-900">{t("pricing.studentBanner")}</p>
          <p className="mt-1 text-sm text-slate-600">{t("pricing.studentfree")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
                tier.featured
                  ? "border-violet-300 bg-violet-50/40 ring-1 ring-violet-200"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{tier.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-slate-900">{tier.price}</span>
                {tier.period ? <span className="text-sm font-medium text-slate-500">{tier.period}</span> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{tier.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-700">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  tier.featured
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-500/20 hover:opacity-95"
                    : tier.price === t("pricing.custom")
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-black text-slate-900">{t("pricing.salesTitle")}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{t("pricing.salesBody")}</p>
            <Link
              href="/onboarding?intent=institution"
              className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              {t("pricing.schedule")}
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{t("pricing.neverTitle")}</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>· {t("pricing.never1")}</li>
              <li>· {t("pricing.never2")}</li>
              <li>· {t("pricing.never3")}</li>
              <li>· {t("pricing.never4")}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

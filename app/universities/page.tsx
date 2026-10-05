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
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">{t("uni.badge")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">{t("uni.title")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t("uni.sub")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/onboarding?intent=institution" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
            {t("uni.cta.pricing")}
          </Link>
          <Link href="/register" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {t("uni.cta.preview")}
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">{t("uni.section")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-base font-bold text-slate-900">{f.t}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 p-8 md:p-10">
          <h2 className="text-2xl font-black text-slate-900">{t("uni.students.title")}</h2>
          <p className="mt-3 max-w-2xl text-slate-600">{t("uni.students.body")}</p>
          <Link href="/onboarding?intent=institution" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
            {t("uni.cta.onboard")}
          </Link>
        </div>
      </section>
    </main>
  );
}

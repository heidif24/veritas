"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

export default function PlatformPage() {
  const { t } = useLocale();

  const pillars = [
    { t: t("platform.step1"), d: t("platform.step1.d") },
    { t: t("platform.step2"), d: t("platform.step2.d") },
    { t: t("platform.step3"), d: t("platform.step3.d") },
    { t: t("platform.step4"), d: t("platform.step4.d") },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12 text-center md:pt-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-700">{t("nav.product")}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          {t("platform.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
          {t("platform.sub")}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-6 text-center text-xl font-black text-slate-900">{t("platform.flowTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.t} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-base font-bold text-slate-900">{p.t}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 text-center">
        <h2 className="text-2xl font-black md:text-3xl">{t("home.cta.title")}</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
            {t("home.cta.account")}
          </Link>
          <Link href="/universities" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {t("nav.universities")}
          </Link>
          <Link href="/verify" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {t("home.cta.verify")}
          </Link>
        </div>
      </section>
    </main>
  );
}

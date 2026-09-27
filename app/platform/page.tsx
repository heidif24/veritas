"use client";

import Link from "next/link";
import { platformCapabilities } from "../data";
import { useLocale } from "@/app/components/locale-provider";

export default function PlatformPage() {
  const { t } = useLocale();

  const steps = [
    { t: t("platform.step1"), d: t("platform.step1.d") },
    { t: t("platform.step2"), d: t("platform.step2.d") },
    { t: t("platform.step3"), d: t("platform.step3.d") },
    { t: t("platform.step4"), d: t("platform.step4.d") },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12 text-center md:pt-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-700">{t("nav.product")}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{t("platform.title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{t("platform.sub")}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformCapabilities.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-xl font-black text-slate-900">{t("platform.flowTitle")}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.t}>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">{step.t}</div>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t("home.cta.account")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

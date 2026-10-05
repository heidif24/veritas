"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

export default function PublishersPage() {
  const { t } = useLocale();

  const cards = [
    { t: t("publishers.f1.t"), d: t("publishers.f1.d") },
    { t: t("publishers.f2.t"), d: t("publishers.f2.d") },
    { t: t("publishers.f3.t"), d: t("publishers.f3.d") },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">{t("publishers.badge")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">{t("publishers.title")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t("publishers.sub")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register?plan=publisher" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
            {t("publishers.cta")}
          </Link>
          <Link href="/pricing" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {t("publishers.cta.pricing")}
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">{c.t}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{c.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen text-slate-900">
      {/* Hero — tighter vertical rhythm */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 md:pb-12 md:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
            {t("home.badge")}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {t("home.hero")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            {t("home.sub")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t("home.cta.start")}
            </Link>
            <Link
              href="/verify"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t("home.cta.verify")}
            </Link>
          </div>
        </div>
      </section>

      {/* Value + metrics combined band */}
      <section className="border-y border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: t("home.v1.title"), body: t("home.v1.body") },
              { title: t("home.v2.title"), body: t("home.v2.body") },
              { title: t("home.v3.title"), body: t("home.v3.body") },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-slate-200/80 pt-8 lg:grid-cols-4">
            {[
              ["430+", t("home.stat.institutions")],
              ["2.4M+", t("home.stat.documents")],
              ["99.97%", t("home.stat.accuracy")],
              ["2.1s", t("home.stat.speed")],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-slate-900 md:text-3xl">{value}</div>
                <div className="mt-1 text-xs font-medium text-slate-600 md:text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-14">
        <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">{t("home.who.label")}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{t("home.who.title")}</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("home.role.students"), href: "/student", detail: t("home.role.students.detail") },
            { label: t("home.role.faculty"), href: "/instructor/courses", detail: t("home.role.faculty.detail") },
            { label: t("home.role.institutions"), href: "/universities", detail: t("home.role.institutions.detail") },
            { label: t("home.role.publishers"), href: "/publisher/pitches", detail: t("home.role.publishers.detail") },
          ].map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
            >
              <div className="text-sm font-bold text-slate-900">{role.label}</div>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{role.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — compact */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-violet-50 px-6 py-8 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left md:px-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 md:text-2xl">{t("home.cta.title")}</h2>
            <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-600">{t("home.cta.body")}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t("home.cta.account")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              {t("home.cta.pricing")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

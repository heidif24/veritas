"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-14 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
            {t("home.badge")}
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            {t("home.hero")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">{t("home.sub")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t("home.cta.start")}
            </Link>
            <Link
              href="/verify"
              className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t("home.cta.verify")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: t("home.v1.title"), body: t("home.v1.body") },
            { title: t("home.v2.title"), body: t("home.v2.body") },
            { title: t("home.v3.title"), body: t("home.v3.body") },
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["430+", t("home.stat.institutions")],
            ["2.4M+", t("home.stat.documents")],
            ["99.97%", t("home.stat.accuracy")],
            ["2.1s", t("home.stat.speed")],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-slate-900 md:text-4xl">{value}</div>
              <div className="mt-2 text-sm font-medium text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">{t("home.who.label")}</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">{t("home.who.title")}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("home.role.students"), href: "/student", detail: t("home.role.students.detail") },
            { label: t("home.role.faculty"), href: "/instructor/courses", detail: t("home.role.faculty.detail") },
            { label: t("home.role.institutions"), href: "/universities", detail: t("home.role.institutions.detail") },
            { label: t("home.role.publishers"), href: "/publisher/pitches", detail: t("home.role.publishers.detail") },
          ].map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
            >
              <div className="text-base font-bold text-slate-900">{role.label}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{role.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[30px] border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-violet-50 px-8 py-12 text-center shadow-[0_30px_80px_rgba(14,116,144,0.08)] md:px-12">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{t("home.cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">{t("home.cta.body")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t("home.cta.account")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              {t("home.cta.pricing")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

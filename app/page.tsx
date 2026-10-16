"use client";

import Link from "next/link";
import { useLocale } from "./components/locale-provider";

export default function HomePage() {
  const { t } = useLocale();

  const roles = [
    { title: t("home.role.students"), detail: t("home.role.students.detail") },
    { title: t("home.role.faculty"), detail: t("home.role.faculty.detail") },
    { title: t("home.role.institutions"), detail: t("home.role.institutions.detail") },
  ];

  return (
    <main className="min-h-screen bg-[#07090d] text-zinc-100">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {t("home.badge")}
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("home.hero")}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">{t("home.sub")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding?intent=institution"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              {t("nav.contactSupport")} →
            </Link>
            <Link
              href="/verify"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-black/30 px-6 text-sm font-medium text-white transition hover:border-white/40"
            >
              {t("home.cta.verify")}
            </Link>
            <a
              href="mailto:support@veritas.io"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              support@veritas.io
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 sm:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{t("home.v1.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{t("home.v1.body")}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{t("home.v2.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{t("home.v2.body")}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{t("home.v3.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{t("home.v3.body")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">{t("home.who.label")}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{t("home.who.title")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {roles.map((role) => (
            <div key={role.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{role.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold text-white">{t("home.cta.title")}</h2>
          <p className="mt-3 text-zinc-400">{t("home.cta.body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding?intent=institution"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100"
            >
              {t("home.cta.contact")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
            >
              {t("home.cta.pricing")}
            </Link>
            <a
              href="mailto:support@veritas.io"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35"
            >
              support@veritas.io
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

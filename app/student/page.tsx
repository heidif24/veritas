"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";

const currentAssignments = [
  { titleKey: "student.a1.title", courseKey: "student.a1.course", dueKey: "student.a1.due", statusKey: "student.a1.status" },
  { titleKey: "student.a2.title", courseKey: "student.a2.course", dueKey: "student.a2.due", statusKey: "student.a2.status" },
  { titleKey: "student.a3.title", courseKey: "student.a3.course", dueKey: "student.a3.due", statusKey: "student.a3.status" },
];

export default function StudentPage() {
  const { t } = useLocale();

  const stats = [
    [t("student.stat.open"), "8"],
    [t("student.stat.sealed"), "4"],
    [t("student.stat.integrity"), "96%"],
    [t("student.stat.awaiting"), "2"],
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">{t("student.badge")}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{t("student.title")}</h1>
            <p className="mt-2 text-slate-600">{t("student.sub")}</p>
          </div>
          <Link
            href="/app/editor/new"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {t("student.newDraft")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {currentAssignments.map((a) => (
            <div key={a.titleKey} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{t(a.courseKey)}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{t(a.titleKey)}</h2>
                </div>
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                  {t(a.dueKey)}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-600">{t("student.status")}</span>
                <span className="font-semibold text-slate-900">{t(a.statusKey)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/app/dashboard" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  {t("student.openDraft")}
                </Link>
                <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {t("student.submit")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{t("student.latest")}</p>
          <div className="mt-5 space-y-3">
            {[
              [t("student.reviewer"), "Dr. Nia Ross"],
              [t("student.export"), t("student.available")],
              [t("student.verification"), t("student.passed")],
              [t("student.confidence"), "96/100"],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-1 font-semibold text-slate-900">{value}</div>
              </div>
            ))}
          </div>
          <Link
            href="/app/dashboard"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            {t("student.openWorkspace")}
          </Link>
        </aside>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { courseCards } from "../../data";
import { useLocale } from "@/app/components/locale-provider";

export default function InstructorCoursesPage() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">{t("faculty.badge")}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{t("faculty.title")}</h1>
            <p className="mt-2 text-slate-600">{t("faculty.sub")}</p>
          </div>
          <Link
            href="/instructor/assignments/new"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {t("faculty.create")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courseCards.map((course) => (
            <div key={course.id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                  {course.term}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  {course.risk} {t("faculty.risk")}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">{course.title}</h2>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>{t("faculty.submissions")}</span>
                  <span className="font-semibold text-slate-900">{course.submissions}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("faculty.nextDeadline")}</span>
                  <span className="font-semibold text-slate-900">{course.nextDeadline}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/instructor/assignment/a-102"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  {t("faculty.openQueue")}
                </Link>
                <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {t("faculty.dropbox")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

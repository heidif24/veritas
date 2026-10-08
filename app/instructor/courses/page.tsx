"use client";

import Link from "next/link";
import { courseCards } from "../../data";
import { useLocale } from "@/app/components/locale-provider";
import { RoleShell, INSTRUCTOR_NAV } from "@/app/components/role-shell";

export default function InstructorCoursesPage() {
  const { t } = useLocale();

  return (
    <RoleShell
      roleLabel="Instructor"
      title={t("faculty.title")}
      nav={INSTRUCTOR_NAV}
      actions={
        <Link href="/instructor/assignments/new" className="v-btn v-btn-primary">
          {t("faculty.create")}
        </Link>
      }
    >
      <p className="mb-6 text-[var(--muted)]">{t("faculty.sub")}</p>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courseCards.map((course) => (
          <div key={course.id} className="v-card p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="v-badge v-badge-emerald">{course.term}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--emerald)]">
                {course.risk} {t("faculty.risk")}
              </span>
            </div>
            <h2 className="mt-4 font-display text-xl text-[var(--ink)]">{course.title}</h2>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex justify-between">
                <span>{t("faculty.submissions")}</span>
                <span className="font-semibold text-[var(--ink)]">{course.submissions}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("faculty.nextDeadline")}</span>
                <span className="font-semibold text-[var(--ink)]">{course.nextDeadline}</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/instructor/assignment/a-102" className="v-btn v-btn-primary">
                {t("faculty.openQueue")}
              </Link>
              <button type="button" className="v-btn v-btn-secondary">
                {t("faculty.dropbox")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </RoleShell>
  );
}

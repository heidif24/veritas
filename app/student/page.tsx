"use client";

import Link from "next/link";
import { useLocale } from "@/app/components/locale-provider";
import { RoleShell, STUDENT_NAV } from "@/app/components/role-shell";

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
    <RoleShell
      roleLabel="Student"
      title={t("student.title")}
      nav={STUDENT_NAV}
      actions={
        <Link href="/app/editor/new" className="v-btn v-btn-primary">
          {t("student.newDraft")}
        </Link>
      }
    >
      <p className="mb-6 max-w-2xl text-[var(--muted)]">{t("student.sub")}</p>

      {/* Writing tutor CTA */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--emerald)]/25 bg-[var(--emerald-soft)] p-5 sm:p-6">
        <span className="v-badge v-badge-emerald">Writing support</span>
        <h2 className="mt-3 font-display text-2xl text-[var(--ink)]">Are you struggling with writing?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          Book a vetted writing tutor for coaching — not ghostwriting. Side comments and Teams/Calendly video while you write.
          You keep every word; the tutor guides.
        </p>
        <Link href="/student/coaching" className="v-btn v-btn-primary mt-4">
          Get writing help / coaching →
        </Link>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="v-card p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</div>
            <div className="mt-2 font-display text-3xl text-[var(--ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          {currentAssignments.map((a) => (
            <article key={a.titleKey} className="v-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{t(a.courseKey)}</p>
                  <h2 className="mt-1 font-display text-xl text-[var(--ink)]">{t(a.titleKey)}</h2>
                </div>
                <span className="v-badge v-badge-gold">{t(a.dueKey)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm">
                <span className="text-[var(--muted)]">{t("student.status")}</span>
                <span className="font-semibold text-[var(--ink)]">{t(a.statusKey)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/app/dashboard" className="v-btn v-btn-primary">
                  {t("student.openDraft")}
                </Link>
                <Link href="/student/coaching" className="v-btn v-btn-secondary">
                  Need coaching?
                </Link>
                <button type="button" className="v-btn v-btn-ghost">
                  {t("student.submit")}
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="v-card h-fit p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{t("student.latest")}</p>
          <div className="mt-4 space-y-2">
            {[
              [t("student.reviewer"), "Dr. Nia Ross"],
              [t("student.export"), t("student.available")],
              [t("student.verification"), t("student.passed")],
              [t("student.confidence"), "96/100"],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3">
                <div className="text-xs text-[var(--muted)]">{label}</div>
                <div className="mt-0.5 font-semibold text-[var(--ink)]">{value}</div>
              </div>
            ))}
          </div>
          <Link href="/app/dashboard" className="v-btn v-btn-primary mt-5 w-full">
            {t("student.openWorkspace")}
          </Link>
        </aside>
      </div>
    </RoleShell>
  );
}

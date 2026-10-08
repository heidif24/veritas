"use client";

import Link from "next/link";
import { RoleShell, INSTRUCTOR_NAV } from "@/app/components/role-shell";

const stats = [
  { label: "Active courses", value: "6", hint: "This term" },
  { label: "Open assignments", value: "14", hint: "Awaiting submissions" },
  { label: "To review", value: "27", hint: "Sealed compositions" },
  { label: "Avg integrity", value: "94%", hint: "Class baseline" },
];

const assignments = [
  { title: "Midterm Essay — Epistemology", course: "PHIL 210", due: "Oct 12", submitted: 18, total: 32, status: "Open" },
  { title: "Research Proposal", course: "HIST 305", due: "Oct 18", submitted: 9, total: 24, status: "Open" },
  { title: "Lab Report 3", course: "BIO 180", due: "Oct 8", submitted: 28, total: 30, status: "Closing" },
  { title: "Reflection Journal", course: "EDU 101", due: "Oct 22", submitted: 4, total: 40, status: "Draft" },
];

export default function InstructorDashboard() {
  return (
    <RoleShell
      roleLabel="Instructor"
      title="Lecturer workspace"
      nav={INSTRUCTOR_NAV}
      actions={
        <Link href="/instructor/assignments/new" className="v-btn v-btn-primary">
          + Create assignment
        </Link>
      }
    >
      <p className="mb-6 text-sm text-[var(--muted)]">Create assignments, review sealed submissions, and track class integrity.</p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="v-card p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{s.label}</div>
            <div className="mt-2 font-display text-3xl text-[var(--ink)]">{s.value}</div>
            <div className="mt-1 text-xs text-[var(--muted)]">{s.hint}</div>
          </div>
        ))}
      </div>

      <section className="v-card mt-8 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Assignments</h2>
          <Link href="/instructor/assignments" className="text-xs font-semibold text-[var(--emerald)] hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="v-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Due</th>
                <th>Submissions</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.title}>
                  <td className="font-semibold text-[var(--ink)]">{a.title}</td>
                  <td>{a.course}</td>
                  <td>{a.due}</td>
                  <td>
                    {a.submitted}/{a.total}
                  </td>
                  <td>
                    <span className={`v-badge ${a.status === "Open" ? "v-badge-emerald" : "v-badge-gold"}`}>{a.status}</span>
                  </td>
                  <td>
                    <Link href="/instructor/assignments" className="text-xs font-semibold text-[var(--emerald)] hover:underline">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/instructor/assignments/new" className="v-card border-[var(--emerald)]/25 bg-[var(--emerald-soft)] p-5 transition hover:shadow-md">
          <div className="font-semibold text-[var(--emerald-dark)]">Create assignment</div>
          <p className="mt-1 text-xs text-[var(--muted)]">Set due dates, rubric, and integrity rules.</p>
        </Link>
        <Link href="/instructor/assignments" className="v-card p-5 transition hover:border-[var(--emerald)]/40 hover:shadow-md">
          <div className="font-semibold text-[var(--ink)]">Review submissions</div>
          <p className="mt-1 text-xs text-[var(--muted)]">Open sealed compositions and integrity reports.</p>
        </Link>
        <Link href="/instructor/narrative" className="v-card p-5 transition hover:border-[var(--emerald)]/40 hover:shadow-md">
          <div className="font-semibold text-[var(--ink)]">Class narrative</div>
          <p className="mt-1 text-xs text-[var(--muted)]">Integrity trends and baseline comparisons.</p>
        </Link>
      </div>
    </RoleShell>
  );
}

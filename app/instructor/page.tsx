"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleShell, INSTRUCTOR_NAV } from "@/app/components/role-shell";

type AssignmentRow = {
  id: string;
  title?: string;
  due_at?: string | null;
  course_id?: string;
};

export default function InstructorDashboard() {
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void fetch("/api/assignments")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data.assignments) ? data.assignments : []))
      .catch(() => setRows([]))
      .finally(() => setLoaded(true));
  }, []);

  const open = rows.filter((a) => !a.due_at || new Date(a.due_at).getTime() > Date.now()).length;
  const ready = rows.length - open;

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
      <p className="mb-6 text-sm text-[var(--muted)]">
        Each assignment is a folder. Student work appears inside the folder only after the deadline. Extending the deadline reopens submissions.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="v-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Assignment folders</div>
          <div className="mt-2 font-display text-3xl text-[var(--ink)]">{loaded ? rows.length : "—"}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">On your courses</div>
        </div>
        <div className="v-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Still open</div>
          <div className="mt-2 font-display text-3xl text-[var(--ink)]">{loaded ? open : "—"}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">Students can still submit</div>
        </div>
        <div className="v-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Ready to open</div>
          <div className="mt-2 font-display text-3xl text-[var(--ink)]">{loaded ? ready : "—"}</div>
          <div className="mt-1 text-xs text-[var(--muted)]">Deadline has passed</div>
        </div>
        <div className="v-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Attempts</div>
          <div className="mt-2 font-display text-3xl text-[var(--ink)]">3</div>
          <div className="mt-1 text-xs text-[var(--muted)]">Edits per student</div>
        </div>
      </div>

      <section className="v-card mt-8 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Folders</h2>
          <Link href="/instructor/assignments" className="text-xs font-semibold text-[var(--emerald)] hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="v-table">
            <thead>
              <tr>
                <th>Folder</th>
                <th>Due</th>
                <th>Release</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!loaded ? (
                <tr>
                  <td colSpan={4}>Loading folders…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4}>No assignments yet. Create one to open a folder.</td>
                </tr>
              ) : (
                rows.map((a) => {
                  const past = Boolean(a.due_at && new Date(a.due_at).getTime() <= Date.now());
                  return (
                    <tr key={a.id}>
                      <td className="font-semibold text-[var(--ink)]">{a.title || "Untitled assignment"}</td>
                      <td>{a.due_at ? new Date(a.due_at).toLocaleString() : "No deadline"}</td>
                      <td>
                        <span className={`v-badge ${past ? "v-badge-emerald" : "v-badge-gold"}`}>
                          {past ? "Open for review" : "Hidden until deadline"}
                        </span>
                      </td>
                      <td>
                        <Link href={`/instructor/assignment/${a.id}/folder`} className="text-xs font-semibold text-[var(--emerald)] hover:underline">
                          Open folder
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/instructor/assignments/new" className="v-card border-[var(--emerald)]/25 bg-[var(--emerald-soft)] p-5 transition hover:shadow-md">
          <div className="font-semibold text-[var(--emerald-dark)]">Create assignment</div>
          <p className="mt-1 text-xs text-[var(--muted)]">Set a deadline. Students may submit up to 3 times before it.</p>
        </Link>
        <Link href="/instructor/assignments" className="v-card p-5 transition hover:border-[var(--emerald)]/40 hover:shadow-md">
          <div className="font-semibold text-[var(--ink)]">Review submissions</div>
          <p className="mt-1 text-xs text-[var(--muted)]">Folders list every student after the deadline.</p>
        </Link>
        <Link href="/instructor/narrative" className="v-card p-5 transition hover:border-[var(--emerald)]/40 hover:shadow-md">
          <div className="font-semibold text-[var(--ink)]">Class narrative</div>
          <p className="mt-1 text-xs text-[var(--muted)]">Integrity trends and baseline comparisons.</p>
        </Link>
      </div>
    </RoleShell>
  );
}

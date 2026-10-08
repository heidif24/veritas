"use client";

import Link from "next/link";
import { RoleShell, INSTRUCTOR_NAV } from "@/app/components/role-shell";

const assignments = [
  { id: "1", title: "Midterm Essay — Epistemology", course: "PHIL 210", due: "Oct 12, 2026", submitted: 18, total: 32, status: "Open" },
  { id: "2", title: "Research Proposal", course: "HIST 305", due: "Oct 18, 2026", submitted: 9, total: 24, status: "Open" },
  { id: "3", title: "Lab Report 3", course: "BIO 180", due: "Oct 8, 2026", submitted: 28, total: 30, status: "Closing" },
  { id: "4", title: "Reflection Journal", course: "EDU 101", due: "Oct 22, 2026", submitted: 4, total: 40, status: "Draft" },
  { id: "5", title: "Case Study Analysis", course: "BUS 220", due: "Sep 28, 2026", submitted: 22, total: 22, status: "Closed" },
];

export default function AssignmentsListPage() {
  return (
    <RoleShell
      roleLabel="Instructor"
      title="Assignments"
      nav={INSTRUCTOR_NAV}
      actions={
        <Link href="/instructor/assignments/new" className="v-btn v-btn-primary">
          + Create assignment
        </Link>
      }
    >
      <p className="mb-6 text-sm text-[var(--muted)]">Manage course assignments, deadlines, and submission status.</p>

      <div className="v-card overflow-x-auto">
        <table className="v-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Due date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
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
                  <div className="flex gap-3">
                    <Link href={`/instructor/assignment/${a.id}`} className="text-xs font-semibold text-[var(--emerald)] hover:underline">
                      Open
                    </Link>
                    <Link href={`/instructor/review/${a.id}`} className="text-xs font-semibold text-[var(--muted)] hover:underline">
                      Review
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RoleShell>
  );
}

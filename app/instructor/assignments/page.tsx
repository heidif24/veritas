import Link from "next/link";
import { PortalShell } from "../../components/portal-shell";

const assignments = [
  { id: "1", title: "Midterm Essay — Epistemology", course: "PHIL 210", due: "Oct 12, 2026", submitted: 18, total: 32, status: "Open" },
  { id: "2", title: "Research Proposal", course: "HIST 305", due: "Oct 18, 2026", submitted: 9, total: 24, status: "Open" },
  { id: "3", title: "Lab Report 3", course: "BIO 180", due: "Oct 8, 2026", submitted: 28, total: 30, status: "Closing" },
  { id: "4", title: "Reflection Journal", course: "EDU 101", due: "Oct 22, 2026", submitted: 4, total: 40, status: "Draft" },
  { id: "5", title: "Case Study Analysis", course: "BUS 220", due: "Sep 28, 2026", submitted: 22, total: 22, status: "Closed" },
];

export default function AssignmentsListPage() {
  return (
    <PortalShell
      role="instructor"
      title="Assignments"
      subtitle="Manage all course assignments, deadlines, and submission status."
      navItems={[
        { label: "Overview", href: "/instructor", active: false },
        { label: "Assignments", href: "/instructor/assignments", active: true },
        { label: "New assignment", href: "/instructor/assignments/new", active: false },
        { label: "Courses", href: "/instructor/courses", active: false },
        { label: "Review", href: "/instructor/review", active: false },
        { label: "Reports", href: "/instructor/report", active: false },
      ]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{assignments.length} assignments</p>
        <Link
          href="/instructor/assignments/new"
          className="inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25"
        >
          + Create assignment
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Course</th>
              <th className="px-5 py-4 font-medium">Due date</th>
              <th className="px-5 py-4 font-medium">Submissions</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-t border-white/10 text-slate-200">
                <td className="px-5 py-4 font-medium text-white">{a.title}</td>
                <td className="px-5 py-4">{a.course}</td>
                <td className="px-5 py-4">{a.due}</td>
                <td className="px-5 py-4">
                  {a.submitted}/{a.total}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      a.status === "Open"
                        ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                        : a.status === "Closing"
                          ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                          : a.status === "Closed"
                            ? "bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/30"
                            : "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <Link href="/instructor/review" className="text-xs font-semibold text-cyan-300 hover:underline">
                      Review
                    </Link>
                    <Link href={`/instructor/assignment/${a.id}`} className="text-xs font-semibold text-slate-400 hover:underline">
                      Open
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}

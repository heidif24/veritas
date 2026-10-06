import Link from "next/link";
import { PortalShell } from "../components/portal-shell";

const stats = [
  { label: "Active courses", value: "6", hint: "This term", grad: "from-emerald-400 to-teal-500" },
  { label: "Open assignments", value: "14", hint: "Awaiting submissions", grad: "from-cyan-400 to-blue-500" },
  { label: "To review", value: "27", hint: "Sealed compositions", grad: "from-amber-400 to-orange-500" },
  { label: "Avg integrity", value: "94%", hint: "Class baseline", grad: "from-violet-400 to-fuchsia-500" },
];

const assignments = [
  { title: "Midterm Essay — Epistemology", course: "PHIL 210", due: "Oct 12", submitted: 18, total: 32, status: "Open" },
  { title: "Research Proposal", course: "HIST 305", due: "Oct 18", submitted: 9, total: 24, status: "Open" },
  { title: "Lab Report 3", course: "BIO 180", due: "Oct 8", submitted: 28, total: 30, status: "Closing" },
  { title: "Reflection Journal", course: "EDU 101", due: "Oct 22", submitted: 4, total: 40, status: "Draft" },
];

export default function InstructorDashboard() {
  return (
    <PortalShell
      role="instructor"
      title="Lecturer workspace"
      subtitle="Create assignments, review sealed submissions, and track class integrity."
      navItems={[
        { label: "Overview", href: "/instructor", active: true },
        { label: "Assignments", href: "/instructor/assignments", active: false },
        { label: "New assignment", href: "/instructor/assignments/new", active: false },
        { label: "Courses", href: "/instructor/courses", active: false },
        { label: "Review", href: "/instructor/review", active: false },
        { label: "Reports", href: "/instructor/report", active: false },
        { label: "Narrative", href: "/instructor/narrative", active: false },
      ]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">Welcome back. Here is what needs attention today.</p>
        <Link
          href="/instructor/assignments/new"
          className="inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:opacity-95"
        >
          + Create assignment
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.grad} opacity-25 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{s.label}</div>
              <div className={`mt-2 bg-gradient-to-r ${s.grad} bg-clip-text text-3xl font-black text-transparent`}>{s.value}</div>
              <div className="mt-1 text-xs text-slate-500">{s.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Assignments</h2>
          <Link href="/instructor/assignments" className="text-xs font-semibold text-emerald-300 hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Submissions</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.title} className="border-t border-white/10 text-slate-200">
                  <td className="px-4 py-3 font-medium text-white">{a.title}</td>
                  <td className="px-4 py-3">{a.course}</td>
                  <td className="px-4 py-3">{a.due}</td>
                  <td className="px-4 py-3">
                    {a.submitted}/{a.total}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        a.status === "Open"
                          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                          : a.status === "Closing"
                            ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                            : "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href="/instructor/review" className="text-xs font-semibold text-cyan-300 hover:underline">
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
        <Link
          href="/instructor/assignments/new"
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 transition hover:bg-emerald-500/15"
        >
          <div className="text-sm font-bold text-emerald-200">Create assignment</div>
          <p className="mt-1 text-xs text-slate-400">Set due dates, rubric, and integrity rules.</p>
        </Link>
        <Link
          href="/instructor/review"
          className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 transition hover:bg-cyan-500/15"
        >
          <div className="text-sm font-bold text-cyan-200">Review submissions</div>
          <p className="mt-1 text-xs text-slate-400">Open sealed compositions and integrity reports.</p>
        </Link>
        <Link
          href="/instructor/report"
          className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 transition hover:bg-violet-500/15"
        >
          <div className="text-sm font-bold text-violet-200">Class reports</div>
          <p className="mt-1 text-xs text-slate-400">Integrity trends and baseline comparisons.</p>
        </Link>
      </div>
    </PortalShell>
  );
}

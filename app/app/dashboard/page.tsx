import Link from "next/link";

const projectCards = [
  { title: "Northbridge institutional launch", type: "University admin", status: "Active", progress: 82, owners: ["Alicia", "Maya", "Daniel"], due: "Launch in 3 days" },
  { title: "Faculty onboarding queue", type: "Operations", status: "Reviewing", progress: 68, owners: ["Nia", "Jules"], due: "Due tomorrow" },
  { title: "Student submission review", type: "Academic review", status: "Verified", progress: 94, owners: ["Mila", "Sam"], due: "Signed off" },
];

const roleCards = [
  { label: "Institution admin", href: "/admin/tenant", accent: "bg-cyan-500/10 text-cyan-200", detail: "Govern policy and faculty onboarding" },
  { label: "Faculty workspace", href: "/instructor/courses", accent: "bg-violet-500/10 text-violet-200", detail: "Review student submissions and assign marks" },
  { label: "Student portal", href: "/student", accent: "bg-emerald-500/10 text-emerald-200", detail: "Submit work and download sealed bundles" },
  { label: "Trusted verifier", href: "/verify", accent: "bg-amber-500/10 text-amber-200", detail: "Check provenance and authenticity" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Mission control</p>
            <h1 className="mt-2 text-3xl font-black text-white">Operations workspace</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/editor/quarterly-risk-brief" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">New draft</Link>
            <Link href="/onboarding" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white">Register institution</Link>
          </div>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            ["Active drafts", "12"],
            ["Integrity score", "96/100"],
            ["Reviewers online", "08"],
            ["Pending approvals", "03"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
              <div className="mt-3 text-2xl font-black text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roleCards.map((card) => (
            <Link key={card.label} href={card.href} className="rounded-[26px] border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900">
              <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${card.accent}`}>{card.label}</div>
              <div className="mt-4 text-sm text-slate-300">{card.detail}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-5">
            {projectCards.map((project) => (
              <div key={project.title} className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{project.type}</div>
                    <h2 className="mt-2 text-2xl font-bold text-white">{project.title}</h2>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">{project.status}</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {project.owners.map((owner) => (
                    <span key={owner} className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-200">{owner}</span>
                  ))}
                  <span className="ml-auto text-xs uppercase tracking-[0.15em] text-slate-400">{project.due}</span>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar h-2.5 rounded-full bg-slate-800">
                    <span style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link href="/app/editor/quarterly-risk-brief" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Open draft</Link>
                  <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Export bundle</button>
                </div>
              </div>
            ))}
          </section>

          <aside className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-violet-200">Protocol checks</p>
            <div className="mt-6 space-y-4">
              {[
                ["Northbridge launch", "Verified", "07:42 PM"],
                ["Faculty onboarding", "Reviewing", "Today"],
                ["Student export", "Tamper-free", "Yesterday"],
              ].map(([title, status, date]) => (
                <div key={title} className="rounded-2xl bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white">{title}</span>
                    <span className="text-xs text-emerald-200">{status}</span>
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">{date}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

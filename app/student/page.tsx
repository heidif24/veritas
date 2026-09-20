import Link from "next/link";

const currentAssignments = [
  { title: "Comparative Theory Essay", course: "Philosophy 101", due: "Due today", score: "Ready for submission" },
  { title: "Lab Methods Brief", course: "Biology 240", due: "Due tomorrow", score: "In review" },
  { title: "Research Reflection", course: "History 210", due: "Due Friday", score: "Draft saved" },
];

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Student portal</p>
            <h1 className="mt-2 text-3xl font-black text-white">Your academic workspace</h1>
          </div>
          <Link href="/app/dashboard" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">Open workspace</Link>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            ["Assignments", "08"],
            ["Signed exports", "04"],
            ["Verified drafts", "96%"],
            ["Review queue", "02"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
              <div className="mt-3 text-2xl font-black text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-5">
            {currentAssignments.map((assignment) => (
              <div key={assignment.title} className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{assignment.course}</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{assignment.title}</h2>
                  </div>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">{assignment.due}</span>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span className="text-sm text-slate-300">Submission status</span>
                  <span className="text-sm font-semibold text-white">{assignment.score}</span>
                </div>
                <div className="mt-5 flex gap-3">
                  <Link href="/app/dashboard" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Open draft</Link>
                  <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Submit to professor</button>
                </div>
              </div>
            ))}
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-violet-200">Submission details</p>
            <div className="mt-5 space-y-4">
              {[
                ["Faculty reviewer", "Dr. Nia Ross"],
                ["Sealed export", "Available"],
                ["Verification check", "Passed"],
                ["Confidence score", "96/100"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-950/40 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</div>
                  <div className="mt-2 text-lg font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">Download protected bundle</button>
          </aside>
        </div>
      </div>
    </div>
  );
}

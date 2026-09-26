import Link from "next/link";

export default async function ReportPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Submission report</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Submission {submissionId}</h1>
          </div>
          <Link
            href="/instructor/assignment/a-102"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to queue
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Outcome</p>
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Verdict</div>
            <div className="mt-2 text-2xl font-black text-slate-900">Human-authored</div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            {[
              ["Organic drafting", "94%"],
              ["Direct pastes", "3%"],
              ["Composition risk", "Low"],
              ["Integrity check", "Passed"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-slate-600">{label}</span>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Composition timeline</p>
          <div className="mt-6 space-y-5">
            {[
              ["08:12", "Opening thesis drafted in short bursts", "bg-emerald-400"],
              ["08:29", "Pause before restructuring a paragraph", "bg-cyan-400"],
              ["09:14", "Source note added and marked as citation", "bg-amber-400"],
              ["09:57", "Final revision sealed", "bg-violet-400"],
            ].map(([time, action, tone]) => (
              <div key={time} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-3.5 w-3.5 rounded-full ${tone}`} />
                  <div className="mt-2 h-12 w-px bg-slate-200" />
                </div>
                <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">{time}</div>
                  <div className="mt-1 text-sm text-slate-800">{action}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Highlighted passages</p>
          <div className="mt-5 space-y-4 text-sm leading-8 text-slate-700">
            <p>
              <span className="rounded bg-emerald-100 px-1 text-emerald-900">Choice is not an abstract condition</span>{" "}
              but a lived pattern of decisions, revisions, and returns to unfinished thought.
            </p>
            <p>
              <span className="rounded bg-emerald-100 px-1 text-emerald-900">The essay moves through hesitation, evidence, and synthesis</span>
              , leaving a clear composition path for review.
            </p>
            <p>
              <span className="rounded bg-amber-100 px-1 text-amber-900">Quoted note inserted with source marker.</span>{" "}
              Final edits were sealed without post-export change.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

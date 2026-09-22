import Link from "next/link";

export default async function ReportPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Detailed inspection view</p>
            <h1 className="mt-2 text-3xl font-black text-white">Submission {submissionId}</h1>
          </div>
          <Link href="/instructor/assignment/a-102" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">Back to queue</Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Verdict card</p>
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-200">Outcome</div>
              <div className="mt-3 text-3xl font-black text-white">Human-authored</div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                ["Organic drafting", "94%"],
                ["Direct pastes", "3%"],
                ["AI transcription signature", "Low"],
                ["Offline tamper check", "Passed"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span>{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Replay visualizer</p>
            <div className="mt-6 space-y-6">
              {[
                ["08:12", "Opening thesis drafted in short organic bursts", "green"],
                ["08:29", "Cognitive pause before paragraph restructure", "cyan"],
                ["09:14", "Source note pasted and retained as cited material", "amber"],
                ["09:57", "Final revision sealed with platform signature", "violet"],
              ].map(([time, action, tone]) => (
                <div key={time} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-4 w-4 rounded-full ${tone === "green" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-400" : tone === "cyan" ? "bg-cyan-400" : "bg-violet-400"}`} />
                    <div className="mt-2 h-16 w-px bg-white/10" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{time}</div>
                    <div className="mt-2 text-base text-slate-200">{action}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Lineage heatmap</p>
          <div className="mt-5 space-y-4 text-sm leading-8 text-slate-200">
            <p><span className="rounded bg-emerald-500/20 px-1 text-emerald-100">Choice is not an abstract condition</span> but a lived pattern of decisions, revisions, and returns to unfinished thought.</p>
            <p><span className="rounded bg-emerald-500/20 px-1 text-emerald-100">The essay moves through hesitation, evidence, and synthesis</span>, leaving behind a traceable composition path.</p>
            <p><span className="rounded bg-amber-500/20 px-1 text-amber-100">Quoted note inserted with source marker.</span> Final edits were sealed without post-export modification.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

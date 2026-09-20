import Link from "next/link";

export default function ReportPage({ params }: { params: { submissionId: string } }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Review report</p>
            <h1 className="mt-2 text-3xl font-black text-white">Submission {params.submissionId}</h1>
          </div>
          <Link href="/instructor/assignment/a-102" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">Back to queue</Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Verdict card</p>
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-200">Outcome</div>
              <div className="mt-3 text-3xl font-black text-white">Approved</div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                ["Integrity", "Verified"],
                ["Review notes", "No issues"],
                ["Decision", "Approved"],
                ["Confidence", "96%"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <span>{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Replay timeline</p>
            <div className="mt-6 space-y-6">
              {[
                ["08:12", "Opening thesis drafted", "green"],
                ["08:29", "Source notes referenced", "amber"],
                ["09:14", "Evidence paragraph written", "green"],
                ["09:57", "Final revision and seal", "green"],
              ].map(([time, action, tone]) => (
                <div key={time} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-4 w-4 rounded-full ${tone === "green" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-400" : "bg-red-400"}`} />
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
      </div>
    </div>
  );
}

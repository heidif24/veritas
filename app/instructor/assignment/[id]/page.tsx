import Link from "next/link";
import { submissionRows } from "../../../data";

export default function AssignmentPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Assignment review</p>
            <h1 className="mt-2 text-3xl font-black text-white">Existentialism Term Paper</h1>
          </div>
          <Link href="/instructor/report/S-101" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">Inspect report</Link>
        </header>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70">
          <div className="grid grid-cols-[1fr_320px]">
            <div className="p-6">
              <div className="grid gap-4">
                {submissionRows.map((row) => (
                  <div key={row.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{row.id}</div>
                        <h2 className="mt-2 text-xl font-bold text-white">{row.student}</h2>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">{row.status}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{row.title}</p>
                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span>Review score</span>
                      <span className="text-white">{row.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-l border-white/10 bg-slate-950/50 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Risk summary</p>
              <div className="mt-4 space-y-4">
                {[
                  ["Draft strength", "81%"],
                  ["Document edits", "0"],
                  ["Review notes", "2"],
                  ["Approval delays", "1"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
                    <div className="mt-2 text-2xl font-black text-white">{value}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

import { publisherPitches } from "../../data";

export default function PublisherPitchesPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Publisher portal</p>
          <h1 className="mt-2 text-3xl font-black text-white">Editorial review queue</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Review work, check provenance, and confirm readiness before assignment or publication.
          </p>
        </header>

        <div className="space-y-5">
          {publisherPitches.map((pitch) => (
            <div key={pitch.title} className="flex flex-col gap-4 rounded-[26px] border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{pitch.writer}</div>
                <h2 className="mt-2 text-2xl font-bold text-white">{pitch.title}</h2>
                <p className="mt-2 text-sm text-slate-400">Certificate linked, tamper check available, badge ready after approval.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">{pitch.status}</div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">Lineage {pitch.score}</div>
                <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Rapid verify</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

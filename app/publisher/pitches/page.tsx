import Link from "next/link";
import { publisherPitches } from "../../data";

export default function PublisherPitchesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Publishers</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Editorial review queue</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Review submissions, confirm provenance, and approve work before publication.
        </p>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-6 pb-20">
        {publisherPitches.map((pitch) => (
          <div
            key={pitch.title}
            className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{pitch.writer}</div>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{pitch.title}</h2>
              <p className="mt-2 text-sm text-slate-600">Provenance linked · integrity check available</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {pitch.status}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Score {pitch.score}
              </span>
              <Link
                href="/verify"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Verify package
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

import Link from "next/link";
import { submissionRows } from "../../../data";

export default function AssignmentPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Assignment queue</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Existentialism Term Paper</h1>
            <p className="mt-2 text-slate-600">Review submissions with provenance and integrity signals.</p>
          </div>
          <Link
            href="/instructor/report/S-101"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Open sample report
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="space-y-4 p-6">
              {submissionRows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{row.id}</div>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">{row.student}</h2>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{row.title}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Authenticity</span>
                    <span className="font-semibold text-slate-900">{row.score}/100</span>
                  </div>
                  <Link
                    href={`/instructor/report/${row.id}`}
                    className="mt-3 inline-block text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                  >
                    View report →
                  </Link>
                </div>
              ))}
            </div>

            <aside className="border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Queue summary</p>
              <div className="mt-4 space-y-3">
                {[
                  ["Organic average", "81%"],
                  ["Flagged pastes", "2"],
                  ["Needs attention", "1"],
                  ["Tamper issues", "0"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 text-xl font-black text-slate-900">{value}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

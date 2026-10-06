"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { submissionRows } from "../../../data";

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = String(params?.id ?? "a-102");

  function downloadAllSubmissions() {
    const payload = {
      assignmentId,
      assignmentTitle: "Existentialism Term Paper",
      exportedAt: new Date().toISOString(),
      submissions: submissionRows.map((row) => ({
        id: row.id,
        student: row.student,
        title: row.title,
        status: row.status,
        authenticityScore: row.score,
        timestamp: row.timestamp,
        reviewUrl: `/instructor/review/${row.id}`,
      })),
      summary: {
        total: submissionRows.length,
        ready: submissionRows.filter((r) => r.status === "Ready").length,
        needsReview: submissionRows.filter((r) => r.status === "Needs review").length,
        avgAuthenticity: Math.round(
          submissionRows.reduce((a, r) => a + r.score, 0) / Math.max(1, submissionRows.length),
        ),
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assignmentId}-all-submissions.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Assignment queue</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Existentialism Term Paper</h1>
            <p className="mt-2 text-slate-600">
              Review full documents, integrity evidence, comments, and grades — then download the class package.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadAllSubmissions}
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              Download all submissions
            </button>
            <Link
              href="/instructor"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Lecturer home
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="space-y-4 p-6">
              {submissionRows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{row.id}</div>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">{row.student}</h2>
                      <p className="mt-1 text-sm text-slate-600">{row.title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        {row.status}
                      </span>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-right">
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">Authenticity</div>
                        <div
                          className={`text-lg font-black tabular-nums ${
                            row.score >= 80
                              ? "text-emerald-700"
                              : row.score >= 50
                                ? "text-amber-700"
                                : "text-rose-700"
                          }`}
                        >
                          {row.score}
                          <span className="text-xs font-semibold text-slate-400">/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/instructor/review/${row.id}`}
                      className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                    >
                      Open review studio
                    </Link>
                    <Link
                      href={`/instructor/report/${row.id}`}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Evidence report
                    </Link>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">Submitted {row.timestamp}</p>
                </div>
              ))}
            </div>

            <aside className="border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Queue summary</p>
              <div className="mt-4 space-y-3">
                {[
                  ["Submissions", String(submissionRows.length)],
                  [
                    "Avg authenticity",
                    `${Math.round(
                      submissionRows.reduce((a, r) => a + r.score, 0) / Math.max(1, submissionRows.length),
                    )}%`,
                  ],
                  ["Needs review", String(submissionRows.filter((r) => r.status === "Needs review").length)],
                  ["Ready", String(submissionRows.filter((r) => r.status === "Ready").length)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 text-xl font-black text-slate-900">{value}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={downloadAllSubmissions}
                className="mt-6 w-full rounded-full bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Download entire class
              </button>
              <p className="mt-3 text-[11px] leading-5 text-slate-500">
                Package includes student names, titles, authenticity scores, status, and links to each review studio.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

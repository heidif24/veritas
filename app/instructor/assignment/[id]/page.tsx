"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type SubmissionRow = {
  id: string;
  submissionId: string;
  documentId: string;
  studentName: string;
  studentEmail: string;
  title: string;
  status: string;
  authenticityScore: number | null;
  similarityScore: number | null;
  sealed: boolean;
  submittedAt: string;
  grade: number | null;
  maxScore: number;
  decision: string;
};

type Summary = {
  total: number;
  sealed: number;
  needsReview: number;
  avgAuthenticity: number | null;
  avgGrade: number | null;
};

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = String(params?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Assignment");
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/assignments/${encodeURIComponent(assignmentId)}/submissions`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Could not load submissions");
          return;
        }
        if (cancelled) return;
        setTitle(String(data.assignment?.title || "Assignment"));
        setRows(Array.isArray(data.submissions) ? data.submissions : []);
        setSummary(data.summary || null);
      } catch {
        if (!cancelled) setError("Failed to load submissions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  function downloadAllSubmissions() {
    const payload = {
      assignmentId,
      assignmentTitle: title,
      exportedAt: new Date().toISOString(),
      summary,
      submissions: rows.map((row) => ({
        ...row,
        reviewUrl: `/instructor/review/${row.documentId}`,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assignmentId}-all-submissions.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatWhen(iso: string) {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-700">Assignment queue</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-600">
              Live submissions with authenticity signals, grades, and full review studio access.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadAllSubmissions}
              disabled={!rows.length}
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
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
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500">
            Loading submissions…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-sm text-rose-700">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1fr_280px]">
              <div className="space-y-4 p-6">
                {rows.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                    No submissions yet for this assignment.
                  </div>
                ) : (
                  rows.map((row) => (
                    <div key={row.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {row.submissionId.slice(0, 12)}
                          </div>
                          <h2 className="mt-1 text-lg font-bold text-slate-900">{row.studentName}</h2>
                          <p className="mt-1 text-sm text-slate-600">{row.title}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{row.studentEmail}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium capitalize text-slate-700">
                            {row.status}
                            {row.sealed ? " · sealed" : ""}
                          </span>
                          <div className="flex gap-2">
                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-right">
                              <div className="text-[10px] uppercase tracking-wide text-slate-400">Authenticity</div>
                              <div
                                className={`text-lg font-black tabular-nums ${
                                  row.authenticityScore == null
                                    ? "text-slate-400"
                                    : row.authenticityScore >= 80
                                      ? "text-emerald-700"
                                      : row.authenticityScore >= 50
                                        ? "text-amber-700"
                                        : "text-rose-700"
                                }`}
                              >
                                {row.authenticityScore ?? "—"}
                                {row.authenticityScore != null ? (
                                  <span className="text-xs font-semibold text-slate-400">/100</span>
                                ) : null}
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-right">
                              <div className="text-[10px] uppercase tracking-wide text-slate-400">Grade</div>
                              <div className="text-lg font-black tabular-nums text-slate-900">
                                {row.grade != null ? row.grade : "—"}
                                {row.grade != null ? (
                                  <span className="text-xs font-semibold text-slate-400">/{row.maxScore}</span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/instructor/review/${row.documentId}`}
                          className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                        >
                          Open review studio
                        </Link>
                        <Link
                          href={`/instructor/report/${row.documentId}`}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Evidence report
                        </Link>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-400">
                        Submitted {formatWhen(row.submittedAt)}
                        {row.decision && row.decision !== "pending" ? ` · Decision: ${row.decision}` : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <aside className="border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Queue summary</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Submissions", String(summary?.total ?? rows.length)],
                    ["Sealed", String(summary?.sealed ?? rows.filter((r) => r.sealed).length)],
                    [
                      "Avg authenticity",
                      summary?.avgAuthenticity != null ? `${summary.avgAuthenticity}%` : "—",
                    ],
                    ["Avg grade", summary?.avgGrade != null ? String(summary.avgGrade) : "—"],
                    ["Needs review", String(summary?.needsReview ?? "—")],
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
                  disabled={!rows.length}
                  className="mt-6 w-full rounded-full bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  Download entire class
                </button>
                <p className="mt-3 text-[11px] leading-5 text-slate-500">
                  Export includes student identity, authenticity scores, grades, decisions, and review studio links.
                </p>
              </aside>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

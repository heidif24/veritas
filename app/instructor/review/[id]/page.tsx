"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VeritasMark } from "@/app/components/veritas-logo";

type Decision = "pending" | "accepted" | "revision_requested" | "referred";

export default function FacultyReviewPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState<Decision>("pending");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (res.ok) setReport(data.report);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function saveDecision() {
    const res = await fetch(`/api/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: id, decision, notes }),
    });
    if (res.ok) setMessage("Decision recorded.");
    else setMessage("Could not save decision.");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading review workspace…
      </div>
    );
  }

  const summary = (report?.summary || {}) as { overall?: string; headline?: string; sealed?: boolean };
  const composition = (report?.composition || {}) as { aiRiskScore?: number; aiRiskLabel?: string };
  const similarity = (report?.similarity || {}) as { score?: number; threshold?: number };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <VeritasMark />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">Faculty review</p>
              <h1 className="text-lg font-semibold">{String((report as { title?: string })?.title || "Submission")}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/app/report/${id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
              Full evidence
            </Link>
            <Link href="/instructor/courses" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
              Courses
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assessment snapshot</p>
            <p className="mt-2 text-xl font-semibold tracking-tight">{summary.headline || "—"}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Overall</p>
                <p className="font-bold capitalize">{summary.overall || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Authorship</p>
                <p className="font-bold">{composition.aiRiskScore ?? "—"}% · {composition.aiRiskLabel}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Similarity</p>
                <p className="font-bold">
                  {similarity.score ?? 0}% / {similarity.threshold ?? 20}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Decision</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["accepted", "Accept"],
                  ["revision_requested", "Request revision"],
                  ["referred", "Refer to integrity office"],
                  ["pending", "Keep pending"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDecision(value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                    decision === value
                      ? "bg-violet-600 text-white ring-violet-600"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reviewer notes (visible to integrity office if referred)"
              className="mt-4 min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void saveDecision()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500"
              >
                Save decision
              </button>
              {message ? <span className="text-xs text-emerald-700">{message}</span> : null}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custody</p>
            <p className="mt-2 text-sm text-slate-600">{summary.sealed ? "Cryptographically sealed." : "Not sealed."}</p>
            <Link href={`/app/editor/${id}`} className="mt-3 inline-block text-xs font-semibold text-cyan-700 hover:underline">
              Open in Integrity Studio →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-white p-5 text-xs leading-5 text-slate-600">
            Faculty decisions should weigh process evidence, similarity context, and course policy. Veritas does not issue
            misconduct findings automatically.
          </div>
        </aside>
      </main>
    </div>
  );
}

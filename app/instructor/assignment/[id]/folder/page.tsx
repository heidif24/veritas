"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleShell, INSTRUCTOR_NAV } from "@/app/components/role-shell";

type SubmissionRow = {
  submissionId: string;
  documentId: string;
  authorName: string;
  authorEmail: string;
  documentTitle: string;
  attemptNumber: number;
  similarityScore: number | null;
  aiScore: number | null;
  aiLabel: string | null;
  healthScore: number | null;
  submittedAt: string;
};

export default function InstructorFolderPage() {
  const params = useParams();
  const assignmentId = String(params?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("Assignment folder");
  const [dueAt, setDueAt] = useState<string | null>(null);
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [dueInput, setDueInput] = useState("");
  const [savingDue, setSavingDue] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;
    setLoading(true);
    void fetch(`/api/assignments/${encodeURIComponent(assignmentId)}/folder`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setTitle(data.assignment?.title || "Assignment folder");
        setDueAt(data.assignment?.dueAt ?? null);
        if (data.assignment?.dueAt) {
          try {
            setDueInput(new Date(data.assignment.dueAt).toISOString().slice(0, 16));
          } catch {
            /* */
          }
        }
        setRows(data.submissions || []);
      })
      .catch(() => setError("Could not load folder"))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  async function saveDeadline() {
    setSavingDue(true);
    setError("");
    try {
      const body = { dueAt: dueInput ? new Date(dueInput).toISOString() : null };
      const res = await fetch(`/api/assignments/${encodeURIComponent(assignmentId)}/deadline`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Failed to update deadline");
      else setDueAt(data.assignment?.due_at ?? body.dueAt);
    } catch {
      setError("Network error");
    } finally {
      setSavingDue(false);
    }
  }

  return (
    <RoleShell roleLabel="Instructor" title={title} nav={INSTRUCTOR_NAV}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deadline</p>
            <p className="mt-1 text-sm text-slate-700">
              {dueAt ? new Date(dueAt).toLocaleString() : "No due date set"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="datetime-local"
              value={dueInput}
              onChange={(e) => setDueInput(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => void saveDeadline()}
              disabled={savingDue}
              className="rounded-xl bg-[#167451] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingDue ? "Saving…" : "Set / extend deadline"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
        ) : null}

        {loading ? (
          <p className="text-sm text-slate-500">Loading submissions…</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Attempt</th>
                  <th className="px-4 py-3">Similarity</th>
                  <th className="px-4 py-3">AI risk</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No submissions yet for this assignment.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.submissionId} className="border-b border-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{r.authorName}</div>
                        <div className="text-xs text-slate-500">{r.authorEmail}</div>
                      </td>
                      <td className="px-4 py-3">{r.documentTitle}</td>
                      <td className="px-4 py-3">{r.attemptNumber}</td>
                      <td className="px-4 py-3">
                        {r.similarityScore != null ? `${Math.round(Number(r.similarityScore))}%` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {r.aiScore != null ? (
                          <span>
                            {Math.round(Number(r.aiScore))}
                            {r.aiLabel ? ` (${r.aiLabel})` : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Link href="/instructor/assignments" className="text-sm font-semibold text-[#167451] hover:underline">
          ← All assignments
        </Link>
      </div>
    </RoleShell>
  );
}

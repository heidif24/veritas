"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleShell, STUDENT_NAV } from "@/app/components/role-shell";

type ResultsPayload = {
  message?: string;
  attemptNumber?: number;
  attemptInfo?: { remainingAttempts?: number; maxAttempts?: number; canSubmit?: boolean; reason?: string };
  similarity?: {
    overallScore?: number;
    threshold?: number;
    matchedSegments?: Array<{ snippet?: string; sourceTitle?: string; similarityPercentage?: number }>;
    bySource?: Array<{ title?: string; score?: number }>;
  };
  ai?: {
    overallScore?: number;
    label?: string;
    summary?: string;
    factors?: string[];
    segments?: Array<{ text?: string; risk?: string; reason?: string }>;
    methodology?: string;
  };
  plainText?: string;
};

export default function StudentResultsPage() {
  const params = useParams();
  const assignmentId = String(params?.id ?? "");
  const [data, setData] = useState<ResultsPayload | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`veritas-results-${assignmentId}`);
      if (raw) setData(JSON.parse(raw) as ResultsPayload);
    } catch {
      /* empty */
    }
  }, [assignmentId]);

  const sim = data?.similarity?.overallScore ?? 0;
  const aiScore = data?.ai?.overallScore ?? 0;
  const aiLabel = data?.ai?.label ?? "—";

  const highlights = useMemo(() => {
    const segs = data?.ai?.segments || [];
    return segs.filter((s) => s.risk === "moderate" || s.risk === "high").slice(0, 12);
  }, [data]);

  return (
    <RoleShell roleLabel="Student" title="Submission results" nav={STUDENT_NAV}>
      <div className="mx-auto max-w-3xl space-y-6">
        {!data ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No results found for this session. Submit from the editor (with an assignment open) to see scores here.
            <div className="mt-4">
              <Link href="/student" className="text-[#167451] font-semibold hover:underline">
                Back to student home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              {data.message || "Submission recorded."}
              {data.attemptInfo ? (
                <span className="ml-2 text-emerald-800">
                  Attempt {data.attemptNumber ?? "—"} of {data.attemptInfo.maxAttempts ?? 3}.{" "}
                  {data.attemptInfo.remainingAttempts ?? 0} remaining.
                </span>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Similarity</p>
                <p className="mt-2 font-display text-4xl text-[var(--ink)]">{Math.round(sim)}%</p>
                <p className="mt-1 text-xs text-slate-500">
                  Threshold {data.similarity?.threshold ?? 25}% · institutional index
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI-assistance risk</p>
                <p className="mt-2 font-display text-4xl text-[var(--ink)]">{Math.round(aiScore)}</p>
                <p className="mt-1 text-xs text-slate-500">Label: {aiLabel}</p>
              </div>
            </div>

            {data.ai?.summary ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
                <p className="font-semibold text-[var(--ink)]">Summary</p>
                <p className="mt-2">{data.ai.summary}</p>
                {data.ai.factors?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
                    {data.ai.factors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                ) : null}
                {data.ai.methodology ? (
                  <p className="mt-3 text-xs text-slate-400">{data.ai.methodology}</p>
                ) : null}
              </div>
            ) : null}

            {highlights.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-semibold text-[var(--ink)]">Highlighted spans</p>
                <ul className="mt-3 space-y-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="rounded-xl border border-amber-100 bg-amber-50/60 p-3 text-sm">
                      <span className="text-xs font-semibold uppercase text-amber-800">{h.risk}</span>
                      <p className="mt-1 text-slate-800">{h.text}</p>
                      {h.reason ? <p className="mt-1 text-xs text-slate-500">{h.reason}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {data.similarity?.matchedSegments?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-semibold text-[var(--ink)]">Similarity matches</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {data.similarity.matchedSegments.slice(0, 8).map((m, i) => (
                    <li key={i} className="rounded-lg border border-slate-100 px-3 py-2">
                      <span className="font-medium">{Math.round(m.similarityPercentage || 0)}%</span>
                      {m.sourceTitle ? <span className="text-slate-500"> · {m.sourceTitle}</span> : null}
                      {m.snippet ? <p className="mt-1 text-slate-600">{m.snippet}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex gap-3">
              <Link href="/student" className="rounded-xl bg-[#167451] px-4 py-2 text-sm font-semibold text-white">
                Student home
              </Link>
              {data.attemptInfo?.canSubmit ? (
                <Link href="/app/dashboard" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  Edit & resubmit
                </Link>
              ) : null}
            </div>
          </>
        )}
      </div>
    </RoleShell>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleShell, STUDENT_NAV } from "@/app/components/role-shell";
import { buildHighlightedHtml, downloadHighlightedHtml } from "@/lib/highlighted-document";

type Segment = {
  start?: number;
  end?: number;
  text?: string;
  snippet?: string;
  sourceTitle?: string;
  similarityPercentage?: number;
  risk?: string;
  reason?: string;
};

type ResultsPayload = {
  message?: string;
  attemptNumber?: number;
  documentId?: string;
  plainText?: string;
  documentTitle?: string;
  attemptInfo?: {
    remainingAttempts?: number;
    maxAttempts?: number;
    canSubmit?: boolean;
    reason?: string;
    attemptCount?: number;
  };
  similarity?: {
    overallScore?: number;
    threshold?: number;
    matchedSegments?: Segment[];
    bySource?: Array<{ title?: string; score?: number }>;
  };
  ai?: {
    overallScore?: number;
    label?: string;
    summary?: string;
    factors?: string[];
    segments?: Segment[];
    methodology?: string;
  };
};

const SOURCE_COLORS = ["#ffe08a", "#ffc09a", "#f7b6d2", "#b9ddff", "#c8f0c0", "#e0c8ff", "#ffd6a5"];

function paint(text: string, spans: Array<{ start: number; end: number; color: string; label: string }>) {
  if (!text) return [];
  const clean = spans
    .map((s) => ({
      ...s,
      start: Math.max(0, Math.min(text.length, s.start)),
      end: Math.max(0, Math.min(text.length, s.end)),
    }))
    .filter((s) => s.end > s.start);
  const points = new Set<number>([0, text.length]);
  for (const s of clean) {
    points.add(s.start);
    points.add(s.end);
  }
  const sorted = [...points].sort((a, b) => a - b);
  const out: Array<{ text: string; color?: string; label?: string }> = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const hit = clean.find((s) => s.start <= a && s.end >= b);
    const slice = text.slice(a, b);
    if (!slice) continue;
    out.push({ text: slice, color: hit?.color, label: hit?.label });
  }
  return out;
}

export default function StudentResultsPage() {
  const params = useParams();
  const assignmentId = String(params?.id ?? "");
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [mode, setMode] = useState<"similarity" | "ai">("similarity");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    let cached: ResultsPayload | null = null;
    try {
      const raw = sessionStorage.getItem(`veritas-results-${assignmentId}`);
      if (raw) cached = JSON.parse(raw) as ResultsPayload;
    } catch {
      cached = null;
    }
    if (cached) setData(cached);
    void fetch(`/api/assignments/${encodeURIComponent(assignmentId)}/result`)
      .then((r) => r.json())
      .then((payload) => {
        if (!payload?.submission) return;
        const sim = payload.submission.similarity || {};
        const ai = payload.submission.ai || {};
        setData({
          message: cached?.message,
          documentTitle: cached?.documentTitle,
          attemptNumber: payload.submission.attemptNumber,
          documentId: payload.submission.documentId,
          plainText: payload.submission.plainText || cached?.plainText,
          attemptInfo: payload.attemptInfo,
          similarity: {
            overallScore: payload.submission.similarityScore ?? sim.overallSimilarityScore ?? sim.overallScore,
            threshold: Math.round(
              ((sim.threshold ?? 0.25) > 1 ? (sim.threshold ?? 25) / 100 : (sim.threshold ?? 0.25)) * 100,
            ),
            matchedSegments: sim.matchedSegments || sim.matches,
            bySource: sim.bySource,
          },
          ai: {
            overallScore: payload.submission.aiScore ?? ai.overallScore,
            label: payload.submission.aiLabel || ai.label,
            summary: ai.summary,
            factors: ai.factors,
            segments: ai.segments,
            methodology: ai.methodology,
          },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assignmentId]);

  const plain = data?.plainText || "";
  const sim = data?.similarity?.overallScore ?? 0;
  const aiScore = data?.ai?.overallScore ?? 0;
  const aiLabel = data?.ai?.label ?? "—";

  const sourceColor = useMemo(() => {
    const map = new Map<string, string>();
    const titles = (data?.similarity?.matchedSegments || []).map((m) => m.sourceTitle || "Match");
    titles.forEach((title) => {
      if (!map.has(title)) map.set(title, SOURCE_COLORS[map.size % SOURCE_COLORS.length]);
    });
    return map;
  }, [data]);

  const pieces = useMemo(() => {
    if (mode === "similarity") {
      const spans = (data?.similarity?.matchedSegments || [])
        .filter((m) => typeof m.start === "number" && typeof m.end === "number")
        .map((m) => ({
          start: Number(m.start),
          end: Number(m.end),
          color: sourceColor.get(m.sourceTitle || "Match") || SOURCE_COLORS[0],
          label: `${m.sourceTitle || "Source"} · ${Math.round(m.similarityPercentage || 0)}%`,
        }));
      return paint(plain, spans);
    }
    const spans = (data?.ai?.segments || [])
      .filter((m) => typeof m.start === "number" && typeof m.end === "number" && m.risk !== "low")
      .map((m) => ({
        start: Number(m.start),
        end: Number(m.end),
        color: m.risk === "high" ? "#fecaca" : "#fde68a",
        label: `${m.risk} AI signal${m.reason ? ` — ${m.reason}` : ""}`,
      }));
    return paint(plain, spans);
  }, [mode, data, plain, sourceColor]);

  async function handleDownloadHighlighted() {
    setDownloadError("");
    setDownloading(true);
    try {
      const res = await fetch(`/api/assignments/${encodeURIComponent(assignmentId)}/highlighted-report`);
      if (res.ok) {
        const blob = await res.blob();
        const cd = res.headers.get("Content-Disposition") || "";
        const match = /filename="([^"]+)"/.exec(cd);
        const filename = match?.[1] || "veritas-highlighted.html";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }

      if (!data) {
        setDownloadError("No submission found to highlight yet.");
        return;
      }
      const html = buildHighlightedHtml({
        title: data.documentTitle || "Submission review",
        plainText: plain || "Full text was not available for this session.",
        similarityScore: data.similarity?.overallScore,
        aiScore: data.ai?.overallScore,
        aiLabel: data.ai?.label,
        attemptNumber: data.attemptNumber,
        maxAttempts: data.attemptInfo?.maxAttempts,
        similarityMatches: data.similarity?.matchedSegments,
        aiSegments: data.ai?.segments,
      });
      const safeName = (data.documentTitle || "veritas-highlighted")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/-+/g, "-")
        .slice(0, 60);
      downloadHighlightedHtml(`${safeName}-highlighted.html`, html);
    } catch {
      setDownloadError("Download failed. Try again in a moment.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <RoleShell roleLabel="Student" title="Submission results" nav={STUDENT_NAV}>
      <div className="mx-auto max-w-4xl space-y-6">
        {loading && !data ? (
          <p className="text-sm text-slate-500">Loading your checks…</p>
        ) : !data ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <p>No results yet. Submit from the editor to run the similarity check and then the AI check.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleDownloadHighlighted()}
                disabled={downloading}
                className="rounded-xl bg-[#167451] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {downloading ? "Preparing…" : "Download highlighted report"}
              </button>
              <Link href="/student" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                Student home
              </Link>
            </div>
            {downloadError ? <p className="mt-3 text-sm text-rose-700">{downloadError}</p> : null}
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              {data.message || "Submission recorded. Similarity was checked first, then the AI-assistance check."}
              <span className="ml-2">
                Attempt {data.attemptNumber ?? data.attemptInfo?.attemptCount ?? "—"} of {data.attemptInfo?.maxAttempts ?? 3}.{" "}
                {data.attemptInfo?.remainingAttempts ?? 0} edit{data.attemptInfo?.remainingAttempts === 1 ? "" : "s"} left.
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Similarity</p>
                <p className="mt-2 font-display text-4xl text-[var(--ink)]">{Math.round(sim)}%</p>
                <p className="mt-1 text-xs text-slate-500">
                  Colour matches · threshold {data.similarity?.threshold ?? 25}%
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI checker</p>
                <p className="mt-2 font-display text-4xl text-[var(--ink)]">{Math.round(aiScore)}</p>
                <p className="mt-1 text-xs text-slate-500">Label: {aiLabel}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("similarity")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "similarity" ? "bg-amber-400 text-slate-900" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
              >
                Similarity highlights
              </button>
              <button
                type="button"
                onClick={() => setMode("ai")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "ai" ? "bg-rose-400 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
              >
                AI highlights
              </button>
              <button
                type="button"
                onClick={() => void handleDownloadHighlighted()}
                disabled={downloading}
                className="rounded-full bg-[#167451] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {downloading ? "Preparing…" : "Download highlighted report"}
              </button>
            </div>
            {downloadError ? <p className="text-sm text-rose-700">{downloadError}</p> : null}

            {mode === "similarity" && sourceColor.size ? (
              <div className="flex flex-wrap gap-2 text-xs">
                {[...sourceColor.entries()].map(([title, color]) => (
                  <span key={title} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                    <span className="h-3 w-3 rounded-sm" style={{ background: color }} />
                    {title}
                  </span>
                ))}
              </div>
            ) : null}
            {mode === "ai" ? (
              <div className="flex gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#fde68a]" /> Moderate
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#fecaca]" /> High
                </span>
              </div>
            ) : null}

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your submission</p>
              <p className="mt-4 whitespace-pre-wrap font-serif text-[15px] leading-7 text-slate-800">
                {pieces.length
                  ? pieces.map((p, i) =>
                      p.color ? (
                        <mark key={i} title={p.label} style={{ background: p.color }} className="rounded-sm px-0.5">
                          {p.text}
                        </mark>
                      ) : (
                        <span key={i}>{p.text}</span>
                      ),
                    )
                  : plain || "The checked text will appear here."}
              </p>
            </article>

            {data.ai?.summary ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
                <p className="font-semibold text-[var(--ink)]">AI check summary</p>
                <p className="mt-2">{data.ai.summary}</p>
                {data.ai.factors?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
                    {data.ai.factors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-xl bg-[#167451] px-4 py-2 text-sm font-semibold text-white">
                Student home
              </Link>
              {data.attemptInfo?.canSubmit && data.documentId ? (
                <Link
                  href={`/app/editor/${encodeURIComponent(data.documentId)}?assignment=${encodeURIComponent(assignmentId)}`}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Edit highlighted parts & resubmit
                </Link>
              ) : (
                <p className="self-center text-sm text-slate-500">
                  {data.attemptInfo?.reason || "No further submissions are allowed."}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </RoleShell>
  );
}

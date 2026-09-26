"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildClientHashPayload } from "@/lib/plagiarism/chunker";

export type PlagiarismMatch = {
  startOffset: number;
  endOffset: number;
  matchedSourceUrl: string;
  sourceTitle?: string;
  similarityPercentage: number;
  snippet: string;
};

type Props = {
  documentId: string;
  text: string;
  enabled?: boolean;
  onChange?: (result: { score: number; threshold: number; blocked: boolean; matches: PlagiarismMatch[] }) => void;
  onApply?: (match: PlagiarismMatch, mode: "quote" | "paraphrase") => void;
};

export function PlagiarismSidebar({ documentId, text, enabled = true, onChange, onApply }: Props) {
  const [matches, setMatches] = useState<PlagiarismMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PlagiarismMatch | null>(null);
  const [threshold, setThreshold] = useState(20);
  const [score, setScore] = useState(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!enabled || !text.trim()) {
      setMatches([]);
      setSelected(null);
      setScore(0);
      onChangeRef.current?.({ score: 0, threshold: 20, blocked: false, matches: [] });
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const hashPayload = await buildClientHashPayload(text);
        const response = await fetch("/api/plagiarism/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, text, ...hashPayload }),
        });

        if (!response.ok) {
          setMatches([]);
          setSelected(null);
          setScore(0);
          onChangeRef.current?.({ score: 0, threshold: 20, blocked: false, matches: [] });
          return;
        }

        const result = await response.json();
        const nextMatches = Array.isArray(result?.matchedSegments) ? result.matchedSegments : [];
        const nextScore = Number(result?.overallSimilarityScore ?? 0);
        const nextThreshold = Number(result?.similarityThreshold ?? 20);
        setMatches(nextMatches);
        setSelected(nextMatches[0] ?? null);
        setScore(nextScore);
        setThreshold(nextThreshold);
        onChangeRef.current?.({
          score: nextScore,
          threshold: nextThreshold,
          blocked: nextScore >= nextThreshold,
          matches: nextMatches,
        });
      } finally {
        setLoading(false);
      }
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [enabled, text, documentId]);

  const overall = useMemo(() => {
    if (score) return Math.round(score);
    if (!matches.length) return 0;
    return Math.round(matches.reduce((total, match) => total + match.similarityPercentage, 0) / matches.length);
  }, [matches, score]);

  const blocked = overall >= threshold;

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-3 text-slate-800">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Similarity</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            loading
              ? "bg-slate-100 text-slate-600"
              : blocked
                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                : overall > threshold * 0.5
                  ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          }`}
        >
          {loading ? "Checking…" : `${overall}%`}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-500">
          <span>Overall</span>
          <span>
            {overall}% / {threshold}% limit
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <span
            className={`block h-full rounded-full ${
              blocked ? "bg-red-500" : overall > threshold * 0.5 ? "bg-amber-400" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(overall, 100)}%` }}
          />
        </div>
        {blocked ? (
          <p className="mt-2 text-[11px] font-medium text-red-700">Above threshold — seal is blocked until resolved.</p>
        ) : (
          <p className="mt-2 text-[11px] text-slate-500">Within institutional threshold.</p>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {matches.length ? (
          matches.map((match) => (
            <button
              key={`${match.matchedSourceUrl}-${match.startOffset}`}
              type="button"
              onClick={() => setSelected(match)}
              className={`w-full rounded-lg border p-2.5 text-left ${
                match.similarityPercentage > 15
                  ? "border-amber-200 bg-amber-50/80"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{match.similarityPercentage > 15 ? "Flagged" : "Review"}</span>
                <span className="font-semibold text-amber-800">{match.similarityPercentage}%</span>
              </div>
              <p className="mt-1 line-clamp-3 text-xs text-slate-700">{match.snippet}</p>
            </button>
          ))
        ) : (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-2.5 text-xs text-emerald-800">
            No clear similarity issues in the current draft.
          </div>
        )}
      </div>

      {selected ? (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Matched source</p>
          {selected.sourceTitle ? <p className="mt-1 text-xs font-semibold text-slate-900">{selected.sourceTitle}</p> : null}
          <a href={selected.matchedSourceUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-cyan-700 hover:underline">
            {selected.matchedSourceUrl}
          </a>
          <p className="mt-2 text-xs leading-5 text-slate-700">{selected.snippet}</p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => onApply?.(selected, "quote")} className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white">
              Quote & cite
            </button>
            <button type="button" onClick={() => onApply?.(selected, "paraphrase")} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700">
              Paraphrase
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

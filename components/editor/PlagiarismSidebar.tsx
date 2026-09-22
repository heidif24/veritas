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
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!enabled || !text.trim()) {
      setMatches([]);
      setSelected(null);
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
          onChangeRef.current?.({ score: 0, threshold: 20, blocked: false, matches: [] });
          return;
        }

        const result = await response.json();
        const nextMatches = Array.isArray(result?.matchedSegments) ? result.matchedSegments : [];
        setMatches(nextMatches);
        setSelected(nextMatches[0] ?? null);

        const score = Number(result?.overallSimilarityScore ?? 0);
        const threshold = Number(result?.similarityThreshold ?? 20);
        onChangeRef.current?.({
          score,
          threshold,
          blocked: score >= threshold,
          matches: nextMatches,
        });
      } finally {
        setLoading(false);
      }
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [enabled, text]);

  const overall = useMemo(() => {
    if (!matches.length) return 0;
    return Math.round(matches.reduce((total, match) => total + match.similarityPercentage, 0) / matches.length);
  }, [matches]);

  return (
    <aside className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200">Originality health</p>
        <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-100">{loading ? "Checking" : `${overall}%`}</span>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
          <span>Similarity</span>
          <span>{overall}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-800">
          <span className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ width: `${Math.min(overall, 100)}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {matches.length ? matches.map((match) => (
          <button
            key={`${match.matchedSourceUrl}-${match.startOffset}`}
            type="button"
            onClick={() => setSelected(match)}
            className={`w-full rounded-2xl border p-3 text-left ${match.similarityPercentage > 15 ? "border-amber-500/30 bg-amber-500/10" : "border-white/10 bg-slate-950/40"}`}
          >
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{match.similarityPercentage > 15 ? "Flagged" : "Review"}</span>
              <span className="text-amber-200">{match.similarityPercentage}%</span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-slate-200">{match.snippet}</p>
          </button>
        )) : (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            No clear similarity issues detected in the current draft.
          </div>
        )}
      </div>

      {selected ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Matched source</p>
          {selected.sourceTitle ? <p className="mt-2 text-sm font-semibold text-white">{selected.sourceTitle}</p> : null}
          <a href={selected.matchedSourceUrl} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-cyan-200 hover:text-cyan-100">{selected.matchedSourceUrl}</a>
          <p className="mt-3 text-sm leading-6 text-slate-200">{selected.snippet}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => onApply?.(selected, "quote")} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-950">Quote & cite</button>
            <button type="button" onClick={() => onApply?.(selected, "paraphrase")} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white">Paraphrase</button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

/**
 * Citation-aware matching + patchwork / paraphrase-oriented span detection.
 */

import { buildWindowHashes, tokenize, type PlagiarismMatch } from "./chunker";

export type SourceDoc = {
  id: string;
  title: string;
  content: string;
  url?: string;
};

export type AdvancedMatch = PlagiarismMatch & {
  cited: boolean;
  matchKind: "exact-window" | "paraphrase-overlap" | "patchwork";
  sourceShare: number;
};

export type AdvancedSimilarityResult = {
  overallScore: number;
  uncitedScore: number;
  citedScore: number;
  matches: AdvancedMatch[];
  bySource: Array<{ sourceId: string; title: string; percent: number; uncitedPercent: number }>;
  checkedWords: number;
};

function extractCitedSpans(text: string): Array<{ start: number; end: number }> {
  const spans: Array<{ start: number; end: number }> = [];
  const lines = text.split("\n");
  let offset = 0;
  for (const line of lines) {
    if (/^\s*>/.test(line) || /"([^"]{20,})"/.test(line)) {
      spans.push({ start: offset, end: offset + line.length });
    }
    offset += line.length + 1;
  }
  const citeRe = /\((?:[A-Z][a-z]+(?:\s+(?:&|and)\s+[A-Z][a-z]+)*,?\s*)+\d{4}[a-z]?\)/g;
  let m: RegExpExecArray | null;
  while ((m = citeRe.exec(text))) {
    spans.push({ start: Math.max(0, m.index - 120), end: Math.min(text.length, m.index + m[0].length) });
  }
  return spans;
}

function isInsideCited(offset: number, cited: Array<{ start: number; end: number }>) {
  return cited.some((s) => offset >= s.start && offset <= s.end);
}

function jaccardWords(a: string, b: string) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  return inter / (A.size + B.size - inter);
}

export function advancedSimilarityCheck(text: string, sources: SourceDoc[]): AdvancedSimilarityResult {
  const checkedWords = tokenize(text).length;
  if (!checkedWords || !sources.length) {
    return { overallScore: 0, uncitedScore: 0, citedScore: 0, matches: [], bySource: [], checkedWords };
  }

  const citedSpans = extractCitedSpans(text);
  const candidateHashes = buildWindowHashes(text, 5);
  const matches: AdvancedMatch[] = [];
  const sourceAgg = new Map<string, { title: string; hits: number; uncitedHits: number; total: number }>();

  for (const source of sources) {
    const sourceHashes = buildWindowHashes(source.content, 5);
    const sourceSet = new Set(sourceHashes);
    let shared = 0;
    for (const h of candidateHashes) if (sourceSet.has(h)) shared += 1;

    if (shared > 0) {
      const score = Math.min(100, Math.round((shared / Math.max(1, Math.min(candidateHashes.length, sourceHashes.length))) * 100));
      const snippetStart = Math.max(0, text.toLowerCase().indexOf(tokenize(text).slice(0, 8).join(" ").toLowerCase()));
      const cited = isInsideCited(snippetStart, citedSpans);
      matches.push({
        startOffset: snippetStart,
        endOffset: Math.min(text.length, snippetStart + 160),
        matchedSourceUrl: source.url || `internal://corpus/${source.id}`,
        similarityPercentage: score,
        snippet: text.slice(snippetStart, snippetStart + 160),
        sourceTitle: source.title,
        cited,
        matchKind: "exact-window",
        sourceShare: score,
      });
      sourceAgg.set(source.id, {
        title: source.title,
        hits: (sourceAgg.get(source.id)?.hits ?? 0) + score,
        uncitedHits: (sourceAgg.get(source.id)?.uncitedHits ?? 0) + (cited ? 0 : score),
        total: (sourceAgg.get(source.id)?.total ?? 0) + 1,
      });
    }

    const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 40);
    const sourceSentences = source.content.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 40);
    for (const sent of sentences.slice(0, 40)) {
      let best = 0;
      for (const ss of sourceSentences.slice(0, 80)) {
        const j = jaccardWords(sent, ss);
        if (j > best) best = j;
      }
      if (best >= 0.55) {
        const idx = text.indexOf(sent);
        const cited = isInsideCited(Math.max(0, idx), citedSpans);
        const pct = Math.round(best * 100);
        matches.push({
          startOffset: Math.max(0, idx),
          endOffset: Math.max(0, idx) + sent.length,
          matchedSourceUrl: source.url || `internal://corpus/${source.id}`,
          similarityPercentage: pct,
          snippet: sent.slice(0, 200),
          sourceTitle: source.title,
          cited,
          matchKind: best >= 0.72 ? "patchwork" : "paraphrase-overlap",
          sourceShare: pct,
        });
        const prev = sourceAgg.get(source.id) ?? { title: source.title, hits: 0, uncitedHits: 0, total: 0 };
        prev.hits += pct * 0.6;
        prev.uncitedHits += cited ? 0 : pct * 0.6;
        prev.total += 1;
        sourceAgg.set(source.id, prev);
      }
    }
  }

  matches.sort((a, b) => b.similarityPercentage - a.similarityPercentage);
  const top = matches.slice(0, 15);
  const uncited = top.filter((m) => !m.cited);
  const cited = top.filter((m) => m.cited);
  const avg = (arr: AdvancedMatch[]) =>
    arr.length ? Math.min(100, Math.round(arr.reduce((a, m) => a + m.similarityPercentage, 0) / arr.length)) : 0;

  const bySource = [...sourceAgg.entries()]
    .map(([sourceId, v]) => ({
      sourceId,
      title: v.title,
      percent: Math.min(100, Math.round(v.hits / Math.max(1, v.total))),
      uncitedPercent: Math.min(100, Math.round(v.uncitedHits / Math.max(1, v.total))),
    }))
    .sort((a, b) => b.uncitedPercent - a.uncitedPercent);

  return {
    overallScore: avg(top),
    uncitedScore: avg(uncited),
    citedScore: avg(cited),
    matches: top,
    bySource,
    checkedWords,
  };
}

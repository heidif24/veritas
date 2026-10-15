/**
 * Build a downloadable HTML document with colour highlights for similarity
 * matches and AI-risk segments — Turnitin-style offline review for students.
 * Additive only; does not alter telemetry or submission policy.
 */

export type HighlightSpan = {
  start: number;
  end: number;
  kind: "similarity" | "ai-moderate" | "ai-high";
  label?: string;
  detail?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

/** Merge overlapping ranges; higher priority kinds win (ai-high > ai-moderate > similarity). */
function mergeSpans(spans: HighlightSpan[]): HighlightSpan[] {
  if (!spans.length) return [];
  const priority = { "ai-high": 3, "ai-moderate": 2, similarity: 1 } as const;
  const sorted = [...spans]
    .filter((s) => s.end > s.start && s.start >= 0)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const out: HighlightSpan[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (!last || s.start >= last.end) {
      out.push({ ...s });
      continue;
    }
    // Overlap: keep higher priority, split if needed
    if (priority[s.kind] > priority[last.kind]) {
      if (s.start > last.start) {
        last.end = s.start;
        out.push({ ...s });
      } else {
        out[out.length - 1] = { ...s, end: Math.max(s.end, last.end) };
      }
    } else if (s.end > last.end) {
      out.push({ ...s, start: last.end });
    }
  }
  return out;
}

export function buildHighlightedHtml(input: {
  title?: string;
  plainText: string;
  similarityScore?: number;
  aiScore?: number;
  aiLabel?: string;
  attemptNumber?: number;
  maxAttempts?: number;
  similarityMatches?: Array<{
    start?: number;
    end?: number;
    snippet?: string;
    sourceTitle?: string;
    similarityPercentage?: number;
  }>;
  aiSegments?: Array<{
    start?: number;
    end?: number;
    text?: string;
    risk?: string;
    reason?: string;
  }>;
}): string {
  const text = input.plainText || "";
  const spans: HighlightSpan[] = [];

  for (const m of input.similarityMatches || []) {
    let start = typeof m.start === "number" ? m.start : -1;
    let end = typeof m.end === "number" ? m.end : -1;
    if (start < 0 && m.snippet) {
      const idx = text.indexOf(m.snippet);
      if (idx >= 0) {
        start = idx;
        end = idx + m.snippet.length;
      }
    }
    if (start >= 0 && end > start) {
      spans.push({
        start,
        end: Math.min(end, text.length),
        kind: "similarity",
        label: m.sourceTitle || "Similarity match",
        detail: m.similarityPercentage != null ? `${Math.round(m.similarityPercentage)}% similar` : undefined,
      });
    }
  }

  for (const seg of input.aiSegments || []) {
    const risk = (seg.risk || "").toLowerCase();
    if (risk !== "moderate" && risk !== "high") continue;
    let start = typeof seg.start === "number" ? seg.start : -1;
    let end = typeof seg.end === "number" ? seg.end : -1;
    if (start < 0 && seg.text) {
      const idx = text.indexOf(seg.text);
      if (idx >= 0) {
        start = idx;
        end = idx + seg.text.length;
      }
    }
    if (start >= 0 && end > start) {
      spans.push({
        start,
        end: Math.min(end, text.length),
        kind: risk === "high" ? "ai-high" : "ai-moderate",
        label: risk === "high" ? "Elevated AI-risk span" : "Moderate AI-risk span",
        detail: seg.reason,
      });
    }
  }

  const merged = mergeSpans(spans);
  let body = "";
  let cursor = 0;
  for (const s of merged) {
    if (s.start > cursor) {
      body += escapeHtml(text.slice(cursor, s.start));
    }
    const cls =
      s.kind === "similarity"
        ? "hl-sim"
        : s.kind === "ai-high"
          ? "hl-ai-high"
          : "hl-ai-mod";
    const title = [s.label, s.detail].filter(Boolean).join(" — ");
    body += `<mark class="${cls}" title="${escapeHtml(title)}">${escapeHtml(text.slice(s.start, s.end))}</mark>`;
    cursor = s.end;
  }
  if (cursor < text.length) body += escapeHtml(text.slice(cursor));

  // Preserve simple paragraph breaks
  body = body.replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br/>");

  const sim = input.similarityScore != null ? Math.round(input.similarityScore) : null;
  const ai = input.aiScore != null ? Math.round(input.aiScore) : null;
  const generated = new Date().toLocaleString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(input.title || "Veritas highlighted report")}</title>
<style>
  :root { --ink: #0f172a; --muted: #64748b; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: var(--ink); max-width: 720px; margin: 0 auto; padding: 32px 20px 64px; line-height: 1.65; font-size: 12pt; }
  h1 { font-family: system-ui, sans-serif; font-size: 1.35rem; margin: 0 0 4px; }
  .meta { font-family: system-ui, sans-serif; font-size: 0.8rem; color: var(--muted); margin-bottom: 20px; }
  .scores { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; font-family: system-ui, sans-serif; }
  .score-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; min-width: 140px; }
  .score-card strong { display: block; font-size: 1.5rem; }
  .score-card span { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
  .legend { font-family: system-ui, sans-serif; font-size: 0.8rem; margin-bottom: 20px; padding: 12px 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; }
  .legend mark { padding: 1px 4px; border-radius: 3px; }
  .doc { border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 32px; background: #fff; }
  .doc p { margin: 0 0 0.9em; }
  mark.hl-sim { background: #fef08a; color: inherit; padding: 0 1px; border-radius: 2px; }
  mark.hl-ai-mod { background: #fed7aa; color: inherit; padding: 0 1px; border-radius: 2px; }
  mark.hl-ai-high { background: #fecaca; color: inherit; padding: 0 1px; border-radius: 2px; }
  .footer { margin-top: 28px; font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--muted); }
  @media print {
    body { padding: 12px; }
    .score-card, .legend { break-inside: avoid; }
  }
</style>
</head>
<body>
  <h1>${escapeHtml(input.title || "Submission review")}</h1>
  <p class="meta">Generated ${escapeHtml(generated)}${
    input.attemptNumber != null
      ? ` · Attempt ${input.attemptNumber}${input.maxAttempts != null ? ` of ${input.maxAttempts}` : ""}`
      : ""
  }</p>

  <div class="scores">
    <div class="score-card">
      <span>Similarity</span>
      <strong>${sim != null ? sim + "%" : "—"}</strong>
    </div>
    <div class="score-card">
      <span>AI-assistance risk</span>
      <strong>${ai != null ? String(ai) : "—"}${input.aiLabel ? ` (${escapeHtml(input.aiLabel)})` : ""}</strong>
    </div>
  </div>

  <div class="legend">
    <strong>Colour key</strong> —
    <mark class="hl-sim">Yellow</mark> = similarity match with institutional / prior text ·
    <mark class="hl-ai-mod">Orange</mark> = moderate AI-risk span ·
    <mark class="hl-ai-high">Red</mark> = elevated AI-risk span.
    Hover a highlight for the reason. Edit the highlighted parts in your next attempt to improve scores.
  </div>

  <div class="doc"><p>${body || "<em>No text available.</em>"}</p></div>

  <p class="footer">
    Veritas highlighted report — for your revision only. These are process and similarity signals, not a misconduct finding.
    Download, review the coloured spans, revise offline or in the editor, then resubmit before the deadline if attempts remain.
  </p>
</body>
</html>`;
}

/** Trigger a browser download of the highlighted HTML. */
export function downloadHighlightedHtml(filename: string, html: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

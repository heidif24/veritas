/**
 * Privacy-preserving paste-origin classification.
 * Classifies pastes by size/timing only — never reads clipboard content.
 */

import type { CompositionOperation } from "@/lib/composition-health";

export type PasteClass = "micro" | "local-draft" | "external-bulk" | "unknown";

export type ClassifiedPaste = {
  timestamp: number;
  chars: number;
  classification: PasteClass;
  reason: string;
};

export type PasteOriginSummary = {
  totalPasteChars: number;
  microChars: number;
  localDraftChars: number;
  externalBulkChars: number;
  externalBulkEvents: number;
  externalBulkRatio: number;
  events: ClassifiedPaste[];
  notes: string[];
};

/** Heuristics (privacy-safe):
 *  - micro: ≤12 chars (likely autocorrect / short phrase)
 *  - local-draft: 13–80 chars, often after recent typing in same window
 *  - external-bulk: ≥80 chars, especially after idle or focus loss
 */
export function classifyPasteOrigins(
  ops: CompositionOperation[],
  focusLossTimestamps: number[] = [],
): PasteOriginSummary {
  const sorted = [...ops].sort((a, b) => a.timestamp - b.timestamp);
  const events: ClassifiedPaste[] = [];
  let micro = 0;
  let local = 0;
  let external = 0;
  let externalEvents = 0;

  let lastTypeAt: number | null = null;

  for (const op of sorted) {
    if (op.kind === "type") {
      lastTypeAt = op.timestamp;
      continue;
    }
    if (op.kind !== "paste") continue;

    const chars = op.chars;
    let classification: PasteClass = "unknown";
    let reason = "";

    const recentFocusLoss = focusLossTimestamps.some(
      (t) => op.timestamp - t >= 0 && op.timestamp - t < 20_000,
    );
    const recentTyping =
      lastTypeAt !== null && op.timestamp - lastTypeAt < 8_000;

    if (chars <= 12) {
      classification = "micro";
      reason = "Short paste (≤12 chars) — typical of autocorrect or phrase reuse.";
      micro += chars;
    } else if (chars < 80 && recentTyping && !recentFocusLoss) {
      classification = "local-draft";
      reason = "Medium paste during active typing — consistent with internal notes.";
      local += chars;
    } else if (chars >= 80 || recentFocusLoss) {
      classification = "external-bulk";
      reason =
        chars >= 80
          ? "Large paste (≥80 chars) — often external material."
          : "Paste shortly after focus loss — possible external source.";
      external += chars;
      externalEvents += 1;
    } else {
      classification = "local-draft";
      reason = "Medium paste without strong external signals.";
      local += chars;
    }

    events.push({ timestamp: op.timestamp, chars, classification, reason });
  }

  const total = micro + local + external || 1;
  const externalBulkRatio = external / total;

  const notes: string[] = [];
  if (externalEvents) notes.push(`${externalEvents} external-bulk paste event(s) (${external} chars).`);
  if (micro) notes.push(`${micro} chars classified as micro-pastes.`);
  if (local) notes.push(`${local} chars consistent with local drafting notes.`);
  if (!notes.length) notes.push("No paste activity recorded.");

  return {
    totalPasteChars: micro + local + external,
    microChars: micro,
    localDraftChars: local,
    externalBulkChars: external,
    externalBulkEvents: externalEvents,
    externalBulkRatio: Number(externalBulkRatio.toFixed(3)),
    events,
    notes,
  };
}

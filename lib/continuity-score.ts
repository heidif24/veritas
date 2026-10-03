/**
 * Writing-session continuity score.
 * Detects long gaps, sudden bursts after idle periods, and post-logout growth.
 */

import type { CompositionOperation } from "@/lib/composition-health";

export type ContinuityScore = {
  continuity: number; // 0–1, higher = more continuous drafting
  label: "continuous" | "interrupted" | "burst-after-gap" | "fragmented";
  totalSpanMs: number;
  activeWritingMs: number;
  idleGapCount: number;
  longestGapMs: number;
  postGapBurstChars: number;
  notes: string[];
};

const IDLE_GAP_MS = 30 * 60 * 1000; // 30 minutes
const BURST_WINDOW_MS = 15 * 60 * 1000; // 15 minutes after a gap

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export function scoreContinuity(ops: CompositionOperation[]): ContinuityScore {
  if (!ops.length) {
    return {
      continuity: 1,
      label: "continuous",
      totalSpanMs: 0,
      activeWritingMs: 0,
      idleGapCount: 0,
      longestGapMs: 0,
      postGapBurstChars: 0,
      notes: ["No composition events yet."],
    };
  }

  const sorted = [...ops].sort((a, b) => a.timestamp - b.timestamp);
  const start = sorted[0].timestamp;
  const end = sorted[sorted.length - 1].timestamp;
  const totalSpanMs = Math.max(0, end - start);

  let idleGapCount = 0;
  let longestGapMs = 0;
  let postGapBurstChars = 0;
  let activeWritingMs = 0;
  let prev = sorted[0].timestamp;

  for (let i = 1; i < sorted.length; i++) {
    const op = sorted[i];
    const gap = op.timestamp - prev;
    if (gap > IDLE_GAP_MS) {
      idleGapCount += 1;
      longestGapMs = Math.max(longestGapMs, gap);
      // chars typed/pasted in the next BURST_WINDOW after the gap
      let burst = 0;
      for (let j = i; j < sorted.length && sorted[j].timestamp - op.timestamp < BURST_WINDOW_MS; j++) {
        if (sorted[j].kind === "type" || sorted[j].kind === "paste") {
          burst += sorted[j].chars;
        }
      }
      postGapBurstChars += burst;
    } else if (gap < 90_000) {
      activeWritingMs += gap;
    }
    prev = op.timestamp;
  }

  const gapPenalty = clamp(idleGapCount * 0.18 + (longestGapMs > 4 * 60 * 60 * 1000 ? 0.2 : 0));
  const burstPenalty = postGapBurstChars > 400 ? clamp(postGapBurstChars / 2000) * 0.35 : 0;
  const continuity = clamp(1 - gapPenalty - burstPenalty);

  let label: ContinuityScore["label"] = "continuous";
  if (idleGapCount >= 3 || continuity < 0.35) label = "fragmented";
  else if (postGapBurstChars > 300 && idleGapCount >= 1) label = "burst-after-gap";
  else if (idleGapCount >= 1) label = "interrupted";

  const notes: string[] = [];
  if (idleGapCount) notes.push(`${idleGapCount} idle gap(s) ≥30 minutes.`);
  if (longestGapMs > 0) notes.push(`Longest gap ${(longestGapMs / 3_600_000).toFixed(1)} hours.`);
  if (postGapBurstChars > 200) notes.push(`${postGapBurstChars} characters arrived in bursts shortly after long gaps.`);
  if (!notes.length) notes.push("Writing activity is relatively continuous across the session.");

  return {
    continuity: Number(continuity.toFixed(3)),
    label,
    totalSpanMs,
    activeWritingMs,
    idleGapCount,
    longestGapMs,
    postGapBurstChars,
    notes,
  };
}

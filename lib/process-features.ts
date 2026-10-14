/**
 * Richer process-feature aggregates derived from CompositionOperation streams.
 * Additive and backward-compatible: existing ops arrays continue to work.
 * Does not store keystroke content — only timing and count statistics.
 */

import type { CompositionOperation } from "@/lib/composition-health";

export type ProcessFeatures = {
  typedChars: number;
  pastedChars: number;
  deletedChars: number;
  pasteEvents: number;
  typeEvents: number;
  deleteEvents: number;
  medianFlightMs: number | null;
  flightCv: number | null;
  revisionRatio: number;
  longPauseCount: number;
  burstCount: number;
  activeWritingMinutes: number;
  sessionSpanMinutes: number;
  transcriptionLikely: boolean;
  notes: string[];
};

function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function extractProcessFeatures(ops: CompositionOperation[]): ProcessFeatures {
  let typedChars = 0;
  let pastedChars = 0;
  let deletedChars = 0;
  let pasteEvents = 0;
  let typeEvents = 0;
  let deleteEvents = 0;

  const sorted = [...ops].sort((a, b) => a.timestamp - b.timestamp);
  const typeTimestamps: number[] = [];
  const flights: number[] = [];

  for (const op of sorted) {
    if (op.kind === "type") {
      typedChars += op.chars;
      typeEvents += 1;
      if (typeTimestamps.length > 0) {
        const gap = op.timestamp - typeTimestamps[typeTimestamps.length - 1];
        if (gap > 12 && gap < 2500) flights.push(gap);
      }
      typeTimestamps.push(op.timestamp);
    } else if (op.kind === "paste") {
      pastedChars += op.chars;
      pasteEvents += 1;
    } else if (op.kind === "delete") {
      deletedChars += op.chars;
      deleteEvents += 1;
    }
  }

  const medFlight = median(flights);
  const flightSd = stddev(flights);
  const flightCv = medFlight && medFlight > 0 ? flightSd / medFlight : null;

  let longPauseCount = 0;
  let burstCount = 0;
  let activeMs = 0;
  let inBurst = false;

  for (let i = 1; i < typeTimestamps.length; i++) {
    const gap = typeTimestamps[i] - typeTimestamps[i - 1];
    if (gap > 8000) {
      longPauseCount += 1;
      inBurst = false;
    } else if (gap < 400) {
      if (!inBurst) {
        burstCount += 1;
        inBurst = true;
      }
      activeMs += gap;
    } else {
      inBurst = false;
      if (gap < 90000) activeMs += gap;
    }
  }

  const firstTs = sorted[0]?.timestamp;
  const lastTs = sorted[sorted.length - 1]?.timestamp;
  const sessionSpanMinutes =
    firstTs != null && lastTs != null ? Math.max(0, (lastTs - firstTs) / 60000) : 0;

  const revisionRatio = typedChars > 0 ? deletedChars / typedChars : 0;

  const transcriptionLikely =
    typedChars > 120 &&
    revisionRatio < 0.04 &&
    medFlight != null &&
    medFlight < 90 &&
    (flightCv == null || flightCv < 0.55) &&
    longPauseCount <= 1;

  const notes: string[] = [];
  if (transcriptionLikely) {
    notes.push("Typing rhythm and low revision intensity resemble transcription more than recursive composition.");
  }
  if (revisionRatio > 0.15) {
    notes.push("Substantial revision activity recorded (deletes relative to typed characters).");
  }
  if (longPauseCount >= 4) {
    notes.push(`${longPauseCount} long pauses (>8s) between typing bursts.`);
  }
  if (pasteEvents >= 2 && pastedChars > typedChars) {
    notes.push("Paste volume exceeds typed volume.");
  }
  if (!notes.length && typedChars > 40) {
    notes.push("Process pattern is consistent with in-editor drafting.");
  }

  return {
    typedChars,
    pastedChars,
    deletedChars,
    pasteEvents,
    typeEvents,
    deleteEvents,
    medianFlightMs: medFlight,
    flightCv,
    revisionRatio,
    longPauseCount,
    burstCount,
    activeWritingMinutes: activeMs / 60000,
    sessionSpanMinutes,
    transcriptionLikely,
    notes,
  };
}

/**
 * Session graph analysis — structural writing-process signals
 * beyond simple paste/type ratios.
 */

export type TimedOp = {
  timestamp: number;
  kind: "type" | "paste" | "delete";
  chars: number;
};

export type SessionSegment = {
  startMs: number;
  endMs: number;
  typedChars: number;
  pastedChars: number;
  deletedChars: number;
  dominant: "typing" | "paste" | "mixed" | "idle";
};

export type SessionGraph = {
  totalDurationMs: number;
  activeWritingMs: number;
  segmentCount: number;
  segments: SessionSegment[];
  bulkInsertEvents: number;
  latePasteRatio: number;
  revisionBursts: number;
  growthCurve: Array<{ t: number; netChars: number }>;
  structuralRisk: number;
  structuralLabel: "stable" | "uneven" | "bulk-insert" | "suspicious";
  notes: string[];
};

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export function buildSessionGraph(ops: TimedOp[]): SessionGraph {
  if (!ops.length) {
    return {
      totalDurationMs: 0,
      activeWritingMs: 0,
      segmentCount: 0,
      segments: [],
      bulkInsertEvents: 0,
      latePasteRatio: 0,
      revisionBursts: 0,
      growthCurve: [],
      structuralRisk: 0,
      structuralLabel: "stable",
      notes: ["No composition events recorded yet."],
    };
  }

  const sorted = [...ops].sort((a, b) => a.timestamp - b.timestamp);
  const start = sorted[0].timestamp;
  const end = sorted[sorted.length - 1].timestamp;
  const totalDurationMs = Math.max(0, end - start);

  const GAP = 90_000;
  const segments: SessionSegment[] = [];
  let cur: SessionSegment | null = null;

  for (const op of sorted) {
    if (!cur || op.timestamp - cur.endMs > GAP) {
      if (cur) segments.push(cur);
      cur = {
        startMs: op.timestamp,
        endMs: op.timestamp,
        typedChars: 0,
        pastedChars: 0,
        deletedChars: 0,
        dominant: "idle",
      };
    }
    cur.endMs = op.timestamp;
    if (op.kind === "type") cur.typedChars += op.chars;
    if (op.kind === "paste") cur.pastedChars += op.chars;
    if (op.kind === "delete") cur.deletedChars += op.chars;
  }
  if (cur) segments.push(cur);

  for (const s of segments) {
    const total = s.typedChars + s.pastedChars || 1;
    if (s.pastedChars / total > 0.55) s.dominant = "paste";
    else if (s.typedChars / total > 0.7) s.dominant = "typing";
    else s.dominant = "mixed";
  }

  const activeWritingMs = segments.reduce((a, s) => a + Math.max(0, s.endMs - s.startMs), 0);
  const bulkInsertEvents = sorted.filter((o) => o.kind === "paste" && o.chars >= 80).length;

  const cutoff = start + totalDurationMs * 0.75;
  const pasteChars = sorted.filter((o) => o.kind === "paste").reduce((a, o) => a + o.chars, 0) || 1;
  const latePasteChars = sorted
    .filter((o) => o.kind === "paste" && o.timestamp >= cutoff)
    .reduce((a, o) => a + o.chars, 0);
  const latePasteRatio = latePasteChars / pasteChars;

  let revisionBursts = 0;
  let windowDeletes = 0;
  let windowStart = sorted[0].timestamp;
  for (const op of sorted) {
    if (op.timestamp - windowStart > 30_000) {
      if (windowDeletes >= 40) revisionBursts += 1;
      windowStart = op.timestamp;
      windowDeletes = 0;
    }
    if (op.kind === "delete") windowDeletes += op.chars;
  }
  if (windowDeletes >= 40) revisionBursts += 1;

  let net = 0;
  const curve: Array<{ t: number; netChars: number }> = [];
  const step = Math.max(1, Math.floor(sorted.length / 24));
  sorted.forEach((op, i) => {
    if (op.kind === "type" || op.kind === "paste") net += op.chars;
    if (op.kind === "delete") net = Math.max(0, net - op.chars);
    if (i % step === 0 || i === sorted.length - 1) {
      curve.push({ t: op.timestamp - start, netChars: net });
    }
  });

  const bulkShare = clamp(bulkInsertEvents / Math.max(1, segments.length));
  const structuralRisk = clamp(
    bulkShare * 0.4 + latePasteRatio * 0.35 + (segments.length <= 1 && pasteChars > 200 ? 0.25 : 0),
  );

  let structuralLabel: SessionGraph["structuralLabel"] = "stable";
  if (structuralRisk >= 0.65) structuralLabel = "suspicious";
  else if (bulkInsertEvents >= 2) structuralLabel = "bulk-insert";
  else if (structuralRisk >= 0.35) structuralLabel = "uneven";

  const notes: string[] = [];
  if (bulkInsertEvents) notes.push(`${bulkInsertEvents} bulk insert event(s) (≥80 chars pasted at once).`);
  if (latePasteRatio > 0.4) notes.push("A large share of pasted content arrived late in the session.");
  if (segments.length === 1 && totalDurationMs < 120_000 && pasteChars > 150) {
    notes.push("Short single-segment session with substantial paste volume.");
  }
  if (!notes.length) notes.push("Session structure is consistent with progressive drafting.");

  return {
    totalDurationMs,
    activeWritingMs,
    segmentCount: segments.length,
    segments,
    bulkInsertEvents,
    latePasteRatio: Number(latePasteRatio.toFixed(3)),
    revisionBursts,
    growthCurve: curve,
    structuralRisk: Number(structuralRisk.toFixed(3)),
    structuralLabel,
    notes,
  };
}

export type CompositionOperation = {
  timestamp: number;
  kind: "type" | "paste" | "delete";
  chars: number;
};

export type CompositionHealth = {
  organicRatio: number;
  pastedRatio: number;
  revisionRatio: number;
  medianFlightMs: number | null;
  risk: "organic" | "mixed" | "high-paste" | "transcription";
  notes: string[];
};

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function scoreCompositionHealth(
  operations: CompositionOperation[],
  focusLosses: number,
): CompositionHealth {
  let typedChars = 0;
  let pastedChars = 0;
  let deletedChars = 0;
  const flightTimes: number[] = [];
  let previousTypedAt: number | null = null;

  for (const operation of operations) {
    if (operation.kind === "paste") pastedChars += operation.chars;
    if (operation.kind === "delete") deletedChars += operation.chars;
    if (operation.kind !== "type") continue;

    typedChars += operation.chars;
    if (previousTypedAt !== null) {
      const flight = operation.timestamp - previousTypedAt;
      if (flight > 12 && flight < 2500) flightTimes.push(flight);
    }
    previousTypedAt = operation.timestamp;
  }

  const composedChars = Math.max(typedChars + pastedChars, 1);
  const pastedRatio = pastedChars / composedChars;
  const revisionRatio = typedChars ? deletedChars / typedChars : 0;
  const medianFlightMs = median(flightTimes);
  const transcription = medianFlightMs !== null && medianFlightMs < 40 && flightTimes.length > 24;
  const organicRatio = Math.max(0, Math.min(1, 1 - pastedRatio - (transcription ? 0.18 : 0)));
  const notes: string[] = [];

  if (pastedRatio > 0.15) notes.push("Paste volume is above the normal review threshold.");
  if (transcription) notes.push("Typing intervals resemble transcription rather than composing.");
  if (focusLosses > 4) notes.push(`${focusLosses} focus losses were recorded during this session.`);
  if (typedChars > 80 && revisionRatio < 0.02) notes.push("Very little recursive editing has been recorded.");
  if (!notes.length) notes.push("Composition pattern is consistent with in-browser drafting.");

  let risk: CompositionHealth["risk"] = "organic";
  if (pastedRatio > 0.45) risk = "high-paste";
  else if (transcription) risk = "transcription";
  else if (pastedRatio > 0.05) risk = "mixed";

  return {
    organicRatio,
    pastedRatio,
    revisionRatio,
    medianFlightMs,
    risk,
    notes,
  };
}

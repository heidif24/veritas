import crypto from "node:crypto";

export type VeritasTelemetry = Record<string, unknown> & {
  startAt?: string;
  lastInputAt?: string;
  tabSwitches?: number;
  blurCount?: number;
};

export type VeritasPayload = {
  authorId: string;
  title: string;
  text: string;
  ops: Array<Record<string, unknown>>;
  telemetry?: VeritasTelemetry;
  assignmentId?: string;
  sealedAt: string;
};

export type VeritasBundle = {
  version: 1;
  format: "veritas";
  payload: VeritasPayload;
  sha256: string;
  signature: string;
  publicKeyPem: string;
};

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }

  return sorted[midpoint];
}

export function computeHealthScore(text: string, ops: Array<Record<string, unknown>> = []) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const chars = trimmed.length;
  const pasteCount = ops.filter((entry) => String(entry.type ?? entry.action ?? "").toLowerCase().includes("paste")).length;
  const deleteCount = ops.filter((entry) => String(entry.type ?? entry.action ?? "").toLowerCase().includes("delete")).length;

  const events = ops
    .map((entry) => {
      const timestamp = Number(entry.timestamp ?? entry.time ?? 0);
      return Number.isFinite(timestamp) ? timestamp : 0;
    })
    .filter((value) => value > 0);

  const deltaTimes = [] as number[];
  for (let index = 1; index < events.length; index += 1) {
    const diff = events[index] - events[index - 1];
    if (diff > 0 && diff < 60000) {
      deltaTimes.push(diff);
    }
  }

  const medianFlightMs = median(deltaTimes);
  const pasteShare = clamp(pasteCount / Math.max(1, words / 8), 0, 1);
  const revisionRatio = clamp(deleteCount / Math.max(1, ops.length), 0, 1);
  const longPausePenalty = medianFlightMs > 2000 ? 0.12 : 0;
  const shortTextPenalty = chars < 120 ? 0.08 : 0;
  const organicScore = clamp(1 - pasteShare * 0.72 - revisionRatio * 0.25 - longPausePenalty - shortTextPenalty, 0, 1);

  let riskLabel: "organic" | "mixed" | "high-paste" | "ai-risk" = "organic";
  if (organicScore < 0.35) riskLabel = "ai-risk";
  else if (organicScore < 0.6) riskLabel = "high-paste";
  else if (organicScore < 0.8) riskLabel = "mixed";

  const notes = [
    pasteShare > 0.25 ? "High paste activity detected." : "Writing appears to be primarily composed directly by the author.",
    revisionRatio > 0.2 ? "Revision trail shows substantial editing checkpoints." : "The composition pattern suggests steady drafting with limited churn.",
    medianFlightMs > 1500 ? "Longer pauses suggest research or reflection between ideas." : "Keystroke cadence appears consistent with continuous drafting.",
  ].join(" ");

  return {
    organicScore: Number(organicScore.toFixed(3)),
    pasteShare: Number(pasteShare.toFixed(3)),
    revisionRatio: Number(revisionRatio.toFixed(3)),
    medianFlightMs,
    riskLabel,
    notes,
  };
}

function normalizeWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function buildNGrams(words: string[], size = 5) {
  if (words.length < size) return [];
  const grams = [] as string[];
  for (let index = 0; index <= words.length - size; index += 1) {
    grams.push(words.slice(index, index + size).join(" "));
  }
  return grams;
}

export function computeNGramSimilarity(text: string, corpus: string[] = []) {
  const target = normalizeWords(text);
  if (!target.length || !corpus.length) {
    return { score: 0, matches: [] as Array<{ source: string; matches: number }> };
  }

  const targetGrams = new Set(buildNGrams(target, 5));
  if (!targetGrams.size) {
    return { score: 0, matches: [] as Array<{ source: string; matches: number }> };
  }

  const matches = [] as Array<{ source: string; matches: number }>;
  let overlapCount = 0;

  for (const item of corpus) {
    if (!item || !item.trim()) continue;
    const sourceWords = normalizeWords(item);
    const sourceGrams = buildNGrams(sourceWords, 5);
    if (!sourceGrams.length) continue;

    const hits = [...targetGrams].filter((gram) => sourceGrams.includes(gram));
    if (hits.length) {
      overlapCount += hits.length;
      matches.push({ source: item.slice(0, 120), matches: hits.length });
    }
  }

  const score = clamp(overlapCount / Math.max(1, targetGrams.size), 0, 1);
  return { score: Number(score.toFixed(3)), matches };
}

export function createVeritasBundle(payload: VeritasPayload, keyPair: crypto.KeyPairKeyObjectResult) {
  const canonicalPayload = {
    ...payload,
    sealedAt: payload.sealedAt || new Date().toISOString(),
  };

  const payloadString = JSON.stringify(canonicalPayload);
  const sha256 = crypto.createHash("sha256").update(payloadString).digest("hex");
  const signature = crypto.sign(null, Buffer.from(payloadString, "utf8"), keyPair.privateKey).toString("base64");
  const publicKeyPem = keyPair.publicKey.export({ type: "spki", format: "pem" }).toString();

  return {
    version: 1,
    format: "veritas" as const,
    payload: canonicalPayload,
    sha256,
    signature,
    publicKeyPem,
  } satisfies VeritasBundle;
}

export function verifyVeritasBundle(bundle: Partial<VeritasBundle> | null): { valid: boolean; reason: string; hash?: string; signatureValid?: boolean; hashValid?: boolean } {
  if (!bundle || !bundle.payload || !bundle.sha256 || !bundle.signature || !bundle.publicKeyPem) {
    return { valid: false, reason: "Missing veritas bundle metadata" };
  }

  const payloadString = JSON.stringify(bundle.payload);
  const hash = crypto.createHash("sha256").update(payloadString).digest("hex");
  const hashValid = hash === bundle.sha256;

  try {
    const publicKey = crypto.createPublicKey(bundle.publicKeyPem);
    const signatureValid = crypto.verify(null, Buffer.from(payloadString, "utf8"), publicKey, Buffer.from(bundle.signature, "base64"));

    if (!hashValid) {
      return { valid: false, reason: "Bundle hash mismatch", hash, signatureValid, hashValid };
    }

    if (!signatureValid) {
      return { valid: false, reason: "Bundle signature check failed", hash, signatureValid, hashValid };
    }

    return { valid: true, reason: "Bundle signature and hash are valid", hash, signatureValid, hashValid };
  } catch {
    return { valid: false, reason: "Bundle public key is invalid", hash, signatureValid: false, hashValid };
  }
}

export function buildOriginalitySummary(text: string, corpus: string[] = []) {
  const similarity = computeNGramSimilarity(text, corpus);
  return {
    score: similarity.score,
    threshold: 0.25,
    risk: similarity.score >= 0.25 ? "review" : "clear",
    matches: similarity.matches,
  };
}

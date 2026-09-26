/**
 * Multi-signal authorship ensemble.
 * Outputs calibrated evidence — never a sole "AI %" claim.
 */

import { scoreCompositionHealth, type CompositionOperation, type CompositionHealth } from "@/lib/composition-health";
import { buildSessionGraph, type SessionGraph, type TimedOp } from "@/lib/session-graph";
import { compareStyle, type StyleComparison } from "@/lib/stylometry";
import { evaluatePolicy, policyForGenre, type IntegrityPolicy, type PolicyResult } from "@/lib/policy-engine";

export type Factor = {
  id: string;
  label: string;
  weight: number;
  score: number;
  direction: "supports-organic" | "supports-review" | "neutral";
  explanation: string;
};

export type EnsembleResult = {
  documentRisk: number;
  sessionRisk: number;
  blendedRisk: number;
  confidenceLow: number;
  confidenceHigh: number;
  confidenceWidth: number;
  label: "Low" | "Moderate" | "High" | "Critical";
  factors: Factor[];
  composition: CompositionHealth;
  session: SessionGraph;
  style: StyleComparison;
  policy: PolicyResult;
  adversarialHints: string[];
  plainLanguageWhy: string[];
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function labelFrom(score: number): EnsembleResult["label"] {
  if (score < 0.25) return "Low";
  if (score < 0.5) return "Moderate";
  if (score < 0.75) return "High";
  return "Critical";
}

export function scoreAuthorshipEnsemble(input: {
  text: string;
  ops: CompositionOperation[];
  focusLosses?: number;
  baselineText?: string | null;
  similarityPercent?: number;
  sealed?: boolean;
  genre?: IntegrityPolicy["genre"];
  policyOverrides?: Partial<IntegrityPolicy>;
}): EnsembleResult {
  const composition = scoreCompositionHealth(input.ops, input.focusLosses ?? 0);
  const timed: TimedOp[] = input.ops.map((o) => ({
    timestamp: o.timestamp,
    kind: o.kind,
    chars: o.chars,
  }));
  const session = buildSessionGraph(timed);
  const style = compareStyle(input.text, input.baselineText);
  const wordCount = input.text.trim() ? input.text.trim().split(/\s+/).length : 0;

  const factors: Factor[] = [
    {
      id: "paste",
      label: "Paste share",
      weight: 0.22,
      score: clamp01(composition.pastedRatio * 1.2),
      direction: composition.pastedRatio > 0.2 ? "supports-review" : "supports-organic",
      explanation:
        composition.pastedRatio > 0.2
          ? `${(composition.pastedRatio * 100).toFixed(0)}% of characters arrived via paste.`
          : "Paste volume is within a typical drafting range.",
    },
    {
      id: "flight",
      label: "Keystroke timing",
      weight: 0.12,
      score: composition.medianFlightMs !== null && composition.medianFlightMs < 40 ? 0.7 : composition.medianFlightMs !== null && composition.medianFlightMs > 900 ? 0.25 : 0.1,
      direction: composition.risk === "transcription" ? "supports-review" : "supports-organic",
      explanation:
        composition.risk === "transcription"
          ? "Inter-key intervals resemble transcription more than free composition."
          : "Typing rhythm is consistent with interactive drafting.",
    },
    {
      id: "revision",
      label: "Revision depth",
      weight: 0.12,
      score: composition.revisionRatio < 0.02 && wordCount > 120 ? 0.55 : composition.revisionRatio > 0.35 ? 0.15 : 0.2,
      direction: composition.revisionRatio < 0.02 && wordCount > 120 ? "supports-review" : "supports-organic",
      explanation:
        composition.revisionRatio < 0.02 && wordCount > 120
          ? "Little recursive editing was recorded for a document of this length."
          : "Revision activity is present in the event stream.",
    },
    {
      id: "session-structure",
      label: "Session structure",
      weight: 0.2,
      score: session.structuralRisk,
      direction: session.structuralRisk > 0.4 ? "supports-review" : "supports-organic",
      explanation: session.notes[0] ?? "Session structure evaluated.",
    },
    {
      id: "late-paste",
      label: "Late bulk paste",
      weight: 0.12,
      score: clamp01(session.latePasteRatio * 1.1),
      direction: session.latePasteRatio > 0.35 ? "supports-review" : "supports-organic",
      explanation:
        session.latePasteRatio > 0.35
          ? "A large share of pasted content arrived late in the writing session."
          : "Paste timing is not concentrated at the end of the session.",
    },
    {
      id: "style-drift",
      label: "Style consistency",
      weight: 0.1,
      score: style.driftScore,
      direction: style.driftLabel === "strong-shift" ? "supports-review" : "supports-organic",
      explanation: style.notes[0] ?? "Style profile checked.",
    },
    {
      id: "focus",
      label: "Focus stability",
      weight: 0.07,
      score: clamp01(((input.focusLosses ?? 0) - 2) / 10),
      direction: (input.focusLosses ?? 0) > 6 ? "supports-review" : "supports-organic",
      explanation:
        (input.focusLosses ?? 0) > 6
          ? `${input.focusLosses} focus losses were recorded during composition.`
          : "Focus stability is within expected bounds.",
    },
    {
      id: "similarity",
      label: "Text similarity",
      weight: 0.05,
      score: clamp01((input.similarityPercent ?? 0) / 100),
      direction: (input.similarityPercent ?? 0) > 20 ? "supports-review" : "neutral",
      explanation: `Institutional similarity score ${(input.similarityPercent ?? 0).toFixed(0)}%.`,
    },
  ];

  const weightSum = factors.reduce((a, f) => a + f.weight, 0) || 1;
  const blendedRisk = factors.reduce((a, f) => a + f.score * f.weight, 0) / weightSum;
  const sessionRisk = clamp01(session.structuralRisk * 0.55 + composition.pastedRatio * 0.3 + (composition.risk === "transcription" ? 0.15 : 0));
  const documentRisk = clamp01(
    ((input.similarityPercent ?? 0) / 100) * 0.35 + style.driftScore * 0.25 + composition.pastedRatio * 0.25 + (1 - composition.organicRatio) * 0.15,
  );

  const eventN = input.ops.length;
  const sparsity = eventN < 20 || wordCount < 80 ? 0.18 : eventN < 60 ? 0.1 : 0.06;
  const disagreement = Math.abs(sessionRisk - documentRisk) * 0.12;
  const halfWidth = sparsity + disagreement;
  const confidenceLow = Math.round(clamp01(blendedRisk - halfWidth) * 100);
  const confidenceHigh = Math.round(clamp01(blendedRisk + halfWidth) * 100);

  const adversarialHints: string[] = [];
  if (composition.risk === "transcription" && composition.pastedRatio < 0.05) {
    adversarialHints.push("Very regular key intervals with low paste can indicate retyping of external text.");
  }
  if (session.bulkInsertEvents >= 2 && composition.revisionRatio > 0.15) {
    adversarialHints.push("Bulk inserts followed by heavy local edits can indicate post-paste camouflage.");
  }
  if (style.driftLabel === "strong-shift" && session.latePasteRatio > 0.3) {
    adversarialHints.push("Late paste combined with strong style shift is harder to explain as ordinary drafting.");
  }

  const policy = evaluatePolicy(
    {
      wordCount,
      similarityPercent: input.similarityPercent ?? 0,
      pasteRatio: composition.pastedRatio,
      aiRiskScore: Math.round(blendedRisk * 100),
      sealed: Boolean(input.sealed),
      structuralLabel: session.structuralLabel,
    },
    { ...policyForGenre(input.genre ?? "general"), ...input.policyOverrides },
  );

  const plainLanguageWhy = factors
    .filter((f) => f.direction === "supports-review" && f.score >= 0.35)
    .map((f) => f.explanation)
    .slice(0, 4);
  if (!plainLanguageWhy.length) {
    plainLanguageWhy.push("Writing process signals are consistent with in-platform composition.");
  }

  return {
    documentRisk: Number(documentRisk.toFixed(3)),
    sessionRisk: Number(sessionRisk.toFixed(3)),
    blendedRisk: Number(blendedRisk.toFixed(3)),
    confidenceLow,
    confidenceHigh,
    confidenceWidth: confidenceHigh - confidenceLow,
    label: labelFrom(blendedRisk),
    factors,
    composition,
    session,
    style,
    policy,
    adversarialHints,
    plainLanguageWhy,
  };
}

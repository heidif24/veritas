/**
 * Explainable integrity evidence package — ensemble-backed.
 */

import type { CompositionOperation } from "@/lib/composition-health";
import { scoreAuthorshipEnsemble } from "@/lib/authorship-ensemble";
import type { IntegrityPolicy } from "@/lib/policy-engine";

export type IntegrityReport = ReturnType<typeof buildIntegrityReport>;

export function buildIntegrityReport(input: {
  documentId: string;
  title: string;
  text: string;
  ops: CompositionOperation[];
  focusLosses?: number;
  baselineText?: string | null;
  sealed?: boolean;
  sealedHash?: string | null;
  similarityScore?: number;
  similarityThreshold?: number;
  matches?: Array<{ snippet: string; sourceTitle?: string; similarityPercentage: number; matchedSourceUrl?: string; cited?: boolean }>;
  policy?: Partial<IntegrityPolicy>;
  genre?: IntegrityPolicy["genre"];
}) {
  const ensemble = scoreAuthorshipEnsemble({
    text: input.text,
    ops: input.ops,
    focusLosses: input.focusLosses,
    baselineText: input.baselineText,
    similarityPercent: input.similarityScore,
    sealed: input.sealed,
    genre: input.genre,
    policyOverrides: input.policy,
  });

  const similarityScore = input.similarityScore ?? 0;
  const similarityThreshold = input.similarityThreshold ?? 20;

  let overall: "clear" | "review" | "elevated" | "critical" = "clear";
  if (ensemble.blendedRisk >= 0.7 || ensemble.policy.action === "block") overall = "critical";
  else if (ensemble.blendedRisk >= 0.45) overall = "elevated";
  else if (ensemble.blendedRisk >= 0.25 || ensemble.policy.action === "warn") overall = "review";

  const headlines = {
    clear: "Evidence is consistent with organic in-platform composition.",
    review: "Some signals warrant faculty review; not conclusive of misconduct.",
    elevated: "Multiple elevated signals — review recommended before acceptance.",
    critical: "Policy thresholds exceeded or high-risk process pattern detected.",
  } as const;

  return {
    documentId: input.documentId,
    title: input.title,
    generatedAt: new Date().toISOString(),
    summary: {
      overall,
      headline: headlines[overall],
      sealed: Boolean(input.sealed),
      sealedHash: input.sealedHash,
      confidenceLow: ensemble.confidenceLow,
      confidenceHigh: ensemble.confidenceHigh,
      sessionRisk: Math.round(ensemble.sessionRisk * 100),
      documentRisk: Math.round(ensemble.documentRisk * 100),
    },
    composition: ensemble.composition,
    session: ensemble.session,
    style: ensemble.style,
    factors: ensemble.factors,
    plainLanguageWhy: ensemble.plainLanguageWhy,
    adversarialHints: ensemble.adversarialHints,
    similarity: {
      score: similarityScore,
      threshold: similarityThreshold,
      matches: input.matches ?? [],
    },
    policy: ensemble.policy,
    timeline: [
      {
        label: "Composition behaviour",
        detail: ensemble.composition.signalSummary,
        severity: ensemble.label === "Critical" || ensemble.label === "High" ? "critical" : ensemble.label === "Moderate" ? "warn" : "info",
      },
      {
        label: "Session structure",
        detail: ensemble.session.notes[0] ?? "Stable session",
        severity: ensemble.session.structuralLabel === "suspicious" ? "critical" : ensemble.session.structuralLabel === "bulk-insert" ? "warn" : "info",
      },
      {
        label: "Similarity",
        detail: `Overall similarity ${similarityScore}% (policy limit ${similarityThreshold}%).`,
        severity: similarityScore >= similarityThreshold ? "critical" : similarityScore > similarityThreshold * 0.5 ? "warn" : "info",
      },
      {
        label: "Style consistency",
        detail: ensemble.style.notes[0] ?? "No baseline",
        severity: ensemble.style.driftLabel === "strong-shift" ? "warn" : "info",
      },
      {
        label: "Custody",
        detail: input.sealed
          ? `Document is sealed${input.sealedHash ? ` (${String(input.sealedHash).slice(0, 12)}…)` : ""}.`
          : "Document is not sealed.",
        severity: input.sealed ? "info" : "warn",
      },
    ],
    methodology: [
      "Ensemble of behavioural, structural, text, style, custody, and policy layers.",
      "Calibrated confidence bands widen when event streams are sparse.",
      "Session risk and document risk are scored separately.",
      "Citation-aware similarity down-weights quoted material when detected.",
      "This report is evidence for human review — not a sole determination of misconduct.",
    ],
  };
}

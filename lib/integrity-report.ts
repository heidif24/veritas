/**
 * Explainable integrity evidence package for faculty hearings and student transparency.
 */

import { scoreCompositionHealth, type CompositionHealth, type CompositionOperation } from "@/lib/composition-health";
import { buildSessionGraph, type SessionGraph, type TimedOp } from "@/lib/session-graph";
import { compareStyle, type StyleComparison } from "@/lib/stylometry";
import { evaluatePolicy, type IntegrityPolicy, type PolicyResult } from "@/lib/policy-engine";

export type IntegrityReport = {
  documentId: string;
  title: string;
  generatedAt: string;
  summary: {
    overall: "clear" | "review" | "elevated" | "critical";
    headline: string;
    sealed: boolean;
    sealedHash?: string | null;
  };
  composition: CompositionHealth;
  session: SessionGraph;
  style: StyleComparison;
  similarity: {
    score: number;
    threshold: number;
    matches: Array<{ snippet: string; sourceTitle?: string; similarityPercentage: number; matchedSourceUrl?: string }>;
  };
  policy: PolicyResult;
  timeline: Array<{ label: string; detail: string; severity: "info" | "warn" | "critical" }>;
  methodology: string[];
};

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
  matches?: IntegrityReport["similarity"]["matches"];
  policy?: Partial<IntegrityPolicy>;
}): IntegrityReport {
  const composition = scoreCompositionHealth(input.ops, input.focusLosses ?? 0);
  const timed: TimedOp[] = input.ops.map((o) => ({
    timestamp: o.timestamp,
    kind: o.kind,
    chars: o.chars,
  }));
  const session = buildSessionGraph(timed);
  const style = compareStyle(input.text, input.baselineText);
  const wordCount = input.text.trim() ? input.text.trim().split(/\s+/).length : 0;
  const similarityScore = input.similarityScore ?? 0;
  const similarityThreshold = input.similarityThreshold ?? 20;

  const policy = evaluatePolicy(
    {
      wordCount,
      similarityPercent: similarityScore,
      pasteRatio: composition.pastedRatio,
      aiRiskScore: composition.aiRiskScore,
      sealed: Boolean(input.sealed),
      structuralLabel: session.structuralLabel,
    },
    input.policy,
  );

  const riskScores = [
    composition.aiRiskScore / 100,
    session.structuralRisk,
    similarityScore / 100,
    style.driftScore * 0.5,
  ];
  const blended = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;

  let overall: IntegrityReport["summary"]["overall"] = "clear";
  if (blended >= 0.7 || policy.action === "block") overall = "critical";
  else if (blended >= 0.45) overall = "elevated";
  else if (blended >= 0.25 || policy.action === "warn") overall = "review";

  const headlines: Record<typeof overall, string> = {
    clear: "Evidence is consistent with organic in-platform composition.",
    review: "Some signals warrant faculty review; not conclusive of misconduct.",
    elevated: "Multiple elevated signals — review recommended before acceptance.",
    critical: "Policy thresholds exceeded or high-risk process pattern detected.",
  };

  const timeline: IntegrityReport["timeline"] = [
    {
      label: "Composition behaviour",
      detail: composition.signalSummary,
      severity: composition.aiRiskLabel === "Critical" || composition.aiRiskLabel === "High" ? "critical" : composition.aiRiskLabel === "Moderate" ? "warn" : "info",
    },
    {
      label: "Session structure",
      detail: session.notes[0] ?? "Stable session",
      severity: session.structuralLabel === "suspicious" ? "critical" : session.structuralLabel === "bulk-insert" ? "warn" : "info",
    },
    {
      label: "Similarity",
      detail: `Overall similarity ${similarityScore}% (policy limit ${similarityThreshold}%).`,
      severity: similarityScore >= similarityThreshold ? "critical" : similarityScore > similarityThreshold * 0.5 ? "warn" : "info",
    },
    {
      label: "Style consistency",
      detail: style.notes[0] ?? "No baseline",
      severity: style.driftLabel === "strong-shift" ? "warn" : "info",
    },
    {
      label: "Custody",
      detail: input.sealed
        ? `Document is sealed${input.sealedHash ? ` (${String(input.sealedHash).slice(0, 12)}…)` : ""}.`
        : "Document is not sealed.",
      severity: input.sealed ? "info" : "warn",
    },
  ];

  return {
    documentId: input.documentId,
    title: input.title,
    generatedAt: new Date().toISOString(),
    summary: {
      overall,
      headline: headlines[overall],
      sealed: Boolean(input.sealed),
      sealedHash: input.sealedHash,
    },
    composition,
    session,
    style,
    similarity: {
      score: similarityScore,
      threshold: similarityThreshold,
      matches: input.matches ?? [],
    },
    policy,
    timeline,
    methodology: [
      "Behavioural layer: keystroke/paste/delete events and focus loss.",
      "Structural layer: session segments, bulk inserts, late-paste ratio, growth curve.",
      "Text layer: institutional similarity matching (n-gram windows).",
      "Style layer: lightweight stylometric drift vs prior draft when available.",
      "Custody layer: cryptographic seal hash and signature when present.",
      "Policy layer: course/institution thresholds mapped to allow / warn / block.",
      "This report is evidence for human review — not a sole determination of misconduct.",
    ],
  };
}

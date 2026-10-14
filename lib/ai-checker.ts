/**
 * Lightweight explainable AI-assistance risk scorer for student-facing results.
 * Uses process + stylometric signals — not a black-box detector.
 * Privacy-safe: no external model calls required.
 */

import { scoreCompositionHealth, type CompositionOperation } from "@/lib/composition-health";
import { extractProcessFeatures } from "@/lib/process-features";
import { profileStyle } from "@/lib/stylometry";

export type AiCheckSegment = {
  start: number;
  end: number;
  text: string;
  risk: "low" | "moderate" | "high";
  reason: string;
};

export type AiCheckResult = {
  overallScore: number;
  label: "Low" | "Moderate" | "High" | "Critical";
  summary: string;
  factors: string[];
  segments: AiCheckSegment[];
  methodology: string;
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.min(hi, Math.max(lo, n));
}

/** Score AI-assistance risk from text + optional process ops. Accurate sentence offsets. */
export function runAiCheck(input: {
  text: string;
  ops?: CompositionOperation[];
  focusLosses?: number;
}): AiCheckResult {
  const plain = input.text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const ops = input.ops ?? [];
  const focusLosses = input.focusLosses ?? 0;

  const composition = scoreCompositionHealth(ops, focusLosses);
  const process = extractProcessFeatures(ops);
  const style = profileStyle(plain);

  let score = composition.aiRiskScore;
  if (process.transcriptionLikely) score = Math.max(score, score + 18);
  if (process.revisionRatio < 0.03 && process.typedChars > 200) score += 10;
  if (composition.pastedRatio > 0.4) score += 12;
  if (process.longPauseCount <= 1 && process.typedChars > 300 && process.medianFlightMs != null && process.medianFlightMs < 70) {
    score += 8;
  }
  if (style.typeTokenRatio < 0.35 && plain.split(/\s+/).length > 150) score += 6;
  if (style.avgSentenceLen > 28) score += 4;

  score = clamp(Math.round(score));
  const label: AiCheckResult["label"] =
    score < 25 ? "Low" : score < 50 ? "Moderate" : score < 75 ? "High" : "Critical";

  const factors: string[] = [];
  if (composition.pastedRatio > 0.15) {
    factors.push(`${Math.round(composition.pastedRatio * 100)}% of characters arrived via paste.`);
  }
  if (process.transcriptionLikely) {
    factors.push("Typing rhythm and low revision resemble transcription of finished text.");
  }
  if (process.revisionRatio < 0.04 && process.typedChars > 100) {
    factors.push("Very little recursive editing was recorded.");
  }
  if (!factors.length) {
    factors.push("Process signals are broadly consistent with in-editor drafting.");
  }

  // Accurate character offsets via single-pass regex scan
  const segments: AiCheckSegment[] = [];
  const sentenceRe = /[^.!?]+[.!?]+|[^.!?]+$/g;
  let match: RegExpExecArray | null;
  while ((match = sentenceRe.exec(plain)) !== null) {
    const raw = match[0];
    const leading = raw.match(/^\s*/)?.[0].length ?? 0;
    const trailing = raw.match(/\s*$/)?.[0].length ?? 0;
    const start = match.index + leading;
    const end = match.index + raw.length - trailing;
    const trimmed = plain.slice(start, end);
    if (trimmed.length < 20) continue;

    let risk: AiCheckSegment["risk"] = "low";
    let reason = "No strong process or style anomaly for this span.";
    const words = trimmed.split(/\s+/).length;
    if (score >= 50 && words > 22) {
      risk = score >= 75 ? "high" : "moderate";
      reason =
        risk === "high"
          ? "Long span combined with elevated session AI-risk signals."
          : "Moderately elevated session signals; worth a human read.";
    } else if (composition.pastedRatio > 0.35 && words > 12) {
      risk = "moderate";
      reason = "Session had substantial paste volume; this span may include pasted material.";
    }
    if (risk !== "low") {
      segments.push({ start, end, text: trimmed.slice(0, 240), risk, reason });
    }
  }

  const summary =
    label === "Low"
      ? "AI-assistance risk appears low based on process and style signals."
      : label === "Moderate"
        ? "Some signals suggest possible external assistance — review highlighted spans."
        : "Elevated AI-assistance risk signals. Review highlighted spans and process evidence.";

  return {
    overallScore: score,
    label,
    summary,
    factors,
    segments: segments.slice(0, 40),
    methodology:
      "Combines composition process (typed vs pasted, revision, timing) with lightweight stylometric checks. Not a sole determination of misconduct.",
  };
}

/**
 * Diagnostic pattern classification for integrity evidence.
 * Turns multiple weak signals into human-readable case types
 * without issuing misconduct verdicts.
 */

import type { CompositionHealth } from "@/lib/composition-health";
import type { ProcessFeatures } from "@/lib/process-features";
import type { StyleComparison } from "@/lib/stylometry";
import type { PasteOriginSummary } from "@/lib/paste-origin";

export type DiagnosticPatternId =
  | "organic-consistent"
  | "possible-transcription"
  | "heavy-paste"
  | "baseline-drift"
  | "insufficient-evidence"
  | "mixed-signals"
  | "elevated-review";

export type DiagnosticPattern = {
  id: DiagnosticPatternId;
  label: string;
  severity: "info" | "review" | "elevated";
  summary: string;
  instructorGuidance: string;
};

export function classifyDiagnosticPattern(input: {
  composition: CompositionHealth;
  process?: ProcessFeatures | null;
  style?: StyleComparison | null;
  pasteOrigin?: PasteOriginSummary | null;
  hasBaseline: boolean;
  wordCount: number;
  blendedRisk: number;
}): DiagnosticPattern {
  const { composition, process, style, pasteOrigin, hasBaseline, wordCount, blendedRisk } = input;

  if (wordCount < 40 || (composition.organicRatio === 0 && !process?.typedChars && !process?.pastedChars)) {
    return {
      id: "insufficient-evidence",
      label: "Insufficient evidence",
      severity: "info",
      summary: "Too little writing activity was recorded to form a reliable process picture.",
      instructorGuidance:
        "Ask the student to complete work in the Veritas editor, or treat this submission with the same care you would any unobserved draft.",
    };
  }

  if (
    composition.pastedRatio > 0.45 ||
    (pasteOrigin && pasteOrigin.externalBulkEvents >= 2 && pasteOrigin.externalBulkRatio > 0.35)
  ) {
    return {
      id: "heavy-paste",
      label: "Heavy external paste",
      severity: "elevated",
      summary: "A large share of the text arrived via substantial paste events, often after focus changes.",
      instructorGuidance:
        "Review the paste timeline. Pasting is not automatically misconduct (citations, notes), but large external blocks deserve a closer look at sources and voice.",
    };
  }

  if (process?.transcriptionLikely || composition.risk === "transcription") {
    return {
      id: "possible-transcription",
      label: "Possible transcription pattern",
      severity: "review",
      summary:
        "Typing rhythm is relatively regular and fast with low revision intensity — a pattern more common when transcribing finished text than when composing.",
      instructorGuidance:
        "This does not prove external authorship. Consider asking a short oral follow-up or comparing against the student's baseline sample if one exists.",
    };
  }

  if (hasBaseline && style && style.driftLabel === "strong-shift") {
    return {
      id: "baseline-drift",
      label: "Style drift from baseline",
      severity: "review",
      summary: "The writing style differs markedly from this student's earlier supervised baseline sample.",
      instructorGuidance:
        "Drift can be legitimate (genre change, growth, collaboration). Use it as a prompt for discussion rather than a sole finding.",
    };
  }

  if (blendedRisk >= 0.45) {
    return {
      id: "elevated-review",
      label: "Multiple elevated signals",
      severity: "elevated",
      summary: "Several process or policy signals sit above typical review thresholds.",
      instructorGuidance:
        "Open the full evidence panel. No single signal is decisive; look for convergent reasons before acting.",
    };
  }

  if (composition.risk === "mixed" || composition.pastedRatio > 0.15 || (process && process.longPauseCount >= 5)) {
    return {
      id: "mixed-signals",
      label: "Mixed process signals",
      severity: "review",
      summary: "Some process indicators are atypical, but nothing clearly crosses a high threshold.",
      instructorGuidance: "Worth a quick scan of the timeline; often consistent with normal research-and-draft behaviour.",
    };
  }

  return {
    id: "organic-consistent",
    label: "Consistent with in-editor composition",
    severity: "info",
    summary: "Process and (where available) style signals align with organic drafting in the Veritas editor.",
    instructorGuidance: "No process red flags from the recorded session. Content quality and academic judgement remain yours.",
  };
}

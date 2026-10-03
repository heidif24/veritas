/**
 * Assignment / institutional integrity policy evaluation.
 * Extended with optional device / continuity constraints.
 */

export type IntegrityPolicy = {
  maxSimilarityPercent: number;
  maxPasteRatio: number;
  maxAiRiskScore: number;
  requireSeal: boolean;
  minWordCount: number;
  allowSubmitWhenReview: boolean;
  genre?: "essay" | "lab" | "reflection" | "exam" | "general";
  /** Assignment-scoped device policy */
  maxDistinctDevices?: number;
  maxDistinctIps?: number;
  requireSingleDevice?: boolean;
};

export type PolicyInput = {
  wordCount: number;
  similarityPercent: number;
  pasteRatio: number;
  aiRiskScore: number;
  sealed: boolean;
  structuralLabel?: string;
  distinctDevices?: number;
  distinctIps?: number;
  continuityLabel?: string;
};

export type PolicyResult = {
  allowed: boolean;
  action: "allow" | "warn" | "block";
  reasons: string[];
  policy: IntegrityPolicy;
};

export const DEFAULT_POLICY: IntegrityPolicy = {
  maxSimilarityPercent: 20,
  maxPasteRatio: 0.35,
  maxAiRiskScore: 75,
  requireSeal: true,
  minWordCount: 40,
  allowSubmitWhenReview: false,
  genre: "general",
  maxDistinctDevices: undefined,
  maxDistinctIps: undefined,
  requireSingleDevice: false,
};

export function evaluatePolicy(input: PolicyInput, policy: Partial<IntegrityPolicy> = {}): PolicyResult {
  const p: IntegrityPolicy = { ...DEFAULT_POLICY, ...policy };
  const reasons: string[] = [];
  let action: PolicyResult["action"] = "allow";

  if (input.wordCount < p.minWordCount) {
    reasons.push(`Minimum word count is ${p.minWordCount}.`);
    action = "block";
  }
  if (input.similarityPercent >= p.maxSimilarityPercent) {
    reasons.push(`Similarity ${input.similarityPercent}% exceeds the ${p.maxSimilarityPercent}% policy limit.`);
    action = "block";
  }
  if (input.pasteRatio > p.maxPasteRatio) {
    reasons.push(`Paste share ${(input.pasteRatio * 100).toFixed(0)}% exceeds the ${(p.maxPasteRatio * 100).toFixed(0)}% policy limit.`);
    if (action !== "block") action = "warn";
  }
  if (input.aiRiskScore >= p.maxAiRiskScore) {
    reasons.push(`Authorship risk score ${input.aiRiskScore} meets the critical threshold (${p.maxAiRiskScore}).`);
    action = "block";
  }
  if (p.requireSeal && !input.sealed) {
    reasons.push("A cryptographic seal is required before submission.");
    if (action === "allow") action = "warn";
  }
  if (input.structuralLabel === "suspicious") {
    reasons.push("Session structure is flagged as suspicious and requires faculty review.");
    if (action === "allow") action = p.allowSubmitWhenReview ? "warn" : "block";
  }

  // Assignment-scoped device policy
  if (p.requireSingleDevice && (input.distinctDevices ?? 1) > 1) {
    reasons.push("This assignment requires a single device; multiple devices were detected.");
    if (action !== "block") action = "warn";
  }
  if (p.maxDistinctDevices != null && (input.distinctDevices ?? 1) > p.maxDistinctDevices) {
    reasons.push(`More than ${p.maxDistinctDevices} distinct device(s) used during this assignment window.`);
    if (action !== "block") action = "warn";
  }
  if (p.maxDistinctIps != null && (input.distinctIps ?? 1) > p.maxDistinctIps) {
    reasons.push(`More than ${p.maxDistinctIps} distinct network(s) / IP(s) detected.`);
    if (action !== "block") action = "warn";
  }
  if (input.continuityLabel === "burst-after-gap" || input.continuityLabel === "fragmented") {
    reasons.push(`Writing continuity is ${input.continuityLabel} — review recommended.`);
    if (action === "allow") action = "warn";
  }

  if (!reasons.length) reasons.push("All policy checks passed.");

  return {
    allowed: action === "allow" || (action === "warn" && p.allowSubmitWhenReview),
    action,
    reasons,
    policy: p,
  };
}

export function policyForGenre(genre: IntegrityPolicy["genre"]): IntegrityPolicy {
  switch (genre) {
    case "lab":
      return { ...DEFAULT_POLICY, maxSimilarityPercent: 25, maxPasteRatio: 0.45, genre: "lab" };
    case "reflection":
      return { ...DEFAULT_POLICY, maxSimilarityPercent: 12, maxPasteRatio: 0.2, genre: "reflection" };
    case "exam":
      return {
        ...DEFAULT_POLICY,
        maxSimilarityPercent: 10,
        maxPasteRatio: 0.1,
        maxAiRiskScore: 50,
        requireSingleDevice: true,
        maxDistinctDevices: 1,
        genre: "exam",
      };
    case "essay":
      return { ...DEFAULT_POLICY, maxSimilarityPercent: 18, genre: "essay" };
    default:
      return { ...DEFAULT_POLICY };
  }
}

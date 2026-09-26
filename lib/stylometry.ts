/**
 * Lightweight stylometric features for draft consistency checks.
 * Not a standalone AI detector — supporting evidence only.
 */

export type StyleProfile = {
  avgSentenceLen: number;
  avgWordLen: number;
  typeTokenRatio: number;
  punctuationDensity: number;
  functionWordRatio: number;
  passiveHintRatio: number;
};

export type StyleComparison = {
  current: StyleProfile;
  baseline: StyleProfile | null;
  driftScore: number;
  driftLabel: "consistent" | "moderate-shift" | "strong-shift";
  notes: string[];
};

const FUNCTION_WORDS = new Set(
  "the a an and or but if in on at to for of with by from as is are was were be been being this that these those it its".split(
    " ",
  ),
);

function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function profileStyle(text: string): StyleProfile {
  const words = tokens(text);
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const chars = text.replace(/\s/g, "").length || 1;
  const punct = (text.match(/[.,;:!?()"'—–-]/g) || []).length;
  const functionCount = words.filter((w) => FUNCTION_WORDS.has(w)).length;
  const unique = new Set(words).size;
  const passiveHints = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;

  return {
    avgSentenceLen: sentences.length ? words.length / sentences.length : words.length,
    avgWordLen: words.length ? words.join("").length / words.length : 0,
    typeTokenRatio: words.length ? unique / words.length : 0,
    punctuationDensity: punct / chars,
    functionWordRatio: words.length ? functionCount / words.length : 0,
    passiveHintRatio: sentences.length ? passiveHints / sentences.length : 0,
  };
}

export function compareStyle(currentText: string, baselineText?: string | null): StyleComparison {
  const current = profileStyle(currentText);
  const baseline = baselineText ? profileStyle(baselineText) : null;
  const notes: string[] = [];

  if (!baseline) {
    return {
      current,
      baseline: null,
      driftScore: 0,
      driftLabel: "consistent",
      notes: ["No prior draft baseline for style comparison."],
    };
  }

  const dims = [
    Math.abs(current.avgSentenceLen - baseline.avgSentenceLen) / Math.max(8, baseline.avgSentenceLen),
    Math.abs(current.avgWordLen - baseline.avgWordLen) / Math.max(3, baseline.avgWordLen),
    Math.abs(current.typeTokenRatio - baseline.typeTokenRatio),
    Math.abs(current.functionWordRatio - baseline.functionWordRatio) * 2,
  ];
  const driftScore = Math.min(1, dims.reduce((a, b) => a + b, 0) / dims.length);

  let driftLabel: StyleComparison["driftLabel"] = "consistent";
  if (driftScore >= 0.45) driftLabel = "strong-shift";
  else if (driftScore >= 0.22) driftLabel = "moderate-shift";

  if (driftLabel === "strong-shift") notes.push("Stylometric profile shifted sharply versus earlier draft.");
  else if (driftLabel === "moderate-shift") notes.push("Moderate style shift versus baseline draft.");
  else notes.push("Style profile is broadly consistent with earlier drafting.");

  return {
    current,
    baseline,
    driftScore: Number(driftScore.toFixed(3)),
    driftLabel,
    notes,
  };
}

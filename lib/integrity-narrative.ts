/**
 * Instructor integrity narrative — one coherent story per submission.
 */

import type { CompositionOperation } from "@/lib/composition-health";
import { buildIntegrityReport } from "@/lib/integrity-report";
import { scoreContinuity } from "@/lib/continuity-score";
import { classifyPasteOrigins } from "@/lib/paste-origin";
import { buildProcessCertificate } from "@/lib/process-certificate";
import { getUserDeviceTrail, type DeviceTrailSummary } from "@/lib/session-security";
import { integrityDelta } from "@/lib/version-lineage";
import type { IntegrityPolicy } from "@/lib/policy-engine";

export type IntegrityNarrative = {
  documentId: string;
  title: string;
  generatedAt: string;
  overall: "clear" | "review" | "elevated" | "critical";
  headline: string;
  story: string[];
  processCertificate: ReturnType<typeof buildProcessCertificate>;
  continuity: ReturnType<typeof scoreContinuity>;
  pasteOrigin: ReturnType<typeof classifyPasteOrigins>;
  deviceTrail: DeviceTrailSummary | null;
  lineage: ReturnType<typeof integrityDelta> | null;
  report: ReturnType<typeof buildIntegrityReport>;
};

export function buildIntegrityNarrative(input: {
  documentId: string;
  title: string;
  text: string;
  authorId: string;
  ops: CompositionOperation[];
  focusLosses?: number;
  focusLossTimestamps?: number[];
  baselineText?: string | null;
  sealed?: boolean;
  sealedHash?: string | null;
  similarityScore?: number;
  similarityThreshold?: number;
  matches?: Array<{ snippet: string; sourceTitle?: string; similarityPercentage: number; matchedSourceUrl?: string; cited?: boolean }>;
  policy?: Partial<IntegrityPolicy>;
  genre?: IntegrityPolicy["genre"];
  includeDeviceTrail?: boolean;
  includeLineage?: boolean;
}): IntegrityNarrative {
  const report = buildIntegrityReport(input);
  const continuity = scoreContinuity(input.ops);
  const pasteOrigin = classifyPasteOrigins(input.ops, input.focusLossTimestamps ?? []);
  const deviceTrail = input.includeDeviceTrail !== false ? getUserDeviceTrail(input.authorId) : null;
  const processCertificate = buildProcessCertificate({
    authorId: input.authorId,
    title: input.title,
    text: input.text,
    ops: input.ops,
    focusLosses: input.focusLosses,
    focusLossTimestamps: input.focusLossTimestamps,
    deviceTrail,
  });
  const lineage = input.includeLineage !== false ? integrityDelta(input.documentId, input.ops) : null;

  const story: string[] = [];
  story.push(report.summary.headline);
  story.push(processCertificate.plainSummary);
  if (deviceTrail?.flags.multipleDevices || deviceTrail?.flags.multipleIps) {
    story.push(
      `Login trail shows ${deviceTrail.distinctIpCount} distinct IP(s) and ${deviceTrail.distinctDeviceCount} device(s) for this author.`,
    );
  }
  if (continuity.label === "burst-after-gap" || continuity.label === "fragmented") {
    story.push(`Continuity flag: ${continuity.label}. ${continuity.notes[0]}`);
  }
  if (pasteOrigin.externalBulkEvents > 0) {
    story.push(pasteOrigin.notes[0]);
  }
  if (lineage && "deltaSummary" in lineage) {
    story.push(`Revision lineage: ${lineage.deltaSummary}`);
  }
  story.push(...report.plainLanguageWhy.slice(0, 2));

  return {
    documentId: input.documentId,
    title: input.title,
    generatedAt: new Date().toISOString(),
    overall: report.summary.overall,
    headline: report.summary.headline,
    story,
    processCertificate,
    continuity,
    pasteOrigin,
    deviceTrail,
    lineage,
    report,
  };
}

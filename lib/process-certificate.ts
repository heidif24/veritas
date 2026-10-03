/**
 * Sealed process certificate — human-readable evidence that travels with the .veritas bundle.
 */

import type { CompositionOperation } from "@/lib/composition-health";
import { scoreCompositionHealth } from "@/lib/composition-health";
import { buildSessionGraph, type TimedOp } from "@/lib/session-graph";
import { scoreContinuity } from "@/lib/continuity-score";
import { classifyPasteOrigins } from "@/lib/paste-origin";
import type { DeviceTrailSummary } from "@/lib/session-security";

export type ProcessCertificate = {
  version: 1;
  generatedAt: string;
  authorId: string;
  documentTitle: string;
  wordCount: number;
  activeWritingMinutes: number;
  compositionRisk: string;
  organicRatio: number;
  pasteSummary: string;
  continuityLabel: string;
  sessionLabel: string;
  deviceSummary: string;
  revisionDensity: number;
  plainSummary: string;
  bullets: string[];
};

export function buildProcessCertificate(input: {
  authorId: string;
  title: string;
  text: string;
  ops: CompositionOperation[];
  focusLosses?: number;
  focusLossTimestamps?: number[];
  deviceTrail?: DeviceTrailSummary | null;
}): ProcessCertificate {
  const ops = input.ops ?? [];
  const composition = scoreCompositionHealth(ops, input.focusLosses ?? 0);
  const timed: TimedOp[] = ops.map((o) => ({
    timestamp: o.timestamp,
    kind: o.kind,
    chars: o.chars,
  }));
  const session = buildSessionGraph(timed);
  const continuity = scoreContinuity(ops);
  const paste = classifyPasteOrigins(ops, input.focusLossTimestamps ?? []);

  const wordCount = input.text.trim() ? input.text.trim().split(/\s+/).length : 0;
  const activeWritingMinutes = Math.round(session.activeWritingMs / 60_000);

  const deviceSummary = input.deviceTrail
    ? `${input.deviceTrail.distinctIpCount} IP(s), ${input.deviceTrail.distinctDeviceCount} device(s)`
    : "Device trail not linked";

  const bullets: string[] = [
    `Active writing ≈ ${activeWritingMinutes} min across ${session.segmentCount} segment(s).`,
    `Organic composition ratio ${(composition.organicRatio * 100).toFixed(0)}% · paste share ${(composition.pastedRatio * 100).toFixed(0)}%.`,
    `Continuity: ${continuity.label}. Session structure: ${session.structuralLabel}.`,
    paste.externalBulkEvents
      ? `${paste.externalBulkEvents} external-bulk paste event(s).`
      : "No external-bulk pastes detected.",
    `Devices / networks: ${deviceSummary}.`,
  ];

  const plainSummary = [
    `“${input.title}” (${wordCount} words) was composed with ${composition.aiRiskLabel.toLowerCase()} behavioural risk.`,
    continuity.notes[0],
    session.notes[0],
  ].join(" ");

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    authorId: input.authorId,
    documentTitle: input.title,
    wordCount,
    activeWritingMinutes,
    compositionRisk: composition.aiRiskLabel,
    organicRatio: Number(composition.organicRatio.toFixed(3)),
    pasteSummary: paste.notes[0] ?? "No paste activity",
    continuityLabel: continuity.label,
    sessionLabel: session.structuralLabel,
    deviceSummary,
    revisionDensity: Number(composition.revisionRatio.toFixed(3)),
    plainSummary,
    bullets,
  };
}

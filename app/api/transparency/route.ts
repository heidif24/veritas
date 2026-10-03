import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { scoreCompositionHealth, type CompositionOperation } from "@/lib/composition-health";
import { scoreContinuity } from "@/lib/continuity-score";
import { classifyPasteOrigins } from "@/lib/paste-origin";
import { buildSessionGraph, type TimedOp } from "@/lib/session-graph";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

/**
 * POST /api/transparency
 * Student-facing live authorship health — what is being recorded + current signals.
 * Body: { ops, focusLosses?, text? }
 */
export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const body = await request.json().catch(() => ({}));
  const ops = (Array.isArray(body.ops) ? body.ops : []) as CompositionOperation[];
  const focusLosses = Number(body.focusLosses ?? 0) || 0;
  const text = String(body.text ?? "");

  const composition = scoreCompositionHealth(ops, focusLosses);
  const continuity = scoreContinuity(ops);
  const paste = classifyPasteOrigins(ops);
  const timed: TimedOp[] = ops.map((o) => ({
    timestamp: o.timestamp,
    kind: o.kind,
    chars: o.chars,
  }));
  const session = buildSessionGraph(timed);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return withSecurityHeaders(
    NextResponse.json({
      recorded: [
        "Keystroke timing and character counts (not the keys themselves)",
        "Paste and delete events (size only, not clipboard content)",
        "Focus loss / tab switch counts",
        "Login IP and device fingerprint for session integrity",
      ],
      live: {
        wordCount,
        organicRatio: composition.organicRatio,
        pastedRatio: composition.pastedRatio,
        riskLabel: composition.aiRiskLabel,
        signalSummary: composition.signalSummary,
        continuity: continuity.label,
        sessionStructure: session.structuralLabel,
        externalBulkPastes: paste.externalBulkEvents,
        activeWritingMinutes: Math.round(session.activeWritingMs / 60_000),
      },
      notes: [
        ...composition.notes.slice(0, 2),
        ...continuity.notes.slice(0, 1),
        ...paste.notes.slice(0, 1),
      ],
    }),
  );
}

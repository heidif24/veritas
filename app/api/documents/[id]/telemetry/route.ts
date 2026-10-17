import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAssignmentLinkForDocument } from "@/lib/assignment-link";
import { getAttemptInfo } from "@/lib/submission-policy";
import { loadDocumentTelemetry, saveDocumentTelemetry } from "@/lib/telemetry-store";
import type { CompositionOperation } from "@/lib/composition-health";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const link = getAssignmentLinkForDocument(id);
    const attemptInfo = link && (link.userId === user.id || user.role !== "STUDENT")
      ? getAttemptInfo(link.assignmentId, link.userId)
      : null;
    return NextResponse.json({
      telemetry: loadDocumentTelemetry(id),
      assignmentId: link?.assignmentId ?? null,
      attemptInfo,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    if (user.role !== "ADMIN" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json().catch(() => ({}));
    const ops: CompositionOperation[] = Array.isArray(body.ops)
      ? body.ops.map((o: { timestamp?: number; kind?: string; type?: string; chars?: number }) => ({
          timestamp: Number(o.timestamp || Date.now()),
          kind: (o.kind === "paste" || o.kind === "delete" || o.type === "paste" || o.type === "delete"
            ? o.kind || o.type
            : "type") as CompositionOperation["kind"],
          chars: Number(o.chars || 0),
        }))
      : [];
    const saved = saveDocumentTelemetry(id, {
      ops,
      focusLosses: Number(body.focusLosses ?? 0),
      focusLossTimestamps: Array.isArray(body.focusLossTimestamps) ? body.focusLossTimestamps : [],
    });
    return NextResponse.json({ ok: true, telemetry: saved });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

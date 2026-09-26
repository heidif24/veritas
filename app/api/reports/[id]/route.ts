import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma, getDb } from "@/lib/db";
import { buildIntegrityReport } from "@/lib/integrity-report";
import type { CompositionOperation } from "@/lib/composition-health";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const isOwner = document.ownerId === user.id;
    const isStaff = user.role === "ADMIN" || user.role === "INSTRUCTOR";
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();
    const telemetryRow = db.prepare("SELECT telemetry_json FROM documents WHERE id = ?").get(id) as
      | { telemetry_json?: string }
      | undefined;
    let ops: CompositionOperation[] = [];
    let focusLosses = 0;
    try {
      const tel = JSON.parse(telemetryRow?.telemetry_json || "{}");
      if (Array.isArray(tel.ops)) {
        ops = tel.ops.map((o: { type?: string; kind?: string; timestamp?: number; chars?: number }) => ({
          timestamp: Number(o.timestamp || Date.now()),
          kind: (o.kind || o.type || "type") as CompositionOperation["kind"],
          chars: Number(o.chars || 1),
        }));
      }
      focusLosses = Number(tel.blurCount || tel.tabSwitches || 0);
    } catch {
      /* empty */
    }

    const plag = db
      .prepare("SELECT overall_score, matched_segments FROM plagiarism_checks WHERE document_id = ? ORDER BY created_at DESC LIMIT 1")
      .get(id) as { overall_score?: number; matched_segments?: string } | undefined;

    let matches: Array<{ snippet: string; sourceTitle?: string; similarityPercentage: number; matchedSourceUrl?: string }> = [];
    try {
      matches = JSON.parse(plag?.matched_segments || "[]");
    } catch {
      matches = [];
    }

    const revision = db
      .prepare("SELECT content FROM document_revisions WHERE document_id = ? ORDER BY created_at ASC LIMIT 1")
      .get(id) as { content?: string } | undefined;

    const text = String(document.content || "").replace(/<[^>]+>/g, " ");
    const report = buildIntegrityReport({
      documentId: id,
      title: document.title,
      text,
      ops,
      focusLosses,
      baselineText: revision?.content?.replace(/<[^>]+>/g, " ") || null,
      sealed: Boolean(document.sealedHash),
      sealedHash: document.sealedHash,
      similarityScore: Number(plag?.overall_score ?? 0),
      similarityThreshold: 20,
      matches,
    });

    return NextResponse.json({ report });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

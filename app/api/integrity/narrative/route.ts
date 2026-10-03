import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma, getDb } from "@/lib/db";
import { buildIntegrityNarrative } from "@/lib/integrity-narrative";
import { withSecurityHeaders } from "@/lib/security";
import type { CompositionOperation } from "@/lib/composition-health";

export const runtime = "nodejs";

/**
 * GET /api/integrity/narrative?documentId=
 * Instructor/admin integrity narrative for a submission.
 */
export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN", "INSTRUCTOR"]);
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");
  if (!documentId) {
    return withSecurityHeaders(NextResponse.json({ error: "documentId is required" }, { status: 400 }));
  }

  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) {
    return withSecurityHeaders(NextResponse.json({ error: "Document not found" }, { status: 404 }));
  }

  let ops: CompositionOperation[] = [];
  let focusLosses = 0;
  try {
    const row = getDb().prepare(`SELECT telemetry_json FROM documents WHERE id = ?`).get(documentId) as
      | { telemetry_json?: string }
      | undefined;
    if (row?.telemetry_json) {
      const tel = JSON.parse(row.telemetry_json);
      if (Array.isArray(tel.ops)) ops = tel.ops;
      focusLosses = Number(tel.blurCount ?? tel.focusLosses ?? 0) || 0;
    }
  } catch {
    /* empty */
  }

  const narrative = buildIntegrityNarrative({
    documentId,
    title: document.title,
    text: document.content,
    authorId: document.ownerId,
    ops,
    focusLosses,
    sealed: Boolean(document.sealedHash),
    sealedHash: document.sealedHash,
  });

  return withSecurityHeaders(NextResponse.json(narrative));
}

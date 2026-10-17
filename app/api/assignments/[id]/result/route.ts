import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getAssignment } from "@/lib/assignments";
import { ensureSubmissionColumns, getAttemptInfo } from "@/lib/submission-policy";

export const runtime = "nodejs";

/** Latest similarity + AI result for the signed-in student. Survives a refresh. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: assignmentId } = await params;
    const assignment = getAssignment(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    ensureSubmissionColumns();
    const row = getDb()
      .prepare(
        `SELECT * FROM submissions
         WHERE assignment_id = ? AND author_id = ?
         ORDER BY COALESCE(attempt_number, 1) DESC, created_at DESC
         LIMIT 1`,
      )
      .get(assignmentId, user.id) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json({ attemptInfo: getAttemptInfo(assignmentId, user.id), submission: null });
    }

    let similarity: unknown = null;
    let ai: unknown = null;
    try {
      similarity = row.similarity_details_json ? JSON.parse(String(row.similarity_details_json)) : null;
    } catch {
      similarity = null;
    }
    try {
      ai = row.ai_details_json ? JSON.parse(String(row.ai_details_json)) : null;
    } catch {
      ai = null;
    }

    return NextResponse.json({
      attemptInfo: getAttemptInfo(assignmentId, user.id),
      submission: {
        id: row.id,
        documentId: row.document_id,
        attemptNumber: Number(row.attempt_number ?? 1),
        similarityScore: row.similarity_score != null ? Number(row.similarity_score) : null,
        aiScore: row.ai_score != null ? Number(row.ai_score) : null,
        aiLabel: row.ai_label ?? null,
        plainText: String(row.content_snapshot || ""),
        similarity,
        ai,
        submittedAt: row.submitted_at || row.created_at,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

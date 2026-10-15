import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getAssignment } from "@/lib/assignments";
import { getAttemptInfo } from "@/lib/submission-policy";
import { buildHighlightedHtml } from "@/lib/highlighted-document";

export const runtime = "nodejs";

/**
 * GET — student downloads a Turnitin-style colour-highlighted HTML of their
 * latest submission for this assignment (similarity yellow, AI risk orange/red).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: assignmentId } = await params;
    const assignment = getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const attempt = getAttemptInfo(assignmentId, user.id);
    if (!attempt.lastSubmissionId) {
      return NextResponse.json(
        { error: "No submission found for this assignment yet." },
        { status: 404 },
      );
    }

    const row = getDb()
      .prepare(
        `SELECT s.*, d.content as document_content, d.title as document_title
         FROM submissions s
         LEFT JOIN documents d ON d.id = s.document_id
         WHERE s.id = ? AND s.author_id = ?`,
      )
      .get(attempt.lastSubmissionId, user.id) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const plainText = String(row.document_content || "").replace(/<[^>]+>/g, " ");
    let similarityMatches: Array<{
      start?: number;
      end?: number;
      snippet?: string;
      sourceTitle?: string;
      similarityPercentage?: number;
    }> = [];
    let aiSegments: Array<{
      start?: number;
      end?: number;
      text?: string;
      risk?: string;
      reason?: string;
    }> = [];
    let aiLabel: string | undefined;

    try {
      const simDetails = JSON.parse(String(row.similarity_details_json || "{}"));
      if (Array.isArray(simDetails.matchedSegments)) {
        similarityMatches = simDetails.matchedSegments;
      }
    } catch {
      /* */
    }
    try {
      const aiDetails = JSON.parse(String(row.ai_details_json || "{}"));
      if (Array.isArray(aiDetails.segments)) aiSegments = aiDetails.segments;
      if (typeof aiDetails.label === "string") aiLabel = aiDetails.label;
    } catch {
      /* */
    }

    const html = buildHighlightedHtml({
      title: String(row.document_title || assignment.title || "Submission"),
      plainText,
      similarityScore: row.similarity_score != null ? Number(row.similarity_score) : undefined,
      aiScore: row.ai_score != null ? Number(row.ai_score) : undefined,
      aiLabel: aiLabel || (typeof row.ai_label === "string" ? row.ai_label : undefined),
      attemptNumber: Number(row.attempt_number ?? 1),
      maxAttempts: attempt.maxAttempts,
      similarityMatches,
      aiSegments,
    });

    const filename = `${String(row.document_title || "submission")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .slice(0, 50)}-highlighted.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

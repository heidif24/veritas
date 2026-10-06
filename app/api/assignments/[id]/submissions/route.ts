import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getAssignment } from "@/lib/assignments";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }

    const { id: assignmentId } = await params;
    const db = getDb();
    const assignment = getAssignment(assignmentId);

    // If assignment missing, still try to return linked submissions or sealed docs for demo continuity
    const rows = db
      .prepare(
        `SELECT
           s.id as submission_id,
           s.assignment_id,
           s.document_id,
           s.author_id,
           s.status as submission_status,
           s.health_score,
           s.similarity_score,
           s.sealed_hash as submission_sealed_hash,
           s.created_at as submitted_at,
           d.title as document_title,
           d.content as document_content,
           d.status as document_status,
           d.sealed_hash as document_sealed_hash,
           d.integrity_status,
           u.name as student_name,
           u.email as student_email,
           c.score as grade_score,
           c.max_score as grade_max_score,
           c.decision as review_decision,
           c.updated_at as graded_at
         FROM submissions s
         LEFT JOIN documents d ON d.id = s.document_id
         LEFT JOIN users u ON u.id = s.author_id
         LEFT JOIN (
           SELECT document_id, score, max_score, decision, updated_at
           FROM integrity_cases
           WHERE id IN (SELECT id FROM integrity_cases GROUP BY document_id HAVING MAX(updated_at))
         ) c ON c.document_id = s.document_id
         WHERE s.assignment_id = ?
         ORDER BY s.created_at DESC`,
      )
      .all(assignmentId) as Array<Record<string, unknown>>;

    // Fallback: sealed/submitted documents when no formal submissions yet
    let submissions = rows;
    if (!submissions.length) {
      const docs = db
        .prepare(
          `SELECT
             d.id as document_id,
             d.id as submission_id,
             d.title as document_title,
             d.content as document_content,
             d.status as document_status,
             d.sealed_hash as document_sealed_hash,
             d.integrity_status,
             d.updated_at as submitted_at,
             u.id as author_id,
             u.name as student_name,
             u.email as student_email
           FROM documents d
           LEFT JOIN users u ON u.id = d.owner_id
           WHERE d.status IN ('submitted', 'sealed') OR d.sealed_hash IS NOT NULL
           ORDER BY d.updated_at DESC
           LIMIT 50`,
        )
        .all() as Array<Record<string, unknown>>;
      submissions = docs.map((d) => ({
        ...d,
        assignment_id: assignmentId,
        submission_status: d.document_status || "submitted",
        health_score: null,
        similarity_score: null,
      }));
    }

    // Latest case scores (simpler join fallback)
    const enriched = submissions.map((row) => {
      const docId = String(row.document_id || "");
      const caseRow = db
        .prepare(
          `SELECT score, max_score, decision, notes, comments_json, updated_at
           FROM integrity_cases WHERE document_id = ? ORDER BY updated_at DESC LIMIT 1`,
        )
        .get(docId) as
        | {
            score?: number | null;
            max_score?: number | null;
            decision?: string;
            notes?: string;
            comments_json?: string;
            updated_at?: string;
          }
        | undefined;

      const health = row.health_score != null ? Number(row.health_score) : null;
      const authenticity =
        health != null
          ? Math.round((1 - Math.min(1, health)) * 100)
          : caseRow?.score != null
            ? Number(caseRow.score)
            : null;

      return {
        id: String(row.submission_id || row.document_id),
        submissionId: String(row.submission_id || row.document_id),
        documentId: docId,
        assignmentId: String(row.assignment_id || assignmentId),
        studentName: String(row.student_name || "Student"),
        studentEmail: String(row.student_email || ""),
        title: String(row.document_title || "Untitled"),
        status: String(row.submission_status || row.document_status || "submitted"),
        authenticityScore: authenticity,
        similarityScore:
          row.similarity_score != null ? Math.round(Number(row.similarity_score) * 100) : null,
        sealed: Boolean(row.document_sealed_hash || row.submission_sealed_hash),
        submittedAt: String(row.submitted_at || ""),
        grade: caseRow?.score != null ? Number(caseRow.score) : null,
        maxScore: caseRow?.max_score != null ? Number(caseRow.max_score) : 100,
        decision: caseRow?.decision || "pending",
        gradedAt: caseRow?.updated_at || null,
      };
    });

    const graded = enriched.filter((s) => s.grade != null);
    const summary = {
      total: enriched.length,
      sealed: enriched.filter((s) => s.sealed).length,
      needsReview: enriched.filter((s) => s.decision === "pending" || s.status === "submitted").length,
      avgAuthenticity:
        enriched.filter((s) => s.authenticityScore != null).length > 0
          ? Math.round(
              enriched
                .filter((s) => s.authenticityScore != null)
                .reduce((a, s) => a + Number(s.authenticityScore), 0) /
                enriched.filter((s) => s.authenticityScore != null).length,
            )
          : null,
      avgGrade:
        graded.length > 0
          ? Math.round(graded.reduce((a, s) => a + Number(s.grade), 0) / graded.length)
          : null,
    };

    return withSecurityHeaders(
      NextResponse.json({
        assignment: assignment || { id: assignmentId, title: "Assignment" },
        submissions: enriched,
        summary,
      }),
    );
  } catch (e) {
    console.error(e);
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAssignment } from "@/lib/assignments";
import { folderRelease, listLatestSubmissionPerStudent, listSubmissionsForAssignment } from "@/lib/submission-policy";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

/** Lecturer folder: all students who submitted for this assignment. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(["INSTRUCTOR", "ADMIN"]);
    const { id: assignmentId } = await params;
    const assignment = getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (user.role === "INSTRUCTOR") {
      const course = getDb()
        .prepare(`SELECT instructor_id FROM courses WHERE id = ?`)
        .get(assignment.course_id) as { instructor_id?: string } | undefined;
      if (course?.instructor_id && course.instructor_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const url = new URL(request.url);
    const allAttempts = url.searchParams.get("all") === "1";
    const rows = allAttempts
      ? listSubmissionsForAssignment(assignmentId)
      : listLatestSubmissionPerStudent(assignmentId);

    const release = folderRelease(assignment.due_at ?? null);
    const submissions = release.released
      ? rows.map((r) => ({
      submissionId: r.id,
      documentId: r.document_id,
      authorId: r.author_id,
      authorName: r.author_name || "Student",
      authorEmail: r.author_email || "",
      documentTitle: r.document_title || "Submission",
      attemptNumber: Number(r.attempt_number ?? 1),
      similarityScore: r.similarity_score != null ? Number(r.similarity_score) : null,
      aiScore: r.ai_score != null ? Number(r.ai_score) : null,
      aiLabel: r.ai_label || null,
      healthScore: r.health_score != null ? Number(r.health_score) : null,
      status: r.status,
      submittedAt: r.submitted_at || r.created_at,
    }))
      : [];

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        dueAt: assignment.due_at ?? null,
        maxAttempts: 3,
      },
      released: release.released,
      releaseMessage: release.reason,
      pendingCount: rows.length,
      count: submissions.length,
      submissions,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}

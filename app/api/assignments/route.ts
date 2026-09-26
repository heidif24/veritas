import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listAssignmentsForCourse, ensureAssignmentColumns } from "@/lib/assignments";
import { createRichAssignment } from "@/lib/assignments-extended";
import { getDb } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import { rateLimit, clientIp, sanitizePlainText, withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId");
    ensureAssignmentColumns();
    if (courseId) {
      return withSecurityHeaders(NextResponse.json({ assignments: listAssignmentsForCourse(courseId) }));
    }
    const db = getDb();
    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
      const rows = db
        .prepare(
          `SELECT a.* FROM assignments a
           LEFT JOIN courses c ON c.id = a.course_id
           WHERE c.instructor_id = ? OR ? = 'ADMIN'
           ORDER BY a.created_at DESC LIMIT 100`,
        )
        .all(user.id, user.role);
      return withSecurityHeaders(NextResponse.json({ assignments: rows }));
    }
    const rows = db
      .prepare(
        `SELECT a.* FROM assignments a
         JOIN enrollments e ON e.course_id = a.course_id
         WHERE e.user_id = ?
         UNION
         SELECT a.* FROM assignments a
         JOIN assignment_invites i ON i.assignment_id = a.id
         WHERE lower(i.email) = lower(?)
         ORDER BY created_at DESC LIMIT 100`,
      )
      .all(user.id, user.email);
    return withSecurityHeaders(NextResponse.json({ assignments: rows }));
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }
    const ip = clientIp(request);
    const limited = rateLimit(`assignment-create:${user.id}:${ip}`, 30, 60_000);
    if (limited) return withSecurityHeaders(limited);

    const body = await request.json().catch(() => ({}));
    let courseId = String(body.courseId || "");
    const title = sanitizePlainText(String(body.title || ""), 300);
    if (!title) return withSecurityHeaders(NextResponse.json({ error: "title required" }, { status: 400 }));

    const db = getDb();
    if (!courseId || courseId === "default-course") {
      const existing = db.prepare("SELECT id FROM courses WHERE instructor_id = ? LIMIT 1").get(user.id) as { id?: string } | undefined;
      if (existing?.id) {
        courseId = existing.id;
      } else {
        courseId = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
        db.prepare(
          `INSERT INTO courses (id, organization_id, title, code, join_code, instructor_id) VALUES (?, ?, ?, ?, ?, ?)`,
        ).run(
          courseId,
          user.organizationId ?? "org-default",
          "Faculty workspace",
          "FAC-1",
          crypto.randomUUID().slice(0, 8),
          user.id,
        );
      }
    }

    const assignment = createRichAssignment({
      courseId,
      title,
      instructions: body.instructions,
      dueAt: body.dueAt,
      maxAttempts: body.maxAttempts,
      allowResubmit: body.allowResubmit,
      genre: body.genre,
      pasteThreshold: body.pasteThreshold,
      similarityThreshold: body.similarityThreshold,
      requireSeal: body.requireSeal,
      groupWork: body.groupWork,
      rubric: body.rubric,
      kind: body.kind,
      timeLimitMinutes: body.timeLimitMinutes,
      objectives: body.objectives,
      proctored: Boolean(body.proctored),
    });

    recordAudit({
      action: "assignment_created",
      actorId: user.id,
      metadata: { assignmentId: assignment?.id, title, kind: body.kind, proctored: Boolean(body.proctored) },
    });

    return withSecurityHeaders(NextResponse.json({ assignment }));
  } catch (e) {
    console.error(e);
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

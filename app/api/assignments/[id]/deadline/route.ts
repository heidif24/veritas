import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAssignment } from "@/lib/assignments";
import { updateAssignmentDueAt } from "@/lib/submission-policy";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

/** Lecturer/admin only: set or clear due date (extending reopens submissions). */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await request.json().catch(() => ({}));
    let dueAt: string | null = null;
    if (body.dueAt === null || body.dueAt === "") {
      dueAt = null;
    } else if (typeof body.dueAt === "string") {
      const d = new Date(body.dueAt);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ error: "Invalid dueAt" }, { status: 400 });
      }
      dueAt = d.toISOString();
    } else {
      return NextResponse.json({ error: "dueAt must be an ISO string or null" }, { status: 400 });
    }

    const updated = updateAssignmentDueAt(assignmentId, dueAt);
    return NextResponse.json({
      ok: true,
      assignment: updated,
      message: dueAt
        ? `Deadline set to ${new Date(dueAt).toLocaleString()}. Students may submit again if they have attempts remaining.`
        : "Deadline cleared. Assignment is open until a new due date is set.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["INSTRUCTOR", "ADMIN", "STUDENT"]);
    const { id } = await params;
    const assignment = getAssignment(id);
    if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      dueAt: assignment.due_at ?? null,
      maxAttempts: assignment.max_attempts ?? 3,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

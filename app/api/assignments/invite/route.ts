import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

function ensureInvites() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS assignment_invites (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(assignment_id, email)
    );
  `);
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    ensureInvites();
    const body = await request.json().catch(() => ({}));
    const assignmentId = String(body.assignmentId || "");
    const emails: string[] = Array.isArray(body.emails) ? body.emails.map(String) : [];
    if (!assignmentId || !emails.length) {
      return NextResponse.json({ error: "assignmentId and emails required" }, { status: 400 });
    }

    const db = getDb();
    let invited = 0;
    for (const email of emails) {
      const clean = email.trim().toLowerCase();
      if (!clean.includes("@")) continue;
      const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      try {
        db.prepare(
          `INSERT OR IGNORE INTO assignment_invites (id, assignment_id, email, status) VALUES (?, ?, ?, 'pending')`,
        ).run(id, assignmentId, clean);
        invited += 1;

        const existing = db.prepare("SELECT id FROM users WHERE lower(email) = ?").get(clean) as { id?: string } | undefined;
        if (existing?.id) {
          const assignment = db.prepare("SELECT course_id FROM assignments WHERE id = ?").get(assignmentId) as { course_id?: string } | undefined;
          if (assignment?.course_id) {
            const eid = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
            db.prepare(
              `INSERT OR IGNORE INTO enrollments (id, course_id, user_id, role) VALUES (?, ?, ?, 'STUDENT')`,
            ).run(eid, assignment.course_id, existing.id);
          }
        }
      } catch { /* skip */ }
    }

    recordAudit({
      action: "assignment_invites",
      actorId: user.id,
      metadata: { assignmentId, invited, total: emails.length },
    });

    return NextResponse.json({ ok: true, invited });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

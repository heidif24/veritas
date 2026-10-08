import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionByToken, getUserById } from "@/lib/db";
import {
  ensureTutoringTables,
  createCoachingSession,
  listSessionsForUser,
  normalizeSession,
  seedDemoTutors,
} from "@/lib/tutoring";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

async function currentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("veritas_session")?.value;
  if (!token) return null;
  const session = getSessionByToken(token);
  if (!session) return null;
  return getUserById(session.user_id) ?? null;
}

export async function GET() {
  ensureTutoringTables();
  seedDemoTutors();
  const user = await currentUser();
  if (!user) return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const rows = listSessionsForUser(user.id, user.role);
  return withSecurityHeaders(NextResponse.json({ sessions: rows.map(normalizeSession) }));
}

export async function POST(request: Request) {
  ensureTutoringTables();
  seedDemoTutors();
  const user = await currentUser();
  if (!user) return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  const body = await request.json().catch(() => ({}));
  const tutorId = String(body.tutorId ?? "");
  if (!tutorId) {
    return withSecurityHeaders(NextResponse.json({ error: "tutorId is required" }, { status: 400 }));
  }

  try {
    const row = createCoachingSession({
      studentId: user.id,
      tutorId,
      documentId: body.documentId ? String(body.documentId) : null,
      assignmentTitle: body.assignmentTitle ? String(body.assignmentTitle) : undefined,
      durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : 60,
      scheduledAt: body.scheduledAt ? String(body.scheduledAt) : null,
      studentNotes: body.studentNotes ? String(body.studentNotes) : undefined,
      teamsJoinUrl: body.teamsJoinUrl ? String(body.teamsJoinUrl) : null,
      calendlyEventUrl: body.calendlyEventUrl ? String(body.calendlyEventUrl) : null,
    });
    return withSecurityHeaders(
      NextResponse.json({ session: normalizeSession(row!) }, { status: 201 }),
    );
  } catch (e) {
    return withSecurityHeaders(
      NextResponse.json({ error: e instanceof Error ? e.message : "Booking failed" }, { status: 400 }),
    );
  }
}

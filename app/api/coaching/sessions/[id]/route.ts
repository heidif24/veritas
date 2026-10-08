import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionByToken, getUserById, getDocumentById } from "@/lib/db";
import {
  ensureTutoringTables,
  getCoachingSessionById,
  updateCoachingSession,
  completeSessionAndPayout,
  normalizeSession,
  listSessionComments,
  addSessionComment,
  getTutorProfileByUserId,
  normalizeTutorProfile,
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

function canAccess(user: { id: string; role: string }, session: { student_id: string; tutor_id: string }) {
  return user.role === "ADMIN" || user.id === session.student_id || user.id === session.tutor_id;
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  ensureTutoringTables();
  const user = await currentUser();
  if (!user) return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const { id } = await ctx.params;
  const row = getCoachingSessionById(id);
  if (!row || !canAccess(user, row)) {
    return withSecurityHeaders(NextResponse.json({ error: "Not found" }, { status: 404 }));
  }
  const comments = listSessionComments(id).map((c) => ({
    id: c.id,
    authorId: c.author_id,
    authorRole: c.author_role,
    authorName: getUserById(c.author_id)?.name ?? "User",
    body: c.body,
    anchorText: c.anchor_text,
    anchorOffset: c.anchor_offset,
    createdAt: c.created_at,
  }));
  const doc = row.document_id ? getDocumentById(row.document_id) : null;
  const tutorProfile = normalizeTutorProfile(getTutorProfileByUserId(row.tutor_id), getUserById(row.tutor_id));

  return withSecurityHeaders(
    NextResponse.json({
      session: normalizeSession(row),
      comments,
      document: doc
        ? { id: doc.id, title: doc.title, content: doc.content, status: doc.status }
        : null,
      tutorProfile,
      // During coaching, telemetry panels are reduced — client uses this flag
      reduceTelemetry: true,
    }),
  );
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  ensureTutoringTables();
  const user = await currentUser();
  if (!user) return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const { id } = await ctx.params;
  const row = getCoachingSessionById(id);
  if (!row || !canAccess(user, row)) {
    return withSecurityHeaders(NextResponse.json({ error: "Not found" }, { status: 404 }));
  }

  const body = await request.json().catch(() => ({}));
  const action = String(body.action ?? "");

  if (action === "start") {
    const updated = updateCoachingSession(id, {
      status: "in_progress",
      startedAt: new Date().toISOString(),
    });
    return withSecurityHeaders(NextResponse.json({ session: normalizeSession(updated!) }));
  }

  if (action === "complete") {
    // Only tutor or admin can complete + trigger payout
    if (user.id !== row.tutor_id && user.role !== "ADMIN") {
      return withSecurityHeaders(NextResponse.json({ error: "Only the tutor can complete the session" }, { status: 403 }));
    }
    const updated = completeSessionAndPayout(id);
    return withSecurityHeaders(
      NextResponse.json({
        session: normalizeSession(updated!),
        message: "Session completed. Tutor payout recorded.",
      }),
    );
  }

  if (action === "comment") {
    const text = String(body.body ?? "").trim();
    if (!text) return withSecurityHeaders(NextResponse.json({ error: "Comment body required" }, { status: 400 }));
    const role = user.id === row.tutor_id ? "TUTOR" : user.id === row.student_id ? "STUDENT" : user.role;
    const comment = addSessionComment({
      sessionId: id,
      authorId: user.id,
      authorRole: role,
      body: text,
      anchorText: body.anchorText ? String(body.anchorText) : null,
      anchorOffset: body.anchorOffset != null ? Number(body.anchorOffset) : null,
    });
    return withSecurityHeaders(
      NextResponse.json({
        comment: {
          id: comment.id,
          authorId: comment.author_id,
          authorRole: comment.author_role,
          authorName: user.name,
          body: comment.body,
          anchorText: comment.anchor_text,
          createdAt: comment.created_at,
        },
      }),
    );
  }

  // Generic field updates
  const updated = updateCoachingSession(id, {
    status: body.status ? String(body.status) : undefined,
    scheduledAt: body.scheduledAt !== undefined ? (body.scheduledAt ? String(body.scheduledAt) : null) : undefined,
    teamsJoinUrl: body.teamsJoinUrl !== undefined ? (body.teamsJoinUrl ? String(body.teamsJoinUrl) : null) : undefined,
    calendlyEventUrl: body.calendlyEventUrl !== undefined ? (body.calendlyEventUrl ? String(body.calendlyEventUrl) : null) : undefined,
    tutorNotes: body.tutorNotes !== undefined ? (body.tutorNotes ? String(body.tutorNotes) : null) : undefined,
  } as Parameters<typeof updateCoachingSession>[1]);

  return withSecurityHeaders(NextResponse.json({ session: normalizeSession(updated!) }));
}

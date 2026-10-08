import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionByToken, getUserById, createUser } from "@/lib/db";
import {
  ensureTutoringTables,
  listApprovedTutors,
  upsertTutorProfile,
  normalizeTutorProfile,
  seedDemoTutors,
} from "@/lib/tutoring";
import bcrypt from "bcryptjs";
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
  const tutors = listApprovedTutors();
  return withSecurityHeaders(NextResponse.json({ tutors }));
}

/** Create or update tutor profile (authenticated TUTOR or self-register as tutor). */
export async function POST(request: Request) {
  ensureTutoringTables();
  const body = await request.json().catch(() => ({}));
  const user = await currentUser();

  // Allow creating a tutor account in one step if not logged in
  if (!user && body.name && body.email && body.password) {
    const { getUserByEmail, getDb } = await import("@/lib/db");
    if (getUserByEmail(String(body.email).toLowerCase())) {
      return withSecurityHeaders(
        NextResponse.json(
          { error: "Email already registered. Sign in and complete your tutor profile." },
          { status: 409 },
        ),
      );
    }
    // Create as STUDENT then promote — keeps Role union strict without TUTOR in Prisma enum usage
    const newUser = createUser({
      name: String(body.name).trim(),
      email: String(body.email).toLowerCase().trim(),
      passwordHash: await bcrypt.hash(String(body.password), 12),
      role: "STUDENT",
    });
    getDb().prepare("UPDATE users SET role = 'TUTOR' WHERE id = ?").run(newUser.id);

    const profile = upsertTutorProfile({
      userId: newUser.id,
      headline: body.headline ? String(body.headline) : "Writing Tutor",
      bio: body.bio ? String(body.bio) : "",
      specialties: Array.isArray(body.specialties) ? body.specialties.map(String) : ["Academic writing"],
      languages: Array.isArray(body.languages) ? body.languages.map(String) : ["English"],
      hourlyRateCents: Number(body.hourlyRateCents) || 2000,
      currency: body.currency ? String(body.currency) : "GBP",
      videoIntroUrl: body.videoIntroUrl ? String(body.videoIntroUrl) : null,
      calendlyUrl: body.calendlyUrl ? String(body.calendlyUrl) : null,
      teamsMeetingUrl: body.teamsMeetingUrl ? String(body.teamsMeetingUrl) : null,
      capacityHoursWeek: Number(body.capacityHoursWeek) || 10,
      vettingStatus: "pending",
    });

    return withSecurityHeaders(
      NextResponse.json(
        {
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "TUTOR" },
          profile: normalizeTutorProfile(profile!, { ...newUser, role: "STUDENT" }),
          message: "Tutor account created. Profile pending vetting.",
        },
        { status: 201 },
      ),
    );
  }

  if (!user) {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  // Promote to TUTOR if needed
  if (user.role !== "TUTOR" && user.role !== "ADMIN") {
    const { getDb } = await import("@/lib/db");
    getDb().prepare("UPDATE users SET role = 'TUTOR' WHERE id = ?").run(user.id);
  }

  const profile = upsertTutorProfile({
    userId: user.id,
    headline: body.headline ? String(body.headline) : undefined,
    bio: body.bio ? String(body.bio) : undefined,
    specialties: Array.isArray(body.specialties) ? body.specialties.map(String) : undefined,
    languages: Array.isArray(body.languages) ? body.languages.map(String) : undefined,
    hourlyRateCents: body.hourlyRateCents != null ? Number(body.hourlyRateCents) : undefined,
    currency: body.currency ? String(body.currency) : undefined,
    videoIntroUrl:
      body.videoIntroUrl !== undefined ? (body.videoIntroUrl ? String(body.videoIntroUrl) : null) : undefined,
    calendlyUrl:
      body.calendlyUrl !== undefined ? (body.calendlyUrl ? String(body.calendlyUrl) : null) : undefined,
    teamsMeetingUrl:
      body.teamsMeetingUrl !== undefined
        ? body.teamsMeetingUrl
          ? String(body.teamsMeetingUrl)
          : null
        : undefined,
    capacityHoursWeek: body.capacityHoursWeek != null ? Number(body.capacityHoursWeek) : undefined,
  });

  return withSecurityHeaders(
    NextResponse.json({
      profile: normalizeTutorProfile(profile!, getUserById(user.id)),
    }),
  );
}

export async function PATCH(request: Request) {
  // Admin vetting
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }
  const body = await request.json().catch(() => ({}));
  const tutorUserId = String(body.userId ?? "");
  const status = String(body.vettingStatus ?? "");
  if (!tutorUserId || !["approved", "rejected", "pending", "verified"].includes(status)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "userId and valid vettingStatus required" }, { status: 400 }),
    );
  }
  const profile = upsertTutorProfile({ userId: tutorUserId, vettingStatus: status });
  return withSecurityHeaders(
    NextResponse.json({ profile: normalizeTutorProfile(profile!, getUserById(tutorUserId)) }),
  );
}

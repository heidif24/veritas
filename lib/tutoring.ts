import { getDb, cryptoRandomId, getUserById, type UserRow } from "@/lib/db";

/** Ensure tutoring tables exist (idempotent). */
export function ensureTutoringTables() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS tutor_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      headline TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      specialties TEXT NOT NULL DEFAULT '[]',
      languages TEXT NOT NULL DEFAULT '["English"]',
      hourly_rate_cents INTEGER NOT NULL DEFAULT 2000,
      currency TEXT NOT NULL DEFAULT 'GBP',
      video_intro_url TEXT,
      calendly_url TEXT,
      teams_meeting_url TEXT,
      capacity_hours_week INTEGER NOT NULL DEFAULT 10,
      vetting_status TEXT NOT NULL DEFAULT 'pending',
      rating_avg REAL NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0,
      total_hours REAL NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS coaching_sessions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      tutor_id TEXT NOT NULL,
      document_id TEXT,
      assignment_title TEXT,
      status TEXT NOT NULL DEFAULT 'requested',
      scheduled_at TEXT,
      started_at TEXT,
      ended_at TEXT,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      hourly_rate_cents INTEGER NOT NULL,
      platform_fee_cents INTEGER NOT NULL DEFAULT 0,
      tutor_payout_cents INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'GBP',
      teams_join_url TEXT,
      calendly_event_url TEXT,
      student_notes TEXT,
      tutor_notes TEXT,
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (tutor_id) REFERENCES users(id),
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );

    CREATE TABLE IF NOT EXISTS session_comments (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_role TEXT NOT NULL,
      body TEXT NOT NULL,
      anchor_text TEXT,
      anchor_offset INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES coaching_sessions(id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tutor_payouts (
      id TEXT PRIMARY KEY,
      tutor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'GBP',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      paid_at TEXT,
      FOREIGN KEY (tutor_id) REFERENCES users(id),
      FOREIGN KEY (session_id) REFERENCES coaching_sessions(id)
    );
  `);
}

const PLATFORM_FEE_PERCENT = 20; // platform keeps 20% per hour

export type TutorProfileRow = {
  id: string;
  user_id: string;
  headline: string;
  bio: string;
  specialties: string;
  languages: string;
  hourly_rate_cents: number;
  currency: string;
  video_intro_url: string | null;
  calendly_url: string | null;
  teams_meeting_url: string | null;
  capacity_hours_week: number;
  vetting_status: string;
  rating_avg: number;
  rating_count: number;
  total_hours: number;
  active: number;
  created_at: string;
  updated_at: string;
};

export type CoachingSessionRow = {
  id: string;
  student_id: string;
  tutor_id: string;
  document_id: string | null;
  assignment_title: string | null;
  status: string;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_minutes: number;
  hourly_rate_cents: number;
  platform_fee_cents: number;
  tutor_payout_cents: number;
  currency: string;
  teams_join_url: string | null;
  calendly_event_url: string | null;
  student_notes: string | null;
  tutor_notes: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
};

export type SessionCommentRow = {
  id: string;
  session_id: string;
  author_id: string;
  author_role: string;
  body: string;
  anchor_text: string | null;
  anchor_offset: number | null;
  created_at: string;
};

function parseJsonArray(raw: string | null | undefined): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function normalizeTutorProfile(row: TutorProfileRow | undefined, user?: UserRow | null) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: user?.name ?? "Tutor",
    email: user?.email ?? "",
    headline: row.headline,
    bio: row.bio,
    specialties: parseJsonArray(row.specialties),
    languages: parseJsonArray(row.languages),
    hourlyRateCents: row.hourly_rate_cents,
    hourlyRateDisplay: `${(row.hourly_rate_cents / 100).toFixed(0)} ${row.currency}/hr`,
    currency: row.currency,
    videoIntroUrl: row.video_intro_url,
    calendlyUrl: row.calendly_url,
    teamsMeetingUrl: row.teams_meeting_url,
    capacityHoursWeek: row.capacity_hours_week,
    vettingStatus: row.vetting_status,
    ratingAvg: row.rating_avg,
    ratingCount: row.rating_count,
    totalHours: row.total_hours,
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}

export function getTutorProfileByUserId(userId: string) {
  ensureTutoringTables();
  return getDb().prepare("SELECT * FROM tutor_profiles WHERE user_id = ?").get(userId) as TutorProfileRow | undefined;
}

export function getTutorProfileById(id: string) {
  ensureTutoringTables();
  return getDb().prepare("SELECT * FROM tutor_profiles WHERE id = ?").get(id) as TutorProfileRow | undefined;
}

export function listApprovedTutors() {
  ensureTutoringTables();
  const rows = getDb()
    .prepare(
      `SELECT * FROM tutor_profiles
       WHERE active = 1 AND vetting_status IN ('approved', 'verified')
       ORDER BY rating_avg DESC, total_hours DESC`,
    )
    .all() as TutorProfileRow[];
  return rows.map((r) => normalizeTutorProfile(r, getUserById(r.user_id)));
}

export function upsertTutorProfile(input: {
  userId: string;
  headline?: string;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  hourlyRateCents?: number;
  currency?: string;
  videoIntroUrl?: string | null;
  calendlyUrl?: string | null;
  teamsMeetingUrl?: string | null;
  capacityHoursWeek?: number;
  vettingStatus?: string;
}) {
  ensureTutoringTables();
  const existing = getTutorProfileByUserId(input.userId);
  const now = new Date().toISOString();

  if (existing) {
    getDb()
      .prepare(
        `UPDATE tutor_profiles SET
          headline = COALESCE(?, headline),
          bio = COALESCE(?, bio),
          specialties = COALESCE(?, specialties),
          languages = COALESCE(?, languages),
          hourly_rate_cents = COALESCE(?, hourly_rate_cents),
          currency = COALESCE(?, currency),
          video_intro_url = COALESCE(?, video_intro_url),
          calendly_url = COALESCE(?, calendly_url),
          teams_meeting_url = COALESCE(?, teams_meeting_url),
          capacity_hours_week = COALESCE(?, capacity_hours_week),
          vetting_status = COALESCE(?, vetting_status),
          updated_at = ?
         WHERE user_id = ?`,
      )
      .run(
        input.headline ?? null,
        input.bio ?? null,
        input.specialties ? JSON.stringify(input.specialties) : null,
        input.languages ? JSON.stringify(input.languages) : null,
        input.hourlyRateCents ?? null,
        input.currency ?? null,
        input.videoIntroUrl !== undefined ? input.videoIntroUrl : null,
        input.calendlyUrl !== undefined ? input.calendlyUrl : null,
        input.teamsMeetingUrl !== undefined ? input.teamsMeetingUrl : null,
        input.capacityHoursWeek ?? null,
        input.vettingStatus ?? null,
        now,
        input.userId,
      );
    return getTutorProfileByUserId(input.userId);
  }

  const id = cryptoRandomId();
  getDb()
    .prepare(
      `INSERT INTO tutor_profiles (
        id, user_id, headline, bio, specialties, languages, hourly_rate_cents, currency,
        video_intro_url, calendly_url, teams_meeting_url, capacity_hours_week, vetting_status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.userId,
      input.headline ?? "Writing Tutor",
      input.bio ?? "",
      JSON.stringify(input.specialties ?? ["Academic writing"]),
      JSON.stringify(input.languages ?? ["English"]),
      input.hourlyRateCents ?? 2000,
      input.currency ?? "GBP",
      input.videoIntroUrl ?? null,
      input.calendlyUrl ?? null,
      input.teamsMeetingUrl ?? null,
      input.capacityHoursWeek ?? 10,
      input.vettingStatus ?? "pending",
      now,
    );
  return getTutorProfileByUserId(input.userId);
}

export function createCoachingSession(input: {
  studentId: string;
  tutorId: string;
  documentId?: string | null;
  assignmentTitle?: string;
  durationMinutes?: number;
  scheduledAt?: string | null;
  studentNotes?: string;
  teamsJoinUrl?: string | null;
  calendlyEventUrl?: string | null;
}) {
  ensureTutoringTables();
  const profile = getTutorProfileByUserId(input.tutorId);
  if (!profile || !profile.active || !["approved", "verified"].includes(profile.vetting_status)) {
    throw new Error("Tutor is not available for booking.");
  }

  const duration = input.durationMinutes ?? 60;
  const hours = duration / 60;
  const gross = Math.round(profile.hourly_rate_cents * hours);
  const platformFee = Math.round((gross * PLATFORM_FEE_PERCENT) / 100);
  const tutorPayout = gross - platformFee;

  const id = cryptoRandomId();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO coaching_sessions (
        id, student_id, tutor_id, document_id, assignment_title, status, scheduled_at,
        duration_minutes, hourly_rate_cents, platform_fee_cents, tutor_payout_cents, currency,
        teams_join_url, calendly_event_url, student_notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.studentId,
      input.tutorId,
      input.documentId ?? null,
      input.assignmentTitle ?? null,
      input.scheduledAt ? "scheduled" : "requested",
      input.scheduledAt ?? null,
      duration,
      profile.hourly_rate_cents,
      platformFee,
      tutorPayout,
      profile.currency,
      input.teamsJoinUrl ?? profile.teams_meeting_url,
      input.calendlyEventUrl ?? null,
      input.studentNotes ?? null,
      now,
    );
  return getCoachingSessionById(id);
}

export function getCoachingSessionById(id: string) {
  ensureTutoringTables();
  return getDb().prepare("SELECT * FROM coaching_sessions WHERE id = ?").get(id) as CoachingSessionRow | undefined;
}

export function listSessionsForUser(userId: string, role: string) {
  ensureTutoringTables();
  if (role === "TUTOR") {
    return getDb()
      .prepare("SELECT * FROM coaching_sessions WHERE tutor_id = ? ORDER BY created_at DESC")
      .all(userId) as CoachingSessionRow[];
  }
  return getDb()
    .prepare("SELECT * FROM coaching_sessions WHERE student_id = ? ORDER BY created_at DESC")
    .all(userId) as CoachingSessionRow[];
}

export function updateCoachingSession(
  id: string,
  updates: Partial<{
    status: string;
    scheduledAt: string | null;
    startedAt: string | null;
    endedAt: string | null;
    teamsJoinUrl: string | null;
    calendlyEventUrl: string | null;
    tutorNotes: string | null;
    paymentStatus: string;
  }>,
) {
  ensureTutoringTables();
  const fields: string[] = [];
  const values: unknown[] = [];

  const map: Record<string, string> = {
    status: "status",
    scheduledAt: "scheduled_at",
    startedAt: "started_at",
    endedAt: "ended_at",
    teamsJoinUrl: "teams_join_url",
    calendlyEventUrl: "calendly_event_url",
    tutorNotes: "tutor_notes",
    paymentStatus: "payment_status",
  };

  for (const [key, col] of Object.entries(map)) {
    if ((updates as Record<string, unknown>)[key] !== undefined) {
      fields.push(`${col} = ?`);
      values.push((updates as Record<string, unknown>)[key]);
    }
  }

  fields.push("updated_at = ?");
  values.push(new Date().toISOString(), id);
  getDb().prepare(`UPDATE coaching_sessions SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return getCoachingSessionById(id);
}

export function completeSessionAndPayout(sessionId: string) {
  ensureTutoringTables();
  const session = getCoachingSessionById(sessionId);
  if (!session) throw new Error("Session not found");
  if (session.payment_status === "paid") return session;

  const now = new Date().toISOString();
  updateCoachingSession(sessionId, {
    status: "completed",
    endedAt: now,
    paymentStatus: "paid",
  });

  const payoutId = cryptoRandomId();
  getDb()
    .prepare(
      `INSERT INTO tutor_payouts (id, tutor_id, session_id, amount_cents, currency, status, paid_at)
       VALUES (?, ?, ?, ?, ?, 'paid', ?)`,
    )
    .run(payoutId, session.tutor_id, sessionId, session.tutor_payout_cents, session.currency, now);

  // bump tutor stats
  const hours = session.duration_minutes / 60;
  getDb()
    .prepare(`UPDATE tutor_profiles SET total_hours = total_hours + ?, updated_at = ? WHERE user_id = ?`)
    .run(hours, now, session.tutor_id);

  return getCoachingSessionById(sessionId);
}

export function addSessionComment(input: {
  sessionId: string;
  authorId: string;
  authorRole: string;
  body: string;
  anchorText?: string | null;
  anchorOffset?: number | null;
}) {
  ensureTutoringTables();
  const id = cryptoRandomId();
  getDb()
    .prepare(
      `INSERT INTO session_comments (id, session_id, author_id, author_role, body, anchor_text, anchor_offset)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.sessionId,
      input.authorId,
      input.authorRole,
      input.body,
      input.anchorText ?? null,
      input.anchorOffset ?? null,
    );
  return getDb().prepare("SELECT * FROM session_comments WHERE id = ?").get(id) as SessionCommentRow;
}

export function listSessionComments(sessionId: string) {
  ensureTutoringTables();
  return getDb()
    .prepare("SELECT * FROM session_comments WHERE session_id = ? ORDER BY created_at ASC")
    .all(sessionId) as SessionCommentRow[];
}

export function seedDemoTutors() {
  ensureTutoringTables();
  const existing = getDb().prepare("SELECT 1 FROM tutor_profiles LIMIT 1").get();
  if (existing) return;

  // Demo tutor users are created from seedDemoData / register; create profiles if users exist
  const tutorEmails = [
    {
      email: "tutor@veritas.io",
      headline: "Academic writing coach · STEM & humanities",
      bio: "Former university writing-centre lead. I help you structure arguments, cite properly, and finish your own work — never write it for you.",
      specialties: ["Essay structure", "Citations", "Thesis statements", "Revision strategy"],
      rate: 1800,
      calendly: "https://calendly.com/veritas-tutor-demo",
      teams: "https://teams.microsoft.com/l/meetup-join/demo-tutor-1",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  ];

  for (const t of tutorEmails) {
    const user = getDb().prepare("SELECT * FROM users WHERE email = ?").get(t.email) as UserRow | undefined;
    if (!user) continue;
    upsertTutorProfile({
      userId: user.id,
      headline: t.headline,
      bio: t.bio,
      specialties: t.specialties,
      languages: ["English"],
      hourlyRateCents: t.rate,
      currency: "GBP",
      videoIntroUrl: t.video,
      calendlyUrl: t.calendly,
      teamsMeetingUrl: t.teams,
      capacityHoursWeek: 15,
      vettingStatus: "approved",
    });
  }
}

export { PLATFORM_FEE_PERCENT };

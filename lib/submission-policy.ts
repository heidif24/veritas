/**
 * Submission policy: attempt limits, deadlines, resubmit rules.
 * Default: max 3 attempts; no submit after due date unless lecturer extends.
 * Additive — does not alter telemetry or seal behaviour.
 */

import { getDb } from "@/lib/db";
import { ensureAssignmentColumns, getAssignment, type AssignmentRecord } from "@/lib/assignments";

export type AttemptInfo = {
  assignmentId: string;
  authorId: string;
  attemptCount: number;
  maxAttempts: number;
  remainingAttempts: number;
  canSubmit: boolean;
  reason?: string;
  dueAt: string | null;
  isPastDue: boolean;
  lastSubmissionId?: string | null;
  lastDocumentId?: string | null;
};

function ensureSubmissionColumns() {
  const db = getDb();
  const cols = db.prepare(`PRAGMA table_info(submissions)`).all() as Array<{ name: string }>;
  const names = new Set(cols.map((c) => c.name));
  const add = (name: string, def: string) => {
    if (!names.has(name)) {
      db.exec(`ALTER TABLE submissions ADD COLUMN ${name} ${def}`);
      names.add(name);
    }
  };
  add("attempt_number", "INTEGER DEFAULT 1");
  add("ai_score", "REAL");
  add("ai_label", "TEXT");
  add("similarity_details_json", "TEXT");
  add("ai_details_json", "TEXT");
  add("submitted_at", "TEXT");
  add("content_snapshot", "TEXT");
}

export function getAttemptInfo(assignmentId: string, authorId: string): AttemptInfo {
  ensureAssignmentColumns();
  ensureSubmissionColumns();
  const assignment = getAssignment(assignmentId);
  if (!assignment) {
    return {
      assignmentId,
      authorId,
      attemptCount: 0,
      maxAttempts: 3,
      remainingAttempts: 0,
      canSubmit: false,
      reason: "Assignment not found",
      dueAt: null,
      isPastDue: false,
    };
  }

  const maxAttempts = 3;
  const dueAt = assignment.due_at ?? null;
  const isPastDue = dueAt ? new Date(dueAt).getTime() < Date.now() : false;

  const rows = getDb()
    .prepare(
      `SELECT id, document_id, attempt_number FROM submissions
       WHERE assignment_id = ? AND author_id = ?
       ORDER BY COALESCE(attempt_number, 1) DESC, created_at DESC`,
    )
    .all(assignmentId, authorId) as Array<{
    id: string;
    document_id: string;
    attempt_number?: number;
  }>;

  const attemptCount = rows.length;
  const remainingAttempts = Math.max(0, maxAttempts - attemptCount);

  let canSubmit = true;
  let reason: string | undefined;

  if (isPastDue) {
    canSubmit = false;
    reason = "The deadline has passed. Only your lecturer can extend the due date.";
  } else if (attemptCount >= maxAttempts) {
    canSubmit = false;
    reason = `You have used all ${maxAttempts} submission attempts. No further edits or resubmissions are allowed.`;
  }

  return {
    assignmentId,
    authorId,
    attemptCount,
    maxAttempts,
    remainingAttempts,
    canSubmit,
    reason,
    dueAt,
    isPastDue,
    lastSubmissionId: rows[0]?.id ?? null,
    lastDocumentId: rows[0]?.document_id ?? null,
  };
}

export function listSubmissionsForAssignment(assignmentId: string) {
  ensureSubmissionColumns();
  return getDb()
    .prepare(
      `SELECT s.*, u.name as author_name, u.email as author_email, d.title as document_title
       FROM submissions s
       LEFT JOIN users u ON u.id = s.author_id
       LEFT JOIN documents d ON d.id = s.document_id
       WHERE s.assignment_id = ?
       ORDER BY u.name ASC, COALESCE(s.attempt_number, 1) DESC, s.created_at DESC`,
    )
    .all(assignmentId) as Array<Record<string, unknown>>;
}

export function listLatestSubmissionPerStudent(assignmentId: string) {
  const all = listSubmissionsForAssignment(assignmentId);
  const byAuthor = new Map<string, Record<string, unknown>>();
  for (const row of all) {
    const authorId = String(row.author_id);
    if (!byAuthor.has(authorId)) byAuthor.set(authorId, row);
  }
  return [...byAuthor.values()];
}

export function recordSubmission(input: {
  assignmentId: string;
  documentId: string;
  authorId: string;
  attemptNumber: number;
  healthScore?: number;
  similarityScore?: number;
  aiScore?: number;
  aiLabel?: string;
  sealedHash?: string | null;
  similarityDetails?: unknown;
  aiDetails?: unknown;
  contentSnapshot?: string | null;
}) {
  ensureSubmissionColumns();
  const id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO submissions
       (id, assignment_id, document_id, author_id, status, health_score, similarity_score,
        sealed_hash, attempt_number, ai_score, ai_label, similarity_details_json, ai_details_json, submitted_at, created_at, content_snapshot)
       VALUES (?, ?, ?, ?, 'submitted', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.assignmentId,
      input.documentId,
      input.authorId,
      input.healthScore ?? null,
      input.similarityScore ?? null,
      input.sealedHash ?? null,
      input.attemptNumber,
      input.aiScore ?? null,
      input.aiLabel ?? null,
      input.similarityDetails ? JSON.stringify(input.similarityDetails) : null,
      input.aiDetails ? JSON.stringify(input.aiDetails) : null,
      now,
      now,
      input.contentSnapshot ?? null,
    );
  return id;
}

export function updateAssignmentDueAt(assignmentId: string, dueAt: string | null) {
  ensureAssignmentColumns();
  getDb().prepare(`UPDATE assignments SET due_at = ? WHERE id = ?`).run(dueAt, assignmentId);
  return getAssignment(assignmentId);
}

export type { AssignmentRecord };

/** Product rule: a student may submit at most 3 times (initial + edits). */
export function capAttempts(raw: number | null | undefined) {
  const n = Number(raw ?? 3);
  if (!Number.isFinite(n) || n < 1) return 3;
  return Math.min(3, Math.floor(n));
}

/**
 * Lecturer folders release student work only after the deadline.
 * A future deadline (including one the lecturer just extended) keeps the folder closed
 * and lets students with attempts remaining submit again.
 */
export function folderRelease(dueAt: string | null | undefined, now = Date.now()) {
  if (!dueAt) {
    return {
      released: false,
      reason: "No deadline is set. Submissions stay with the student until you set a due date and it passes.",
    };
  }
  const time = new Date(dueAt).getTime();
  if (Number.isNaN(time)) {
    return { released: false, reason: "The deadline is not a valid date." };
  }
  if (time > now) {
    return {
      released: false,
      reason: `This assignment is still open until ${new Date(dueAt).toLocaleString()}. Student work appears in the folder after the deadline. Extending the deadline reopens submissions for students who have attempts left.`,
    };
  }
  return {
    released: true,
    reason: "The deadline has passed. These are the latest submissions from each student.",
  };
}

/**
 * Baseline writing sample — opt-in or course-required early sample for style/process comparison.
 */

import { getDb } from "@/lib/db";

export type BaselineSample = {
  id: string;
  userId: string;
  courseId: string | null;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
};

function ensureBaselineTable() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS baseline_samples (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      word_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

function cryptoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveBaselineSample(input: {
  userId: string;
  courseId?: string | null;
  title: string;
  content: string;
}): BaselineSample {
  ensureBaselineTable();
  const id = cryptoId();
  const plain = input.content.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plain ? plain.split(/\s+/).length : 0;
  const createdAt = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO baseline_samples (id, user_id, course_id, title, content, word_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, input.userId, input.courseId ?? null, input.title, input.content, wordCount, createdAt);

  return {
    id,
    userId: input.userId,
    courseId: input.courseId ?? null,
    title: input.title,
    content: input.content,
    wordCount,
    createdAt,
  };
}

export function getLatestBaseline(userId: string, courseId?: string | null): BaselineSample | null {
  ensureBaselineTable();
  const row = courseId
    ? (getDb()
        .prepare(
          `SELECT * FROM baseline_samples WHERE user_id = ? AND course_id = ? ORDER BY created_at DESC LIMIT 1`,
        )
        .get(userId, courseId) as Record<string, unknown> | undefined)
    : (getDb()
        .prepare(`SELECT * FROM baseline_samples WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`)
        .get(userId) as Record<string, unknown> | undefined);

  if (!row) return null;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    courseId: (row.course_id as string) ?? null,
    title: String(row.title),
    content: String(row.content),
    wordCount: Number(row.word_count ?? 0),
    createdAt: String(row.created_at),
  };
}

export function listBaselinesForUser(userId: string): BaselineSample[] {
  ensureBaselineTable();
  const rows = getDb()
    .prepare(`SELECT * FROM baseline_samples WHERE user_id = ? ORDER BY created_at DESC`)
    .all(userId) as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    id: String(row.id),
    userId: String(row.user_id),
    courseId: (row.course_id as string) ?? null,
    title: String(row.title),
    content: String(row.content),
    wordCount: Number(row.word_count ?? 0),
    createdAt: String(row.created_at),
  }));
}

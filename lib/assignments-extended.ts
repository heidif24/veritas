import { getDb } from "@/lib/db";
import { ensureAssignmentColumns, getAssignment, type AssignmentRecord } from "@/lib/assignments";
import { ensureProctoredColumn } from "@/lib/proctor-assignment";

export function ensureRichAssignmentColumns() {
  ensureAssignmentColumns();
  ensureProctoredColumn();
  const db = getDb();
  const cols = db.prepare(`PRAGMA table_info(assignments)`).all() as Array<{ name: string }>;
  const names = new Set(cols.map((c) => c.name));
  const add = (name: string, def: string) => {
    if (!names.has(name)) db.exec(`ALTER TABLE assignments ADD COLUMN ${name} ${def}`);
  };
  add("kind", "TEXT DEFAULT 'essay'");
  add("time_limit_minutes", "INTEGER");
  add("objectives_json", "TEXT DEFAULT '[]'");
}

export function createRichAssignment(input: {
  courseId: string;
  title: string;
  instructions?: string;
  dueAt?: string | null;
  maxAttempts?: number;
  allowResubmit?: boolean;
  genre?: string;
  pasteThreshold?: number;
  similarityThreshold?: number;
  requireSeal?: boolean;
  groupWork?: boolean;
  rubric?: Record<string, unknown>;
  kind?: string;
  timeLimitMinutes?: number | null;
  objectives?: unknown[];
  proctored?: boolean;
}): AssignmentRecord | undefined {
  ensureRichAssignmentColumns();
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  getDb()
    .prepare(
      `INSERT INTO assignments (
        id, course_id, title, instructions, paste_threshold, similarity_threshold,
        due_at, max_attempts, allow_resubmit, genre, require_seal, group_work, rubric_json,
        kind, time_limit_minutes, objectives_json, proctored
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.courseId,
      input.title,
      input.instructions ?? "",
      input.pasteThreshold ?? 0.15,
      input.similarityThreshold ?? 0.25,
      input.dueAt ?? null,
      input.maxAttempts ?? 3,
      input.allowResubmit === false ? 0 : 1,
      input.genre ?? "essay",
      input.requireSeal === false ? 0 : 1,
      input.groupWork ? 1 : 0,
      JSON.stringify(input.rubric ?? {}),
      input.kind ?? "essay",
      input.timeLimitMinutes ?? null,
      JSON.stringify(input.objectives ?? []),
      input.proctored ? 1 : 0,
    );
  return getAssignment(id);
}

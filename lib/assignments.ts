import { getDb } from "@/lib/db";

export type AssignmentRecord = {
  id: string;
  course_id: string;
  title: string;
  instructions: string | null;
  paste_threshold: number;
  similarity_threshold: number;
  created_at: string;
  due_at?: string | null;
  max_attempts?: number | null;
  allow_resubmit?: number | null;
  genre?: string | null;
  require_seal?: number | null;
  group_work?: number | null;
  rubric_json?: string | null;
  kind?: string | null;
  time_limit_minutes?: number | null;
  objectives_json?: string | null;
  proctored?: number | null;
};

export function ensureAssignmentColumns() {
  const db = getDb();
  const cols = db.prepare(`PRAGMA table_info(assignments)`).all() as Array<{ name: string }>;
  const names = new Set(cols.map((c) => c.name));
  const add = (name: string, def: string) => {
    if (!names.has(name)) {
      db.exec(`ALTER TABLE assignments ADD COLUMN ${name} ${def}`);
      names.add(name);
    }
  };
  add("due_at", "TEXT");
  add("max_attempts", "INTEGER DEFAULT 3");
  add("allow_resubmit", "INTEGER DEFAULT 1");
  add("genre", "TEXT DEFAULT 'essay'");
  add("require_seal", "INTEGER DEFAULT 1");
  add("group_work", "INTEGER DEFAULT 0");
  add("rubric_json", "TEXT DEFAULT '{}'");
}

export function getAssignment(id: string): AssignmentRecord | undefined {
  ensureAssignmentColumns();
  return getDb().prepare("SELECT * FROM assignments WHERE id = ?").get(id) as AssignmentRecord | undefined;
}

export function listAssignmentsForCourse(courseId: string): AssignmentRecord[] {
  ensureAssignmentColumns();
  return getDb()
    .prepare("SELECT * FROM assignments WHERE course_id = ? ORDER BY created_at DESC")
    .all(courseId) as AssignmentRecord[];
}

import { getDb } from "@/lib/db";

export function ensureProctoredColumn() {
  const db = getDb();
  const cols = db.prepare(`PRAGMA table_info(assignments)`).all() as Array<{ name: string }>;
  if (!cols.some((c) => c.name === "proctored")) {
    db.exec(`ALTER TABLE assignments ADD COLUMN proctored INTEGER DEFAULT 0`);
  }
}

export function isAssignmentProctored(assignmentId: string): boolean {
  ensureProctoredColumn();
  const row = getDb().prepare("SELECT proctored FROM assignments WHERE id = ?").get(assignmentId) as
    | { proctored?: number }
    | undefined;
  return Boolean(row?.proctored);
}

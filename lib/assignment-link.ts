/**
 * Links a student's editor document to one assignment so resubmits
 * edit the same draft and lecturers can find it after the deadline.
 */

import { getDb } from "@/lib/db";

export type AssignmentLink = {
  documentId: string;
  assignmentId: string;
  userId: string;
};

function ensureTable() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS assignment_documents (
      document_id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_assignment_documents_user
      ON assignment_documents(assignment_id, user_id);
  `);
}

export function linkAssignmentDocument(link: AssignmentLink) {
  ensureTable();
  getDb()
    .prepare(
      `INSERT INTO assignment_documents (document_id, assignment_id, user_id)
       VALUES (?, ?, ?)
       ON CONFLICT(document_id) DO UPDATE SET assignment_id = excluded.assignment_id, user_id = excluded.user_id`,
    )
    .run(link.documentId, link.assignmentId, link.userId);
}

export function getAssignmentLinkForDocument(documentId: string): AssignmentLink | null {
  ensureTable();
  const row = getDb()
    .prepare(`SELECT document_id, assignment_id, user_id FROM assignment_documents WHERE document_id = ?`)
    .get(documentId) as { document_id: string; assignment_id: string; user_id: string } | undefined;
  if (!row) return null;
  return { documentId: row.document_id, assignmentId: row.assignment_id, userId: row.user_id };
}

export function getDraftForAssignment(assignmentId: string, userId: string): AssignmentLink | null {
  ensureTable();
  const row = getDb()
    .prepare(
      `SELECT document_id, assignment_id, user_id FROM assignment_documents
       WHERE assignment_id = ? AND user_id = ?
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(assignmentId, userId) as { document_id: string; assignment_id: string; user_id: string } | undefined;
  if (!row) return null;
  return { documentId: row.document_id, assignmentId: row.assignment_id, userId: row.user_id };
}

import { getDb } from "@/lib/db";

export function ensureAuditTable() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actor_id TEXT,
      document_id TEXT
    );
  `);
}

export function recordAudit(input: {
  action: string;
  actorId?: string | null;
  documentId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  ensureAuditTable();
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  getDb()
    .prepare(`INSERT INTO audit_events (id, action, metadata, actor_id, document_id) VALUES (?, ?, ?, ?, ?)`)
    .run(id, input.action, JSON.stringify(input.metadata ?? {}), input.actorId ?? null, input.documentId ?? null);
  return id;
}

export function listAuditForDocument(documentId: string, limit = 100) {
  ensureAuditTable();
  return getDb()
    .prepare(`SELECT * FROM audit_events WHERE document_id = ? ORDER BY created_at DESC LIMIT ?`)
    .all(documentId, limit);
}

export function listRecentAudit(limit = 50) {
  ensureAuditTable();
  return getDb().prepare(`SELECT * FROM audit_events ORDER BY created_at DESC LIMIT ?`).all(limit);
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

function ensureCasesTable() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS integrity_cases (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      organization_id TEXT,
      decision TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      reviewer_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function GET() {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    ensureCasesTable();
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT c.*, d.title as document_title, u.name as reviewer_name
         FROM integrity_cases c
         LEFT JOIN documents d ON d.id = c.document_id
         LEFT JOIN users u ON u.id = c.reviewer_id
         ORDER BY c.updated_at DESC LIMIT 100`,
      )
      .all();
    return NextResponse.json({ cases: rows });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    ensureCasesTable();
    const body = await request.json().catch(() => ({}));
    const documentId = String(body.documentId || "");
    const decision = String(body.decision || "pending");
    const notes = String(body.notes || "");
    if (!documentId) return NextResponse.json({ error: "documentId required" }, { status: 400 });

    const db = getDb();
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO integrity_cases (id, document_id, organization_id, decision, notes, reviewer_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, documentId, user.organizationId ?? null, decision, notes, user.id, now, now);

    db.prepare(
      `INSERT INTO audit_events (id, action, metadata, actor_id, document_id) VALUES (?, ?, ?, ?, ?)`,
    ).run(
      crypto.randomUUID().replace(/-/g, "").slice(0, 16),
      "integrity_case_decision",
      JSON.stringify({ decision, notes }),
      user.id,
      documentId,
    );

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

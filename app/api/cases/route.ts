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
      score REAL,
      max_score REAL DEFAULT 100,
      comments_json TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const cols = db.prepare(`PRAGMA table_info(integrity_cases)`).all() as Array<{ name: string }>;
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("score")) db.exec(`ALTER TABLE integrity_cases ADD COLUMN score REAL`);
  if (!names.has("max_score")) db.exec(`ALTER TABLE integrity_cases ADD COLUMN max_score REAL DEFAULT 100`);
  if (!names.has("comments_json")) db.exec(`ALTER TABLE integrity_cases ADD COLUMN comments_json TEXT DEFAULT '[]'`);
}

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    ensureCasesTable();
    const db = getDb();
    const url = new URL(request.url);
    const documentId = url.searchParams.get("documentId");

    if (documentId) {
      const row = db
        .prepare(
          `SELECT c.*, d.title as document_title, u.name as reviewer_name
           FROM integrity_cases c
           LEFT JOIN documents d ON d.id = c.document_id
           LEFT JOIN users u ON u.id = c.reviewer_id
           WHERE c.document_id = ?
           ORDER BY c.updated_at DESC LIMIT 1`,
        )
        .get(documentId);
      return NextResponse.json({ case: row || null });
    }

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
    const score = body.score === null || body.score === undefined || body.score === "" ? null : Number(body.score);
    const maxScore = body.maxScore != null ? Number(body.maxScore) : 100;
    const comments = Array.isArray(body.comments) ? body.comments : [];

    if (!documentId) return NextResponse.json({ error: "documentId required" }, { status: 400 });

    const db = getDb();
    const now = new Date().toISOString();
    const existing = db
      .prepare(`SELECT id FROM integrity_cases WHERE document_id = ? ORDER BY updated_at DESC LIMIT 1`)
      .get(documentId) as { id?: string } | undefined;

    let id = existing?.id;
    if (id) {
      db.prepare(
        `UPDATE integrity_cases
         SET decision = ?, notes = ?, reviewer_id = ?, score = ?, max_score = ?, comments_json = ?, updated_at = ?
         WHERE id = ?`,
      ).run(
        decision,
        notes,
        user.id,
        score,
        maxScore,
        JSON.stringify(comments),
        now,
        id,
      );
    } else {
      id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      db.prepare(
        `INSERT INTO integrity_cases
          (id, document_id, organization_id, decision, notes, reviewer_id, score, max_score, comments_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        documentId,
        user.organizationId ?? null,
        decision,
        notes,
        user.id,
        score,
        maxScore,
        JSON.stringify(comments),
        now,
        now,
      );
    }

    try {
      db.prepare(
        `INSERT INTO audit_events (id, action, metadata, actor_id, document_id) VALUES (?, ?, ?, ?, ?)`,
      ).run(
        crypto.randomUUID().replace(/-/g, "").slice(0, 16),
        "integrity_case_decision",
        JSON.stringify({ decision, notes, score, maxScore, commentCount: comments.length }),
        user.id,
        documentId,
      );
    } catch {
      /* audit optional */
    }

    return NextResponse.json({
      ok: true,
      id,
      case: {
        id,
        documentId,
        decision,
        notes,
        score,
        maxScore,
        comments,
        reviewerId: user.id,
        updatedAt: now,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

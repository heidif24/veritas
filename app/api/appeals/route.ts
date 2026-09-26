import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

function ensureAppeals() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS appeals (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      resolution TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function GET() {
  try {
    const user = await requireAuth();
    ensureAppeals();
    const db = getDb();
    if (user.role === "STUDENT") {
      const rows = db.prepare("SELECT * FROM appeals WHERE student_id = ? ORDER BY created_at DESC").all(user.id);
      return NextResponse.json({ appeals: rows });
    }
    const rows = db.prepare("SELECT * FROM appeals ORDER BY created_at DESC LIMIT 100").all();
    return NextResponse.json({ appeals: rows });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    ensureAppeals();
    const body = await request.json().catch(() => ({}));
    const documentId = String(body.documentId || "");
    const reason = String(body.reason || "").trim();
    if (!documentId || !reason) return NextResponse.json({ error: "documentId and reason required" }, { status: 400 });

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const now = new Date().toISOString();
    getDb()
      .prepare(`INSERT INTO appeals (id, document_id, student_id, reason, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'open', ?, ?)`)
      .run(id, documentId, user.id, reason, now, now);

    recordAudit({ action: "appeal_opened", actorId: user.id, documentId, metadata: { appealId: id } });
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    ensureAppeals();
    const body = await request.json().catch(() => ({}));
    const id = String(body.id || "");
    const status = String(body.status || "resolved");
    const resolution = String(body.resolution || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    getDb()
      .prepare(`UPDATE appeals SET status = ?, resolution = ?, updated_at = ? WHERE id = ?`)
      .run(status, resolution, new Date().toISOString(), id);
    recordAudit({ action: "appeal_resolved", actorId: user.id, metadata: { appealId: id, status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

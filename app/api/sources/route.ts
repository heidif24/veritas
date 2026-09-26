import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

function ensureSources() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS document_sources (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT,
      body TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function GET(request: Request) {
  try {
    await requireAuth();
    ensureSources();
    const documentId = new URL(request.url).searchParams.get("documentId");
    if (!documentId) return NextResponse.json({ error: "documentId required" }, { status: 400 });
    const rows = getDb().prepare("SELECT * FROM document_sources WHERE document_id = ? ORDER BY created_at DESC").all(documentId);
    return NextResponse.json({ sources: rows });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    ensureSources();
    const body = await request.json().catch(() => ({}));
    const documentId = String(body.documentId || "");
    const title = String(body.title || "").trim();
    const text = String(body.body || "").trim();
    if (!documentId || !title) return NextResponse.json({ error: "documentId and title required" }, { status: 400 });
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    getDb()
      .prepare(`INSERT INTO document_sources (id, document_id, title, url, body) VALUES (?, ?, ?, ?, ?)`)
      .run(id, documentId, title, body.url ? String(body.url) : null, text);
    recordAudit({ action: "source_attached", actorId: user.id, documentId, metadata: { sourceId: id, title } });
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

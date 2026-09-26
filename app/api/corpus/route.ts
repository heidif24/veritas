import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createCorpusEntry, getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const db = getDb();
    const rows = user.organizationId
      ? db.prepare("SELECT id, title, source_url, length(body) as body_len, created_at FROM corpus WHERE organization_id = ? ORDER BY created_at DESC").all(user.organizationId)
      : db.prepare("SELECT id, title, source_url, length(body) as body_len, created_at FROM corpus ORDER BY created_at DESC LIMIT 200").all();
    return NextResponse.json({ entries: rows });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json().catch(() => ({}));
    const title = String(body.title || "").trim();
    const text = String(body.body || "").trim();
    if (!title || !text) return NextResponse.json({ error: "title and body required" }, { status: 400 });
    if (!user.organizationId) return NextResponse.json({ error: "No organization" }, { status: 400 });

    const entry = createCorpusEntry({
      organizationId: user.organizationId,
      title,
      sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined,
      body: text,
    });
    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

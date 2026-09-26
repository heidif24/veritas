import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const idToken = form?.get("id_token")?.toString() || "";
  const state = form?.get("state")?.toString() || "";

  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS lti_states (state TEXT PRIMARY KEY, nonce TEXT, iss TEXT, client_id TEXT, created_at TEXT)`);
  const saved = state ? (db.prepare("SELECT * FROM lti_states WHERE state = ?").get(state) as { nonce?: string } | undefined) : null;

  if (!idToken || !saved) {
    return NextResponse.json({ error: "invalid_launch", message: "Missing id_token or unknown state." }, { status: 400 });
  }

  const parts = idToken.split(".");
  let claims: Record<string, unknown> = {};
  try {
    claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  if (saved.nonce && claims.nonce && claims.nonce !== saved.nonce) {
    return NextResponse.json({ error: "nonce_mismatch" }, { status: 400 });
  }

  db.prepare("DELETE FROM lti_states WHERE state = ?").run(state);
  recordAudit({
    action: "lti_launch",
    metadata: {
      iss: claims.iss,
      sub: claims.sub,
      email: (claims as { email?: string }).email,
    },
  });

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/app/dashboard?lti=1`);
}

export async function GET() {
  return NextResponse.json({ message: "LTI launch expects form_post with id_token from the platform." });
}

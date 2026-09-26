import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  const row = db.prepare("SELECT public_key_pem FROM tenant_keys LIMIT 1").get() as { public_key_pem?: string } | undefined;
  if (!row?.public_key_pem) {
    return NextResponse.json({ keys: [] });
  }
  const kid = createHash("sha256").update(row.public_key_pem).digest("hex").slice(0, 16);
  return NextResponse.json({
    keys: [
      {
        kid,
        kty: "OKP",
        use: "sig",
        alg: "EdDSA",
        note: "Pilot: configure platform with tool public key PEM from tenant_keys.",
      },
    ],
  });
}

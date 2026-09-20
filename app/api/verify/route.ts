import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyDocumentSeal } from "@/lib/crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const documentId = String(body.documentId ?? "");

  const document = documentId
    ? await prisma.document.findUnique({ where: { id: documentId } })
    : null;

  if (!document) {
    return NextResponse.json({ ok: false, status: "not_found" });
  }

  const result = verifyDocumentSeal({
    title: document.title,
    content: document.content,
    ownerId: document.ownerId,
    organizationId: document.organizationId,
    status: document.status,
    sealedHash: document.sealedHash,
  });

  if (result.valid) {
    return NextResponse.json({ ok: true, status: "verified", result });
  }

  return NextResponse.json({ ok: false, status: "tampered", result });
}

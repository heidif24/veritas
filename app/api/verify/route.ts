import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyDocumentSeal } from "@/lib/crypto";

export const runtime = "nodejs";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function parseTelemetry(value: unknown) {
  if (typeof value !== "string") return asRecord(value);

  try {
    return asRecord(JSON.parse(value));
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const bundle = asRecord(asRecord(body).bundle ?? body);
  const seal = asRecord(bundle.seal ?? bundle.integrity);
  const documentId = String(bundle.documentId ?? asRecord(body).documentId ?? "");

  if (seal.hash && seal.signature && bundle.content && bundle.title && bundle.ownerId) {
    const result = verifyDocumentSeal({
      title: String(bundle.title),
      content: String(bundle.content),
      ownerId: String(bundle.ownerId),
      organizationId: typeof bundle.organizationId === "string" ? bundle.organizationId : null,
      status: String(bundle.status ?? seal.status ?? "submitted"),
      sealedHash: String(seal.hash),
      signature: String(seal.signature),
      telemetry: parseTelemetry(bundle.telemetry),
    });

    return NextResponse.json({
      ok: result.valid,
      status: result.valid ? "verified" : "tampered",
      result,
      documentId: documentId || null,
    });
  }

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
    signature: document.sealedSignature,
    telemetry: parseTelemetry(document.telemetryJson),
  });

  if (result.valid) {
    return NextResponse.json({ ok: true, status: "verified", result });
  }

  return NextResponse.json({ ok: false, status: "tampered", result });
}

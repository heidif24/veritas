import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createDocumentSeal } from "@/lib/crypto";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = {
      title: document.title,
      content: document.content,
      ownerId: document.ownerId,
      organizationId: document.organizationId,
      status: document.status,
      ops: Array.isArray(body.ops) ? body.ops : [],
      telemetry: body.telemetry ?? {},
      assignmentId: body.assignmentId ?? id,
    };

    const seal = createDocumentSeal(payload);

    const updated = await prisma.document.update({
      where: { id },
      data: {
        sealedHash: seal.hash,
        integrityStatus: "verified",
        status: "submitted",
      },
    });

    return NextResponse.json({
      document: updated,
      seal: seal.hash,
      bundle: {
        version: 1,
        format: "veritas",
        payload: seal.payload,
        sha256: seal.hash,
        signature: seal.signature,
        publicKeyPem: seal.publicKeyPem,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

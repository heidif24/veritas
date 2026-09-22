import { NextResponse } from "next/server";
import { replacePlagiarismChunks, prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createDocumentSeal } from "@/lib/crypto";
import { buildWindowHashes } from "@/lib/plagiarism/chunker";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const seal = createDocumentSeal({
      title: document.title,
      content: document.content,
      ownerId: document.ownerId,
      organizationId: document.organizationId,
      status: "submitted",
      telemetry: body.telemetry ?? {},
    });

    const updated = await prisma.document.update({
      where: { id },
      data: {
        sealedHash: seal.hash,
        sealedSignature: seal.signature,
        telemetryJson: JSON.stringify(seal.payload.telemetry),
        integrityStatus: "verified",
        status: "submitted",
      },
    });

    if (document.organizationId) {
      replacePlagiarismChunks(document.id, document.organizationId, buildWindowHashes(document.content, 5));
    }

    return NextResponse.json({ document: updated, seal: { hash: seal.hash, signature: seal.signature } });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

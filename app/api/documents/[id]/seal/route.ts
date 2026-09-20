import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createDocumentSeal } from "@/lib/crypto";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { hash } = createDocumentSeal({
      title: document.title,
      content: document.content,
      ownerId: document.ownerId,
      organizationId: document.organizationId,
      status: document.status,
    });

    const updated = await prisma.document.update({
      where: { id },
      data: {
        sealedHash: hash,
        integrityStatus: "verified",
        status: "submitted",
      },
    });

    return NextResponse.json({ document: updated, seal: hash });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

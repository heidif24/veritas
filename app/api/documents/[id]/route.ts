import { NextResponse } from "next/server";
import { createDocumentRevision, prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ document });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const currentDocument = await prisma.document.findUnique({ where: { id } });

    if (!currentDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && currentDocument.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const nextReferences = Array.isArray(body.references) ? body.references : currentDocument.references ?? [];
    const document = await prisma.document.update({
      where: { id },
      data: {
        title: body.title ?? currentDocument.title,
        content: body.content ?? currentDocument.content,
        status: body.status ?? currentDocument.status,
        documentType: body.documentType ?? currentDocument.documentType,
        references: nextReferences,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (body.content !== undefined || body.title !== undefined || Array.isArray(body.references)) {
      const revisionCreated = createDocumentRevision(id, document.title, document.content, nextReferences);
      if (revisionCreated) {
        await prisma.document.update({
          where: { id },
          data: {
            status: body.status ?? currentDocument.status,
          },
        });
      }
    }

    return NextResponse.json({ document });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

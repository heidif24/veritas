import { NextResponse } from "next/server";
import { createDocumentRevision, prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { rateLimit, clientIp, sanitizeHtml, sanitizePlainText, withSecurityHeaders } from "@/lib/security";

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
      return withSecurityHeaders(NextResponse.json({ error: "Document not found" }, { status: 404 }));
    }

    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR" && document.ownerId !== user.id) {
      return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }

    return withSecurityHeaders(NextResponse.json({ document }));
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const ip = clientIp(request);
    const limited = rateLimit(`doc-patch:${user.id}:${ip}`, 120, 60_000);
    if (limited) return withSecurityHeaders(limited);

    const { id } = await params;
    const currentDocument = await prisma.document.findUnique({ where: { id } });

    if (!currentDocument) {
      return withSecurityHeaders(NextResponse.json({ error: "Document not found" }, { status: 404 }));
    }

    if (user.role !== "ADMIN" && currentDocument.ownerId !== user.id) {
      return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }

    if (currentDocument.status === "submitted" || (currentDocument as { sealedHash?: string | null }).sealedHash) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Sealed documents cannot be edited." }, { status: 409 }),
      );
    }

    const body = await request.json().catch(() => ({}));
    const nextReferences = Array.isArray(body.references)
      ? body.references.slice(0, 200)
      : currentDocument.references ?? [];
    const title =
      body.title !== undefined ? sanitizePlainText(String(body.title), 300) : currentDocument.title;
    const content =
      body.content !== undefined ? sanitizeHtml(String(body.content)) : currentDocument.content;

    const document = await prisma.document.update({
      where: { id },
      data: {
        title,
        content,
        status: body.status ?? currentDocument.status,
        documentType: body.documentType ?? currentDocument.documentType,
        references: nextReferences,
      },
    });

    if (!document) {
      return withSecurityHeaders(NextResponse.json({ error: "Document not found" }, { status: 404 }));
    }

    if (body.content !== undefined || body.title !== undefined || Array.isArray(body.references)) {
      createDocumentRevision(id, document.title, document.content, nextReferences);
    }

    return withSecurityHeaders(NextResponse.json({ document }));
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

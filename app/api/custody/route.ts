import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { listCustodyChain, verifyCustodyChain, appendCustodyLink } from "@/lib/revision-custody";
import { prisma } from "@/lib/db";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

/** GET /api/custody?documentId= — list + verify chain */
export async function GET(request: Request) {
  try {
    await requireAuth();
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const documentId = new URL(request.url).searchParams.get("documentId");
  if (!documentId) {
    return withSecurityHeaders(NextResponse.json({ error: "documentId required" }, { status: 400 }));
  }

  const chain = listCustodyChain(documentId);
  const verification = verifyCustodyChain(documentId);
  return withSecurityHeaders(NextResponse.json({ chain, verification }));
}

/** POST — append a manual checkpoint (author or instructor) */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const documentId = String(body.documentId ?? "");
    if (!documentId) {
      return withSecurityHeaders(NextResponse.json({ error: "documentId required" }, { status: 400 }));
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return withSecurityHeaders(NextResponse.json({ error: "Not found" }, { status: 404 }));
    }
    if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR" && document.ownerId !== user.id) {
      return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }

    const link = appendCustodyLink({
      documentId,
      content: document.content,
      label: String(body.label ?? "checkpoint"),
    });
    return withSecurityHeaders(NextResponse.json({ link }));
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

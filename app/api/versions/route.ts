import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { integrityDelta, listVersions } from "@/lib/version-lineage";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const documentId = new URL(request.url).searchParams.get("documentId");
    if (!documentId) return NextResponse.json({ error: "documentId required" }, { status: 400 });
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role === "STUDENT" && doc.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({
      versions: listVersions(documentId),
      lineage: integrityDelta(documentId),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

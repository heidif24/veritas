import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();

    const documents = await prisma.document.findMany({
      where: user.role === "ADMIN" ? { organizationId: user.organizationId ?? undefined } : { ownerId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { owner: true },
    });

    return NextResponse.json({ documents });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const document = await prisma.document.create({
      data: {
        title: String(body.title ?? "Untitled draft"),
        content: String(body.content ?? ""),
        status: String(body.status ?? "draft"),
        documentType: String(body.documentType ?? "essay"),
        ownerId: user.id,
        organizationId: user.organizationId ?? null,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

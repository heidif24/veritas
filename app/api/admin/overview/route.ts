import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);

    const [documents, users, organizations] = await Promise.all([
      prisma.document.count(),
      prisma.user.count(),
      prisma.organization.count(),
    ]);

    return NextResponse.json({
      summary: {
        documents,
        users,
        organizations,
        verificationRate: "97.8%",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized or forbidden" }, { status: 401 });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAttemptInfo } from "@/lib/submission-policy";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const info = getAttemptInfo(id, user.id);
    return NextResponse.json({ attemptInfo: info });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAuth();
    const entitlement = resolveEntitlement(user.email, user.role);
    return NextResponse.json({ entitlement, email: user.email, role: user.role });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

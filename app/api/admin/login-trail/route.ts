import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getUserDeviceTrail } from "@/lib/session-security";
import { withSecurityHeaders } from "@/lib/security";

export const runtime = "nodejs";

/**
 * GET /api/admin/login-trail?userId=...
 * Returns distinct IPs, devices, and timeline for integrity review.
 */
export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN", "INSTRUCTOR"]);
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return withSecurityHeaders(
      NextResponse.json({ error: "userId is required" }, { status: 400 }),
    );
  }

  const trail = getUserDeviceTrail(userId);
  return withSecurityHeaders(NextResponse.json(trail));
}

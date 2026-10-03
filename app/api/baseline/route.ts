import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { saveBaselineSample, getLatestBaseline, listBaselinesForUser } from "@/lib/baseline-sample";
import { withSecurityHeaders, sanitizePlainText } from "@/lib/security";

export const runtime = "nodejs";

/** GET — list or latest baseline for the current user */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const latest = searchParams.get("latest") === "1";

    if (latest) {
      const sample = getLatestBaseline(user.id, courseId);
      return withSecurityHeaders(NextResponse.json({ sample }));
    }

    const samples = listBaselinesForUser(user.id);
    return withSecurityHeaders(NextResponse.json({ samples }));
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

/** POST — save a baseline writing sample */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const title = sanitizePlainText(String(body.title ?? "Baseline sample"), 200);
    const content = String(body.content ?? "");
    const courseId = body.courseId ? String(body.courseId) : null;

    if (!content.trim() || content.trim().split(/\s+/).length < 40) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Baseline sample should be at least ~40 words." }, { status: 400 }),
      );
    }

    const sample = saveBaselineSample({
      userId: user.id,
      courseId,
      title,
      content,
    });

    return withSecurityHeaders(NextResponse.json({ sample }));
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

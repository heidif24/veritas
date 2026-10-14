import { NextResponse } from "next/server";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import {
  getLatestBaseline,
  listBaselinesForUser,
  saveBaselineSample,
} from "@/lib/baseline-sample";
import type { CompositionOperation } from "@/lib/composition-health";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId");
    const latestOnly = url.searchParams.get("latest") === "1";

    if (latestOnly) {
      const sample = getLatestBaseline(user.id, courseId);
      return NextResponse.json({ baseline: sample });
    }

    const samples = listBaselinesForUser(user.id);
    return NextResponse.json({ baselines: samples });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json().catch(() => ({}));

    const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Baseline sample";
    const content = typeof body.content === "string" ? body.content : "";
    if (content.replace(/<[^>]+>/g, " ").trim().length < 40) {
      return NextResponse.json(
        { error: "Baseline sample should be at least ~40 characters of writing." },
        { status: 400 },
      );
    }

    let ops: CompositionOperation[] | undefined;
    if (Array.isArray(body.ops)) {
      ops = body.ops
        .filter(
          (o: unknown) =>
            o &&
            typeof o === "object" &&
            ("kind" in o || "type" in o) &&
            "chars" in o &&
            "timestamp" in o,
        )
        .map((o: Record<string, unknown>) => ({
          kind: (o.kind || o.type || "type") as CompositionOperation["kind"],
          chars: Number(o.chars) || 0,
          timestamp: Number(o.timestamp) || Date.now(),
        }));
    }

    const sample = saveBaselineSample({
      userId: user.id,
      courseId: typeof body.courseId === "string" ? body.courseId : null,
      title,
      content,
      ops,
    });

    return NextResponse.json({ baseline: sample, ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save baseline";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

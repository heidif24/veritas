import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"]);

export async function POST(request: Request) {
  try {
    const user = await requireRole(["ADMIN"]);
    if (!user.organizationId) {
      return NextResponse.json({ error: "No organization on this account" }, { status: 400 });
    }
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 2 MB" }, { status: 400 });
    }
    const type = file.type || "application/octet-stream";
    if (!ALLOWED.has(type)) {
      return NextResponse.json({ error: "Allowed types: PNG, JPEG, WebP, SVG, GIF" }, { status: 400 });
    }
    const ext =
      type === "image/png" ? "png" :
      type === "image/webp" ? "webp" :
      type === "image/svg+xml" ? "svg" :
      type === "image/gif" ? "gif" : "jpg";
    const dir = path.join(process.cwd(), "public", "uploads", "branding");
    await mkdir(dir, { recursive: true });
    const filename = `${user.organizationId}-${Date.now()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buf);
    return NextResponse.json({ ok: true, logoUrl: `/uploads/branding/${filename}` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

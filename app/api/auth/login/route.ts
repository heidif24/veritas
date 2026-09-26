import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clientIp, isValidEmail, pruneRateBuckets, rateLimit, sanitizePlainText, withSecurityHeaders } from "@/lib/security";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  pruneRateBuckets();
  const ip = clientIp(request);
  const limited = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (limited) return withSecurityHeaders(limited);

  const body = await request.json().catch(() => ({}));
  const email = sanitizePlainText(String(body.email ?? "").toLowerCase(), 254);
  const password = String(body.password ?? "");

  if (!email || !password || !isValidEmail(email)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Email and password are required." }, { status: 400 }),
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const dummyHash = "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWX12";
  const ok = await bcrypt.compare(password, user?.passwordHash || dummyHash);

  if (!user || !ok) {
    rateLimit(`login-fail:${email}`, 12, 30 * 60 * 1000);
    return withSecurityHeaders(
      NextResponse.json({ error: "Invalid email or password." }, { status: 401 }),
    );
  }

  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12);

  await prisma.session.create({
    data: { token: sessionToken, userId: user.id, expiresAt },
  });

  try {
    recordAudit({ action: "login", actorId: user.id, metadata: { ip } });
  } catch {
    /* */
  }

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  response.cookies.set("veritas_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return withSecurityHeaders(response);
}

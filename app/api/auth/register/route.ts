import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import {
  clientIp,
  isValidEmail,
  pruneRateBuckets,
  rateLimit,
  sanitizePlainText,
  validatePassword,
  withSecurityHeaders,
} from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  pruneRateBuckets();
  const ip = clientIp(request);
  const limited = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (limited) return withSecurityHeaders(limited);

  const body = await request.json().catch(() => ({}));
  const name = sanitizePlainText(String(body.name ?? ""), 120);
  const email = sanitizePlainText(String(body.email ?? "").toLowerCase(), 254);
  const password = String(body.password ?? "");
  let role = String(body.role ?? "STUDENT").toUpperCase();

  if (role === "ADMIN") role = "STUDENT";
  if (!["INSTRUCTOR", "STUDENT", "PUBLISHER"].includes(role)) role = "STUDENT";

  if (!name || !email || !password) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 }),
    );
  }

  if (!isValidEmail(email)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 }),
    );
  }

  const pwError = validatePassword(password);
  if (pwError) {
    return withSecurityHeaders(NextResponse.json({ error: pwError }, { status: 400 }));
  }

  if (getUserByEmail(email)) {
    return withSecurityHeaders(
      NextResponse.json({ error: "An account with that email already exists." }, { status: 409 }),
    );
  }

  const user = createUser({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: role as "INSTRUCTOR" | "STUDENT" | "PUBLISHER",
  });

  return withSecurityHeaders(
    NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 },
    ),
  );
}

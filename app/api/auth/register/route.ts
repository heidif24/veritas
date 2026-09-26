import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createUser, getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const role = String(body.role ?? "STUDENT").toUpperCase();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const normalizedRole = ["ADMIN", "INSTRUCTOR", "STUDENT", "PUBLISHER"].includes(role) ? role : "STUDENT";
  const user = createUser({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: normalizedRole as "ADMIN" | "INSTRUCTOR" | "STUDENT" | "PUBLISHER",
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    { status: 201 },
  );
}

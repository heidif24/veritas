import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createOrganization, createUser, getOrganizationBySlug, getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const organizations = getDb()
    .prepare("SELECT * FROM organizations ORDER BY created_at DESC")
    .all() as Array<{ id: string; name: string; slug: string; created_at: string }>;

  return NextResponse.json({ institutions: organizations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const sector = String(body.sector ?? "Education").trim();
    const organizationType = String(body.organizationType ?? "UNIVERSITY").trim().toUpperCase();
    const adminName = String(body.adminName ?? "").trim();
    const adminEmail = String(body.adminEmail ?? "").trim().toLowerCase();
    const adminPassword = String(body.adminPassword ?? "");

    if (!name || !slug || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (slug.length < 3) {
      return NextResponse.json({ error: "Institution slug must be at least 3 characters." }, { status: 400 });
    }

    const existing = getOrganizationBySlug(slug);
    if (existing) {
      return NextResponse.json({ error: "An institution with that slug already exists." }, { status: 409 });
    }

    const organization = createOrganization(name, slug, sector, organizationType);
    const admin = createUser({
      name: adminName,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
      organizationId: organization.id,
    });

    return NextResponse.json(
      {
        institution: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          sector,
          organizationType,
        },
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to complete onboarding." }, { status: 500 });
  }
}

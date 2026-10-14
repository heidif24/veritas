import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getTenantBranding, setTenantBranding } from "@/lib/branding";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const branding = getTenantBranding(user.organizationId);
    return NextResponse.json({ branding });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load branding" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireRole(["ADMIN", "INSTRUCTOR"]);
    if (!user.organizationId) {
      return NextResponse.json(
        { error: "No organization linked to this account" },
        { status: 400 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const branding = setTenantBranding(user.organizationId, {
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      shortName: typeof body.shortName === "string" ? body.shortName : undefined,
      logoUrl: typeof body.logoUrl === "string" ? body.logoUrl : body.logoUrl === null ? null : undefined,
      logoDarkUrl:
        typeof body.logoDarkUrl === "string" ? body.logoDarkUrl : body.logoDarkUrl === null ? null : undefined,
      faviconUrl:
        typeof body.faviconUrl === "string" ? body.faviconUrl : body.faviconUrl === null ? null : undefined,
      primaryColor: typeof body.primaryColor === "string" ? body.primaryColor : undefined,
      accentColor: typeof body.accentColor === "string" ? body.accentColor : undefined,
      sidebarStyle:
        body.sidebarStyle === "light" || body.sidebarStyle === "brand" || body.sidebarStyle === "dark"
          ? body.sidebarStyle
          : undefined,
      portalTagline: typeof body.portalTagline === "string" ? body.portalTagline : undefined,
      supportEmail: typeof body.supportEmail === "string" ? body.supportEmail : undefined,
      showPoweredBy: typeof body.showPoweredBy === "boolean" ? body.showPoweredBy : undefined,
    });

    return NextResponse.json({ branding, ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save branding";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

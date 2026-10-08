import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v);
  }

  const path = request.nextUrl.pathname;
  if (path.includes("..") || path.includes("%2e%2e")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const protectedPrefixes = ["/app/", "/instructor/", "/admin/", "/integrity-office", "/student/", "/tutor"];
  // Allow public tutor onboarding without session
  const isPublicTutorOnboarding = path === "/tutor/onboarding" || path.startsWith("/tutor/onboarding/");
  const needsAuth =
    !isPublicTutorOnboarding && protectedPrefixes.some((p) => path === p || path.startsWith(p.endsWith("/") ? p : p + "/") || path.startsWith(p));
  if (needsAuth) {
    const session = request.cookies.get("veritas_session")?.value;
    if (!session || session.length < 16) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/lti|api/verify|verify).*)"],
};

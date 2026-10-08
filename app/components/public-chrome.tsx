"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Public marketing chrome only — workspace routes use RoleShell instead. */
const WORKSPACE_PREFIXES = [
  "/app",
  "/student",
  "/tutor",
  "/instructor",
  "/admin",
  "/publisher",
  "/individual",
];

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const isWorkspace = WORKSPACE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isHome = pathname === "/";

  if (isWorkspace) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  // Homepage: preserve original dark shell — header/footer as before
  if (isHome) {
    return (
      <div className="home-root min-h-screen">
        <SiteHeader />
        <div className="w-full">{children}</div>
        <SiteFooter />
      </div>
    );
  }

  // Other public pages (login, register, pricing, verify, etc.)
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader />
      <div className="w-full">{children}</div>
      <SiteFooter />
    </div>
  );
}

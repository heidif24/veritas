"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export type NavItem = { href: string; label: string; icon?: string };

type RoleShellProps = {
  roleLabel: string;
  title?: string;
  nav: NavItem[];
  children: ReactNode;
  actions?: ReactNode;
};

export function RoleShell({ roleLabel, title, nav, children, actions }: RoleShellProps) {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="role-shell">
      <aside className={`role-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-3">
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A34B]">
                Veritas
              </p>
              <p className="truncate text-sm font-semibold text-white">{roleLabel}</p>
            </div>
          ) : (
            <span className="mx-auto font-display text-lg text-[#C5A34B]">V</span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="sidebar-nav flex flex-1 flex-col gap-0.5 p-2">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                  active
                    ? "bg-[#167451] text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs">
                  {item.icon ?? item.label.slice(0, 1)}
                </span>
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-xs">⌂</span>
            {!collapsed ? <span>Home</span> : null}
          </Link>
        </div>
      </aside>

      <div className="role-main">
        {(title || actions) && (
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--paper)]/95 px-4 py-3 backdrop-blur sm:px-6">
            {title ? (
              <h1 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">{title}</h1>
            ) : (
              <span />
            )}
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </header>
        )}
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}

export const STUDENT_NAV: NavItem[] = [
  { href: "/student", label: "Home", icon: "H" },
  { href: "/student/coaching", label: "Writing tutor", icon: "T" },
  { href: "/student/baseline", label: "Baseline", icon: "B" },
  { href: "/student/transparency", label: "Transparency", icon: "◎" },
  { href: "/app/dashboard", label: "Workspace", icon: "W" },
];

export const TUTOR_NAV: NavItem[] = [
  { href: "/tutor", label: "Dashboard", icon: "D" },
  { href: "/tutor/onboarding", label: "Profile", icon: "P" },
  { href: "/student/coaching", label: "Marketplace", icon: "M" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "O" },
  { href: "/admin/users", label: "Users", icon: "U" },
  { href: "/admin/cases", label: "Cases", icon: "C" },
  { href: "/admin/corpus", label: "Corpus", icon: "K" },
  { href: "/admin/analytics", label: "Analytics", icon: "A" },
  { href: "/admin/billing", label: "Billing", icon: "$" },
  { href: "/admin/security", label: "Security", icon: "S" },
  { href: "/admin/tenant", label: "Tenant", icon: "T" },
];

export const INSTRUCTOR_NAV: NavItem[] = [
  { href: "/instructor", label: "Dashboard", icon: "D" },
];

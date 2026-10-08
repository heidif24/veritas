"use client";

import Link from "next/link";
import { RoleShell, ADMIN_NAV } from "@/app/components/role-shell";

const stats = [
  { label: "Institutions", value: "24", hint: "Active tenants" },
  { label: "Total users", value: "12.4k", hint: "Across all roles" },
  { label: "Sealed docs", value: "48.2k", hint: "This month" },
  { label: "Integrity score", value: "99.97%", hint: "Platform health" },
];

const quickLinks = [
  { label: "Users", href: "/admin/users", desc: "Roles, access & enrollment" },
  { label: "Tenant settings", href: "/admin/tenant", desc: "Institution configuration" },
  { label: "Onboarding", href: "/admin/onboarding", desc: "New universities & publishers" },
  { label: "Analytics", href: "/admin/analytics", desc: "Usage & integrity trends" },
  { label: "Cases", href: "/admin/cases", desc: "Integrity reviews & appeals" },
  { label: "Corpus", href: "/admin/corpus", desc: "Institutional reference corpus" },
  { label: "Billing", href: "/admin/billing", desc: "Plans & invoices" },
  { label: "Security", href: "/admin/security", desc: "Keys, audit & access logs" },
];

const recent = [
  { who: "University of Lagos", action: "Completed onboarding", time: "2h ago" },
  { who: "Dr. Clara Bennett", action: "Elevated to institutional admin", time: "5h ago" },
  { who: "Publisher · Horizon Press", action: "New corpus batch uploaded", time: "Yesterday" },
  { who: "System", action: "Integrity health check passed", time: "Yesterday" },
];

export default function SuperAdminDashboard() {
  return (
    <RoleShell roleLabel="Super Admin" title="Platform overview" nav={ADMIN_NAV}>
      <p className="mb-6 max-w-2xl text-[var(--muted)]">
        Platform-wide control plane. Manage institutions, users, integrity, and billing.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="v-card p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{s.label}</div>
            <div className="mt-2 font-display text-3xl text-[var(--ink)]">{s.value}</div>
            <div className="mt-1 text-xs text-[var(--muted)]">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="v-card p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 transition hover:border-[var(--emerald)]/40 hover:bg-[var(--emerald-soft)]"
              >
                <div className="font-semibold text-[var(--ink)]">{item.label}</div>
                <div className="mt-0.5 text-xs text-[var(--muted)]">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="v-card p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Recent activity</h2>
          <ul className="mt-4 space-y-2">
            {recent.map((r) => (
              <li key={r.who + r.time} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5">
                <div className="text-sm font-medium text-[var(--ink)]">{r.who}</div>
                <div className="text-xs text-[var(--muted)]">{r.action}</div>
                <div className="mt-0.5 text-[10px] text-[var(--muted)]">{r.time}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--emerald)]/25 bg-[var(--emerald-soft)] p-6">
        <h2 className="font-display text-xl text-[var(--ink)]">Demo tip</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Use this Super Admin view for platform control: institutions, users, corpus, cases, and security.
          Switch accounts to Instructor / Student / Tutor for the day-to-day product experience.
        </p>
      </div>
    </RoleShell>
  );
}

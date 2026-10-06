import Link from "next/link";
import { PortalShell } from "../components/portal-shell";

const stats = [
  { label: "Institutions", value: "24", hint: "Active tenants", grad: "from-fuchsia-400 to-violet-500" },
  { label: "Total users", value: "12.4k", hint: "Across all roles", grad: "from-cyan-400 to-blue-500" },
  { label: "Sealed docs", value: "48.2k", hint: "This month", grad: "from-emerald-400 to-teal-500" },
  { label: "Integrity score", value: "99.97%", hint: "Platform health", grad: "from-amber-400 to-orange-500" },
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
    <PortalShell
      role="super"
      title="Super Admin"
      subtitle="Platform-wide control plane. Manage institutions, users, integrity, and billing."
      navItems={[
        { label: "Overview", href: "/admin", active: true },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Tenant", href: "/admin/tenant", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Cases", href: "/admin/cases", active: false },
        { label: "Corpus", href: "/admin/corpus", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.grad} opacity-25 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{s.label}</div>
              <div className={`mt-2 bg-gradient-to-r ${s.grad} bg-clip-text text-3xl font-black text-transparent`}>{s.value}</div>
              <div className="mt-1 text-xs text-slate-500">{s.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-fuchsia-400/40 hover:bg-white/10"
              >
                <div className="font-semibold text-white">{item.label}</div>
                <div className="mt-0.5 text-xs text-slate-400">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {recent.map((r) => (
              <li key={r.who + r.time} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2.5">
                <div className="text-sm font-medium text-white">{r.who}</div>
                <div className="text-xs text-slate-400">{r.action}</div>
                <div className="mt-1 text-[10px] text-slate-500">{r.time}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 rounded-[24px] border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 p-6">
        <h2 className="text-lg font-bold text-white">Demo tip</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Use this Super Admin view to show platform control: institutions, users, corpus, cases, and security.
          Switch accounts to Instructor / Student to show the day-to-day product experience.
        </p>
      </div>
    </PortalShell>
  );
}

import Link from "next/link";
import { PortalShell } from "../../components/portal-shell";

export default function AdminTenantPage() {
  return (
    <PortalShell
      role="institutional"
      title="Institution overview"
      subtitle="Monitor campus health, faculty onboarding, and trust indicators across your organization."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: true },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Departments", "12", "from-cyan-400 to-sky-500"],
          ["Faculty seats", "184", "from-violet-400 to-fuchsia-500"],
          ["SSO integrations", "4", "from-emerald-400 to-teal-500"],
          ["Active programs", "8", "from-amber-400 to-orange-500"],
        ].map(([label, value, grad]) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${grad} opacity-20 blur-2xl transition group-hover:opacity-35`} />
            <div className="relative">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{label}</div>
              <div className={`mt-3 bg-gradient-to-r ${grad} bg-clip-text text-3xl font-black text-transparent`}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-950/40 to-transparent p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Faculty onboarding</p>
          <h2 className="mt-3 text-xl font-bold text-white">Invite professors and assign review domains</h2>
          <div className="mt-5 space-y-2.5 text-sm text-slate-300">
            {["Invite by department and role", "Configure assignment review pools", "Track onboarding completion by school"].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-950/40 to-transparent p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">Submission flow</p>
          <h2 className="mt-3 text-xl font-bold text-white">Student → faculty → sealed export</h2>
          <div className="mt-5 space-y-2.5 text-sm text-slate-300">
            {["Student submits into the faculty queue", "Professor reviews evidence and history", "Sealed package returned with certificate"].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Department integrity</h2>
            <Link href="/admin/analytics" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
              Full reports →
            </Link>
          </div>
          <div className="space-y-4">
            {[
              ["Philosophy", "96%"],
              ["History", "92%"],
              ["Biology", "89%"],
              ["English", "94%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
          <h2 className="text-lg font-bold text-white">Live notes</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {["Review latency down 11% this month", "42 sealed packages processed today", "One department needs SSO revalidation"].map((note) => (
              <div key={note} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">{note}</div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

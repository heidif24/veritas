import { PortalShell } from "../../components/portal-shell";

export default function AdminBillingPage() {
  return (
    <PortalShell
      role="publisher"
      title="Billing & licensing"
      subtitle="Seats, renewals, and enterprise commitments across institutions and publishers."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: true },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Monthly recurring", "$18,420", "from-emerald-400 to-teal-500"],
          ["Seats active", "184 / 200", "from-cyan-400 to-sky-500"],
          ["Renewal date", "24 Oct 2026", "from-violet-400 to-fuchsia-500"],
        ].map(([label, value, grad]) => (
          <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${grad} opacity-25 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
              <div className={`mt-2 bg-gradient-to-r ${grad} bg-clip-text text-2xl font-black text-transparent md:text-3xl`}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-slate-950/40 p-6">
        <h2 className="text-lg font-bold text-white">Subscription summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          {[
            ["Institutional plan", "$3,200 / month"],
            ["Publisher add-on", "$1,450 / month"],
            ["Enterprise security suite", "$2,980 / month"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3.5">
              <span className="text-slate-300">{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}

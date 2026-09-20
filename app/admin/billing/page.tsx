import { PortalShell } from "../../components/portal-shell";

export default function AdminBillingPage() {
  return (
    <PortalShell
      title="Billing and licensing"
      subtitle="Track seats, renewals, and enterprise commitments across the institution and publisher network."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: true },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Monthly recurring", "$18,420"],
          ["Seats active", "184/200"],
          ["Renewal date", "24 Oct 2026"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-slate-950/35 p-6">
        <h2 className="text-xl font-bold text-white">Subscription summary</h2>
        <div className="mt-5 space-y-4 text-sm text-slate-300">
          {[
            ["Institutional plan", "$3,200 / month"],
            ["Publisher add-on", "$1,450 / month"],
            ["Enterprise security suite", "$2,980 / month"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/65 px-4 py-3">
              <span>{label}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}

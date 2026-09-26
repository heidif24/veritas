import { PortalShell } from "../../components/portal-shell";

export default function AdminSecurityPage() {
  return (
    <PortalShell
      role="super"
      title="Security & compliance"
      subtitle="Identity controls, encryption, and audit readiness across all tenants."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: true },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["TLS", "1.3", "from-cyan-400 to-blue-500"],
          ["Encryption", "AES-256", "from-emerald-400 to-teal-500"],
          ["SAML SSO", "Configured", "from-violet-400 to-fuchsia-500"],
        ].map(([label, value, grad]) => (
          <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${grad} opacity-25 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
              <div className={`mt-2 bg-gradient-to-r ${grad} bg-clip-text text-2xl font-black text-transparent`}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
          <h2 className="text-lg font-bold text-white">Governance</h2>
          <div className="mt-5 space-y-2.5 text-sm text-slate-300">
            {[
              "Data residency boundaries enforced",
              "FERPA-ready export controls enabled",
              "Key rotation every 90 days",
              "Audit log retention 13 months",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-6">
          <h2 className="text-lg font-bold text-white">Identity</h2>
          <div className="mt-5 space-y-2.5 text-sm text-slate-300">
            {[
              "SSO: Google, Microsoft, Okta",
              "MFA enforcement at 100%",
              "Privileged access logs active",
              "Session lock after 15 minutes",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

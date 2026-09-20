import { PortalShell } from "../../components/portal-shell";

export default function AdminSecurityPage() {
  return (
    <PortalShell
      title="Security and compliance"
      subtitle="Protect review records, manage identity controls, and maintain audit readiness across institutional tenants."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: false },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: true },
      ]}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["TLS", "1.3"],
          ["AES-256", "Enabled"],
          ["SAML SSO", "Configured"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-6">
          <h2 className="text-xl font-bold text-white">Governance controls</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {[
              "Data residency boundaries: Enforced",
              "FERPA-ready export controls: Enabled",
              "Key rotation cadence: 90 days",
              "Audit log retention: 13 months",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-6">
          <h2 className="text-xl font-bold text-white">Identity settings</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {[
              "SSO providers: Google, Microsoft, Okta",
              "MFA enforcement: 100%",
              "Privileged access logs: Active",
              "Session lock: 15 minutes",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

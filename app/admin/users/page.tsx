import { PortalShell } from "../../components/portal-shell";

const users = [
  { name: "Dr. Clara Bennett", role: "Professor", dept: "Philosophy", status: "Active" },
  { name: "Daniel Wong", role: "Administrator", dept: "Operations", status: "Active" },
  { name: "Harper Diaz", role: "Student", dept: "Biology", status: "Pending" },
  { name: "Marcus Lee", role: "Instructor", dept: "History", status: "Active" },
];

export default function AdminUsersPage() {
  return (
    <PortalShell
      role="institutional"
      title="User directory"
      subtitle="Manage roles, access, and enrollment across departments."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: true },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total users", "184", "from-cyan-400 to-blue-500"],
          ["Active faculty", "49", "from-violet-400 to-fuchsia-500"],
          ["New requests", "12", "from-amber-400 to-orange-500"],
        ].map(([label, value, grad]) => (
          <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${grad} opacity-25 blur-2xl`} />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
              <div className={`mt-2 bg-gradient-to-r ${grad} bg-clip-text text-3xl font-black text-transparent`}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Role</th>
              <th className="px-5 py-4 font-medium">Department</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name} className="border-t border-white/10 text-slate-200">
                <td className="px-5 py-4 font-medium text-white">{user.name}</td>
                <td className="px-5 py-4">{user.role}</td>
                <td className="px-5 py-4">{user.dept}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}

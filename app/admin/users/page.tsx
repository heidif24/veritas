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
      title="User directory"
      subtitle="Manage role access, institution onboarding, and secure enrollment across departments."
      navItems={[
        { label: "Overview", href: "/admin/tenant", active: false },
        { label: "Users", href: "/admin/users", active: true },
        { label: "Onboarding", href: "/admin/onboarding", active: false },
        { label: "Analytics", href: "/admin/analytics", active: false },
        { label: "Billing", href: "/admin/billing", active: false },
        { label: "Security", href: "/admin/security", active: false },
      ]}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Total users", "184"],
          ["Active faculty", "49"],
          ["New requests", "12"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/35">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-300">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name} className="border-t border-white/10 text-slate-200">
                <td className="px-5 py-4">{user.name}</td>
                <td className="px-5 py-4">{user.role}</td>
                <td className="px-5 py-4">{user.dept}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "Active" ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200"}`}>
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

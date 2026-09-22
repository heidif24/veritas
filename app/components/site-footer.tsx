import Link from "next/link";

const footerGroups = [
  {
    heading: "Platform",
    links: [
      { label: "Workspace", href: "/app/dashboard" },
      { label: "Verify", href: "/verify" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Institutions",
    links: [
      { label: "Universities", href: "/universities" },
      { label: "Onboarding", href: "/onboarding" },
      { label: "Admin", href: "/admin/tenant" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Instructor", href: "/instructor/courses" },
      { label: "Publisher", href: "/publisher/pitches" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
                V
              </span>
              Veritas
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Human-authorship proof, review-grade integrity, and secure document workflows for institutions, researchers, and publishers.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{group.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Veritas. Trusted writing, review, and verification.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/verify" className="hover:text-white">Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

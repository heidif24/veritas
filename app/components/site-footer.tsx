import Link from "next/link";

const footerGroups = [
  {
    heading: "Product",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Verify", href: "/verify" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Universities", href: "/universities" },
      { label: "Faculty", href: "/instructor/courses" },
      { label: "Publishers", href: "/publisher/pitches" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Onboarding", href: "/onboarding" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 border-b border-slate-200 pb-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
                V
              </span>
              Veritas
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              The trusted platform for verified academic and professional writing.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{group.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-slate-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Veritas. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            <Link href="/verify" className="hover:text-slate-900">Verify</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

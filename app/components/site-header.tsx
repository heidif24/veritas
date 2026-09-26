import Link from "next/link";

export function SiteHeader() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Verify", href: "/verify" },
    { label: "Workspace", href: "/app/dashboard" },
    { label: "Institution", href: "/universities" },
    { label: "Instructor", href: "/instructor/courses" },
    { label: "Publisher", href: "/publisher/pitches" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="border-b border-slate-200/70 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:px-6">
          <span>Trusted authorship workspace</span>
          <span className="hidden sm:inline">Secure • Professional • Review-ready</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-lg font-semibold tracking-wide text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
            V
          </span>
          <span className="hidden sm:inline">Veritas</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-600 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/verify"
            className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100 sm:inline-flex sm:text-sm"
          >
            Check proof
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:px-4 sm:text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

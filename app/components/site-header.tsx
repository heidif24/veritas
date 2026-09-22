import Link from "next/link";

export function SiteHeader() {
  const navItems = [
    { label: "Verify", href: "/verify" },
    { label: "Workspace", href: "/app/dashboard" },
    { label: "Instructor", href: "/instructor/courses" },
    { label: "Publisher", href: "/publisher/pitches" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-lg font-semibold tracking-wide text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
            V
          </span>
          <span className="hidden sm:inline">Veritas</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-white/10 bg-white/3 px-2 py-2 text-sm text-slate-200 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/verify"
            className="hidden rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20 sm:inline-flex sm:text-sm"
          >
            Check proof
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-100 sm:px-4 sm:text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

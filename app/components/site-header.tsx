import Link from "next/link";

export function SiteHeader() {
  const navItems = [
    { label: "Product", href: "/platform" },
    { label: "For universities", href: "/universities" },
    { label: "Pricing", href: "/pricing" },
    { label: "Verify", href: "/verify" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-lg font-semibold tracking-wide text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
            V
          </span>
          <span>Veritas</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4 sm:text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:px-4 sm:text-sm"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

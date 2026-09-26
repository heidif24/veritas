import Link from "next/link";
import { VeritasLogo } from "./veritas-logo";

export function SiteHeader() {
  const navItems = [
    { label: "Product", href: "/platform" },
    { label: "For universities", href: "/universities" },
    { label: "Pricing", href: "/pricing" },
    { label: "Verify", href: "/verify" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <VeritasLogo href="/" size="md" />

        <nav className="hidden flex-1 items-center justify-center gap-0.5 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 font-medium transition hover:bg-slate-100 hover:text-slate-900"
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
            className="rounded-full bg-gradient-to-r from-cyan-500 via-sky-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/25 transition hover:opacity-95 sm:px-4 sm:text-sm"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

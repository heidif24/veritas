import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">V</span>
          Veritas
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/3 px-2 py-2 text-sm text-slate-200 xl:flex">
          <Link href="/" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Home</Link>
          <Link href="/register" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Register</Link>
          <Link href="/login" className="rounded-full px-3 py-2 transition hover:bg-white/5 hover:text-white">Login</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/register" className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20">Create account</Link>
          <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Sign in</Link>
        </div>
      </div>
    </header>
  );
}

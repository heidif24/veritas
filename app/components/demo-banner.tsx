"use client";

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 border-b border-amber-500/40 bg-amber-500 px-4 py-2 text-center text-sm font-bold text-zinc-950 shadow-lg">
      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-zinc-950" />
      <span className="tracking-wide uppercase">DEMO MODE</span>
      <span className="hidden font-medium sm:inline">— Sample data &amp; demo accounts only. Not production.</span>
      <span className="font-mono text-xs font-semibold opacity-90 sm:ml-2">
        admin@veritas.io · instructor@veritas.io · student@veritas.io
      </span>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-md rounded-[30px] border border-white/10 bg-slate-900/70 p-8 text-center">
        <div className="text-5xl font-black text-cyan-300">404</div>
        <h1 className="mt-4 text-2xl font-bold text-white">This verification page does not exist.</h1>
        <p className="mt-3 text-sm text-slate-300">Return to the Veritas portal to continue your review.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
          Return home
        </Link>
      </div>
    </div>
  );
}

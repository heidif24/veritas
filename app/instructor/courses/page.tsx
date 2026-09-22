import Link from "next/link";
import { courseCards } from "../../data";

export default function InstructorCoursesPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Instructor portal</p>
            <h1 className="mt-2 text-3xl font-black text-white">Course and assignment manager</h1>
          </div>
          <button className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">Create assignment</button>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courseCards.map((course) => (
            <div key={course.id} className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">{course.term}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">{course.risk}</span>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-white">{course.title}</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Submissions</span><span className="font-semibold text-white">{course.submissions}</span></div>
                <div className="flex items-center justify-between"><span>Next deadline</span><span className="font-semibold text-white">{course.nextDeadline}</span></div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href="/instructor/assignment/a-102" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Open queue</Link>
                <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Secure dropbox</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

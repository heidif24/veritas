type ValueCardProps = {
  title: string;
  description: string;
  accent: string;
};

export function ValueCard({ title, description, accent }: ValueCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_0_1px_rgba(148,163,184,0.08)] backdrop-blur-sm">
      <div className={`mb-4 h-10 w-10 rounded-lg bg-gradient-to-br ${accent}`} />
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

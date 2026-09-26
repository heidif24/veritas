"use client";

import type { ReferenceEntry } from "@/lib/references";

type Props = {
  references: ReferenceEntry[];
  activeId: string | null;
  onChange: (refs: ReferenceEntry[]) => void;
  onFocusRef: (id: string) => void;
};

export function ReferencesPanel({ references, activeId, onChange, onFocusRef }: Props) {
  function update(id: string, patch: Partial<ReferenceEntry>) {
    onChange(references.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    const filtered = references.filter((r) => r.id !== id);
    const renumbered = filtered
      .sort((a, b) => a.number - b.number)
      .map((r, i) => ({ ...r, number: i + 1, citationKey: `[${i + 1}]` }));
    onChange(renumbered);
  }

  return (
    <div className="flex h-full flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">Bibliography</p>
        <p className="mt-1 text-xs text-slate-500">
          Click <strong>Reference</strong> in the toolbar to insert the next number and fill details here.
        </p>
      </div>
      <ul className="flex-1 space-y-3 overflow-y-auto p-3">
        {!references.length ? (
          <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            No references yet. Place the cursor in your draft and add a reference to start tracking sources.
          </li>
        ) : (
          references
            .slice()
            .sort((a, b) => a.number - b.number)
            .map((r) => (
              <li
                key={r.id}
                id={`ref-editor-${r.id}`}
                className={`rounded-xl border p-3 shadow-sm transition ${
                  activeId === r.id ? "border-cyan-400 ring-2 ring-cyan-100" : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => onFocusRef(r.id)} className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">
                    [{r.number}]
                  </button>
                  <button type="button" onClick={() => remove(r.id)} className="text-[10px] font-semibold text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
                <label className="block text-[10px] font-semibold text-slate-500">
                  Authors
                  <input value={r.authors} onChange={(e) => update(r.id, { authors: e.target.value })} className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs" placeholder="Surname, A. & Surname, B." />
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <label className="col-span-1 block text-[10px] font-semibold text-slate-500">
                    Year
                    <input value={r.year} onChange={(e) => update(r.id, { year: e.target.value })} className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs" placeholder="2024" />
                  </label>
                  <label className="col-span-2 block text-[10px] font-semibold text-slate-500">
                    Title
                    <input value={r.title} onChange={(e) => update(r.id, { title: e.target.value })} className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs" placeholder="Article or book title" />
                  </label>
                </div>
                <label className="mt-2 block text-[10px] font-semibold text-slate-500">
                  Source
                  <input value={r.source} onChange={(e) => update(r.id, { source: e.target.value })} className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs" placeholder="Journal, publisher, or site" />
                </label>
                <label className="mt-2 block text-[10px] font-semibold text-slate-500">
                  URL (optional)
                  <input value={r.url || ""} onChange={(e) => update(r.id, { url: e.target.value })} className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs" placeholder="https://" />
                </label>
              </li>
            ))
        )}
      </ul>
    </div>
  );
}

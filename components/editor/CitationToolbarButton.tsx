"use client";

import { appendCitationMarker, createReferenceStub, type ReferenceEntry } from "@/lib/references";

type Props = {
  references: ReferenceEntry[];
  content: string;
  onReferencesChange: (refs: ReferenceEntry[]) => void;
  onContentChange: (html: string) => void;
  onActivate: (id: string) => void;
};

export function CitationToolbarButton({
  references,
  content,
  onReferencesChange,
  onContentChange,
  onActivate,
}: Props) {
  function addReference() {
    const entry = createReferenceStub(references);
    const nextRefs = [...references, entry];
    onReferencesChange(nextRefs);
    onContentChange(appendCitationMarker(content, entry.number));
    onActivate(entry.id);
    requestAnimationFrame(() => {
      document.getElementById(`ref-editor-${entry.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <button
      type="button"
      onClick={addReference}
      title="Insert next reference number and open bibliography entry"
      className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-cyan-50 hover:text-cyan-900 hover:ring-cyan-300"
    >
      Reference
    </button>
  );
}

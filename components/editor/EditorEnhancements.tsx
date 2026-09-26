"use client";

import { useMemo, useState } from "react";
import { ReferencesPanel } from "./ReferencesPanel";
import { CitationToolbarButton } from "./CitationToolbarButton";
import { ProctorShell } from "./ProctorShell";
import { formatBibliographyHtml, type ReferenceEntry } from "@/lib/references";
import type { ProctorSession } from "@/lib/proctor";

export function useBibliography(initial: ReferenceEntry[] = []) {
  const [references, setReferences] = useState<ReferenceEntry[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const bibliographyHtml = useMemo(() => formatBibliographyHtml(references), [references]);

  return {
    references,
    setReferences,
    activeId,
    setActiveId,
    bibliographyHtml,
    CitationButton: function BoundCitationButton({
      content,
      onContentChange,
    }: {
      content: string;
      onContentChange: (html: string) => void;
    }) {
      return (
        <CitationToolbarButton
          references={references}
          content={content}
          onReferencesChange={setReferences}
          onContentChange={onContentChange}
          onActivate={setActiveId}
        />
      );
    },
    BibliographySide: function BoundBibliography() {
      return (
        <ReferencesPanel
          references={references}
          activeId={activeId}
          onChange={setReferences}
          onFocusRef={setActiveId}
        />
      );
    },
  };
}

export function SecureAssignmentFrame({
  proctored,
  title,
  children,
  onProctorUpdate,
}: {
  proctored: boolean;
  title?: string;
  children: React.ReactNode;
  onProctorUpdate?: (s: ProctorSession) => void;
}) {
  return (
    <ProctorShell enabled={proctored} title={title} onSessionUpdate={onProctorUpdate}>
      {children}
    </ProctorShell>
  );
}

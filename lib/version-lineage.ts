import { getDb } from "@/lib/db";
import { scoreAuthorshipEnsemble } from "@/lib/authorship-ensemble";
import type { CompositionOperation } from "@/lib/composition-health";

export type VersionNode = {
  id: string;
  documentId: string;
  title: string;
  createdAt: string;
  wordCount: number;
  contentPreview: string;
};

export function listVersions(documentId: string): VersionNode[] {
  const rows = getDb()
    .prepare(`SELECT id, document_id, title, content, created_at FROM document_revisions WHERE document_id = ? ORDER BY created_at ASC`)
    .all(documentId) as Array<{ id: string; document_id: string; title: string; content: string; created_at: string }>;

  return rows.map((r) => {
    const plain = r.content.replace(/<[^>]+>/g, " ");
    return {
      id: r.id,
      documentId: r.document_id,
      title: r.title,
      createdAt: r.created_at,
      wordCount: plain.trim() ? plain.trim().split(/\s+/).length : 0,
      contentPreview: plain.slice(0, 240),
    };
  });
}

export function integrityDelta(documentId: string, ops: CompositionOperation[] = []) {
  const versions = listVersions(documentId);
  if (versions.length < 2) {
    return { versions, deltaSummary: "Need at least two snapshots to compute lineage delta." };
  }
  const first = versions[0];
  const last = versions[versions.length - 1];
  const ensemble = scoreAuthorshipEnsemble({
    text: last.contentPreview,
    ops,
    baselineText: first.contentPreview,
  });
  return {
    versions,
    firstId: first.id,
    lastId: last.id,
    wordGrowth: last.wordCount - first.wordCount,
    styleDrift: ensemble.style.driftLabel,
    sessionLabel: ensemble.session.structuralLabel,
    blendedRisk: ensemble.blendedRisk,
    deltaSummary: `Words ${first.wordCount} → ${last.wordCount}. Style ${ensemble.style.driftLabel}. Session ${ensemble.session.structuralLabel}.`,
  };
}

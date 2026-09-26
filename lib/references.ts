/**
 * Veritas reference / bibliography system (original).
 * Inserts sequential citation markers and maintains a structured reference list.
 */

export type ReferenceEntry = {
  id: string;
  number: number;
  citationKey: string;
  title: string;
  authors: string;
  year: string;
  source: string;
  url?: string;
  notes?: string;
  createdAt: string;
};

export function parseReferencesFromJson(raw?: string | null): ReferenceEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function nextReferenceNumber(refs: ReferenceEntry[]): number {
  if (!refs.length) return 1;
  return Math.max(...refs.map((r) => r.number)) + 1;
}

export function createReferenceStub(refs: ReferenceEntry[]): ReferenceEntry {
  const number = nextReferenceNumber(refs);
  return {
    id: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
    number,
    citationKey: `[${number}]`,
    title: "",
    authors: "",
    year: "",
    source: "",
    url: "",
    notes: "",
    createdAt: new Date().toISOString(),
  };
}

export function appendCitationMarker(html: string, number: number): string {
  const marker = `<sup class="veritas-cite" data-ref="${number}" contenteditable="false">[${number}]</sup>`;
  const trimmed = (html || "<p></p>").trim();
  if (trimmed.endsWith("</p>")) {
    return trimmed.slice(0, -4) + marker + "</p>";
  }
  return trimmed + marker;
}

export function formatBibliographyHtml(refs: ReferenceEntry[]): string {
  if (!refs.length) return "";
  const items = [...refs]
    .sort((a, b) => a.number - b.number)
    .map((r) => {
      const bits = [r.authors, r.year ? `(${r.year})` : "", r.title, r.source, r.url].filter(Boolean).join(". ");
      return `<li id="ref-${r.number}"><span class="ref-num">[${r.number}]</span> ${bits || "<em>Incomplete reference</em>"}</li>`;
    })
    .join("");
  return `<section class="veritas-bibliography"><h3>References</h3><ol>${items}</ol></section>`;
}

export function bibliographyPlainText(refs: ReferenceEntry[]): string {
  return [...refs]
    .sort((a, b) => a.number - b.number)
    .map((r) => {
      const bits = [r.authors, r.year ? `(${r.year})` : "", r.title, r.source, r.url].filter(Boolean).join(". ");
      return `[${r.number}] ${bits || "(incomplete)"}`;
    })
    .join("\n");
}

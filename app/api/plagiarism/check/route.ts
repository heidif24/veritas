import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { createPlagiarismCheck, listSubmittedDocumentsByHashes, prisma, getDb } from "@/lib/db";
import { buildWindowHashes } from "@/lib/plagiarism/chunker";
import { getProviderCorpusStatus, getSimilarityProvider } from "@/lib/plagiarism/provider";
import { advancedSimilarityCheck, type SourceDoc } from "@/lib/plagiarism/advanced";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

const requestSchema = z.object({
  documentId: z.string().min(1).max(120),
  text: z.string().max(200_000),
  hashes: z.array(z.string().max(32)).max(100_000).optional(),
  windowSize: z.number().int().min(5).max(5).optional(),
});

const configuredThreshold = Number(process.env.VERITAS_SIMILARITY_THRESHOLD ?? 20);
const similarityThreshold = Number.isFinite(configuredThreshold)
  ? Math.min(100, Math.max(0, configuredThreshold))
  : 20;

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const parsed = requestSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid plagiarism check request" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({ where: { id: parsed.data.documentId } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!document.organizationId) {
      return NextResponse.json({
        overallSimilarityScore: 0,
        uncitedScore: 0,
        citedScore: 0,
        matchedSegments: [],
        bySource: [],
        checkedWords: 0,
        provider: "institutional-submission-index",
        indexedSubmissions: 0,
        similarityThreshold,
        privacy: "draft-not-indexed",
      });
    }

    const submissions = listSubmittedDocumentsByHashes(
      document.organizationId,
      buildWindowHashes(parsed.data.text, 5),
    )
      .filter((submission) => submission.id !== document.id)
      .map((submission) => ({ id: submission.id, title: submission.title, content: submission.content }));

    const corpusRows = getDb()
      .prepare("SELECT id, title, body, source_url FROM corpus WHERE organization_id = ?")
      .all(document.organizationId) as Array<{ id: string; title: string; body: string; source_url?: string }>;

    try {
      getDb().exec(`CREATE TABLE IF NOT EXISTS document_sources (
        id TEXT PRIMARY KEY, document_id TEXT NOT NULL, title TEXT NOT NULL, url TEXT, body TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);
    } catch { /* */ }

    const attached = getDb()
      .prepare("SELECT id, title, body, url FROM document_sources WHERE document_id = ?")
      .all(document.id) as Array<{ id: string; title: string; body: string; url?: string }>;

    const sources: SourceDoc[] = [
      ...submissions.map((s) => ({ id: s.id, title: s.title, content: s.content })),
      ...corpusRows.map((c) => ({ id: c.id, title: c.title, content: c.body, url: c.source_url })),
      ...attached.map((a) => ({ id: a.id, title: a.title, content: a.body, url: a.url })),
    ];

    const advanced = advancedSimilarityCheck(parsed.data.text, sources);
    const provider = getSimilarityProvider();
    let providerName = `${provider.name}+advanced`;
    if (provider.name === "licensed-external-provider") {
      try {
        const external = await provider.check(parsed.data.text, submissions);
        advanced.matches.push(
          ...external.matchedSegments.map((m) => ({
            ...m,
            cited: false,
            matchKind: "exact-window" as const,
            sourceShare: m.similarityPercentage,
          })),
        );
        advanced.overallScore = Math.max(advanced.overallScore, external.overallSimilarityScore);
        providerName = "licensed-external+advanced";
      } catch { /* */ }
    }

    const corpusStatus = getProviderCorpusStatus(submissions);
    createPlagiarismCheck({
      documentId: document.id,
      organizationId: document.organizationId,
      overallScore: advanced.uncitedScore || advanced.overallScore,
      matchedSegments: advanced.matches,
      checkedWords: advanced.checkedWords,
      provider: providerName,
    });

    recordAudit({
      action: "similarity_check",
      actorId: user.id,
      documentId: document.id,
      metadata: { score: advanced.uncitedScore, overall: advanced.overallScore },
    });

    return NextResponse.json({
      overallSimilarityScore: advanced.uncitedScore || advanced.overallScore,
      uncitedScore: advanced.uncitedScore,
      citedScore: advanced.citedScore,
      matchedSegments: advanced.matches,
      bySource: advanced.bySource,
      checkedWords: advanced.checkedWords,
      checkedHashes: parsed.data.hashes?.length ?? 0,
      ...corpusStatus,
      provider: providerName,
      similarityThreshold,
      privacy: "draft-not-indexed",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to check plagiarism" }, { status: 401 });
  }
}

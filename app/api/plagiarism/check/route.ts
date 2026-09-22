import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { createPlagiarismCheck, listSubmittedDocumentsByHashes, prisma } from "@/lib/db";
import { buildWindowHashes } from "@/lib/plagiarism/chunker";
import { getProviderCorpusStatus, getSimilarityProvider } from "@/lib/plagiarism/provider";

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
        matchedSegments: [],
        checkedWords: 0,
        provider: "institutional-submission-index",
        indexedSubmissions: 0,
        similarityThreshold,
        privacy: "draft-not-indexed",
      });
    }

    const submissions = listSubmittedDocumentsByHashes(document.organizationId, buildWindowHashes(parsed.data.text, 5))
      .filter((submission) => submission.id !== document.id)
      .map((submission) => ({ id: submission.id, title: submission.title, content: submission.content }));
    const provider = getSimilarityProvider();
    const result = await provider.check(parsed.data.text, submissions);
    const corpusStatus = getProviderCorpusStatus(submissions);

    createPlagiarismCheck({
      documentId: document.id,
      organizationId: document.organizationId,
      overallScore: result.overallSimilarityScore,
      matchedSegments: result.matchedSegments,
      checkedWords: result.checkedWords,
      provider: provider.name,
    });

    return NextResponse.json({
      ...result,
      checkedHashes: parsed.data.hashes?.length ?? 0,
      ...corpusStatus,
      similarityThreshold,
      privacy: "draft-not-indexed",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to check plagiarism" }, { status: 401 });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDb, prisma, updateDocument } from "@/lib/db";
import { getAssignment } from "@/lib/assignments";
import { getAttemptInfo, recordSubmission } from "@/lib/submission-policy";
import { runAiCheck } from "@/lib/ai-checker";
import { buildWindowHashes } from "@/lib/plagiarism/chunker";
import { listSubmittedDocumentsByHashes } from "@/lib/db";
import { advancedSimilarityCheck, type SourceDoc } from "@/lib/plagiarism/advanced";
import type { CompositionOperation } from "@/lib/composition-health";
import { scoreCompositionHealth } from "@/lib/composition-health";
import { loadDocumentTelemetry, saveDocumentTelemetry } from "@/lib/telemetry-store";
import { linkAssignmentDocument } from "@/lib/assignment-link";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: assignmentId } = await params;
    const body = await request.json().catch(() => ({}));

    const assignment = getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const attemptInfo = getAttemptInfo(assignmentId, user.id);
    if (!attemptInfo.canSubmit) {
      return NextResponse.json(
        { error: attemptInfo.reason || "Cannot submit", attemptInfo },
        { status: 403 },
      );
    }

    const documentId = typeof body.documentId === "string" ? body.documentId : null;
    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document || document.ownerId !== user.id) {
      return NextResponse.json({ error: "Document not found or not owned by you" }, { status: 404 });
    }

    const text = String(document.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text.trim().length < 40) {
      return NextResponse.json({ error: "Write more before submitting (at least ~40 characters)." }, { status: 400 });
    }

    const stored = loadDocumentTelemetry(documentId);
    let ops: CompositionOperation[] = stored?.ops ?? [];
    let focusLosses = stored?.focusLosses ?? 0;
    if (!ops.length) {
      try {
        const row = getDb()
          .prepare("SELECT telemetry_json FROM documents WHERE id = ?")
          .get(documentId) as { telemetry_json?: string } | undefined;
        const tel = JSON.parse(row?.telemetry_json || "{}");
        if (Array.isArray(tel.ops)) {
          ops = tel.ops.map((o: { type?: string; kind?: string; timestamp?: number; chars?: number }) => ({
            timestamp: Number(o.timestamp || Date.now()),
            kind: (o.kind || o.type || "type") as CompositionOperation["kind"],
            chars: Number(o.chars || 1),
          }));
        }
        focusLosses = Number(tel.blurCount || tel.tabSwitches || focusLosses || 0);
      } catch {
        /* optional */
      }
    }
    if (Array.isArray(body.ops) && body.ops.length >= ops.length) {
      ops = body.ops.map((o: Record<string, unknown>) => ({
        timestamp: Number(o.timestamp || Date.now()),
        kind: (o.kind || o.type || "type") as CompositionOperation["kind"],
        chars: Number(o.chars || 1),
      }));
    }
    if (typeof body.focusLosses === "number") focusLosses = body.focusLosses;
    saveDocumentTelemetry(documentId, { ops, focusLosses });
    linkAssignmentDocument({ documentId, assignmentId, userId: user.id });

    let similarityScore = 0;
    let matchedSegments: Array<{
      snippet: string;
      sourceTitle?: string;
      similarityPercentage: number;
      start?: number;
      end?: number;
      matchedSourceUrl?: string;
    }> = [];
    let bySource: Array<{ title: string; score: number }> = [];

    if (document.organizationId) {
      try {
        const submissions = listSubmittedDocumentsByHashes(
          document.organizationId,
          buildWindowHashes(text, 5),
        )
          .filter((s) => s.id !== documentId)
          .map((s) => ({ id: s.id, title: s.title, content: s.content }));

        const corpusRows = getDb()
          .prepare("SELECT id, title, body, source_url FROM corpus WHERE organization_id = ?")
          .all(document.organizationId) as Array<{ id: string; title: string; body: string; source_url?: string }>;

        const sources: SourceDoc[] = [
          ...submissions.map((s) => ({ id: s.id, title: s.title, content: s.content })),
          ...corpusRows.map((c) => ({ id: c.id, title: c.title, content: c.body, url: c.source_url })),
        ];

        if (sources.length) {
          const result = advancedSimilarityCheck(text, sources);
          similarityScore = Number(result.overallScore ?? 0);
          matchedSegments = (result.matches || []).map((m) => ({
            snippet: String(m.snippet || ""),
            sourceTitle: (m as { sourceTitle?: string }).sourceTitle,
            similarityPercentage: Number(m.similarityPercentage ?? 0),
            start: typeof m.startOffset === "number" ? m.startOffset : undefined,
            end: typeof m.endOffset === "number" ? m.endOffset : undefined,
            matchedSourceUrl: (m as { matchedSourceUrl?: string }).matchedSourceUrl,
          }));
          bySource = (result.bySource || []).map((s) => ({
            title: String(s.title || "Source"),
            score: Number(s.percent ?? 0),
          }));
        }
      } catch {
        similarityScore = 0;
      }
    }

    const ai = runAiCheck({ text, ops, focusLosses });
    const health = scoreCompositionHealth(ops, focusLosses);
    const nextAttempt = attemptInfo.attemptCount + 1;

    try {
      updateDocument(documentId, { status: "submitted" });
    } catch {
      getDb().prepare(`UPDATE documents SET status = 'submitted', updated_at = ? WHERE id = ?`).run(
        new Date().toISOString(),
        documentId,
      );
    }

    const similarityDetails = {
      overallSimilarityScore: similarityScore,
      matchedSegments,
      bySource,
      threshold: assignment.similarity_threshold ?? 0.25,
    };

    const submissionId = recordSubmission({
      assignmentId,
      documentId,
      authorId: user.id,
      attemptNumber: nextAttempt,
      healthScore: health.aiRiskScore,
      similarityScore,
      aiScore: ai.overallScore,
      aiLabel: ai.label,
      similarityDetails,
      aiDetails: ai,
      contentSnapshot: text,
    });

    const updatedAttempts = getAttemptInfo(assignmentId, user.id);

    return NextResponse.json({
      ok: true,
      submissionId,
      attemptNumber: nextAttempt,
      attemptInfo: updatedAttempts,
      plainText: text,
      documentTitle: document.title || "Submission",
      similarity: {
        overallScore: similarityScore,
        matchedSegments,
        bySource,
        threshold: Math.round((assignment.similarity_threshold ?? 0.25) * 100),
      },
      ai: {
        overallScore: ai.overallScore,
        label: ai.label,
        summary: ai.summary,
        factors: ai.factors,
        segments: ai.segments,
        methodology: ai.methodology,
      },
      message:
        updatedAttempts.remainingAttempts > 0
          ? `Submitted (attempt ${nextAttempt} of ${updatedAttempts.maxAttempts}). Similarity and AI checks are below. You may edit the highlighted parts and resubmit ${updatedAttempts.remainingAttempts} more time(s) before the deadline.`
          : `Submitted (attempt ${nextAttempt} of ${updatedAttempts.maxAttempts}). No further edits or resubmissions are allowed.`,
      plainText: text,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Submit failed";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

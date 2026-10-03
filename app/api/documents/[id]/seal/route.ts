import { NextResponse } from "next/server";
import { prisma, getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createDocumentSeal } from "@/lib/crypto";
import { buildProcessCertificate } from "@/lib/process-certificate";
import { appendCustodyLink } from "@/lib/revision-custody";
import { getUserDeviceTrail } from "@/lib/session-security";
import { getLatestBaseline } from "@/lib/baseline-sample";
import { compareStyle } from "@/lib/stylometry";
import { scoreAuthorshipEnsemble } from "@/lib/authorship-ensemble";
import type { CompositionOperation } from "@/lib/composition-health";

export const runtime = "nodejs";

function normalizeOps(raw: unknown[]): CompositionOperation[] {
  return raw
    .map((entry) => {
      const e = entry as Record<string, unknown>;
      const kindRaw = String(e.kind ?? e.type ?? "").toLowerCase();
      const kind: CompositionOperation["kind"] =
        kindRaw.includes("paste") ? "paste" : kindRaw.includes("delete") ? "delete" : "type";
      const timestamp = Number(e.timestamp ?? e.time ?? Date.now());
      const chars = Math.max(0, Number(e.chars ?? e.length ?? 0) || 0);
      return { kind, timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(), chars };
    })
    .filter((o) => o.chars > 0 || o.kind === "type");
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && document.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ops = normalizeOps(Array.isArray(body.ops) ? body.ops : []);
    const telemetry = body.telemetry ?? {};
    const focusLosses = Number(telemetry.blurCount ?? telemetry.focusLosses ?? 0) || 0;
    const compareBaseline = body.compareBaseline !== false;

    // Auto-load baseline sample for style/process comparison
    let baselineText: string | null = null;
    let baselineComparison: {
      hasBaseline: boolean;
      driftLabel?: string;
      driftScore?: number;
      summary: string;
      notes?: string[];
    } | null = null;

    if (compareBaseline) {
      try {
        const baseline = getLatestBaseline(document.ownerId);
        if (baseline?.content) {
          baselineText = baseline.content;
          const style = compareStyle(document.content, baselineText);
          const ensemble = scoreAuthorshipEnsemble({
            text: document.content,
            ops,
            focusLosses,
            baselineText,
            sealed: true,
          });
          baselineComparison = {
            hasBaseline: true,
            driftLabel: style.driftLabel,
            driftScore: style.driftScore,
            summary:
              style.driftLabel === "strong-shift"
                ? `Style differs notably from baseline sample (“${baseline.title}”).`
                : style.driftLabel === "moderate-shift"
                  ? `Moderate style shift vs baseline (“${baseline.title}”).`
                  : `Style is consistent with baseline (“${baseline.title}”).`,
            notes: [...(style.notes ?? []), ...ensemble.plainLanguageWhy.slice(0, 2)],
          };
        } else {
          baselineComparison = {
            hasBaseline: false,
            summary: "No baseline sample on file — comparison skipped.",
          };
        }
      } catch {
        baselineComparison = {
          hasBaseline: false,
          summary: "Baseline comparison unavailable.",
        };
      }
    }

    const payload = {
      title: document.title,
      content: document.content,
      ownerId: document.ownerId,
      organizationId: document.organizationId,
      status: document.status,
      ops,
      telemetry,
      assignmentId: body.assignmentId ?? id,
    };

    const seal = createDocumentSeal(payload);

    let deviceTrail = null;
    try {
      deviceTrail = getUserDeviceTrail(document.ownerId);
    } catch {
      /* non-fatal */
    }
    const processCertificate = buildProcessCertificate({
      authorId: document.ownerId,
      title: document.title,
      text: document.content,
      ops,
      focusLosses,
      deviceTrail,
    });

    const db = getDb();
    db.prepare(
      `UPDATE documents SET sealed_hash = ?, integrity_status = 'verified', status = 'submitted', telemetry_json = ?, updated_at = ? WHERE id = ?`,
    ).run(
      seal.hash,
      JSON.stringify({
        ...telemetry,
        ops,
        processCertificate,
        baselineComparison,
      }),
      new Date().toISOString(),
      id,
    );

    let revisionId: string | null = null;
    try {
      revisionId = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      db.prepare(
        `INSERT INTO document_revisions (id, document_id, title, content, "references") VALUES (?, ?, ?, ?, ?)`,
      ).run(revisionId, id, document.title, document.content, "[]");
    } catch {
      revisionId = null;
    }

    let custody = null;
    try {
      custody = appendCustodyLink({
        documentId: id,
        content: document.content,
        revisionId,
        label: "seal",
      });
    } catch {
      /* non-fatal */
    }

    const updated = await prisma.document.findUnique({ where: { id } });

    return NextResponse.json({
      document: updated,
      seal: seal.hash,
      processCertificate,
      baselineComparison,
      custody,
      bundle: {
        version: 1,
        format: "veritas",
        payload: {
          ...seal.payload,
          processCertificate,
          baselineComparison,
        },
        sha256: seal.hash,
        signature: seal.signature,
        publicKeyPem: seal.publicKeyPem,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

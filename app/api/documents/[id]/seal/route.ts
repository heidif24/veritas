import { NextResponse } from "next/server";
import { prisma, getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createDocumentSeal } from "@/lib/crypto";
import { buildProcessCertificate } from "@/lib/process-certificate";
import { appendCustodyLink } from "@/lib/revision-custody";
import { getUserDeviceTrail } from "@/lib/session-security";
import type { CompositionOperation } from "@/lib/composition-health";

export const runtime = "nodejs";

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

    const ops = (Array.isArray(body.ops) ? body.ops : []) as CompositionOperation[];
    const telemetry = body.telemetry ?? {};
    const focusLosses = Number(telemetry.blurCount ?? telemetry.focusLosses ?? 0) || 0;

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

    // Process certificate + device trail (additive evidence)
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
      JSON.stringify({ ...telemetry, ops, processCertificate }),
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

    // Cryptographic chain of custody checkpoint on seal
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
      custody,
      bundle: {
        version: 1,
        format: "veritas",
        payload: {
          ...seal.payload,
          processCertificate,
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

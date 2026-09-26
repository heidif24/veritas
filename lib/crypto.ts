import crypto from "node:crypto";

import { computeHealthScore, createVeritasBundle, verifyVeritasBundle } from "@/lib/veritas";

export function createDocumentSeal(document: {
  title: string;
  content: string;
  ownerId: string;
  organizationId?: string | null;
  status?: string;
  ops?: Array<Record<string, unknown>>;
  telemetry?: Record<string, unknown>;
  assignmentId?: string;
}) {
  const keyPair = crypto.generateKeyPairSync("ed25519");
  const payload = {
    authorId: document.ownerId,
    title: document.title,
    text: document.content,
    ops: document.ops ?? [],
    telemetry: document.telemetry ?? {},
    assignmentId: document.assignmentId ?? undefined,
    sealedAt: new Date().toISOString(),
  };

  const bundle = createVeritasBundle(payload, keyPair);
  const health = computeHealthScore(document.content, document.ops ?? []);

  return {
    hash: bundle.sha256,
    payload: bundle.payload,
    signature: bundle.signature,
    publicKeyPem: bundle.publicKeyPem,
    health,
    bundle,
  };
}

export function verifyDocumentSeal(input: {
  title: string;
  content: string;
  ownerId: string;
  organizationId?: string | null;
  status?: string;
  sealedHash?: string | null;
  bundle?: { payload?: { text?: string; authorId?: string }; sha256?: string; signature?: string; publicKeyPem?: string } | null;
}) {
  if (!input.sealedHash) {
    return { valid: false, reason: "No seal present" };
  }

  const produced = createDocumentSeal({
    title: input.title,
    content: input.content,
    ownerId: input.ownerId,
    organizationId: input.organizationId,
    status: input.status,
  });

  const valid = produced.hash === input.sealedHash;
  return {
    valid,
    hash: produced.hash,
    reason: valid ? "Document hash matches the recorded seal" : "Document integrity broken post-export",
  };
}

export { computeHealthScore, createVeritasBundle, verifyVeritasBundle };

import crypto from "node:crypto";

export function createDocumentSeal(document: { title: string; content: string; ownerId: string; organizationId?: string | null; status?: string }) {
  const payload = {
    title: document.title,
    content: document.content,
    ownerId: document.ownerId,
    organizationId: document.organizationId ?? null,
    status: document.status ?? "draft",
    version: "veritas-v1",
  };

  const hash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return { hash, payload };
}

export function verifyDocumentSeal(input: { title: string; content: string; ownerId: string; organizationId?: string | null; status?: string; sealedHash?: string | null }) {
  const produced = createDocumentSeal({
    title: input.title,
    content: input.content,
    ownerId: input.ownerId,
    organizationId: input.organizationId,
    status: input.status,
  });

  if (!input.sealedHash) {
    return { valid: false, reason: "No seal present" };
  }

  return {
    valid: produced.hash === input.sealedHash,
    hash: produced.hash,
    reason: produced.hash === input.sealedHash ? "Document hash matches the recorded seal" : "Document integrity broken post-export",
  };
}

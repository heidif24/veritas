/**
 * Cryptographic chain of custody for document revisions.
 * Each major checkpoint gets a SHA-256 hash linked to the previous one.
 */

import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export type CustodyLink = {
  id: string;
  documentId: string;
  revisionId: string | null;
  contentHash: string;
  previousHash: string | null;
  chainHash: string;
  label: string;
  createdAt: string;
};

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function ensureCustodyTable() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS revision_custody (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      revision_id TEXT,
      content_hash TEXT NOT NULL,
      previous_hash TEXT,
      chain_hash TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT 'checkpoint',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );
  `);
}

function cryptoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Append a custody link for the current document content. */
export function appendCustodyLink(input: {
  documentId: string;
  content: string;
  revisionId?: string | null;
  label?: string;
}): CustodyLink {
  ensureCustodyTable();
  const contentHash = sha256(input.content);
  const prev = getDb()
    .prepare(
      `SELECT chain_hash FROM revision_custody WHERE document_id = ? ORDER BY created_at DESC LIMIT 1`,
    )
    .get(input.documentId) as { chain_hash: string } | undefined;

  const previousHash = prev?.chain_hash ?? null;
  const chainHash = sha256(`${previousHash ?? "genesis"}|${contentHash}|${input.documentId}`);
  const id = cryptoId();
  const createdAt = new Date().toISOString();

  getDb()
    .prepare(
      `INSERT INTO revision_custody (id, document_id, revision_id, content_hash, previous_hash, chain_hash, label, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.documentId,
      input.revisionId ?? null,
      contentHash,
      previousHash,
      chainHash,
      input.label ?? "checkpoint",
      createdAt,
    );

  return {
    id,
    documentId: input.documentId,
    revisionId: input.revisionId ?? null,
    contentHash,
    previousHash,
    chainHash,
    label: input.label ?? "checkpoint",
    createdAt,
  };
}

export function listCustodyChain(documentId: string): CustodyLink[] {
  ensureCustodyTable();
  const rows = getDb()
    .prepare(
      `SELECT id, document_id, revision_id, content_hash, previous_hash, chain_hash, label, created_at
       FROM revision_custody WHERE document_id = ? ORDER BY created_at ASC`,
    )
    .all(documentId) as Array<{
    id: string;
    document_id: string;
    revision_id: string | null;
    content_hash: string;
    previous_hash: string | null;
    chain_hash: string;
    label: string;
    created_at: string;
  }>;

  return rows.map((r) => ({
    id: r.id,
    documentId: r.document_id,
    revisionId: r.revision_id,
    contentHash: r.content_hash,
    previousHash: r.previous_hash,
    chainHash: r.chain_hash,
    label: r.label,
    createdAt: r.created_at,
  }));
}

/** Verify the chain is intact (each link hashes to the next). */
export function verifyCustodyChain(documentId: string): {
  valid: boolean;
  links: number;
  reason: string;
} {
  const chain = listCustodyChain(documentId);
  if (!chain.length) return { valid: true, links: 0, reason: "No custody links yet." };

  for (let i = 0; i < chain.length; i++) {
    const link = chain[i];
    const expectedPrev = i === 0 ? null : chain[i - 1].chainHash;
    if (link.previousHash !== expectedPrev) {
      return { valid: false, links: chain.length, reason: `Broken link at index ${i}.` };
    }
    const recomputed = sha256(`${link.previousHash ?? "genesis"}|${link.contentHash}|${documentId}`);
    if (recomputed !== link.chainHash) {
      return { valid: false, links: chain.length, reason: `Hash mismatch at index ${i}.` };
    }
  }
  return { valid: true, links: chain.length, reason: "Custody chain is intact." };
}

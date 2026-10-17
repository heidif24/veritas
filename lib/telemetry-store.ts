/**
 * Privacy-safe process telemetry.
 * Stores only timing and character counts — never keystroke or clipboard text.
 */

import { getDb } from "@/lib/db";
import type { CompositionOperation } from "@/lib/composition-health";

export type StoredTelemetry = {
  ops: CompositionOperation[];
  focusLosses: number;
  focusLossTimestamps: number[];
  updatedAt: string;
};

function ensureTable() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS composition_telemetry (
      document_id TEXT PRIMARY KEY,
      telemetry_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export function saveDocumentTelemetry(
  documentId: string,
  input: { ops?: CompositionOperation[]; focusLosses?: number; focusLossTimestamps?: number[] },
): StoredTelemetry {
  ensureTable();
  const existing = loadDocumentTelemetry(documentId);
  const ops = Array.isArray(input.ops) ? input.ops.slice(-800) : existing?.ops ?? [];
  const payload: StoredTelemetry = {
    ops: ops.map((o) => ({
      timestamp: Number(o.timestamp || Date.now()),
      kind: o.kind === "paste" || o.kind === "delete" ? o.kind : "type",
      chars: Math.max(0, Math.round(Number(o.chars || 0))),
    })),
    focusLosses: Number(input.focusLosses ?? existing?.focusLosses ?? 0) || 0,
    focusLossTimestamps: Array.isArray(input.focusLossTimestamps)
      ? input.focusLossTimestamps.map((t) => Number(t)).filter((t) => Number.isFinite(t)).slice(-40)
      : existing?.focusLossTimestamps ?? [],
    updatedAt: new Date().toISOString(),
  };
  getDb()
    .prepare(
      `INSERT INTO composition_telemetry (document_id, telemetry_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(document_id) DO UPDATE SET telemetry_json = excluded.telemetry_json, updated_at = excluded.updated_at`,
    )
    .run(documentId, JSON.stringify(payload), payload.updatedAt);

  try {
    getDb()
      .prepare(`UPDATE documents SET telemetry_json = ? WHERE id = ?`)
      .run(JSON.stringify({ ops: payload.ops, blurCount: payload.focusLosses, focusLossTimestamps: payload.focusLossTimestamps }), documentId);
  } catch {
    /* documents row may live only in the prisma schema */
  }

  return payload;
}

export function loadDocumentTelemetry(documentId: string): StoredTelemetry | null {
  ensureTable();
  const row = getDb()
    .prepare(`SELECT telemetry_json FROM composition_telemetry WHERE document_id = ?`)
    .get(documentId) as { telemetry_json?: string } | undefined;

  const raw = row?.telemetry_json;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<StoredTelemetry>;
      return {
        ops: Array.isArray(parsed.ops) ? parsed.ops : [],
        focusLosses: Number(parsed.focusLosses ?? 0) || 0,
        focusLossTimestamps: Array.isArray(parsed.focusLossTimestamps) ? parsed.focusLossTimestamps : [],
        updatedAt: String(parsed.updatedAt || ""),
      };
    } catch {
      /* fall through */
    }
  }

  try {
    const legacy = getDb().prepare(`SELECT telemetry_json FROM documents WHERE id = ?`).get(documentId) as
      | { telemetry_json?: string }
      | undefined;
    if (!legacy?.telemetry_json) return null;
    const tel = JSON.parse(legacy.telemetry_json) as {
      ops?: CompositionOperation[];
      blurCount?: number;
      focusLosses?: number;
      focusLossTimestamps?: number[];
    };
    return {
      ops: Array.isArray(tel.ops) ? tel.ops : [],
      focusLosses: Number(tel.blurCount ?? tel.focusLosses ?? 0) || 0,
      focusLossTimestamps: Array.isArray(tel.focusLossTimestamps) ? tel.focusLossTimestamps : [],
      updatedAt: "",
    };
  } catch {
    return null;
  }
}

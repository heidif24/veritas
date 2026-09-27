import { getDb } from "@/lib/db";
import { randomBytes } from "node:crypto";

/** Ensure billing tables exist (SQLite; swap for Firebase/Postgres in production). */
export function ensureBillingSchema() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      provider TEXT NOT NULL,
      provider_ref TEXT,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'usd',
      current_period_end TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS payment_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function createSubscription(input: {
  userId: string;
  planId: string;
  provider: "stripe" | "paypal" | "card_manual";
  providerRef?: string;
  amountCents: number;
  status?: string;
}) {
  ensureBillingSchema();
  const db = getDb();
  const id = randomBytes(16).toString("hex");
  db.prepare(
    `INSERT INTO subscriptions (id, user_id, plan_id, status, provider, provider_ref, amount_cents)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.userId,
    input.planId,
    input.status ?? "pending",
    input.provider,
    input.providerRef ?? null,
    input.amountCents,
  );
  return id;
}

export function activateSubscription(providerRef: string, provider: string) {
  ensureBillingSchema();
  const db = getDb();
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(
    `UPDATE subscriptions SET status = 'active', current_period_end = ?, updated_at = CURRENT_TIMESTAMP
     WHERE provider_ref = ? AND provider = ?`,
  ).run(periodEnd, providerRef, provider);
}

export function getActiveSubscription(userId: string) {
  ensureBillingSchema();
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(userId) as
    | {
        id: string;
        plan_id: string;
        status: string;
        provider: string;
        current_period_end: string | null;
      }
    | undefined;
}

export function recordPaymentEvent(provider: string, eventType: string, payload: unknown) {
  ensureBillingSchema();
  const db = getDb();
  const id = randomBytes(12).toString("hex");
  db.prepare(
    `INSERT INTO payment_events (id, provider, event_type, payload) VALUES (?, ?, ?, ?)`,
  ).run(id, provider, eventType, JSON.stringify(payload));
}

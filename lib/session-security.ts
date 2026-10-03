/**
 * Session security — single active login, IP/device capture, login trail.
 * Used for assignment integrity (detect writing from multiple locations/systems).
 */

import { createHash } from "node:crypto";
import {
  getDb,
  createSession,
  deleteSessionsForUser,
  recordLoginEvent,
  type SessionRow,
} from "@/lib/db";
import { clientIp } from "@/lib/security";
import { recordAudit } from "@/lib/audit";

export type ClientDeviceInfo = {
  ip: string;
  userAgent: string | null;
  deviceFingerprint: string | null;
};

export function extractDeviceInfo(request: Request): ClientDeviceInfo {
  const ip = clientIp(request);
  const userAgent = request.headers.get("user-agent") || null;
  const acceptLang = request.headers.get("accept-language") || "";
  const deviceFingerprint = userAgent
    ? createHash("sha256")
        .update(`${userAgent}|${acceptLang}`)
        .digest("hex")
        .slice(0, 16)
    : null;
  return { ip, userAgent, deviceFingerprint };
}

/**
 * Create an exclusive session for the user.
 * All previous sessions for this user are deleted (forced logout elsewhere).
 * IP + device snapshot is stored on the session and in login_events.
 */
export function createExclusiveSession(params: {
  userId: string;
  token: string;
  expiresAt: Date;
  ip: string;
  userAgent: string | null;
  deviceFingerprint: string | null;
  assignmentId?: string | null;
}): SessionRow | undefined {
  // 1. Invalidate every other session for this user
  deleteSessionsForUser(params.userId);

  // 2. Create the new exclusive session with device snapshot
  createSession(params.token, params.userId, params.expiresAt, {
    ipAddress: params.ip,
    userAgent: params.userAgent,
    deviceFingerprint: params.deviceFingerprint,
  });

  // 3. Permanent trail entry (survives session deletion)
  recordLoginEvent({
    userId: params.userId,
    ipAddress: params.ip,
    userAgent: params.userAgent,
    deviceFingerprint: params.deviceFingerprint,
    reason: "login",
    assignmentId: params.assignmentId ?? null,
  });

  try {
    recordAudit({
      action: "login",
      actorId: params.userId,
      metadata: {
        ip: params.ip,
        deviceFingerprint: params.deviceFingerprint,
        exclusive: true,
      },
    });
  } catch {
    /* non-fatal */
  }

  return getDb()
    .prepare("SELECT * FROM sessions WHERE token = ?")
    .get(params.token) as SessionRow | undefined;
}

export type DeviceTrailSummary = {
  totalLogins: number;
  distinctIpCount: number;
  distinctDeviceCount: number;
  ips: string[];
  devices: string[];
  timeline: Array<{
    id: string;
    ipAddress: string;
    userAgent: string | null;
    deviceFingerprint: string | null;
    reason: string;
    createdAt: string;
  }>;
  flags: {
    multipleIps: boolean;
    multipleDevices: boolean;
  };
};

/** Build the multi-IP / multi-device report for a user (optionally scoped later by assignment). */
export function getUserDeviceTrail(userId: string, limit = 100): DeviceTrailSummary {
  ensureLoginEventsTable();
  const rows = getDb()
    .prepare(
      `SELECT id, ip_address, user_agent, device_fingerprint, reason, created_at
       FROM login_events
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT ?`,
    )
    .all(userId, limit) as Array<{
    id: string;
    ip_address: string;
    user_agent: string | null;
    device_fingerprint: string | null;
    reason: string;
    created_at: string;
  }>;

  const ips = [...new Set(rows.map((r) => r.ip_address).filter(Boolean))];
  const devices = [
    ...new Set(rows.map((r) => r.device_fingerprint).filter((d): d is string => Boolean(d))),
  ];

  return {
    totalLogins: rows.length,
    distinctIpCount: ips.length,
    distinctDeviceCount: devices.length,
    ips,
    devices,
    timeline: rows.map((r) => ({
      id: r.id,
      ipAddress: r.ip_address,
      userAgent: r.user_agent,
      deviceFingerprint: r.device_fingerprint,
      reason: r.reason,
      createdAt: r.created_at,
    })),
    flags: {
      multipleIps: ips.length > 1,
      multipleDevices: devices.length > 1,
    },
  };
}

function ensureLoginEventsTable() {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS login_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      user_agent TEXT,
      device_fingerprint TEXT,
      reason TEXT NOT NULL DEFAULT 'login',
      assignment_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

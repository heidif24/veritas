/**
 * Multi-tenant branding for onboarded universities / institutions.
 * Additive: when no branding is set, the default Veritas chrome is used.
 * Never breaks existing unbranded or individual accounts.
 */

import { getDb } from "@/lib/db";

export type TenantBranding = {
  organizationId: string;
  displayName: string;
  shortName?: string | null;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor: string;
  accentColor: string;
  sidebarStyle: "dark" | "light" | "brand";
  customCss?: string | null;
  supportEmail?: string | null;
  portalTagline?: string | null;
  showPoweredBy: boolean;
};

const DEFAULT_PRIMARY = "#0e7490";
const DEFAULT_ACCENT = "#06b6d4";

function ensureTenantSettingsTable() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenant_settings (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL UNIQUE,
      branding_json TEXT,
      lti_config TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );
  `);
}

function cryptoId() {
  return `ts_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function parseBranding(raw: string | null | undefined, organizationId: string, fallbackName: string): TenantBranding {
  let parsed: Partial<TenantBranding> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw) as Partial<TenantBranding>;
    } catch {
      parsed = {};
    }
  }
  return {
    organizationId,
    displayName: parsed.displayName || fallbackName,
    shortName: parsed.shortName ?? null,
    logoUrl: parsed.logoUrl ?? null,
    logoDarkUrl: parsed.logoDarkUrl ?? null,
    faviconUrl: parsed.faviconUrl ?? null,
    primaryColor: parsed.primaryColor || DEFAULT_PRIMARY,
    accentColor: parsed.accentColor || DEFAULT_ACCENT,
    sidebarStyle: parsed.sidebarStyle === "light" || parsed.sidebarStyle === "brand" ? parsed.sidebarStyle : "dark",
    customCss: parsed.customCss ?? null,
    supportEmail: parsed.supportEmail ?? null,
    portalTagline: parsed.portalTagline ?? null,
    showPoweredBy: parsed.showPoweredBy !== false,
  };
}

/** Load branding for an organization. Returns sensible defaults when none configured. */
export function getTenantBranding(organizationId: string | null | undefined): TenantBranding | null {
  if (!organizationId) return null;
  ensureTenantSettingsTable();

  const org = getDb()
    .prepare(`SELECT id, name FROM organizations WHERE id = ?`)
    .get(organizationId) as { id: string; name: string } | undefined;
  if (!org) return null;

  const row = getDb()
    .prepare(`SELECT branding_json FROM tenant_settings WHERE organization_id = ?`)
    .get(organizationId) as { branding_json: string | null } | undefined;

  return parseBranding(row?.branding_json, organizationId, org.name);
}

/** Upsert branding for an organization (admin / institutional admin only). */
export function setTenantBranding(
  organizationId: string,
  branding: Partial<Omit<TenantBranding, "organizationId">>,
): TenantBranding {
  ensureTenantSettingsTable();

  const org = getDb()
    .prepare(`SELECT id, name FROM organizations WHERE id = ?`)
    .get(organizationId) as { id: string; name: string } | undefined;
  if (!org) throw new Error("Organization not found");

  const existing = getTenantBranding(organizationId);
  const merged: TenantBranding = {
    organizationId,
    displayName: branding.displayName ?? existing?.displayName ?? org.name,
    shortName: branding.shortName !== undefined ? branding.shortName : existing?.shortName ?? null,
    logoUrl: branding.logoUrl !== undefined ? branding.logoUrl : existing?.logoUrl ?? null,
    logoDarkUrl: branding.logoDarkUrl !== undefined ? branding.logoDarkUrl : existing?.logoDarkUrl ?? null,
    faviconUrl: branding.faviconUrl !== undefined ? branding.faviconUrl : existing?.faviconUrl ?? null,
    primaryColor: branding.primaryColor ?? existing?.primaryColor ?? DEFAULT_PRIMARY,
    accentColor: branding.accentColor ?? existing?.accentColor ?? DEFAULT_ACCENT,
    sidebarStyle: branding.sidebarStyle ?? existing?.sidebarStyle ?? "dark",
    customCss: branding.customCss !== undefined ? branding.customCss : existing?.customCss ?? null,
    supportEmail: branding.supportEmail !== undefined ? branding.supportEmail : existing?.supportEmail ?? null,
    portalTagline: branding.portalTagline !== undefined ? branding.portalTagline : existing?.portalTagline ?? null,
    showPoweredBy: branding.showPoweredBy ?? existing?.showPoweredBy ?? true,
  };

  const json = JSON.stringify(merged);
  const current = getDb()
    .prepare(`SELECT id FROM tenant_settings WHERE organization_id = ?`)
    .get(organizationId) as { id: string } | undefined;

  if (current) {
    getDb()
      .prepare(`UPDATE tenant_settings SET branding_json = ? WHERE organization_id = ?`)
      .run(json, organizationId);
  } else {
    getDb()
      .prepare(
        `INSERT INTO tenant_settings (id, organization_id, branding_json, created_at) VALUES (?, ?, ?, ?)`,
      )
      .run(cryptoId(), organizationId, json, new Date().toISOString());
  }

  return merged;
}

/** CSS custom properties string for injecting into a layout. */
export function brandingCssVars(branding: TenantBranding | null): string {
  if (!branding) return "";
  return [
    `--tenant-primary: ${branding.primaryColor};`,
    `--tenant-accent: ${branding.accentColor};`,
  ].join(" ");
}

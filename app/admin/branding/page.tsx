"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell, ADMIN_NAV } from "@/app/components/role-shell";

type Branding = {
  organizationId: string;
  displayName: string;
  shortName?: string | null;
  logoUrl?: string | null;
  primaryColor: string;
  accentColor: string;
  portalTagline?: string | null;
  supportEmail?: string | null;
  showPoweredBy: boolean;
};

export default function AdminBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [shortName, setShortName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0e7490");
  const [accentColor, setAccentColor] = useState("#06b6d4");
  const [portalTagline, setPortalTagline] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [showPoweredBy, setShowPoweredBy] = useState(true);

  useEffect(() => {
    void fetch("/api/tenant/branding")
      .then((r) => r.json())
      .then((data) => {
        if (data.branding) {
          const b = data.branding as Branding;
          setDisplayName(b.displayName || "");
          setShortName(b.shortName || "");
          setLogoUrl(b.logoUrl || "");
          setPrimaryColor(b.primaryColor || "#0e7490");
          setAccentColor(b.accentColor || "#06b6d4");
          setPortalTagline(b.portalTagline || "");
          setSupportEmail(b.supportEmail || "");
          setShowPoweredBy(b.showPoweredBy !== false);
        }
      })
      .catch(() => setError("Could not load branding settings."))
      .finally(() => setLoading(false));
  }, []);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/branding/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      if (data.logoUrl) {
        setLogoUrl(data.logoUrl);
        setMessage("Logo uploaded. Click Save branding to apply.");
      }
    } catch {
      setError("Upload network error");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/tenant/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          shortName: shortName || null,
          logoUrl: logoUrl || null,
          primaryColor,
          accentColor,
          portalTagline: portalTagline || null,
          supportEmail: supportEmail || null,
          showPoweredBy,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Save failed");
      else
        setMessage(
          "Branding saved. Students and lecturers in this institution will see the updated portal identity after refresh.",
        );
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RoleShell roleLabel="Administrator" title="Institution branding" nav={ADMIN_NAV}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-600">
            When your university is onboarded, students and lecturers see{" "}
            <strong>your institution's name and logo</strong> in the portal after sign-in.
            This builds trust and makes Veritas feel like your campus system.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Display name</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. University of Lagos"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Short name (sidebar)</span>
              <input
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. UNILAG"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Logo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm"
              />
              <input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Or paste a public logo URL"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              {logoUrl ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Logo preview" className="h-10 max-w-[160px] object-contain" />
                  <span className="text-xs text-slate-400">{uploading ? "Uploading…" : "Preview"}</span>
                </div>
              ) : null}
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Primary colour</span>
                <div className="mt-1 flex items-center gap-2">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-slate-200" />
                  <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Accent colour</span>
                <div className="mt-1 flex items-center gap-2">
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-slate-200" />
                  <input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Portal tagline</span>
              <input
                value={portalTagline}
                onChange={(e) => setPortalTagline(e.target.value)}
                placeholder="e.g. Academic integrity for every assignment"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Support email</span>
              <input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="integrity@university.edu"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={showPoweredBy} onChange={(e) => setShowPoweredBy(e.target.checked)} />
              Show "Powered by Veritas" in the footer
            </label>

            {message ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
            ) : null}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="rounded-xl bg-[#167451] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#125c41] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save branding"}
              </button>
              <Link href="/admin" className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </Link>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}

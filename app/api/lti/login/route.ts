import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const iss = url.searchParams.get("iss");
  const loginHint = url.searchParams.get("login_hint");
  const targetLinkUri = url.searchParams.get("target_link_uri") || `${url.origin}/api/lti/launch`;
  const clientId = url.searchParams.get("client_id");
  const ltiMessageHint = url.searchParams.get("lti_message_hint");
  const deploymentId = url.searchParams.get("lti_deployment_id");

  if (!iss || !clientId) {
    return NextResponse.json({ error: "iss and client_id required" }, { status: 400 });
  }

  const db = getDb();
  const settings = db.prepare("SELECT lti_config FROM tenant_settings LIMIT 1").get() as { lti_config?: string } | undefined;
  let authEndpoint = `${iss.replace(/\/$/, "")}/mod/lti/auth.php`;
  try {
    const cfg = JSON.parse(settings?.lti_config || "{}");
    if (cfg.auth_login_url) authEndpoint = cfg.auth_login_url;
  } catch { /* */ }

  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();
  db.exec(`CREATE TABLE IF NOT EXISTS lti_states (state TEXT PRIMARY KEY, nonce TEXT, iss TEXT, client_id TEXT, created_at TEXT)`);
  db.prepare(`INSERT OR REPLACE INTO lti_states (state, nonce, iss, client_id, created_at) VALUES (?, ?, ?, ?, ?)`).run(
    state, nonce, iss, clientId, new Date().toISOString(),
  );

  const redirect = new URL(authEndpoint);
  redirect.searchParams.set("scope", "openid");
  redirect.searchParams.set("response_type", "id_token");
  redirect.searchParams.set("client_id", clientId);
  redirect.searchParams.set("redirect_uri", targetLinkUri);
  redirect.searchParams.set("login_hint", loginHint || "");
  redirect.searchParams.set("state", state);
  redirect.searchParams.set("response_mode", "form_post");
  redirect.searchParams.set("nonce", nonce);
  redirect.searchParams.set("prompt", "none");
  if (ltiMessageHint) redirect.searchParams.set("lti_message_hint", ltiMessageHint);
  if (deploymentId) redirect.searchParams.set("lti_deployment_id", deploymentId);

  return NextResponse.redirect(redirect.toString());
}

export async function POST(request: Request) {
  return GET(request);
}

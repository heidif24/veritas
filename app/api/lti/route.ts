import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * LTI Advantage scaffold — institutions configure tool URLs here.
 * Full OIDC login + deep linking requires per-tenant keys in tenant_settings.lti_config.
 */
export async function GET() {
  return NextResponse.json({
    name: "Veritas LTI Advantage",
    version: "1.3.0-scaffold",
    endpoints: {
      login: "/api/lti/login",
      launch: "/api/lti/launch",
      jwks: "/api/lti/jwks",
    },
    status: "scaffold",
    message:
      "LTI 1.3 scaffolding is available. Configure platform client_id, deployment_id, and keyset URL in tenant LTI settings to enable Canvas/Moodle/Blackboard launch.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "lti_not_fully_configured",
      message: "Complete OIDC login requires tenant LTI keys. Use the admin tenant settings to supply platform credentials.",
    },
    { status: 501 },
  );
}

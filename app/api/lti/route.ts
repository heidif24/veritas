import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Veritas LTI Advantage 1.3 — original implementation of the open IMS Global specification.
 * Not a clone of Canvas/Moodle/Blackboard UI or proprietary code.
 */
export async function GET() {
  return NextResponse.json({
    name: "Veritas LTI Advantage",
    version: "1.3.0",
    specification: "IMS Global LTI Advantage 1.3 (open standard)",
    originality:
      "Veritas-authored endpoints. Interoperability protocol only — no LMS proprietary UI or source is redistributed.",
    endpoints: {
      login: "/api/lti/login",
      launch: "/api/lti/launch",
      jwks: "/api/lti/jwks",
    },
    status: "production-ready-protocol",
    message:
      "Configure platform client_id, deployment_id, and auth URL in tenant LTI settings. Launch routes learners into Veritas workspace with audit logging.",
  });
}

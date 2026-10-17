import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAssignment } from "@/lib/assignments";
import { getAttemptInfo } from "@/lib/submission-policy";
import { getDraftForAssignment, linkAssignmentDocument } from "@/lib/assignment-link";

export const runtime = "nodejs";

/** One writing document per student per assignment, reused across the 3 attempts. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: assignmentId } = await params;
    const assignment = getAssignment(assignmentId);
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    const attemptInfo = getAttemptInfo(assignmentId, user.id);
    const existing = getDraftForAssignment(assignmentId, user.id);
    if (existing) {
      const doc = await prisma.document.findUnique({ where: { id: existing.documentId } });
      if (doc) {
        return NextResponse.json({ documentId: doc.id, attemptInfo, reused: true });
      }
    }

    if (!attemptInfo.canSubmit) {
      return NextResponse.json({ error: attemptInfo.reason || "This assignment is closed.", attemptInfo }, { status: 403 });
    }

    const doc = await prisma.document.create({
      data: {
        title: assignment.title || "Assignment",
        content: "<p></p>",
        status: "draft",
        documentType: "essay",
        ownerId: user.id,
        organizationId: user.organizationId ?? null,
      },
    });
    if (!doc?.id) return NextResponse.json({ error: "Could not open a draft" }, { status: 500 });
    linkAssignmentDocument({ documentId: doc.id, assignmentId, userId: user.id });
    return NextResponse.json({ documentId: doc.id, attemptInfo, reused: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

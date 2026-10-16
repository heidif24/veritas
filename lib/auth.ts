import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  organizationId?: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("veritas_session")?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || !session.user || session.expiresAt < new Date()) {
    return null;
  }

  const role = session.user.role as string;
  // Legacy PUBLISHER / TUTOR rows (if any) are treated as STUDENT for access.
  const normalizedRole =
    role === "ADMIN" || role === "INSTRUCTOR" || role === "STUDENT"
      ? (role as AuthUser["role"])
      : "STUDENT";

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: normalizedRole,
    organizationId: session.user.organizationId,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(roles: Array<AuthUser["role"]>) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

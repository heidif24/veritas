import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "veritas-labs" },
    update: {},
    create: {
      name: "Veritas Labs",
      slug: "veritas-labs",
    },
  });

  const adminHash = await bcrypt.hash("admin123", 10);
  const instructorHash = await bcrypt.hash("instructor123", 10);
  const studentHash = await bcrypt.hash("student123", 10);

  await prisma.user.upsert({
    where: { email: "admin@veritas.io" },
    update: { passwordHash: adminHash, role: "ADMIN", organizationId: organization.id },
    create: {
      email: "admin@veritas.io",
      name: "Avery Stone",
      passwordHash: adminHash,
      role: "ADMIN",
      organizationId: organization.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "instructor@veritas.io" },
    update: { passwordHash: instructorHash, role: "INSTRUCTOR", organizationId: organization.id },
    create: {
      email: "instructor@veritas.io",
      name: "Dr. Nia Ross",
      passwordHash: instructorHash,
      role: "INSTRUCTOR",
      organizationId: organization.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "student@veritas.io" },
    update: { passwordHash: studentHash, role: "STUDENT", organizationId: organization.id },
    create: {
      email: "student@veritas.io",
      name: "Milo Hart",
      passwordHash: studentHash,
      role: "STUDENT",
      organizationId: organization.id,
    },
  });

  const student = await prisma.user.findUnique({ where: { email: "student@veritas.io" } });

  if (student) {
    await prisma.document.upsert({
      where: { id: "demo-document" },
      update: {
        title: "Existentialism and Choice",
        content: "The authentic writer is not defined by the speed of output but by the discipline of revision. A living argument is built under pressure, uncertainty, and the willingness to admit complexity.",
        status: "submitted",
        ownerId: student.id,
        organizationId: organization.id,
        sealedHash: "demo-sealed-hash",
        integrityStatus: "verified",
      },
      create: {
        id: "demo-document",
        title: "Existentialism and Choice",
        content: "The authentic writer is not defined by the speed of output but by the discipline of revision. A living argument is built under pressure, uncertainty, and the willingness to admit complexity.",
        status: "submitted",
        ownerId: student.id,
        organizationId: organization.id,
        sealedHash: "demo-sealed-hash",
        integrityStatus: "verified",
      },
    });
  }

  console.log("Seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

import bcrypt from "bcryptjs";
import { createDocument, createOrganization, createUser } from "@/lib/db";

async function main() {
  const organization = createOrganization("Veritas Labs", "veritas-labs");

  const admin = createUser({
    email: "admin@veritas.io",
    name: "Avery Stone",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "ADMIN",
    organizationId: organization.id,
  });

  const instructor = createUser({
    email: "instructor@veritas.io",
    name: "Dr. Nia Ross",
    passwordHash: await bcrypt.hash("instructor123", 10),
    role: "INSTRUCTOR",
    organizationId: organization.id,
  });

  const student = createUser({
    email: "student@veritas.io",
    name: "Milo Hart",
    passwordHash: await bcrypt.hash("student123", 10),
    role: "STUDENT",
    organizationId: organization.id,
  });

  const document = createDocument({
    title: "Existentialism and Choice",
    content: "The authentic writer is not defined by the speed of output but by the discipline of revision. A living argument is built under pressure, uncertainty, and the willingness to admit complexity.",
    status: "submitted",
    documentType: "essay",
    ownerId: student.id,
    organizationId: organization.id,
  });

  console.log({
    admin: admin.email,
    instructor: instructor.email,
    student: student.email,
    organization: organization.name,
    document: document.id,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

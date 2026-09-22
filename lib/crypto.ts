import crypto from "node:crypto";

type SealDocument = {
  title: string;
  content: string;
  ownerId: string;
  organizationId?: string | null;
  status?: string;
  telemetry?: Record<string, unknown>;
};

const signingKeys = crypto.generateKeyPairSync("ed25519");

function canonicalize(value: unknown) {
  return JSON.stringify(value);
}

function buildSealPayload(document: SealDocument) {
  return {
    title: document.title,
    content: document.content,
    ownerId: document.ownerId,
    organizationId: document.organizationId ?? null,
    status: document.status ?? "draft",
    telemetry: document.telemetry ?? {},
    version: "veritas-v1",
  };
}

function hashSealPayload(payload: ReturnType<typeof buildSealPayload>) {
  return crypto.createHash("sha256").update(canonicalize(payload)).digest("hex");
}

function getPrivateKey() {
  const configuredKey = process.env.VERITAS_PRIVATE_KEY;
  if (configuredKey) return crypto.createPrivateKey(configuredKey);
  if (process.env.NODE_ENV === "production") {
    throw new Error("VERITAS_PRIVATE_KEY must be configured in production");
  }
  return signingKeys.privateKey;
}

export function createDocumentSeal(document: SealDocument) {
  const payload = buildSealPayload(document);
  const hash = hashSealPayload(payload);
  const signature = crypto.sign(null, Buffer.from(hash, "hex"), getPrivateKey()).toString("base64");
  return { hash, signature, payload };
}

export function verifyDocumentSeal(input: SealDocument & { sealedHash?: string | null; signature?: string | null }) {
  const payload = buildSealPayload({
    title: input.title,
    content: input.content,
    ownerId: input.ownerId,
    organizationId: input.organizationId,
    status: input.status,
    telemetry: input.telemetry,
  });
  const hash = hashSealPayload(payload);

  if (!input.sealedHash || !input.signature) {
    return { valid: false, reason: "No complete seal present" };
  }

  const configuredPublicKey = process.env.VERITAS_PUBLIC_KEY;
  if (!configuredPublicKey && process.env.NODE_ENV === "production") {
    return { valid: false, reason: "VERITAS_PUBLIC_KEY must be configured in production" };
  }
  const publicKey = configuredPublicKey ? crypto.createPublicKey(configuredPublicKey) : signingKeys.publicKey;
  const signatureValid = crypto.verify(
    null,
    Buffer.from(input.sealedHash, "hex"),
    publicKey,
    Buffer.from(input.signature, "base64"),
  );

  return {
    valid: hash === input.sealedHash && signatureValid,
    hash,
    reason: hash === input.sealedHash && signatureValid
      ? "Document hash and Ed25519 signature match the recorded seal"
      : "Document integrity broken post-export",
  };
}

export type PlagiarismProviderMode = "internal" | "external";

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const plagiarismConfig = {
  mode: (process.env.VERITAS_SIMILARITY_PROVIDER ?? "internal") as PlagiarismProviderMode,
  externalUrl: process.env.VERITAS_SIMILARITY_PROVIDER_URL ?? "",
  externalApiKey: process.env.VERITAS_SIMILARITY_PROVIDER_API_KEY ?? "",
  externalTimeoutMs: readNumber(process.env.VERITAS_SIMILARITY_TIMEOUT_MS, 8000),
  similarityThreshold: Math.min(100, Math.max(0, readNumber(process.env.VERITAS_SIMILARITY_THRESHOLD, 20))),
  aiEnabled: process.env.VERITAS_AI_PROVIDER_ENABLED === "true",
  aiUrl: process.env.VERITAS_AI_PROVIDER_URL ?? "",
  aiApiKey: process.env.VERITAS_AI_PROVIDER_API_KEY ?? "",
  retentionDays: Math.max(1, readNumber(process.env.VERITAS_PLAGIARISM_RETENTION_DAYS, 365)),
};

export function assertProductionProviderConfiguration() {
  if (process.env.NODE_ENV !== "production") return;

  if (plagiarismConfig.mode === "external" && (!plagiarismConfig.externalUrl || !plagiarismConfig.externalApiKey)) {
    throw new Error("External similarity provider is selected but its URL or API key is missing");
  }

  if (plagiarismConfig.aiEnabled && (!plagiarismConfig.aiUrl || !plagiarismConfig.aiApiKey)) {
    throw new Error("AI provider is enabled but its URL or API key is missing");
  }
}

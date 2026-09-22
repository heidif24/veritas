export type PlagiarismMatch = {
  startOffset: number;
  endOffset: number;
  matchedSourceUrl: string;
  sourceTitle?: string;
  similarityPercentage: number;
  snippet: string;
};

export type PlagiarismCheckResult = {
  overallSimilarityScore: number;
  matchedSegments: PlagiarismMatch[];
  checkedWords: number;
};

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u2019]/g, "'")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(value: string) {
  return normalizeText(value).split(/\s+/).filter(Boolean);
}

export function hashSequence(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export function buildWindowHashes(value: string, windowSize = 5) {
  const words = tokenize(value);
  if (words.length === 0) {
    return [] as string[];
  }

  const windows: string[] = [];
  const limit = Math.max(1, words.length - windowSize + 1);

  for (let index = 0; index < limit; index += 1) {
    const window = words.slice(index, index + windowSize).join(" ");
    windows.push(hashSequence(window));
  }

  return windows;
}

export async function buildClientHashPayload(value: string, windowSize = 5) {
  await new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve());
      return;
    }

    setTimeout(resolve, 0);
  });

  return {
    hashes: buildWindowHashes(value, windowSize),
    windowSize,
  };
}

export function extractSnippet(text: string, start: number, end: number) {
  const safeStart = Math.max(0, start);
  const safeEnd = Math.min(text.length, Math.max(safeStart + 32, end));
  const snippet = text.slice(safeStart, safeEnd).replace(/\s+/g, " ").trim();
  return snippet || text.slice(0, 160).replace(/\s+/g, " ").trim();
}

export function createMatchRecord(
  text: string,
  startOffset: number,
  endOffset: number,
  similarityPercentage: number,
  matchedSourceUrl: string,
) {
  return {
    startOffset,
    endOffset,
    matchedSourceUrl,
    similarityPercentage,
    snippet: extractSnippet(text, startOffset, endOffset),
  } satisfies PlagiarismMatch;
}


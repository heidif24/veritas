import { z } from "zod";
import { buildWindowHashes, createMatchRecord, normalizeText, tokenize, type PlagiarismCheckResult, type PlagiarismMatch } from "./chunker";

export type IndexedSubmission = {
  id: string;
  title: string;
  content: string;
};

export type SimilarityProvider = {
  name: string;
  check(text: string, submissions: IndexedSubmission[]): Promise<PlagiarismCheckResult>;
};

function windowCount(text: string) {
  return Math.max(1, tokenize(text).length - 5 + 1);
}

function findMatchingOffset(text: string, source: string) {
  const sourceWords = tokenize(source);
  if (sourceWords.length < 5) return null;

  const sourceWindows = buildWindowHashes(source, 5);
  const candidateWindows = buildWindowHashes(text, 5);
  const matchingSourceIndex = sourceWindows.findIndex((hash) => candidateWindows.includes(hash));
  if (matchingSourceIndex < 0) return null;

  const matchingHash = sourceWindows[matchingSourceIndex];
  const matchingCandidateIndex = candidateWindows.indexOf(matchingHash);

  const normalizedSource = normalizeText(source);
  const normalizedWindow = sourceWords.slice(matchingSourceIndex, matchingSourceIndex + 5).join(" ");
  const normalizedOffset = normalizedSource.indexOf(normalizedWindow);
  if (normalizedOffset < 0) return null;

  const textWords = tokenize(text);
  const candidateWindow = textWords.slice(matchingCandidateIndex, matchingCandidateIndex + 5).join(" ");
  const candidateOffset = text.toLowerCase().indexOf(candidateWindow.toLowerCase());
  return {
    start: candidateOffset >= 0 ? candidateOffset : 0,
    end: candidateOffset >= 0 ? candidateOffset + Math.min(text.length, normalizedWindow.length + 16) : Math.min(text.length, 160),
  };
}

export const institutionalSimilarityProvider: SimilarityProvider = {
  name: "institutional-submission-index",
  async check(text, submissions) {
    const checkedWords = tokenize(text).length;
    if (!checkedWords || !submissions.length) {
      return { overallSimilarityScore: 0, matchedSegments: [], checkedWords };
    }

    const candidateHashes = new Set(buildWindowHashes(text, 5));
    const matches: PlagiarismMatch[] = [];

    for (const submission of submissions) {
      const sourceHashes = new Set(buildWindowHashes(submission.content, 5));
      const sharedWindows = [...candidateHashes].filter((hash) => sourceHashes.has(hash)).length;
      if (!sharedWindows) continue;

      const score = Math.min(100, Math.round((sharedWindows / Math.min(candidateHashes.size, sourceHashes.size)) * 100));
      const offsets = findMatchingOffset(text, submission.content);
      if (!offsets) continue;

      matches.push({
        ...createMatchRecord(text, offsets.start, offsets.end, score, `internal://submission/${submission.id}`),
        sourceTitle: submission.title,
      });
    }

    const overallSimilarityScore = matches.length
      ? Math.min(100, Math.round(matches.reduce((total, match) => total + match.similarityPercentage, 0) / matches.length))
      : 0;

    return {
      overallSimilarityScore,
      matchedSegments: matches.sort((a, b) => b.similarityPercentage - a.similarityPercentage).slice(0, 10),
      checkedWords,
    };
  },
};

const externalSimilarityResponse = z.object({
  overallSimilarityScore: z.number().min(0).max(100),
  matchedSegments: z.array(z.object({
    startOffset: z.number().int().min(0),
    endOffset: z.number().int().min(0),
    matchedSourceUrl: z.string().url(),
    similarityPercentage: z.number().min(0).max(100),
    snippet: z.string().max(2_000),
    sourceTitle: z.string().max(500).optional(),
  })).max(100),
  checkedWords: z.number().int().min(0),
});

export function getSimilarityProvider(): SimilarityProvider {
  const endpoint = process.env.VERITAS_SIMILARITY_PROVIDER_URL;
  const apiKey = process.env.VERITAS_SIMILARITY_PROVIDER_KEY;
  if (!endpoint || !apiKey) return institutionalSimilarityProvider;

  return {
    name: "licensed-external-provider",
    async check(text, submissions) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8_000);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ text, submissions: submissions.map(({ id, title }) => ({ id, title })) }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Similarity provider returned ${response.status}`);
        return externalSimilarityResponse.parse(await response.json());
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export function getProviderCorpusStatus(submissions: IndexedSubmission[]) {
  return {
    provider: institutionalSimilarityProvider.name,
    indexedSubmissions: submissions.length,
    indexedWords: submissions.reduce((total, submission) => total + windowCount(submission.content), 0),
  };
}

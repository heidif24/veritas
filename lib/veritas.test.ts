import assert from "node:assert/strict";
import test from "node:test";

import { scoreCompositionHealth } from "./composition-health";
import { stripHtml } from "./editor-utils";
import { computeHealthScore, computeNGramSimilarity, createVeritasBundle, verifyVeritasBundle } from "./veritas";

test("computeHealthScore produces a stable score and risk label", () => {
  const result = computeHealthScore("This is a normal essay with several sentences and clear academic wording.", [
    { type: "key", timestamp: 10 },
    { type: "key", timestamp: 20 },
    { type: "key", timestamp: 50 },
    { type: "key", timestamp: 90 },
    { type: "paste", timestamp: 120 },
  ]);

  assert.ok(result.organicScore >= 0 && result.organicScore <= 1);
  assert.match(result.riskLabel, /organic|mixed|high-paste|ai-risk/);
  assert.ok(typeof result.notes === "string");
});

test("computeNGramSimilarity catches overlap", () => {
  const similarity = computeNGramSimilarity(
    "The university requires rigorous academic integrity and careful review before submission.",
    ["The university requires rigorous academic integrity and careful review before submission."],
  );

  assert.ok(similarity.score > 0.4);
  assert.ok(similarity.matches.length >= 1);
});

test("stripHtml removes markup while preserving readable content", () => {
  const markup = '<h1>Choice <strong>matters</strong></h1><p>Writers need <span style="background: yellow">proof</span> before publication.</p>';

  const plain = stripHtml(markup);

  assert.ok(plain.includes("Choice matters"));
  assert.ok(plain.includes("proof before publication"));
  assert.equal(plain.includes("<"), false);
});

test("scoreCompositionHealth keeps behavioural risk in percentage range", () => {
  const health = scoreCompositionHealth(
    [
      { timestamp: 10, kind: "type", chars: 30 },
      { timestamp: 30, kind: "type", chars: 30 },
      { timestamp: 50, kind: "type", chars: 30 },
      { timestamp: 70, kind: "type", chars: 30 },
      { timestamp: 90, kind: "type", chars: 30 },
      { timestamp: 100, kind: "paste", chars: 120 },
    ],
    2,
  );

  assert.ok(health.aiRiskScore >= 0 && health.aiRiskScore <= 100);
  assert.match(health.aiRiskLabel, /Low|Moderate|High|Critical/);
  assert.ok(health.notes.length >= 1);
});

test("veritas bundle is signed and verified correctly", () => {
  const keyPair = generateKeyPair();
  const bundle = createVeritasBundle({
    authorId: "student-123",
    title: "Research essay",
    text: "A genuine essay with original reasoning.",
    ops: [{ type: "key", key: "A", timestamp: 10 }],
    telemetry: { startAt: "2026-01-01T00:00:00.000Z", lastInputAt: "2026-01-01T00:00:02.000Z" },
    assignmentId: "assignment-1",
    sealedAt: "2026-01-01T00:00:03.000Z",
  }, keyPair);

  const verification = verifyVeritasBundle(bundle);

  assert.equal(verification.valid, true);
  assert.equal(verification.reason, "Bundle signature and hash are valid");

  const tampered = { ...bundle, payload: { ...bundle.payload, text: "tampered" } };
  const invalid = verifyVeritasBundle(tampered);
  assert.equal(invalid.valid, false);
});

function generateKeyPair() {
  return require("node:crypto").generateKeyPairSync("ed25519");
}

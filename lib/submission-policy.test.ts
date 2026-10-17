import assert from "node:assert/strict";
import test from "node:test";
import { capAttempts, folderRelease } from "./submission-policy";

test("students get at most 3 submission attempts", () => {
  assert.equal(capAttempts(undefined), 3);
  assert.equal(capAttempts(null), 3);
  assert.equal(capAttempts(1), 1);
  assert.equal(capAttempts(3), 3);
  assert.equal(capAttempts(10), 3);
});

test("lecturer folder stays closed until the deadline, then opens", () => {
  const future = new Date(Date.now() + 60_000).toISOString();
  const past = new Date(Date.now() - 60_000).toISOString();
  assert.equal(folderRelease(null).released, false);
  assert.equal(folderRelease(future).released, false);
  assert.equal(folderRelease(past).released, true);
});

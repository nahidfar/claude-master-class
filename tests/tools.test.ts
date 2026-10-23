import { test } from "node:test";
import assert from "node:assert/strict";
import { tools, validateToolInput } from "../src/lib/tools.ts";

test("exactly three private exercises are supplied", () => {
  assert.deepEqual(tools.map((tool) => tool.id), ["fit-analyzer", "cover-letter", "career-plan"]);
});

test("JD boundaries and invalid input types are checked", () => {
  for (const bad of [null, [], {}, { jobDescription: 4 }, { jobDescription: " " }, { jobDescription: "a".repeat(5001) }]) {
    assert.equal(validateToolInput(bad).ok, false);
  }
  assert.equal(validateToolInput({ jobDescription: "a".repeat(5000) }).ok, true);
});

test("tool defaults and selected modes are explicit", () => {
  assert.deepEqual(validateToolInput({ jobDescription: " SQL role " }), {
    ok: true, value: { jobDescription: "SQL role", tone: "formal", mode: "interview", weeklyHours: 5 },
  });
  assert.equal(validateToolInput({ jobDescription: "Role", mode: "study", weeklyHours: 5, tone: "technical" }).ok, true);
});

test("unsupported options and out-of-budget inputs fail validation", () => {
  for (const extra of [{ tone: "invented" }, { mode: "other" }, { weeklyHours: 0 }, { weeklyHours: 41 }, { weeklyHours: "5" }, { weeklyHours: NaN }]) {
    assert.equal(validateToolInput({ jobDescription: "Role", ...extra }).ok, false);
  }
});

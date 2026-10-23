import { test } from "node:test";
import assert from "node:assert/strict";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { ApiError, FinishReason } from "@google/genai";
import { callAnthropic } from "../src/lib/providers/anthropic.ts";
import { callGemini } from "../src/lib/providers/gemini.ts";
import { callOpenAI, callOpenAICompatible } from "../src/lib/providers/openai.ts";
import { ModelError, type ModelConfig } from "../src/lib/providers/shared.ts";

const request = { system: "system", prompt: "prompt", schema: { type: "object" } };
const config = (provider: ModelConfig["provider"], extra: Partial<ModelConfig> = {}): ModelConfig => ({ provider, model: "test-model", apiKey: "k", ...extra });

// A fake SDK client: records what was sent, then returns or throws.
function fake(path: string[], result: unknown | (() => never)) {
  const sent: unknown[] = [];
  const method = async (params: unknown) => {
    sent.push(params);
    if (typeof result === "function") return (result as () => never)();
    return result;
  };
  const client = path.reduceRight<unknown>((inner, key) => ({ [key]: inner }), method);
  return { sent, client: client as never };
}

const thrower = (error: Error) => () => { throw error; };

async function rejectsWith(promise: Promise<unknown>, status: number, message: RegExp) {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof ModelError, String(error));
    assert.equal(error.status, status);
    assert.match(error.message, message);
    return true;
  });
}

test("OpenAI sends a strict JSON schema, adds reasoning effort only when set, and returns the text", async () => {
  const ok = { output: [{ type: "message", content: [{ type: "output_text", text: "{}" }] }], output_text: "{}", status: "completed", incomplete_details: null };
  const plain = fake(["responses", "create"], ok);
  assert.equal(await callOpenAI(config("openai"), request, plain.client), "{}");
  assert.deepEqual(plain.sent[0], {
    model: "test-model", max_output_tokens: 16000, instructions: "system", input: "prompt",
    text: { format: { type: "json_schema", name: "result", schema: { type: "object" }, strict: true } },
  });
  const effort = fake(["responses", "create"], ok);
  await callOpenAI(config("openai", { reasoningEffort: "low" }), request, effort.client);
  assert.deepEqual((effort.sent[0] as { reasoning: unknown }).reasoning, { effort: "low" });
});

test("OpenAI refusals, filtered and cut-off responses are failures", async () => {
  const response = (extra: object) => fake(["responses", "create"], { output: [], output_text: "", status: "completed", incomplete_details: null, ...extra }).client;
  await rejectsWith(callOpenAI(config("openai"), request, response({ output: [{ type: "message", content: [{ type: "refusal", refusal: "no" }] }] })), 502, /declined/);
  await rejectsWith(callOpenAI(config("openai"), request, response({ status: "incomplete", incomplete_details: { reason: "content_filter" } })), 502, /declined/);
  await rejectsWith(callOpenAI(config("openai"), request, response({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" } })), 502, /cut off/);
});

test("OpenAI and OpenAI-compatible errors map to the shared messages", async () => {
  const cases: [Error, number, RegExp][] = [
    [OpenAI.APIError.generate(429, { type: "error" }, "x", new Headers({ "retry-after": "20" })), 429, /rate limiting/],
    [OpenAI.APIError.generate(401, { type: "error" }, "x", new Headers()), 502, /AI_API_KEY/],
    [OpenAI.APIError.generate(404, { type: "error" }, "x", new Headers()), 502, /AI_MODEL/],
    [OpenAI.APIError.generate(500, { type: "error" }, "x", new Headers()), 502, /error \(500\)/],
    [new OpenAI.APIConnectionTimeoutError(), 504, /longer than 3 minutes/],
    [new OpenAI.APIConnectionError({ message: "offline" }), 502, /Could not reach/],
  ];
  for (const [error, status, message] of cases) {
    await rejectsWith(callOpenAI(config("openai"), request, fake(["responses", "create"], thrower(error)).client), status, message);
    await rejectsWith(callOpenAICompatible(config("openai-compatible"), request, fake(["chat", "completions", "create"], thrower(error)).client), status, message);
  }
  await assert.rejects(callOpenAI(config("openai"), request, fake(["responses", "create"], thrower(OpenAI.APIError.generate(429, { type: "error" }, "x", new Headers({ "retry-after": "20" })))).client),
    (error: unknown) => error instanceof ModelError && error.retryAfter === "20");
});

test("OpenAI-compatible sends chat messages with a JSON schema and checks the finish reason", async () => {
  const completion = (choice: object) => ({ choices: [{ message: { content: "{}", refusal: null }, finish_reason: "stop", ...choice }] });
  const ok = fake(["chat", "completions", "create"], completion({}));
  assert.equal(await callOpenAICompatible(config("openai-compatible", { baseURL: "https://x" }), request, ok.client), "{}");
  assert.deepEqual(ok.sent[0], {
    model: "test-model",
    messages: [{ role: "system", content: "system" }, { role: "user", content: "prompt" }],
    response_format: { type: "json_schema", json_schema: { name: "result", schema: { type: "object" }, strict: true } },
  });
  await rejectsWith(callOpenAICompatible(config("openai-compatible"), request, fake(["chat", "completions", "create"], completion({ finish_reason: "length" })).client), 502, /cut off/);
  await rejectsWith(callOpenAICompatible(config("openai-compatible"), request, fake(["chat", "completions", "create"], completion({ message: { content: "", refusal: "no" } })).client), 502, /declined/);
});

test("Claude sends a JSON schema output format with optional effort, and checks the stop reason", async () => {
  const message = (stop: string) => ({ content: [{ type: "text", text: "{}" }], stop_reason: stop });
  const ok = fake(["messages", "create"], message("end_turn"));
  assert.equal(await callAnthropic(config("anthropic", { reasoningEffort: "medium" }), request, ok.client), "{}");
  assert.deepEqual(ok.sent[0], {
    model: "test-model", max_tokens: 16000, system: "system", messages: [{ role: "user", content: "prompt" }],
    output_config: { format: { type: "json_schema", schema: { type: "object" } }, effort: "medium" },
  });
  await rejectsWith(callAnthropic(config("anthropic"), request, fake(["messages", "create"], message("refusal")).client), 502, /declined/);
  await rejectsWith(callAnthropic(config("anthropic"), request, fake(["messages", "create"], message("max_tokens")).client), 502, /cut off/);
  await rejectsWith(callAnthropic(config("anthropic"), request, fake(["messages", "create"], thrower(Anthropic.APIError.generate(401, { type: "error" }, "x", new Headers()))).client), 502, /AI_API_KEY/);
  await rejectsWith(callAnthropic(config("anthropic"), request, fake(["messages", "create"], thrower(new Anthropic.APIConnectionTimeoutError())).client), 504, /longer than/);
});

test("Gemini sends a JSON schema response config and checks blocks and finish reasons", async () => {
  const response = (extra: object) => ({ text: "{}", candidates: [{ finishReason: FinishReason.STOP }], ...extra });
  const ok = fake(["models", "generateContent"], response({}));
  assert.equal(await callGemini(config("gemini"), request, ok.client), "{}");
  assert.deepEqual(ok.sent[0], {
    model: "test-model", contents: "prompt",
    config: { systemInstruction: "system", responseMimeType: "application/json", responseJsonSchema: { type: "object" } },
  });
  await rejectsWith(callGemini(config("gemini"), request, fake(["models", "generateContent"], response({ candidates: [{ finishReason: FinishReason.SAFETY }] })).client), 502, /declined/);
  await rejectsWith(callGemini(config("gemini"), request, fake(["models", "generateContent"], response({ promptFeedback: { blockReason: "SAFETY" } })).client), 502, /declined/);
  await rejectsWith(callGemini(config("gemini"), request, fake(["models", "generateContent"], response({ candidates: [{ finishReason: FinishReason.MAX_TOKENS }] })).client), 502, /cut off/);
  await rejectsWith(callGemini(config("gemini"), request, fake(["models", "generateContent"], thrower(new ApiError({ message: "x", status: 429 }))).client), 429, /rate limiting/);
  await rejectsWith(callGemini(config("gemini"), request, fake(["models", "generateContent"], thrower(new TypeError("fetch failed"))).client), 502, /Could not reach/);
});

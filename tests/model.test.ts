import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { ModelConfigurationError, ModelError, generateJson, modelConfiguration } from "../src/lib/model.ts";

const NAMES = ["AI_PROVIDER", "AI_MODEL", "AI_API_KEY", "AI_BASE_URL", "AI_REASONING_EFFORT"];
const saved = Object.fromEntries(NAMES.map((name) => [name, process.env[name]]));
const request = { system: "system", prompt: "prompt", schema: { type: "object" } };

function setEnv(values: Record<string, string>) {
  for (const name of NAMES) delete process.env[name];
  Object.assign(process.env, values);
}

beforeEach(() => setEnv({ AI_PROVIDER: "openai", AI_MODEL: "test-model", AI_API_KEY: "test-key" }));

afterEach(() => {
  for (const name of NAMES) {
    if (saved[name] === undefined) delete process.env[name];
    else process.env[name] = saved[name];
  }
});

test("each supported provider can be configured with a model and key", () => {
  for (const provider of ["openai", "anthropic", "gemini"]) {
    setEnv({ AI_PROVIDER: provider, AI_MODEL: "m", AI_API_KEY: "k" });
    assert.deepEqual(modelConfiguration(), { provider, model: "m", apiKey: "k" });
  }
  setEnv({ AI_PROVIDER: "openai-compatible", AI_MODEL: "m", AI_API_KEY: "k", AI_BASE_URL: "https://openrouter.ai/api/v1" });
  assert.equal(modelConfiguration().baseURL, "https://openrouter.ai/api/v1");
});

test("missing or inconsistent settings are configuration errors with a clear message", () => {
  const cases: [Record<string, string>, RegExp][] = [
    [{ AI_MODEL: "m", AI_API_KEY: "k" }, /AI_PROVIDER must be one of openai, anthropic, gemini, openai-compatible/],
    [{ AI_PROVIDER: "mistral", AI_MODEL: "m", AI_API_KEY: "k" }, /AI_PROVIDER must be one of/],
    [{ AI_PROVIDER: "openai", AI_API_KEY: "k" }, /AI_MODEL is not set/],
    [{ AI_PROVIDER: "openai", AI_MODEL: "m" }, /AI_API_KEY is not set/],
    [{ AI_PROVIDER: "openai-compatible", AI_MODEL: "m", AI_API_KEY: "k" }, /AI_BASE_URL is required/],
    [{ AI_PROVIDER: "gemini", AI_MODEL: "m", AI_API_KEY: "k", AI_BASE_URL: "https://x" }, /only used when AI_PROVIDER is openai-compatible/],
    [{ AI_PROVIDER: "gemini", AI_MODEL: "m", AI_API_KEY: "k", AI_REASONING_EFFORT: "low" }, /only with the openai and anthropic providers/],
    [{ AI_PROVIDER: "openai", AI_MODEL: "m", AI_API_KEY: "k", AI_REASONING_EFFORT: "fastest" }, /must be low, medium, high/],
  ];
  for (const [values, message] of cases) {
    setEnv(values);
    assert.throws(() => modelConfiguration(), (error: unknown) => error instanceof ModelConfigurationError && message.test(error.message), JSON.stringify(values));
  }
});

test("reasoning effort is accepted for OpenAI and Claude", () => {
  for (const provider of ["openai", "anthropic"]) {
    setEnv({ AI_PROVIDER: provider, AI_MODEL: "m", AI_API_KEY: "k", AI_REASONING_EFFORT: "low" });
    assert.equal(modelConfiguration().reasoningEffort, "low");
  }
});

test("generateJson parses the provider's JSON and makes no call when settings are missing", async () => {
  assert.deepEqual(await generateJson(request, async (config) => JSON.stringify({ provider: config.provider })), { provider: "openai" });
  setEnv({ AI_PROVIDER: "openai", AI_MODEL: "m" });
  let called = false;
  await assert.rejects(generateJson(request, async () => { called = true; return "{}"; }), ModelConfigurationError);
  assert.equal(called, false);
});

test("text that is not JSON is a failure, not a result", async () => {
  await assert.rejects(generateJson(request, async () => "Sure! Here is the analysis."),
    (error: unknown) => error instanceof ModelError && error.status === 502 && /not valid JSON/.test(error.message));
});

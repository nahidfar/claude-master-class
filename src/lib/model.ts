// Server-only: imported by API routes, never by client components.
import { callAnthropic } from "./providers/anthropic.ts";
import { callGemini } from "./providers/gemini.ts";
import { callOpenAI, callOpenAICompatible } from "./providers/openai.ts";
import {
  ModelConfigurationError, ModelError, PROVIDERS, REASONING_EFFORTS,
  type JsonRequest, type ModelConfig, type Provider,
} from "./providers/shared.ts";

export { ModelConfigurationError, ModelError, PROVIDERS, type JsonRequest, type ModelConfig, type Provider };

// Each provider sends one request and returns the model's raw JSON text, or throws ModelError.
export type ProviderCall = (config: ModelConfig, request: JsonRequest) => Promise<string>;

const CALLS: Record<Provider, ProviderCall> = {
  openai: callOpenAI,
  anthropic: callAnthropic,
  gemini: callGemini,
  "openai-compatible": callOpenAICompatible,
};

export function modelConfiguration(): ModelConfig {
  const env = (name: string) => process.env[name]?.trim() ?? "";
  const provider = PROVIDERS.find((value) => value === env("AI_PROVIDER"));
  if (!provider) throw new ModelConfigurationError(`AI_PROVIDER must be one of ${PROVIDERS.join(", ")}.`);
  const model = env("AI_MODEL");
  const apiKey = env("AI_API_KEY");
  if (!model) throw new ModelConfigurationError("AI_MODEL is not set.");
  if (!apiKey) throw new ModelConfigurationError("AI_API_KEY is not set.");

  const config: ModelConfig = { provider, model, apiKey };
  const baseURL = env("AI_BASE_URL");
  if (provider === "openai-compatible") {
    if (!baseURL) throw new ModelConfigurationError("AI_BASE_URL is required when AI_PROVIDER is openai-compatible.");
    config.baseURL = baseURL;
  } else if (baseURL) {
    throw new ModelConfigurationError("AI_BASE_URL is only used when AI_PROVIDER is openai-compatible. Leave it empty.");
  }

  const effort = env("AI_REASONING_EFFORT");
  if (effort) {
    if (provider !== "openai" && provider !== "anthropic") {
      throw new ModelConfigurationError("AI_REASONING_EFFORT works only with the openai and anthropic providers. Leave it empty.");
    }
    const reasoningEffort = REASONING_EFFORTS.find((value) => value === effort);
    if (!reasoningEffort) throw new ModelConfigurationError(`AI_REASONING_EFFORT must be ${REASONING_EFFORTS.join(", ")}, or empty.`);
    config.reasoningEffort = reasoningEffort;
  }
  return config;
}

// One structured-output call. Returns parsed JSON; callers still validate its shape.
export async function generateJson(request: JsonRequest, call?: ProviderCall): Promise<unknown> {
  const config = modelConfiguration();
  const text = await (call ?? CALLS[config.provider])(config, request);
  try {
    return JSON.parse(text);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new ModelError("The AI provider returned a response that was not valid JSON.", 502);
  }
}

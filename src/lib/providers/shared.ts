// Shared by the provider files and model.ts.

export class ModelConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModelConfigurationError";
  }
}

export class ModelError extends Error {
  readonly status: number;
  readonly retryAfter?: string;

  constructor(message: string, status: number, retryAfter?: string) {
    super(message);
    this.name = "ModelError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export const PROVIDERS = ["openai", "anthropic", "gemini", "openai-compatible"] as const;
export type Provider = (typeof PROVIDERS)[number];
export const REASONING_EFFORTS = ["low", "medium", "high"] as const;

export interface ModelConfig {
  provider: Provider;
  model: string;
  apiKey: string;
  baseURL?: string;
  reasoningEffort?: (typeof REASONING_EFFORTS)[number];
}

export interface JsonRequest {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
}

// Reasoning models can take minutes; a timed-out attempt is still billed, so it is not retried.
export const MODEL_TIMEOUT_MS = 180_000;

// Same wording for every provider, so students see one set of errors whichever key they use.
export function providerFailure(status: number | undefined, retryAfter?: string | null): ModelError {
  if (status === 429) return new ModelError("The AI provider is rate limiting requests or your credit has run out. Try again shortly, or check your account.", 429, retryAfter ?? undefined);
  if (status === 401 || status === 403) return new ModelError("The AI provider rejected the API key. Check AI_API_KEY and AI_PROVIDER.", 502);
  if (status === 404) return new ModelError("The AI provider does not recognize the model. Check AI_MODEL.", 502);
  return new ModelError(`The AI provider returned an error (${status ?? "unknown status"}).`, 502);
}

export const timeoutFailure = () => new ModelError(`The AI provider took longer than ${MODEL_TIMEOUT_MS / 60_000} minutes to respond. Try again, or use a shorter job description.`, 504);
export const connectionFailure = () => new ModelError("Could not reach the AI provider. Check your connection, and AI_BASE_URL if you set one.", 502);
export const declinedFailure = () => new ModelError("The AI provider declined this request.", 502);
export const truncatedFailure = () => new ModelError("The AI response was cut off before it finished.", 502);

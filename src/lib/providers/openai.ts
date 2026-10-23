import OpenAI from "openai";
import {
  MODEL_TIMEOUT_MS, connectionFailure, declinedFailure, providerFailure, timeoutFailure, truncatedFailure,
  type JsonRequest, type ModelConfig,
} from "./shared.ts";

type OpenAIClient = Pick<OpenAI, "responses" | "chat">;

function client(config: ModelConfig): OpenAIClient {
  return new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL, maxRetries: 0, timeout: MODEL_TIMEOUT_MS });
}

function failure(error: unknown): Error {
  if (error instanceof OpenAI.APIConnectionTimeoutError) return timeoutFailure();
  if (error instanceof OpenAI.APIConnectionError) return connectionFailure();
  if (error instanceof OpenAI.APIError) return providerFailure(error.status, error.headers?.get("retry-after"));
  return error instanceof Error ? error : new Error(String(error));
}

// OpenAI: Responses API with a strict JSON schema.
export async function callOpenAI(config: ModelConfig, request: JsonRequest, openai: OpenAIClient = client(config)): Promise<string> {
  let response: OpenAI.Responses.Response;
  try {
    response = await openai.responses.create({
      model: config.model,
      max_output_tokens: 16000,
      instructions: request.system,
      input: request.prompt,
      text: { format: { type: "json_schema", name: "result", schema: request.schema, strict: true } },
      ...(config.reasoningEffort ? { reasoning: { effort: config.reasoningEffort } } : {}),
    });
  } catch (error) {
    throw failure(error);
  }
  const refused = response.output.some((item) => item.type === "message" && item.content.some((part) => part.type === "refusal"));
  if (refused || response.incomplete_details?.reason === "content_filter") throw declinedFailure();
  if (response.status === "incomplete") throw truncatedFailure();
  return response.output_text;
}

// Any OpenAI-compatible endpoint (OpenRouter, Groq, local servers): Chat Completions with a JSON schema.
// The endpoint must support JSON schema output; the shape is still validated afterwards.
export async function callOpenAICompatible(config: ModelConfig, request: JsonRequest, openai: OpenAIClient = client(config)): Promise<string> {
  let completion: OpenAI.Chat.ChatCompletion;
  try {
    completion = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: "system", content: request.system }, { role: "user", content: request.prompt }],
      response_format: { type: "json_schema", json_schema: { name: "result", schema: request.schema, strict: true } },
    });
  } catch (error) {
    throw failure(error);
  }
  const choice = completion.choices[0];
  if (!choice) throw connectionFailure();
  if (choice.message.refusal || choice.finish_reason === "content_filter") throw declinedFailure();
  if (choice.finish_reason === "length") throw truncatedFailure();
  return choice.message.content ?? "";
}

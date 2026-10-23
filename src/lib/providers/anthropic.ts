import Anthropic from "@anthropic-ai/sdk";
import {
  MODEL_TIMEOUT_MS, connectionFailure, declinedFailure, providerFailure, timeoutFailure, truncatedFailure,
  type JsonRequest, type ModelConfig,
} from "./shared.ts";

type AnthropicClient = Pick<Anthropic, "messages">;

// Claude: Messages API with a JSON schema output format.
export async function callAnthropic(
  config: ModelConfig,
  request: JsonRequest,
  anthropic: AnthropicClient = new Anthropic({ apiKey: config.apiKey, maxRetries: 0, timeout: MODEL_TIMEOUT_MS }),
): Promise<string> {
  let message: Anthropic.Message;
  try {
    message = await anthropic.messages.create({
      model: config.model,
      max_tokens: 16000,
      system: request.system,
      messages: [{ role: "user", content: request.prompt }],
      output_config: {
        format: { type: "json_schema", schema: request.schema },
        ...(config.reasoningEffort ? { effort: config.reasoningEffort } : {}),
      },
    });
  } catch (error) {
    if (error instanceof Anthropic.APIConnectionTimeoutError) throw timeoutFailure();
    if (error instanceof Anthropic.APIConnectionError) throw connectionFailure();
    if (error instanceof Anthropic.APIError) throw providerFailure(error.status, error.headers?.get("retry-after"));
    throw error;
  }
  if (message.stop_reason === "refusal") throw declinedFailure();
  if (message.stop_reason === "max_tokens") throw truncatedFailure();
  return message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("");
}

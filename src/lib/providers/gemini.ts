import { ApiError, FinishReason, GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import {
  MODEL_TIMEOUT_MS, connectionFailure, declinedFailure, providerFailure, timeoutFailure, truncatedFailure,
  type JsonRequest, type ModelConfig,
} from "./shared.ts";

type GeminiClient = Pick<GoogleGenAI, "models">;

const DECLINED: (FinishReason | undefined)[] = [FinishReason.SAFETY, FinishReason.RECITATION, FinishReason.PROHIBITED_CONTENT, FinishReason.BLOCKLIST, FinishReason.SPII];

// Gemini: generateContent with a JSON schema response.
export async function callGemini(
  config: ModelConfig,
  request: JsonRequest,
  gemini: GeminiClient = new GoogleGenAI({ apiKey: config.apiKey, httpOptions: { timeout: MODEL_TIMEOUT_MS } }),
): Promise<string> {
  let response: GenerateContentResponse;
  try {
    response = await gemini.models.generateContent({
      model: config.model,
      contents: request.prompt,
      config: { systemInstruction: request.system, responseMimeType: "application/json", responseJsonSchema: request.schema },
    });
  } catch (error) {
    if (error instanceof ApiError) throw providerFailure(error.status);
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) throw timeoutFailure();
    if (error instanceof TypeError) throw connectionFailure();
    throw error;
  }
  const finishReason = response.candidates?.[0]?.finishReason;
  if (response.promptFeedback?.blockReason || DECLINED.includes(finishReason)) throw declinedFailure();
  if (finishReason === FinishReason.MAX_TOKENS) throw truncatedFailure();
  return response.text ?? "";
}

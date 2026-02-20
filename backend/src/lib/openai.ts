import OpenAI from "openai";
import type { GenerateEmailRequest, GenerateEmailResponse } from "@/types/email";
import { buildMessages } from "./promptBuilder";

const MAX_TOKENS: Record<string, number> = {
  short: 250,
  medium: 500,
  long: 800,
};

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set.");
  }
  return new OpenAI({ apiKey });
}

function parseResponse(
  raw: string,
  mode: GenerateEmailRequest["mode"]
): GenerateEmailResponse {
  const trimmed = raw.trim();

  if (mode === "new") {
    const firstNewline = trimmed.indexOf("\n");
    const firstLine = firstNewline === -1 ? trimmed : trimmed.slice(0, firstNewline);

    if (firstLine.toUpperCase().startsWith("SUBJECT:")) {
      const subject = firstLine.slice("SUBJECT:".length).trim();
      const body = firstNewline === -1 ? "" : trimmed.slice(firstNewline + 1).replace(/^\n+/, "");
      return { subject, body };
    }

    return { subject: null, body: trimmed };
  }

  return { subject: null, body: trimmed };
}

export async function generateEmail(
  req: GenerateEmailRequest
): Promise<GenerateEmailResponse> {
  const client = getClient();
  const messages = buildMessages(req);
  const maxTokens = MAX_TOKENS[req.length] ?? MAX_TOKENS.medium;

  // // Rate limiting placeholder — implement per-IP throttle here if needed
  // const rateLimitOk = checkRateLimit(req);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return parseResponse(content, req.mode);
}

import type { GenerateEmailRequest } from "@/types/email";

const VALID_MODES = ["new", "reply"] as const;
const VALID_LENGTHS = ["short", "medium", "long"] as const;

interface ValidationResult {
  valid: true;
  data: GenerateEmailRequest;
}

interface ValidationError {
  valid: false;
  error: string;
}

export function validateRequest(
  body: unknown
): ValidationResult | ValidationError {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object." };
  }

  const b = body as Record<string, unknown>;

  if (!b.mode || !VALID_MODES.includes(b.mode as (typeof VALID_MODES)[number])) {
    return {
      valid: false,
      error: `"mode" is required and must be one of: ${VALID_MODES.join(", ")}.`,
    };
  }

  if (!b.recipient || typeof b.recipient !== "string" || !b.recipient.trim()) {
    return { valid: false, error: '"recipient" is required and must be a non-empty string.' };
  }

  if (!b.tone || typeof b.tone !== "string" || !b.tone.trim()) {
    return { valid: false, error: '"tone" is required and must be a non-empty string.' };
  }

  if (!b.length || !VALID_LENGTHS.includes(b.length as (typeof VALID_LENGTHS)[number])) {
    return {
      valid: false,
      error: `"length" is required and must be one of: ${VALID_LENGTHS.join(", ")}.`,
    };
  }

  if (!b.intent || typeof b.intent !== "string" || !b.intent.trim()) {
    return { valid: false, error: '"intent" is required and must be a non-empty string.' };
  }

  if (b.mode === "reply") {
    if (
      !b.incomingEmail ||
      typeof b.incomingEmail !== "string" ||
      !b.incomingEmail.trim()
    ) {
      return {
        valid: false,
        error: '"incomingEmail" is required when mode is "reply".',
      };
    }
  }

  return {
    valid: true,
    data: {
      mode: b.mode as GenerateEmailRequest["mode"],
      recipient: (b.recipient as string).trim(),
      tone: (b.tone as string).trim(),
      length: b.length as GenerateEmailRequest["length"],
      intent: (b.intent as string).trim(),
      incomingEmail:
        typeof b.incomingEmail === "string" ? b.incomingEmail.trim() : null,
    },
  };
}

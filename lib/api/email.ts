import type { EmailGenerationInput, EmailGenerationOutput } from '../../types/email';
import { config } from '../config';
import { generateEmailMock } from '../generateEmailMock';

interface ApiErrorResponse {
  error: string;
}

export class EmailApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'EmailApiError';
  }
}

function mapInputToApiBody(input: EmailGenerationInput): Record<string, unknown> {
  return {
    mode: input.mode,
    recipient: input.recipient,
    tone: input.tone,
    length: input.length.toLowerCase(),
    intent: input.intent,
    incomingEmail: input.originalEmail?.trim() || null,
  };
}

async function callApi(input: EmailGenerationInput): Promise<EmailGenerationOutput> {
  const url = `${config.apiUrl}/api/generate-email`;
  const body = mapInputToApiBody(input);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data: EmailGenerationOutput | ApiErrorResponse = await response.json();

    if (!response.ok) {
      const errMsg = (data as ApiErrorResponse).error ?? 'Unknown server error';
      throw new EmailApiError(errMsg, response.status);
    }

    const result = data as EmailGenerationOutput;

    return {
      subject: result.subject ?? `Re: ${input.recipient}`,
      body: result.body,
    };
  } catch (err) {
    if (err instanceof EmailApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new EmailApiError('Request timed out. Please try again.');
    }

    throw new EmailApiError(
      'Could not connect to the server. Please check your connection and try again.'
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateEmail(
  input: EmailGenerationInput
): Promise<EmailGenerationOutput> {
  if (config.useMock) {
    return generateEmailMock(input);
  }

  return callApi(input);
}

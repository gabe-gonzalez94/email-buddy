export type EmailMode = "new" | "reply";

export type EmailLength = "short" | "medium" | "long";

export interface GenerateEmailRequest {
  mode: EmailMode;
  recipient: string;
  tone: string;
  length: EmailLength;
  intent: string;
  incomingEmail: string | null;
}

export interface GenerateEmailResponse {
  subject: string | null;
  body: string;
}

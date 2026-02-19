export type EmailMode = 'new' | 'reply';

export type EmailTone =
  | 'Professional'
  | 'Friendly'
  | 'Formal'
  | 'Casual'
  | 'Persuasive'
  | 'Apologetic';

export type EmailLength = 'Short' | 'Medium' | 'Long';

export interface EmailGenerationInput {
  mode: EmailMode;
  recipient: string;
  tone: EmailTone;
  length: EmailLength;
  intent: string;
  originalEmail?: string;
}

export interface EmailGenerationOutput {
  subject: string;
  body: string;
}

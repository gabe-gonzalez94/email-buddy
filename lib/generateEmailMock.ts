import { EmailGenerationInput, EmailGenerationOutput } from '../types/email';

const lengthMap = {
  Short: { paragraphs: 1, sentences: 3 },
  Medium: { paragraphs: 2, sentences: 5 },
  Long: { paragraphs: 3, sentences: 7 },
};

const greetings: Record<string, string[]> = {
  Professional: ['Dear', 'Hello'],
  Friendly: ['Hey', 'Hi there'],
  Formal: ['Dear', 'Respected'],
  Casual: ['Hey', 'Hi'],
  Persuasive: ['Dear', 'Hello'],
  Apologetic: ['Dear', 'Hello'],
};

const closings: Record<string, string[]> = {
  Professional: ['Best regards', 'Kind regards'],
  Friendly: ['Cheers', 'Talk soon'],
  Formal: ['Sincerely', 'Respectfully yours'],
  Casual: ['Later', 'Take care'],
  Persuasive: ['Looking forward to your response', 'I appreciate your consideration'],
  Apologetic: ['With sincere apologies', 'I hope we can resolve this'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildSubject(input: EmailGenerationInput): string {
  if (input.mode === 'reply') {
    return `Re: Regarding your message`;
  }

  const intentSnippet = input.intent.slice(0, 50).trim();
  return intentSnippet.charAt(0).toUpperCase() + intentSnippet.slice(1);
}

function buildBody(input: EmailGenerationInput): string {
  const { tone, length, intent, recipient, mode, originalEmail } = input;
  const config = lengthMap[length];
  const greeting = pickRandom(greetings[tone] ?? greetings.Professional);
  const closing = pickRandom(closings[tone] ?? closings.Professional);

  const lines: string[] = [];

  lines.push(`${greeting} ${recipient},`);
  lines.push('');

  if (mode === 'reply' && originalEmail) {
    lines.push(
      `Thank you for your email. I've carefully reviewed what you shared, and I'd like to respond thoughtfully.`
    );
    lines.push('');
  }

  const bodyParagraphs = generateParagraphs(intent, tone, config.paragraphs, config.sentences);
  bodyParagraphs.forEach((p) => {
    lines.push(p);
    lines.push('');
  });

  lines.push(closing + ',');
  lines.push('[Your Name]');

  return lines.join('\n');
}

function generateParagraphs(
  intent: string,
  tone: string,
  count: number,
  sentencesPerParagraph: number
): string[] {
  const toneAdverbs: Record<string, string> = {
    Professional: 'professionally',
    Friendly: 'warmly',
    Formal: 'formally',
    Casual: 'casually',
    Persuasive: 'compellingly',
    Apologetic: 'sincerely',
  };

  const adverb = toneAdverbs[tone] ?? 'clearly';
  const paragraphs: string[] = [];

  const templates = [
    `I'm writing to ${intent.toLowerCase()}. I want to convey this ${adverb} and ensure clarity in my communication.`,
    `To elaborate further, I believe this matter deserves careful attention. I've given it considerable thought and would like to share my perspective with you.`,
    `I'd appreciate the opportunity to discuss this in more detail at your earliest convenience. Please don't hesitate to reach out if you have any questions or need additional information.`,
    `Moving forward, I think it would be beneficial for us to align on the next steps. Your input and feedback on this matter would be greatly valued.`,
  ];

  for (let i = 0; i < count; i++) {
    paragraphs.push(templates[i % templates.length]);
  }

  return paragraphs;
}

export async function generateEmailMock(
  input: EmailGenerationInput
): Promise<EmailGenerationOutput> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    subject: buildSubject(input),
    body: buildBody(input),
  };
}

const TONE_MAP: Record<string, string> = {
  Professional: [
    "Polished, business-appropriate language.",
    "No emojis, no slang.",
    "Clear structure, minimal fluff.",
  ].join(" "),

  Friendly: [
    "Warm, approachable, respectful.",
    "Contractions allowed.",
    "No emojis unless user intent suggests it.",
  ].join(" "),

  Concise: [
    "Very direct, minimal words.",
    "Short sentences.",
    "No extra context unless needed.",
  ].join(" "),

  Empathetic: [
    "Acknowledge the situation briefly.",
    "Supportive language.",
    "Still professional, not overly emotional.",
  ].join(" "),

  Apologetic: [
    "Take responsibility briefly.",
    "Apologize once, then focus on resolution.",
    "Avoid long excuses unless user intent provides them.",
  ].join(" "),

  Persuasive: [
    "Positive framing + benefits.",
    "1-2 reasons max, not salesy.",
    "Clear call-to-action at the end.",
  ].join(" "),

  Formal: [
    "Traditional phrasing.",
    "No contractions.",
    "Very respectful and structured.",
  ].join(" "),

  Casual: [
    "Conversational and relaxed.",
    "Contractions ok.",
    "Avoid excessive slang; still readable and respectful.",
  ].join(" "),
};

export function getToneGuidance(tone: string): string {
  return TONE_MAP[tone] ?? TONE_MAP.Professional;
}

import type { GenerateEmailRequest } from "@/types/email";
import { getToneGuidance } from "./toneGuidance";

const SYSTEM_MESSAGE = `You are EmailBuddy, an expert email writing assistant.

Goal: Write a polished, natural-sounding email draft that the user can copy and paste immediately.

Hard rules:
- Do NOT mention you are an AI.
- Do NOT add disclaimers or policy text.
- Do NOT invent facts. If the user's intent is missing critical specifics, write a reasonable placeholder in square brackets like [date/time] or [link] instead of guessing.
- Keep it concise and aligned to the requested length.
- Use a friendly, professional tone that matches the selected tone.
- Avoid overly flowery language unless the user explicitly asks.

Formatting rules:
- Output must be valid plain text (no markdown).
- Use standard email formatting with line breaks and paragraphs.
- Include a greeting and sign-off.
- Only include a subject line when requested by the API contract; otherwise return body only.`;

export function buildMessages(
  req: GenerateEmailRequest
): Array<{ role: "system" | "user"; content: string }> {
  const toneGuidance = getToneGuidance(req.tone);

  const userLines: string[] = [
    `MODE: ${req.mode}`,
    `RECIPIENT: ${req.recipient}`,
    `TONE: ${req.tone}`,
    `TONE GUIDANCE:`,
    toneGuidance,
    ``,
    `LENGTH: ${req.length}`,
    `USER INTENT: ${req.intent}`,
  ];

  if (req.mode === "reply" && req.incomingEmail) {
    userLines.push(``, `INCOMING EMAIL:`, req.incomingEmail);
  }

  userLines.push(
    ``,
    `Write the email draft now.`,
    ``,
    `Length guidance:`,
    `- short: ~3-6 sentences`,
    `- medium: ~7-12 sentences`,
    `- long: ~13-20 sentences (still avoid rambling)`,
    ``,
    `Output format requirements:`,
    `- If MODE is "new", the first line must start with: SUBJECT:`,
    `- If MODE is "reply", do not include SUBJECT:`,
    ``,
    `Additional guidance:`,
    `- If the user's intent implies questions, ask them clearly in a bullet list (max 3 bullets).`,
    `- If scheduling is involved, propose 2-3 time options and use placeholders if needed.`,
    `- Close with a sign-off appropriate to the tone.`
  );

  return [
    { role: "system", content: SYSTEM_MESSAGE },
    { role: "user", content: userLines.join("\n") },
  ];
}

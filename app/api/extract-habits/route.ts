import { NextRequest, NextResponse } from "next/server";
import { getAuthorModePrompt, type AuthorVoice } from "@/lib/authorMode";
import { ANTI_HABITS_INSTRUCTION, ANTI_HABITS_JSON } from "@/lib/antiHabitsPrompt";
import { generateJSON } from "@/lib/gemini";
import type { APIResponse } from "@/types/habits";

const JSON_SCHEMA = `Return ONLY valid JSON with this exact structure — no markdown, no backticks:
{
  ${ANTI_HABITS_JSON}
  "habits": [
    {
      "name": "Short habit name (max 6 words)",
      "why": "One sentence: why this habit matters from the book.",
      "intention": "When [specific cue], I will [specific action] for [duration or amount]."
    }
  ],
  "plan": {
    "intro": "One sentence framing the 30-day journey.",
    "phases": [
      {
        "name": "Phase name",
        "days": "Days 1–10",
        "focus": "One sentence focus.",
        "items": [
          { "day": "Days 1–3", "action": "Specific daily action." },
          { "day": "Days 4–7", "action": "Specific daily action." },
          { "day": "Days 8–10", "action": "Specific daily action." }
        ]
      },
      {
        "name": "Phase name",
        "days": "Days 11–20",
        "focus": "One sentence focus.",
        "items": [
          { "day": "Days 11–14", "action": "Specific daily action." },
          { "day": "Days 15–17", "action": "Specific daily action." },
          { "day": "Days 18–20", "action": "Specific daily action." }
        ]
      },
      {
        "name": "Phase name",
        "days": "Days 21–30",
        "focus": "One sentence focus.",
        "items": [
          { "day": "Days 21–24", "action": "Specific daily action." },
          { "day": "Days 25–28", "action": "Specific daily action." },
          { "day": "Days 29–30", "action": "Specific daily action." }
        ]
      }
    ]
  }
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const summary = body.summary?.trim();
    const authorMode = Boolean(body.authorMode);
    const authorVoice = (body.authorVoice as AuthorVoice) ?? "auto";

    if (!summary) {
      return NextResponse.json(
        { error: "Book summary is required." },
        { status: 400 }
      );
    }

    const authorPrompt = getAuthorModePrompt(authorMode, {
      voice: authorVoice,
      contextTexts: [summary],
    });

    const prompt = `You are a habit coach and behavioral scientist. Given the book summary below, extract exactly 3 actionable habits a reader can start immediately.
${ANTI_HABITS_INSTRUCTION}
${authorPrompt}
${JSON_SCHEMA}

Book summary:
${summary}`;

    const parsed = await generateJSON<APIResponse>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract habits.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

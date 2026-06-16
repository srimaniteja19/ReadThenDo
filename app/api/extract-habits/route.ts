import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const PROMPT_TEMPLATE = `You are a habit coach and behavioral scientist. Given the book summary below, extract exactly 3 actionable habits a reader can start immediately.

Return ONLY valid JSON with this exact structure — no markdown, no backticks:
{
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
}

Book summary:
`;

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const summary = body.summary?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: "Book summary is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const result = await model.generateContent(PROMPT_TEMPLATE + summary);
    const rawText = result.response.text();
    const cleaned = stripMarkdownFences(rawText);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract habits.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthorModePrompt, type AuthorVoice } from "@/lib/authorMode";
import { generateJSON } from "@/lib/gemini";
import type { APIResponse, BookInput } from "@/types/habits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const books = body.books as BookInput[] | undefined;
    const authorMode = Boolean(body.authorMode);
    const authorVoice = (body.authorVoice as AuthorVoice) ?? "auto";

    if (!books || books.length !== 3) {
      return NextResponse.json(
        { error: "Exactly 3 book summaries are required." },
        { status: 400 }
      );
    }

    if (books.some((book) => !book.summary?.trim())) {
      return NextResponse.json(
        { error: "All 3 book summaries must be filled in." },
        { status: 400 }
      );
    }

    const booksText = books
      .map(
        (book, index) =>
          `Book ${index + 1}${book.name ? ` — ${book.name}` : ""}:\n${book.summary.trim()}`
      )
      .join("\n\n");

    const authorPrompt = getAuthorModePrompt(authorMode, {
      voice: authorVoice,
      contextTexts: books.map((b) => `${b.name} ${b.summary}`),
      synthesis: true,
    });

    const prompt = `You are a master synthesizer of behavioral science and productivity literature.

The user has read THREE books and wants ONE unified habit system — not three separate lists.

${booksText}

Your job:
1. Find the HIGHEST-SIGNAL ideas that appear across multiple books (overlap = truth).
2. Extract exactly 3 actionable habits that synthesize all three frameworks — each habit should explicitly reflect consensus across books where possible.
3. Build a unified 30-day plan that merges all three frameworks into one coherent system.
4. Write a synthesisInsight: one compelling sentence (max 30 words) stating what all three books agree on. Example: "All three books agree: protect a single 90-minute slot before 10am. Here's your unified system."

In each habit's "why", mention which books support this habit (e.g. "Atomic Habits + Deep Work both insist…").
${authorPrompt}
Return ONLY valid JSON — no markdown:
{
  "synthesisInsight": "One sentence: what all three books agree on.",
  "bookSources": ["Book 1 name", "Book 2 name", "Book 3 name"],
  "habits": [
    {
      "name": "Short habit name (max 6 words)",
      "why": "One sentence citing cross-book consensus.",
      "intention": "When [cue], I will [action] for [duration]."
    }
  ],
  "plan": {
    "intro": "One sentence framing this unified 30-day journey across all three books.",
    "phases": [
      {
        "name": "Phase name",
        "days": "Days 1–10",
        "focus": "One sentence focus merging frameworks.",
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

    const parsed = await generateJSON<APIResponse>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to synthesize books.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

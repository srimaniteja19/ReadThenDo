import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import type { HabitBattleResult } from "@/types/habits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bookA = body.bookA?.trim();
    const bookB = body.bookB?.trim();
    const goal = body.goal?.trim();
    const bookAName = body.bookAName?.trim() || "Book A";
    const bookBName = body.bookBName?.trim() || "Book B";

    if (!bookA || !bookB) {
      return NextResponse.json(
        { error: "Both book summaries are required." },
        { status: 400 }
      );
    }

    if (!goal) {
      return NextResponse.json(
        { error: "A goal is required for the comparison." },
        { status: 400 }
      );
    }

    const prompt = `You are a habit systems expert. Two books offer different frameworks. Compare them for this specific goal and pick a winner.

Goal: ${goal}

${bookAName}:
${bookA}

${bookBName}:
${bookB}

Pick which book's habit system is BETTER suited to this goal. Be decisive — pick A or B, not a tie.

Return ONLY valid JSON — no markdown:
{
  "winner": "A" or "B",
  "winnerName": "name of winning book",
  "reason": "2 sentences: why this system wins for this goal.",
  "bookAStrength": "One sentence strength of ${bookAName} for this goal.",
  "bookBStrength": "One sentence strength of ${bookBName} for this goal.",
  "verdict": "One shareable hot-take sentence (max 20 words) for social media."
}`;

    const parsed = await generateJSON<HabitBattleResult>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to compare books.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

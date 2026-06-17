import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import type { Habit, HabitDNA } from "@/types/habits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const habits = body.habits as Habit[] | undefined;
    const summary = body.summary?.trim() ?? "";

    if (!habits?.length) {
      return NextResponse.json(
        { error: "Habits are required." },
        { status: 400 }
      );
    }

    const habitsText = habits
      .map(
        (h, i) =>
          `${i + 1}. ${h.name} — ${h.why} — ${h.intention}`
      )
      .join("\n");

    const prompt = `You are a behavioral psychologist. Based on these 3 habits${
      summary ? " extracted from a book summary" : ""
    }, assign ONE catchy personality label (3–4 words max) that describes what kind of learner/doer this person is.

Examples: "Systems Thinker 🧠", "Slow Burner 🔥", "Morning Architect 🌅", "Deep Focus Monk 🎯"

Habits:
${habitsText}
${summary ? `\nBook context:\n${summary}` : ""}

Return ONLY valid JSON — no markdown:
{
  "label": "Short label without emoji (max 4 words)",
  "emoji": "single emoji",
  "tagline": "One punchy sentence (max 15 words) explaining this personality type."
}`;

    const parsed = await generateJSON<HabitDNA>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate Habit DNA.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

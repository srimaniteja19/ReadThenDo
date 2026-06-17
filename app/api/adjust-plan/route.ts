import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import type { CheckInDay, CheckInResult, Habit, HabitPlan } from "@/types/habits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const day = body.day as CheckInDay;
    const ratings = body.ratings as number[] | undefined;
    const reflection = body.reflection?.trim();
    const habits = body.habits as Habit[] | undefined;
    const plan = body.plan as HabitPlan | undefined;

    if (!day || ![10, 20, 30].includes(day)) {
      return NextResponse.json({ error: "Valid check-in day required." }, { status: 400 });
    }

    if (!ratings?.length || ratings.length !== 3) {
      return NextResponse.json(
        { error: "Rate all 3 habits (1–5)." },
        { status: 400 }
      );
    }

    if (!reflection) {
      return NextResponse.json(
        { error: "Please write a short reflection." },
        { status: 400 }
      );
    }

    if (!habits?.length || !plan) {
      return NextResponse.json(
        { error: "Habits and plan are required." },
        { status: 400 }
      );
    }

    const habitsText = habits
      .map((h, i) => `${i + 1}. ${h.name} (rated ${ratings[i]}/5) — ${h.intention}`)
      .join("\n");

    const planText = JSON.stringify(plan, null, 2);

    const prompt = `You are an adaptive habit coach. The user checked in on Day ${day} of their 30-day plan.

Ratings (1= struggling, 5= crushing it):
${habitsText}

Reflection: "${reflection}"

Current plan:
${planText}

Adjust ONLY the remaining days (after Day ${day}) in the plan to match their progress. Keep the same JSON structure. If a habit scored low (1-2), simplify actions. If high (4-5), increase challenge slightly.

Return ONLY valid JSON:
{
  "message": "2 sentences: empathetic nudge based on their check-in.",
  "plan": { same plan structure with adjusted phases/items for remaining days }
}`;

    const parsed = await generateJSON<CheckInResult>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to adjust plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

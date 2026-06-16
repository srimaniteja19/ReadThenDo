import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type {
  ExperienceLevel,
  GoalObjective,
  TimeAvailable,
} from "@/types/habits";

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Complete beginner",
  some: "Some experience",
  intermediate: "Intermediate",
};

const TIME_LABELS: Record<TimeAvailable, string> = {
  "15min": "15 min",
  "30min": "30 min",
  "1hour": "1 hour",
  "2plus": "2+ hours",
};

const OBJECTIVE_LABELS: Record<GoalObjective, string> = {
  habit: "Build a habit",
  skill: "Gain a skill",
  fitness: "Get fit",
  project: "Create a project",
};

function buildPrompt(
  goal: string,
  bookSummary: string,
  level: ExperienceLevel,
  time: TimeAvailable,
  objective: GoalObjective
): string {
  return `You are a world-class coach for learning, fitness, and skill building.

The user has read a book and wants to apply its principles to a personal goal.

Book summary:
${bookSummary}

The user wants to: ${goal}
Experience level: ${LEVEL_LABELS[level]}
Time available per day: ${TIME_LABELS[time]}
Main objective: ${OBJECTIVE_LABELS[objective]}

Using the book's core framework and principles, generate exactly 3 actionable habits they can start immediately to achieve this goal. Each habit must explicitly connect the book's ideas to this specific goal. The 30-day plan must apply the book's methodology to help them achieve this goal at their experience level and available time.

Return ONLY valid JSON — no markdown, no backticks:
{
  "habits": [
    {
      "name": "Short habit name (max 6 words)",
      "why": "One sentence: why this habit is essential for achieving this goal using the book's framework.",
      "intention": "When [specific cue], I will [specific action] for [duration matching their available time]."
    }
  ],
  "plan": {
    "intro": "One sentence framing this 30-day journey applying the book to this specific goal.",
    "phases": [
      {
        "name": "Phase name relevant to the goal",
        "days": "Days 1–10",
        "focus": "One sentence focus for this phase.",
        "items": [
          { "day": "Days 1–3", "action": "Specific action tailored to level and time." },
          { "day": "Days 4–7", "action": "Specific action tailored to level and time." },
          { "day": "Days 8–10", "action": "Specific action tailored to level and time." }
        ]
      },
      {
        "name": "Phase name",
        "days": "Days 11–20",
        "focus": "One sentence focus.",
        "items": [
          { "day": "Days 11–14", "action": "Specific action." },
          { "day": "Days 15–17", "action": "Specific action." },
          { "day": "Days 18–20", "action": "Specific action." }
        ]
      },
      {
        "name": "Phase name",
        "days": "Days 21–30",
        "focus": "One sentence focus.",
        "items": [
          { "day": "Days 21–24", "action": "Specific action." },
          { "day": "Days 25–28", "action": "Specific action." },
          { "day": "Days 29–30", "action": "Specific action." }
        ]
      }
    ]
  }
}`;
}

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
    const goal = body.goal?.trim();
    const bookSummary = body.bookSummary?.trim();
    const level = body.level as ExperienceLevel;
    const time = body.time as TimeAvailable;
    const objective = body.objective as GoalObjective;

    if (!goal) {
      return NextResponse.json(
        { error: "Goal is required." },
        { status: 400 }
      );
    }

    if (!bookSummary) {
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

    const result = await model.generateContent(
      buildPrompt(goal, bookSummary, level, time, objective)
    );
    const rawText = result.response.text();
    const cleaned = stripMarkdownFences(rawText);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

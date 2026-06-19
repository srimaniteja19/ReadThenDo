import { NextRequest, NextResponse } from "next/server";
import { getAuthorModePrompt, type AuthorVoice } from "@/lib/authorMode";
import { ANTI_HABITS_INSTRUCTION, ANTI_HABITS_JSON } from "@/lib/antiHabitsPrompt";
import { generateJSON } from "@/lib/gemini";
import type {
  APIResponse,
  BookInput,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const books = body.books as BookInput[] | undefined;
    const goal = body.goal?.trim();
    const level = body.level as ExperienceLevel;
    const time = body.time as TimeAvailable;
    const objective = body.objective as GoalObjective;
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

    if (!goal) {
      return NextResponse.json({ error: "Goal is required." }, { status: 400 });
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

The user has read THREE books and wants ONE unified habit system applied to a specific personal goal.

Personal goal: ${goal}
Experience level: ${LEVEL_LABELS[level] ?? "beginner"}
Time available per day: ${TIME_LABELS[time] ?? "30 min"}
Main objective: ${OBJECTIVE_LABELS[objective] ?? "Build a habit"}

${booksText}

Your job:
1. Find cross-book consensus relevant to this goal.
2. Extract exactly 3 actionable habits synthesizing all three frameworks for this goal.
3. Build a unified 30-day plan at their experience level and available time.
4. Write synthesisInsight: one sentence (max 30 words) on what all three books agree matters for this goal.
${ANTI_HABITS_INSTRUCTION}
${authorPrompt}
Return ONLY valid JSON — no markdown:
{
  "synthesisInsight": "One sentence consensus for this goal.",
  "bookSources": ["Book 1 name", "Book 2 name", "Book 3 name"],
  ${ANTI_HABITS_JSON}
  "habits": [
    {
      "name": "Short habit name (max 6 words)",
      "why": "One sentence citing cross-book consensus for this goal.",
      "intention": "When [cue], I will [action] for [duration]."
    }
  ],
  "plan": {
    "intro": "One sentence framing this 30-day journey for the goal.",
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

    const parsed = await generateJSON<APIResponse>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to synthesize goal plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

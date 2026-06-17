import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

interface GenerateSummaryResult {
  summary: string;
  readingTimeMinutes: number;
  readingTimeLabel: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        { error: "Book title is required." },
        { status: 400 }
      );
    }

    const prompt = `You are a book summarizer. The user has NOT read this book yet and needs a concise summary to extract habits from.

Book title: "${title}"

Write a 150–250 word summary covering the book's core thesis, key frameworks, and main actionable ideas. Be accurate and practical.

Also estimate typical reading time for this book (average reader, full book).

Return ONLY valid JSON — no markdown:
{
  "summary": "The summary text.",
  "readingTimeMinutes": 480,
  "readingTimeLabel": "About 8 hours"
}`;

    const parsed = await generateJSON<GenerateSummaryResult>(prompt);
    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate summary.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

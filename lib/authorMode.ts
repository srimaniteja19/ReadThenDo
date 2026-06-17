import { BOOK_AUTHOR_MAP } from "@/lib/sampleBooks";

export type AuthorVoice =
  | "auto"
  | "James Clear"
  | "Cal Newport"
  | "Greg McKeown"
  | "Scott Young";

const VOICE_INSTRUCTIONS: Record<Exclude<AuthorVoice, "auto">, string> = {
  "James Clear":
    "Write entirely in James Clear's voice: warm, practical, story-driven, and conversational. Use simple language, small wins, and identity-based framing.",
  "Cal Newport":
    "Write entirely in Cal Newport's voice: dry, academic, rigorous, and precise. Avoid fluff. Be direct, evidence-based, and systematic.",
  "Greg McKeown":
    "Write entirely in Greg McKeown's voice: quiet, philosophical, gentle but firm. Emphasize tradeoffs, essential few, and graceful elimination.",
  "Scott Young":
    "Write entirely in Scott Young's voice: energetic, experimental, and direct. Focus on rapid learning, drills, and bold practice.",
};

const SYNTHESIS_VOICE =
  "Write in a unified mentor voice that weaves James Clear's warm practicality, Cal Newport's rigorous focus, and Greg McKeown's quiet essentialism — as if all three authors agreed on one system.";

export function detectAuthorFromText(...texts: string[]): string | null {
  const combined = texts.join(" ").toLowerCase();

  for (const [book, author] of Object.entries(BOOK_AUTHOR_MAP)) {
    if (combined.includes(book.toLowerCase()) || combined.includes(author.toLowerCase())) {
      return author;
    }
  }

  return null;
}

export function resolveAuthorVoice(
  voice: AuthorVoice,
  contextTexts: string[]
): string | null {
  if (voice !== "auto") return voice;
  return detectAuthorFromText(...contextTexts);
}

export function getAuthorModePrompt(
  authorMode: boolean,
  options: {
    voice?: AuthorVoice;
    contextTexts?: string[];
    synthesis?: boolean;
  } = {}
): string {
  if (!authorMode) return "";

  if (options.synthesis) {
    return `\n\nAUTHOR MODE — TONE:\n${SYNTHESIS_VOICE}\nApply this tone to every habit name, why, intention, plan intro, phase focus, and daily action.\n`;
  }

  const resolved = resolveAuthorVoice(
    options.voice ?? "auto",
    options.contextTexts ?? []
  );

  if (resolved && resolved in VOICE_INSTRUCTIONS) {
    return `\n\nAUTHOR MODE — TONE:\n${VOICE_INSTRUCTIONS[resolved as Exclude<AuthorVoice, "auto">]}\nApply this tone to every habit name, why, intention, plan intro, phase focus, and daily action.\n`;
  }

  return `\n\nAUTHOR MODE — TONE:\nMatch the book author's natural voice, vocabulary, and philosophical style throughout all output.\n`;
}

export const AUTHOR_VOICE_OPTIONS: { value: AuthorVoice; label: string }[] = [
  { value: "auto", label: "Auto-detect author" },
  { value: "James Clear", label: "James Clear — warm & practical" },
  { value: "Cal Newport", label: "Cal Newport — dry & rigorous" },
  { value: "Greg McKeown", label: "Greg McKeown — quiet & philosophical" },
  { value: "Scott Young", label: "Scott Young — bold & experimental" },
];

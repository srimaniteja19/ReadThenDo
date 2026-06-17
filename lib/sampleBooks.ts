export const SAMPLE_BOOKS = {
  "Atomic Habits":
    "Atomic Habits by James Clear argues tiny changes compound into remarkable results. Core framework: Four Laws of Behavior Change — make it obvious, attractive, easy, satisfying. Habit stacking links a new habit to an existing one. Environment design shapes behavior more than motivation. Identity-based habits: say 'I am a runner' not 'I want to run.' Two-minute rule: any new habit should take less than two minutes to start. Never miss twice is the key recovery rule.",
  "Deep Work":
    "Deep Work by Cal Newport defines deep work as distraction-free concentration that pushes cognitive capabilities to their limit. Four philosophies: monastic, bimodal, rhythmic, journalistic. Practices: time-block every minute of your workday, quit social media by default, embrace boredom instead of reaching for your phone, do a shutdown ritual each evening.",
  Essentialism:
    "Essentialism by Greg McKeown is about the disciplined pursuit of less. Core practices: protect time for thinking, use extreme criteria (if it's not a clear yes it's a no), create graceful scripts for declining requests, design routines that make the essential the default. Tradeoffs are real and must be made deliberately.",
  Ultralearning:
    "Ultralearning by Scott Young profiles people achieving mastery fast. Nine principles include: directness (learn by doing the real thing), retrieval (test yourself instead of rereading), drill (attack weaknesses), feedback (seek honest immediate feedback). Feynman technique: explain simply, find gaps, return to source, simplify again.",
} as const;

export const BOOK_AUTHOR_MAP: Record<string, string> = {
  "Atomic Habits": "James Clear",
  "Deep Work": "Cal Newport",
  Essentialism: "Greg McKeown",
  Ultralearning: "Scott Young",
};

export const SYNTHESIS_PRESET = [
  "Atomic Habits",
  "Deep Work",
  "Essentialism",
] as const;

"use client";

import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AuthorModeToggle from "@/components/AuthorModeToggle";
import CheckInForm from "@/components/CheckInForm";
import {
  BookInputToggle,
  ReadingTimeHint,
} from "@/components/BookInputToggle";
import { BattleInput, BattleResult } from "@/components/HabitBattle";
import GoalChips from "@/components/GoalChips";
import BentoHabits from "@/components/BentoHabits";
import BentoPlan from "@/components/BentoPlan";
import ModeSwitcher from "@/components/ModeSwitcher";
import ReadingStreak, { notifyStreakUpdated } from "@/components/ReadingStreak";
import StepDots from "@/components/StepDots";
import SynthesisInput from "@/components/SynthesisInput";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { buildPlanMarkdown } from "@/lib/exportMarkdown";
import type { AuthorVoice } from "@/lib/authorMode";
import { SAMPLE_BOOKS } from "@/lib/sampleBooks";
import { incrementStreak } from "@/lib/streak";
import type {
  APIResponse,
  AppMode,
  BookInput,
  CheckInDay,
  CustomGoalInput,
  ExperienceLevel,
  GoalObjective,
  HabitBattleResult,
  HabitDNA,
  TimeAvailable,
} from "@/types/habits";

type Screen = "input" | "loading" | "habits" | "plan" | "checkin";
type Step = "input" | "habits" | "plan";

const SYNTHESIS_LOADING_STEPS = [
  "Reading all three books…",
  "Finding cross-book consensus…",
  "Extracting unified habits…",
  "Building your 30-day system…",
];

const DEFAULT_SYNTHESIS_BOOKS: BookInput[] = [
  { name: "", summary: "" },
  { name: "", summary: "" },
  { name: "", summary: "" },
];

const BOOK_TITLE_LOADING_STEPS = [
  "Looking up the book…",
  "Generating summary…",
  "Extracting key habits…",
  "Building your 30-day plan…",
];

const BOOK_LOADING_STEPS = [
  "Reading your summary…",
  "Extracting key habits…",
  "Building your 30-day plan…",
];

const CUSTOM_LOADING_STEPS = [
  "Reading the book's framework…",
  "Applying it to your goal…",
  "Building your 30-day plan…",
];

const BATTLE_LOADING_STEPS = [
  "Reading both books…",
  "Comparing frameworks…",
  "Picking a winner…",
];

const DEFAULT_CUSTOM_GOAL: CustomGoalInput = {
  goal: "",
  bookSummary: "",
  level: "beginner",
  time: "30min",
  objective: "habit",
};

function screenToStep(screen: Screen): Step {
  if (screen === "plan" || screen === "checkin") return "plan";
  if (screen === "habits") return "habits";
  return "input";
}

function LoadingStepIcon({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: number;
}) {
  if (index < activeIndex) return <span>✓</span>;
  if (index === activeIndex) {
    return (
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 0 4px var(--accent-soft)",
        }}
      />
    );
  }
  return <span style={{ color: "var(--text-4)" }}>○</span>;
}

export default function Home() {
  const [mode, setMode] = useState<AppMode>("books");
  const [screen, setScreen] = useState<Screen>("input");
  const [data, setData] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const [summary, setSummary] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState<CustomGoalInput>(DEFAULT_CUSTOM_GOAL);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [selectedCustomBook, setSelectedCustomBook] = useState<string | null>(null);

  const [habitDNA, setHabitDNA] = useState<HabitDNA | null>(null);
  const [dnaLoading, setDnaLoading] = useState(false);
  const [habitOrder, setHabitOrder] = useState<number[]>([0, 1, 2]);
  const [checkInDay, setCheckInDay] = useState<CheckInDay>(10);
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const [battleBookA, setBattleBookA] = useState("");
  const [battleBookB, setBattleBookB] = useState("");
  const [battleBookAName, setBattleBookAName] = useState("Atomic Habits");
  const [battleBookBName, setBattleBookBName] = useState("Deep Work");
  const [battleGoal, setBattleGoal] = useState("");
  const [battleResult, setBattleResult] = useState<HabitBattleResult | null>(null);
  const [battleLoading, setBattleLoading] = useState(false);

  const [haventReadYet, setHaventReadYet] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [readingTimeLabel, setReadingTimeLabel] = useState<string | null>(null);
  const [activeBookTitle, setActiveBookTitle] = useState<string | null>(null);

  const [synthesisBooks, setSynthesisBooks] =
    useState<BookInput[]>(DEFAULT_SYNTHESIS_BOOKS);
  const [authorMode, setAuthorMode] = useState(false);
  const [authorVoice, setAuthorVoice] = useState<AuthorVoice>("auto");

  const loadingSteps =
    mode === "battle"
      ? BATTLE_LOADING_STEPS
      : mode === "synthesis"
        ? SYNTHESIS_LOADING_STEPS
        : haventReadYet && screen === "loading"
          ? BOOK_TITLE_LOADING_STEPS
          : mode === "books"
            ? BOOK_LOADING_STEPS
            : CUSTOM_LOADING_STEPS;

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (screen !== "loading") return;

    setLoadingStepIndex(0);
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [screen, loadingSteps.length]);

  const fetchHabitDNA = useCallback(
    async (habits: APIResponse["habits"], contextSummary?: string) => {
      setDnaLoading(true);
      setHabitDNA(null);
      try {
        const response = await fetch("/api/habit-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habits, summary: contextSummary }),
        });
        const result = await response.json();
        if (response.ok) {
          setHabitDNA(result);
        }
      } catch {
        /* DNA is optional enhancement */
      } finally {
        setDnaLoading(false);
      }
    },
    []
  );

  function resetSharedResults() {
    setData(null);
    setHabitDNA(null);
    setDnaLoading(false);
    setHabitOrder([0, 1, 2]);
    setCheckInMessage(null);
    setCheckInError(null);
    setCheckInDay(10);
  }

  function resetBookState() {
    setSummary("");
    setSelectedBook(null);
    setHaventReadYet(false);
    setBookTitle("");
    setReadingTimeLabel(null);
    setActiveBookTitle(null);
    resetSharedResults();
    setError(null);
    setScreen("input");
  }

  function resetCustomState() {
    setCustomGoal(DEFAULT_CUSTOM_GOAL);
    setActiveChip(null);
    setSelectedCustomBook(null);
    setHaventReadYet(false);
    setBookTitle("");
    setReadingTimeLabel(null);
    setActiveBookTitle(null);
    resetSharedResults();
    setError(null);
    setScreen("input");
  }

  function resetBattleState() {
    setBattleBookA("");
    setBattleBookB("");
    setBattleBookAName("Atomic Habits");
    setBattleBookBName("Deep Work");
    setBattleGoal("");
    setBattleResult(null);
    setBattleLoading(false);
    setError(null);
    setScreen("input");
  }

  function resetSynthesisState() {
    setSynthesisBooks(DEFAULT_SYNTHESIS_BOOKS);
    resetSharedResults();
    setError(null);
    setScreen("input");
  }

  function shareText(text: string) {
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    }
  }

  function handleModeChange(nextMode: AppMode) {
    if (nextMode === mode) return;

    if (mode === "books") resetBookState();
    else if (mode === "custom") resetCustomState();
    else if (mode === "synthesis") resetSynthesisState();
    else resetBattleState();

    setMode(nextMode);
  }

  async function generateSummaryFromTitle(title: string): Promise<string> {
    const response = await fetch("/api/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Failed to generate summary.");
    }

    setReadingTimeLabel(result.readingTimeLabel);
    return result.summary as string;
  }

  function finishExtraction(
    result: APIResponse,
    contextSummary?: string,
    title?: string | null
  ) {
    setData(result);
    setHabitOrder([0, 1, 2]);
    setActiveBookTitle(title ?? selectedBook ?? (bookTitle || null));
    setScreen("habits");
    showToast("3 habits extracted ✨");
    fetchHabitDNA(result.habits, contextSummary);
    incrementStreak();
    notifyStreakUpdated();
  }

  function handleCopyMarkdown() {
    if (!data) return;

    const markdown = buildPlanMarkdown(data, {
      bookTitle: activeBookTitle ?? undefined,
      habitDNA,
    });

    navigator.clipboard.writeText(markdown).then(
      () => showToast("Plan copied as Markdown ✨"),
      () => showToast("Could not copy to clipboard")
    );
  }

  async function handleExtract() {
    if (haventReadYet) {
      if (!bookTitle.trim()) {
        setError("Please enter a book title.");
        return;
      }
    } else if (!summary.trim()) {
      setError("Please paste a book summary first.");
      return;
    }

    setError(null);
    setScreen("loading");

    try {
      let summaryToUse = summary;

      if (haventReadYet) {
        summaryToUse = await generateSummaryFromTitle(bookTitle.trim());
        setSummary(summaryToUse);
      }

      const response = await fetch("/api/extract-habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: summaryToUse,
          authorMode,
          authorVoice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      finishExtraction(
        result,
        summaryToUse,
        haventReadYet ? bookTitle.trim() : selectedBook
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setScreen("input");
    }
  }

  async function handleGeneratePlan() {
    if (haventReadYet) {
      if (!bookTitle.trim()) {
        setError("Please enter a book title.");
        return;
      }
    } else if (!customGoal.bookSummary.trim()) {
      setError("Please paste a book summary first.");
      return;
    }

    if (!customGoal.goal.trim()) {
      setError("Please enter a goal first.");
      return;
    }

    setError(null);
    setScreen("loading");

    try {
      let payload = { ...customGoal };

      if (haventReadYet) {
        const generated = await generateSummaryFromTitle(bookTitle.trim());
        payload = { ...customGoal, bookSummary: generated };
        setCustomGoal(payload);
      }

      const response = await fetch("/api/custom-goal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          authorMode,
          authorVoice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      finishExtraction(
        result,
        payload.bookSummary,
        haventReadYet ? bookTitle.trim() : selectedCustomBook
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setScreen("input");
    }
  }

  async function handleSynthesize() {
    if (!synthesisBooks.every((book) => book.summary.trim())) {
      setError("Please paste all 3 book summaries.");
      return;
    }

    setError(null);
    setScreen("loading");

    try {
      const response = await fetch("/api/synthesize-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          books: synthesisBooks,
          authorMode,
          authorVoice,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      const bookNames = result.bookSources?.length
        ? result.bookSources.join(" + ")
        : synthesisBooks.map((b) => b.name || "Book").join(" + ");

      finishExtraction(
        result,
        synthesisBooks.map((b) => b.summary).join("\n\n"),
        bookNames
      );
      showToast("Unified system ready ✨");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setScreen("input");
    }
  }

  async function handleBattle() {
    if (!battleBookA.trim() || !battleBookB.trim()) {
      setError("Paste both book summaries.");
      return;
    }
    if (!battleGoal.trim()) {
      setError("Enter your goal for the comparison.");
      return;
    }

    setError(null);
    setBattleLoading(true);
    setScreen("loading");

    try {
      const response = await fetch("/api/habit-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookA: battleBookA,
          bookB: battleBookB,
          bookAName: battleBookAName,
          bookBName: battleBookBName,
          goal: battleGoal,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      setBattleResult(result);
      setScreen("input");
      showToast("Battle complete ⚔️");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setScreen("input");
    } finally {
      setBattleLoading(false);
    }
  }

  async function handleCheckInSubmit(ratings: number[], reflection: string) {
    if (!data) return;

    setCheckInLoading(true);
    setCheckInError(null);

    try {
      const response = await fetch("/api/adjust-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: checkInDay,
          ratings,
          reflection,
          habits: data.habits,
          plan: data.plan,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      setData({ ...data, plan: result.plan });
      setCheckInMessage(result.message);
      setScreen("plan");
      showToast(`Day ${checkInDay} check-in saved ✨`);
    } catch (err) {
      setCheckInError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setCheckInLoading(false);
    }
  }

  function handleStartOver() {
    if (mode === "books") {
      resetBookState();
    } else if (mode === "custom") {
      resetCustomState();
    } else if (mode === "synthesis") {
      resetSynthesisState();
    } else {
      resetBattleState();
    }
  }

  function handleGoalChipSelect(
    goal: string,
    defaults: Partial<CustomGoalInput>
  ) {
    setCustomGoal((prev) => ({ ...prev, ...defaults, goal }));
    setActiveChip(goal);
    setError(null);
  }

  function updateCustomGoal<K extends keyof CustomGoalInput>(
    key: K,
    value: CustomGoalInput[K]
  ) {
    setCustomGoal((prev) => ({ ...prev, [key]: value }));
    if (key === "goal") {
      setActiveChip(null);
    }
    if (key === "bookSummary") {
      setSelectedCustomBook(null);
    }
    setError(null);
  }

  const step = screenToStep(screen);

  return (
    <>
      <ThemeToggle />
      <Toast message={toast} onDismiss={() => setToast(null)} />

      <div
        className={`page-shell ${
          screen === "habits" ||
          screen === "plan" ||
          screen === "checkin"
            ? "page-shell--bento"
            : ""
        }`}
      >
        <header className="hero" style={{ marginBottom: 32 }}>
          <div>
            <h1 className="app-logo" aria-label="ReadThenDo">
              <span className="app-logo-read">Read</span>
              <span className="app-logo-then">Then</span>
              <span className="app-logo-do">Do</span>
            </h1>
            <p className="hero-tagline">
              Turn books into habits. Start in 30 days.
            </p>
            <div className="journey-row">
              <span>📖</span>
              <span className="arrow">→</span>
              <span>✨</span>
              <span className="arrow">→</span>
              <span>🌱</span>
            </div>
            <ReadingStreak />
          </div>

          <div className="flex justify-center">
            <ModeSwitcher mode={mode} onChange={handleModeChange} />
          </div>

          {mode !== "battle" && (
            <div className="mt-8">
              <StepDots currentStep={step} />
            </div>
          )}
        </header>

        <main className={`section-gap screen-panel`}>
          {screen === "input" && mode === "books" && (
            <>
              <div>
                <BookInputToggle
                  enabled={haventReadYet}
                  onToggle={(enabled) => {
                    setHaventReadYet(enabled);
                    setError(null);
                    if (!enabled) setReadingTimeLabel(null);
                  }}
                />

                {haventReadYet ? (
                  <>
                    <label
                      htmlFor="book-title"
                      className="section-heading mb-3 block"
                    >
                      Book title
                    </label>
                    <input
                      id="book-title"
                      type="text"
                      value={bookTitle}
                      onChange={(e) => {
                        setBookTitle(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. Atomic Habits, Deep Work, Essentialism…"
                      className="distill-input"
                    />
                    {readingTimeLabel && (
                      <ReadingTimeHint label={readingTimeLabel} />
                    )}
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="summary"
                      className="section-heading mb-3 block"
                    >
                      Book summary
                    </label>
                    <textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => {
                        setSummary(e.target.value);
                        setSelectedBook(null);
                        setError(null);
                      }}
                      placeholder="Paste a book summary here…"
                      rows={8}
                      className="distill-textarea"
                    />
                    <p className="label-meta mt-2 text-right">
                      {summary.length.toLocaleString()} characters
                    </p>
                  </>
                )}
              </div>

              {!haventReadYet && (
                <div>
                  <p className="section-heading mb-3">Load sample</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SAMPLE_BOOKS).map(([title, text]) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => {
                          setSummary(text);
                          setSelectedBook(title);
                          setError(null);
                        }}
                        className={`chip ${
                          selectedBook === title ? "chip-active" : ""
                        }`}
                      >
                        📖 {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className="error-banner">{error}</div>}

              <AuthorModeToggle
                enabled={authorMode}
                voice={authorVoice}
                onToggle={setAuthorMode}
                onVoiceChange={setAuthorVoice}
              />

              <button
                type="button"
                onClick={handleExtract}
                disabled={
                  haventReadYet ? !bookTitle.trim() : !summary.trim()
                }
                className="btn-primary btn-primary-shimmer"
              >
                <Sparkles size={16} />
                {haventReadYet ? "Generate summary & extract habits" : "Extract habits"}
              </button>
            </>
          )}

          {screen === "input" && mode === "custom" && (
            <>
              <div>
                <BookInputToggle
                  enabled={haventReadYet}
                  onToggle={(enabled) => {
                    setHaventReadYet(enabled);
                    setError(null);
                    if (!enabled) setReadingTimeLabel(null);
                  }}
                />

                {haventReadYet ? (
                  <>
                    <label
                      htmlFor="custom-book-title"
                      className="section-heading mb-3 block"
                    >
                      Book title
                    </label>
                    <input
                      id="custom-book-title"
                      type="text"
                      value={bookTitle}
                      onChange={(e) => {
                        setBookTitle(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. Atomic Habits, Ultralearning…"
                      className="distill-input"
                    />
                    {readingTimeLabel && (
                      <ReadingTimeHint label={readingTimeLabel} />
                    )}
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="custom-summary"
                      className="section-heading mb-3 block"
                    >
                      Book summary
                    </label>
                    <textarea
                      id="custom-summary"
                      value={customGoal.bookSummary}
                      onChange={(e) =>
                        updateCustomGoal("bookSummary", e.target.value)
                      }
                      placeholder="Paste the book summary you want to build your plan from…"
                      rows={6}
                      className="distill-textarea"
                    />
                    <p className="label-meta mt-2 text-right">
                      {customGoal.bookSummary.length.toLocaleString()} characters
                    </p>
                  </>
                )}
              </div>

              {!haventReadYet && (
                <div>
                  <p className="section-heading mb-3">Load sample book</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SAMPLE_BOOKS).map(([title, text]) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => {
                          updateCustomGoal("bookSummary", text);
                          setSelectedCustomBook(title);
                        }}
                        className={`chip ${
                          selectedCustomBook === title ? "chip-active" : ""
                        }`}
                      >
                        📖 {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="section-heading mb-3">Quick select goal</p>
                <GoalChips
                  activeGoal={activeChip}
                  onSelect={handleGoalChipSelect}
                />
              </div>

              <div>
                <label htmlFor="goal" className="section-heading mb-3 block">
                  What do you want to start doing?
                </label>
                <input
                  id="goal"
                  type="text"
                  value={customGoal.goal}
                  onChange={(e) => updateCustomGoal("goal", e.target.value)}
                  placeholder="e.g. learn PostgreSQL, go to the gym, start hiking..."
                  className="distill-input"
                />
              </div>

              <div>
                <label htmlFor="level" className="section-heading mb-3 block">
                  Experience level
                </label>
                <select
                  id="level"
                  value={customGoal.level}
                  onChange={(e) =>
                    updateCustomGoal("level", e.target.value as ExperienceLevel)
                  }
                  className="distill-select"
                >
                  <option value="beginner">Complete beginner</option>
                  <option value="some">Some experience</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>

              <div>
                <label htmlFor="time" className="section-heading mb-3 block">
                  Time available per day
                </label>
                <select
                  id="time"
                  value={customGoal.time}
                  onChange={(e) =>
                    updateCustomGoal("time", e.target.value as TimeAvailable)
                  }
                  className="distill-select"
                >
                  <option value="15min">15 min</option>
                  <option value="30min">30 min</option>
                  <option value="1hour">1 hour</option>
                  <option value="2plus">2+ hours</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="objective"
                  className="section-heading mb-3 block"
                >
                  Your main goal
                </label>
                <select
                  id="objective"
                  value={customGoal.objective}
                  onChange={(e) =>
                    updateCustomGoal(
                      "objective",
                      e.target.value as GoalObjective
                    )
                  }
                  className="distill-select"
                >
                  <option value="habit">Build a habit</option>
                  <option value="skill">Gain a skill</option>
                  <option value="fitness">Get fit</option>
                  <option value="project">Create a project</option>
                </select>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <AuthorModeToggle
                enabled={authorMode}
                voice={authorVoice}
                onToggle={setAuthorMode}
                onVoiceChange={setAuthorVoice}
              />

              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={
                  !customGoal.goal.trim() ||
                  (haventReadYet
                    ? !bookTitle.trim()
                    : !customGoal.bookSummary.trim())
                }
                className="btn-primary btn-primary-shimmer"
              >
                <Sparkles size={16} />
                {haventReadYet
                  ? "Generate summary & build plan"
                  : "Generate my plan"}
              </button>
            </>
          )}

          {screen === "input" && mode === "synthesis" && (
            <>
              <AuthorModeToggle
                enabled={authorMode}
                voice={authorVoice}
                onToggle={setAuthorMode}
                onVoiceChange={setAuthorVoice}
              />
              <SynthesisInput
                books={synthesisBooks}
                onChange={setSynthesisBooks}
                onSubmit={handleSynthesize}
                error={error}
              />
            </>
          )}

          {screen === "input" && mode === "battle" && !battleResult && (
            <BattleInput
              bookA={battleBookA}
              bookB={battleBookB}
              bookAName={battleBookAName}
              bookBName={battleBookBName}
              goal={battleGoal}
              onBookAChange={setBattleBookA}
              onBookBChange={setBattleBookB}
              onBookANameChange={setBattleBookAName}
              onBookBNameChange={setBattleBookBName}
              onGoalChange={setBattleGoal}
              onCompare={handleBattle}
              error={error}
              loading={battleLoading}
            />
          )}

          {screen === "input" && mode === "battle" && battleResult && (
            <BattleResult
              result={battleResult}
              bookAName={battleBookAName}
              bookBName={battleBookBName}
              onStartOver={resetBattleState}
              onShare={() =>
                shareText(
                  `${battleResult.verdict} — ${battleResult.winnerName} wins for "${battleGoal}" on ReadThenDo`
                )
              }
            />
          )}

          {screen === "loading" && (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              style={{ gap: 24 }}
            >
              <div className="loading-orb" />
              <p className="loading-label">
                {mode === "battle"
                  ? "Comparing habit systems…"
                  : mode === "synthesis"
                    ? "Synthesizing across three books…"
                    : mode === "books"
                      ? "Analyzing your book summary…"
                      : "Applying the book to your goal…"}
              </p>
              <ul className="card-gap" style={{ listStyle: "none", padding: 0 }}>
                {loadingSteps.map((label, index) => (
                  <li
                    key={label}
                    className={`loading-step flex items-center justify-center gap-2 ${
                      index < loadingStepIndex
                        ? "loading-step--done"
                        : index === loadingStepIndex
                          ? "loading-step--active"
                          : ""
                    }`}
                  >
                    <LoadingStepIcon
                      index={index}
                      activeIndex={loadingStepIndex}
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {screen === "habits" && data && (
            <BentoHabits
              data={data}
              subtitle={
                mode === "synthesis"
                  ? "Three books, one system — these habits reflect what all three agree on."
                  : mode === "books"
                    ? "Here are 3 habits you can start today, grounded in the book's framework."
                    : `Here are 3 habits to ${customGoal.goal.toLowerCase()}, built on the book's framework.`
              }
              habitDNA={habitDNA}
              dnaLoading={dnaLoading}
              habitOrder={habitOrder}
              onOrderChange={setHabitOrder}
              onViewPlan={() => setScreen("plan")}
              onCopy={showToast}
              onShareDNA={() =>
                habitDNA &&
                shareText(
                  `${habitDNA.emoji} I'm a ${habitDNA.label} — ${habitDNA.tagline}`
                )
              }
            />
          )}

          {screen === "plan" && data && (
            <BentoPlan
              data={data}
              showBackToHabits={mode !== "battle"}
              checkInMessage={checkInMessage}
              onBackToHabits={() => setScreen("habits")}
              onStartOver={handleStartOver}
              onCheckIn={(day) => {
                setCheckInDay(day);
                setCheckInError(null);
                setScreen("checkin");
              }}
              onCopyMarkdown={handleCopyMarkdown}
            />
          )}

          {screen === "checkin" && data && (
            <CheckInForm
              data={data}
              day={checkInDay}
              onDayChange={setCheckInDay}
              onSubmit={handleCheckInSubmit}
              onBack={() => setScreen("plan")}
              loading={checkInLoading}
              error={checkInError}
            />
          )}
        </main>
      </div>
    </>
  );
}

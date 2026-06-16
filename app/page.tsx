"use client";

import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import GoalChips from "@/components/GoalChips";
import BentoHabits from "@/components/BentoHabits";
import BentoPlan from "@/components/BentoPlan";
import ModeSwitcher from "@/components/ModeSwitcher";
import StepDots from "@/components/StepDots";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import type {
  APIResponse,
  CustomGoalInput,
  ExperienceLevel,
  GoalObjective,
  TimeAvailable,
} from "@/types/habits";

type AppMode = "books" | "custom";
type Screen = "input" | "loading" | "habits" | "plan";
type Step = "input" | "habits" | "plan";

const SAMPLE_BOOKS = {
  "Atomic Habits":
    "Atomic Habits by James Clear argues tiny changes compound into remarkable results. Core framework: Four Laws of Behavior Change — make it obvious, attractive, easy, satisfying. Habit stacking links a new habit to an existing one. Environment design shapes behavior more than motivation. Identity-based habits: say 'I am a runner' not 'I want to run.' Two-minute rule: any new habit should take less than two minutes to start. Never miss twice is the key recovery rule.",
  "Deep Work":
    "Deep Work by Cal Newport defines deep work as distraction-free concentration that pushes cognitive capabilities to their limit. Four philosophies: monastic, bimodal, rhythmic, journalistic. Practices: time-block every minute of your workday, quit social media by default, embrace boredom instead of reaching for your phone, do a shutdown ritual each evening.",
  Essentialism:
    "Essentialism by Greg McKeown is about the disciplined pursuit of less. Core practices: protect time for thinking, use extreme criteria (if it's not a clear yes it's a no), create graceful scripts for declining requests, design routines that make the essential the default. Tradeoffs are real and must be made deliberately.",
  Ultralearning:
    "Ultralearning by Scott Young profiles people achieving mastery fast. Nine principles include: directness (learn by doing the real thing), retrieval (test yourself instead of rereading), drill (attack weaknesses), feedback (seek honest immediate feedback). Feynman technique: explain simply, find gaps, return to source, simplify again.",
} as const;

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

const DEFAULT_CUSTOM_GOAL: CustomGoalInput = {
  goal: "",
  bookSummary: "",
  level: "beginner",
  time: "30min",
  objective: "habit",
};

function screenToStep(screen: Screen): Step {
  if (screen === "plan") return "plan";
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
        className="inline-block h-2 w-2 rounded-full step-dot-pulse"
        style={{ background: "var(--accent)" }}
      />
    );
  }
  return <span style={{ color: "var(--text-muted)" }}>○</span>;
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

  const loadingSteps =
    mode === "books" ? BOOK_LOADING_STEPS : CUSTOM_LOADING_STEPS;

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

  function resetBookState() {
    setSummary("");
    setSelectedBook(null);
    setData(null);
    setError(null);
    setScreen("input");
  }

  function resetCustomState() {
    setCustomGoal(DEFAULT_CUSTOM_GOAL);
    setActiveChip(null);
    setSelectedCustomBook(null);
    setData(null);
    setError(null);
    setScreen("input");
  }

  function handleModeChange(nextMode: AppMode) {
    if (nextMode === mode) return;

    if (mode === "books") {
      resetBookState();
    } else {
      resetCustomState();
    }

    setMode(nextMode);
  }

  async function handleExtract() {
    if (!summary.trim()) {
      setError("Please paste a book summary first.");
      return;
    }

    setError(null);
    setScreen("loading");

    try {
      const response = await fetch("/api/extract-habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      setData(result);
      setScreen("habits");
      showToast("3 habits extracted ✨");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setScreen("input");
    }
  }

  async function handleGeneratePlan() {
    if (!customGoal.bookSummary.trim()) {
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
      const response = await fetch("/api/custom-goal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customGoal),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      setData(result);
      setScreen("habits");
      showToast("3 habits extracted ✨");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setScreen("input");
    }
  }

  function handleStartOver() {
    if (mode === "books") {
      resetBookState();
    } else {
      resetCustomState();
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
        className={`page-shell ${screen === "habits" || screen === "plan" ? "page-shell--bento" : ""}`}
      >
        <header className="hero section-gap" style={{ marginBottom: 32 }}>
          <div>
            <h1 className="app-logo" aria-label="ReadThenDo">
              <span className="app-logo-read">Read</span>
              <span className="app-logo-then">Then</span>
              <span className="app-logo-do">Do</span>
            </h1>
            <p className="hero-tagline">
              Turn books into habits. Start in 30 days.
            </p>
            <div className="hero-emoji-row">
              <span>📖</span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span>✨</span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span>🌱</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ModeSwitcher mode={mode} onChange={handleModeChange} />
          </div>

          <StepDots currentStep={step} />
        </header>

        <main className="section-gap">
          {screen === "input" && mode === "books" && (
            <>
              <div>
                <label htmlFor="summary" className="section-heading mb-3 block">
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
              </div>

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

              {error && <div className="error-banner">{error}</div>}

              <button
                type="button"
                onClick={handleExtract}
                disabled={!summary.trim()}
                className="btn-primary btn-primary-shimmer"
              >
                <Sparkles size={16} />
                Extract habits
              </button>
            </>
          )}

          {screen === "input" && mode === "custom" && (
            <>
              <div>
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
              </div>

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

              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={
                  !customGoal.goal.trim() || !customGoal.bookSummary.trim()
                }
                className="btn-primary btn-primary-shimmer"
              >
                <Sparkles size={16} />
                Generate my plan
              </button>
            </>
          )}

          {screen === "loading" && (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              style={{ gap: 24 }}
            >
              <div className="loading-orb" />
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                {mode === "books"
                  ? "Analyzing your book summary…"
                  : "Applying the book to your goal…"}
              </p>
              <ul className="card-gap" style={{ listStyle: "none", padding: 0 }}>
                {loadingSteps.map((label, index) => (
                  <li
                    key={label}
                    className="loading-step flex items-center justify-center gap-2"
                    style={{
                      color:
                        index <= loadingStepIndex
                          ? "var(--accent-text)"
                          : "var(--text-muted)",
                      fontSize: 14,
                    }}
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
                mode === "books"
                  ? "Here are 3 habits you can start today, grounded in the book's framework."
                  : `Here are 3 habits to ${customGoal.goal.toLowerCase()}, built on the book's framework.`
              }
              onViewPlan={() => setScreen("plan")}
              onCopy={showToast}
            />
          )}

          {screen === "plan" && data && (
            <BentoPlan
              data={data}
              showBackToHabits={mode === "books"}
              onBackToHabits={() => setScreen("habits")}
              onStartOver={handleStartOver}
            />
          )}
        </main>
      </div>
    </>
  );
}

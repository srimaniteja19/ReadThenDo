"use client";

import { Sparkles } from "lucide-react";
import { SAMPLE_BOOKS, SYNTHESIS_PRESET } from "@/lib/sampleBooks";
import type {
  BookInput,
  ExperienceLevel,
  GoalObjective,
  TimeAvailable,
} from "@/types/habits";

interface SynthesisInputProps {
  books: BookInput[];
  onChange: (books: BookInput[]) => void;
  onSubmit: () => void;
  error: string | null;
  loading?: boolean;
  useGoal: boolean;
  onUseGoalChange: (value: boolean) => void;
  goal: string;
  onGoalChange: (value: string) => void;
  level: ExperienceLevel;
  onLevelChange: (value: ExperienceLevel) => void;
  time: TimeAvailable;
  onTimeChange: (value: TimeAvailable) => void;
  objective: GoalObjective;
  onObjectiveChange: (value: GoalObjective) => void;
}

export default function SynthesisInput({
  books,
  onChange,
  onSubmit,
  error,
  loading,
  useGoal,
  onUseGoalChange,
  goal,
  onGoalChange,
  level,
  onLevelChange,
  time,
  onTimeChange,
  objective,
  onObjectiveChange,
}: SynthesisInputProps) {
  function updateBook(index: number, field: keyof BookInput, value: string) {
    const next = books.map((book, i) =>
      i === index ? { ...book, [field]: value } : book
    );
    onChange(next);
  }

  function loadPreset() {
    onChange(
      SYNTHESIS_PRESET.map((title) => ({
        name: title,
        summary: SAMPLE_BOOKS[title],
      }))
    );
  }

  const allFilled = books.every((book) => book.summary.trim());
  const goalReady = !useGoal || goal.trim();

  return (
    <div className="section-gap">
      <section className="glass-card phase-enter synthesis-intro">
        <p className="section-heading mb-2">Multi-book synthesis</p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.65 }}>
          Paste 3 book summaries. We&apos;ll find the highest-signal habits that
          appear across all three and build one unified 30-day system.
        </p>
        <button type="button" onClick={loadPreset} className="chip mt-4">
          ✨ Load Atomic Habits + Deep Work + Essentialism
        </button>
      </section>

      {books.map((book, index) => (
        <section key={index} className="glass-card synthesis-book phase-enter">
          <input
            type="text"
            value={book.name}
            onChange={(e) => updateBook(index, "name", e.target.value)}
            placeholder={`Book ${index + 1} title`}
            className="distill-input mb-3"
            aria-label={`Book ${index + 1} title`}
          />
          <textarea
            value={book.summary}
            onChange={(e) => updateBook(index, "summary", e.target.value)}
            placeholder={`Paste summary for book ${index + 1}…`}
            rows={5}
            className="distill-textarea"
          />
          <p className="label-meta mt-2 text-right">
            {book.summary.length.toLocaleString()} characters
          </p>
        </section>
      ))}

      <section className="glass-card phase-enter synthesis-goal">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={useGoal}
            onChange={(e) => onUseGoalChange(e.target.checked)}
          />
          <span className="toggle-switch-track">
            <span className="toggle-switch-thumb" />
          </span>
          <span>Apply unified system to a personal goal</span>
        </label>

        {useGoal && (
          <div className="card-gap mt-4">
            <input
              type="text"
              value={goal}
              onChange={(e) => onGoalChange(e.target.value)}
              placeholder="e.g. learn PostgreSQL, build a morning routine…"
              className="distill-input"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={level}
                onChange={(e) => onLevelChange(e.target.value as ExperienceLevel)}
                className="distill-select flex-1"
              >
                <option value="beginner">Complete beginner</option>
                <option value="some">Some experience</option>
                <option value="intermediate">Intermediate</option>
              </select>
              <select
                value={time}
                onChange={(e) => onTimeChange(e.target.value as TimeAvailable)}
                className="distill-select flex-1"
              >
                <option value="15min">15 min</option>
                <option value="30min">30 min</option>
                <option value="1hour">1 hour</option>
                <option value="2plus">2+ hours</option>
              </select>
              <select
                value={objective}
                onChange={(e) => onObjectiveChange(e.target.value as GoalObjective)}
                className="distill-select flex-1"
              >
                <option value="habit">Build a habit</option>
                <option value="skill">Gain a skill</option>
                <option value="fitness">Get fit</option>
                <option value="project">Create a project</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {error && <div className="error-banner">{error}</div>}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!allFilled || !goalReady || loading}
        className="btn-primary btn-primary-shimmer"
      >
        <Sparkles size={16} />
        {loading
          ? "Synthesizing…"
          : useGoal
            ? "Build goal-focused unified system"
            : "Build unified system"}
      </button>
    </div>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import type { APIResponse, CheckInDay, Habit } from "@/types/habits";

interface CheckInFormProps {
  data: APIResponse;
  day: CheckInDay;
  onDayChange: (day: CheckInDay) => void;
  onSubmit: (ratings: number[], reflection: string) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function CheckInForm({
  data,
  day,
  onDayChange,
  onSubmit,
  onBack,
  loading,
  error,
}: CheckInFormProps) {
  const [ratings, setRatings] = useState<number[]>([3, 3, 3]);
  const [reflection, setReflection] = useState("");

  function setRating(index: number, value: number) {
    setRatings((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  return (
    <div className="section-gap">
      <section className="glass-card phase-enter">
        <p className="section-heading mb-2">AI check-in</p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Rate your habits and we&apos;ll adjust the rest of your plan.
        </p>

        <div className="checkin-days">
          {([10, 20, 30] as CheckInDay[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDayChange(d)}
              className={`chip ${day === d ? "chip-active" : ""}`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </section>

      {data.habits.map((habit: Habit, index) => (
        <section key={habit.name} className="glass-card checkin-habit phase-enter">
          <p className="card-title mb-3">{habit.name}</p>
          <div className="checkin-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(index, value)}
                className={`checkin-rating-btn ${
                  ratings[index] === value ? "checkin-rating-btn--active" : ""
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="label-meta mt-2">
            {ratings[index] <= 2
              ? "Struggling"
              : ratings[index] >= 4
                ? "Crushing it"
                : "Steady progress"}
          </p>
        </section>
      ))}

      <section className="glass-card phase-enter">
        <label htmlFor="reflection" className="section-heading mb-3 block">
          One sentence — how&apos;s it going?
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="e.g. Habit 2 is sticking but mornings are still hard…"
          rows={3}
          className="distill-textarea"
        />
      </section>

      {error && <div className="error-banner">{error}</div>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onBack} className="btn-ghost flex-1">
          Back to plan
        </button>
        <button
          type="button"
          onClick={() => onSubmit(ratings, reflection)}
          disabled={!reflection.trim() || loading}
          className="btn-primary flex-1"
        >
          <Sparkles size={16} />
          {loading ? "Adjusting plan…" : `Submit Day ${day} check-in`}
        </button>
      </div>
    </div>
  );
}

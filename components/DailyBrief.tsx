"use client";

import type { HabitPlan } from "@/types/habits";
import {
  getPlanDayNumber,
  getTodayAction,
  isDayCompleted,
  toggleDayCompleted,
} from "@/lib/planProgress";

interface DailyBriefProps {
  plan: HabitPlan;
  planStartDate: string;
  completedDays: number[];
  onStartDateChange: (date: string) => void;
  onCompletedDaysChange: (days: number[]) => void;
  compact?: boolean;
}

export default function DailyBrief({
  plan,
  planStartDate,
  completedDays,
  onStartDateChange,
  onCompletedDaysChange,
  compact = false,
}: DailyBriefProps) {
  const planDay = getPlanDayNumber(planStartDate);
  const today = getTodayAction(plan, planDay);
  const done = today ? isDayCompleted(completedDays, planDay) : false;

  function handleToggleDone() {
    if (!today) return;
    onCompletedDaysChange(toggleDayCompleted(completedDays, planDay));
  }

  if (planDay > 30) {
    return (
      <section className={`daily-brief glass-card phase-enter ${compact ? "daily-brief--compact" : ""}`}>
        <p className="section-heading mb-2">Daily brief</p>
        <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>
          30-day plan complete. Great work finishing the journey.
        </p>
      </section>
    );
  }

  return (
    <section className={`daily-brief glass-card phase-enter ${compact ? "daily-brief--compact" : ""}`}>
      <div className="daily-brief-header">
        <p className="section-heading mb-0">Daily brief</p>
        <span className="daily-brief-day">Day {planDay} of 30</span>
      </div>

      <label className="daily-brief-date">
        <span className="label-meta">Plan start date</span>
        <input
          type="date"
          value={planStartDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="distill-input"
        />
      </label>

      {today ? (
        <>
          <p className="label-meta mt-3">{today.phaseName} · {today.dayLabel}</p>
          <p className="daily-brief-action">{today.action}</p>
          <label className="daily-brief-check">
            <input type="checkbox" checked={done} onChange={handleToggleDone} />
            <span>Mark today&apos;s action done</span>
          </label>
        </>
      ) : (
        <p className="label-meta mt-3">No action mapped for today.</p>
      )}
    </section>
  );
}

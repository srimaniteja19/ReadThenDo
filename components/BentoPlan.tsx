"use client";

import PlanPhase from "@/components/PlanPhase";
import type { APIResponse } from "@/types/habits";

interface BentoPlanProps {
  data: APIResponse;
  showBackToHabits: boolean;
  onBackToHabits: () => void;
  onStartOver: () => void;
}

export default function BentoPlan({
  data,
  showBackToHabits,
  onBackToHabits,
  onStartOver,
}: BentoPlanProps) {
  return (
    <div className="bento-results">
      <div className="bento-grid bento-grid--plan">
        <section className="bento-cell bento-intro glass-card phase-enter">
          <p className="section-heading mb-2">30-day plan</p>
          <p
            className="card-title mb-2"
            style={{ fontSize: 18, lineHeight: 1.45 }}
          >
            {data.plan.intro}
          </p>
          <div className="bento-stats">
            <span className="bento-stat">
              <strong>3</strong> phases
            </span>
            <span className="bento-stat">
              <strong>30</strong> days
            </span>
          </div>
        </section>

        {data.plan.phases.map((phase, index) => (
          <div
            key={phase.days}
            className={`bento-cell bento-phase bento-phase-${index + 1}`}
          >
            <PlanPhase phase={phase} index={index} bento />
          </div>
        ))}

        <div className="bento-cell bento-actions phase-enter">
          <div className="flex flex-col gap-3 sm:flex-row">
            {showBackToHabits && (
              <button
                type="button"
                onClick={onBackToHabits}
                className="btn-ghost flex-1"
              >
                Back to habits
              </button>
            )}
            <button
              type="button"
              onClick={onStartOver}
              className={`btn-ghost ${showBackToHabits ? "flex-1" : "w-full"}`}
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

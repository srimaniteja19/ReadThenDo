"use client";

import { Copy } from "lucide-react";
import PlanPhase from "@/components/PlanPhase";
import type { CheckInDay, APIResponse } from "@/types/habits";

interface BentoPlanProps {
  data: APIResponse;
  showBackToHabits: boolean;
  checkInMessage?: string | null;
  onBackToHabits: () => void;
  onStartOver: () => void;
  onCheckIn: (day: CheckInDay) => void;
  onCopyMarkdown?: () => void;
}

export default function BentoPlan({
  data,
  showBackToHabits,
  checkInMessage,
  onBackToHabits,
  onStartOver,
  onCheckIn,
  onCopyMarkdown,
}: BentoPlanProps) {
  return (
    <div className="bento-results section-gap">
      {checkInMessage && (
        <section className="glass-card checkin-nudge phase-enter">
          <p className="section-heading mb-2">Coach nudge</p>
          <p style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.65 }}>
            {checkInMessage}
          </p>
        </section>
      )}

      {data.synthesisInsight && (
        <section className="synthesis-insight glass-card phase-enter">
          <p className="section-heading mb-2">Cross-book consensus</p>
          <p className="synthesis-insight-text">{data.synthesisInsight}</p>
          {data.bookSources && data.bookSources.length > 0 && (
            <div className="bento-stats mt-3">
              {data.bookSources.map((source) => (
                <span key={source} className="bento-stat">
                  📖 {source}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

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
          <p className="section-heading mb-3">AI check-ins</p>
          <div className="checkin-days mb-4">
            {([10, 20, 30] as CheckInDay[]).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => onCheckIn(day)}
                className="chip"
              >
                Check in Day {day}
              </button>
            ))}
          </div>
          {onCopyMarkdown && (
            <button
              type="button"
              onClick={onCopyMarkdown}
              className="btn-ghost w-full mb-3"
            >
              <Copy size={16} />
              Copy plan as Markdown
            </button>
          )}
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

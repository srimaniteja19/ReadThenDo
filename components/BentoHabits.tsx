"use client";

import { Sparkles } from "lucide-react";
import HabitCard from "@/components/HabitCard";
import type { APIResponse } from "@/types/habits";

interface BentoHabitsProps {
  data: APIResponse;
  subtitle: string;
  onViewPlan: () => void;
  onCopy?: (message: string) => void;
}

export default function BentoHabits({
  data,
  subtitle,
  onViewPlan,
  onCopy,
}: BentoHabitsProps) {
  return (
    <div className="bento-results">
      <div className="bento-grid bento-grid--habits">
        <section className="bento-cell bento-intro glass-card phase-enter">
          <p className="section-heading mb-2">Your habits</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {subtitle}
          </p>
          <div className="bento-stats">
            <span className="bento-stat">
              <strong>3</strong> habits ready
            </span>
            <span className="bento-stat">
              <strong>30</strong> day plan next
            </span>
          </div>
        </section>

        {data.habits.map((habit, index) => (
          <div
            key={habit.name}
            className={`bento-cell bento-habit bento-habit-${index + 1}`}
          >
            <HabitCard
              habit={habit}
              number={index + 1}
              variant={(index + 1) as 1 | 2 | 3}
              onCopy={onCopy}
              bento
            />
          </div>
        ))}

        <div className="bento-cell bento-actions phase-enter">
          <button type="button" onClick={onViewPlan} className="btn-primary">
            <Sparkles size={16} />
            See 30-day plan
          </button>
        </div>
      </div>
    </div>
  );
}

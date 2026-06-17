"use client";

import { Sparkles } from "lucide-react";
import HabitCard from "@/components/HabitCard";
import HabitDNA from "@/components/HabitDNA";
import HabitStackBuilder from "@/components/HabitStackBuilder";
import type { APIResponse, HabitDNA as HabitDNAType } from "@/types/habits";

interface BentoHabitsProps {
  data: APIResponse;
  subtitle: string;
  habitDNA: HabitDNAType | null;
  dnaLoading?: boolean;
  habitOrder: number[];
  onOrderChange: (order: number[]) => void;
  onViewPlan: () => void;
  onCopy?: (message: string) => void;
  onShareDNA?: () => void;
}

export default function BentoHabits({
  data,
  subtitle,
  habitDNA,
  dnaLoading,
  habitOrder,
  onOrderChange,
  onViewPlan,
  onCopy,
  onShareDNA,
}: BentoHabitsProps) {
  const orderedHabits = habitOrder.map((i) => data.habits[i]);

  return (
    <div className="bento-results section-gap">
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

      <HabitDNA dna={habitDNA} loading={dnaLoading} onShare={onShareDNA} />

      <div className="bento-grid bento-grid--habits">
        <section className="bento-cell bento-intro glass-card phase-enter">
          <p className="section-heading mb-2">Your habits</p>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem", lineHeight: 1.7 }}>
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

        {orderedHabits.map((habit, index) => (
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

      <HabitStackBuilder
        habits={data.habits}
        order={habitOrder}
        onOrderChange={onOrderChange}
      />
    </div>
  );
}

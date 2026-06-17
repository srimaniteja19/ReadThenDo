"use client";

import { Share2 } from "lucide-react";
import type { HabitDNA } from "@/types/habits";

interface HabitDNAProps {
  dna: HabitDNA | null;
  loading?: boolean;
  onShare?: () => void;
}

export default function HabitDNA({ dna, loading, onShare }: HabitDNAProps) {
  if (loading) {
    return (
      <section className="habit-dna glass-card phase-enter">
        <p className="section-heading mb-3">Habit DNA</p>
        <div className="habit-dna-shimmer">
          <div className="habit-dna-shimmer-line habit-dna-shimmer-line--lg" />
          <div className="habit-dna-shimmer-line" />
        </div>
        <p className="label-meta mt-3">Analyzing your habit personality…</p>
      </section>
    );
  }

  if (!dna) return null;

  return (
    <section className="habit-dna glass-card phase-enter">
      <div className="flex items-start justify-between gap-3">
        <p className="section-heading">Habit DNA</p>
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="habit-dna-share"
            aria-label="Share Habit DNA"
          >
            <Share2 size={16} />
          </button>
        )}
      </div>
      <p className="habit-dna-label">
        {dna.emoji} {dna.label}
      </p>
      <p className="habit-dna-tagline">{dna.tagline}</p>
    </section>
  );
}

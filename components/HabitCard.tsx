"use client";

import { Copy } from "lucide-react";
import type { Habit } from "@/types/habits";

interface HabitCardProps {
  habit: Habit;
  number: number;
  variant: 1 | 2 | 3;
  onCopy?: (message: string) => void;
}

const VARIANT_STYLES = {
  1: {
    bg: "var(--h1-bg)",
    accent: "var(--h1)",
  },
  2: {
    bg: "var(--h2-bg)",
    accent: "var(--h2)",
  },
  3: {
    bg: "var(--h3-bg)",
    accent: "var(--h3)",
  },
} as const;

const EMOJI_RULES: { keywords: string[]; emoji: string }[] = [
  { keywords: ["focus", "deep", "concentrate", "attention"], emoji: "🎯" },
  { keywords: ["energy", "morning", "wake", "sleep"], emoji: "⚡" },
  { keywords: ["learn", "read", "study", "book", "course"], emoji: "📚" },
  { keywords: ["mind", "think", "meditat", "reflect", "journal"], emoji: "🧠" },
  { keywords: ["build", "create", "ship", "launch", "project", "write"], emoji: "🚀" },
  { keywords: ["gym", "fit", "exercise", "walk", "run", "hike", "workout"], emoji: "💪" },
  { keywords: ["skill", "practice", "drill", "train"], emoji: "✨" },
];

function getHabitEmoji(habit: Habit): string {
  const text = `${habit.name} ${habit.why} ${habit.intention}`.toLowerCase();

  for (const rule of EMOJI_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.emoji;
    }
  }

  return "🌱";
}

export default function HabitCard({
  habit,
  number,
  variant,
  onCopy,
}: HabitCardProps) {
  const styles = VARIANT_STYLES[variant];
  const emoji = getHabitEmoji(habit);
  const numberLabel = String(number).padStart(2, "0");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(habit.intention);
      onCopy?.("Copied!");
    } catch {
      onCopy?.("Could not copy");
    }
  }

  return (
    <article
      className="card habit-card-enter overflow-hidden"
      style={{ background: styles.bg, borderColor: "var(--border)" }}
    >
      <div
        className="habit-stripe"
        style={{
          background: `linear-gradient(135deg, ${styles.accent} 0%, transparent 60%)`,
        }}
      />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none" aria-hidden>
            {emoji}
          </span>
          <div>
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent-text)",
              }}
            >
              {numberLabel}
            </span>
            <h3 className="card-title" style={{ color: "var(--text-primary)" }}>
              {habit.name}
            </h3>
          </div>
        </div>
      </div>

      <p
        className="mb-4"
        style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}
      >
        {habit.why}
      </p>

      <div
        className="relative rounded-[10px] px-3.5 py-3"
        style={{ background: "var(--intention-bg)" }}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2.5 top-2.5 rounded-md p-1.5 transition hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Copy implementation intention"
          style={{ color: "var(--text-muted)" }}
        >
          <Copy size={14} />
        </button>
        <p className="label-meta mb-1.5">💡 Implementation intention</p>
        <p
          className="pr-8 italic"
          style={{ color: "var(--text-primary)", fontSize: 14 }}
        >
          {habit.intention}
        </p>
      </div>
    </article>
  );
}

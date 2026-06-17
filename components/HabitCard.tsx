"use client";

import { Copy } from "lucide-react";
import type { Habit } from "@/types/habits";

interface HabitCardProps {
  habit: Habit;
  number: number;
  variant: 1 | 2 | 3;
  onCopy?: (message: string) => void;
  bento?: boolean;
}

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
  bento = false,
}: HabitCardProps) {
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
      className={`glass-card habit-card habit-card--${variant} habit-card-enter ${bento ? "card-bento" : ""}`}
      style={{ ["--bento-i" as string]: number - 1 }}
    >
      <div className="habit-card-bar" aria-hidden />

      <div className="habit-card-header">
        <span className="habit-card-emoji" aria-hidden>
          {emoji}
        </span>
        <span className="habit-number-badge">{numberLabel}</span>
      </div>

      <h3 className="habit-card-name">{habit.name}</h3>
      <p className="habit-card-why">{habit.why}</p>

      <div className="intention-box">
        <button
          type="button"
          onClick={handleCopy}
          className="intention-copy"
          aria-label="Copy implementation intention"
        >
          <Copy size={14} />
        </button>
        <p className="section-heading mb-0">💡 Implementation intention</p>
        <p className="intention-text">{habit.intention}</p>
      </div>
    </article>
  );
}

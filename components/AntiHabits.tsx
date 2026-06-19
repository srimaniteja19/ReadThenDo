"use client";

import type { AntiHabit } from "@/types/habits";

interface AntiHabitsProps {
  antiHabits: AntiHabit[];
}

export default function AntiHabits({ antiHabits }: AntiHabitsProps) {
  if (!antiHabits.length) return null;

  return (
    <section className="anti-habits glass-card phase-enter">
      <p className="section-heading mb-2">Stop doing</p>
      <p className="label-meta mb-4">
        Behaviors to eliminate — every great book implies what to quit.
      </p>
      <ul className="anti-habits-list">
        {antiHabits.map((item, index) => (
          <li key={index} className="anti-habit-item">
            <span className="anti-habit-icon" aria-hidden>
              ✕
            </span>
            <div>
              <p className="anti-habit-name">{item.name}</p>
              <p className="anti-habit-why">{item.why}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

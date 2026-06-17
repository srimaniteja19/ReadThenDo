"use client";

import { useEffect, useState } from "react";
import {
  getLatestBadge,
  getNextBadge,
  getStreak,
  type StreakBadge,
} from "@/lib/streak";

export default function ReadingStreak() {
  const [count, setCount] = useState(0);
  const [badge, setBadge] = useState<StreakBadge | null>(null);
  const [nextBadge, setNextBadge] = useState<StreakBadge | null>(null);

  useEffect(() => {
    function refresh() {
      const streak = getStreak();
      setCount(streak.count);
      setBadge(getLatestBadge(streak.count));
      setNextBadge(getNextBadge(streak.count));
    }

    refresh();
    window.addEventListener("readthendo-streak-updated", refresh);
    return () =>
      window.removeEventListener("readthendo-streak-updated", refresh);
  }, []);

  if (count === 0) return null;

  return (
    <div className="reading-streak glass-card">
      <span>📚</span>
      <span className="reading-streak-count">{count}</span>
      <span>
        book{count === 1 ? "" : "s"} distilled
      </span>
      {badge ? (
        <>
          <span className="reading-streak-sep">·</span>
          <span>
            {badge.emoji} {badge.label}
          </span>
        </>
      ) : nextBadge ? (
        <>
          <span className="reading-streak-sep">·</span>
          <span>
            ✏️ {nextBadge.minBooks - count} more for {nextBadge.emoji}{" "}
            {nextBadge.label}
          </span>
        </>
      ) : null}
    </div>
  );
}

export function notifyStreakUpdated() {
  window.dispatchEvent(new Event("readthendo-streak-updated"));
}

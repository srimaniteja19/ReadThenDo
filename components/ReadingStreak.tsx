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
      <div className="reading-streak-main">
        <span className="reading-streak-count">{count}</span>
        <span className="label-meta">
          book{count === 1 ? "" : "s"} distilled
        </span>
      </div>
      {badge && (
        <span className="reading-streak-badge">
          {badge.emoji} {badge.label}
        </span>
      )}
      {!badge && nextBadge && (
        <span className="label-meta">
          {nextBadge.minBooks - count} more for {nextBadge.emoji}{" "}
          {nextBadge.label}
        </span>
      )}
    </div>
  );
}

export function notifyStreakUpdated() {
  window.dispatchEvent(new Event("readthendo-streak-updated"));
}

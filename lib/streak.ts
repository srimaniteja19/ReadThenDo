const STREAK_KEY = "readthendo-streak";

export interface StreakData {
  count: number;
}

export interface StreakBadge {
  id: string;
  label: string;
  emoji: string;
  minBooks: number;
}

export const STREAK_BADGES: StreakBadge[] = [
  { id: "distiller", label: "Distiller", emoji: "🧪", minBooks: 3 },
  { id: "bibliohacker", label: "Bibliohacker", emoji: "📚", minBooks: 10 },
];

export function getStreak(): StreakData {
  if (typeof window === "undefined") return { count: 0 };

  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0 };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { count: 0 };
  }
}

export function incrementStreak(): StreakData {
  const current = getStreak();
  const next = { count: current.count + 1 };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

export function getUnlockedBadges(count: number): StreakBadge[] {
  return STREAK_BADGES.filter((badge) => count >= badge.minBooks);
}

export function getLatestBadge(count: number): StreakBadge | null {
  const unlocked = getUnlockedBadges(count);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

export function getNextBadge(count: number): StreakBadge | null {
  return STREAK_BADGES.find((badge) => count < badge.minBooks) ?? null;
}

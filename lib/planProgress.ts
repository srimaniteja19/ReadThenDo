import type { HabitPlan, TodayAction } from "@/types/habits";

export function parseDayRange(dayStr: string): { start: number; end: number } {
  const range = dayStr.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) {
    return { start: parseInt(range[1], 10), end: parseInt(range[2], 10) };
  }
  const single = dayStr.match(/(\d+)/);
  if (single) {
    const n = parseInt(single[1], 10);
    return { start: n, end: n };
  }
  return { start: 1, end: 1 };
}

export function getPlanDayNumber(startDateISO: string): number {
  const start = new Date(startDateISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - start.getTime();
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(30, day));
}

export function getTodayAction(plan: HabitPlan, planDay: number): TodayAction | null {
  if (planDay < 1 || planDay > 30) return null;

  for (const phase of plan.phases) {
    for (const item of phase.items) {
      const { start, end } = parseDayRange(item.day);
      if (planDay >= start && planDay <= end) {
        return {
          planDay,
          dayLabel: item.day,
          action: item.action,
          phaseName: phase.name,
        };
      }
    }
  }

  return null;
}

export function isDayCompleted(completedDays: number[] | undefined, planDay: number): boolean {
  return completedDays?.includes(planDay) ?? false;
}

export function toggleDayCompleted(
  completedDays: number[] | undefined,
  planDay: number
): number[] {
  const set = new Set(completedDays ?? []);
  if (set.has(planDay)) set.delete(planDay);
  else set.add(planDay);
  return Array.from(set).sort((a, b) => a - b);
}

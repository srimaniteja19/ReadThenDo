import type { APIResponse, AppMode, CustomGoalInput, HabitDNA, SavedPlan } from "@/types/habits";

const LIBRARY_KEY = "readthendo-plan-library";
const ACTIVE_PLAN_KEY = "readthendo-active-plan-id";
const MAX_PLANS = 25;

export function getActivePlanId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_PLAN_KEY);
}

export function setActivePlanId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(ACTIVE_PLAN_KEY, id);
  else localStorage.removeItem(ACTIVE_PLAN_KEY);
}

export function getSavedPlans(): SavedPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedPlan[];
  } catch {
    return [];
  }
}

function persistPlans(plans: SavedPlan[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(plans.slice(0, MAX_PLANS)));
  window.dispatchEvent(new Event("readthendo-library-updated"));
}

export function savePlan(entry: Omit<SavedPlan, "id" | "savedAt"> & { id?: string }): SavedPlan {
  const plans = getSavedPlans();
  const now = new Date().toISOString();
  const id = entry.id ?? crypto.randomUUID();

  const saved: SavedPlan = {
    ...entry,
    id,
    savedAt: now,
    completedDays: entry.completedDays ?? [],
  };

  const index = plans.findIndex((p) => p.id === id);
  if (index >= 0) {
    plans[index] = { ...plans[index], ...saved, savedAt: plans[index].savedAt };
  } else {
    plans.unshift(saved);
  }

  persistPlans(plans);
  setActivePlanId(id);
  return saved;
}

export function updateSavedPlan(
  id: string,
  updates: Partial<Omit<SavedPlan, "id">>
): SavedPlan | null {
  const plans = getSavedPlans();
  const index = plans.findIndex((p) => p.id === id);
  if (index < 0) return null;

  plans[index] = { ...plans[index], ...updates };
  persistPlans(plans);
  return plans[index];
}

export function deleteSavedPlan(id: string) {
  const plans = getSavedPlans().filter((p) => p.id !== id);
  persistPlans(plans);
  if (getActivePlanId() === id) setActivePlanId(null);
}

export function getSavedPlan(id: string): SavedPlan | null {
  return getSavedPlans().find((p) => p.id === id) ?? null;
}

export function upsertCurrentPlan(options: {
  title: string;
  mode: AppMode;
  data: APIResponse;
  habitDNA?: HabitDNA | null;
  customGoal?: CustomGoalInput;
  planStartDate?: string;
  completedDays?: number[];
  screen?: "habits" | "plan";
}): SavedPlan {
  const activeId = getActivePlanId();
  const existing = activeId ? getSavedPlan(activeId) : null;

  return savePlan({
    id: existing?.id,
    title: options.title,
    mode: options.mode,
    data: options.data,
    habitDNA: options.habitDNA,
    customGoal: options.customGoal,
    planStartDate: options.planStartDate ?? existing?.planStartDate ?? new Date().toISOString().slice(0, 10),
    completedDays: options.completedDays ?? existing?.completedDays ?? [],
    screen: options.screen ?? existing?.screen ?? "habits",
  });
}

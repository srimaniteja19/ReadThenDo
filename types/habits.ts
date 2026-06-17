export type ExperienceLevel = "beginner" | "some" | "intermediate";
export type TimeAvailable = "15min" | "30min" | "1hour" | "2plus";
export type GoalObjective = "habit" | "skill" | "fitness" | "project";

export interface CustomGoalInput {
  goal: string;
  bookSummary: string;
  level: ExperienceLevel;
  time: TimeAvailable;
  objective: GoalObjective;
}

export interface Habit {
  name: string;
  why: string;
  intention: string;
}

export interface PhaseItem {
  day: string;
  action: string;
}

export interface Phase {
  name: string;
  days: string;
  focus: string;
  items: PhaseItem[];
}

export interface HabitPlan {
  intro: string;
  phases: Phase[];
}

export type AppMode = "books" | "custom" | "battle";
export type CheckInDay = 10 | 20 | 30;

export interface HabitDNA {
  label: string;
  emoji: string;
  tagline: string;
}

export interface HabitBattleResult {
  winner: "A" | "B";
  winnerName: string;
  reason: string;
  bookAStrength: string;
  bookBStrength: string;
  verdict: string;
}

export interface CheckInResult {
  message: string;
  plan: HabitPlan;
}

export interface APIResponse {
  habits: Habit[];
  plan: HabitPlan;
  habitDNA?: HabitDNA;
}

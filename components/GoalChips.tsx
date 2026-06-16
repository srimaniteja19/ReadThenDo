import type { CustomGoalInput } from "@/types/habits";

interface GoalChip {
  label: string;
  goal: string;
  defaults: Pick<CustomGoalInput, "level" | "time" | "objective">;
}

const GOAL_CHIPS: GoalChip[] = [
  {
    label: "🐘 Learn PostgreSQL",
    goal: "Learn PostgreSQL",
    defaults: { level: "beginner", time: "30min", objective: "skill" },
  },
  {
    label: "🏋️ Go to the gym",
    goal: "Start going to the gym",
    defaults: { level: "beginner", time: "1hour", objective: "fitness" },
  },
  {
    label: "🥾 Learn hiking",
    goal: "Learn hiking",
    defaults: { level: "beginner", time: "1hour", objective: "fitness" },
  },
  {
    label: "📚 Read 12 books",
    goal: "Read 12 books this year",
    defaults: { level: "some", time: "30min", objective: "habit" },
  },
  {
    label: "🌅 Morning routine",
    goal: "Build a morning routine",
    defaults: { level: "beginner", time: "30min", objective: "habit" },
  },
  {
    label: "🇪🇸 Learn Spanish",
    goal: "Learn Spanish",
    defaults: { level: "beginner", time: "30min", objective: "skill" },
  },
  {
    label: "🧘 Start meditating",
    goal: "Start meditating",
    defaults: { level: "beginner", time: "15min", objective: "habit" },
  },
  {
    label: "🍳 Learn to cook",
    goal: "Learn to cook",
    defaults: { level: "beginner", time: "1hour", objective: "skill" },
  },
];

interface GoalChipsProps {
  activeGoal: string | null;
  onSelect: (goal: string, defaults: Partial<CustomGoalInput>) => void;
}

export default function GoalChips({ activeGoal, onSelect }: GoalChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {GOAL_CHIPS.map(({ label, goal, defaults }) => {
        const isActive = activeGoal === goal;
        return (
          <button
            key={goal}
            type="button"
            onClick={() => onSelect(goal, { goal, ...defaults })}
            className={`chip ${isActive ? "chip-active" : ""}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

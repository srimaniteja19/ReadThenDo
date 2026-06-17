import type { Habit } from "@/types/habits";

function extractAction(intention: string): string {
  const match = intention.match(/I will (.+?)\.?$/i);
  return match ? match[1].trim() : intention;
}

export function buildHabitStackChain(
  habits: Habit[],
  order: number[]
): string[] {
  const ordered = order.map((index) => habits[index]).filter(Boolean);

  if (ordered.length === 0) return [];

  const chain: string[] = [ordered[0].intention];

  for (let i = 1; i < ordered.length; i++) {
    const previousAction = extractAction(ordered[i - 1].intention);
    const nextAction = extractAction(ordered[i].intention);
    chain.push(`After I ${previousAction}, I will ${nextAction}.`);
  }

  return chain;
}

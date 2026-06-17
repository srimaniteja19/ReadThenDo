import type { APIResponse, HabitDNA } from "@/types/habits";

interface ExportOptions {
  bookTitle?: string;
  habitDNA?: HabitDNA | null;
}

export function buildPlanMarkdown(
  data: APIResponse,
  options: ExportOptions = {}
): string {
  const { bookTitle, habitDNA } = options;
  const lines: string[] = [];

  lines.push("# ReadThenDo — 30-Day Habit Plan");
  lines.push("");

  if (bookTitle) {
    lines.push(`**Book:** ${bookTitle}`);
    lines.push("");
  }

  if (data.bookSources?.length) {
    lines.push(`**Sources:** ${data.bookSources.join(" · ")}`);
    lines.push("");
  }

  if (data.synthesisInsight) {
    lines.push(`**Cross-book consensus:** ${data.synthesisInsight}`);
    lines.push("");
  }

  if (habitDNA) {
    lines.push(`**Habit DNA:** ${habitDNA.emoji} ${habitDNA.label}`);
    lines.push(`*${habitDNA.tagline}*`);
    lines.push("");
  }

  lines.push("## Habits");
  lines.push("");

  data.habits.forEach((habit, index) => {
    lines.push(`### ${index + 1}. ${habit.name}`);
    lines.push("");
    lines.push(`**Why:** ${habit.why}`);
    lines.push("");
    lines.push(`**Implementation intention:** ${habit.intention}`);
    lines.push("");
  });

  lines.push("## 30-Day Plan");
  lines.push("");
  lines.push(data.plan.intro);
  lines.push("");

  data.plan.phases.forEach((phase) => {
    lines.push(`### ${phase.name} (${phase.days})`);
    lines.push("");
    lines.push(phase.focus);
    lines.push("");
    phase.items.forEach((item) => {
      lines.push(`- **${item.day}** — ${item.action}`);
    });
    lines.push("");
  });

  lines.push("---");
  lines.push("*Generated with [ReadThenDo](https://readthendo.app)*");

  return lines.join("\n");
}

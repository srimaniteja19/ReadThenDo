import type { APIResponse } from "@/types/habits";
import { parseDayRange } from "@/lib/planProgress";

function escapeIcal(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function buildPlanIcal(
  data: APIResponse,
  options: { bookTitle?: string; startDate?: string } = {}
): string {
  const start = options.startDate
    ? new Date(options.startDate + "T09:00:00")
    : new Date();

  start.setHours(9, 0, 0, 0);

  const title = options.bookTitle ?? "ReadThenDo Plan";
  const events: string[] = [];
  const stamp = formatIcalDate(new Date()) + "T120000Z";

  data.plan.phases.forEach((phase) => {
    phase.items.forEach((item, itemIndex) => {
      const { start: dayStart } = parseDayRange(item.day);
      const eventDate = addDays(start, dayStart - 1);
      const uid = `readthendo-${dayStart}-${itemIndex}@readthendo.app`;

      events.push(`BEGIN:VEVENT
UID:${uid}
DTSTAMP:${stamp}
DTSTART;VALUE=DATE:${formatIcalDate(eventDate)}
SUMMARY:${escapeIcal(`${phase.name}: ${item.action.slice(0, 60)}`)}
DESCRIPTION:${escapeIcal(`${title}\\n\\n${phase.focus}\\n\\n${item.day}: ${item.action}`)}
END:VEVENT`);
    });
  });

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ReadThenDo//30-Day Plan//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${escapeIcal(title)}
${events.join("\n")}
END:VCALENDAR`;
}

export function downloadPlanIcal(
  data: APIResponse,
  options: { bookTitle?: string; startDate?: string } = {}
) {
  const ical = buildPlanIcal(data, options);
  const blob = new Blob([ical], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(options.bookTitle ?? "readthendo-plan").replace(/[^\w\s-]/g, "").trim() || "plan"}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

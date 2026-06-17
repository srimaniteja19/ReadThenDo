"use client";

import { Check } from "lucide-react";

interface BookInputToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function BookInputToggle({ enabled, onToggle }: BookInputToggleProps) {
  return (
    <label className="book-input-toggle">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <span className="book-input-checkbox">
        {enabled && <Check size={11} strokeWidth={3} />}
      </span>
      <span>Haven&apos;t read it yet?</span>
    </label>
  );
}

interface ReadingTimeHintProps {
  label: string;
}

export function ReadingTimeHint({ label }: ReadingTimeHintProps) {
  return (
    <p className="reading-time-hint">
      📖 Estimated reading time: <strong>{label}</strong>
    </p>
  );
}

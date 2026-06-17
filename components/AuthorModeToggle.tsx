"use client";

import type { AuthorVoice } from "@/lib/authorMode";
import { AUTHOR_VOICE_OPTIONS } from "@/lib/authorMode";

interface AuthorModeToggleProps {
  enabled: boolean;
  voice: AuthorVoice;
  onToggle: (enabled: boolean) => void;
  onVoiceChange: (voice: AuthorVoice) => void;
}

export default function AuthorModeToggle({
  enabled,
  voice,
  onToggle,
  onVoiceChange,
}: AuthorModeToggleProps) {
  return (
    <div className="author-mode">
      <label className="book-input-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="book-input-toggle-track">
          <span className="book-input-toggle-thumb" />
        </span>
        <span>What would the author say?</span>
      </label>

      {enabled && (
        <select
          value={voice}
          onChange={(e) => onVoiceChange(e.target.value as AuthorVoice)}
          className="distill-select author-mode-select"
          aria-label="Author voice"
        >
          {AUTHOR_VOICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

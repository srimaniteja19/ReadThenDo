"use client";

import { Sparkles } from "lucide-react";
import type { HabitBattleResult } from "@/types/habits";

interface BattleInputProps {
  bookA: string;
  bookB: string;
  bookAName: string;
  bookBName: string;
  goal: string;
  onBookAChange: (value: string) => void;
  onBookBChange: (value: string) => void;
  onBookANameChange: (value: string) => void;
  onBookBNameChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onCompare: () => void;
  error: string | null;
  loading?: boolean;
}

export function BattleInput({
  bookA,
  bookB,
  bookAName,
  bookBName,
  goal,
  onBookAChange,
  onBookBChange,
  onBookANameChange,
  onBookBNameChange,
  onGoalChange,
  onCompare,
  error,
  loading,
}: BattleInputProps) {
  return (
    <div className="section-gap">
      <div>
        <label htmlFor="battle-goal" className="section-heading mb-3 block">
          Your goal
        </label>
        <input
          id="battle-goal"
          type="text"
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          placeholder="e.g. build a morning routine, get fit, learn faster…"
          className="distill-input"
        />
      </div>

      <div className="battle-columns">
        <div>
          <input
            type="text"
            value={bookAName}
            onChange={(e) => onBookANameChange(e.target.value)}
            placeholder="Book A name"
            className="distill-input mb-2"
            aria-label="Book A name"
          />
          <textarea
            value={bookA}
            onChange={(e) => onBookAChange(e.target.value)}
            placeholder="Paste first book summary…"
            rows={7}
            className="distill-textarea"
          />
        </div>
        <div className="battle-vs">VS</div>
        <div>
          <input
            type="text"
            value={bookBName}
            onChange={(e) => onBookBNameChange(e.target.value)}
            placeholder="Book B name"
            className="distill-input mb-2"
            aria-label="Book B name"
          />
          <textarea
            value={bookB}
            onChange={(e) => onBookBChange(e.target.value)}
            placeholder="Paste second book summary…"
            rows={7}
            className="distill-textarea"
          />
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button
        type="button"
        onClick={onCompare}
        disabled={!bookA.trim() || !bookB.trim() || !goal.trim() || loading}
        className="btn-primary btn-primary-shimmer"
      >
        <Sparkles size={16} />
        {loading ? "Judging the battle…" : "Start habit battle"}
      </button>
    </div>
  );
}

interface BattleResultProps {
  result: HabitBattleResult;
  bookAName: string;
  bookBName: string;
  onStartOver: () => void;
  onShare?: () => void;
}

export function BattleResult({
  result,
  bookAName,
  bookBName,
  onStartOver,
  onShare,
}: BattleResultProps) {
  const winnerIsA = result.winner === "A";

  return (
    <div className="section-gap">
      <section className="battle-verdict glass-card phase-enter">
        <p className="section-heading mb-2">Habit battle verdict</p>
        <p className="battle-winner">
          🏆 {result.winnerName} wins
        </p>
        <p className="battle-hot-take">{result.verdict}</p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 12 }}>
          {result.reason}
        </p>
        {onShare && (
          <button type="button" onClick={onShare} className="btn-ghost mt-4">
            Share verdict
          </button>
        )}
      </section>

      <div className="battle-columns">
        <section
          className={`glass-card phase-enter ${winnerIsA ? "battle-card--winner" : ""}`}
        >
          <p className="section-heading mb-2">{bookAName}</p>
          {winnerIsA && <span className="battle-badge">Winner</span>}
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {result.bookAStrength}
          </p>
        </section>
        <section
          className={`glass-card phase-enter ${!winnerIsA ? "battle-card--winner" : ""}`}
        >
          <p className="section-heading mb-2">{bookBName}</p>
          {!winnerIsA && <span className="battle-badge">Winner</span>}
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {result.bookBStrength}
          </p>
        </section>
      </div>

      <button type="button" onClick={onStartOver} className="btn-ghost w-full">
        Battle again
      </button>
    </div>
  );
}

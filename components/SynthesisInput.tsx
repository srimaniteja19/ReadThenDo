"use client";

import { Sparkles } from "lucide-react";
import { SAMPLE_BOOKS, SYNTHESIS_PRESET } from "@/lib/sampleBooks";
import type { BookInput } from "@/types/habits";

interface SynthesisInputProps {
  books: BookInput[];
  onChange: (books: BookInput[]) => void;
  onSubmit: () => void;
  error: string | null;
  loading?: boolean;
}

export default function SynthesisInput({
  books,
  onChange,
  onSubmit,
  error,
  loading,
}: SynthesisInputProps) {
  function updateBook(index: number, field: keyof BookInput, value: string) {
    const next = books.map((book, i) =>
      i === index ? { ...book, [field]: value } : book
    );
    onChange(next);
  }

  function loadPreset() {
    onChange(
      SYNTHESIS_PRESET.map((title) => ({
        name: title,
        summary: SAMPLE_BOOKS[title],
      }))
    );
  }

  const allFilled = books.every((book) => book.summary.trim());

  return (
    <div className="section-gap">
      <section className="glass-card phase-enter synthesis-intro">
        <p className="section-heading mb-2">Multi-book synthesis</p>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.65 }}>
          Paste 3 book summaries. We&apos;ll find the highest-signal habits that
          appear across all three and build one unified 30-day system.
        </p>
        <button type="button" onClick={loadPreset} className="chip mt-4">
          ✨ Load Atomic Habits + Deep Work + Essentialism
        </button>
      </section>

      {books.map((book, index) => (
        <section key={index} className="glass-card synthesis-book phase-enter">
          <input
            type="text"
            value={book.name}
            onChange={(e) => updateBook(index, "name", e.target.value)}
            placeholder={`Book ${index + 1} title`}
            className="distill-input mb-3"
            aria-label={`Book ${index + 1} title`}
          />
          <textarea
            value={book.summary}
            onChange={(e) => updateBook(index, "summary", e.target.value)}
            placeholder={`Paste summary for book ${index + 1}…`}
            rows={5}
            className="distill-textarea"
          />
          <p className="label-meta mt-2 text-right">
            {book.summary.length.toLocaleString()} characters
          </p>
        </section>
      ))}

      {error && <div className="error-banner">{error}</div>}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!allFilled || loading}
        className="btn-primary btn-primary-shimmer"
      >
        <Sparkles size={16} />
        {loading ? "Synthesizing…" : "Build unified system"}
      </button>
    </div>
  );
}

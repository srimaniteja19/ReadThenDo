"use client";

import { useEffect, useRef, useState } from "react";
import type { AppMode } from "@/types/habits";

interface ModeSwitcherProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

const MODES: { id: AppMode; label: string }[] = [
  { id: "books", label: "📖 Books" },
  { id: "synthesis", label: "✨ Synthesis" },
  { id: "custom", label: "🎯 Goal" },
  { id: "battle", label: "⚔️ Battle" },
];

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = MODES.findIndex((item) => item.id === mode);
    const buttons = container.querySelectorAll<HTMLButtonElement>("[data-mode]");
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      setIndicator({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft,
      });
    }
  }, [mode]);

  return (
    <div ref={containerRef} className="mode-switcher relative">
      <span
        className="mode-switcher-indicator"
        style={{
          width: indicator.width,
          left: indicator.left,
        }}
      />

      {MODES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          data-mode={id}
          onClick={() => onChange(id)}
          className={`mode-switcher-btn ${mode === id ? "mode-switcher-btn--active" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { AppMode } from "@/types/habits";

interface ModeSwitcherProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

const MODES: { id: AppMode; label: string }[] = [
  { id: "books", label: "📖 Books" },
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
    <div
      ref={containerRef}
      className="mode-switcher relative flex w-full max-w-lg rounded-full p-1"
      style={{ background: "var(--bg-subtle)" }}
    >
      <span
        className="absolute top-1 rounded-full shadow-sm transition-all duration-250 ease-out"
        style={{
          height: "calc(100% - 8px)",
          width: indicator.width,
          left: indicator.left,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      />

      {MODES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          data-mode={id}
          onClick={() => onChange(id)}
          className="relative z-10 flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4"
          style={{
            color:
              mode === id ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

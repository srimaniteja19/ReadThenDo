"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Phase } from "@/types/habits";

interface PlanPhaseProps {
  phase: Phase;
  index: number;
  bento?: boolean;
}

const PHASE_COLORS = ["var(--h1)", "var(--h2)", "var(--h3)"] as const;

export default function PlanPhase({ phase, index, bento = false }: PlanPhaseProps) {
  const [expanded, setExpanded] = useState(true);
  const color = PHASE_COLORS[index] ?? PHASE_COLORS[0];

  return (
    <section
      className={`card phase-enter ${bento ? "card-bento" : ""}`}
      style={{ padding: 0, overflow: "hidden", height: bento ? "100%" : undefined }}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-[20px_22px]"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[12px] font-medium"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent-text)",
              }}
            >
              {phase.days}
            </span>
            <h3 className="card-title">{phase.name}</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {phase.focus}
          </p>
        </div>
        <ChevronDown
          size={18}
          style={{
            color: "var(--text-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
            marginTop: 4,
          }}
        />
      </button>

      <div
        style={{
          maxHeight: expanded ? "800px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "0 22px 20px",
          }}
        >
          <ul className="card-gap" style={{ paddingTop: 16 }}>
            {phase.items.map((item) => (
              <li
                key={item.day}
                className="flex items-start gap-3"
                style={{ listStyle: "none" }}
              >
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <div>
                  <p
                    className="font-mono text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.day}
                  </p>
                  <p style={{ color: "var(--text-primary)", fontSize: 14 }}>
                    {item.action}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Phase } from "@/types/habits";

interface PlanPhaseProps {
  phase: Phase;
  index: number;
  bento?: boolean;
}

export default function PlanPhase({ phase, index, bento = false }: PlanPhaseProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section
      className={`glass-card phase-card phase-card--${index} phase-enter ${bento ? "card-bento" : ""}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="phase-card-header"
        aria-expanded={expanded}
      >
        <div className="phase-card-header-main">
          <span className="phase-days-pill">{phase.days}</span>
          <span className="phase-card-name">{phase.name}</span>
          <span className="phase-card-focus">{phase.focus}</span>
        </div>
        <ChevronDown
          size={18}
          className={`phase-chevron ${expanded ? "phase-chevron--open" : ""}`}
        />
      </button>

      <div className={`phase-body ${expanded ? "phase-body--open" : ""}`}>
        <div className="phase-body-inner">
          <div className="phase-body-content">
            <ul className="card-gap" style={{ paddingTop: 8, margin: 0 }}>
              {phase.items.map((item) => (
                <li key={item.day} className="phase-item">
                  <span className="phase-item-day">{item.day}</span>
                  <span className="phase-item-dot" aria-hidden />
                  <p className="phase-item-action">{item.action}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

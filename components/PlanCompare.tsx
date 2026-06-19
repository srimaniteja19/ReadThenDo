"use client";

import type { SavedPlan } from "@/types/habits";

interface PlanCompareProps {
  planA: SavedPlan;
  planB: SavedPlan;
  onClose: () => void;
}

export default function PlanCompare({ planA, planB, onClose }: PlanCompareProps) {
  return (
    <div className="plan-compare section-gap">
      <div className="flex items-center justify-between gap-3">
        <p className="section-heading mb-0">Plan comparison</p>
        <button type="button" onClick={onClose} className="chip">
          Close
        </button>
      </div>

      <div className="plan-compare-grid">
        {[planA, planB].map((plan) => (
          <section key={plan.id} className="glass-card plan-compare-col">
            <p className="card-title">{plan.title}</p>
            <p className="label-meta mb-4">{plan.mode}</p>
            <p className="section-heading mb-2">Habits</p>
            <ul className="card-gap">
              {plan.data.habits.map((habit, i) => (
                <li key={i} className="plan-compare-habit">
                  <strong>{habit.name}</strong>
                  <span className="label-meta">{habit.why}</span>
                </li>
              ))}
            </ul>
            {plan.data.synthesisInsight && (
              <>
                <p className="section-heading mb-2 mt-4">Consensus</p>
                <p style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>
                  {plan.data.synthesisInsight}
                </p>
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

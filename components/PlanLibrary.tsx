"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { SavedPlan } from "@/types/habits";
import {
  deleteSavedPlan,
  getSavedPlans,
} from "@/lib/planLibrary";

interface PlanLibraryProps {
  open: boolean;
  onClose: () => void;
  onResume: (plan: SavedPlan) => void;
  onCompare: (planA: SavedPlan, planB: SavedPlan) => void;
  activePlanId?: string | null;
}

export default function PlanLibrary({
  open,
  onClose,
  onResume,
  onCompare,
  activePlanId,
}: PlanLibraryProps) {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function refresh() {
      setPlans(getSavedPlans());
    }

    refresh();
    window.addEventListener("readthendo-library-updated", refresh);
    return () => window.removeEventListener("readthendo-library-updated", refresh);
  }, [open]);

  if (!open) return null;

  function handleCompare() {
    const a = plans.find((p) => p.id === compareA);
    const b = plans.find((p) => p.id === compareB);
    if (a && b) {
      onCompare(a, b);
      onClose();
    }
  }

  return (
    <div className="plan-library-overlay" role="dialog" aria-modal="true">
      <div className="plan-library-backdrop" onClick={onClose} aria-hidden />
      <section className="plan-library glass-card">
        <div className="plan-library-header">
          <p className="section-heading mb-0">Plan library</p>
          <button type="button" onClick={onClose} className="plan-library-close" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="label-meta mb-4">
          Saved plans persist across refreshes. Select two to compare habits side-by-side.
        </p>

        {plans.length === 0 ? (
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
            No saved plans yet. Extract habits and your plan will auto-save here.
          </p>
        ) : (
          <ul className="plan-library-list">
            {plans.map((plan) => (
              <li key={plan.id} className="plan-library-item">
                <div className="plan-library-item-main">
                  <p className="card-title">{plan.title}</p>
                  <p className="label-meta">
                    {plan.mode} · {new Date(plan.savedAt).toLocaleDateString()}
                    {plan.id === activePlanId ? " · active" : ""}
                  </p>
                </div>
                <div className="plan-library-item-actions">
                  <label className="plan-library-compare-label">
                    <input
                      type="checkbox"
                      checked={compareA === plan.id}
                      onChange={() =>
                        setCompareA((prev) => (prev === plan.id ? null : plan.id))
                      }
                    />
                    A
                  </label>
                  <label className="plan-library-compare-label">
                    <input
                      type="checkbox"
                      checked={compareB === plan.id}
                      onChange={() =>
                        setCompareB((prev) => (prev === plan.id ? null : plan.id))
                      }
                    />
                    B
                  </label>
                  <button type="button" onClick={() => onResume(plan)} className="chip">
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavedPlan(plan.id)}
                    className="chip"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {compareA && compareB && compareA !== compareB && (
          <button type="button" onClick={handleCompare} className="btn-primary mt-4">
            Compare selected plans
          </button>
        )}
      </section>
    </div>
  );
}

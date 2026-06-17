"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { buildHabitStackChain } from "@/lib/habitStack";
import type { Habit } from "@/types/habits";

interface HabitStackBuilderProps {
  habits: Habit[];
  order: number[];
  onOrderChange: (order: number[]) => void;
}

export default function HabitStackBuilder({
  habits,
  order,
  onOrderChange,
}: HabitStackBuilderProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const chain = useMemo(
    () => buildHabitStackChain(habits, order),
    [habits, order]
  );

  function moveItem(from: number, to: number) {
    if (from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onOrderChange(next);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null) return;
    moveItem(dragIndex, targetIndex);
    setDragIndex(null);
  }

  return (
    <section className="habit-stack glass-card phase-enter">
      <p className="section-heading mb-2">Habit stack builder</p>
      <p className="label-meta mb-4">
        Drag to reorder. James Clear&apos;s habit stacking — chain them in sequence.
      </p>

      <ul className="habit-stack-list">
        {order.map((habitIndex, position) => (
          <li
            key={habitIndex}
            className={`habit-stack-item ${dragIndex === position ? "habit-stack-item--dragging" : ""}`}
            draggable
            onDragStart={() => setDragIndex(position)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(position)}
            onDragEnd={() => setDragIndex(null)}
          >
            <span className="habit-stack-grip" aria-hidden>
              <GripVertical size={16} />
            </span>
            <span className="habit-stack-num">{position + 1}</span>
            <div>
              <p className="card-title">{habits[habitIndex].name}</p>
              <p className="label-meta">{habits[habitIndex].intention}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="habit-stack-chain">
        <p className="section-heading mb-2">Your stack chain</p>
        {chain.map((line, index) => (
          <p key={index} className="habit-stack-chain-line">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

"use client";

import { ImageDown } from "lucide-react";
import type { APIResponse, HabitBattleResult, HabitDNA } from "@/types/habits";
import {
  renderBattleCard,
  renderHabitDNACard,
  renderSynthesisCard,
  shareOrDownloadCanvas,
} from "@/lib/shareCard";

interface ShareCardButtonProps {
  variant: "dna" | "battle" | "synthesis";
  dna?: HabitDNA | null;
  battle?: {
    result: HabitBattleResult;
    bookAName: string;
    bookBName: string;
    goal: string;
  };
  synthesisData?: APIResponse;
  onDone?: (message: string) => void;
  className?: string;
}

export default function ShareCardButton({
  variant,
  dna,
  battle,
  synthesisData,
  onDone,
  className = "btn-ghost",
}: ShareCardButtonProps) {
  async function handleShare() {
    try {
      if (variant === "dna" && dna) {
        const canvas = renderHabitDNACard(dna);
        await shareOrDownloadCanvas(canvas, "readthendo-habit-dna.png");
        onDone?.("Share card ready ✨");
      } else if (variant === "battle" && battle) {
        const canvas = renderBattleCard(
          battle.result,
          battle.bookAName,
          battle.bookBName,
          battle.goal
        );
        await shareOrDownloadCanvas(canvas, "readthendo-battle.png");
        onDone?.("Battle card ready ✨");
      } else if (variant === "synthesis" && synthesisData) {
        const canvas = renderSynthesisCard(synthesisData);
        await shareOrDownloadCanvas(canvas, "readthendo-synthesis.png");
        onDone?.("Synthesis card ready ✨");
      }
    } catch {
      onDone?.("Could not create share card");
    }
  }

  const labels = {
    dna: "Share DNA card",
    battle: "Share battle card",
    synthesis: "Share synthesis card",
  };

  return (
    <button type="button" onClick={handleShare} className={className}>
      <ImageDown size={15} />
      {labels[variant]}
    </button>
  );
}

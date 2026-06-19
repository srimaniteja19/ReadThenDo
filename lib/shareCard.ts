import type { APIResponse, HabitBattleResult, HabitDNA } from "@/types/habits";

const W = 1200;
const H = 630;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, "#fafaf9");
  gradient.addColorStop(1, "#f3f0ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(124, 58, 237, 0.08)";
  ctx.beginPath();
  ctx.arc(W * 0.85, H * 0.15, 180, 0, Math.PI * 2);
  ctx.fill();
}

function drawWatermark(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#7c3aed";
  ctx.font = "500 28px system-ui, sans-serif";
  ctx.fillText("ReadThenDo", 64, H - 48);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create image"))),
      "image/png"
    );
  });
}

export async function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function renderHabitDNACard(dna: HabitDNA): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx);

  ctx.fillStyle = "#0f0f0e";
  ctx.font = "72px system-ui";
  ctx.fillText(dna.emoji, 64, 120);

  ctx.font = "500 52px system-ui, sans-serif";
  ctx.fillStyle = "#0f0f0e";
  wrapText(ctx, dna.label, 64, 200, W - 128, 58);

  ctx.font = "400 32px system-ui, sans-serif";
  ctx.fillStyle = "#3d3d3a";
  wrapText(ctx, dna.tagline, 64, 320, W - 128, 42);

  ctx.fillStyle = "#7a7a74";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText("HABIT DNA", 64, 72);

  drawWatermark(ctx);
  return canvas;
}

export function renderBattleCard(
  result: HabitBattleResult,
  bookAName: string,
  bookBName: string,
  goal: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx);

  ctx.fillStyle = "#7a7a74";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText("HABIT BATTLE VERDICT", 64, 72);

  ctx.fillStyle = "#0f0f0e";
  ctx.font = "500 44px system-ui, sans-serif";
  ctx.fillText(`🏆 ${result.winnerName} wins`, 64, 150);

  ctx.font = "400 30px system-ui, sans-serif";
  ctx.fillStyle = "#7c3aed";
  wrapText(ctx, result.verdict, 64, 210, W - 128, 38);

  ctx.fillStyle = "#3d3d3a";
  ctx.font = "400 24px system-ui, sans-serif";
  ctx.fillText(`${bookAName} vs ${bookBName}`, 64, 340);
  wrapText(ctx, `Goal: ${goal}`, 64, 380, W - 128, 32);

  drawWatermark(ctx);
  return canvas;
}

export function renderSynthesisCard(data: APIResponse): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx);

  ctx.fillStyle = "#7a7a74";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText("CROSS-BOOK CONSENSUS", 64, 72);

  ctx.fillStyle = "#0f0f0e";
  ctx.font = "500 36px system-ui, sans-serif";
  const insight = data.synthesisInsight ?? "Three books, one unified system.";
  wrapText(ctx, insight, 64, 130, W - 128, 44);

  ctx.fillStyle = "#3d3d3a";
  ctx.font = "400 26px system-ui, sans-serif";
  let y = 280;
  data.habits.forEach((habit, i) => {
    ctx.fillText(`${i + 1}. ${habit.name}`, 64, y);
    y += 40;
  });

  if (data.bookSources?.length) {
    ctx.fillStyle = "#7a7a74";
    ctx.font = "400 22px system-ui, sans-serif";
    ctx.fillText(data.bookSources.join(" · "), 64, y + 20);
  }

  drawWatermark(ctx);
  return canvas;
}

export async function shareOrDownloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const blob = await canvasToBlob(canvas);
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "ReadThenDo" });
      return;
    } catch {
      /* fall through to download */
    }
  }

  await downloadCanvas(canvas, filename);
}

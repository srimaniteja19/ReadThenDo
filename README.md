# ReadThenDo

Turn any book summary into 3 actionable habits and a personalized 30-day plan, powered by Google Gemini.

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API (`gemini-3.1-flash-lite`) via `@google/generative-ai`

## Setup

1. Install dependencies:

```bash
npm install
npm install @google/generative-ai
```

2. Get a free API key from [Google AI Studio](https://aistudio.google.com), then add it to `.env.local`:

```bash
# .env.local
GEMINI_API_KEY=your_key_here
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Paste a book summary or click a sample book button (Atomic Habits, Deep Work, Essentialism, Ultralearning).
2. Click **Extract habits** to generate 3 habits with implementation intentions.
3. View the **30-day plan** broken into three phases.

## Project structure

```
app/
  page.tsx                    — main UI (input, loading, habits, plan)
  api/extract-habits/route.ts — Gemini API route
components/
  HabitCard.tsx               — single habit card
  PlanPhase.tsx               — single phase block
  StepDots.tsx                — 3-dot progress indicator
types/
  habits.ts                   — TypeScript interfaces
```

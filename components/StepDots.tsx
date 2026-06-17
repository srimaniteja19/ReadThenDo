type Step = "input" | "habits" | "plan";

interface StepDotsProps {
  currentStep: Step;
}

const STEPS: { id: Step; label: string }[] = [
  { id: "input", label: "Input" },
  { id: "habits", label: "Habits" },
  { id: "plan", label: "Plan" },
];

const PROGRESS: Record<Step, string> = {
  input: "0%",
  habits: "50%",
  plan: "100%",
};

function getStepState(
  stepId: Step,
  currentStep: Step
): "inactive" | "active" | "done" {
  const order: Step[] = ["input", "habits", "plan"];
  const currentIndex = order.indexOf(currentStep);
  const stepIndex = order.indexOf(stepId);

  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "inactive";
}

export default function StepDots({ currentStep }: StepDotsProps) {
  return (
    <div className="w-full">
      <div
        className="step-track"
        style={{ ["--step-progress" as string]: PROGRESS[currentStep] }}
      >
        <div className="step-track-line" aria-hidden />
        <div className="step-track-nodes">
          {STEPS.map((step) => {
            const state = getStepState(step.id, currentStep);
            return (
              <div key={step.id} className="step-node-wrap">
                <div
                  className={`step-node step-node--${state}`}
                  aria-label={`${step.label}: ${state}`}
                />
                <span
                  className={`step-label step-label--${state === "inactive" ? "inactive" : state}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

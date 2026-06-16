type Step = "input" | "habits" | "plan";

interface StepDotsProps {
  currentStep: Step;
}

const STEPS: { id: Step; label: string }[] = [
  { id: "input", label: "Input" },
  { id: "habits", label: "Habits" },
  { id: "plan", label: "Plan" },
];

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
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const state = getStepState(step.id, currentStep);
          const connectorDone =
            index < STEPS.length - 1 &&
            getStepState(STEPS[index + 1].id, currentStep) !== "inactive";

          return (
            <div
              key={step.id}
              className="flex items-center"
              style={{ flex: index === STEPS.length - 1 ? "0 0 auto" : "1 1 0" }}
            >
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  state === "active" ? "step-dot-pulse" : ""
                }`}
                style={{
                  background:
                    state === "inactive" ? "transparent" : "var(--accent)",
                  border:
                    state === "inactive"
                      ? "2px solid var(--border-mid)"
                      : "2px solid var(--accent)",
                }}
                aria-label={`${step.label}: ${state}`}
              />
              {index < STEPS.length - 1 && (
                <div
                  className="mx-1 h-0.5 flex-1 rounded-full"
                  style={{
                    background: connectorDone
                      ? "var(--accent)"
                      : "var(--border-mid)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between">
        {STEPS.map((step) => {
          const state = getStepState(step.id, currentStep);
          return (
            <span
              key={step.id}
              className="label-meta"
              style={{
                color:
                  state === "active"
                    ? "var(--accent-text)"
                    : state === "done"
                      ? "var(--text-secondary)"
                      : "var(--text-muted)",
              }}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

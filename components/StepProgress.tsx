import { Check } from "lucide-react";

const STEPS = ["Label", "Prescribed", "Result"];

export function StepProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="step-track" aria-label={`Step ${step} of 3`}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n === step ? "step-dot step-dot-active" : n < step ? "step-dot step-dot-done" : "step-dot";
        return (
          <span key={label} className={state}>
            {n < step ? <Check className="h-3 w-3" /> : <span>{n}</span>}
            {n === step ? label : null}
          </span>
        );
      })}
    </div>
  );
}

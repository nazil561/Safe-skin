"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleHelp, Pill, ShoppingBag } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StepProgress } from "@/components/StepProgress";
import type { Prescribed } from "@/lib/rules";

const OPTIONS = [
  { value: "yes" as Prescribed, label: "Yes", detail: "Prescribed or dispensed for me", Icon: Pill },
  { value: "no" as Prescribed, label: "No", detail: "Bought it myself", Icon: ShoppingBag },
  { value: "not_sure" as Prescribed, label: "Not sure", detail: "I cannot confirm", Icon: CircleHelp },
];

export default function PrescribedStep() {
  const router = useRouter();
  const [choice, setChoice] = useState<Prescribed>("no");

  function submit() {
    sessionStorage.setItem("ss_presc", choice);
    router.push("/check/result");
  }

  return (
    <>
      <TopBar back />
      <main className="px-5 pt-5 md:px-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow text-brand-600">Step 2 of 3</div>
            <h2 className="display mt-1 text-xl font-semibold md:text-2xl">Was this prescribed?</h2>
          </div>
          <StepProgress step={2} />
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          This changes the guidance: prescribed products need clinician review before any change.
        </p>

        <div className="mt-4 space-y-2 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
          {OPTIONS.map(({ value, label, detail, Icon }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                choice === value ? "border-brand-500 bg-brand-50 shadow-card" : "border-surface-edge bg-surface"
              }`}
            >
              <input
                type="radio"
                name="presc"
                value={value}
                checked={choice === value}
                onChange={() => setChoice(value)}
              />
              <span className={`tile-icon h-9 w-9 ${choice === value ? "" : "bg-surface-dim text-ink-soft"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{label}</span>
                <span className="block text-xs text-ink-mute">{detail}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="card mt-5 p-4 text-xs leading-relaxed text-ink-soft">
          <strong className="font-semibold">Why we ask:</strong> the same ingredient can need very different next steps
          depending on whether a clinician is already supervising its use.
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={() => router.back()} className="btn-outline flex-1">Back</button>
          <button onClick={submit} className="btn-primary flex-1">Check ingredients</button>
        </div>
      </main>
    </>
  );
}

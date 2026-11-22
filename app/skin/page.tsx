"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import {
  getProfileSnapshot,
  getServerProfile,
  saveProfile,
  subscribeStore,
  type SkinProfile,
} from "@/lib/client-store";

const FEEL = ["Dry", "Oily", "Combination", "Sensitive", "Balanced"];
const GOALS = ["Irritation", "Breakouts", "Pigmentation", "Redness", "Ingredient safety"];
const FLAGS = ["Pregnant / breastfeeding", "Prescription treatment", "Known allergies", "None of these"];

function Chips({ title, options, picked, onToggle }: {
  title: string;
  options: string[];
  picked: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <section className="card p-4 md:p-5">
      <div className="eyebrow text-brand-600">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = picked.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`demo-chip flex items-center gap-1.5 ${on ? "demo-chip-on" : ""}`}
            >
              {on ? <Check className="h-3 w-3" /> : null}
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function SkinPage() {
  const profile = useSyncExternalStore(subscribeStore, getProfileSnapshot, getServerProfile);
  const { feel, goals, flags } = profile;

  function toggle(key: keyof SkinProfile, value: string) {
    const list = profile[key];
    saveProfile({
      ...profile,
      [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    });
  }

  const total = feel.length + goals.length + flags.length;

  return (
    <>
      <TopBar back />
      <main className="px-5 pt-5 md:px-0 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6">
        <div>
          <div className="relative overflow-hidden rounded-xl2 border border-surface-edge bg-surface p-5 md:p-6">
            <div className="ambient-orb -right-8 -top-10 h-36 w-36 bg-brand-200" />
            <div className="relative">
              <div className="eyebrow text-brand-600">Guided profile</div>
              <h1 className="display mt-2 text-3xl font-semibold leading-tight md:text-4xl">Build your skin profile.</h1>
              <p className="mt-2 max-w-lg text-sm text-ink-soft">
                A few careful questions help you read ingredient lists with the right context. Nothing here is a diagnosis.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Chips title="01 · How does your skin usually feel?" options={FEEL} picked={feel} onToggle={(v) => toggle("feel", v)} />
            <Chips title="02 · What are you trying to understand?" options={GOALS} picked={goals} onToggle={(v) => toggle("goals", v)} />
            <Chips title="03 · Anything to flag first?" options={FLAGS} picked={flags} onToggle={(v) => toggle("flags", v)} />
          </div>
        </div>

        <aside className="mt-5 xl:sticky xl:top-20 xl:mt-0 xl:self-start">
          <div className="demo-panel stat-pop">
            <div className="flex items-center gap-2 text-brand-600">
              <Sparkles className="h-4 w-4" />
              <div className="eyebrow">Your profile</div>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="mini-stat-value text-4xl">{total}</span>
              <span className="pb-1 text-xs text-ink-mute">selections made</span>
            </div>
            <dl className="mt-4 space-y-3 border-t border-surface-edge pt-4 text-xs">
              <div>
                <dt className="font-semibold">Skin feel</dt>
                <dd className="mt-0.5 text-ink-mute">{feel.length ? feel.join(", ") : "Not selected"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Focus</dt>
                <dd className="mt-0.5 text-ink-mute">{goals.length ? goals.join(", ") : "Not selected"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Flags</dt>
                <dd className="mt-0.5 text-ink-mute">{flags.length ? flags.join(", ") : "Not selected"}</dd>
              </div>
            </dl>
            <Link href="/check" className="btn-primary mt-5 flex items-center justify-center gap-2">
              Check a label <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <p className="mt-3 text-[11px] leading-snug text-ink-mute">
              This profile is saved on this device only. It is not a medical assessment and does not replace professional advice.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}

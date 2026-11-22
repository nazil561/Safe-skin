"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { History, Megaphone, RotateCcw } from "lucide-react";
import { saveCheck } from "@/lib/client-store";
import { TopBar } from "@/components/TopBar";
import { StepProgress } from "@/components/StepProgress";
import { TierChip } from "@/components/TierChip";
import { FlagCard } from "@/components/FlagCard";
import { simpleCheck, TIER_REASONS, topClass, type Prescribed } from "@/lib/rules";

const BANNER_TONE = {
  RED: "border-danger-500 bg-danger-50",
  AMBER: "border-warn-500 bg-warn-50",
  GREEN: "border-safe-500 bg-safe-50",
} as const;

const NEXT_ACTIONS = [
  "Compare flagged names with the physical package.",
  "Ask a pharmacist about safer alternatives.",
  "Stop use and seek advice if irritation appears.",
];

function readPrescribed(raw: string | null): Prescribed {
  return raw === "yes" || raw === "not_sure" ? raw : "no";
}

function subscribe() {
  return () => {};
}

function getSnapshot() {
  if (typeof window === "undefined") return "";
  return JSON.stringify([
    sessionStorage.getItem("ss_text") ?? "",
    sessionStorage.getItem("ss_panel") !== "false",
    sessionStorage.getItem("ss_presc"),
  ]);
}

function getServerSnapshot() {
  return "";
}

export default function ResultStep() {
  const router = useRouter();
  const key = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const snapshot = useMemo(() => {
    if (!key) return null;
    const [text, panel, rawPresc] = JSON.parse(key) as [string, boolean, string | null];
    const presc = readPrescribed(rawPresc);
    return { text, panel, presc, res: simpleCheck(text, panel, presc) };
  }, [key]);

  const [savedId, setSavedId] = useState<string | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!snapshot || savedRef.current) return;
    savedRef.current = true;
    const next = saveCheck({
      labelText: snapshot.text,
      hasPanel: snapshot.panel,
      prescribed: snapshot.presc,
      result: snapshot.res,
    });
    setSavedId(next[0]?.id ?? null);
  }, [snapshot]);

  if (!snapshot) return (
    <div>
      <TopBar back />
      <main className="p-5 text-sm text-ink-mute">Loading…</main>
    </div>
  );

  const { res, presc } = snapshot;

  return (
    <div>
      <TopBar back />
      <main className="px-5 pt-5 md:px-0 md:grid md:grid-cols-[minmax(0,1fr)_280px] md:gap-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow text-brand-600">Step 3 of 3 · result</div>
            <StepProgress step={3} />
          </div>

          <div className={`mt-4 rounded-xl2 border-l-4 p-4 md:p-5 ${BANNER_TONE[topClass(res.top)]}`}>
            <TierChip tier={res.top} />
            <p className="mt-2 text-xs text-ink-soft">{TIER_REASONS[res.top]}</p>
          </div>

          {res.claims.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Megaphone className="h-3.5 w-3.5 text-warn-700" />
              {res.claims.map((claim) => (
                <span key={claim} className="claim-badge">{claim}</span>
              ))}
            </div>
          )}

          {presc === "yes" && (
            <div className="mt-3 rounded-lg border-l-4 border-warn-500 bg-warn-50 px-3 py-2 text-xs text-warn-700">
              <strong>Prescribed medicine:</strong> never stop or swap a prescribed treatment without advice from your prescriber or pharmacist.
            </div>
          )}

          <div className="section-label eyebrow mt-5">Flagged findings</div>
          <div className="mt-3 space-y-3">
            {res.flags.map((f, i) => <FlagCard key={i} flag={f} />)}
          </div>

          <p className="mt-4 text-xs text-ink-mute">
            SafeSkin only reads label text. It cannot detect undeclared ingredients, measure amounts, diagnose, or give medical advice.
          </p>
        </div>

        <aside className="mt-5 md:sticky md:top-20 md:mt-0 md:self-start">
          <div className="card p-4">
            <div className="eyebrow text-brand-600">Next actions</div>
            <h3 className="display mt-2 text-lg font-semibold">What to do now.</h3>
            <ul className="mt-3 space-y-2">
              {NEXT_ACTIONS.map((action) => (
                <li key={action} className="flex gap-2 text-xs leading-snug text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {action}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => router.push("/check")} className="btn-primary flex items-center justify-center gap-2">
                <RotateCcw className="h-3.5 w-3.5" /> Check another
              </button>
              <button onClick={() => router.push("/")} className="btn-outline">Home</button>
              {savedId ? (
                <Link href={`/history?check=${savedId}`} className="btn-ghost flex items-center justify-center gap-2">
                  <History className="h-3.5 w-3.5" /> View saved record
                </Link>
              ) : null}
              <Link href="/history" className="btn-ghost flex items-center justify-center gap-2">
                <History className="h-3.5 w-3.5" /> All checks
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

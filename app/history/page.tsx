"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, FileText, History, Trash2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { TierChip } from "@/components/TierChip";
import {
  clearChecks,
  getChecksSnapshot,
  getSelectedCheckSnapshot,
  getServerChecks,
  getServerSelectedCheck,
  removeCheck,
  subscribeStore,
} from "@/lib/client-store";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function HistoryPage() {
  const checks = useSyncExternalStore(subscribeStore, getChecksSnapshot, getServerChecks);
  const fromUrl = useSyncExternalStore(subscribeStore, getSelectedCheckSnapshot, getServerSelectedCheck);
  const [manualId, setManualId] = useState<string | null>(null);
  const selectedId = manualId ?? fromUrl;

  useEffect(() => {
    window.dispatchEvent(new Event("ss-store"));
  }, []);

  const selected = checks.find((item) => item.id === selectedId) ?? null;

  return (
    <>
      <TopBar back />
      <main className="px-5 pt-5 md:px-0">
        <div className="relative overflow-hidden rounded-xl2 border border-surface-edge bg-surface p-5 md:p-6">
          <div className="ambient-orb -right-8 -top-10 h-36 w-36 bg-brand-200" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow text-brand-600">Saved reviews</div>
              <h1 className="display mt-2 text-3xl font-semibold md:text-4xl">Your check history.</h1>
              <p className="mt-2 max-w-lg text-sm text-ink-soft">
                Completed label reviews stay on this device so you can compare results and revisit the details.
              </p>
            </div>
            <div className="flex items-end gap-2">
              <span className="mini-stat-value text-4xl">{checks.length}</span>
              <span className="pb-1 text-xs text-ink-mute">saved</span>
            </div>
          </div>
        </div>

        {checks.length === 0 ? (
          <section className="demo-panel mt-5 flex flex-col items-center py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <History className="h-5 w-5" />
            </div>
            <h2 className="display mt-4 text-xl font-semibold">No saved checks yet.</h2>
            <p className="mt-1 max-w-xs text-sm text-ink-mute">
              Complete a label review and it will appear here automatically.
            </p>
            <Link href="/check" className="btn-primary mt-5">Start a check</Link>
          </section>
        ) : (
          <>
            {selected ? (
              <section className="card mt-5 p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="eyebrow text-brand-600">Selected record</div>
                    <div className="mt-2"><TierChip tier={selected.result.top} /></div>
                  </div>
                  <button onClick={() => setManualId(null)} className="btn-ghost flex items-center gap-1.5">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to list
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-mute">
                  <span>{formatDate(selected.createdAt)}</span>
                  <span>{selected.prescribed === "yes" ? "Prescribed" : "Non-prescribed"}</span>
                  <span>{selected.hasPanel ? "Panel readable" : "Panel missing"}</span>
                  <span>{selected.result.flags.length} findings</span>
                </div>
                <div className="mt-4 rounded-xl border border-surface-edge bg-surface-dim p-3 text-sm leading-relaxed">
                  {selected.labelText || "No label text was entered."}
                </div>
                <div className="mt-4 space-y-2">
                  {selected.result.flags.map((flag, i) => (
                    <div key={i} className="rounded-lg border border-surface-edge px-3 py-2 text-sm">
                      <strong>{flag.name}</strong>
                      <div className="text-xs text-ink-mute">{flag.text}</div>
                      {flag.needs_review ? <div className="mt-1 text-xs font-semibold text-warn-700">Needs review</div> : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-5 flex items-center justify-between">
              <div className="section-label eyebrow">All records</div>
              <button
                onClick={() => { clearChecks(); setManualId(null); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-danger-700"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>

            <section className="mt-3 divide-y divide-surface-edge overflow-hidden rounded-xl2 border border-surface-edge bg-surface">
              {checks.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-3 p-4">
                  <button onClick={() => setManualId(item.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {item.labelText.split(",").slice(0, 3).join(",") || "No label text"}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-mute">
                        <Clock3 className="h-3 w-3" /> {formatDate(item.createdAt)} · {item.result.flags.length} findings
                      </span>
                    </span>
                  </button>
                  <TierChip tier={item.result.top} />
                  <button
                    onClick={() => { removeCheck(item.id); if (selectedId === item.id) setManualId(null); }}
                    aria-label="Delete record"
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-mute hover:bg-danger-50 hover:text-danger-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </section>
          </>
        )}

        <footer className="footer-note mt-6 pb-6 text-center">
          Records are stored in this browser only. SafeSkin gives educational information, not medical advice.
        </footer>
      </main>
    </>
  );
}

"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck, CircleX, FlaskConical, ScanEye } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { EVAL_CASES, SAMPLES } from "@/lib/samples";
import { simpleCheck, topClass } from "@/lib/rules";

export default function EvalPage() {
  const results = useMemo(() => EVAL_CASES.map((c) => {
    const sample = SAMPLES[c.i];
    const res = simpleCheck(sample.text, sample.hasPanel, c.prescribed);
    const got = topClass(res.top);
    const reviewCaught = "expectReview" in c && c.expectReview
      ? res.flags.some((f) => f.needs_review)
      : null;
    return { ...c, got, pass: got === c.expected, reviewCaught };
  }), []);

  const passed = results.filter((r) => r.pass).length;
  const accuracy = Math.round((passed / results.length) * 100);
  const reviewTotal = results.filter((r) => r.reviewCaught !== null).length;
  const reviewPassed = results.filter((r) => r.reviewCaught === true).length;

  return (
    <>
      <TopBar back />
      <main className="px-5 pt-5 md:px-0">
        <section className="relative overflow-hidden rounded-[1.5rem] bg-ink-950 p-6 text-white shadow-lift">
          <div className="ambient-orb -right-10 -top-12 h-48 w-48 bg-brand-500" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div
              className="grid h-28 w-28 shrink-0 place-items-center rounded-full"
              style={{ background: `conic-gradient(#6ea8ff ${accuracy}%, rgba(255,255,255,0.12) 0)` }}
            >
              <div className="grid h-24 w-24 place-items-center rounded-full bg-ink-950 text-center">
                <div>
                  <div className="display text-3xl font-semibold">{accuracy}%</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/50">tier match</div>
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="eyebrow text-brand-300">Rule benchmark</div>
              <h1 className="display mt-2 text-3xl font-semibold leading-tight md:text-4xl">
                How the rules behave.
              </h1>
              <p className="mt-2 max-w-lg text-sm text-white/70">
                Seven fixed cases run through the same rule engine as the checker. This measures consistency on the sample set, not clinical accuracy.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Cases", value: results.length },
            { label: "Tier matches", value: passed },
            { label: "Review flags", value: reviewPassed },
            { label: "Review cases", value: reviewTotal },
          ].map((m) => (
            <div key={m.label} className="stat-pop card p-4">
              <div className="mini-stat-value text-3xl">{m.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-mute">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="section-label eyebrow mt-7">Case-by-case</div>
        <section className="card mt-3 overflow-hidden">
          <div className="hidden grid-cols-[1fr_70px_70px_90px] gap-2 border-b border-surface-edge px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-ink-mute md:grid">
            <span>Case</span><span>Expected</span><span>Got</span><span>Result</span>
          </div>
          <div className="divide-y divide-surface-edge">
            {results.map((r) => (
              <div key={r.i} className="grid grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 md:grid-cols-[1fr_70px_70px_90px]">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px] text-ink-mute">
                    {r.prescribed === "yes" ? "prescribed" : "non-prescribed"}
                    {r.reviewCaught !== null ? ` · review ${r.reviewCaught ? "caught" : "missed"}` : ""}
                  </div>
                </div>
                <div className="hidden text-xs text-ink-soft md:block">{r.expected}</div>
                <div className="hidden text-xs text-ink-soft md:block">{r.got}</div>
                <div className="flex items-center justify-end gap-1 md:justify-start">
                  {r.pass ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-safe-50 px-2 py-1 text-[10px] font-bold text-safe-700">
                      <CircleCheck className="h-3 w-3" /> PASS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-danger-50 px-2 py-1 text-[10px] font-bold text-danger-700">
                      <CircleX className="h-3 w-3" /> FAIL
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-[11px] text-ink-mute md:hidden">
                  expected {r.expected} · got {r.got}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="demo-panel mt-5">
          <div className="flex items-center gap-2 text-brand-600">
            <ScanEye className="h-4 w-4" />
            <div className="eyebrow">How to read this</div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            A pass means the keyword engine returned the expected risk band on a fixed sample. It does not mean the ingredient information is complete, current, or clinically validated. OCR typos are intentionally included to show where manual review matters.
          </p>
        </div>

        <Link href="/check" className="btn-primary mt-5 flex items-center justify-center gap-2">
          Try a real check <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <footer className="footer-note mt-6 pb-6 text-center">
          <FlaskConical className="mx-auto mb-2 h-4 w-4" />
          Educational information only · not medical advice · v2.5
        </footer>
      </main>
    </>
  );
}

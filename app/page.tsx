"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ClipboardCheck, FlaskConical, ScanLine, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { simpleCheck, TIER_LABELS, TIER_REASONS, topClass } from "@/lib/rules";

const DEMO_ITEMS = ["Mercury", "Clobetasol", "Hydroquinone", "Tretinoin", "Niacinamide", "Glycerin"];

const TIPS = [
  { text: "Never use unlabelled fairness creams on the face", tone: "risk-red" },
  { text: "Steroids, mercury and hydroquinone are high-risk in cosmetics", tone: "risk-amber" },
  { text: "Always read the full ingredient list yourself", tone: "risk-green" },
  { text: "Spreading redness, swelling or fever → seek urgent care", tone: "urgent" },
];

const SPECTRUM = [
  { key: "RED", label: "RED", cls: "spectrum-seg spectrum-red" },
  { key: "AMBER", label: "AMBER", cls: "spectrum-seg spectrum-amber" },
  { key: "GREEN", label: "GREEN", cls: "spectrum-seg spectrum-green" },
];

const METRICS = [
  { value: "7", label: "label rules", tone: "var(--color-violet-500, #8b5cf6)" },
  { value: "3", label: "risk tiers", tone: "rgba(251,113,133,0.5)" },
  { value: "100%", label: "on-device", tone: "rgba(20,184,166,0.5)" },
  { value: "0", label: "data uploaded", tone: "rgba(245,158,11,0.5)" },
];

const WORKFLOW = [
  { n: "01", title: "Capture", body: "Type the INCI panel or import a photo for on-device text extraction.", Icon: ScanLine },
  { n: "02", title: "Confirm", body: "Correct the detected text and tell us whether a prescription is involved.", Icon: ClipboardCheck },
  { n: "03", title: "Decide", body: "Get a clear red / amber / green read with flags and next questions.", Icon: ShieldCheck },
];

export default function Home() {
  const [picked, setPicked] = useState<string[]>(["Glycerin", "Niacinamide"]);
  const result = simpleCheck(picked.join(", "), true, "no");
  const tier = result.top;
  const band = topClass(tier);

  function toggle(name: string) {
    setPicked((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  return (
    <>
      <div className="lg:hidden"><TopBar /></div>
      <main className="px-4 pb-10 pt-5 md:px-0 lg:pt-8">
        <section className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr] xl:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="hero-dark relative flex min-h-[430px] flex-col overflow-hidden rounded-[1.5rem] p-6 text-white shadow-lift md:p-8"
          >
            <div className="hero-noise pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />

            <div className="relative flex flex-wrap items-center gap-2">
              <span className="eyebrow text-white/80">Ingredient intelligence</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">Live console</span>
            </div>

            <div className="relative mt-10 md:mt-14">
              <h1 className="display max-w-xl text-[2.4rem] font-semibold leading-[1.04] md:text-5xl">
                Read the label.<br />Know the <span className="gradient-text">risk.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
                A plain-language review system for cosmetic ingredient lists — built for quick, careful decisions before a product touches your skin.
              </p>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link href="/check" className="btn-primary gap-2 px-5 py-3">
                Run a label check <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/skin" className="btn-outline gap-2 border-white/30 px-5 py-3 text-white hover:bg-white/10">
                Build a skin profile
              </Link>
            </div>

            <div className="relative mt-auto flex flex-wrap gap-2 pt-8 text-[11px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500 px-3 py-1 font-semibold text-white">
                <ShieldCheck className="h-3.5 w-3.5" /> Guided review
              </span>
              <span className="rounded-full bg-teal-500/90 px-3 py-1 font-semibold text-white">On-device OCR</span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-white/90">Local history</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="glass-panel relative flex flex-col p-5 md:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow">Live preview</div>
                <div className="mt-1 text-sm font-semibold">Sample INCI panel</div>
              </div>
              <span className="rounded-full border border-surface-edge bg-surface-dim px-2.5 py-1 text-[10px] text-ink-mute">batch 0417</span>
            </div>

            <div className="scan-card relative mt-4">
              <div className="scan-head">
                <span>Detected ingredients</span>
                <span>8 tokens</span>
              </div>
              <div className="scan-row">
                <span className="scan-token">Aqua</span>
                <span className="scan-token">Glycerin</span>
                <span className="scan-token token-danger">Mercury</span>
              </div>
              <div className="scan-row">
                <span className="scan-token token-amber">Hydroquinone</span>
                <span className="scan-token">Parfum</span>
                <span className="scan-token">Cetyl Alcohol</span>
              </div>
              <div className="scan-row">
                <span className="scan-token token-safe">Niacinamide</span>
                <span className="scan-token">Sodium Hyaluronate</span>
              </div>
              <div className="scan-beam absolute bottom-10 left-0 h-px w-full" />
              <div className="scan-head border-b-0 border-t border-white/10">
                <span>2 matches flagged</span>
                <span>review advised</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="risk-gauge grid h-20 w-20 shrink-0 place-items-center rounded-full">
                <div className="grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-[#0b1024] text-center">
                  <div>
                    <div className="display text-xl font-semibold leading-none">{picked.length}</div>
                    <div className="text-[8px] uppercase tracking-widest text-ink-mute">tokens</div>
                  </div>
                </div>
              </div>
              <div className="min-w-0">
                <div className="eyebrow mb-1">Current read</div>
                <div className="display truncate text-lg font-semibold">{TIER_LABELS[tier]}</div>
                <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-mute">{TIER_REASONS[tier]}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Tap to test the engine</span>
                <span className="text-[10px] text-ink-mute">{picked.length} selected</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DEMO_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`demo-chip ${picked.includes(item) ? "demo-chip-on" : ""}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="spectrum mt-4">
                {SPECTRUM.map((s) => (
                  <span key={s.key} className={s.cls} style={{ opacity: band === s.key ? 1 : 0.3 }}>{s.label}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="metric-card" style={{ "--metric-glow": m.tone } as CSSProperties}>
              <div className="display relative text-2xl font-semibold">{m.value}</div>
              <div className="relative mt-1 text-[10px] uppercase tracking-widest text-ink-mute">{m.label}</div>
            </div>
          ))}
        </section>

        <div className="section-label eyebrow mt-9">How a review runs</div>
        <section className="mt-3 grid gap-3 md:grid-cols-3">
          {WORKFLOW.map(({ n, title, body, Icon }) => (
            <div key={n} className="glass-panel p-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-[10px]">{n}</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-4 w-4" /></span>
              </div>
              <div className="display mt-4 text-lg font-semibold">{title}</div>
              <p className="mt-1 text-xs leading-relaxed text-ink-mute">{body}</p>
            </div>
          ))}
        </section>

        <div className="section-label eyebrow mt-9">Tools</div>
        <section className="mt-3 grid gap-3 md:grid-cols-3">
          <Link href="/check" className="tool-feature group md:col-span-2">
            <div className="relative flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><Tag className="h-5 w-5" /></span>
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Primary</span>
                <ArrowUpRight className="h-4 w-4 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </span>
            </div>
            <div className="relative mt-6">
              <div className="eyebrow text-white/70">Label review</div>
              <div className="display mt-1 text-xl font-semibold">Check a product</div>
              <p className="mt-1 max-w-sm text-xs leading-snug text-white/70">Scan, confirm, and review ingredient flags with clear next actions.</p>
              <span className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink-950">Start a check →</span>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            <Link href="/skin" className="tile-skin tile group">
              <ArrowUpRight className="tile-arrow h-4 w-4" />
              <div className="tile-icon"><Sparkles className="h-5 w-5" /></div>
              <div className="relative mt-1 text-sm font-semibold">Skin profile</div>
              <div className="relative text-xs leading-snug text-ink-mute">Sensitivity and goal matching</div>
            </Link>
            <Link href="/eval" className="tile-eval tile group">
              <ArrowUpRight className="tile-arrow h-4 w-4" />
              <div className="tile-icon"><FlaskConical className="h-5 w-5" /></div>
              <div className="relative mt-1 text-sm font-semibold">Benchmark</div>
              <div className="relative text-xs leading-snug text-ink-mute">Rule accuracy on sample cases</div>
            </Link>
          </div>
        </section>

        <div className="section-label eyebrow mt-9">Quick safety notes</div>
        <section className="card soft-teal color-rail-teal mt-3 p-4">
          <ul className="grid gap-2.5 text-sm text-ink-soft md:grid-cols-2">
            {TIPS.map((tip) => (
              <li key={tip.text} className="flex gap-2">
                {tip.tone === "urgent" ? (
                  <span className="urgent w-full">{tip.text}</span>
                ) : (
                  <><span className={`risk-dot ${tip.tone} mt-2`} /><span>{tip.text}</span></>
                )}
              </li>
            ))}
          </ul>
        </section>

        <footer className="footer-note mt-8 pb-6 text-center">
          SafeSkin reads only the text you enter. It cannot detect undeclared ingredients or replace professional advice.
          <br />v2.5 · built for careful review
        </footer>
      </main>
    </>
  );
}

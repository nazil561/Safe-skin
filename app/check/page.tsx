"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StepProgress } from "@/components/StepProgress";
import { AmbiguityPanel, detectAmbiguity } from "@/components/AmbiguityPanel";
import { SAMPLES } from "@/lib/samples";

const SAMPLE_TONE: Record<string, string> = {
  "Steroid cream": "risk-red",
  "Mercury cream": "risk-red",
  "Prescribed tube": "risk-red",
  "Unlabelled jar": "risk-amber",
  "Clean label": "risk-green",
  "Triple combo": "risk-red",
  "OCR typo": "risk-amber",
};

const RAIL_STEPS = [
  "Transcribe the ingredient panel exactly as printed.",
  "Confirm whether the product was prescribed to you.",
  "Review flagged ingredients and the questions to ask.",
];

export default function CheckStep1() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [hasPanel, setHasPanel] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [ocrState, setOcrState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [ocrMessage, setOcrMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  const ambig = useMemo(() => detectAmbiguity(text, hasPanel), [text, hasPanel]);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  async function readPhoto(file: File) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setPreview(url);
    setOcrState("loading");
    setOcrMessage("Reading the label on this device…");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const extracted = data.text.replace(/\s+/g, " ").trim();
      if (!extracted) throw new Error("No text found");
      setText(extracted);
      setConfirmed(false);
      setOcrState("done");
      setOcrMessage("Text extracted. Review it below before continuing.");
    } catch {
      setOcrState("error");
      setOcrMessage("We could not read that image. Type the ingredients below instead.");
    }
  }

  function next() {
    if (!confirmed) return;
    sessionStorage.setItem("ss_text", text);
    sessionStorage.setItem("ss_panel", String(hasPanel));
    router.push("/check/prescribed");
  }

  return (
    <>
      <TopBar back />
      <main className="px-5 pt-5 md:px-0 xl:grid xl:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.7fr)] xl:gap-8">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="eyebrow text-brand-600">Step 1 of 3</div>
              <h2 className="display mt-1 text-xl font-semibold md:text-2xl">Capture the ingredient label</h2>
            </div>
            <StepProgress step={1} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            Type or paste the ingredient list. Correct anything the app misreads before continuing.
          </p>

          <div className="section-label eyebrow mt-5">Try a sample</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button key={s.label}
                onClick={() => { setText(s.text); setHasPanel(s.hasPanel); setConfirmed(false); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-surface-edge bg-surface px-3 py-1.5 text-xs font-medium shadow-card transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <span className={`risk-dot ${SAMPLE_TONE[s.label] ?? "risk-neutral"}`} />
                {s.label}
              </button>
            ))}
          </div>

          <section className="card mt-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow text-brand-600">Photo import</div>
            <span className="text-[10px] text-ink-mute">on-device OCR</span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readPhoto(file);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-outline mt-3 flex w-full items-center justify-center gap-2"
          >
            {ocrState === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {ocrState === "loading" ? "Reading label…" : "Upload label photo"}
          </button>
          {preview ? (
            <div
              className="mt-3 h-32 rounded-xl border border-surface-edge bg-cover bg-center"
              style={{ backgroundImage: `url(${preview})` }}
            />
          ) : null}
          {ocrMessage ? (
            <p className={`mt-2 text-xs ${ocrState === "error" ? "text-danger-700" : "text-ink-mute"}`}>
              {ocrMessage}
            </p>
          ) : null}
        </section>

        <label htmlFor="label-text" className="mt-4 block text-sm font-semibold">Ingredient text</label>
          <textarea
            id="label-text"
            value={text}
            onChange={(e) => { setText(e.target.value); setConfirmed(false); }}
            rows={5}
            className="input mt-1 resize-y"
            placeholder="e.g. Aqua, Glycerin, Niacinamide…"
          />

          <AmbiguityPanel items={ambig} />

          <label className="mt-4 flex items-start gap-2 rounded-xl border border-surface-edge bg-surface-dim p-3 text-sm">
            <input type="checkbox" checked={hasPanel} onChange={(e) => setHasPanel(e.target.checked)} className="mt-1" />
            Ingredient panel is present / readable
          </label>

          <label className="mt-3 flex items-start gap-2 rounded-xl border border-surface-edge bg-surface-dim p-3 text-sm">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
            I have read and corrected the text above and confirmed it matches the physical label.
          </label>

          <div className="mt-5 flex gap-3">
            <button onClick={() => router.push("/")} className="btn-outline flex-1">Cancel</button>
            <button onClick={next} disabled={!confirmed} className="btn-primary flex-1">Continue</button>
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="card sticky top-20 p-5">
            <div className="eyebrow text-brand-600">How it works</div>
            <h3 className="display mt-2 text-xl font-semibold">Three careful steps.</h3>
            <ol className="mt-4 space-y-3">
              {RAIL_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-ink-soft">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-950 text-[11px] font-bold text-white">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-t border-surface-edge pt-4">
              <div className="flex items-start gap-2 text-xs text-ink-mute">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-safe-600" />
                <span>SafeSkin reads only the text you enter. It cannot detect undeclared ingredients or give medical advice.</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}

import { altFor, type Flag } from "@/lib/rules";
import { cn } from "@/lib/utils";

export function FlagCard({ flag }: { flag: Flag }) {
  const tone =
    flag.category.startsWith("RED")
      ? "border-l-danger-500 bg-danger-50/40"
      : flag.category.startsWith("AMBER")
      ? "border-l-warn-500   bg-warn-50/40"
      : "border-l-safe-500   bg-safe-50/40";
  const alts = altFor(flag);

  return (
    <div className={cn("stat-pop rounded-xl2 border border-surface-edge border-l-4 p-4", tone)}>
      <div className="flex flex-wrap items-center gap-2">
        <strong className="text-sm">{flag.name}</strong>
        {flag.badge && (
          <span className="rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {flag.badge}
          </span>
        )}
      </div>
      {flag.why && (
        <div className="mt-2 inline-block rounded-md bg-brand-50 px-2 py-1 text-[11px] text-brand-700">
          Trigger: {flag.why}
        </div>
      )}
      <div className="mt-1 text-[11px] text-ink-mute">Confidence: {flag.confidence}</div>
      {flag.source && <div className="text-[11px] text-ink-mute">Source: {flag.source}</div>}
      {flag.matched_text && <div className="text-[11px] text-ink-mute">Matched: {flag.matched_text}</div>}
      {flag.needs_review && (
        <div className="mt-2 text-xs font-semibold text-warn-700">⚠ Needs review — check this match yourself.</div>
      )}
      {flag.note && <div className="mt-1 text-xs italic text-ink-soft">{flag.note}</div>}
      <p className="mt-2 text-sm text-ink-soft">{flag.text}</p>

      {alts && (
        <div className="mt-3 rounded-lg border border-surface-edge bg-safe-50/60 p-3">
          <div className="text-xs font-semibold text-safe-700">Safer alternatives & next steps</div>
          <ul className="mt-1 space-y-1 text-sm text-ink-soft">
            {alts.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-brand-500">→</span>{a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
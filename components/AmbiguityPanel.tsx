import { AlertTriangle, CheckCircle2, Info, Megaphone } from "lucide-react";

export type Ambig = { kind: "warn" | "info" | "ok"; msg: string; detail: string };

export function detectAmbiguity(text: string, hasPanel: boolean): Ambig[] {
  const t = (text || "").toLowerCase();
  const items: Ambig[] = [];

  if (!hasPanel) items.push({ kind: "warn", msg: "No ingredient panel marked.", detail: "Without a readable panel the result can only be \"cannot verify\"." });
  else if (!t.trim()) items.push({ kind: "warn", msg: "The text box is empty.", detail: "Read something from the photo or type the ingredients manually." });
  else if (t.trim().length < 12) items.push({ kind: "warn", msg: `Very little text was captured (${t.trim().length} chars).`, detail: "Real ingredient lists are longer." });

  ([[/clobetasoi/, "clobetasol"], [/hydrochinoe/, "hydroquinone"]] as const).forEach(([re, fix]) => {
    if (re.test(t)) items.push({ kind: "warn", msg: `Possible OCR typo: looks like "${fix}".`, detail: "Please correct the spelling above." });
  });

  const claim = t.match(/(?:no|without|zero|free of)\s*(mercury|hydroquinone|steroid|hg)\b|((?:mercury|hydroquinone|steroid)[\s-]*free)/);
  if (claim) items.push({ kind: "warn", msg: `Contains a “${claim[0].trim()}” claim.`, detail: "Marketing claims are not ingredients and are not proof of safety." });

  if (/[a-z]+\s+\d+(\.\d+)?\s*%/.test(t)) items.push({ kind: "info", msg: "Percentage strength detected.", detail: "Products listing % strengths of actives are often medicines, not cosmetics." });

  if (items.length === 0 && hasPanel && t.trim()) items.push({ kind: "ok", msg: "No obvious OCR or ambiguity signals.", detail: "Still correct anything misread before continuing." });
  return items;
}

const ICON = { warn: AlertTriangle, info: Info, ok: CheckCircle2 } as const;
const CLS = {
  warn: "bg-warn-50 border border-warn-100 text-warn-700",
  info: "bg-brand-50 border border-brand-100 text-brand-700",
  ok:   "bg-safe-50 border border-safe-100 text-safe-700",
} as const;

export function AmbiguityPanel({ items }: { items: Ambig[] }) {
  return (
    <div className="mt-2 space-y-1.5">
      {items.map((it, i) => {
        const Icon = it.kind === "warn" && it.msg.toLowerCase().includes("claim") ? Megaphone : ICON[it.kind];
        return (
          <div key={i} className={`flex gap-2 rounded-lg px-3 py-2 text-xs ${CLS[it.kind]}`}>
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <div>
              <strong className="block">{it.msg}</strong>
              <span className="text-[11px] opacity-90">{it.detail}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
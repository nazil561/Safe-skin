import { AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";
import type { Tier } from "@/lib/rules";
import { cn } from "@/lib/utils";

const MAP: Record<Tier, { label: string; cls: string; Icon: typeof ShieldX }> = {
  RED_BANNED_TOXIC:             { label: "Banned / toxic",              cls: "bg-danger-50 text-danger-700 ring-1 ring-danger-100", Icon: ShieldX },
  RED_PRESCRIPTION_STEROID:     { label: "Prescription steroid",        cls: "bg-danger-50 text-danger-700 ring-1 ring-danger-100", Icon: ShieldX },
  AMBER_NOT_PERMITTED_COSMETIC: { label: "Not permitted in cosmetics",  cls: "bg-warn-50 text-warn-700 ring-1 ring-warn-100",       Icon: AlertTriangle },
  AMBER_UNLISTED:               { label: "Cannot verify",               cls: "bg-warn-50 text-warn-700 ring-1 ring-warn-100",       Icon: AlertTriangle },
  AMBER_CAUTION:                { label: "Caution",                     cls: "bg-warn-50 text-warn-700 ring-1 ring-warn-100",       Icon: AlertTriangle },
  GREEN_NO_FLAGS:               { label: "No flags",                    cls: "bg-safe-50 text-safe-700 ring-1 ring-safe-100",       Icon: ShieldCheck },
};

export function TierChip({ tier, className }: { tier: Tier; className?: string }) {
  const { label, cls, Icon } = MAP[tier];
  return (
    <span className={cn("chip stat-pop", cls, className)}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}
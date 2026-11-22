import { FlaskConical, History, LayoutDashboard, ScanLine, Sparkles } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Overview", Icon: LayoutDashboard },
  { href: "/check", label: "Check a label", Icon: ScanLine },
  { href: "/skin", label: "Skin profile", Icon: Sparkles },
  { href: "/eval", label: "Benchmark", Icon: FlaskConical },
  { href: "/history", label: "History", Icon: History },
] as const;

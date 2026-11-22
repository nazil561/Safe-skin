"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-surface-edge bg-[#0b1024]/95 px-4 py-6 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="logo-mark grid h-10 w-10 place-items-center rounded-xl text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span>
          <span className="display block text-lg font-semibold leading-none">SafeSkin</span>
          <span className="eyebrow mt-1 block text-[9px]">Label intelligence</span>
        </span>
      </Link>

      <nav className="mt-10 space-y-1" aria-label="Primary">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {active ? <span className="nav-item-dot" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-surface-edge bg-surface-dim/70 p-3">
        <div className="eyebrow mb-2 text-[9px]">Ground rule</div>
        <p className="text-xs leading-relaxed text-ink-mute">
          Educational guidance only. Always verify against the physical label and ask a professional about health concerns.
        </p>
      </div>
    </aside>
  );
}

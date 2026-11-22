"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, History, Menu, ShieldCheck, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

export function TopBar({ back }: { back?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-1.5 border-b border-surface-edge bg-paper/90 px-3 py-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="btn-ghost px-2! py-1.5!"
        >
          <Menu className="h-5 w-5" />
        </button>
        {back ? (
          <Link href="/" aria-label="Back" className="btn-ghost px-2! py-1.5!">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2">
          <span className="logo-mark grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          <span className="display truncate text-lg font-semibold tracking-tight">SafeSkin</span>
        </Link>
        {!back ? (
          <Link href="/history" aria-label="Check history" className="btn-ghost px-2! py-1.5!">
            <History className="h-5 w-5" />
          </Link>
        ) : null}
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col border-r border-surface-edge bg-[#0b1024] p-5 shadow-2xl" aria-label="Mobile">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="logo-mark grid h-9 w-9 place-items-center rounded-xl text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="display text-lg font-semibold">SafeSkin</span>
              </div>
              <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="btn-ghost px-2! py-1.5!">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="eyebrow mt-8">Navigate</div>
            <div className="mt-3 space-y-1">
              {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`nav-item ${active ? "nav-item-active" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    {active ? <span className="nav-item-dot" /> : null}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto rounded-xl border border-surface-edge bg-surface-dim p-3">
              <div className="eyebrow mb-2 text-[9px]">Ground rule</div>
              <p className="text-xs leading-relaxed text-ink-mute">
                Educational guidance only. Verify against the physical label and ask a professional about health concerns.
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

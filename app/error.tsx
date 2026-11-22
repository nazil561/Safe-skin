"use client";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <TopBar back />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-danger-50 text-danger-700">
          <TriangleAlert className="h-6 w-6" />
        </div>
        <div className="eyebrow mt-5 text-danger-700">Something broke</div>
        <h1 className="display mt-2 text-3xl font-semibold">This screen could not load.</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-mute">
          Your entered text has not been sent anywhere. Try again, or go back to the start.
        </p>
        <div className="mt-6 flex w-full max-w-xs gap-3">
          <button onClick={reset} className="btn-primary flex flex-1 items-center justify-center gap-2">
            <RotateCcw className="h-3.5 w-3.5" /> Retry
          </button>
          <Link href="/" className="btn-outline flex-1">Home</Link>
        </div>
      </main>
    </>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export default function NotFound() {
  return (
    <>
      <TopBar back />
      <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
        <div className="ambient-orb -left-10 top-10 h-40 w-40 bg-brand-200" />
        <div className="display relative text-[7rem] font-semibold leading-none text-brand-600/20">404</div>
        <h1 className="display -mt-6 text-3xl font-semibold">No such page.</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-mute">
          That page is not part of SafeSkin. Head back to the dashboard.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex items-center gap-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>
      </main>
    </>
  );
}

import { TopBar } from "@/components/TopBar";

export default function Loading() {
  return (
    <>
      <TopBar />
      <main className="px-5 pt-5 md:px-0">
        <div className="skeleton h-72 rounded-[1.5rem] md:h-80" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div key={n} className="skeleton h-28 rounded-xl2" />
          ))}
        </div>
        <div className="skeleton mt-5 h-16 rounded-xl2" />
        <div className="mt-4 space-y-2">
          <div className="skeleton h-3 w-4/5 rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
      </main>
    </>
  );
}

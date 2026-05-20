import Link from "next/link";
import { UrlAnalyzer } from "@/components/UrlAnalyzer";

const marketStats = [
  { label: "Signal score", value: "82/100" },
  { label: "Risk level", value: "Medium" },
  { label: "Farm edge", value: "High" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="grid-mask pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-80 w-80 rounded-full bg-cyanfire/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-24 h-96 w-96 rounded-full bg-violet/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-8">
        <header className="glass-card flex items-center justify-between gap-4 rounded-lg px-4 py-3">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyanfire/40 bg-cyanfire/15 text-base font-black text-cyanfire shadow-glow">
              FJ
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.24em] text-slate-100">
              FarmJudge AI
            </span>
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-xs font-semibold text-mint sm:flex">
            <span className="h-2 w-2 rounded-full bg-mint shadow-[0_0_14px_rgba(108,255,181,0.9)]" />
            Live MVP
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-5.5rem)] items-start gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-14">
          <div className="min-h-fit self-start lg:sticky lg:top-8">
            <div className="inline-flex rounded-full border border-cyanfire/25 bg-cyanfire/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-cyanfire">
              AI crypto dashboard
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-7xl">
              Judge crypto farms with cleaner signals.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Paste a project URL and get a beginner-friendly AI-style verdict
              on score, risk, airdrop potential, and the next farming actions.
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {marketStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          <div className="relative min-w-0 self-start">
            <div className="absolute inset-x-8 top-6 h-40 rounded-full bg-gradient-to-r from-cyanfire/30 via-violet/25 to-mint/25 blur-3xl" />
            <div className="relative h-fit min-w-0">
              <UrlAnalyzer />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-lg p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

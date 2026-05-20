import type { AnalysisResult, RiskLevel } from "@/lib/analysis";

type AnalysisCardProps = {
  result: AnalysisResult;
};

const riskStyles: Record<RiskLevel, string> = {
  Low: "border-mint/40 bg-mint/10 text-mint",
  Medium: "border-ember/50 bg-ember/10 text-ember",
  High: "border-red-400/50 bg-red-400/10 text-red-200",
};

export function AnalysisCard({ result }: AnalysisCardProps) {
  return (
    <section className="grid min-w-0 gap-5 rounded-lg border border-white/10 bg-ink/55 p-4 transition-all duration-500 sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyanfire">
            AI result card
          </p>
          <h3 className="mt-2 break-words text-2xl font-black text-white">
            {result.projectName}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>{result.category}</Tag>
            <Tag>{result.chain}</Tag>
          </div>
        </div>

        <ScoreIndicator score={result.score} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Badge label="Risk level" value={result.risk} className={riskStyles[result.risk]} />
        <Badge
          label="Airdrop potential"
          value={result.airdropPotential}
          className="border-mint/40 bg-mint/10 text-mint"
        />
        <Badge
          label="Signal confidence"
          value={result.confidence}
          className="border-violet/40 bg-violet/10 text-violet"
        />
      </div>

      <InfoPanel title="Farm edge" body={result.farmEdge} />

      {result.narratives.length > 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Narratives
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.narratives.map((narrative) => (
              <Tag key={narrative}>{narrative}</Tag>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Summary
        </p>
        <p className="mt-2 break-words text-sm leading-relaxed text-slate-200">
          {result.summary}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoPanel title="Why it matters" body={result.whyItMatters} />
        <InfoList title="Backers" items={result.backers} empty="No verified backers found" />
      </div>

      <InfoList title="Scoring reasons" items={result.scoringReasons} />
      <InfoList title="Detected signals" items={result.detectedSignals} />
      <InfoList title="Confidence notes" items={result.confidenceNotes} />

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-300">
            Farming checklist
          </h4>
          <span className="rounded-full border border-cyanfire/25 bg-cyanfire/10 px-2.5 py-1 text-xs font-bold text-cyanfire">
            {result.checklist.length} steps
          </span>
        </div>
        <ul className="grid gap-3">
          {result.checklist.map((item, index) => (
            <li
              className="animate-result-in flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium leading-relaxed text-slate-100"
              style={{ animationDelay: `${index * 90}ms` }}
              key={item}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyanfire/30 bg-cyanfire/10 text-xs font-black text-cyanfire">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {result.redFlags.length > 0 ? (
        <InfoList title="Red flags" items={result.redFlags} tone="risk" />
      ) : null}
    </section>
  );
}

function ScoreIndicator({ score }: { score: number }) {
  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_140deg,#35f7ff_0deg,#6cffb5_295deg,rgba(255,255,255,0.1)_295deg)] p-1 shadow-glow transition-transform duration-500 hover:scale-105">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-ink">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Score
        </span>
      </div>
    </div>
  );
}

function Badge({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className={`min-h-24 rounded-lg border px-4 py-3 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-75">
        {label}
      </p>
      <p className="mt-1 break-words text-lg font-black">{value}</p>
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="max-w-full break-words rounded-full border border-cyanfire/25 bg-cyanfire/10 px-2.5 py-1 text-xs font-bold leading-relaxed text-cyanfire">
      {children}
    </span>
  );
}

function InfoPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-32 rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 break-words text-sm leading-relaxed text-slate-200">
        {body}
      </p>
    </div>
  );
}

function InfoList({
  title,
  items,
  empty,
  tone = "default",
}: {
  title: string;
  items: string[];
  empty?: string;
  tone?: "default" | "risk";
}) {
  const list = items.length > 0 ? items : empty ? [empty] : [];
  const textColor = tone === "risk" ? "text-red-100" : "text-slate-200";

  return (
    <div className="min-h-32 rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <ul className="mt-2 grid max-h-44 gap-2 overflow-y-auto pr-1">
        {list.map((item) => (
          <li className={`break-words text-sm leading-relaxed ${textColor}`} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

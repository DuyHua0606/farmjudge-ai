import type { AnalysisResult } from "@/lib/analysis";
import type { ScoringResult } from "@/lib/scoring";
import type { CryptoSignals } from "@/lib/signals";

export function parseAnalysisJson(rawText: string) {
  try {
    return JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Model did not return JSON.");
    }

    return JSON.parse(match[0]);
  }
}

export function normalizeAnalysis({
  value,
  scoring,
  signals,
}: {
  value: unknown;
  scoring: ScoringResult;
  signals: CryptoSignals;
}) {
  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;

  return {
    ...record,
    score: scoring.score,
    confidence: scoring.confidence,
    risk: scoring.risk,
    airdropPotential: scoring.airdropPotential,
    farmEdge: scoring.farmEdge,
    narratives: stringArray(record.narratives),
    backers: stringArray(record.backers),
    checklist: stringArray(record.checklist),
    redFlags: unique([...scoring.redFlags, ...stringArray(record.redFlags)]),
    scoringReasons: scoring.scoringReasons,
    detectedSignals: unique([
      ...signals.detectedSignals,
      ...stringArray(record.detectedSignals),
    ]),
    confidenceNotes: unique([
      ...scoring.confidenceNotes,
      ...stringArray(record.confidenceNotes),
    ]),
  } satisfies Partial<AnalysisResult>;
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

import type { ProjectEnrichment } from "@/lib/enrichment";
import type { CryptoSignals } from "@/lib/signals";

export type ScoringResult = {
  score: number;
  confidence: "Low" | "Medium" | "High";
  risk: "Low" | "Medium" | "High";
  airdropPotential: "Low" | "Medium" | "High";
  farmEdge: string;
  scoringReasons: string[];
  confidenceNotes: string[];
  redFlags: string[];
};

const tierOneBackers = [
  "a16z",
  "paradigm",
  "coinbase ventures",
  "polychain",
  "framework ventures",
  "coinfund",
  "multicoin",
  "dragonfly",
];

export function scoreProject({
  signals,
  enrichment,
  hasDocs,
}: {
  signals: CryptoSignals;
  enrichment: ProjectEnrichment;
  hasDocs: boolean;
}): ScoringResult {
  let score = 45;
  const scoringReasons: string[] = ["Base score starts at 45 for an unverified crypto project"];
  const redFlags: string[] = [];
  const confidenceNotes: string[] = [];

  const backers = enrichment.backers ?? [];
  const hasTierOneBacker = backers.some((backer) =>
    tierOneBackers.includes(backer.toLowerCase()),
  );

  if (hasTierOneBacker) {
    score += 15;
    scoringReasons.push("Tier 1 backer found in enrichment map");
    confidenceNotes.push("Backers verified through local enrichment layer");
  } else if (backers.length > 0) {
    score += 8;
    scoringReasons.push("Backers found in enrichment map");
  }

  if ((enrichment.fundingRounds ?? []).length > 0) {
    score += 10;
    scoringReasons.push("Public funding round found in enrichment map");
  }

  if (signals.tokenSignals.includes("No token language")) {
    score += 10;
    scoringReasons.push("No launched token detected or recorded");
    confidenceNotes.push("Token upside remains speculative unless official incentives are confirmed");
  }

  if (signals.tokenSignals.includes("Token planned")) {
    score += 15;
    scoringReasons.push("Future token or airdrop language detected");
  }

  if (signals.contributorSystems.length > 0) {
    score += 15;
    scoringReasons.push("Contributor or reputation system detected");
  }

  if (signals.rewardMechanisms.includes("Points system") || signals.rewardMechanisms.includes("Quests")) {
    score += 10;
    scoringReasons.push("Points, quests, leaderboard, or campaign mechanics detected");
  }

  if (signals.rewardMechanisms.includes("Onchain activity rewards")) {
    score += 10;
    scoringReasons.push("Onchain usage path detected");
  }

  if (signals.chains.some((chain) => ["Solana", "Base", "Ethereum"].includes(chain))) {
    score += 10;
    scoringReasons.push("Aligned with a major farming ecosystem");
  }

  if (signals.governanceSignals.length > 0) {
    score += 5;
    scoringReasons.push("Governance participation detected");
  }

  if (!hasDocs) {
    score -= 10;
    redFlags.push("No clear docs signal found on scraped website");
    scoringReasons.push("No docs signal reduces score");
  }

  if (signals.riskSignals.includes("Anonymous team")) {
    score -= 10;
    redFlags.push("Anonymous team language detected");
  }

  if (signals.riskSignals.includes("Unclear utility")) {
    score -= 15;
    redFlags.push("Utility appears unclear from scraped website");
  }

  if (signals.detectedSignals.length === 0) {
    score -= 10;
    redFlags.push("Few crypto-native signals detected");
  }

  score = clamp(score, 0, 100);

  return {
    score,
    confidence: confidenceFromInputs(signals, enrichment),
    risk: riskFromScore(score, redFlags.length),
    airdropPotential: potentialFromScore(score, signals),
    farmEdge: farmEdgeFromSignals(signals),
    scoringReasons,
    confidenceNotes: [
      ...confidenceNotes,
      signals.confidence === "Low"
        ? "Low signal density: avoid assuming token or reward mechanics"
        : "Core signals came from website text and local enrichment",
    ],
    redFlags,
  };
}

function farmEdgeFromSignals(signals: CryptoSignals) {
  if (signals.contributorSystems.length > 0) {
    return "Contributor activity and reputation systems could become future eligibility signals if incentives expand later.";
  }

  if (signals.rewardMechanisms.includes("Points system")) {
    return "Points or leaderboard mechanics create a trackable farming path, but token conversion is not guaranteed.";
  }

  if (signals.rewardMechanisms.includes("Onchain activity rewards")) {
    return "Onchain product usage can create wallet history that may matter if campaigns expand.";
  }

  if (signals.categories.some((category) => category.includes("Infrastructure"))) {
    return "Operator, node, staking, or governance activity may be the highest-signal participation path.";
  }

  return "No strong farming mechanic was detected; treat this as watchlist research until incentives become clearer.";
}

function confidenceFromInputs(signals: CryptoSignals, enrichment: ProjectEnrichment) {
  const enrichmentWeight = Object.keys(enrichment).length;

  if (signals.confidence === "High" && enrichmentWeight >= 3) {
    return "High";
  }

  if (signals.confidence !== "Low" || enrichmentWeight >= 2) {
    return "Medium";
  }

  return "Low";
}

function riskFromScore(score: number, redFlagCount: number) {
  if (score >= 75 && redFlagCount === 0) return "Low";
  if (score < 45 || redFlagCount >= 2) return "High";
  return "Medium";
}

function potentialFromScore(score: number, signals: CryptoSignals) {
  if (score >= 75 && (signals.contributorSystems.length > 0 || signals.rewardMechanisms.length > 0)) {
    return "High";
  }

  if (score >= 55) return "Medium";
  return "Low";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

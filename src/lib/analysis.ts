export type RiskLevel = "Low" | "Medium" | "High";

export type AnalysisResult = {
  projectName: string;
  category: string;
  chain: string;
  score: number;
  confidence: "Low" | "Medium" | "High";
  risk: RiskLevel;
  airdropPotential: "Low" | "Medium" | "High";
  farmEdge: string;
  narratives: string[];
  backers: string[];
  summary: string;
  checklist: string[];
  redFlags: string[];
  scoringReasons: string[];
  detectedSignals: string[];
  confidenceNotes: string[];
  whyItMatters: string;
};

export function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<AnalysisResult>;
  const validLevels = ["Low", "Medium", "High"];

  return (
    typeof result.projectName === "string" &&
    typeof result.category === "string" &&
    typeof result.chain === "string" &&
    typeof result.score === "number" &&
    result.score >= 0 &&
    result.score <= 100 &&
    typeof result.confidence === "string" &&
    validLevels.includes(result.confidence) &&
    typeof result.risk === "string" &&
    validLevels.includes(result.risk) &&
    typeof result.airdropPotential === "string" &&
    validLevels.includes(result.airdropPotential) &&
    typeof result.farmEdge === "string" &&
    Array.isArray(result.narratives) &&
    result.narratives.every((item) => typeof item === "string") &&
    Array.isArray(result.backers) &&
    result.backers.every((item) => typeof item === "string") &&
    typeof result.summary === "string" &&
    Array.isArray(result.checklist) &&
    result.checklist.every((item) => typeof item === "string") &&
    Array.isArray(result.redFlags) &&
    result.redFlags.every((item) => typeof item === "string") &&
    Array.isArray(result.scoringReasons) &&
    result.scoringReasons.every((item) => typeof item === "string") &&
    Array.isArray(result.detectedSignals) &&
    result.detectedSignals.every((item) => typeof item === "string") &&
    Array.isArray(result.confidenceNotes) &&
    result.confidenceNotes.every((item) => typeof item === "string") &&
    typeof result.whyItMatters === "string"
  );
}

export function fallbackAnalysis(projectUrl: string): AnalysisResult {
  const hostname = new URL(projectUrl).hostname.replace(/^www\./, "");

  return {
    projectName: hostname,
    category: "Unknown",
    chain: "Unknown",
    score: 50,
    confidence: "Low",
    risk: "Medium",
    airdropPotential: "Medium",
    farmEdge: "Insufficient public signals for a high-confidence farming edge.",
    narratives: [],
    backers: [],
    summary:
      "FarmJudge could not get a complete structured response, so this fallback highlights the need for manual review.",
    checklist: [
      "Review official docs for testnet, points, or contributor programs",
      "Check whether meaningful product usage exists before spending funds",
      "Track announcements for campaigns tied to ecosystem participation",
    ],
    redFlags: ["Limited verified data returned during analysis"],
    scoringReasons: ["Fallback score used because structured analysis failed"],
    detectedSignals: [],
    confidenceNotes: ["Low confidence: analysis used fallback data only"],
    whyItMatters:
      "Airdrop farming is strongest when there are clear incentives, real product actions, and ecosystem alignment.",
  };
}

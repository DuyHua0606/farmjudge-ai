import type { ProjectEnrichment } from "@/lib/enrichment";
import type { ScoringResult } from "@/lib/scoring";
import type { CryptoSignals } from "@/lib/signals";
import type { ScrapedSiteContent } from "@/lib/scraper";

export const analysisJsonShape = {
  projectName: "string",
  category: "string",
  chain: "string",
  score: "number 0-100",
  confidence: "Low | Medium | High",
  risk: "Low | Medium | High",
  airdropPotential: "Low | Medium | High",
  farmEdge: "string",
  narratives: ["string"],
  backers: ["string"],
  summary: "string",
  checklist: ["string"],
  redFlags: ["string"],
  scoringReasons: ["string"],
  detectedSignals: ["string"],
  confidenceNotes: ["string"],
  whyItMatters: "string",
};

export function buildAnalysisMessages({
  projectUrl,
  scraped,
  signals,
  enrichment,
  checklistHints,
  scoring,
}: {
  projectUrl: string;
  scraped: ScrapedSiteContent;
  signals: CryptoSignals;
  enrichment: ProjectEnrichment;
  checklistHints: string[];
  scoring: ScoringResult;
}) {
  return [
    {
      role: "system" as const,
      content: [
        "You are FarmJudge AI, a crypto-native research analyst focused on airdrop farming, incentives, ecosystems, and narratives.",
        "Return STRICT JSON only. No markdown. No commentary outside JSON.",
        "Preserve deterministic score, confidence, risk, airdropPotential, farmEdge, scoringReasons, detectedSignals, and confidenceNotes exactly unless the user data is impossible.",
        "Use direct crypto-native language. Avoid vague consultant phrases like may potentially, positioned within, leveraging synergies, or ecosystem growth opportunities.",
        "Be specific to the project and category. Avoid generic actions like follow Twitter or create wallet unless scraped evidence makes them necessary.",
        "Do not guarantee token launches, airdrops, or profits.",
      ].join(" "),
    },
    {
      role: "user" as const,
      content: JSON.stringify(
        {
          task: "Analyze the project for crypto farming and airdrop strategy.",
          requiredJsonShape: analysisJsonShape,
          projectUrl,
          scrapedWebsite: {
            title: scraped.title,
            description: scraped.description,
            headings: scraped.headings,
            textSample: scraped.textSample,
          },
          heuristicSignals: signals,
          enrichment,
          deterministicScoring: scoring,
          checklistHints,
          writingRules: [
            "Use concise, realistic, incentive-focused language.",
            "Do not invent VC backers, token plans, points programs, or partnerships.",
            "If token or reward mechanics are not confirmed, say they are unconfirmed.",
            "Checklist must depend on category, reward mechanics, ecosystem behavior, and contributor systems.",
            "Use scoringReasons, detectedSignals, and confidenceNotes for explainability.",
          ],
        },
        null,
        2,
      ),
    },
  ];
}

export type ProjectEnrichment = {
  projectName?: string;
  category?: string;
  ecosystem?: string;
  backers?: string[];
  fundingRounds?: string[];
  tokenStatus?: string;
  notes?: string;
};

const knownProjects: Record<string, ProjectEnrichment> = {
  "perle.xyz": {
    projectName: "Perle",
    category: "AI Data Infrastructure",
    ecosystem: "Solana",
    backers: ["Framework Ventures", "CoinFund"],
    fundingRounds: [],
    tokenStatus: "No token",
    notes: "Solana AI data infrastructure with contributor and data-task farming relevance.",
  },
};

export function enrichProject(projectUrl: string): ProjectEnrichment {
  const hostname = new URL(projectUrl).hostname.replace(/^www\./, "");
  return knownProjects[hostname] ?? {};
}

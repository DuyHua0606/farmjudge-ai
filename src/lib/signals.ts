import type { ProjectEnrichment } from "@/lib/enrichment";
import type { ScrapedSiteContent } from "@/lib/scraper";

export type SignalMatch = {
  label: string;
  evidence: string[];
  confidence: "Low" | "Medium" | "High";
};

export type CryptoSignals = {
  chains: string[];
  categories: string[];
  narratives: string[];
  rewardMechanisms: string[];
  contributorSystems: string[];
  tokenSignals: string[];
  governanceSignals: string[];
  riskSignals: string[];
  detectedSignals: string[];
  matches: SignalMatch[];
  confidence: "Low" | "Medium" | "High";
};

const chainKeywords = {
  Ethereum: ["ethereum", "erc-20", "evm", "mainnet"],
  Solana: ["solana", "spl", "anchor"],
  Cosmos: ["cosmos", "cosmwasm", "ibc", "tendermint"],
  Base: ["base", "onchain summer"],
  Arbitrum: ["arbitrum"],
  Optimism: ["optimism", "op stack", "superchain"],
  Polygon: ["polygon", "matic"],
  Sui: ["sui network", "move language"],
  Aptos: ["aptos", "move language"],
  Bitcoin: ["bitcoin", "ordinals", "brc-20"],
};

const categoryKeywords = {
  "AI Data Infrastructure": ["data labeling", "dataset", "human feedback", "annotation"],
  AI: [" ai ", "agent", "model", "inference", "training data", "compute"],
  DeFi: ["defi", "swap", "liquidity", "lend", "borrow", "yield", "vault", "amm"],
  "Infrastructure / Staking": ["validator", "node", "staking", "delegate", "operator"],
  Infra: ["infrastructure", "rpc", "rollup", "modular", "sequencer", "indexer"],
  DePIN: ["depin", "device", "uptime", "sensor", "bandwidth", "physical"],
  RWA: ["rwa", "real world asset", "treasury", "credit", "tokenized"],
  Gaming: ["gaming", "game", "nft", "play", "guild"],
};

const rewardKeywords = {
  "Points system": ["points", "xp", "leaderboard", "season", "reward program"],
  Quests: ["quest", "campaign", "galxe", "zealy", "task"],
  "Onchain activity rewards": ["bridge", "swap", "liquidity", "transaction", "volume"],
  "Contributor rewards": ["contributor", "contribute", "reputation", "quality score"],
};

const contributorKeywords = {
  "Contributor mechanics": ["contributor", "contribute", "onboarding", "ambassador"],
  "Reputation systems": ["reputation", "quality score", "rank", "tier"],
  "Data tasks": ["data labeling", "annotation", "review tasks", "evaluation"],
};

const tokenKeywords = {
  "No token language": ["no token", "token not launched", "pre-token"],
  "Token planned": ["token coming", "future token", "tge", "airdrop"],
  "Token live": ["tokenomics", "token address", "claim token"],
};

const governanceKeywords = {
  Governance: ["governance", "proposal", "vote", "dao", "delegate"],
};

const riskKeywords = {
  "Unclear utility": ["coming soon", "waitlist only", "stealth"],
  "Anonymous team": ["anonymous", "anon team"],
  "No docs": ["no docs", "documentation coming soon"],
};

export function extractCryptoSignals(
  content: ScrapedSiteContent,
  enrichment: ProjectEnrichment = {},
): CryptoSignals {
  const haystack = buildHaystack(content);
  const chains = unique([
    ...(enrichment.ecosystem ? [enrichment.ecosystem] : []),
    ...matchKeywordGroups(haystack, chainKeywords).map((match) => match.label),
  ]);
  const categories = unique([
    ...(enrichment.category ? [titleCase(enrichment.category)] : []),
    ...matchKeywordGroups(haystack, categoryKeywords).map((match) => match.label),
  ]);
  const rewardMatches = matchKeywordGroups(haystack, rewardKeywords);
  const contributorMatches = matchKeywordGroups(haystack, contributorKeywords);
  const tokenMatches = unique([
    ...(enrichment.tokenStatus ? [tokenLabelFromEnrichment(enrichment.tokenStatus)] : []),
    ...matchKeywordGroups(haystack, tokenKeywords).map((match) => match.label),
  ]).filter(Boolean);
  const governanceMatches = matchKeywordGroups(haystack, governanceKeywords);
  const riskMatches = matchKeywordGroups(haystack, riskKeywords);
  const matches = [
    ...matchKeywordGroups(haystack, chainKeywords),
    ...matchKeywordGroups(haystack, categoryKeywords),
    ...rewardMatches,
    ...contributorMatches,
    ...governanceMatches,
    ...riskMatches,
  ];
  const narratives = unique(
    categories.flatMap((category) => narrativeForCategory(category, chains[0])),
  );
  const detectedSignals = unique([
    ...chains.map((chain) => `${chain} ecosystem`),
    ...categories,
    ...rewardMatches.map((match) => match.label),
    ...contributorMatches.map((match) => match.label),
    ...tokenMatches,
    ...governanceMatches.map((match) => match.label),
  ]);
  const confidence = confidenceFromSignals({
    directSignals: matches.length,
    enrichmentSignals: Object.keys(enrichment).length,
  });

  return {
    chains,
    categories,
    narratives,
    rewardMechanisms: rewardMatches.map((match) => match.label),
    contributorSystems: contributorMatches.map((match) => match.label),
    tokenSignals: tokenMatches,
    governanceSignals: governanceMatches.map((match) => match.label),
    riskSignals: riskMatches.map((match) => match.label),
    detectedSignals,
    matches,
    confidence,
  };
}

export function categoryChecklistHints(signals: CryptoSignals) {
  const category = (signals.categories[0] ?? "Unknown").toLowerCase();
  const hasContributors = signals.contributorSystems.length > 0;
  const hasRewards = signals.rewardMechanisms.length > 0;

  if (category.includes("ai")) {
    return [
      "Complete contributor onboarding and verify the account is tied to a persistent profile",
      "Work on data, annotation, evaluation, or model-feedback tasks if they are tracked",
      "Improve contributor accuracy, rank, or reputation instead of farming one-off tasks",
      hasRewards ? "Monitor points, leaderboard, or season mechanics for eligibility hints" : "Track whether contributor metrics become public before increasing effort",
    ];
  }

  if (category.includes("defi")) {
    return [
      "Bridge small test amounts through official routes before committing capital",
      "Build repeat product usage through swaps, LP deposits, lending, or borrowing",
      "Avoid looping size only for volume; prefer consistent real usage across weeks",
      hasRewards ? "Track points or campaign dashboards tied to onchain activity" : "Watch for incentive seasons before increasing capital exposure",
    ];
  }

  if (category.includes("infra") || category.includes("staking")) {
    return [
      "Check whether node, validator, RPC, or testnet participation is tracked",
      "Run a node or delegate stake only from official docs and supported clients",
      "Join governance or operator channels if proposals and uptime are measured",
      "Keep logs, uptime, and wallet history clean for future proof-of-contribution",
    ];
  }

  if (category.includes("depin")) {
    return [
      "Set up supported hardware, device app, or uptime workflow if required",
      "Maintain uptime and location or bandwidth proofs across multiple weeks",
      "Use referrals only when they connect to a real operator or device dashboard",
      "Track reward dashboards for quality, uptime, and coverage multipliers",
    ];
  }

  return [
    hasContributors
      ? "Focus on tracked contributor actions and reputation metrics"
      : "Use the product path that creates measurable onchain or account activity",
    "Repeat meaningful actions weekly instead of relying on social-only tasks",
    "Track official dashboards, docs, and campaign pages for eligibility rules",
  ];
}

function buildHaystack(content: ScrapedSiteContent) {
  return [
    content.url,
    content.title,
    content.description,
    content.headings.join(" "),
    content.textSample,
  ]
    .join(" ")
    .replace(/[^a-zA-Z0-9\-./ ]/g, " ")
    .toLowerCase();
}

function matchKeywordGroups(
  haystack: string,
  groups: Record<string, string[]>,
): SignalMatch[] {
  return Object.entries(groups)
    .map(([label, keywords]) => {
      const evidence = keywords.filter((keyword) =>
        haystack.includes(keyword.toLowerCase()),
      );
      return {
        label,
        evidence,
        confidence: evidence.length >= 2 ? "High" : evidence.length === 1 ? "Medium" : "Low",
      } satisfies SignalMatch;
    })
    .filter((match) => match.evidence.length > 0);
}

function confidenceFromSignals({
  directSignals,
  enrichmentSignals,
}: {
  directSignals: number;
  enrichmentSignals: number;
}) {
  if (enrichmentSignals >= 3 && directSignals >= 5) {
    return "High";
  }

  if (directSignals >= 4 || enrichmentSignals >= 2) {
    return "Medium";
  }

  return "Low";
}

function tokenLabelFromEnrichment(tokenStatus: string) {
  const status = tokenStatus.toLowerCase();

  if (status.includes("no token") || status.includes("not launched")) {
    return "No token language";
  }

  if (status.includes("planned") || status.includes("future")) {
    return "Token planned";
  }

  if (status.includes("live")) {
    return "Token live";
  }

  return tokenStatus;
}

function narrativeForCategory(category: string, chain?: string) {
  const lower = category.toLowerCase();
  const narratives: string[] = [];

  if (lower.includes("ai")) narratives.push("AI infrastructure");
  if (lower.includes("data")) narratives.push("Data contribution economy");
  if (lower.includes("defi")) narratives.push("DeFi incentives");
  if (lower.includes("infra") || lower.includes("staking")) narratives.push("Infrastructure participation");
  if (lower.includes("depin")) narratives.push("DePIN operator economy");
  if (lower.includes("rwa")) narratives.push("RWA tokenization");
  if (lower.includes("gaming")) narratives.push("Gaming ecosystem");
  if (chain) narratives.push(`${chain} ecosystem`);

  return narratives;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

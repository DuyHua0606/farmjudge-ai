# FarmJudge AI

FarmJudge AI is a lightweight crypto-native research engine for airdrop farming, incentive analysis, ecosystem participation, and actionable farming checklists.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- OpenRouter API through the OpenAI-compatible SDK
- Cheerio for lightweight website scraping

## Features

- Dark futuristic crypto dashboard
- Project URL analyzer
- Website title, metadata, heading, and paragraph scraping
- Lightweight crypto signal detection before LLM analysis
- Deterministic weighted scoring before LLM analysis
- Confidence notes and explainable scoring reasons
- Optional hardcoded CryptoRank-style enrichment map
- Strict JSON analysis output
- Category-specific farming checklist
- Narrative badges, category tags, risk, score, backers, and red flags

## Project Structure

```text
farmjudge-ai/
  src/
    app/
      api/
        analyze/
          route.ts
      globals.css
      layout.tsx
      page.tsx
    components/
      AnalysisCard.tsx
      UrlAnalyzer.tsx
    lib/
      analysis.ts
      enrichment.ts
      parser.ts
      prompts.ts
      scraper.ts
      scoring.ts
      signals.ts
  .env.example
  package.json
  tailwind.config.ts
  tsconfig.json
```

## Environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Add your OpenRouter key:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-5.5
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never expose API keys in frontend code. The browser only calls `/api/analyze`; the API key is read server-side.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Build:

```bash
npm run build
```

## API Flow

1. Frontend sends `{ projectUrl }` to `src/app/api/analyze/route.ts`.
2. `lib/scraper.ts` fetches and extracts clean website content.
3. `lib/enrichment.ts` adds optional known-project metadata such as ecosystem, backers, funding, and token status.
4. `lib/signals.ts` detects chains, categories, narratives, rewards, token language, governance, and risks.
5. `lib/scoring.ts` computes deterministic score, confidence, risk, farm edge, and scoring reasons.
6. `lib/prompts.ts` asks the model to preserve deterministic facts and write concise crypto-native analysis.
7. `lib/parser.ts` parses and normalizes JSON so deterministic scoring cannot be overwritten by the model.
8. `lib/analysis.ts` validates the final result before the UI renders it.

## Expected JSON Shape

```json
{
  "projectName": "Perle",
  "category": "AI Data Infrastructure",
  "chain": "Solana",
  "score": 74,
  "confidence": "Medium",
  "risk": "Medium",
  "airdropPotential": "Medium",
  "farmEdge": "Contributor and data-task participation may be valuable if tracked by the project.",
  "narratives": ["AI infrastructure", "Data contribution economy", "Solana ecosystem"],
  "backers": ["Framework Ventures", "CoinFund"],
  "summary": "Solana-aligned AI data infrastructure with meaningful contributor farming angles.",
  "checklist": [
    "Complete contributor onboarding if available",
    "Perform data or reputation tasks tracked by the project",
    "Monitor official campaign dashboards for points or seasons"
  ],
  "redFlags": ["No confirmed token status in local enrichment"],
  "scoringReasons": [
    "Contributor system detected",
    "Aligned with a major farming ecosystem",
    "No launched token detected or recorded"
  ],
  "detectedSignals": [
    "Solana ecosystem",
    "AI Data Infrastructure",
    "Contributor mechanics"
  ],
  "confidenceNotes": [
    "Backers verified through local enrichment layer",
    "Token upside remains speculative unless official incentives are confirmed"
  ],
  "whyItMatters": "Projects with measurable contribution systems can reward useful ecosystem participation more clearly than generic social campaigns."
}
```

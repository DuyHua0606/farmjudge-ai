import OpenAI from "openai";
import { NextResponse } from "next/server";
import { fallbackAnalysis, isAnalysisResult } from "@/lib/analysis";
import { enrichProject } from "@/lib/enrichment";
import { normalizeAnalysis, parseAnalysisJson } from "@/lib/parser";
import { buildAnalysisMessages } from "@/lib/prompts";
import { fallbackScrapedContent, scrapeProjectWebsite } from "@/lib/scraper";
import { scoreProject } from "@/lib/scoring";
import { categoryChecklistHints, extractCryptoSignals } from "@/lib/signals";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL ?? process.env.OPENAI_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "X-Title": "FarmJudge AI",
  },
});

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY or OPENAI_API_KEY environment variable." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as { projectUrl?: unknown };
    const projectUrl = parseProjectUrl(body.projectUrl);

    if (!projectUrl) {
      return NextResponse.json(
        { error: "Please provide a valid crypto project URL." },
        { status: 400 },
      );
    }

    const enrichment = enrichProject(projectUrl);
    const scraped = await scrapeWithFallback(projectUrl);
    const signals = extractCryptoSignals(scraped, enrichment);
    const scoring = scoreProject({
      signals,
      enrichment,
      hasDocs: hasDocsSignal(scraped.textSample),
    });
    const checklistHints = categoryChecklistHints(signals);

    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL ?? process.env.OPENAI_MODEL ?? "openai/gpt-5.5",
      messages: buildAnalysisMessages({
        projectUrl,
        scraped,
        signals,
        enrichment,
        checklistHints,
        scoring,
      }),
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const rawText = completion.choices[0]?.message?.content ?? "";
    const parsed = parseAnalysisJson(rawText);
    const analysis = normalizeAnalysis({ value: parsed, scoring, signals });

    if (!isAnalysisResult(analysis)) {
      console.warn("Invalid AI analysis JSON:", parsed);

      return NextResponse.json({
        analysis: fallbackAnalysis(projectUrl),
        warning: "AI response did not match the expected schema. Returned fallback analysis.",
      });
    }

    return NextResponse.json({
      analysis,
      researchContext: {
        signals,
        enrichment,
        scraped: {
          title: scraped.title,
          description: scraped.description,
          headings: scraped.headings.slice(0, 8),
        },
        scoring,
      },
    });
  } catch (error) {
    console.error("FarmJudge analysis failed:", error);

    return NextResponse.json(
      { error: "Unable to analyze this project right now." },
      { status: 500 },
    );
  }
}

function parseProjectUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

async function scrapeWithFallback(projectUrl: string) {
  try {
    return await scrapeProjectWebsite(projectUrl);
  } catch (error) {
    console.warn("Website scrape failed, using fallback content:", error);
    return fallbackScrapedContent(projectUrl);
  }
}

function hasDocsSignal(text: string) {
  const lower = text.toLowerCase();
  return ["docs", "documentation", "whitepaper", "developer", "github"].some(
    (keyword) => lower.includes(keyword),
  );
}

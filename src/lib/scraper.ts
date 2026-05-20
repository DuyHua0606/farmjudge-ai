import * as cheerio from "cheerio";

export type ScrapedSiteContent = {
  url: string;
  title: string;
  description: string;
  metadata: Record<string, string>;
  headings: string[];
  paragraphs: string[];
  textSample: string;
};

const MAX_HEADINGS = 30;
const MAX_PARAGRAPHS = 45;
const MAX_TEXT_SAMPLE = 7000;

export async function scrapeProjectWebsite(
  projectUrl: string,
): Promise<ScrapedSiteContent> {
  const response = await fetch(projectUrl, {
    headers: {
      "User-Agent":
        "FarmJudgeAI/1.0 (+https://farmjudge.ai; crypto research preview)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(9000),
  });

  if (!response.ok) {
    throw new Error(`Website fetch failed with status ${response.status}.`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, canvas, iframe").remove();

  const title = cleanText($("title").first().text());
  const metadata = extractMetadata($);
  const description =
    metadata.description ?? metadata["og:description"] ?? metadata["twitter:description"] ?? "";

  const headings = $("h1, h2, h3")
    .map((_, element) => cleanText($(element).text()))
    .get()
    .filter(Boolean)
    .slice(0, MAX_HEADINGS);

  const paragraphs = $("p, li")
    .map((_, element) => cleanText($(element).text()))
    .get()
    .filter((text) => text.length >= 30)
    .slice(0, MAX_PARAGRAPHS);

  const textSample = compactText(
    [title, description, ...headings, ...paragraphs].filter(Boolean).join("\n"),
  ).slice(0, MAX_TEXT_SAMPLE);

  return {
    url: projectUrl,
    title,
    description,
    metadata,
    headings,
    paragraphs,
    textSample,
  };
}

export function fallbackScrapedContent(projectUrl: string): ScrapedSiteContent {
  const hostname = new URL(projectUrl).hostname.replace(/^www\./, "");

  return {
    url: projectUrl,
    title: hostname,
    description: "",
    metadata: {},
    headings: [],
    paragraphs: [],
    textSample: `Project URL: ${projectUrl}\nHostname: ${hostname}`,
  };
}

function extractMetadata($: cheerio.CheerioAPI) {
  const metadata: Record<string, string> = {};

  $("meta").each((_, element) => {
    const name = $(element).attr("name") ?? $(element).attr("property");
    const content = $(element).attr("content");

    if (name && content) {
      metadata[name.toLowerCase()] = cleanText(content);
    }
  });

  return metadata;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").replace(/\u0000/g, "").trim();
}

function compactText(value: string) {
  return value
    .split("\n")
    .map(cleanText)
    .filter(Boolean)
    .filter((line, index, lines) => lines.indexOf(line) === index)
    .join("\n");
}

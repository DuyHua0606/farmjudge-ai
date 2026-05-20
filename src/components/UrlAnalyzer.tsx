"use client";

import { FormEvent, useState } from "react";
import { AnalysisCard } from "@/components/AnalysisCard";
import type { AnalysisResult } from "@/lib/analysis";

export function UrlAnalyzer() {
  const [projectUrl, setProjectUrl] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalysis(null);
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectUrl }),
      });

      const data = (await response.json()) as {
        analysis?: AnalysisResult;
        error?: string;
      };

      if (!response.ok || !data.analysis) {
        throw new Error(data.error ?? "Analysis failed.");
      }

      setAnalysis(data.analysis);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to analyze this project.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glass-card h-fit min-w-0 overflow-hidden rounded-lg lg:max-h-[calc(100vh-7rem)]">
      <div className="h-1 bg-gradient-to-r from-cyanfire via-violet to-mint bg-[length:220%_220%] animate-aurora" />

      <div className="flex min-h-0 flex-col gap-6 p-4 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyanfire">
            Project scanner
          </p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            FarmJudge terminal
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label
            className="text-sm font-semibold text-slate-200"
            htmlFor="project-url"
          >
            Crypto project URL
          </label>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              id="project-url"
              type="url"
              value={projectUrl}
              onChange={(event) => setProjectUrl(event.target.value)}
              disabled={isLoading}
              placeholder="https://example-protocol.xyz"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-ink/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyanfire/80 focus:ring-2 focus:ring-cyanfire/20 disabled:cursor-not-allowed disabled:opacity-70"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-12 rounded-lg bg-gradient-to-r from-cyanfire to-mint px-5 text-sm font-black text-ink shadow-glow transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-cyanfire/40 focus:ring-offset-2 focus:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink/25 border-t-ink" />
                  Analyzing
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </form>

        {isLoading ? (
          <section className="relative overflow-hidden rounded-lg border border-cyanfire/20 bg-cyanfire/[0.06] p-5">
            <div className="absolute inset-x-0 top-0 h-12 animate-scan bg-gradient-to-b from-cyanfire/25 to-transparent" />
            <p className="relative text-sm font-semibold text-cyanfire">
              Scraping website content, extracting crypto signals, and building
              a farming strategy...
            </p>
            <div className="relative mt-4 grid gap-3">
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-cyanfire to-mint" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Website scrape
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Narrative detection
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                OpenRouter analysis
              </p>
            </div>
          </section>
        ) : analysis ? (
          <div className="animate-result-in min-h-0 overflow-y-auto overscroll-contain pr-1 lg:max-h-[calc(100vh-22rem)]">
            <AnalysisCard result={analysis} />
          </div>
        ) : error ? (
          <section className="animate-result-in rounded-lg border border-red-400/30 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
            <p className="font-bold text-red-200">Analysis failed</p>
            <p className="mt-1 text-red-100/85">{error}</p>
          </section>
        ) : (
          <section className="relative overflow-hidden rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
            <div className="absolute inset-x-0 top-0 h-12 animate-scan bg-gradient-to-b from-cyanfire/20 to-transparent" />
            <p className="relative">
              Waiting for a project URL. Your AI result card, score indicator,
              risk badge, and farming checklist will appear here.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

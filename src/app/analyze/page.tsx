"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen";
import { RevealAnimation } from "@/components/RevealAnimation";
import { ComparisonView } from "@/components/ComparisonView";
import type { ScrapedPage, OptimizationResult } from "@/lib/types";

type Phase = "scraping" | "optimizing" | "revealing" | "done" | "error";

function AnalyzePage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") ?? "";

  const [phase, setPhase] = useState<Phase>("scraping");
  const [scraped, setScraped] = useState<ScrapedPage | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const run = useCallback(async () => {
    if (!url) { setPhase("error"); setErrorMsg("No URL provided."); return; }

    // Step 1: Scrape
    setPhase("scraping");
    let scrapeData: ScrapedPage;
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!json.success) { setPhase("error"); setErrorMsg(json.error ?? "Failed to load your page."); return; }
      scrapeData = json.data;
      setScraped(scrapeData);
    } catch {
      setPhase("error");
      setErrorMsg("Network error while loading your page. Try again.");
      return;
    }

    // Step 2: Optimize (streamed)
    setPhase("optimizing");
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scrapeData),
      });

      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({}));
        setPhase("error");
        setErrorMsg((json as { error?: string }).error ?? "AI optimization failed.");
        return;
      }

      // Accumulate streamed text
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
      }

      // Parse JSON from accumulated stream
      const cleaned = accumulated
        .replace(/^```json\n?/, "")
        .replace(/^```\n?/, "")
        .replace(/\n?```$/, "")
        .trim();

      const data = JSON.parse(cleaned);
      setResult(data);
      setPhase("revealing");
    } catch {
      setPhase("error");
      setErrorMsg("Network error during optimization. Try again.");
    }
  }, [url]);

  useEffect(() => { run(); }, [run]);

  if (phase === "error") {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 24,
        textAlign: "center",
      }}>
        <p style={{ fontSize: 32 }}>⚠️</p>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 400 }}>{errorMsg}</p>
        <a
          href="/"
          style={{
            padding: "12px 24px",
            backgroundColor: "var(--accent)",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← Try another URL
        </a>
      </div>
    );
  }

  if (phase === "scraping" || phase === "optimizing") {
    return <LoadingScreen phase={phase} />;
  }

  if (phase === "revealing" && scraped && result) {
    return (
      <RevealAnimation
        scraped={scraped}
        result={result}
        onComplete={() => setPhase("done")}
      />
    );
  }

  if (phase === "done" && scraped && result) {
    return <ComparisonView scraped={scraped} result={result} />;
  }

  return <LoadingScreen phase="scraping" />;
}

export default function AnalyzePageWrapper() {
  return (
    <Suspense fallback={<LoadingScreen phase="scraping" />}>
      <AnalyzePage />
    </Suspense>
  );
}

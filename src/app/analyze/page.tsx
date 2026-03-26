"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { ScrapedPage, OptimizationResult } from "@/lib/types";
import LoadingScreen from "@/components/LoadingScreen";
import ComparisonView from "@/components/ComparisonView";

function AnalyzeInner() {
  const params = useSearchParams();
  const url = params.get("url") ?? "";

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [scraped, setScraped] = useState<ScrapedPage | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !url) return;
    ran.current = true;

    async function run() {
      try {
        // Step 1: Scrape
        const scrapeRes = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const scrapeJson = await scrapeRes.json();
        if (!scrapeJson.success) throw new Error(scrapeJson.error ?? "Scrape failed");
        const scrapedData: ScrapedPage = scrapeJson.data;
        setScraped(scrapedData);

        // Step 2: AI optimize
        const optRes = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: scrapedData.url,
            htmlContent: scrapedData.htmlContent,
            title: scrapedData.title,
            metaDescription: scrapedData.metaDescription,
            h1: scrapedData.h1,
            brandColors: scrapedData.brandColors,
          }),
        });
        const optJson = await optRes.json();
        if (!optJson.success) throw new Error(optJson.error ?? "Optimization failed");

        setResult(optJson.data);
        setStatus("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    }

    run();
  }, [url]);

  if (!url) {
    return (
      <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", marginBottom: "16px" }}>No URL provided.</p>
          <a href="/" style={{ color: "#14c38e", textDecoration: "none" }}>Back</a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "480px", padding: "0 24px" }}>
          <p style={{ fontSize: "18px", color: "#ef4444", marginBottom: "12px", fontWeight: 600 }}>
            Something went wrong
          </p>
          <p style={{ color: "#888", marginBottom: "24px" }}>{error}</p>
          <a href="/" style={{ color: "#14c38e", textDecoration: "none" }}>Try a different URL</a>
        </div>
      </div>
    );
  }

  if (status === "done" && scraped && result) {
    return <ComparisonView scraped={scraped} result={result} />;
  }

  return <LoadingScreen />;
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnalyzeInner />
    </Suspense>
  );
}

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LeadCapture } from "./LeadCapture";
import type { ScrapedPage, OptimizationResult } from "@/lib/types";

interface ComparisonViewProps {
  scraped: ScrapedPage;
  result: OptimizationResult;
}

const calloutIcons: Record<string, string> = {
  seo: "🎯",
  conversion: "📈",
  ux: "🖥",
  trust: "✓",
};

const calloutColors: Record<string, string> = {
  seo: "var(--accent)",
  conversion: "#22c55e",
  ux: "#a855f7",
  trust: "#f59e0b",
};

export function ComparisonView({ scraped, result }: ComparisonViewProps) {
  const leadRef = useRef<HTMLDivElement>(null);
  const before = result.improvementScore.before;
  const after = result.improvementScore.after;
  const delta = after - before;

  const scrollToLead = () => {
    leadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>

      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backgroundColor: "rgba(10,13,12,0.95)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        height: 56,
        gap: 16,
      }}>
        <Link href="/" style={{ color: "var(--text-muted)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </Link>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ color: "var(--text-muted)", fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {scraped.url}
        </span>

        {/* Score badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "6px 14px",
        }}>
          <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 16 }}>{before}</span>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>→</span>
          <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 16 }}>{after}</span>
          <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}>↑ +{delta} pts</span>
        </div>
      </div>

      {/* Optimized page */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Optimized by w.max
          </span>
          <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>{after}/100</span>
        </div>
        <iframe
          srcDoc={result.optimizedHtml}
          style={{ width: "100%", height: "80vh", border: "none", display: "block" }}
          title="Optimized version"
        />
      </div>

      {/* Callouts */}
      <div style={{ padding: "32px 24px", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          What changed
        </p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {result.callouts.map((callout, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                minWidth: 200,
                maxWidth: 240,
                flexShrink: 0,
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${calloutColors[callout.type] ?? "var(--accent)"}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <p style={{ fontSize: 18, marginBottom: 6 }}>{calloutIcons[callout.type]}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                {callout.label}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                {callout.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll prompt */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={scrollToLead}
        style={{
          textAlign: "center",
          padding: "12px 24px 32px",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        See your next step ↓
      </motion.div>

      {/* Lead capture */}
      <div ref={leadRef}>
        <LeadCapture url={scraped.url} />
      </div>
    </div>
  );
}

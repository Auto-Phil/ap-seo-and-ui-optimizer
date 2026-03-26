"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { ScrapedPage, OptimizationResult, Callout } from "@/lib/types";
import AnimatedNumber from "./AnimatedNumber";
import LeadCapture from "./LeadCapture";
import {
  ArrowLeft,
  Search,
  Analytics,
  Laptop,
  Certificate,
  ChevronDown,
} from "@carbon/icons-react";

interface Props {
  scraped: ScrapedPage;
  result: OptimizationResult;
}

const CALLOUT_ICONS: Record<Callout["type"], React.ReactNode> = {
  seo: <Search size={18} />,
  conversion: <Analytics size={18} />,
  ux: <Laptop size={18} />,
  trust: <Certificate size={18} />,
};

const CALLOUT_COLORS: Record<Callout["type"], string> = {
  seo: "#14c38e",
  conversion: "#60a5fa",
  ux: "#a78bfa",
  trust: "#fbbf24",
};

const CALLOUT_LABELS: Record<Callout["type"], string> = {
  seo: "SEO",
  conversion: "Conversion",
  ux: "UX",
  trust: "Trust",
};

function clean(text: string): string {
  return text.replace(/\s*—\s*/g, ", ").replace(/–/g, "-");
}

function Bullets({ text }: { text: string }) {
  const points = text.split("|").map((s) => clean(s.trim())).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
      {points.map((point, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ color: "#14c38e", fontSize: "16px", lineHeight: "1.6", flexShrink: 0, marginTop: "1px" }}>•</span>
          <span style={{ fontSize: "15px", color: "#ccc", lineHeight: 1.65 }}>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function FieldCard({ label, before, after, delay }: { label: string; before: string; after: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ background: "#0d0d0d", border: "1px solid #252525", borderRadius: "10px", overflow: "hidden" }}
    >
      <div style={{ padding: "13px 24px", borderBottom: "1px solid #1e1e1e", background: "#0a0a0a" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#14c38e" }}>
          {label}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "22px 24px", borderRight: "1px solid #1e1e1e" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "10px" }}>
            Current
          </p>
          <p style={{ fontSize: "15px", color: before ? "#aaa" : "#555", lineHeight: 1.6, fontStyle: before ? "normal" : "italic" }}>
            {before || "Not detected"}
          </p>
        </div>
        <div style={{ padding: "22px 24px", background: "rgba(20,195,142,0.03)" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#14c38e", marginBottom: "10px" }}>
            Optimized
          </p>
          <p style={{ fontSize: "15px", color: "#fff", lineHeight: 1.6, fontWeight: 500 }}>
            {clean(after)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ComparisonView({ scraped, result }: Props) {
  const leadRef = useRef<HTMLDivElement>(null);
  const { before, after } = result.improvementScore;
  const delta = after - before;

  let domain = scraped.url;
  try { domain = new URL(scraped.url).hostname.replace(/^www\./, ""); } catch { /* keep */ }

  return (
    <div style={{ minHeight: "100vh", background: "#060606", paddingBottom: "140px" }}>

      {/* Nav */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 32px", borderBottom: "1px solid #1a1a1a",
          background: "rgba(6,6,6,0.92)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 10,
        }}
      >
        <a href="/"
          style={{ color: "#888", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "7px", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >
          <ArrowLeft size={15} /> New analysis
        </a>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.03em" }}>
            <AnimatedNumber from={0} to={before} duration={800} color="#ef4444" />
            <span style={{ color: "#333", fontSize: "14px", fontWeight: 400 }}>→</span>
            <AnimatedNumber from={before} to={after} duration={1000} color="#14c38e" />
          </div>
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1.2 }}
            style={{
              fontSize: "12px", color: "#14c38e", fontWeight: 700,
              background: "rgba(20,195,142,0.12)", border: "1px solid rgba(20,195,142,0.25)",
              padding: "3px 10px", borderRadius: "20px",
            }}
          >
            +{delta} pts
          </motion.span>
        </div>
      </motion.div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 32px 0" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: "60px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#14c38e", marginBottom: "14px" }}>
            SEO Executive Summary
          </p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "18px" }}>
            {domain}
          </h1>
          <p style={{ fontSize: "17px", color: "#999", lineHeight: 1.7, maxWidth: "580px" }}>
            Personalized analysis of your homepage SEO, conversion structure, and trust signals. Exact copy recommendations included.
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "12px", overflow: "hidden", border: "1px solid #222", marginBottom: "60px" }}
        >
          <div style={{ padding: "36px 40px", background: "#0d0d0d", borderRight: "1px solid #222" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#777", marginBottom: "14px" }}>Current score</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "60px", fontWeight: 900, color: "#ef4444", lineHeight: 1, letterSpacing: "-0.04em" }}>{before}</span>
              <span style={{ fontSize: "20px", color: "#444", fontWeight: 700, paddingBottom: "7px" }}>/100</span>
            </div>
            <p style={{ fontSize: "15px", color: "#888", lineHeight: 1.5 }}>SEO signals, conversion structure, and trust elements need work.</p>
          </div>
          <div style={{ padding: "36px 40px", background: "rgba(20,195,142,0.04)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "180px", height: "180px", background: "radial-gradient(circle at top right, rgba(20,195,142,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#14c38e", marginBottom: "14px" }}>Optimized score</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "60px", fontWeight: 900, color: "#14c38e", lineHeight: 1, letterSpacing: "-0.04em" }}>{after}</span>
              <span style={{ fontSize: "20px", color: "#14c38e", fontWeight: 700, paddingBottom: "7px", opacity: 0.4 }}>/100</span>
            </div>
            <p style={{ fontSize: "15px", color: "#999", lineHeight: 1.5 }}>
              <span style={{ color: "#14c38e", fontWeight: 700 }}>+{delta} point improvement</span> with the changes below applied.
            </p>
          </div>
        </motion.div>

        {/* Copy optimizations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ marginBottom: "68px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "20px" }}>
            Copy optimizations
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <FieldCard label="Title Tag" before={scraped.title} after={result.optimizedTitle} delay={0.25} />
            <FieldCard label="H1 Heading" before={scraped.h1} after={result.optimizedH1} delay={0.31} />
            <FieldCard label="Meta Description" before={scraped.metaDescription} after={result.optimizedMeta} delay={0.37} />
            <FieldCard label="Primary CTA" before="" after={result.optimizedCTA} delay={0.43} />
          </div>
        </motion.div>

        {/* Findings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.44 }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", marginBottom: "20px" }}>
            Findings and recommendations
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {result.callouts.map((callout, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                style={{
                  background: "#0d0d0d", border: "1px solid #252525",
                  borderTop: `3px solid ${CALLOUT_COLORS[callout.type]}`,
                  borderRadius: "10px", padding: "28px",
                }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: `${CALLOUT_COLORS[callout.type]}14`,
                  border: `1px solid ${CALLOUT_COLORS[callout.type]}30`,
                  borderRadius: "20px", padding: "5px 12px 5px 8px", marginBottom: "18px",
                }}>
                  <span style={{ color: CALLOUT_COLORS[callout.type], display: "flex" }}>{CALLOUT_ICONS[callout.type]}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: CALLOUT_COLORS[callout.type] }}>
                    {CALLOUT_LABELS[callout.type]}
                  </span>
                </div>
                <p style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", marginBottom: "16px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                  {clean(callout.label)}
                </p>
                <Bullets text={callout.description} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }} style={{ textAlign: "center", marginTop: "80px" }}>
          <button
            onClick={() => leadRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none", border: "none", color: "#666", fontSize: "13px", cursor: "pointer",
              display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "10px",
              letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
              animation: "bob 2s ease-in-out infinite", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ccc")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            Get these changes implemented
            <ChevronDown size={18} />
          </button>
        </motion.div>
      </div>

      <div ref={leadRef} style={{ marginTop: "80px" }}>
        <LeadCapture url={scraped.url} />
      </div>

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}

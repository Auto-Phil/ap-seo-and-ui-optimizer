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
  CheckmarkFilled,
  ChevronDown,
  ArrowRight,
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

const CALLOUT_BG: Record<Callout["type"], string> = {
  seo: "rgba(20,195,142,0.06)",
  conversion: "rgba(96,165,250,0.06)",
  ux: "rgba(167,139,250,0.06)",
  trust: "rgba(251,191,36,0.06)",
};

function ScoreGauge({ score, color, label }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div style={{ position: "relative", width: "96px", height: "96px" }}>
        <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="6" />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.2s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "22px", fontWeight: 800, color, letterSpacing: "-0.03em" }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>
        {label}
      </span>
    </div>
  );
}

function ComparisonRow({
  label,
  before,
  after,
  delay,
}: {
  label: string;
  before: string;
  after: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr 28px 1fr",
        gap: "0",
        alignItems: "start",
        borderBottom: "1px solid #141414",
        padding: "20px 0",
      }}
    >
      {/* Label */}
      <div style={{ paddingTop: "2px" }}>
        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3a3a3a" }}>
          {label}
        </span>
      </div>

      {/* Before */}
      <div style={{ padding: "0 20px 0 0" }}>
        <p style={{
          fontSize: "13px",
          color: before ? "#555" : "#333",
          lineHeight: 1.6,
          fontStyle: before ? "normal" : "italic",
          borderLeft: "2px solid #1e1e1e",
          paddingLeft: "14px",
        }}>
          {before || "Not found"}
        </p>
      </div>

      {/* Arrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "3px" }}>
        <ArrowRight size={12} style={{ color: "#2a2a2a" }} />
      </div>

      {/* After */}
      <div style={{ padding: "0 0 0 20px" }}>
        <p style={{
          fontSize: "13px",
          color: "#d0d0d0",
          lineHeight: 1.6,
          borderLeft: "2px solid #14c38e",
          paddingLeft: "14px",
        }}>
          {after}
        </p>
      </div>
    </motion.div>
  );
}

export default function ComparisonView({ scraped, result }: Props) {
  const leadRef = useRef<HTMLDivElement>(null);
  const { before, after } = result.improvementScore;
  const delta = after - before;

  let domain = scraped.url;
  try {
    domain = new URL(scraped.url).hostname.replace(/^www\./, "");
  } catch {
    // keep original
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060606", paddingBottom: "120px" }}>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: "1px solid #141414",
          background: "#060606",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <a
          href="/"
          style={{
            color: "#555",
            textDecoration: "none",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <ArrowLeft size={14} />
          Back
        </a>

        {/* Score badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            <AnimatedNumber from={0} to={before} duration={800} color="#ef4444" />
            <span style={{ color: "#2a2a2a", fontSize: "12px" }}>→</span>
            <AnimatedNumber from={before} to={after} duration={1000} color="#14c38e" />
          </div>
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1.2 }}
            style={{
              fontSize: "11px",
              color: "#14c38e",
              fontWeight: 600,
              letterSpacing: "0.02em",
              background: "rgba(20,195,142,0.1)",
              border: "1px solid rgba(20,195,142,0.2)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            +{delta} pts
          </motion.span>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "56px 24px 0" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: "56px" }}
        >
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#14c38e", marginBottom: "14px" }}>
            SEO Executive Summary
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "10px" }}>
            {domain}
          </h1>
          <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.6, maxWidth: "520px" }}>
            We analyzed your homepage against SEO fundamentals, conversion structure, and UX signals. Here&apos;s what we found — and how it should read instead.
          </p>
        </motion.div>

        {/* Score gauges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "8px",
            padding: "32px 40px",
            marginBottom: "56px",
          }}
        >
          <ScoreGauge score={before} color="#ef4444" label="Current" />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#d0d0d0", letterSpacing: "-0.01em" }}>
              Your homepage scores <span style={{ color: "#ef4444" }}>{before}/100</span> today.
            </p>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.65 }}>
              With the optimizations below, it should score <span style={{ color: "#14c38e", fontWeight: 600 }}>{after}/100</span> — a gain of <span style={{ color: "#14c38e", fontWeight: 600 }}>+{delta} points</span> in SEO visibility, conversion structure, and first impression.
            </p>
          </div>

          <ScoreGauge score={after} color="#14c38e" label="Optimized" />
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          style={{ marginBottom: "64px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#333" }}>
              Copy optimizations
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 28px 1fr", gap: "0", width: "100%" }}>
              <span />
              <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#333", paddingLeft: "14px" }}>
                Current
              </span>
              <span />
              <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#14c38e", paddingLeft: "34px" }}>
                Optimized
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1a1a1a" }}>
            <ComparisonRow label="Title Tag" before={scraped.title} after={result.optimizedTitle} delay={0.25} />
            <ComparisonRow label="H1 Heading" before={scraped.h1} after={result.optimizedH1} delay={0.31} />
            <ComparisonRow label="Meta Desc." before={scraped.metaDescription} after={result.optimizedMeta} delay={0.37} />
            <ComparisonRow label="Primary CTA" before="" after={result.optimizedCTA} delay={0.43} />
          </div>
        </motion.div>

        {/* Callouts */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#444" }}>
              Improvements identified
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckmarkFilled size={13} style={{ color: "#14c38e" }} />
              <span style={{ fontSize: "11px", color: "#14c38e", letterSpacing: "0.03em" }}>Analysis complete</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {result.callouts.map((callout, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                style={{
                  background: CALLOUT_BG[callout.type],
                  border: `1px solid ${CALLOUT_COLORS[callout.type]}22`,
                  borderTop: `2px solid ${CALLOUT_COLORS[callout.type]}`,
                  borderRadius: "6px",
                  padding: "22px 20px",
                }}
              >
                <div style={{ color: CALLOUT_COLORS[callout.type], marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {CALLOUT_ICONS[callout.type]}
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {callout.type}
                  </span>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#e0e0e0", marginBottom: "10px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                  {callout.label}
                </p>
                <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.7 }}>
                  {callout.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ textAlign: "center", marginTop: "72px" }}
        >
          <button
            onClick={() => leadRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              color: "#444",
              fontSize: "12px",
              cursor: "pointer",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              animation: "bob 2s ease-in-out infinite",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
          >
            Book your free call
            <ChevronDown size={16} />
          </button>
        </motion.div>

      </div>

      {/* Lead capture */}
      <div ref={leadRef} style={{ marginTop: "72px" }}>
        <LeadCapture url={scraped.url} />
      </div>

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
}

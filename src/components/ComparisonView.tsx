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
  seo: <Search size={20} />,
  conversion: <Analytics size={20} />,
  ux: <Laptop size={20} />,
  trust: <Certificate size={20} />,
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

function FieldCard({
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: "#0d0d0d",
        border: "1px solid #222",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Field label bar */}
      <div style={{
        padding: "12px 24px",
        borderBottom: "1px solid #1a1a1a",
        background: "#0a0a0a",
      }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#14c38e",
        }}>
          {label}
        </span>
      </div>

      {/* Before / After */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Before */}
        <div style={{
          padding: "20px 24px",
          borderRight: "1px solid #1a1a1a",
        }}>
          <p style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#555",
            marginBottom: "10px",
          }}>Current</p>
          <p style={{
            fontSize: "15px",
            color: before ? "#888" : "#444",
            lineHeight: 1.6,
            fontStyle: before ? "normal" : "italic",
          }}>
            {before || "Not detected"}
          </p>
        </div>

        {/* After */}
        <div style={{
          padding: "20px 24px",
          background: "rgba(20,195,142,0.03)",
        }}>
          <p style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#14c38e",
            marginBottom: "10px",
          }}>Optimized</p>
          <p style={{
            fontSize: "15px",
            color: "#ffffff",
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            {after}
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
  try {
    domain = new URL(scraped.url).hostname.replace(/^www\./, "");
  } catch {
    // keep original
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060606", paddingBottom: "140px" }}>

      {/* Top nav */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid #181818",
          background: "rgba(6,6,6,0.9)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <a
          href="/"
          style={{
            color: "#666",
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
        >
          <ArrowLeft size={15} />
          New analysis
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
              fontSize: "12px",
              color: "#14c38e",
              fontWeight: 700,
              background: "rgba(20,195,142,0.12)",
              border: "1px solid rgba(20,195,142,0.25)",
              padding: "3px 10px",
              borderRadius: "20px",
              letterSpacing: "0.01em",
            }}
          >
            +{delta} pts
          </motion.span>
        </div>
      </motion.div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 32px 0" }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "64px" }}
        >
          <p style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#14c38e",
            marginBottom: "16px",
          }}>
            SEO Executive Summary
          </p>
          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "20px",
          }}>
            {domain}
          </h1>
          <p style={{
            fontSize: "17px",
            color: "#888",
            lineHeight: 1.7,
            maxWidth: "580px",
          }}>
            We analyzed your homepage against SEO fundamentals, conversion structure, and trust signals. Here&apos;s exactly what needs to change — and the improved copy to replace it with.
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #222",
            marginBottom: "64px",
          }}
        >
          {/* Before score */}
          <div style={{
            padding: "36px 40px",
            background: "#0d0d0d",
            borderRight: "1px solid #222",
          }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "16px",
            }}>Current score</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "64px", fontWeight: 900, color: "#ef4444", lineHeight: 1, letterSpacing: "-0.04em" }}>{before}</span>
              <span style={{ fontSize: "22px", color: "#333", fontWeight: 700, paddingBottom: "8px" }}>/100</span>
            </div>
            <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.5 }}>
              Missing key SEO signals, weak conversion structure.
            </p>
          </div>

          {/* After score */}
          <div style={{
            padding: "36px 40px",
            background: "rgba(20,195,142,0.04)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: 0, right: 0,
              width: "200px", height: "200px",
              background: "radial-gradient(circle at top right, rgba(20,195,142,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#14c38e",
              marginBottom: "16px",
            }}>Optimized score</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "64px", fontWeight: 900, color: "#14c38e", lineHeight: 1, letterSpacing: "-0.04em" }}>{after}</span>
              <span style={{ fontSize: "22px", color: "#14c38e", fontWeight: 700, paddingBottom: "8px", opacity: 0.5 }}>/100</span>
            </div>
            <p style={{ fontSize: "15px", color: "#888", lineHeight: 1.5 }}>
              <span style={{ color: "#14c38e", fontWeight: 700 }}>+{delta} point improvement</span> with the changes below.
            </p>
          </div>
        </motion.div>

        {/* Copy optimizations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: "72px" }}
        >
          <div style={{ marginBottom: "24px" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#555",
            }}>Copy optimizations</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <FieldCard label="Title Tag" before={scraped.title} after={result.optimizedTitle} delay={0.25} />
            <FieldCard label="H1 Heading" before={scraped.h1} after={result.optimizedH1} delay={0.31} />
            <FieldCard label="Meta Description" before={scraped.metaDescription} after={result.optimizedMeta} delay={0.37} />
            <FieldCard label="Primary CTA" before="" after={result.optimizedCTA} delay={0.43} />
          </div>
        </motion.div>

        {/* Callout cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
        >
          <div style={{ marginBottom: "24px" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#555",
            }}>Findings & recommendations</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {result.callouts.map((callout, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                style={{
                  background: "#0d0d0d",
                  border: "1px solid #222",
                  borderRadius: "10px",
                  padding: "28px",
                  borderTop: `3px solid ${CALLOUT_COLORS[callout.type]}`,
                }}
              >
                {/* Badge */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: `${CALLOUT_COLORS[callout.type]}14`,
                  border: `1px solid ${CALLOUT_COLORS[callout.type]}30`,
                  borderRadius: "20px",
                  padding: "5px 12px 5px 8px",
                  marginBottom: "18px",
                }}>
                  <span style={{ color: CALLOUT_COLORS[callout.type], display: "flex" }}>
                    {CALLOUT_ICONS[callout.type]}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: CALLOUT_COLORS[callout.type],
                  }}>
                    {CALLOUT_LABELS[callout.type]}
                  </span>
                </div>

                <p style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "12px",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}>
                  {callout.label}
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#999",
                  lineHeight: 1.75,
                }}>
                  {callout.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ textAlign: "center", marginTop: "80px" }}
        >
          <button
            onClick={() => leadRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              animation: "bob 2s ease-in-out infinite",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            Get these changes implemented
            <ChevronDown size={18} />
          </button>
        </motion.div>

      </div>

      {/* Lead capture */}
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

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
} from "@carbon/icons-react";

interface Props {
  scraped: ScrapedPage;
  result: OptimizationResult;
  screenshotBase64: string | null;
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

function BeforePanel({ scraped, score, screenshotBase64 }: { scraped: ScrapedPage; score: number; screenshotBase64: string | null }) {
  if (screenshotBase64) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative", borderRight: "1px solid #222", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${screenshotBase64}`}
          alt="Current homepage"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(6,6,6,0.88)", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "4px 10px", backdropFilter: "blur(6px)" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444" }}>{score}</span>
          <span style={{ fontSize: "10px", color: "#444" }}>/100</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid #222" }}>
      {/* Browser chrome */}
      <div style={{ background: "#141414", borderBottom: "1px solid #222", padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#333" }} />
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#333" }} />
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#333" }} />
        <span style={{ flex: 1, background: "#1e1e1e", borderRadius: "3px", height: "18px", marginLeft: "8px", display: "flex", alignItems: "center", paddingLeft: "8px" }}>
          <span style={{ fontSize: "9px", color: "#333" }}>{scraped.url}</span>
        </span>
      </div>

      {/* Page preview */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero section */}
        <div style={{ background: "#0d0d0d", padding: "36px 28px", borderBottom: "3px solid #ef444433", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.04)", pointerEvents: "none" }} />
          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ef4444", marginBottom: "10px", opacity: 0.7 }}>
            Current Version
          </p>
          <h1
            style={{
              fontSize: "clamp(14px, 2vw, 20px)",
              fontWeight: 800,
              color: scraped.h1 ? "#c0c0c0" : "#3a3a3a",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "12px",
              maxWidth: "400px",
              fontStyle: scraped.h1 ? "normal" : "italic",
            }}
          >
            {scraped.h1 || "No H1 found on this page"}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: scraped.metaDescription ? "#666" : "#333",
              lineHeight: 1.6,
              marginBottom: "20px",
              maxWidth: "360px",
              fontStyle: scraped.metaDescription ? "normal" : "italic",
            }}
          >
            {scraped.metaDescription || "No meta description found"}
          </p>
          {/* No clear CTA indicator */}
          <div style={{ display: "inline-block", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#444", fontWeight: 600, fontSize: "11px", padding: "8px 16px", borderRadius: "4px" }}>
            Contact Us
          </div>
        </div>

        {/* Placeholder content rows */}
        <div style={{ padding: "18px 28px", borderBottom: "1px solid #161616" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            {[60, 80, 45].map((w, i) => (
              <div key={i} style={{ height: "8px", width: `${w}%`, background: "#161616", borderRadius: "2px" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[75, 50].map((w, i) => (
              <div key={i} style={{ height: "8px", width: `${w}%`, background: "#141414", borderRadius: "2px" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: "48px", background: "#0d0d0d", borderRadius: "4px", border: "1px solid #161616" }} />
            ))}
          </div>
        </div>

        {/* Title tag */}
        <div style={{ padding: "14px 28px", background: "#090909", borderTop: "1px solid #141414" }}>
          <p style={{ fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Title Tag</p>
          <p style={{ fontSize: "11px", color: scraped.title ? "#555" : "#333", fontStyle: scraped.title ? "normal" : "italic" }}>
            {scraped.title || "No title tag found"}
          </p>
        </div>

        {/* Score */}
        <div style={{ padding: "12px 28px", background: "#090909", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#ef4444" }}>{score}</span>
          <span style={{ fontSize: "10px", color: "#333" }}>/100 current score</span>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({ result, brandColors }: { result: OptimizationResult; brandColors: string[] }) {
  const accentColor = brandColors[0] ?? "#14c38e";

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Browser chrome */}
      <div style={{ background: "#141414", borderBottom: "1px solid #222", padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#333" }} />
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#333" }} />
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#333" }} />
        <span style={{ flex: 1, background: "#1e1e1e", borderRadius: "3px", height: "18px", marginLeft: "8px" }} />
      </div>

      {/* Page preview */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero section — always dark background, accent used for text + border only */}
        <div style={{ background: "#0d0d0d", padding: "36px 28px", borderBottom: `3px solid ${accentColor}`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accentColor}0d 0%, transparent 60%)`, pointerEvents: "none" }} />
          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor, marginBottom: "10px", opacity: 0.9 }}>
            Optimized Version
          </p>
          <h1 style={{ fontSize: "clamp(15px, 2vw, 21px)", fontWeight: 800, color: "#f0f0f0", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: "12px", maxWidth: "400px" }}>
            {result.optimizedH1}
          </h1>
          <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.65, marginBottom: "20px", maxWidth: "360px" }}>
            {result.optimizedMeta}
          </p>
          <div style={{ display: "inline-block", background: accentColor, color: "#060606", fontWeight: 700, fontSize: "11px", padding: "9px 18px", borderRadius: "4px", letterSpacing: "0.01em" }}>
            {result.optimizedCTA}
          </div>
        </div>

        {/* Below-fold placeholder rows */}
        <div style={{ padding: "18px 28px", borderBottom: "1px solid #161616" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            {[70, 90, 55].map((w, i) => (
              <div key={i} style={{ height: "8px", width: `${w}%`, background: "#1a1a1a", borderRadius: "2px" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[85, 60].map((w, i) => (
              <div key={i} style={{ height: "8px", width: `${w}%`, background: "#161616", borderRadius: "2px" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: "48px", background: "#111", borderRadius: "4px", border: "1px solid #1a1a1a" }} />
            ))}
          </div>
        </div>

        {/* Title tag */}
        <div style={{ padding: "14px 28px", background: "#0c0c0c", borderTop: "1px solid #141414" }}>
          <p style={{ fontSize: "9px", color: "#333", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Title Tag</p>
          <p style={{ fontSize: "11px", color: "#60a5fa", lineHeight: 1.4 }}>{result.optimizedTitle}</p>
        </div>

        {/* Score */}
        <div style={{ padding: "12px 28px", background: "#0c0c0c", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "18px", fontWeight: 800, color: accentColor }}>{result.improvementScore.after}</span>
          <span style={{ fontSize: "10px", color: "#333" }}>/100 optimized score</span>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonView({ scraped, result, screenshotBase64 }: Props) {
  const leadRef = useRef<HTMLDivElement>(null);
  const { before, after } = result.improvementScore;
  const delta = after - before;

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

      {/* Panel labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          padding: "28px 24px 12px",
          maxWidth: "100%",
          gap: "2px",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>
            Current Home Page
          </p>
          <p style={{ fontSize: "13px", color: "#333", fontWeight: 400 }}>
            {scraped.title || scraped.url}
          </p>
        </div>
        <div style={{ paddingLeft: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#14c38e", marginBottom: "4px" }}>
            Auto-Phil Optimized
          </p>
          <p style={{ fontSize: "13px", color: "#555", fontWeight: 400 }}>
            {result.optimizedTitle}
          </p>
        </div>
      </motion.div>

      {/* Split panels */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "520px",
          margin: "0 24px",
          borderRadius: "6px",
          overflow: "hidden",
          border: "1px solid #1a1a1a",
        }}
      >
        {/* Before panel */}
        <BeforePanel scraped={scraped} score={before} screenshotBase64={screenshotBase64} />

        {/* After panel */}
        <PreviewPanel result={result} brandColors={scraped.brandColors} />
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        style={{ padding: "48px 24px 0", maxWidth: "1200px", margin: "0 auto" }}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "14px",
          }}
        >
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
              <div
                style={{
                  color: CALLOUT_COLORS[callout.type],
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {CALLOUT_ICONS[callout.type]}
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {callout.type}
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#e0e0e0",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                {callout.label}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#777",
                  lineHeight: 1.7,
                }}
              >
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
        style={{ textAlign: "center", marginTop: "56px" }}
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

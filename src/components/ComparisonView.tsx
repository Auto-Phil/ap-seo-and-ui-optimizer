"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { ScrapedPage, OptimizationResult, Callout } from "@/lib/types";
import AnimatedNumber from "./AnimatedNumber";
import LeadCapture from "./LeadCapture";
import { ArrowLeft, Search, Analytics, Laptop, Certificate, ChevronDown } from "@carbon/icons-react";

interface Props {
  scraped: ScrapedPage;
  result: OptimizationResult;
}

// Palette — not pure black, slightly warm-dark slate
const C = {
  bg: "#0f0f13",
  surface: "#16161c",
  surfaceHigh: "#1e1e28",
  border: "#28283a",
  borderLight: "#22222e",
  text: "#e8e8f0",
  textMuted: "#8888a0",
  textFaint: "#45455a",
  accent: "#22d3a0",       // slightly cooler green — less neon
  accentDim: "rgba(34,211,160,0.10)",
  accentBorder: "rgba(34,211,160,0.22)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.08)",
};

const TAG_COLORS: Record<Callout["type"], { fg: string; bg: string; border: string }> = {
  seo:        { fg: "#22d3a0", bg: "rgba(34,211,160,0.08)",  border: "rgba(34,211,160,0.18)" },
  conversion: { fg: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.18)" },
  ux:         { fg: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.18)" },
  trust:      { fg: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.18)" },
};

const TAG_ICONS: Record<Callout["type"], React.ReactNode> = {
  seo:        <Search size={14} />,
  conversion: <Analytics size={14} />,
  ux:         <Laptop size={14} />,
  trust:      <Certificate size={14} />,
};

const TAG_LABELS: Record<Callout["type"], string> = {
  seo: "SEO", conversion: "Conversion", ux: "UX", trust: "Trust",
};

function clean(text: string) {
  return text.replace(/\s*—\s*/g, ", ").replace(/–/g, "-");
}

function Bullets({ text, color }: { text: string; color: string }) {
  const points = text.split("|").map(s => clean(s.trim())).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
      {points.map((p, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: "9px" }} />
          <span style={{ fontSize: "15px", color: C.textMuted, lineHeight: 1.7 }}>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "13px", fontWeight: 600, color: C.textFaint, marginBottom: "20px", letterSpacing: "0.01em" }}>
      {children}
    </p>
  );
}

function FieldCard({ label, before, after, delay }: { label: string; before: string; after: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}
    >
      {/* Label row */}
      <div style={{ padding: "14px 28px", borderBottom: `1px solid ${C.borderLight}` }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: C.textMuted }}>{label}</span>
      </div>

      {/* Before / After columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "24px 28px", borderRight: `1px solid ${C.borderLight}` }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.textFaint, marginBottom: "10px", letterSpacing: "0.04em" }}>Current</p>
          <p style={{ fontSize: "15px", color: before ? C.textMuted : C.textFaint, lineHeight: 1.65, fontStyle: before ? "normal" : "italic" }}>
            {before || "Not detected"}
          </p>
        </div>
        <div style={{ padding: "24px 28px", background: C.accentDim, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: "24px", bottom: "24px", width: "3px", background: C.accent, borderRadius: "0 2px 2px 0" }} />
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.accent, marginBottom: "10px", letterSpacing: "0.04em" }}>Recommended</p>
          <p style={{ fontSize: "15px", color: C.text, lineHeight: 1.65, fontWeight: 500 }}>{clean(after)}</p>
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
  try { domain = new URL(scraped.url).hostname.replace(/^www\./, ""); } catch { /**/ }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: "140px", fontFamily: "inherit" }}>

      {/* Sticky nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: "56px",
          borderBottom: `1px solid ${C.border}`,
          background: `rgba(15,15,19,0.94)`,
          backdropFilter: "blur(16px)",
          position: "sticky", top: 0, zIndex: 20,
        }}
      >
        <a href="/" style={{ color: C.textMuted, textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
        >
          <ArrowLeft size={14} /> New analysis
        </a>

        {/* Score pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 16px" }}>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            <AnimatedNumber from={0} to={before} duration={800} color={C.red} />
          </span>
          <span style={{ color: C.textFaint, fontSize: "13px", margin: "0 4px" }}>→</span>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            <AnimatedNumber from={before} to={after} duration={1000} color={C.accent} />
          </span>
          <motion.span
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.3 }}
            style={{ marginLeft: "6px", fontSize: "12px", fontWeight: 700, color: C.accent, background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: "5px", padding: "2px 7px" }}
          >
            +{delta}
          </motion.span>
        </div>
      </motion.nav>

      {/* Page body */}
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "72px 40px 0" }}>

        {/* — Header — */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: "64px" }}>
          <p style={{ fontSize: "13px", color: C.accent, fontWeight: 600, marginBottom: "14px" }}>
            Homepage SEO Audit
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "20px" }}>
            {domain}
          </h1>
          <p style={{ fontSize: "17px", color: C.textMuted, lineHeight: 1.75, maxWidth: "560px" }}>
            Personalized analysis of your SEO signals, conversion copy, and trust structure. Specific fixes included.
          </p>
        </motion.div>

        {/* — Score banner — */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ marginBottom: "64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "14px", overflow: "hidden", border: `1px solid ${C.border}` }}>
            {/* Before */}
            <div style={{ padding: "40px 44px", background: C.surface }}>
              <p style={{ fontSize: "13px", color: C.textFaint, fontWeight: 500, marginBottom: "16px" }}>Current score</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "14px" }}>
                <span style={{ fontSize: "68px", fontWeight: 900, color: C.red, lineHeight: 1, letterSpacing: "-0.05em" }}>{before}</span>
                <span style={{ fontSize: "18px", color: C.textFaint, fontWeight: 600 }}>/100</span>
              </div>
              <div style={{ height: "4px", borderRadius: "4px", background: C.surfaceHigh, overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ height: "100%", width: `${before}%`, background: C.red, borderRadius: "4px", transition: "width 1s ease" }} />
              </div>
              <p style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.6 }}>Significant gaps in SEO signals, conversion copy, and trust elements.</p>
            </div>
            {/* After */}
            <div style={{ padding: "40px 44px", background: C.accentDim, position: "relative", overflow: "hidden", borderLeft: `1px solid ${C.border}` }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(34,211,160,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
              <p style={{ fontSize: "13px", color: C.accent, fontWeight: 600, marginBottom: "16px" }}>Optimized score</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "14px" }}>
                <span style={{ fontSize: "68px", fontWeight: 900, color: C.accent, lineHeight: 1, letterSpacing: "-0.05em" }}>{after}</span>
                <span style={{ fontSize: "18px", color: C.accent, fontWeight: 600, opacity: 0.45 }}>/100</span>
              </div>
              <div style={{ height: "4px", borderRadius: "4px", background: "rgba(34,211,160,0.15)", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ height: "100%", width: `${after}%`, background: C.accent, borderRadius: "4px", transition: "width 1s ease" }} />
              </div>
              <p style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.6 }}>
                <span style={{ color: C.accent, fontWeight: 700 }}>+{delta} point gain</span> by applying the recommendations below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* — Copy optimizations — */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ marginBottom: "72px" }}>
          <SectionLabel>Copy optimizations</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <FieldCard label="Title tag" before={scraped.title} after={result.optimizedTitle} delay={0.25} />
            <FieldCard label="H1 heading" before={scraped.h1} after={result.optimizedH1} delay={0.3} />
            <FieldCard label="Meta description" before={scraped.metaDescription} after={result.optimizedMeta} delay={0.35} />
            <FieldCard label="Primary CTA" before="" after={result.optimizedCTA} delay={0.4} />
          </div>
        </motion.div>

        {/* — Findings — */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}>
          <SectionLabel>Findings and recommendations</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {result.callouts.map((callout, i) => {
              const tag = TAG_COLORS[callout.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.48 + i * 0.07 }}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${tag.fg}`,
                    borderRadius: "12px",
                    padding: "28px 32px",
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    gap: "32px",
                    alignItems: "start",
                  }}
                >
                  {/* Left: tag + title */}
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: tag.bg, border: `1px solid ${tag.border}`, borderRadius: "6px", padding: "4px 10px", marginBottom: "14px" }}>
                      <span style={{ color: tag.fg, display: "flex", alignItems: "center" }}>{TAG_ICONS[callout.type]}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: tag.fg, letterSpacing: "0.06em" }}>{TAG_LABELS[callout.type]}</span>
                    </div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                      {clean(callout.label)}
                    </p>
                  </div>

                  {/* Right: bullets */}
                  <Bullets text={callout.description} color={tag.fg} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* — Scroll CTA — */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }} style={{ textAlign: "center", marginTop: "88px" }}>
          <button
            onClick={() => leadRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "none", border: "none", color: C.textFaint, fontSize: "13px", cursor: "pointer", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "10px", fontWeight: 500, animation: "bob 2.2s ease-in-out infinite", transition: "color 0.15s", fontFamily: "inherit" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.textMuted)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textFaint)}
          >
            Get these changes implemented
            <ChevronDown size={16} />
          </button>
        </motion.div>
      </div>

      <div ref={leadRef} style={{ marginTop: "88px" }}>
        <LeadCapture url={scraped.url} />
      </div>

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
      `}</style>
    </div>
  );
}

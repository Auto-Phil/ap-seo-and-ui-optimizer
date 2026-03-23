"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
import type { ScrapedPage, OptimizationResult } from "@/lib/types";

interface RevealAnimationProps {
  scraped: ScrapedPage;
  result: OptimizationResult;
  onComplete: () => void;
}

type Stage = "blackout" | "score-before" | "score-after" | "page-reveal" | "callouts" | "done";

const calloutColors: Record<string, string> = {
  seo: "var(--accent)",
  conversion: "#22c55e",
  ux: "#a855f7",
  trust: "#f59e0b",
};

const calloutIcons: Record<string, string> = {
  seo: "🎯",
  conversion: "📈",
  ux: "🖥",
  trust: "✓",
};

export function RevealAnimation({ scraped, result, onComplete }: RevealAnimationProps) {
  const [stage, setStage] = useState<Stage>("blackout");
  const hasRun = useRef(false);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (prefersReducedMotion) {
      setStage("done");
      onComplete();
      return;
    }

    const seq: [number, () => void][] = [
      [300,  () => setStage("score-before")],
      [1600, () => setStage("score-after")],
      [3000, () => setStage("page-reveal")],
      [4000, () => setStage("callouts")],
      [5800, () => { setStage("done"); onComplete(); }],
    ];

    seq.forEach(([delay, fn]) => setTimeout(fn, delay));
  }, [prefersReducedMotion, onComplete]);

  const before = result.improvementScore.before;
  const after = result.improvementScore.after;
  const delta = after - before;

  if (stage === "done") return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "var(--background)",
      zIndex: 100,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>

      {/* Score stages */}
      <AnimatePresence mode="wait">
        {stage === "score-before" && (
          <motion.div
            key="score-before"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Current score for
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 24, maxWidth: 400 }}>
              {scraped.url}
            </p>
            <AnimatedNumber from={0} to={before} duration={900} color="#ef4444" fontSize={96} />
            <span style={{ color: "#ef4444", fontSize: 40, fontWeight: 300 }}>/100</span>
          </motion.div>
        )}

        {stage === "score-after" && (
          <motion.div
            key="score-after"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>
              After optimization
            </p>
            <AnimatedNumber from={before} to={after} duration={1000} color="#22c55e" fontSize={96} />
            <span style={{ color: "#22c55e", fontSize: 40, fontWeight: 300 }}>/100</span>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ color: "#22c55e", fontSize: 18, fontWeight: 600, marginTop: 16 }}
            >
              +{delta} points
            </motion.p>
          </motion.div>
        )}

        {(stage === "page-reveal" || stage === "callouts") && (
          <motion.div
            key="page-reveal"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ position: "fixed", inset: 0, backgroundColor: "var(--background)", overflow: "hidden" }}
          >
            {/* Flash */}
            <motion.div
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute", inset: 0, backgroundColor: "#fff", zIndex: 10, pointerEvents: "none" }}
            />

            <iframe
              srcDoc={result.optimizedHtml}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title="Optimized version"
            />

            {/* Score badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 20,
                backgroundColor: "rgba(10,13,12,0.9)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "10px 16px",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 18 }}>{before}</span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 18 }}>{after}</span>
              <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>+{delta} pts</span>
            </motion.div>

            {/* Callouts */}
            {stage === "callouts" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                  zIndex: 20,
                  display: "flex",
                  gap: 10,
                  overflowX: "auto",
                  paddingBottom: 4,
                }}
              >
                {result.callouts.map((callout, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 220, damping: 22 }}
                    style={{
                      minWidth: 180,
                      flexShrink: 0,
                      backgroundColor: "rgba(10,13,12,0.92)",
                      border: `1px solid var(--border)`,
                      borderLeft: `3px solid ${calloutColors[callout.type] ?? "var(--accent)"}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <p style={{ fontSize: 16, marginBottom: 4 }}>{calloutIcons[callout.type]}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                      {callout.label}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {callout.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

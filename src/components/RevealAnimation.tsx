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

type Stage =
  | "blackout"
  | "before-slide"
  | "score-before"
  | "scanning"
  | "split"
  | "score-after"
  | "callouts"
  | "done";

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

    const seq = [
      [0, () => setStage("blackout")],
      [400, () => setStage("before-slide")],
      [1000, () => setStage("score-before")],
      [1800, () => setStage("scanning")],
      [3200, () => setStage("split")],
      [3900, () => setStage("score-after")],
      [5000, () => setStage("callouts")],
      [6500, () => { setStage("done"); onComplete(); }],
    ] as [number, () => void][];

    seq.forEach(([delay, fn]) => setTimeout(fn, delay));
  }, [prefersReducedMotion, onComplete]);

  const before = result.improvementScore.before;
  const after = result.improvementScore.after;
  const delta = after - before;

  const calloutIcons: Record<string, string> = {
    seo: "🎯",
    conversion: "📈",
    ux: "🖥",
    trust: "✓",
  };

  const calloutColors: Record<string, string> = {
    seo: "#3b82f6",
    conversion: "#22c55e",
    ux: "#a855f7",
    trust: "#f59e0b",
  };

  if (stage === "done") return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#000",
      zIndex: 100,
      overflow: "hidden",
    }}>

      {/* Stage 1-4: Before panel alone */}
      <AnimatePresence>
        {(stage === "before-slide" || stage === "score-before" || stage === "scanning") && (
          <motion.div
            key="before-full"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-50%", opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Label */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Your current homepage
              </span>
            </div>

            {/* Screenshot */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${scraped.screenshotBase64}`}
                alt="Current homepage"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />

              {/* Scan line */}
              {stage === "scanning" && (
                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: "rgba(59,130,246,0.6)",
                    boxShadow: "0 0 12px rgba(59,130,246,0.8)",
                  }}
                />
              )}

              {/* Red tint after scan */}
              {stage === "scanning" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(239,68,68,0.08)",
                  }}
                />
              )}
            </div>

            {/* Score before */}
            {(stage === "score-before" || stage === "scanning") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  padding: "24px 40px",
                  borderRadius: 16,
                  backdropFilter: "blur(8px)",
                }}
              >
                <p style={{ color: "#555", fontSize: 13, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Current score
                </p>
                <AnimatedNumber from={0} to={before} duration={800} color="#ef4444" fontSize={72} />
                <span style={{ color: "#ef4444", fontSize: 32 }}>/100</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 5+: Split view */}
      <AnimatePresence>
        {(stage === "split" || stage === "score-after" || stage === "callouts") && (
          <>
            {/* Before panel — left half */}
            <motion.div
              key="before-split"
              initial={{ x: 0, width: "100%" }}
              animate={{ x: 0, width: "50%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", backgroundColor: "#0a0a0a" }}>
                <span style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Before
                </span>
                {(stage === "score-after" || stage === "callouts") && (
                  <span style={{ float: "right", color: "#ef4444", fontWeight: 700 }}>{before}/100</span>
                )}
              </div>
              <div style={{ flex: 1, overflow: "auto" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${scraped.screenshotBase64}`}
                  alt="Before"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </motion.div>

            {/* After panel — right half, curtain reveal */}
            <motion.div
              key="after-split"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "50%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid #1a1a1a",
              }}
            >
              {/* Flash of light */}
              <motion.div
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", inset: 0, backgroundColor: "#fff", zIndex: 10, pointerEvents: "none" }}
              />

              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", backgroundColor: "#0f0f0f" }}>
                <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Optimized by w.max
                </span>
                {(stage === "score-after" || stage === "callouts") && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ float: "right", color: "#22c55e", fontWeight: 700 }}
                  >
                    {stage === "score-after" ? (
                      <AnimatedNumber from={before} to={after} duration={1000} color="#22c55e" fontSize={16} />
                    ) : after}/100
                  </motion.span>
                )}
              </div>
              <div style={{ flex: 1, overflow: "auto" }}>
                <iframe
                  srcDoc={result.optimizedHtml}
                  sandbox="allow-same-origin"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="Optimized version"
                />
              </div>
            </motion.div>

            {/* Vs divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 12,
                color: "#555",
                fontWeight: 600,
              }}
            >
              vs
            </motion.div>

            {/* Score delta badge */}
            {(stage === "score-after" || stage === "callouts") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 24,
                  zIndex: 30,
                  backgroundColor: "#0f0f0f",
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: "10px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 20 }}>{before}</span>
                  <span style={{ color: "#555" }}>→</span>
                  <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 20 }}>{after}</span>
                  <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>↑ +{delta} pts</span>
                </div>
              </motion.div>
            )}

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
                  zIndex: 30,
                  display: "flex",
                  gap: 12,
                  overflowX: "auto",
                }}
              >
                {result.callouts.map((callout, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                    style={{
                      minWidth: 180,
                      backgroundColor: "rgba(20,20,20,0.95)",
                      border: `1px solid ${calloutColors[callout.type] ?? "#2a2a2a"}`,
                      borderLeft: `3px solid ${calloutColors[callout.type] ?? "#2a2a2a"}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <p style={{ fontSize: 16, marginBottom: 4 }}>{calloutIcons[callout.type]} </p>
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

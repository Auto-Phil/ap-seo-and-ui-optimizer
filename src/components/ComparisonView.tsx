"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScrapedPage, OptimizationResult, Callout } from "@/lib/types";
import AnimatedNumber from "./AnimatedNumber";
import LeadCapture from "./LeadCapture";

interface Props {
  scraped: ScrapedPage;
  result: OptimizationResult;
}

const CALLOUT_ICONS: Record<Callout["type"], string> = {
  seo: "🎯",
  conversion: "📈",
  ux: "🖥",
  trust: "✓",
};

const CALLOUT_COLORS: Record<Callout["type"], string> = {
  seo: "#3b82f6",
  conversion: "#22c55e",
  ux: "#a855f7",
  trust: "#f59e0b",
};

// 7-stage reveal sequence
type Stage =
  | "blackout"
  | "before-panel"
  | "before-score"
  | "overlay-text"
  | "split"
  | "after-score"
  | "callouts";

export default function ComparisonView({ scraped, result }: Props) {
  const [stage, setStage] = useState<Stage>("blackout");
  const [showCallouts, setShowCallouts] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [countBeforeDone, setCountBeforeDone] = useState(false);
  const leadRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (prefersReduced) {
      setStage("callouts");
      setShowCallouts(true);
      setShowScrollPrompt(true);
      return;
    }

    // Stage 1 → 2
    setTimeout(() => setStage("before-panel"), 400);
    // Stage 3
    setTimeout(() => setStage("before-score"), 1000);
    // Stage 4
    setTimeout(() => setStage("overlay-text"), 1800);
    // Stage 5
    setTimeout(() => setStage("split"), 3200);
    // Stage 6
    setTimeout(() => setStage("after-score"), 3900);
    // Stage 7
    setTimeout(() => {
      setStage("callouts");
      setShowCallouts(true);
    }, 5000);
    // Scroll prompt
    setTimeout(() => setShowScrollPrompt(true), 6200);
  }, [prefersReduced]);

  const { before, after } = result.improvementScore;
  const delta = after - before;

  const showBefore = stage !== "blackout";
  const showAfter = ["split", "after-score", "callouts"].includes(stage);
  const showBeforeScore = ["before-score", "overlay-text", "split", "after-score", "callouts"].includes(stage);
  const showAfterScore = ["after-score", "callouts"].includes(stage);
  const showOverlay = stage === "overlay-text";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingBottom: "120px" }}>
      {/* Top bar */}
      <AnimatePresence>
        {showBefore && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              borderBottom: "1px solid #1a1a1a",
            }}
          >
            <a
              href="/"
              style={{
                color: "#a0a0a0",
                textDecoration: "none",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Back
            </a>

            {/* Score badge */}
            {showBeforeScore && (
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  <AnimatedNumber from={0} to={before} duration={800} color="#ef4444" />
                  {showAfterScore && (
                    <>
                      <span style={{ color: "#555" }}>→</span>
                      <AnimatedNumber from={before} to={after} duration={1000} color="#22c55e" />
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1.1 }}
                        style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}
                      >
                        ↑ +{delta} pts
                      </motion.span>
                    </>
                  )}
                </div>
                {showAfterScore && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                      height: "3px",
                      background: `linear-gradient(to right, #ef4444 ${(before / 100) * 100}%, #22c55e)`,
                      borderRadius: "2px",
                      marginTop: "6px",
                      overflow: "hidden",
                    }}
                  />
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split panel */}
      <div
        style={{
          display: "flex",
          height: "600px",
          position: "relative",
          overflow: "hidden",
          margin: "0",
        }}
      >
        {/* Before panel */}
        <AnimatePresence>
          {showBefore && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                width: showAfter ? "50%" : "100%",
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
                borderRight: showAfter ? "1px solid #2a2a2a" : "none",
              }}
            >
              {/* Panel label */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 10,
                  background: "rgba(0,0,0,0.75)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#a0a0a0",
                  backdropFilter: "blur(4px)",
                }}
              >
                Your current homepage
              </div>

              {/* Screenshot */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${scraped.screenshotBase64}`}
                alt="Current homepage screenshot"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />

              {/* Scan line effect */}
              {["before-panel", "before-score", "overlay-text"].includes(stage) && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, ease: "linear", delay: 0.3 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "rgba(59,130,246,0.6)",
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />
              )}

              {/* Red tint overlay after scan */}
              {["before-score", "overlay-text", "split", "after-score", "callouts"].includes(stage) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(239,68,68,0.06)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center divider "vs" pill */}
        <AnimatePresence>
          {showAfter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: "20px",
                padding: "4px 10px",
                fontSize: "11px",
                color: "#555",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              vs
            </motion.div>
          )}
        </AnimatePresence>

        {/* After panel */}
        <AnimatePresence>
          {showAfter && (
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ width: "50%", height: "100%", position: "relative", overflow: "hidden" }}
            >
              {/* Flash of light */}
              <motion.div
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "white",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />

              {/* Panel label */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 10,
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#3b82f6",
                  backdropFilter: "blur(4px)",
                }}
              >
                Optimized by Auto-Phil
              </div>

              <iframe
                srcDoc={result.optimizedHtml}
                sandbox="allow-same-origin"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
                title="Optimized version"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay text (stage 4) */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.6)",
                zIndex: 30,
                backdropFilter: "blur(2px)",
              }}
            >
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                Your current page scores{" "}
                <span style={{ color: "#ef4444" }}>{before}/100</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Callouts strip */}
      <AnimatePresence>
        {showCallouts && (
          <motion.div
            style={{
              padding: "40px 24px 0",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "8px",
              }}
            >
              {result.callouts.map((callout, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  style={{
                    flex: "0 0 220px",
                    background: "#141414",
                    border: "1px solid #2a2a2a",
                    borderLeft: `3px solid ${CALLOUT_COLORS[callout.type]}`,
                    borderRadius: "10px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      marginBottom: "8px",
                    }}
                  >
                    {CALLOUT_ICONS[callout.type]}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#f5f5f5",
                      marginBottom: "6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {callout.label}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {callout.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Analysis complete line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: result.callouts.length * 0.15 + 0.3 }}
              style={{
                fontSize: "12px",
                color: "#22c55e",
                marginTop: "20px",
                letterSpacing: "0.05em",
              }}
            >
              ✓ Analysis complete
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll prompt */}
      <AnimatePresence>
        {showScrollPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: "center",
              marginTop: "48px",
            }}
          >
            <button
              onClick={() =>
                leadRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                animation: "bob 2s ease-in-out infinite",
              }}
            >
              See your next step
              <span style={{ fontSize: "18px" }}>↓</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead capture */}
      <div ref={leadRef} style={{ marginTop: "64px" }}>
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

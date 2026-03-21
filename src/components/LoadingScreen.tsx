"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Fetching your page...",
  "Analyzing your content...",
  "Re-building for conversions...",
  "Adding SEO improvements...",
  "Almost ready...",
];

const FACTS = [
  "Pages that load in under 2 seconds convert 15% better than slow ones.",
  "75% of users never scroll past the first page of Google results.",
  "A clear headline above the fold can increase conversions by up to 89%.",
  "AI can analyze and rewrite a homepage in the time it takes to make coffee.",
  "Sites with a single focused CTA convert 371% better than those with multiple.",
  "53% of mobile users abandon a page that takes longer than 3 seconds to load.",
  "Adding social proof near a CTA can boost click-through rates by 34%.",
  "Businesses that blog get 55% more website visitors than those that don't.",
  "The average webpage title that ranks #1 on Google is 57 characters long.",
  "Automating lead follow-up within 5 minutes increases conversion rates by 9x.",
];

interface LoadingScreenProps {
  phase: "scraping" | "optimizing";
}

export function LoadingScreen({ phase }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FACTS.length));

  useEffect(() => {
    if (phase === "optimizing") setMsgIndex(2);
  }, [phase]);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((i) => (i + 1) % FACTS.length);
    }, 5000);
    return () => clearInterval(factInterval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--background)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
      padding: "24px 16px",
    }}>
      {/* Spinner ring */}
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ animation: "spin 1.2s linear infinite" }}>
          <circle cx="32" cy="32" r="28" stroke="#2a2a2a" strokeWidth="4" />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="50 126"
            strokeDashoffset="0"
          />
        </svg>
      </div>

      {/* Status message */}
      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: 16,
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        {MESSAGES[msgIndex]}
      </motion.p>

      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--text-muted)" }}
          />
        ))}
      </div>

      {/* Did you know */}
      <motion.div
        style={{
          marginTop: 16,
          maxWidth: 420,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "16px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
          Did you know?
        </p>
        <motion.p
          key={factIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}
        >
          {FACTS[factIndex]}
        </motion.p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

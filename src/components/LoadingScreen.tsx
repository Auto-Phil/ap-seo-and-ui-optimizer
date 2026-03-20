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

interface LoadingScreenProps {
  phase: "scraping" | "optimizing";
}

export function LoadingScreen({ phase }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (phase === "optimizing") setMsgIndex(2);
  }, [phase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 3000);
    return () => clearInterval(interval);
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

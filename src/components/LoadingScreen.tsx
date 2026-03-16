"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Fetching your page...",
  "Analyzing your content...",
  "Identifying SEO gaps...",
  "Building recommendations...",
  "Almost ready...",
];

const FACTS = [
  { tag: "SEO FACT", text: "75% of users never scroll past the first page of Google results — your title tag is your first impression." },
  { tag: "AI INSIGHT", text: "ChatGPT, Perplexity, and Google's AI Overview all pull answers from pages with clear, structured headings." },
  { tag: "SEO FACT", text: "Pages with optimized title tags get up to 56% more clicks from search results than unoptimized ones." },
  { tag: "CONVERSION", text: "A single above-the-fold CTA with a specific, action-oriented label can increase lead capture by up to 80%." },
  { tag: "AI INSIGHT", text: "40% of Google searches now trigger an AI-generated answer — pages that answer questions clearly rank inside them." },
  { tag: "SEO FACT", text: "Sites with a clearly structured H1 are 2× more likely to appear in Google Featured Snippets." },
  { tag: "SEARCH TREND", text: "Voice search and AI assistants favor pages that are specific, scannable, and answer questions in the first 100 words." },
  { tag: "CONVERSION", text: "Websites that load in under 2 seconds convert 3× more visitors into leads than slower pages." },
  { tag: "AI INSIGHT", text: "AI search tools reward pages that directly state who they help, what they do, and how to take the next step." },
  { tag: "SEO FACT", text: "A well-written meta description can improve click-through rate from search results by up to 5.8%." },
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % FACTS.length);
        setFactVisible(true);
      }, 400);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const fact = FACTS[factIndex];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060606",
        backgroundImage:
          "radial-gradient(ellipse at 50% 30%, rgba(20,195,142,0.045) 0%, transparent 60%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "40px 24px",
      }}
    >
      {/* Spinner + status */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <div style={{ position: "relative", width: "52px", height: "52px" }}>
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            style={{ animation: "spin 1.1s linear infinite" }}
          >
            <circle cx="26" cy="26" r="21" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
            <circle
              cx="26"
              cy="26"
              r="21"
              fill="none"
              stroke="#14c38e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="34 98"
              strokeDashoffset="0"
            />
          </svg>
        </div>

        <p
          key={msgIndex}
          style={{
            fontSize: "14px",
            color: "#666",
            letterSpacing: "0.01em",
            animation: "fadeIn 0.35s ease",
          }}
        >
          {MESSAGES[msgIndex]}
        </p>

        <div style={{ display: "flex", gap: "5px" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#14c38e",
                animation: `pulse 1.4s ease-in-out ${i * 0.22}s infinite`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrolling facts */}
      <div style={{ maxWidth: "460px", width: "100%" }}>
        <div
          style={{
            background: "#0c0c0c",
            border: "1px solid #1e1e1e",
            borderRadius: "8px",
            padding: "22px 26px",
            minHeight: "100px",
            opacity: factVisible ? 1 : 0,
            transform: factVisible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#14c38e",
              marginBottom: "10px",
            }}
          >
            {fact.tag}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#aaa",
              lineHeight: 1.7,
            }}
          >
            {fact.text}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "14px" }}>
          {FACTS.map((_, i) => (
            <span
              key={i}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: i === factIndex ? "#14c38e" : "#222",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

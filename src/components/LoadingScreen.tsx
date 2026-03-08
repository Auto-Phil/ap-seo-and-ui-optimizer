"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Fetching your page...",
  "Analyzing your content...",
  "Re-building for conversions...",
  "Adding SEO improvements...",
  "Almost ready...",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
      }}
    >
      {/* Spinner ring */}
      <div style={{ position: "relative", width: "64px", height: "64px" }}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          style={{ animation: "spin 1.2s linear infinite" }}
        >
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="40 124"
            strokeDashoffset="0"
          />
        </svg>
      </div>

      {/* Status message */}
      <p
        key={msgIndex}
        style={{
          fontSize: "17px",
          color: "#a0a0a0",
          animation: "fadeIn 0.4s ease",
        }}
      >
        {MESSAGES[msgIndex]}
      </p>

      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#3b82f6",
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

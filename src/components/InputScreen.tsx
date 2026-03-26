"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "@carbon/icons-react";

function isValidUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

const STATS = [
  "Built for agencies and growing businesses",
  "Average score improvement: +47 points",
  "500+ pages analyzed",
];

export default function InputScreen() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!isValidUrl(url)) {
      setError("Enter a valid URL starting with https://");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(url)}`);
  }

  const borderColor = error
    ? "#ef4444"
    : focused
    ? "#14c38e"
    : "#242424";

  const boxShadow = focused && !error
    ? "0 0 0 3px rgba(20,195,142,0.12)"
    : error
    ? "0 0 0 3px rgba(239,68,68,0.12)"
    : "none";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#060606",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(20,195,142,0.055) 0%, transparent 65%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        position: "relative",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginBottom: "28px" }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#14c38e",
              borderBottom: "1px solid rgba(20,195,142,0.3)",
              paddingBottom: "4px",
            }}
          >
            Free SEO Audit · 30 Seconds
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 4.2rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
            marginBottom: "20px",
          }}
        >
          Your personalized
          <br />
          SEO audit.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
          style={{
            fontSize: "17px",
            color: "#888888",
            lineHeight: 1.65,
            marginBottom: "40px",
            maxWidth: "460px",
          }}
        >
          Paste your URL and get a personalized audit in 30 seconds — exact copy fixes for your title, H1, meta description, and CTA, plus a scored breakdown of what&apos;s costing you rankings.
        </motion.p>

        {/* Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
          onSubmit={handleSubmit}
          style={{ marginBottom: "14px" }}
        >
          <div
            style={{
              display: "flex",
              border: `1px solid ${borderColor}`,
              borderRadius: "6px",
              background: "#0f0f0f",
              overflow: "hidden",
              transition: "border-color 0.18s ease, box-shadow 0.18s ease",
              boxShadow,
              animation: shake ? "shake 0.5s ease" : "none",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://yourwebsite.com"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "16px 20px",
                fontSize: "15px",
                color: "#f0f0f0",
                caretColor: "#14c38e",
                fontFamily: "inherit",
              }}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0 22px",
                background: loading ? "#0fa677" : "#14c38e",
                border: "none",
                color: "#060606",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                transition: "background 0.15s ease",
                borderRadius: "0 5px 5px 0",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#0fa677";
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#14c38e";
              }}
            >
              {loading ? (
                <span style={{ animation: "spin 0.9s linear infinite", display: "inline-block", width: 16, height: 16 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="rgba(6,6,6,0.3)" strokeWidth="2" />
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="#060606" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              ) : (
                <>Analyze <ArrowRight size={14} /></>
              )}
            </button>
          </div>

          {error && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#ef4444",
                paddingLeft: "2px",
              }}
            >
              {error}
            </p>
          )}
        </motion.form>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ fontSize: "12px", color: "#444", marginBottom: "72px" }}
        >
          No login. No credit card. Just your URL.
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: "8px",
            borderTop: "1px solid #181818",
            paddingTop: "24px",
          }}
        >
          {STATS.map((item, i) => (
            <span key={item} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span
                  style={{
                    width: "1px",
                    height: "10px",
                    background: "#2a2a2a",
                    margin: "0 18px",
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={{ fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.01em" }}>
                {item}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

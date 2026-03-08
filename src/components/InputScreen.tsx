"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function isValidUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

import type { Transition, TargetAndTransition } from "framer-motion";

const fadeUp = (delay: number): { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition } => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function InputScreen() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g. https://yoursite.com)");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(url)}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "580px", textAlign: "center" }}>
        {/* Label */}
        <motion.span
          {...fadeUp(0)}
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#3b82f6",
            marginBottom: "20px",
          }}
        >
          Free Homepage Audit
        </motion.span>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            color: "#f5f5f5",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "20px",
          }}
        >
          See what your homepage could be.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.4)}
          style={{
            fontSize: "18px",
            color: "#a0a0a0",
            lineHeight: 1.6,
            marginBottom: "36px",
          }}
        >
          Paste your URL. In 15 seconds, see your page rebuilt for SEO and
          conversions — side by side with your original.
        </motion.p>

        {/* Input bar */}
        <motion.form
          {...fadeUp(0.6)}
          onSubmit={handleSubmit}
          style={{ marginBottom: "12px" }}
        >
          <div
            style={{
              display: "flex",
              borderRadius: "12px",
              border: `1px solid ${error ? "#ef4444" : "#2a2a2a"}`,
              background: "#141414",
              overflow: "hidden",
              transition: "border-color 0.2s, box-shadow 0.2s",
              animation: shake ? "shake 0.5s ease" : "none",
            }}
            onFocus={() => {
              const el = document.querySelector("[data-input-wrapper]") as HTMLElement;
              if (el) {
                el.style.borderColor = "#3b82f6";
                el.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
              }
            }}
            onBlur={() => {
              const el = document.querySelector("[data-input-wrapper]") as HTMLElement;
              if (el) {
                el.style.borderColor = error ? "#ef4444" : "#2a2a2a";
                el.style.boxShadow = "none";
              }
            }}
            data-input-wrapper=""
          >
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://yourwebsite.com"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "16px 20px",
                fontSize: "16px",
                color: "#f5f5f5",
                caretColor: "#3b82f6",
              }}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0 24px",
                background: "#3b82f6",
                border: "none",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                transition: "background 0.2s, transform 0.1s",
                borderRadius: "0 11px 11px 0",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
              Analyze →
            </button>
          </div>
          {error && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "13px",
                color: "#ef4444",
                textAlign: "left",
                paddingLeft: "4px",
              }}
            >
              {error}
            </p>
          )}
        </motion.form>

        {/* Trust line */}
        <motion.p
          {...fadeUp(0.8)}
          style={{ fontSize: "12px", color: "#555", marginBottom: "80px" }}
        >
          No login. No credit card. Just your URL.
        </motion.p>

        {/* Social proof strip */}
        <motion.div
          {...fadeUp(1.0)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            flexWrap: "wrap",
            rowGap: "8px",
          }}
        >
          {[
            "Built for agencies and growing businesses",
            "Average score improvement: +47 points",
            "500+ pages analyzed",
          ].map((item, i) => (
            <span key={item} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span
                  style={{
                    width: "1px",
                    height: "12px",
                    background: "#333",
                    margin: "0 16px",
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={{ fontSize: "12px", color: "#555" }}>{item}</span>
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
        @media (max-width: 480px) {
          button[type="submit"] {
            padding: 0 16px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </main>
  );
}

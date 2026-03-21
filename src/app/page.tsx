"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isValidUrl, normalizeUrl } from "@/lib/utils";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const normalized = normalizeUrl(url);
    if (!isValidUrl(normalized)) {
      setError("Please enter a valid URL (e.g. https://yoursite.com)");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(normalized)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 580, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        {/* Eyebrow */}
        <motion.span {...fadeUp(0)} style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 20,
        }}>
          Free Homepage Audit
        </motion.span>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.2)} style={{
          fontSize: "clamp(40px, 8vw, 64px)",
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          textAlign: "center",
          marginBottom: 20,
        }}>
          See what your homepage<br />could be.
        </motion.h1>

        {/* Subheadline */}
        <motion.p {...fadeUp(0.4)} style={{
          fontSize: 18,
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          textAlign: "center",
          marginBottom: 36,
          maxWidth: 480,
        }}>
          Paste your URL. In 15 seconds, see your page rebuilt for SEO and
          conversions — side by side with your original.
        </motion.p>

        {/* URL Input */}
        <motion.div {...fadeUp(0.6)} style={{ width: "100%", marginBottom: 8 }}>
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex",
              borderRadius: 12,
              border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
              backgroundColor: "var(--surface)",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(46,139,122,0.2)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = error ? "var(--danger)" : "var(--border)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="https://yourwebsite.com"
              style={{
                flex: 1,
                padding: "16px 20px",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 16,
                fontFamily: "inherit",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "16px 24px",
                backgroundColor: "var(--accent)",
                color: "#fff",
                border: "none",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                cursor: loading ? "wait" : "pointer",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: loading ? 0.8 : 1,
                transition: "background-color 0.15s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Going...
                </>
              ) : "Analyze →"}
            </motion.button>
          </motion.div>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, paddingLeft: 4 }}>
              {error}
            </p>
          )}
        </motion.div>

        {/* Trust line */}
        <motion.p {...fadeUp(0.8)} style={{
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 64,
        }}>
          No login. No credit card. Just your URL.
        </motion.p>

        {/* Social proof */}
        <motion.div {...fadeUp(1.0)} style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {[
            "Built for agencies and growing businesses",
            "Average score improvement: +47 points",
            "500+ pages analyzed",
          ].map((item, i) => (
            <span key={i} style={{
              fontSize: 12,
              color: "#555",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span style={{ color: "#333" }}>✦</span> {item}
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

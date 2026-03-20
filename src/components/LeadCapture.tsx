"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadCaptureProps {
  url: string;
}

export function LeadCapture({ url }: LeadCaptureProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || name.trim().length < 2) { setError("Name is required."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Valid email is required."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), url }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://wmax.co").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "var(--surface-2, #1e1e1e)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-primary)",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div style={{
      backgroundColor: "#111111",
      borderTop: "1px solid var(--border)",
      padding: "72px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "rgba(34,197,94,0.15)",
                  border: "2px solid #22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                ✓
              </motion.div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>
                You&apos;re on the list.
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                We&apos;ll review your analysis and reach out within 24 hours.<br />
                Check your inbox for a confirmation.
              </p>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  While you wait, share this with someone whose homepage could use some work →
                </p>
                <button
                  onClick={handleShare}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {copied ? "✓ Link copied!" : "Share w.max →"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Eyebrow */}
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
                Ready for the real thing?
              </p>

              {/* Headline */}
              <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: 16 }}>
                Let&apos;s build this for your business.
              </h2>

              {/* Subtext */}
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
                Your optimized page exists as a preview right now. We&apos;ll turn it
                into a live, indexed, converting homepage — built by hand, not auto-generated.
              </p>

              {/* Value props */}
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 36 }}>
                {[
                  "Delivered in 5 business days",
                  "Full SEO implementation included",
                  "One revision round, no surprises",
                ].map((prop) => (
                  <span key={prop} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--accent)" }}>✦</span> {prop}
                  </span>
                ))}
              </div>

              {/* Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  style={inputStyle}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  style={inputStyle}
                />
                <input
                  type="url"
                  value={url}
                  readOnly
                  style={{ ...inputStyle, color: "var(--text-muted)", cursor: "default" }}
                />

                {error && (
                  <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    height: 56,
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: "var(--accent)",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading ? "wait" : "pointer",
                    opacity: loading ? 0.8 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {loading ? "Sending..." : "→  Let's Talk"}
                </motion.button>

                <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 4 }}>
                  We respond within 1 business day. No sales pressure.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  url: string;
}

export default function LeadCapture({ url }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  function validate(): boolean {
    let valid = true;
    if (name.trim().length < 2) {
      setNameError("Please enter your name.");
      valid = false;
    } else {
      setNameError("");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email.");
      valid = false;
    } else {
      setEmailError("");
    }
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), url }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Unknown error");
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText("https://auto-phil.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "#f5f5f5",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <section
      style={{
        background: "#111111",
        borderTop: "1px solid #1a1a1a",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
        {/* Eyebrow */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#3b82f6",
            marginBottom: "16px",
          }}
        >
          Ready for the real thing?
        </p>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "#f5f5f5",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Let&apos;s build this for your business.
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontSize: "17px",
            color: "#a0a0a0",
            lineHeight: 1.7,
            marginBottom: "36px",
          }}
        >
          Your optimized page exists as a preview right now. We&apos;ll turn it
          into a live, indexed, converting homepage — built by hand, not
          auto-generated.
        </p>

        {/* Value props */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}
        >
          {[
            "Delivered in 5 business days",
            "Full SEO implementation included",
            "One revision round, no surprises",
          ].map((v) => (
            <span
              key={v}
              style={{
                fontSize: "13px",
                color: "#a0a0a0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#3b82f6" }}>✦</span> {v}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: nameError ? "#ef4444" : "#2a2a2a",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = nameError ? "#ef4444" : "#2a2a2a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {nameError && (
                  <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{nameError}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: emailError ? "#ef4444" : "#2a2a2a",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = emailError ? "#ef4444" : "#2a2a2a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {emailError && (
                  <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{emailError}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={url}
                  readOnly
                  style={{
                    ...inputStyle,
                    color: "#555",
                    cursor: "default",
                    borderColor: "#1e1e1e",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "56px",
                  background: loading ? "#2563eb" : "#3b82f6",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.2s",
                  marginTop: "4px",
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
                      ◌
                    </span>
                    Sending...
                  </>
                ) : (
                  "→  Let's Talk"
                )}
              </button>

              {submitError && (
                <p style={{ fontSize: "13px", color: "#ef4444", textAlign: "center" }}>
                  {submitError}
                </p>
              )}

              <p style={{ fontSize: "12px", color: "#444", textAlign: "center" }}>
                We respond within 1 business day. No sales pressure.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  width: "64px",
                  height: "64px",
                  background: "rgba(34,197,94,0.15)",
                  border: "2px solid #22c55e",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  margin: "0 auto 24px",
                  color: "#22c55e",
                }}
              >
                ✓
              </motion.div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#f5f5f5",
                  marginBottom: "12px",
                }}
              >
                You&apos;re on the list.
              </h3>
              <p style={{ fontSize: "15px", color: "#a0a0a0", lineHeight: 1.7, marginBottom: "32px" }}>
                We&apos;ll review your analysis and reach out within 24 hours.
                Check your inbox for a confirmation.
              </p>
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "12px" }}>
                While you wait, share this with someone whose homepage could use some work →
              </p>
              <button
                onClick={handleShare}
                style={{
                  background: "#1e1e1e",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  color: copied ? "#22c55e" : "#a0a0a0",
                  padding: "10px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {copied ? "✓ Link copied!" : "Share this tool"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

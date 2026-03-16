"use client";

import { CheckmarkFilled, ArrowRight } from "@carbon/icons-react";

interface Props {
  url: string;
}

const VALUE_PROPS = [
  "30-minute strategy call, no obligation",
  "We'll walk through your specific analysis",
  "Leave with a clear action plan, whether you work with us or not",
];

const BOOKING_URL = "https://meetings-na2.hubspot.com/zack-whitlock";

export default function LeadCapture({ url: _url }: Props) {
  return (
    <section
      style={{
        background: "#060606",
        borderTop: "1px solid #141414",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        {/* Eyebrow */}
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#14c38e",
            marginBottom: "18px",
          }}
        >
          Ready for the real thing?
        </p>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            marginBottom: "18px",
          }}
        >
          {"Book a free strategy call."}
        </h2>

        {/* Body */}
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          {"We'll walk through your analysis, answer your questions, and map out exactly what it would take to get your site ranking and converting — no sales pressure, no obligation."}
        </p>

        {/* Value props */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "48px",
          }}
        >
          {VALUE_PROPS.map((v) => (
            <span
              key={v}
              style={{
                fontSize: "13px",
                color: "#888",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <CheckmarkFilled size={14} style={{ color: "#14c38e", flexShrink: 0, marginTop: "2px" }} />
              {v}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            height: "56px",
            background: "#14c38e",
            border: "none",
            borderRadius: "4px",
            color: "#060606",
            fontSize: "15px",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.01em",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#0fa677")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#14c38e")}
        >
          Book Your Free Call <ArrowRight size={16} />
        </a>

        <p style={{ fontSize: "12px", color: "#333", textAlign: "center", marginTop: "14px" }}>
          30 minutes. No pitch. Just answers.
        </p>
      </div>
    </section>
  );
}

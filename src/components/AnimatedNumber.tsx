"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  from: number;
  to: number;
  duration: number;
  color?: string;
  fontSize?: number;
}

export function AnimatedNumber({ from, to, duration, color, fontSize = 48 }: AnimatedNumberProps) {
  const [value, setValue] = useState(from);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, duration]);

  return (
    <span style={{ color, fontSize, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
}

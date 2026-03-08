"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  from: number;
  to: number;
  duration: number;
  color?: string;
}

export default function AnimatedNumber({ from, to, duration, color }: AnimatedNumberProps) {
  const [value, setValue] = useState(from);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = null;

    function step(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [from, to, duration]);

  return (
    <span style={{ color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
  );
}

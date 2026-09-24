"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  /** e.g. "10K+", "100K+", "15+" — parsed into a numeric target and suffix. */
  value: string;
  className?: string;
  durationMs?: number;
};

function parseValue(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);

  if (!match) {
    return { target: 0, suffix: value, prefix: "" };
  }

  const [, numeric, suffix] = match;
  return { target: parseFloat(numeric), suffix, prefix: "" };
}

export default function AnimatedCounter({
  value,
  className = "",
  durationMs = 1600,
}: AnimatedCounterProps) {
  const { target, suffix } = parseValue(value);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, durationMs]);

  const isDecimal = target % 1 !== 0;
  const formatted = isDecimal
    ? display.toFixed(1)
    : Math.round(display).toLocaleString();

  return (
    <span ref={elementRef} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}

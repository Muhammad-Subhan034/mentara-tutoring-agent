"use client";

import { useRef, type ElementType, type ReactNode } from "react";

/**
 * Wraps a card/tile in a subtle pointer-driven tilt plus a sheen that tracks
 * the cursor, using the `.tilt-card` primitive in globals.css. Mouse-only —
 * touch input skips it entirely since there's no hover to drive the effect.
 * `glow` lets a caller tint the sheen/border with its own accent color
 * (e.g. var(--correct)) instead of the default highlighter.
 */
export default function TiltCard({
  children,
  className,
  as: Tag = "div",
  glow,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  glow?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);

  function handleMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--tilt-x", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--tilt-y", `${(px - 0.5) * 8}deg`);
    el.style.setProperty("--sheen-x", `${px * 100}%`);
    el.style.setProperty("--sheen-y", `${py * 100}%`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={glow ? ({ "--tilt-glow": glow } as React.CSSProperties) : undefined}
      className={`tilt-card ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

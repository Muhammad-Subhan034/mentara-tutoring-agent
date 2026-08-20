"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A trailing highlighter-colored accent dot that follows the pointer with a
 * slight lag — like the tip of a highlighter marker. Fine-pointer devices
 * only, never replaces or hides the native cursor, and stays off entirely
 * under prefers-reduced-motion since it's purely decorative motion tied to
 * every mouse move.
 */
export default function ChalkCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const dot = dotRef.current;
    if (!dot) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });
    const quickX = gsap.quickTo(dot, "x", { duration: 0.45, ease: "power3.out" });
    const quickY = gsap.quickTo(dot, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;

    function onMove(e: MouseEvent) {
      quickX(e.clientX);
      quickY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, input, textarea, select, [role='button']");
      gsap.to(dot, { scale: interactive ? 2.2 : 1, duration: 0.3, ease: "power2.out" });
    }

    function onLeave() {
      shown = false;
      gsap.to(dot, { opacity: 0, duration: 0.3 });
    }

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] h-2.5 w-2.5 rounded-full bg-highlighter opacity-0 mix-blend-screen"
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Thin highlighter-colored scroll-progress bar pinned to the very top edge. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quickTo = gsap.quickTo(bar, "scaleX", {
      duration: reduceMotion ? 0 : 0.15,
      ease: "power1.out",
    });

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      quickTo(max > 0 ? doc.scrollTop / max : 0);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]" aria-hidden="true">
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-highlighter" />
    </div>
  );
}

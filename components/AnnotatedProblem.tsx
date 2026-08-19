"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnnotatedProblem() {
  const circleRef = useRef<SVGPathElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const wrongLineRef = useRef<HTMLDivElement>(null);
  const fixedLineRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const circle = circleRef.current;
    const check = checkRef.current;
    if (!circle || !check) return;

    const circleLen = circle.getTotalLength();
    const checkLen = check.getTotalLength();

    if (reduceMotion) {
      gsap.set(circle, { strokeDashoffset: 0 });
      gsap.set(check, { strokeDashoffset: 0, opacity: 1 });
      gsap.set(fixedLineRef.current, { opacity: 1 });
      gsap.set(noteRef.current, { opacity: 1 });
      return;
    }

    gsap.set(circle, { strokeDasharray: circleLen, strokeDashoffset: circleLen });
    gsap.set(check, { strokeDasharray: checkLen, strokeDashoffset: checkLen, opacity: 0 });
    gsap.set(fixedLineRef.current, { opacity: 0, y: 6 });
    gsap.set(noteRef.current, { opacity: 0, y: 6 });

    const tl = gsap.timeline({ delay: 0.6 });
    tl.to(circle, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" })
      .to(noteRef.current, { opacity: 1, y: 0, duration: 0.4 }, "-=0.1")
      .to(wrongLineRef.current, { opacity: 0.35, duration: 0.5 }, "+=0.5")
      .to(fixedLineRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .to(check, { opacity: 1, strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");

    const failsafe = window.setTimeout(() => {
      if (tl.progress() < 1) tl.progress(1);
    }, 4000);

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm rounded-sm border border-chalk/15 bg-board-raised p-6 shadow-[6px_6px_0_rgba(242,201,76,0.15)]">
      <p className="font-mono text-[11px] uppercase tracking-widest text-chalk-dim">
        Worked problem
      </p>
      <p className="mt-3 font-display text-2xl text-chalk">2x + 5 = 13</p>

      <div className="relative mt-5">
        <div ref={wrongLineRef} className="font-mono text-sm text-chalk-dim">
          x = 9
        </div>
        <svg
          className="pointer-events-none absolute -left-3 -top-2 h-10 w-24 overflow-visible"
          viewBox="0 0 100 40"
        >
          <path
            ref={circleRef}
            d="M8,20 C6,8 30,2 55,4 C82,6 96,14 92,22 C88,32 55,38 28,34 C10,31 4,26 8,20 Z"
            fill="none"
            stroke="var(--flagged)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        ref={noteRef}
        className="mt-1 font-hand text-lg leading-none text-flagged"
        style={{ transform: "rotate(-2deg)" }}
      >
        check your subtraction
      </div>

      <div ref={fixedLineRef} className="mt-4 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0">
          <path
            ref={checkRef}
            d="M4 13 L10 19 L20 6"
            fill="none"
            stroke="var(--correct)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-mono text-sm text-correct">x = 4 — correct</span>
      </div>
    </div>
  );
}

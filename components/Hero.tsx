"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import AnnotatedProblem from "./AnnotatedProblem";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const masks = rootRef.current?.querySelectorAll<HTMLElement>(".mask i") ?? [];
    const rest = rootRef.current?.querySelectorAll<HTMLElement>("[data-hero-fade]") ?? [];

    if (reduceMotion) return;

    gsap.set(masks, { yPercent: 110 });
    gsap.set(rest, { opacity: 0, y: 16 });

    document.documentElement.style.overflow = "hidden";
    const release = () => {
      document.documentElement.style.overflow = "";
    };

    const tl = gsap.timeline({ delay: 0.15, onComplete: release });
    tl.to(masks, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.045 });
    tl.fromTo(
      rest,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
      "-=0.6"
    );

    const failsafe = window.setTimeout(() => {
      if (tl.progress() < 1) tl.progress(1);
      release();
    }, 2500);

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      release();
    };
  }, []);

  return (
    <section ref={rootRef} className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
      <div className="grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p
            data-hero-fade
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-chalk/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-chalk-dim"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-highlighter" />
            Never gives the answer outright
          </p>
          <h1 className="font-display text-5xl italic leading-[1.05] tracking-tight text-chalk sm:text-6xl md:text-7xl">
            <span className="mask">
              <i>Find the gap.</i>
            </span>
            <br />
            <span className="mask">
              <i className="text-highlighter">Close it Socratically.</i>
            </span>
          </h1>
          <p
            data-hero-fade
            className="mt-7 max-w-md text-lg leading-relaxed text-chalk-dim"
          >
            Mentara diagnoses exactly which concept a student is shaky on, then
            teaches it the way a good tutor does — one guiding question at a
            time, never the answer up front.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/diagnostic"
              className="rounded-sm bg-highlighter px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-board transition-transform hover:-translate-y-0.5"
            >
              Take the diagnostic →
            </Link>
            <Link
              href="/progress"
              className="rounded-sm border border-chalk/25 px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-chalk transition-colors hover:bg-board-raised"
            >
              View mastery map
            </Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <AnnotatedProblem />
        </div>
      </div>
    </section>
  );
}

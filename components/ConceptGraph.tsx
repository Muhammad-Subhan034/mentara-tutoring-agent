"use client";

import { useEffect, useRef } from "react";
import { TOPICS } from "@/lib/curriculum";

type Node = { x: number; y: number; r: number };

/**
 * Signature background moment: a faint constellation of the topics Mentara
 * actually teaches, orbiting a central node — the same diagnose -> topic ->
 * mastery shape as the product itself, drawn as chalk lines instead of a
 * generic decorative pattern. Fixed, full-viewport, pointer-events none;
 * painted early in <body> so real content (which carries its own
 * bg-board / bg-board-raised backgrounds) naturally sits on top of it.
 */
export default function ConceptGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const topicCount = TOPICS.length;

    let width = 0;
    let height = 0;
    let center: Node = { x: 0, y: 0, r: 4 };
    let nodes: Node[] = [];
    let raf = 0;
    let resizeTimer = 0;
    const start = performance.now();
    const DRAW_MS = 1700;

    function layout() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = width * 0.78;
      const cy = height * 0.3;
      center = { x: cx, y: cy, r: 4 };
      const radius = Math.min(width, height) * 0.24;
      nodes = Array.from({ length: topicCount }, (_, i) => {
        const angle = (i / topicCount) * Math.PI * 2 - Math.PI / 2;
        return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, r: 2.5 };
      });
    }

    function render(now: number) {
      ctx!.clearRect(0, 0, width, height);
      const t = reduceMotion ? 1 : Math.min(1, (now - start) / DRAW_MS);
      const eased = 1 - Math.pow(1 - t, 3);

      ctx!.lineWidth = 1;
      ctx!.strokeStyle = "rgba(238, 241, 234, 0.13)";

      nodes.forEach((n, i) => {
        // Spoke from the central node out to this topic.
        const spokeT = Math.max(0, Math.min(1, eased * topicCount - i * 0.45));
        ctx!.beginPath();
        ctx!.moveTo(center.x, center.y);
        ctx!.lineTo(center.x + (n.x - center.x) * spokeT, center.y + (n.y - center.y) * spokeT);
        ctx!.stroke();

        // Ring segment connecting adjacent topics.
        const next = nodes[(i + 1) % nodes.length];
        const ringT = Math.max(0, Math.min(1, eased * topicCount - i * 0.45 - 0.35));
        ctx!.beginPath();
        ctx!.moveTo(n.x, n.y);
        ctx!.lineTo(n.x + (next.x - n.x) * ringT, n.y + (next.y - n.y) * ringT);
        ctx!.stroke();
      });

      [center, ...nodes].forEach((n, i) => {
        const pulse = reduceMotion ? 0.5 : (Math.sin(now / 1400 + i * 1.1) + 1) / 2;
        const drift = reduceMotion ? 0 : Math.sin(now / 2200 + i) * 3;
        ctx!.beginPath();
        ctx!.fillStyle =
          i === 0 ? "rgba(242, 201, 76, 0.6)" : `rgba(238, 241, 234, ${0.2 + pulse * 0.3})`;
        ctx!.arc(n.x, n.y + drift, n.r + (i === 0 ? 1.5 : 0), 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function frame(now: number) {
      render(now);
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }

    layout();
    frame(performance.now());

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        layout();
        if (reduceMotion) render(performance.now());
      }, 150);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}

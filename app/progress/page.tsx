"use client";

import { useEffect, useState } from "react";
import { getStudentId } from "@/lib/student";
import MasteryHeatmap, { type MasteryRow } from "@/components/charts/MasteryHeatmap";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

export default function ProgressPage() {
  const [rows, setRows] = useState<MasteryRow[] | null>(null);

  useEffect(() => {
    const studentId = getStudentId();
    fetch(`/api/progress?studentId=${studentId}`)
      .then((r) => r.json())
      .then((d) => setRows(d.mastery));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Reveal as="p" className="font-mono text-[11px] uppercase tracking-widest text-highlighter">
        Progress
      </Reveal>
      <Reveal as="h1" variant="clip-wipe" delay={0.05} className="mt-3 font-display text-4xl italic text-chalk md:text-5xl">
        Your mastery map.
      </Reveal>
      <Reveal as="p" delay={0.15} className="mt-4 max-w-2xl text-chalk-dim">
        Computed live from every diagnostic answer and tutor checkpoint tied to
        this browser — take the diagnostic and a checkpoint or two to see it
        fill in.
      </Reveal>
      <Reveal delay={0.2} variant="scale-in" className="mt-10">
        <TiltCard className="rounded-sm border border-chalk/15 bg-board-raised p-7">
          {rows ? (
            <MasteryHeatmap rows={rows} />
          ) : (
            <p className="text-chalk-dim">Loading…</p>
          )}
        </TiltCard>
      </Reveal>
    </main>
  );
}

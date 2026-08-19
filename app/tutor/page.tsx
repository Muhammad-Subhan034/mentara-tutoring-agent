import { Suspense } from "react";
import TutorChat from "@/components/TutorChat";

export default function TutorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-widest text-highlighter">Tutor</p>
      <h1 className="mt-3 font-display text-4xl italic text-chalk md:text-5xl">
        Ask it anything. It'll ask back.
      </h1>
      <p className="mt-4 max-w-2xl text-chalk-dim">
        Every session is randomly assigned one of two hint styles — that's the
        A/B test behind{" "}
        <a href="/experiments" className="underline decoration-chalk-dim/40 underline-offset-4">
          /experiments
        </a>
        .
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="text-chalk-dim">Loading…</div>}>
          <TutorChat />
        </Suspense>
      </div>
    </main>
  );
}

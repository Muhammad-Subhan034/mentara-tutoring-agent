import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Diagnose",
    body: "A short quiz spanning five algebra topics tags exactly which concepts are shaky, not just a pass/fail score.",
  },
  {
    n: "02",
    title: "Guided practice",
    body: "The tutor asks the next question instead of answering — hints escalate only when you're genuinely stuck.",
  },
  {
    n: "03",
    title: "Mastery check",
    body: "A follow-up problem on the same concept confirms it actually landed, not just that the chat felt helpful.",
  },
  {
    n: "04",
    title: "Track & adapt",
    body: "Mastery per topic updates live, and two explanation styles are A/B tested against real quiz-score improvement.",
  },
];

export default function ProcessSection() {
  return (
    <section className="border-t border-chalk/10 bg-board-raised/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal as="p" className="font-mono text-[11px] uppercase tracking-widest text-highlighter">
          How it teaches
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-chalk/10 bg-chalk/10 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06} className="bg-board p-6">
              <span className="font-display text-3xl italic text-chalk-dim">{step.n}</span>
              <h3 className="mt-4 font-display text-xl text-chalk">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-chalk-dim">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

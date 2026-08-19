import Link from "next/link";
import Reveal from "./Reveal";

const FEATURES = [
  {
    href: "/diagnostic",
    title: "Diagnostic quiz",
    body: "Ten questions across five topics, each tagged to a concept — wrong answers reveal exactly where to focus.",
  },
  {
    href: "/tutor",
    title: "Socratic tutor",
    body: "A chat that asks the next question instead of answering — grounded in a strict no-answer-outright system prompt.",
  },
  {
    href: "/progress",
    title: "Mastery map",
    body: "A live heatmap of every topic, computed from real diagnostic and practice results, not a vanity progress bar.",
  },
  {
    href: "/experiments",
    title: "Style experiment",
    body: "Two hint styles, A/B tested against whether the next answer is actually correct — a real learning-outcome metric.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal as="p" className="font-mono text-[11px] uppercase tracking-widest text-highlighter">
        What's actually running
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.href} delay={i * 0.05}>
            <Link
              href={feature.href}
              className="group block h-full rounded-sm border border-chalk/12 bg-board-raised p-7 transition-colors hover:border-chalk/25"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl text-chalk">{feature.title}</h3>
                <span className="font-mono text-chalk-dim transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-chalk-dim">{feature.body}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

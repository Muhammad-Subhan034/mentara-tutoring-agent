import DiagnosticQuiz from "@/components/DiagnosticQuiz";

export default function DiagnosticPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-widest text-highlighter">Diagnostic</p>
      <h1 className="mt-3 font-display text-4xl italic text-chalk md:text-5xl">
        Ten questions, five topics.
      </h1>
      <p className="mt-4 max-w-2xl text-chalk-dim">
        Answers are tagged by concept, not just scored right or wrong — so the
        tutor knows exactly where to start.
      </p>
      <div className="mt-10">
        <DiagnosticQuiz />
      </div>
    </main>
  );
}

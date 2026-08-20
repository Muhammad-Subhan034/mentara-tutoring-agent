"use client";

import { useState } from "react";
import Link from "next/link";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/curriculum";
import { getStudentId } from "@/lib/student";
import Reveal from "@/components/Reveal";

type MasteryResult = {
  topic: string;
  label: string;
  correct: number;
  total: number;
  rate: number | null;
};

export default function DiagnosticQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<MasteryResult[] | null>(null);

  const answeredCount = Object.keys(answers).length;

  async function handleSubmit() {
    setSubmitting(true);
    const studentId = getStudentId();
    const payload = {
      studentId,
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })),
    };
    const res = await fetch("/api/diagnostic/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setResults(data.mastery);
    setSubmitting(false);
  }

  if (results) {
    const weakest = [...results]
      .filter((r) => r.rate !== null)
      .sort((a, b) => (a.rate ?? 1) - (b.rate ?? 1))[0];

    return (
      <Reveal variant="scale-in" className="rounded-sm border border-chalk/15 bg-board-raised p-8">
        <h2 className="font-display text-2xl text-chalk">Here's where you stand</h2>
        <div className="mt-6 space-y-3">
          {results.map((r) => (
            <div key={r.topic} className="flex items-center justify-between gap-4">
              <span className="font-mono text-sm text-chalk-dim">{r.label}</span>
              <span className="font-mono text-sm text-chalk">
                {r.correct}/{r.total} {r.rate !== null && `(${Math.round(r.rate * 100)}%)`}
              </span>
            </div>
          ))}
        </div>
        {weakest && (
          <div className="mt-6 rounded-sm border border-highlighter/30 bg-highlighter-soft px-4 py-3 text-sm text-highlighter">
            Weakest area: <strong>{weakest.label}</strong>. Head to the tutor to work on it.
          </div>
        )}
        <Link
          href={weakest ? `/tutor?topic=${weakest.topic}` : "/tutor"}
          className="btn-sheen mt-6 inline-block rounded-sm bg-highlighter px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-board"
        >
          Start tutoring →
        </Link>
      </Reveal>
    );
  }

  return (
    <div className="space-y-6">
      {DIAGNOSTIC_QUESTIONS.map((q, i) => (
        <Reveal key={q.id} delay={i * 0.04} className="rounded-sm border border-chalk/15 bg-board-raised p-6">
          <p className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">
            Question {i + 1} of {DIAGNOSTIC_QUESTIONS.length}
          </p>
          <p className="mt-2 font-display text-xl text-chalk">{q.prompt}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {q.choices.map((choice, idx) => {
              const selected = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                  className={`rounded-sm border px-4 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? "border-highlighter bg-highlighter/15 text-chalk"
                      : "border-chalk/15 text-chalk-dim hover:border-chalk/30"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </Reveal>
      ))}

      <button
        onClick={handleSubmit}
        disabled={answeredCount < DIAGNOSTIC_QUESTIONS.length || submitting}
        className="btn-sheen w-full rounded-sm bg-highlighter px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-board disabled:opacity-40"
      >
        {submitting
          ? "Scoring…"
          : `Submit (${answeredCount}/${DIAGNOSTIC_QUESTIONS.length} answered)`}
      </button>
    </div>
  );
}

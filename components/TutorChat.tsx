"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TOPICS, getQuestionsByTopic, type Topic } from "@/lib/curriculum";
import { getStudentId } from "@/lib/student";
import type { Style } from "@/app/api/tutor/chat/route";

type Message = { role: "user" | "assistant"; content: string };

const OPENERS: Record<Topic, string> = {
  linear: "I'm stuck on solving for x in a linear equation.",
  quadratic: "I don't get how to solve a quadratic equation.",
  exponents: "I'm confused about simplifying exponents.",
  fractions: "I keep messing up fraction arithmetic.",
  "word-problems": "Word problems trip me up — I don't know where to start.",
};

export default function TutorChat() {
  const params = useSearchParams();
  const initialTopic = (params.get("topic") as Topic) ?? "linear";

  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [style] = useState<Style>(() => (Math.random() < 0.5 ? "socratic" : "worked_example"));
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkpoint, setCheckpoint] = useState<ReturnType<typeof getQuestionsByTopic>[number] | null>(
    null
  );
  const [checkpointResult, setCheckpointResult] = useState<"correct" | "incorrect" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const studentId = useMemo(() => getStudentId(), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, checkpoint]);

  async function send(content: string) {
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);

    const res = await fetch("/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, style, messages: next }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    setBusy(false);

    const userTurns = next.filter((m) => m.role === "user").length;
    if (userTurns === 3 && !checkpoint) {
      const qs = getQuestionsByTopic(topic);
      setCheckpoint(qs[Math.floor(Math.random() * qs.length)]);
    }
  }

  async function answerCheckpoint(idx: number) {
    if (!checkpoint) return;
    const correct = idx === checkpoint.correctIndex;
    setCheckpointResult(correct ? "correct" : "incorrect");
    await fetch("/api/tutor/outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, topic, style, followUpCorrect: correct }),
    });
  }

  function resetTopic(next: Topic) {
    setTopic(next);
    setMessages([]);
    setCheckpoint(null);
    setCheckpointResult(null);
  }

  return (
    <div className="rounded-sm border border-chalk/15 bg-board-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-chalk/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">Topic</span>
          <select
            value={topic}
            onChange={(e) => resetTopic(e.target.value as Topic)}
            className="rounded-sm border border-chalk/20 bg-board px-2 py-1 text-sm text-chalk"
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wide text-chalk-dim/60">
          session style: {style === "socratic" ? "questions only" : "worked example"}
        </span>
      </div>

      <div ref={scrollRef} className="max-h-[420px] min-h-[280px] space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <button
            onClick={() => send(OPENERS[topic])}
            className="rounded-sm border border-dashed border-chalk/25 px-4 py-2 text-sm text-chalk-dim hover:border-chalk/40"
          >
            "{OPENERS[topic]}"
          </button>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-sm px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-highlighter/20 text-chalk"
                : "bg-board text-chalk-dim border border-chalk/10"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && <p className="font-mono text-xs text-chalk-dim">Mentara is thinking…</p>}

        {checkpoint && (
          <div className="rounded-sm border border-highlighter/30 bg-highlighter-soft p-4">
            <p className="font-mono text-[11px] uppercase tracking-wide text-highlighter">
              Checkpoint — does it click?
            </p>
            <p className="mt-2 font-display text-lg text-chalk">{checkpoint.prompt}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {checkpoint.choices.map((c, idx) => (
                <button
                  key={idx}
                  disabled={checkpointResult !== null}
                  onClick={() => answerCheckpoint(idx)}
                  className="rounded-sm border border-chalk/20 px-3 py-2 text-left text-sm text-chalk hover:border-highlighter disabled:opacity-60"
                >
                  {c}
                </button>
              ))}
            </div>
            {checkpointResult && (
              <p
                className={`mt-3 font-mono text-sm ${
                  checkpointResult === "correct" ? "text-correct" : "text-flagged"
                }`}
              >
                {checkpointResult === "correct"
                  ? "Correct — logged to the experiment as a win for this style."
                  : "Not quite — logged too. Every real outcome counts, not just the wins."}
              </p>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) send(input.trim());
        }}
        className="flex gap-3 border-t border-chalk/10 px-6 py-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Explain what you tried…"
          className="flex-1 rounded-sm border border-chalk/20 bg-board px-3 py-2 text-sm text-chalk outline-none focus:border-highlighter"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-sm bg-highlighter px-4 py-2 font-mono text-[12px] uppercase tracking-wide text-board disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

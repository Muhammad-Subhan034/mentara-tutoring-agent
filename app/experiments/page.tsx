import StatTile from "@/components/charts/StatTile";
import { listPracticeOutcomes } from "@/lib/db";

type ExperimentResult = {
  style: "socratic" | "worked_example";
  n: number;
  correct: number;
  conversionRate: number | null;
};

async function getExperiments(): Promise<{ results: ExperimentResult[]; totalLogged: number }> {
  const outcomes = await listPracticeOutcomes();
  const styles: Array<"socratic" | "worked_example"> = ["socratic", "worked_example"];
  const results = styles.map((style) => {
    const rows = outcomes.filter((o) => o.style === style);
    const correct = rows.filter((o) => o.followUpCorrect).length;
    return { style, n: rows.length, correct, conversionRate: rows.length ? correct / rows.length : null };
  });
  return { results, totalLogged: outcomes.length };
}

const STYLE_LABEL: Record<string, string> = {
  socratic: "Questions only",
  worked_example: "Worked example when stuck",
};

export const dynamic = "force-dynamic";

export default async function ExperimentsPage() {
  const { results, totalLogged } = await getExperiments();
  const [a, b] = results;
  const leader =
    a.conversionRate !== null && b.conversionRate !== null
      ? a.conversionRate === b.conversionRate
        ? null
        : a.conversionRate > b.conversionRate
          ? a
          : b
      : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-widest text-highlighter">Experiments</p>
      <h1 className="mt-3 font-display text-4xl italic text-chalk md:text-5xl">
        Two teaching styles, measured.
      </h1>
      <p className="mt-4 max-w-2xl text-chalk-dim">
        Every tutor session is randomly assigned a hint style. The metric that
        matters isn&rsquo;t how the chat felt — it&rsquo;s whether the
        checkpoint question right after was actually answered correctly.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {results.map((r) => (
          <StatTile
            key={r.style}
            label={STYLE_LABEL[r.style]}
            value={r.conversionRate !== null ? `${Math.round(r.conversionRate * 100)}%` : "—"}
            hint={`${r.correct}/${r.n} checkpoints correct`}
            tone={leader?.style === r.style ? "good" : "neutral"}
          />
        ))}
      </div>

      <div className="mt-8 rounded-sm border border-chalk/15 bg-board-raised p-6 text-sm text-chalk-dim">
        {totalLogged < 20 ? (
          <p>
            Only <strong className="text-chalk">{totalLogged}</strong> checkpoints logged so
            far — real enough to be honest, too few to call a winner yet. Go
            answer a few in <a href="/tutor" className="underline">/tutor</a>{" "}
            to add data.
          </p>
        ) : leader ? (
          <p>
            <strong className="text-correct">{STYLE_LABEL[leader.style]}</strong> is currently
            ahead across {totalLogged} logged checkpoints.
          </p>
        ) : (
          <p>Dead even across {totalLogged} logged checkpoints.</p>
        )}
      </div>
    </main>
  );
}

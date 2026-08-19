export default function StatTile({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "critical";
  hint?: string;
}) {
  const toneClass =
    tone === "good" ? "text-correct" : tone === "critical" ? "text-flagged" : "text-chalk";

  return (
    <div className="rounded-sm border border-chalk/15 bg-board-raised p-5">
      <p className="font-mono text-[11px] uppercase tracking-wide text-chalk-dim">{label}</p>
      <p className={`mt-2 font-body text-3xl font-semibold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-chalk-dim">{hint}</p>}
    </div>
  );
}

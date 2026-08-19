"use client";

// Interpolates flagged (low) -> highlighter (mid) -> correct (high) in OKLCH-ish
// simple RGB lerp — good enough for this magnitude-with-valence encoding.
function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]: number[]) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const FLAGGED = "#eb7a6f";
const HIGHLIGHTER = "#f2c94c";
const CORRECT = "#6fcf97";

function colorForRate(rate: number): string {
  const [c1, c2] = rate < 0.5 ? [FLAGGED, HIGHLIGHTER] : [HIGHLIGHTER, CORRECT];
  const t = rate < 0.5 ? rate / 0.5 : (rate - 0.5) / 0.5;
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  return rgbToHex(rgb1.map((v, i) => lerp(v, rgb2[i], t)));
}

export type MasteryRow = {
  topic: string;
  label: string;
  correct: number;
  total: number;
  rate: number | null;
};

export default function MasteryHeatmap({ rows }: { rows: MasteryRow[] }) {
  return (
    <div>
      <div className="space-y-3">
        {rows.map((r) => {
          const hasData = r.rate !== null;
          const pct = hasData ? Math.round((r.rate as number) * 100) : 0;
          const color = hasData ? colorForRate(r.rate as number) : "#3a4a41";
          return (
            <div key={r.topic} className="flex items-center gap-3">
              <span className="w-40 shrink-0 font-mono text-[12px] uppercase tracking-wide text-chalk-dim">
                {r.label}
              </span>
              <div className="relative h-7 flex-1 rounded-[2px] bg-board">
                <div
                  className="h-7 rounded-r-[4px] transition-[width] duration-500 ease-out"
                  style={{ width: hasData ? `${Math.max(pct, 3)}%` : "100%", background: color }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-[12px] text-chalk">
                {hasData ? `${r.correct}/${r.total} (${pct}%)` : "no data"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-2 text-[11px] text-chalk-dim">
        <span
          className="h-2 w-24 rounded-full"
          style={{ background: `linear-gradient(90deg, ${FLAGGED}, ${HIGHLIGHTER}, ${CORRECT})` }}
        />
        <span>weaker → stronger</span>
      </div>
    </div>
  );
}

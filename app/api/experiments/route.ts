import { NextResponse } from "next/server";
import { listPracticeOutcomes } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const outcomes = await listPracticeOutcomes();

  const styles: Array<"socratic" | "worked_example"> = ["socratic", "worked_example"];
  const results = styles.map((style) => {
    const rows = outcomes.filter((o) => o.style === style);
    const correct = rows.filter((o) => o.followUpCorrect).length;
    return {
      style,
      n: rows.length,
      correct,
      conversionRate: rows.length ? correct / rows.length : null,
    };
  });

  return NextResponse.json({ results, totalLogged: outcomes.length });
}

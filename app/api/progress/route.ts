import { NextRequest, NextResponse } from "next/server";
import { listDiagnosticAttempts, listPracticeOutcomes } from "@/lib/db";
import { TOPICS, type Topic } from "@/lib/curriculum";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId") ?? undefined;
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const diagnostics = await listDiagnosticAttempts(studentId);
  const practice = (await listPracticeOutcomes()).filter((p) => p.studentId === studentId);

  const mastery = TOPICS.map((t) => {
    const dAttempts = diagnostics.filter((d) => d.topic === t.id);
    const pAttempts = practice.filter((p) => p.topic === t.id);
    const correct =
      dAttempts.filter((d) => d.correct).length + pAttempts.filter((p) => p.followUpCorrect).length;
    const total = dAttempts.length + pAttempts.length;
    return {
      topic: t.id as Topic,
      label: t.label,
      correct,
      total,
      rate: total ? correct / total : null,
    };
  });

  return NextResponse.json({ mastery });
}

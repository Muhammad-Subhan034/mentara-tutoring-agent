import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { DIAGNOSTIC_QUESTIONS, TOPICS, type Topic } from "@/lib/curriculum";
import { insertDiagnosticAttempt } from "@/lib/db";

export const runtime = "nodejs";

type Answer = { questionId: string; selectedIndex: number };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const studentId = body?.studentId as string | undefined;
  const answers = body?.answers as Answer[] | undefined;

  if (!studentId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "studentId and answers are required" }, { status: 400 });
  }

  const byTopic: Record<Topic, { correct: number; total: number }> = Object.fromEntries(
    TOPICS.map((t) => [t.id, { correct: 0, total: 0 }])
  ) as Record<Topic, { correct: number; total: number }>;

  const now = new Date().toISOString();

  for (const answer of answers) {
    const question = DIAGNOSTIC_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;
    const correct = answer.selectedIndex === question.correctIndex;
    byTopic[question.topic].total += 1;
    if (correct) byTopic[question.topic].correct += 1;

    await insertDiagnosticAttempt({
      id: randomUUID(),
      studentId,
      questionId: question.id,
      topic: question.topic,
      correct,
      createdAt: now,
    });
  }

  const mastery = TOPICS.map((t) => ({
    topic: t.id,
    label: t.label,
    correct: byTopic[t.id].correct,
    total: byTopic[t.id].total,
    rate: byTopic[t.id].total ? byTopic[t.id].correct / byTopic[t.id].total : null,
  }));

  return NextResponse.json({ mastery });
}

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { insertPracticeOutcome } from "@/lib/db";
import type { Topic } from "@/lib/curriculum";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const studentId = body?.studentId as string | undefined;
  const topic = body?.topic as Topic | undefined;
  const style = body?.style as "socratic" | "worked_example" | undefined;
  const followUpCorrect = body?.followUpCorrect as boolean | undefined;

  if (!studentId || !topic || !style || typeof followUpCorrect !== "boolean") {
    return NextResponse.json({ error: "studentId, topic, style, followUpCorrect required" }, { status: 400 });
  }

  await insertPracticeOutcome({
    id: randomUUID(),
    studentId,
    topic,
    style,
    followUpCorrect,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

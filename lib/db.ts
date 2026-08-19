import { neon } from "@neondatabase/serverless";
import type { Topic } from "./curriculum";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS diagnostic_attempts (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL,
          question_id TEXT NOT NULL,
          topic TEXT NOT NULL,
          correct BOOLEAN NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS practice_outcomes (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL,
          topic TEXT NOT NULL,
          style TEXT NOT NULL,
          follow_up_correct BOOLEAN NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return schemaReady;
}

export type DiagnosticAttempt = {
  id: string;
  studentId: string;
  questionId: string;
  topic: Topic;
  correct: boolean;
  createdAt: string;
};

export type PracticeOutcome = {
  id: string;
  studentId: string;
  topic: Topic;
  style: "socratic" | "worked_example";
  followUpCorrect: boolean;
  createdAt: string;
};

// In-memory fallback for local dev without DATABASE_URL configured.
const memDiagnostics: DiagnosticAttempt[] = [];
const memPractice: PracticeOutcome[] = [];

export async function insertDiagnosticAttempt(a: DiagnosticAttempt): Promise<void> {
  await ensureSchema();
  if (!sql) {
    memDiagnostics.push(a);
    return;
  }
  await sql`
    INSERT INTO diagnostic_attempts (id, student_id, question_id, topic, correct, created_at)
    VALUES (${a.id}, ${a.studentId}, ${a.questionId}, ${a.topic}, ${a.correct}, ${a.createdAt})
  `;
}

export async function listDiagnosticAttempts(studentId?: string): Promise<DiagnosticAttempt[]> {
  await ensureSchema();
  if (!sql) {
    return studentId ? memDiagnostics.filter((d) => d.studentId === studentId) : memDiagnostics;
  }
  const rows = studentId
    ? await sql`SELECT * FROM diagnostic_attempts WHERE student_id = ${studentId} ORDER BY created_at DESC`
    : await sql`SELECT * FROM diagnostic_attempts ORDER BY created_at DESC LIMIT 500`;
  return rows.map((r) => ({
    id: r.id as string,
    studentId: r.student_id as string,
    questionId: r.question_id as string,
    topic: r.topic as Topic,
    correct: r.correct as boolean,
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

export async function insertPracticeOutcome(p: PracticeOutcome): Promise<void> {
  await ensureSchema();
  if (!sql) {
    memPractice.push(p);
    return;
  }
  await sql`
    INSERT INTO practice_outcomes (id, student_id, topic, style, follow_up_correct, created_at)
    VALUES (${p.id}, ${p.studentId}, ${p.topic}, ${p.style}, ${p.followUpCorrect}, ${p.createdAt})
  `;
}

export async function listPracticeOutcomes(): Promise<PracticeOutcome[]> {
  await ensureSchema();
  if (!sql) return memPractice;
  const rows = await sql`SELECT * FROM practice_outcomes ORDER BY created_at DESC LIMIT 1000`;
  return rows.map((r) => ({
    id: r.id as string,
    studentId: r.student_id as string,
    topic: r.topic as Topic,
    style: r.style as PracticeOutcome["style"],
    followUpCorrect: r.follow_up_correct as boolean,
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

export const usingLiveDb = Boolean(sql);

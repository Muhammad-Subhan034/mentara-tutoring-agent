import { NextRequest, NextResponse } from "next/server";
import { hfChat } from "@/lib/hf";
import { TOPICS, type Topic } from "@/lib/curriculum";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };
export type Style = "socratic" | "worked_example";

function systemPrompt(topicLabel: string, style: Style): string {
  const base = `You are Mentara, a patient, encouraging math tutor. The student is working on: ${topicLabel}.

STRICT RULES — follow these exactly:
1. Never give the final numeric answer or a complete solved equation, even if the student asks directly or seems frustrated.
2. Respond with ONE guiding question or a small, specific hint that moves the student exactly one step closer.
3. If the student made an error, point at roughly WHERE it is ("check your second step") without correcting it for them.
4. Keep every response to 2-3 short sentences. No long lectures.
5. Warmly acknowledge correct reasoning before nudging toward the next step.`;

  if (style === "worked_example") {
    return `${base}
6. If the student seems stuck (says "I don't know", asks for the answer, or gets it wrong twice), show ONE fully worked example using DIFFERENT numbers than their problem, then ask them to apply the same steps to their own problem. Still never solve their exact problem for them.`;
  }

  return `${base}
6. If the student seems stuck (says "I don't know", asks for the answer, or gets it wrong twice), break your next hint into a smaller, more specific question rather than showing a worked example — keep it Socratic even when they're stuck.`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const topic = body?.topic as Topic | undefined;
  const style = (body?.style as Style | undefined) ?? "socratic";
  const messages = body?.messages as ChatMessage[] | undefined;

  const topicMeta = TOPICS.find((t) => t.id === topic);
  if (!topicMeta || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "topic and messages are required" }, { status: 400 });
  }

  const reply = await hfChat(
    [
      { role: "system", content: systemPrompt(topicMeta.label, style) },
      ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    ],
    { maxTokens: 180, temperature: 0.65 }
  );

  if (!reply) {
    return NextResponse.json(
      {
        reply:
          "I'm having trouble reaching the model right now — try again in a moment. (No HUGGINGFACE_API_TOKEN configured, or the call failed.)",
        degraded: true,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ reply, degraded: false });
}

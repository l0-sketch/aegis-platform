import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  appendMessage,
  buildSystemPrompt,
  createSession,
  fallbackAssistantReply,
  getSessionById,
  listDocuments,
  listSessions,
  searchDocuments
} from "@/lib/store";
import { Message } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    sessionId?: string;
    sessionName?: string;
    input?: string;
  };

  const userInput = (body.input ?? "").trim();
  if (!userInput) {
    return NextResponse.json({ error: "Input is required." }, { status: 400 });
  }

  let session = body.sessionId ? getSessionById(body.sessionId) : null;
  if (!session) {
    session = createSession(body.sessionName || "Primary Ops Thread");
  }

  const userMessage: Message = {
    id: randomUUID(),
    role: "user",
    content: userInput,
    timestamp: new Date().toISOString()
  };

  appendMessage(session.id, userMessage);

  const relevantDocuments = searchDocuments(userInput);
  const systemPrompt = buildSystemPrompt(relevantDocuments);
  const assistantReply = fallbackAssistantReply(userInput, relevantDocuments);

  const assistantMessage: Message = {
    id: randomUUID(),
    role: "assistant",
    content: assistantReply,
    timestamp: new Date().toISOString()
  };

  appendMessage(session.id, assistantMessage);

  return NextResponse.json({
    sessionId: session.id,
    session: session,
    messages: getSessionById(session.id)?.messages ?? [userMessage, assistantMessage],
    relevantDocuments,
    systemPrompt
  });
}

export async function GET() {
  return NextResponse.json({
    sessions: listSessions(),
    documents: listDocuments()
  });
}

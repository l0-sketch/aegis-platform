import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { addDocument, appendMessage, buildSystemPrompt, createSession, fallbackAssistantReply, listDocuments, listSessions, searchDocuments, upsertSession } from "@/lib/store";
import { DocumentEntry, Message, Session } from "@/lib/types";

const SYSTEM_MESSAGE = "S.C.I.O.N. is active.";

function parseBody<T>(request: Request): Promise<T> {
  return request.json() as Promise<T>;
}

export async function GET() {
  return NextResponse.json({
    sessions: listSessions(),
    documents: listDocuments()
  });
}

export async function POST(request: Request) {
  const body = await parseBody<{ sessionId?: string; input?: string; sessionName?: string; documents?: DocumentEntry[] }>(request);

  const sessionId = body.sessionId || createSession(body.sessionName || "New Research Thread").id;
  const session = listSessions().find((entry) => entry.id === sessionId) ?? createSession(body.sessionName || "New Research Thread");

  const userMessage: Message = {
    id: randomUUID(),
    role: "user",
    content: body.input || "",
    timestamp: new Date().toISOString()
  };

  const maybeSession = appendMessage(session.id, userMessage);
  if (!maybeSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const relevantDocuments = searchDocuments(body.input || "");
  const prompt = buildSystemPrompt(relevantDocuments);

  const assistantMessage: Message = {
    id: randomUUID(),
    role: "assistant",
    content: fallbackAssistantReply(body.input || "", relevantDocuments),
    timestamp: new Date().toISOString()
  };

  appendMessage(session.id, assistantMessage);

  return NextResponse.json({
    sessionId: session.id,
    assistant: assistantMessage,
    messages: maybeSession.messages,
    systemPrompt: prompt,
    relevantDocuments
  });
}

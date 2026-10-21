import { NextResponse } from "next/server";
import { addDocument, createSession, listDocuments, listSessions, searchDocuments } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ sessions: listSessions(), documents: listDocuments() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name : "New Session";
  const session = createSession(name);
  return NextResponse.json({ session });
}

import { NextResponse } from "next/server";
import { addDocument, listDocuments, searchDocuments } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json({ documents: listDocuments() });
  }

  return NextResponse.json({ documents: searchDocuments(query) });
}

export async function POST(request: Request) {
  const body = await request.json();

  const title = typeof body?.title === "string" ? body.title : "Untitled Note";
  const content = typeof body?.content === "string" ? body.content : "";
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string") : [];

  if (!content.trim()) {
    return NextResponse.json({ error: "Document content is required." }, { status: 400 });
  }

  const doc = addDocument({
    id: crypto.randomUUID(),
    title,
    content,
    uploadedAt: new Date().toISOString(),
    tags
  });

  return NextResponse.json({ document: doc });
}

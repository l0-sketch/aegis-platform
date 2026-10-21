import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { DocumentEntry, Message, Session } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_PATH = path.join(DATA_DIR, "sessions.json");
const DOCUMENTS_PATH = path.join(DATA_DIR, "documents.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function writeJson<T>(filePath: string, value: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

export function listSessions(): Session[] {
  return readJson<Session[]>(SESSIONS_PATH, []);
}

export function getSessionById(id: string): Session | null {
  const sessions = listSessions();
  return sessions.find((session) => session.id === id) ?? null;
}

export function createSession(name?: string): Session {
  const sessions = listSessions();
  const newSession: Session = {
    id: randomUUID(),
    name: name || `Session ${sessions.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  };
  sessions.unshift(newSession);
  writeJson(SESSIONS_PATH, sessions);
  return newSession;
}

export function upsertSession(session: Session) {
  const sessions = listSessions();
  const existingIndex = sessions.findIndex((entry) => entry.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.unshift(session);
  }

  writeJson(SESSIONS_PATH, sessions);
}

export function appendMessage(sessionId: string, message: Message) {
  const sessions = listSessions();
  const target = sessions.find((session) => session.id === sessionId);

  if (!target) {
    return null;
  }

  target.messages.push(message);
  target.updatedAt = new Date().toISOString();
  writeJson(SESSIONS_PATH, sessions);
  return target;
}

export function listDocuments(): DocumentEntry[] {
  return readJson<DocumentEntry[]>(DOCUMENTS_PATH, []);
}

export function addDocument(document: DocumentEntry) {
  const documents = listDocuments();
  documents.unshift(document);
  writeJson(DOCUMENTS_PATH, documents);
  return document;
}

export function searchDocuments(query: string): DocumentEntry[] {
  const q = query.toLowerCase();
  return listDocuments()
    .filter((entry) => {
      const haystack = `${entry.title} ${entry.content} ${entry.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 5);
}

export function buildSystemPrompt(documents: DocumentEntry[]) {
  const docContext = documents.length
    ? documents
        .map((doc) => `- ${doc.title}: ${doc.content.slice(0, 400)}`)
        .join("\n")
    : "- No project documents have been loaded yet.";

  return `You are S.C.I.O.N. (Scientific Cognitive Intelligence and Operations Network), an eccentric scientific genius and research partner.

Personality traits:
- Quirky, witty, analytical, and occasionally theatrical.
- Dry humor, clever analogies, and a dramatic appreciation for elegant solutions.
- You challenge assumptions respectfully, distinguish facts from speculation, and never pretend to have access you do not have.
- Keep answers concise when the question is simple and detailed when the problem is complex.
- If the user is wrong or making an unsupported claim, gently correct them without condescension.
- Treat the user as the owner of the research and decisions.

Style guidance:
- Use snippets of dry humor and occasional mock-dramatic flair.
- Be genuinely enthusiastic about interesting science, engineering, and research.
- Keep it natural and human, not robotic.
- If a problem is ordinary, answer directly rather than turning it into a monologue.

Current research context:
${docContext}

When giving answers, focus on clarity, evidence, and useful next steps.`;
}

export function fallbackAssistantReply(userInput: string, documents: DocumentEntry[] = []): string {
  const docSummary = documents.length
    ? `I found ${documents.length} relevant document(s) in the memory vault. The current thread seems to align with their themes, and I am incorporating that context.`
    : "No extra project documents are loaded yet, so this is being reasoned from the live conversation alone.";

  const lower = userInput.toLowerCase();
  const scientificSignal =
    /math|equation|physics|chem|biology|research|experiment|algorithm|proof|analysis|model|system|code|engineering|scientific/i.test(
      lower
    );

  const intro = scientificSignal
    ? "Excellent. The problem has entered the laboratory and is now being interrogated with proper scientific rigor."
    : "Understood. The matter is clear enough to proceed without unnecessary theatrics.";

  const body = `
${intro}

${docSummary}

Here is the short version: I would approach this by separating the signal from the noise, checking assumptions, and testing the most likely mechanism before committing to a conclusion. If the task is technical, I would prefer a minimal, testable hypothesis over a dramatic but unverified leap.

In practical terms, the useful next steps are:
1. Clarify the core objective and constraints.
2. Reduce the problem to a smaller, verifiable statement.
3. Test the most likely path before elaborating on side branches.
4. Capture the result, assumptions, and follow-up questions in a clean summary.

If you want, I can help turn this into a concrete plan, write the implementation, or analyze the underlying reasoning in more depth.

And yes, the experiment is still mildly suspicious. That is not a flaw in the method; it is simply the universe being unwilling to explain itself in plain English.
`;

  return body.trim();
}

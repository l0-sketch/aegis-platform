"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { DocumentEntry, Message, Session } from "@/lib/types";

const initialPrompt = "State your objective, and I will map the relevant variables before we proceed.";

export default function ChatInterface() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [docs, setDocs] = useState<DocumentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("Specimen Note");
  const [documentBody, setDocumentBody] = useState("");
  const [documentTags, setDocumentTags] = useState("research, archive");
  const endRef = useRef<HTMLDivElement | null>(null);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [activeSessionId, sessions]
  );

  async function loadSessions() {
    const response = await fetch("/api/sessions");
    const payload = await response.json();
    setSessions(payload.sessions ?? []);
    setDocs(payload.documents ?? []);

    if (!payload.sessions?.length) {
      const created = await createSession("Primary Signal Thread");
      setActiveSessionId(created.id);
      return;
    }

    const initial = payload.sessions[0];
    setActiveSessionId(initial.id);
  }

  async function createSession(name: string) {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const payload = await response.json();
    const session = payload.session as Session;
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.id);
    return session;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    setInput("");
    setIsLoading(true);

    let session = activeSession;
    if (!session) {
      session = await createSession("Live Signal Thread");
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session?.id,
        sessionName: session?.name,
        input: text
      })
    });

    const payload = await response.json();
    setSessions((current) => {
      const next = current.map((entry) => {
        if (entry.id !== payload.sessionId) return entry;
        return { ...entry, messages: payload.messages ?? entry.messages, updatedAt: new Date().toISOString() };
      });

      const hasSession = next.some((entry) => entry.id === payload.sessionId);
      if (!hasSession) {
        return [{
          id: payload.sessionId,
          name: session?.name ?? "Live Signal Thread",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: payload.messages ?? []
        }, ...next];
      }

      return next;
    });

    setDocs((current) => current.length ? current : payload.relevantDocuments ?? []);
    setIsLoading(false);
  }

  async function handleSaveDocument() {
    const trimmed = documentBody.trim();
    if (!trimmed) return;

    const response = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: documentTitle || "Specimen Note",
        content: trimmed,
        tags: documentTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      })
    });

    if (response.ok) {
      const payload = await response.json();
      setDocs((current) => [payload.document, ...current]);
      setDocumentBody("");
      setDocumentTitle("Specimen Note");
      setDocumentTags("research, archive");
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  return (
    <main className="scion-console">
      <aside className="operations-panel">
        <div className="brand-block">
          <div className="brand-name">S.C.I.O.N.</div>
          <div className="brand-subtitle">Scientific Cognitive Intelligence and Operations Network</div>
        </div>

        <div className="mission-card">
          <span className="mini-label">Core mission</span>
          <strong>Personal intelligence stack</strong>
          <small>Adaptive research, memory, and systems analysis</small>
        </div>

        <button className="primary-action" onClick={() => createSession(`Thread ${sessions.length + 1}`)} type="button">
          New signal stream
        </button>

        <div className="session-list">
          <div className="panel-header">Active threads</div>
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`session-item ${session.id === activeSessionId ? "active" : ""}`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span>{session.name}</span>
              <small>{session.messages.length} exchanges</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="signal-hub">
        <header className="hub-header">
          <div>
            <div className="mini-label">System state</div>
            <h1>{activeSession?.name ?? "Primary signal thread"}</h1>
          </div>
          <div className="signal-status">
            <span className="status-dot" />
            {isLoading ? "Processing" : "Online"}
          </div>
        </header>

        <div className="status-grid">
          <div className="metric-card">
            <span>Signal integrity</span>
            <strong>98.4%</strong>
          </div>
          <div className="metric-card">
            <span>Memory indexing</span>
            <strong>{docs.length}</strong>
          </div>
          <div className="metric-card">
            <span>Active streams</span>
            <strong>{sessions.length}</strong>
          </div>
        </div>

        <div className="chat-panel">
          {activeSession?.messages?.length ? (
            activeSession.messages.map((message) => (
              <div key={message.id} className={`message-row ${message.role}`}>
                <div className="message-bubble">
                  <div className="message-author">{message.role === "assistant" ? "S.C.I.O.N." : "Operator"}</div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-chip">Observation deck</div>
              <h2>Excellent. The problem has arrived with a proper sense of urgency.</h2>
              <p>{initialPrompt}</p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Submit a research brief, model prompt, technical question, or systems inquiry..."
            rows={4}
          />
          <div className="composer-actions">
            <button type="submit" className="primary-action" disabled={isLoading || !input.trim()}>
              {isLoading ? "Computing..." : "Transmit"}
            </button>
          </div>
        </form>
      </section>

      <aside className="vault-panel">
        <div className="panel-card">
          <div className="panel-header">Memory vault</div>
          {docs.length ? (
            docs.map((doc) => (
              <div key={doc.id} className="document-item">
                <strong>{doc.title}</strong>
                <p>{doc.content.slice(0, 170)}...</p>
              </div>
            ))
          ) : (
            <p className="empty-copy">No archive entries loaded yet.</p>
          )}
        </div>

        <div className="panel-card ingest-card">
          <div className="panel-header">Capture to archive</div>
          <input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            rows={5}
            value={documentBody}
            onChange={(e) => setDocumentBody(e.target.value)}
            placeholder="Record an observation, technical note, or research excerpt..."
          />
          <input
            value={documentTags}
            onChange={(e) => setDocumentTags(e.target.value)}
            placeholder="tags, comma separated"
          />
          <button className="secondary-action" type="button" onClick={handleSaveDocument}>
            Archive note
          </button>
        </div>
      </aside>
    </main>
  );
}

import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AppShell } from '@/components/app-shell';

export default async function AssistantPage() {
  const user = await requireAuth();
  if (!user) redirect('/login');

  const conversations = await prisma.conversation.findMany({
    where: { ownerId: user.id },
    include: { messages: true },
    orderBy: { updatedAt: 'desc' },
    take: 12,
  });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">AI workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-white">AEGIS assistant</h1>
        </div>

        <form action="/api/assistant" method="POST" className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">Prompt</label>
          <textarea name="question" rows={6} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" placeholder="Ask about a hypothesis, system design, experiment design, or technical issue..." />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select name="mode" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <option value="research">Research</option>
              <option value="engineering">Engineering</option>
              <option value="analysis">Analysis</option>
              <option value="writing">Writing</option>
            </select>
            <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">Send</button>
          </div>
        </form>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-4 text-lg font-semibold text-white">Conversation memory</h2>
          <div className="space-y-3">
            {conversations.length ? conversations.map((conversation) => (
              <div key={conversation.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-cyan-300">{conversation.title}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{conversation.mode}</span>
                </div>
                <div className="mt-2 space-y-2 text-sm text-slate-400">
                  {conversation.messages.slice(0, 3).map((message) => (
                    <div key={message.id}>
                      <span className="font-medium text-slate-200">{message.sender === 'assistant' ? 'Assistant' : 'User'}:</span> {message.content.slice(0, 140)}
                    </div>
                  ))}
                </div>
              </div>
            )) : <p className="text-sm text-slate-400">No assistant conversations yet.</p>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

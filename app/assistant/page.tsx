import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export default async function AssistantPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const conversations = await prisma.conversation.findMany({
    where: { ownerId: user.id },
    include: { messages: true },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">AI workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Assistant command center</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Back to dashboard</Link>
        </div>

        <form action="/api/assistant" method="POST" className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <label className="block text-sm font-medium text-slate-300">Prompt</label>
          <textarea name="question" rows={5} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" placeholder="Ask the AI to analyze a system, propose a hypothesis, or summarize a technical problem..." />
          <div className="flex gap-3">
            <select name="mode" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
              <option value="research">Research</option>
              <option value="engineering">Engineering</option>
              <option value="analysis">Analysis</option>
              <option value="writing">Writing</option>
            </select>
            <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">Send to AEGIS</button>
          </div>
        </form>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-4 text-lg font-semibold text-white">Conversation memory</h2>
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-cyan-300">{conversation.title}</span>
                  <span className="text-xs text-slate-400">{conversation.mode}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {conversation.messages.slice(0, 2).map((message) => (
                    <div key={message.id} className="mb-2 last:mb-0">
                      <span className="font-semibold text-slate-200">{message.sender === 'assistant' ? 'Assistant' : 'User'}:</span> {message.content.slice(0, 120)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { RedirectType, redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AppShell } from '@/components/app-shell';

export default async function DashboardPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const [stats, recentProjects, recentMessages, tasks] = await Promise.all([
    prisma.project.count({ where: { ownerId: user.id } }),
    prisma.project.findMany({ where: { ownerId: user.id }, take: 3, orderBy: { createdAt: 'desc' } }),
    prisma.conversation.findMany({ where: { ownerId: user.id }, take: 3, orderBy: { updatedAt: 'desc' } }),
    prisma.task.findMany({ where: { ownerId: user.id }, take: 5, orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Operational overview</p>
            <h1 className="mt-2 text-3xl font-bold text-white">AEGIS command dashboard</h1>
          </div>
          <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">Run workflow</button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Projects', value: stats.toString(), accent: 'cyan' },
            { label: 'Conversations', value: '12', accent: 'blue' },
            { label: 'Documents', value: '28', accent: 'violet' },
            { label: 'Tasks', value: tasks.length.toString(), accent: 'emerald' }
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</div>
              <div className="mt-4 text-3xl font-bold text-white">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Active projects</h2>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-cyan-300">{project.name}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{project.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{project.description || 'No description yet.'}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent conversations</h2>
            <div className="space-y-3">
              {recentMessages.map((conversation) => (
                <div key={conversation.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{conversation.title}</span>
                    <span className="text-xs text-slate-400">{conversation.mode}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{conversation.summary || 'No summary available.'}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

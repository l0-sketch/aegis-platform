import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AppShell } from '@/components/app-shell';
import { getDashboardSummary } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await requireAuth();
  if (!user) redirect('/login');

  const [summary, projects, conversations, tasks] = await Promise.all([
    getDashboardSummary(user.id),
    prisma.project.findMany({ where: { ownerId: user.id }, take: 4, orderBy: { updatedAt: 'desc' } }),
    prisma.conversation.findMany({ where: { ownerId: user.id }, take: 4, orderBy: { updatedAt: 'desc' } }),
    prisma.task.findMany({ where: { ownerId: user.id }, take: 5, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Operational overview</p>
            <h1 className="mt-2 text-3xl font-bold text-white">AEGIS dashboard</h1>
          </div>
          <a href="/assistant" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">Open assistant</a>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {[
            ['Projects', summary.projectCount],
            ['Conversations', summary.conversationCount],
            ['Documents', summary.documentCount],
            ['Tasks', summary.taskCount],
            ['Imports', summary.importCount],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Active projects</h2>
            <div className="space-y-3">
              {projects.length ? projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-cyan-300">{project.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{project.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{project.description || 'Project description not yet captured.'}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No projects created yet.</p>}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent conversations</h2>
            <div className="space-y-3">
              {conversations.length ? conversations.map((conversation) => (
                <div key={conversation.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-white">{conversation.title}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{conversation.mode}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{conversation.summary || 'No summary saved yet.'}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No conversation history yet.</p> }
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-4 text-lg font-semibold text-white">Current tasks</h2>
          <div className="space-y-3">
            {tasks.length ? tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div>
                  <div className="font-medium text-white">{task.title}</div>
                  <div className="text-sm text-slate-400">{task.description || 'No description provided.'}</div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">{task.status}</div>
              </div>
            )) : <p className="text-sm text-slate-400">No tasks created yet.</p>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

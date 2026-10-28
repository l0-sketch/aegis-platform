import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AppShell } from '@/components/app-shell';

export default async function ProjectsPage() {
  const user = await requireAuth();
  if (!user) redirect('/login');

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({ where: { ownerId: user.id }, orderBy: { updatedAt: 'desc' }, take: 10 }),
    prisma.task.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Execution</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Project management</h1>
          </div>
          <a href="/dashboard" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200">Overview</a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Projects</h2>
            <div className="space-y-3">
              {projects.length ? projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-cyan-300">{project.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{project.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{project.description || 'No description available.'}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No projects yet.</p>}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Tasks</h2>
            <div className="space-y-3">
              {tasks.length ? tasks.map((task) => (
                <div key={task.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-white">{task.title}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">{task.priority}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{task.description || 'No description provided.'}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No tasks yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

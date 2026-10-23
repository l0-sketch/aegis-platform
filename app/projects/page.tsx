import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export default async function ProjectsPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const projects = await prisma.project.findMany({ where: { ownerId: user.id }, orderBy: { updatedAt: 'desc' }, take: 8 });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Execution</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Project management</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Overview</Link>
        </div>

        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{project.name}</span>
                <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-300">{project.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{project.description || 'Project summary not yet written.'}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

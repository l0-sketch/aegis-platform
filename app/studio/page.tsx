import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export default async function StudioPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const projects = await prisma.project.findMany({ where: { ownerId: user.id }, orderBy: { updatedAt: 'desc' }, take: 5 });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Prototype platform</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Engineering studio</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Dashboard</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {['Problem framing', 'Requirements', 'Feasibility', 'Design', 'Verification', 'Delivery'].map((step) => (
            <div key={step} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">Phase</div>
              <div className="mt-3 text-lg font-semibold text-white">{step}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-4 text-lg font-semibold text-white">Current projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-cyan-300">{project.name}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{project.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{project.description || 'Project description pending.'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export default async function LabPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const entries = await prisma.notebookEntry.findMany({ where: { ownerId: user.id }, take: 5, orderBy: { createdAt: 'desc' } });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Experiment records</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Digital laboratory</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Overview</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['Hypothesis', 'Measurement', 'Analysis', 'Conclusion'].map((area) => (
            <div key={area} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{area}</div>
              <div className="mt-4 text-2xl font-bold text-white">Ready</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-4 text-lg font-semibold text-white">Notebook entries</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-cyan-300">{entry.title}</span>
                  <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{entry.hypothesis || 'No hypothesis recorded.'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

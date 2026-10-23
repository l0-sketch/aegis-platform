import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export default async function ResearchPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const documents = await prisma.document.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 12
  });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Knowledge base</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Research library</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Overview</Link>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center gap-3">
            <input className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" placeholder="Search notes, papers, equations, theories, prototypes..." />
            <button className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">Search</button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span>{doc.type}</span>
                  <span>{doc.version}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{doc.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{doc.summary || 'No summary stored.'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(doc.tags || '').split(',').filter(Boolean).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{tag}</span>
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

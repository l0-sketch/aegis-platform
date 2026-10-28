import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { AppShell } from '@/components/app-shell';

export default async function ResearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const user = await requireAuth();
  if (!user) redirect('/login');

  const q = (searchParams?.q || '').trim();

  const documents = await prisma.document.findMany({
    where: {
      ownerId: user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { tags: { contains: q } },
              { summary: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Knowledge base</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Research library</h1>
          </div>
          <a href="/dashboard" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200">Overview</a>
        </div>

        <form method="GET" className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search notes, tags, summaries..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
            />
            <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">Search</button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.length ? documents.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>{doc.type}</span>
                <span>v{doc.version}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{doc.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{doc.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(doc.tags || '').split(',').filter(Boolean).slice(0, 5).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{tag}</span>
                ))}
              </div>
            </div>
          )) : <div className="col-span-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-slate-400">No research documents found.</div>}
        </div>
      </div>
    </AppShell>
  );
}

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Advanced research at scale</p>
          <h1 className="mt-3 text-4xl font-bold text-white">AEGIS</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            A focused MVP for AI-assisted research, engineering planning, project management, and persistent knowledge capture.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950">Open workspace</Link>
            <Link href="/assistant" className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-100">Launch assistant</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['AI Assistant', 'Persistent prompt history, project-aware responses, and structured reasoning workflows.'],
            ['Research Library', 'Notes, documents, tags, summaries, and searchable project knowledge.'],
            ['Project Ops', 'Task planning, milestones, progress tracking, and engineering workflows.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

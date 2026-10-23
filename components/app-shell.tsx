import Link from 'next/link';
import { appNav } from '@/lib/nav';

export function AppShell({ children, userName }: { children: React.ReactNode; userName?: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 px-3 py-1.5 text-sm font-semibold text-cyan-400">AEGIS</div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Research & Engineering</div>
          </div>
          <div className="flex items-center gap-2">
            {userName ? <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200">{userName}</span> : null}
            <Link href="/login" className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-500 hover:text-cyan-300">Login</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:block">
          <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</div>
          <nav className="space-y-2">
            {appNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-soft">{children}</main>
      </div>
    </div>
  );
}

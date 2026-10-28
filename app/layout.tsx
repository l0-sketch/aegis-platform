import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/assistant', label: 'Assistant' },
  { href: '/research', label: 'Research' },
  { href: '/projects', label: 'Projects' },
  { href: '/settings', label: 'Settings' },
];

export function AppShell({ children, userName }: { children: ReactNode; userName?: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-300">
              AEGIS
            </Link>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Research & engineering</span>
          </div>
          <div className="flex items-center gap-3">
            {userName ? <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200">{userName}</span> : null}
            <Link href="/login" className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-500 hover:text-cyan-300">
              Login
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:block">
          <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Workspace</div>
          <nav className="space-y-2">
            {nav.map((item) => (
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

        <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_12px_40px_rgba(14,165,233,0.18)]">{children}</main>
      </div>
    </div>
  );
}

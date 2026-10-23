import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { requireAuth } from '@/lib/auth';
import { calculator } from '@/lib/calculator';

export default async function CalculationsPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const result = calculator.add(12, 8);

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Scientific tooling</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Calculations & simulations</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Overview</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Algebra</div>
            <div className="mt-4 text-2xl font-bold text-white">{result}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Physics</div>
            <div className="mt-4 text-2xl font-bold text-white">F = ma</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Units</div>
            <div className="mt-4 text-2xl font-bold text-white">1.5 m → 150 cm</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-4 text-lg font-semibold text-white">Scientific calculator</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Arithmetic</div>
              <div className="mt-3 text-sm text-slate-300">12 + 8 = {calculator.add(12, 8)}</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Statistics</div>
              <div className="mt-3 text-sm text-slate-300">Mean of [2, 4, 6] = {calculator.mean([2, 4, 6]).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

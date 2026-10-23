import Link from 'next/link';
import prisma from '@/lib/db';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { requireAuth } from '@/lib/auth';

export default async function LoginPage() {
  const user = await requireAuth();
  if (user) redirect('/dashboard', RedirectType.replace);

  return (
    <AppShell>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Access your AEGIS workspace</p>

        <form action="/api/auth/login" method="POST" className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input name="email" type="email" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <input name="password" type="password" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" required />
          </div>
          <button className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950">Sign in</button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          No account? <Link href="/register" className="text-cyan-300">Create one</Link>
        </p>
      </div>
    </AppShell>
  );
}

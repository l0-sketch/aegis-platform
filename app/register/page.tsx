import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

export default async function LoginPage() {
  const user = await requireAuth();
  if (user) redirect('/dashboard');

  return (
    <AppShell>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Access</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Sign in to AEGIS</h1>

        <form action="/api/auth/login" method="POST" className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input name="email" type="email" required className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950">Sign in</button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Need an account? <Link href="/register" className="text-cyan-300">Create one</Link>
        </p>
      </div>
    </AppShell>
  );
}

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { requireAuth } from '@/lib/auth';
import { redirect, RedirectType } from 'next/navigation';

export default async function RegisterPage() {
  const user = await requireAuth();
  if (user) redirect('/dashboard', RedirectType.replace);

  return (
    <AppShell>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">Begin your AEGIS research workspace.</p>

        <form action="/api/auth/register" method="POST" className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Name</label>
            <input name="name" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input name="email" type="email" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <input name="password" type="password" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100" required />
          </div>
          <button className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950">Register</button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-cyan-300">Sign in</Link>
        </p>
      </div>
    </AppShell>
  );
}

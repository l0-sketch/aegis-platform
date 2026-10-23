import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { requireAuth } from '@/lib/auth';

export default async function SettingsPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">System configuration</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Settings & administration</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Overview</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-3 text-lg font-semibold text-white">Appearance</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <div>Theme: Dark</div>
              <div>Accent: Cyan</div>
              <div>Notifications: Enabled</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-3 text-lg font-semibold text-white">AI integrations</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <div>Default model: Local reasoning</div>
              <div>Services: OpenAI / Anthropic / Ollama</div>
              <div>Connection status: not configured</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

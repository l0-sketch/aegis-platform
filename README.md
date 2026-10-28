import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export default async function SettingsPage() {
  const user = await requireAuth();
  if (!user) redirect('/login');

  const settings = await prisma.userSetting.findUnique({ where: { userId: user.id } });

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">System</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Settings & administration</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-3 text-lg font-semibold text-white">Appearance</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Theme: {settings?.theme || 'dark'}</li>
              <li>Accent: {settings?.accentColor || 'cyan'}</li>
              <li>Notifications: {settings?.notifications ? 'enabled' : 'disabled'}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="mb-3 text-lg font-semibold text-white">AI configuration</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Default model: {settings?.defaultModel || 'local fallback'}</li>
              <li>Research mode: {settings?.researchMode || 'deep'}</li>
              <li>OpenAI key: {process.env.OPENAI_API_KEY ? 'configured' : 'not configured'}</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

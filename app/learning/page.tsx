import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { requireAuth } from '@/lib/auth';

export default async function LearningPage() {
  const user = await requireAuth();
  if (!user) redirect('/login', RedirectType.replace);

  const courses = [
    'Physics',
    'Mathematics',
    'Chemistry',
    'Electronics',
    'Robotics',
    'Programming'
  ];

  return (
    <AppShell userName={user.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Structured learning</p>
            <h1 className="mt-2 text-3xl font-bold text-white">AEGIS learning system</h1>
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Overview</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <div key={course} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">Course {index + 1}</div>
              <h2 className="mt-3 text-xl font-semibold text-white">{course}</h2>
              <p className="mt-2 text-sm text-slate-400">Lessons, quizzes, and project-based learning modules are routed through the platform.</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

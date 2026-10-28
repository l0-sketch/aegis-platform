import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const tasks = await prisma.task.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return json({ ok: true, tasks });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to load tasks.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const body = await request.json();
    const title = String(body.title || '').trim();
    if (!title) return apiError('Task title is required.', 400);

    const task = await prisma.task.create({
      data: {
        title,
        description: body.description || '',
        status: body.status || 'todo',
        priority: body.priority || 'medium',
        ownerId: user.id,
      },
    });

    return json({ ok: true, task });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to create task.', 500);
  }
}

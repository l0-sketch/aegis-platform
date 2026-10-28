import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const projects = await prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    return json({ ok: true, projects });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to load projects.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) return apiError('Project name is required.', 400);

    const project = await prisma.project.create({
      data: {
        name,
        description: body.description || '',
        status: body.status || 'active',
        priority: body.priority || 'medium',
        budget: body.budget ? Number(body.budget) : null,
        ownerId: user.id,
      },
    });

    return json({ ok: true, project });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to create project.', 500);
  }
}

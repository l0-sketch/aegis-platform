import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const stats = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        projects: true,
        conversations: true,
        documents: true,
        tasks: true,
        imports: true
      }
    });

    return json({ ok: true, user: stats });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to fetch data.', 500);
  }
}

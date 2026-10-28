import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    const documents = await prisma.document.findMany({
      where: {
        ownerId: user.id,
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { summary: { contains: q } },
                { tags: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: 25,
    });

    return json({ ok: true, documents });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to load research library.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const body = await request.json();
    const title = String(body.title || '').trim();
    if (!title) return apiError('Document title is required.', 400);

    const document = await prisma.document.create({
      data: {
        title,
        type: body.type || 'note',
        folder: body.folder || 'general',
        summary: body.summary || 'No summary provided.',
        tags: body.tags || 'research',
        content: body.content || '',
        ownerId: user.id,
      },
    });

    return json({ ok: true, document });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to create research document.', 500);
  }
}

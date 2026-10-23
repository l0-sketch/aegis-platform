import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const settingsSchema = z.object({
  theme: z.string().optional(),
  accentColor: z.string().optional(),
  defaultModel: z.string().optional(),
  researchMode: z.string().optional(),
  notifications: z.boolean().optional()
});

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const settings = await prisma.userSetting.findUnique({ where: { userId: user.id } });
    return json({ ok: true, settings });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to fetch settings.', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const body = await request.json();
    const payload = settingsSchema.parse(body);

    const settings = await prisma.userSetting.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        theme: payload.theme || 'dark',
        accentColor: payload.accentColor || 'cyan',
        defaultModel: payload.defaultModel || 'local',
        researchMode: payload.researchMode || 'deep',
        notifications: payload.notifications ?? true
      },
      update: {
        ...(payload.theme ? { theme: payload.theme } : {}),
        ...(payload.accentColor ? { accentColor: payload.accentColor } : {}),
        ...(payload.defaultModel ? { defaultModel: payload.defaultModel } : {}),
        ...(payload.researchMode ? { researchMode: payload.researchMode } : {}),
        ...(payload.notifications !== undefined ? { notifications: payload.notifications } : {})
      }
    });

    return json({ ok: true, settings });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to update settings.', 500);
  }
}

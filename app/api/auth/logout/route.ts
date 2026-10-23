import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  try {
    clearAuthCookie();
    return json({ ok: true });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to logout.', 400);
  }
}

import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validators';
import { json, apiError } from '@/lib/api';
import { setAuthCookie, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
    if (!user) return apiError('Invalid email or password.', 401);

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) return apiError('Invalid email or password.', 401);

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    setAuthCookie(token);

    return json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to login.', 400);
  }
}

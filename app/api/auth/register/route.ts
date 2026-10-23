import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validators';
import { json, apiError } from '@/lib/api';
import { setAuthCookie, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
    if (existing) {
      return apiError('User with this email already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await prisma.user.create({
      data: {
        email: payload.email.toLowerCase(),
        name: payload.name,
        passwordHash
      }
    });

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    setAuthCookie(token);

    return json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to register user.', 400);
  }
}

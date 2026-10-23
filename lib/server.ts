import prisma from './db';
import { NextRequest } from 'next/server';

export async function ensureUserExists(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export function getJsonBody(request: NextRequest) {
  return request.json();
}

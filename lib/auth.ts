import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export const AUTH_COOKIE = 'aegis_session';

export function signToken(payload: SessionUser) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'change-me-in-production', {
    expiresIn: '7d'
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'change-me-in-production') as SessionUser;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().delete(AUTH_COOKIE);
}

export async function requireAuth() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

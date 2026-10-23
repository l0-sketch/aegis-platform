import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  priority: z.string().default('medium')
});

export const searchSchema = z.object({
  q: z.string().min(1),
  mode: z.string().optional().default('all')
});

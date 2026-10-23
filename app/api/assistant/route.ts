import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { buildFallbackAIResponse, createAiPrompt } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const body = await request.json();
    const question = String(body.question || '').trim();
    const mode = String(body.mode || 'research');

    if (!question) return apiError('Please provide a question.', 400);

    const recent = await prisma.conversation.findMany({
      where: { ownerId: user.id },
      include: { messages: true },
      orderBy: { updatedAt: 'desc' },
      take: 3
    });

    const projectContext = recent.flatMap((conversation) => conversation.messages.map((message) => message.content)).slice(0, 6);
    const prompt = createAiPrompt(question, projectContext);
    const response = buildFallbackAIResponse(prompt, mode);

    let conversation = await prisma.conversation.findFirst({ where: { ownerId: user.id, title: { contains: question.slice(0, 24) } } });
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          title: question.slice(0, 40) || 'New research thread',
          summary: 'Human-in-the-loop discussion created in AEGIS.',
          mode,
          ownerId: user.id
        }
      });
    }

    await prisma.message.createMany({
      data: [
        { conversationId: conversation.id, sender: 'user', content: question },
        { conversationId: conversation.id, sender: 'assistant', content: response.answer, citations: JSON.stringify(response.citations) }
      ]
    });

    return json({ ok: true, answer: response.answer, citations: response.citations });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to generate AI response.', 500);
  }
}

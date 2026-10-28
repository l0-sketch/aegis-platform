import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { generateAssistantResponse } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const body = await request.json();
    const question = String(body.question || '').trim();
    const mode = String(body.mode || 'research');

    if (!question) return apiError('A question is required for the assistant.', 400);

    const recentMessages = await prisma.message.findMany({
      where: {
        conversation: { ownerId: user.id },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    const recentContext = recentMessages.map((message) => message.content).slice(0, 8);

    const conversation = await prisma.conversation.upsert({
      where: {
        id: body.conversationId || 'new',
      },
      update: {
        title: question.slice(0, 60) || 'New AEGIS thread',
        summary: 'Live assistant response generated for this project context.',
        mode,
      },
      create: {
        title: question.slice(0, 60) || 'New AEGIS thread',
        summary: 'Live assistant response generated for this project context.',
        mode,
        ownerId: user.id,
      },
    });

    const response = await generateAssistantResponse({
      question,
      mode: mode as any,
      context: recentContext,
    });

    await prisma.message.createMany({
      data: [
        { conversationId: conversation.id, sender: 'user', content: question },
        { conversationId: conversation.id, sender: 'assistant', content: response.answer, citations: JSON.stringify(response.citations) },
      ],
    });

    return json({ ok: true, answer: response.answer, citations: response.citations, conversationId: conversation.id });
  } catch (error: any) {
    return apiError(error?.message || 'Unable to answer the request.', 500);
  }
}

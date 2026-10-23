import prisma from './db';

export async function getDashboardSummary(userId: string) {
  const [projectCount, conversationCount, documentCount, taskCount, imports] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.conversation.count({ where: { ownerId: userId } }),
    prisma.document.count({ where: { ownerId: userId } }),
    prisma.task.count({ where: { ownerId: userId } }),
    prisma.importRecord.findMany({ where: { ownerId: userId }, orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  return {
    projectCount,
    conversationCount,
    documentCount,
    taskCount,
    imports
  };
}

export function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

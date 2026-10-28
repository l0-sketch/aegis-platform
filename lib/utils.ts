import prisma from './db';

export async function getDashboardSummary(userId: string) {
  const [projectCount, conversationCount, taskCount, documentCount, importCount] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.conversation.count({ where: { ownerId: userId } }),
    prisma.task.count({ where: { ownerId: userId } }),
    prisma.document.count({ where: { ownerId: userId } }),
    prisma.importRecord.count({ where: { ownerId: userId } }),
  ]);

  return {
    projectCount,
    conversationCount,
    taskCount,
    documentCount,
    importCount,
  };
}

export function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

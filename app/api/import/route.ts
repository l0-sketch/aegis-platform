import prisma from '@/lib/db';
import { NextRequest } from 'next/server';
import { apiError, json } from '@/lib/api';
import { requireAuth } from '@/lib/auth';
import { inferSourceType, safeJson } from '@/lib/ai';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return apiError('Unauthorized', 401);

    const formData = await request.formData();
    const file = formData.get('file');
    const type = String(formData.get('type') || 'research');

    if (!file || typeof file === 'string') return apiError('A file upload is required.', 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = String(file.name || 'uploaded-file');
    const sourceType = inferSourceType(fileName);
    const safePath = join(process.cwd(), 'storage', 'imports', `${Date.now()}-${fileName}`);
    await writeFile(safePath, buffer);

    const record = await prisma.importRecord.create({
      data: {
        ownerId: user.id,
        fileName,
        fileType: sourceType,
        status: 'imported',
        summary: `Imported ${fileName} as ${sourceType}.`,
        metadata: safeJson({ type, sourceType, path: safePath })
      }
    });

    return json({ ok: true, importId: record.id, fileType: sourceType, path: safePath });
  } catch (error: any) {
    return apiError(error?.message || 'Import failed.', 500);
  }
}

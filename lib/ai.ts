import { z } from 'zod';

export function parseTextFromFile(fileName: string, buffer: Buffer) {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (ext === 'json') {
    return JSON.parse(buffer.toString('utf-8'));
  }

  if (['txt', 'md', 'csv'].includes(ext)) {
    return buffer.toString('utf-8');
  }

  if (ext === 'pdf') {
    return `PDF document: ${fileName} — text extraction is unsupported in the local demo runtime; the file was preserved and stored for later processing.`;
  }

  if (ext === 'docx') {
    return `DOCX document: ${fileName} — text extraction requires a document processor. The file was stored and metadata preserved.`;
  }

  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
    return `Image asset: ${fileName} — visual analysis is available after upload. The file was preserved and indexed.`;
  }

  if (ext === 'zip') {
    return `Archive bundle: ${fileName} — extracted for metadata review and file preservation.`;
  }

  return buffer.toString('utf-8');
}

export function buildFallbackAIResponse(prompt: string, mode = 'research') {
  const normalized = prompt.trim();
  const summary = `I’m working in ${mode} mode. Based on your input, the strongest next step is to structure the problem, gather evidence, validate assumptions, and turn the findings into a concrete testable plan.`;

  return {
    answer: `\n${summary}\n\nKey analysis:\n- clarify objective and constraints\n- collect and compare evidence\n- define assumptions and failure modes\n- derive actionable next actions\n- validate results with experiments or calculations\n\nUser request:\n${normalized || 'No specific prompt was provided.'}\n\nIf you configure an LLM provider, this response can be replaced with a live model output while preserving the same project context and tools.`,
    citations: [
      'Internal AEGIS reasoning pipeline',
      'Project memory and context',
      'Research library indexed content'
    ]
  };
}

export function inferSourceType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.md') || lower.endsWith('.txt')) return 'text';
  if (lower.endsWith('.zip')) return 'archive';
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image';
  return 'unknown';
}

export const createAiPrompt = (question: string, context: string[] = []) => {
  const contextText = context.length ? `Context:\n${context.join('\n')}` : 'Context: no project context provided.';
  return `${contextText}\n\nQuestion:\n${question}`;
};

export const safeJson = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return '{}';
  }
};
